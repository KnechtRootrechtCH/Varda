import {observable, action, computed, runInAction} from 'mobx';
import { firestore } from '../config/fire';
import * as Moment from 'moment';

import AuthenticationStore from './AuthenticationStore';
import DownloadHistoryStore from './DownloadHistoryStore';
import ErrorHandlingStore from './ErrorHandlingStore';
import MetadataService from '../service/MetadataService';
import constants from '../config/constants';

class DownloadStatusStore {
    @observable items = new Map();

    @observable list = new Map();
    @observable loading = false;
    @observable searchString = '';
    @observable filter = {
        mediaType: 'movie',
        status: null,
        prioriy: null,
    }
    @observable sortField = 'title';
    @observable sortAscending = true;
    @observable listParametersChanged = false;
    @observable hasMoreItems = null;
    lastItem = null;
    pageSize = 20;
    lastQuery = null;

    @action async loadStatus(item) {
        const key = MetadataService.getKey(item);
        this.loadStatusByKey(key);
    }

    @action async loadStatusById(mediaType, id) {
        this.loadStatusByKey(`${mediaType}:${id}`);
    }

    @action async loadStatusByKey(key) {
        console.debug('DownloadStatusStore.loadStatus()', key);
        const statusItem = this.items.get(key);
        if (!statusItem || statusItem.status === constants.STATUS.LOADING) {
            // console.debug('DownloadStatusStore.loadStatus() : loading', key, this.dataUid);
            this.items.set(key, { status: constants.STATUS.LOADING });
            firestore
                .collection('users')
                .doc(this.dataUid)
                .collection('items')
                .doc(key)
                .onSnapshot((doc) => {
                    const data = doc.data();
                    if (data) {
                        // console.debug('DownloadStatusStore.loadStatus() : item loaded/updated', doc.id);
                        if (!data.status) {
                            data.status = '';
                        }
                        runInAction(() => {
                            this.items.set(key, data);
                        });

                    } else {
                        // console.debug('DownloadStatusStore.loadStatus() : not found');
                        runInAction(() => {
                            this.items.set(key, { status: null });
                        });
                    }
                }, (error) => {
                    ErrorHandlingStore.handleError('firebase.status.item.load', error);
                });
        }
    }

    @action async resetStatusList() {
        this.list = new Map();
        this.lastItem = null;
        this.hasMoreItems = true;
    }

    @action async loadStatusList(noPaging) {
        if (this.lastQuery) {
            console.debug('DownloadStatusStore.loadStatusList() : unsubscribing from last query', this.lastQuery);
            this.lastQuery.onSnapshot(function (){
                // Unsubscribe
              });
        }
        console.debug('DownloadStatusStore.loadStatusList() : loading', this.filter);
        runInAction(() => {
            this.loading = true;
            this.listParametersChanged = false;
        })

        let query = firestore
            .collection('users')
            .doc(this.dataUid)
            .collection('items')

        if (this.sortField === 'priority') {
            query = query.orderBy(this.sortField, !this.sortAscending ? 'asc' : 'desc');
            query = query.orderBy('timestamp', this.sortAscending ? 'asc' : 'desc');
        } else {
            query = query.orderBy(this.sortField, this.sortAscending ? 'asc' : 'desc');
        }

        if (!noPaging) {
            query = query.limit(this.pageSize);
        }


        if (this.filter.status && this.filter.status !== 'none') {
            query = query.where('status', '==', this.filter.status);
        }
        if (this.filter.mediaType === 'movie') {
            query = query.where('mediaType', '==', 'movie');
        }
        if (this.filter.mediaType === 'tv') {
            query = query.where('mediaType', '==', 'tv');
        }
        if (this.filter.prioriy && this.filter !== 'none' && this.filter.status > 0) {
            query = query.where('prioriy', '==', this.filter.prioriy);
        }
        if (this.searchString && this.searchString.length > 0) {
            // TODO... how?
        }

        if (this.lastItem) {
            console.debug('DownloadStatusStore.loadStatusList() : loading', this.lastItem);
            if (this.sortField === 'timestamp') {
                query = query.startAfter(this.lastItem.timestamp.toDate());
            }
            if (this.sortField === 'release') {
                query = query.startAfter(this.lastItem.release.toDate());
            }
            if (this.sortField === 'title') {
                query = query.startAfter(this.lastItem.title);
            }
            if (this.sortField === 'priority') {
                query = query.startAfter(this.lastItem.priority, this.lastItem.timestamp.toDate());
            }
        }

        query
        .onSnapshot((snapshot) => {
            console.debug('DownloadStatusStore.loadStatusList() : snapshot', snapshot);
            runInAction(() => {
                snapshot.forEach(doc => {
                    this.lastItem = doc.data();
                    if (this.filterItem(this.lastItem)){
                        console.debug('DownloadStatusStore.loadStatusList() : add/update doc', this.lastItem);
                        this.list.set(doc.id, this.lastItem);
                    } else {
                        console.debug('DownloadStatusStore.loadStatusList() : remove doc', this.lastItem);
                        this.list.delete(doc.id);
                    }

                });
                this.hasMoreItems = !noPaging && this.pageSize === snapshot.size;
                this.loading = false;
            });
        }, (error) => {
            ErrorHandlingStore.handleError('firebase.status.list.load', error);
        });

        this.lastQuery = query;
    }

    @action async updateStatus(item, status, previousStatus, comment, skipLog) {
        const key = MetadataService.getKey(item);
        const id = item.id;
        const mediaType = MetadataService.getMediaType(item);
        const title = MetadataService.getTitle(item);
        const release = MetadataService.getReleaseDateMoment(item);
        const backdrop = item.backdrop_path;
        const timestamp = new Date();

        if (!previousStatus) {
            previousStatus = '';
        }

        if (!status) {
            return;
        }

        let listItem = this.list.get(id);
        if (listItem) {
            listItem.status = status;
        }

        const unreleased = status === constants.STATUS.QUEUED && Moment(timestamp).isBefore(release);

        const data = {
            status: unreleased ? constants.STATUS.NOT_RELEASED : status,
            id: id,
            mediaType: mediaType,
            title: title ? title : '',
            release: release ? release.toDate() : new Date(0, 0, 0, 0, 0, 0, 0),
            backdrop: backdrop ? backdrop: '',
            timestamp: timestamp,
        };

        console.debug('DownloadStatusStore.updateStatus()', key, data);
        const userDoc = firestore.collection('users').doc(this.dataUid);
        const statusCollection = userDoc.collection('items');
        statusCollection.doc(`${key}`).set(data,{
            merge: true
        })
        .then(() => {
            console.debug('DownloadStatusStore.updateStatus() : successfull');
        })
        .catch((error) => {
            ErrorHandlingStore.handleError('firebase.status.item.update', error);
        });

        if (!skipLog) {
            // this.updateItemData(key, item);
            DownloadHistoryStore.logTransaction(key, 'updateStatus', title, status, previousStatus, comment);
        }
    }

    @action async updateStatusByKey(key, title, status, previousStatus, comment, release, skipLog) {
        console.debug('DownloadStatusStore.updateStatusByKey()', key, title, status, previousStatus);
        const timestamp = new Date();

        if (!previousStatus) {
            previousStatus = '';
        }

        if (!status) {
            return;
        }

        let listItem = this.list.get(key);
        if (listItem) {
            listItem.status = status;
        }

        const unreleased = status === constants.STATUS.QUEUED && release && Moment(timestamp).isBefore(release);

        const data = {
            status: unreleased ? constants.STATUS.NOT_RELEASED : status,
            timestamp: timestamp,
        };

        // console.debug('DownloadStatusStore.updateStatus()', key, data);
        const userDoc = firestore.collection('users').doc(this.dataUid);
        const statusCollection = userDoc.collection('items');
        statusCollection.doc(`${key}`).set(data,{
            merge: true
        })
        .then(() => {
            console.debug('DownloadStatusStore.updateStatusByKey() : successfull');
        })
        .catch((error) => {
            ErrorHandlingStore.handleError('firebase.status.item.update', error);
        });

        if (!skipLog) {
            // this.updateItemData(key, item);
            DownloadHistoryStore.logTransaction(key, 'updateStatus', title, status, previousStatus, comment);
        }
    }

    @action async updateSeasonStatus(item, seasonNumber, episodeList, downloaded) {
        const key = `${item.mediaType}:${item.id}`;
        const timestamp = new Date();

        var episodes = {};

        episodeList.forEach((episode) => episodes[`${seasonNumber}:${episode.episode_number}`] = downloaded);

        const data = {
            episodes: episodes,
            timestamp: timestamp,
        };

        console.debug('DownloadStatusStore.updateSeasonStatus()', item, key, data);
        const userDoc = firestore.collection('users').doc(this.dataUid);
        const statusCollection = userDoc.collection('items');
        statusCollection.doc(`${key}`).set(data,{
            merge: true
        })
        .then(() => {
            console.debug('DownloadStatusStore.updateEpisodeStatus() : successfull');
        })
        .catch((error) => {
            ErrorHandlingStore.handleError('firebase.status.item.update', error);
        });

        const seasonNumberString = `${seasonNumber}`.padStart(2, '0');
        const subTarget = `S${seasonNumberString}`;
        const newStatus = downloaded ? constants.STATUS.DOWNLOADED : constants.STATUS.REDOWNLOAD;
        const previousStatus = downloaded ? constants.STATUS.QUEUED : constants.STATUS.DOWNLOADED;
        DownloadHistoryStore.logTransaction(key, 'updateStatus', item.title, newStatus, previousStatus, null, subTarget);
    }

    @action async updateEpisodeStatus(item, seasonNumber, episodeNumber, downloaded) {
        const key = `${item.mediaType}:${item.id}`;
        const timestamp = new Date();

        var episodes = {};
        episodes[`${seasonNumber}:${episodeNumber}`] = downloaded;

        const data = {
            episodes: episodes,
            timestamp: timestamp,
        };

        console.debug('DownloadStatusStore.updateEpisodeStatus()', item, key, data);
        const userDoc = firestore.collection('users').doc(this.dataUid);
        const statusCollection = userDoc.collection('items');
        statusCollection.doc(`${key}`).set(data,{
            merge: true
        })
        .then(() => {
            console.debug('DownloadStatusStore.updateEpisodeStatus() : successfull');
        })
        .catch((error) => {
            ErrorHandlingStore.handleError('firebase.status.item.update', error);
        });

        // const seasonNumberString = `${seasonNumber}`.padStart(2, '0');
        const episodeNumberString = `${episodeNumber}`.padStart(2, '0');
        const subTarget = `${seasonNumber}x${episodeNumberString}`;
        const newStatus = downloaded ? constants.STATUS.DOWNLOADED : constants.STATUS.REDOWNLOAD;
        const previousStatus = downloaded ? constants.STATUS.QUEUED : constants.STATUS.DOWNLOADED;
        DownloadHistoryStore.logTransaction(key, 'updateStatus', item.title, newStatus, previousStatus, null, subTarget);
    }

    @action async updatePriority(item, priority, previousPrority, comment, isImport) {
        const key = MetadataService.getKey(item);
        const id = item.id;
        const mediaType = MetadataService.getMediaType(item);
        const title = MetadataService.getTitle(item);
        const release = MetadataService.getReleaseDateMoment(item);
        const backdrop = item.backdrop_path;

        if (!previousPrority) {
            previousPrority = 0;
        }
        // console.debug('DownloadStatusStore.updatePriority()', key, priority);

        const userDoc = firestore.collection('users').doc(this.dataUid);
        const collection = userDoc.collection('items');
        collection.doc(`${key}`).set({
            priority: priority,
            id: id,
            mediaType: mediaType,
            title: title ? title : '',
            release: release ? release.toDate() : new Date(0, 0, 0, 0, 0, 0, 0),
            backdrop: backdrop ? backdrop: '',
            timestamp: new Date(),
        },{
            merge: true
        })
        .then(() => {
            console.debug('DownloadStatusStore.updatePriority() : successfull');
        })
        .catch((error) => {
            ErrorHandlingStore.handleError('firebase.status.priority.update', error);
        });

        if (!isImport) {
            // this.updateItemData(key, item);
            DownloadHistoryStore.logTransaction(key, 'updatePriority', title, priority, previousPrority, comment);
        }
    }

    @action async updatePriorityByKey(key, title, priority, previousPrority, comment, isImport) {
        if (!previousPrority) {
            previousPrority = 0;
        }
        // console.debug('DownloadStatusStore.updatePriority()', key, priority);

        const userDoc = firestore.collection('users').doc(this.dataUid);
        const collection = userDoc.collection('items');
        collection.doc(`${key}`).set({
            priority: priority,
            timestamp: new Date(),
        },{
            merge: true
        })
        .then(() => {
            console.debug('DownloadStatusStore.updatePriorityByKey() : successfull');
        })
        .catch((error) => {
            ErrorHandlingStore.handleError('firebase.status.priority.update', error);
        });

        if (!isImport) {
            // this.updateItemData(key, item);
            DownloadHistoryStore.logTransaction(key, 'updatePriority', title, priority, previousPrority, comment);
        }
    }

    @action async updateItemData(key, item) {
        const itemDataCollection = firestore.collection('users')
            .doc(this.dataUid)
            .collection('items')
            .doc(key)
            .collection('data');

        itemDataCollection
            .doc('movieDb')
            .set(item);
    }

    @action setSearchString(searchString) {
        this.searchString = searchString;
    }

    @action setFilter(filter) {
        runInAction(() => {
            this.filter = filter;
            this.listParametersChanged = true;
        });
    }

    @action setMediaTypeFilter(value) {
        runInAction(() => {
            this.filter.mediaType = value;
            this.listParametersChanged = true;
        });
    }

    @action setStatusFilter(value) {
        runInAction(() => {
            this.filter.status = value;
            this.listParametersChanged = true;
        });
    }

    @action setPriorityFilter(value) {
        runInAction(() => {
            this.filter.priority = value;
            this.listParametersChanged = true;
        });
    }

    @action setSorting(sortField, sortAscending) {
        runInAction(() => {
            this.sortField = sortField;
            this.sortAscending = sortAscending;
            this.listParametersChanged = true;
        });
    }

    @action setSortField(sortField) {
        runInAction(() => {
            this.sortField = sortField;
            this.listParametersChanged = true;
        });
    }

    @action setSortDirection(sortAscending) {
        runInAction(() => {
            this.sortAscending = sortAscending;
            this.listParametersChanged = true;
        });
    }

    @computed get listSorted () {
        const list = [...this.list];
        const sortedList = list.sort((a, b) => this.compare(a[1], b[1]));
        return sortedList; //.slice(0, this.pageSize * this.page);
    }

    @computed get uid () {
        return AuthenticationStore.uid;
    }

    @computed get dataUid () {
        return AuthenticationStore.dataUid;
    }

    @computed get isAdmin () {
        return AuthenticationStore.isAdmin;
    }

    @computed get displayName () {
        return AuthenticationStore.displayName;
    }

    @computed get isAdminAction(){
        return this.isAdmin && this.dataUid !== this.uid;
    }

    compare (a, b) {
        //Moment(item.release.toDate())
        let comparison = false;
        if (this.sortField === 'timestamp') {
            comparison = Moment(a.timestamp.toDate()) > Moment(b.timestamp.toDate());
        } else if (this.sortField === 'release') {
            comparison = Moment(a.release.toDate()) > Moment(b.release.toDate());
        } else if (this.sortField === 'title') {
            comparison = a.title > b.title;
        } else if (this.sortField === 'priority') {
            const aPriority = a.priority ? a.priority : 100;
            const bPriority = b.priority ? b.priority : 100;
            if (aPriority === bPriority) {
                comparison = Moment(a.timestamp.toDate()) > Moment(b.timestamp.toDate());
            } else {
                comparison = aPriority < bPriority;
            }
        }
        const before = comparison ? this.sortAscending : !this.sortAscending;
        const value = before ? 1 : -1;
        // console.debug('DownloadStatusStore.compare()', a, b, this.sortField, this.sortAscending, comparison, before, value);
        return value;
    }

    filterItem (item) {
        if (!this.lastItem.status || this.lastItem.status === constants.STATUS.REMOVED) {
            return false;
        }
        return true;
    }
}

// ensure single instance
const store = new DownloadStatusStore();
export default store;