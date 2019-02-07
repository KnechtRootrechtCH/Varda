import {observable, action, computed, runInAction} from 'mobx';
import { firestore } from '../config/fire'
import * as Moment from 'moment';

import AuthenticationStore from './AuthenticationStore';
import MetadataService from '../service/MetadataService';
import constants from '../config/constants';

class DownloadStatusStore {
    @observable item = null;
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
    @observable page = 1;
    lastItem = null;
    pageSize = 50;

    @action async loadStatus(item) {
        const key = MetadataService.getKey(item);
        this.loadStatusByKey(key);
    }

    @action async loadStatusById(mediaType, id) {
        this.loadStatusByKey(`${mediaType}:${id}`);
    }

    @action async loadStatusByKey(key) {
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
                        // console.debug('DownloadStatusStore.loadStatus() : item loaded/updated', data);
                        if (!data.status) {
                            data.status = '';
                        }
                        runInAction(() => {
                            this.items.set(key, data);
                        });

                    } else {
                        // console.debug('DownloadStatusStore.loadStatus() : not found', data);
                        runInAction(() => {
                            this.items.set(key, { status: null });
                        });
                    }
                });
        }
    }

    @action async resetStatusList () {
        this.list = new Map();
        this.page = 1;
        this.lastItem = null;
    }

    @action async loadStatusList() {
        console.debug('DownloadStatusStore.loadStatusList() : loading');
        runInAction(() => {
            this.loading = true;
            this.listParametersChanged = false;
        })

        let query = firestore
            .collection('users')
            .doc(this.dataUid)
            .collection('items')
            .orderBy(this.sortField, this.sortAscending ? 'asc' : 'desc')

        if (this.filter.status && this.filter.status !== 'none' && this.filter.status !== 'notReleased') {
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

        if (this.lastItem) {
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
                query = query.startAfter(this.lastItem.priority);
            }
        }

        query
        .onSnapshot((snapshot) => {
            runInAction(() => {
                snapshot.forEach(doc => {
                    this.lastItem = doc.data();
                    if (this.filterItem(this.lastItem)){
                        this.list.set(doc.id, this.lastItem);
                    } else {
                        this.list.delete(doc.id);
                    }

                });
                this.loading = false;
            });
        });
    }

    @action async updateStatus(item, status, previousStatus, comment, skipLog) {
        const key = MetadataService.getKey(item);
        const mediaType = MetadataService.getMediaType(item);
        const title = MetadataService.getTitle(item);
        const release = MetadataService.getReleaseDateMoment(item);
        const backdrop = item.backdrop_path;

        if (!previousStatus) {
            previousStatus = '';
        }

        if (!status) {
            return;
        }

        const data = {
            status: status,
            mediaType: mediaType,
            title: title ? title : '',
            release: release ? release.toDate() : new Date(0, 0, 0, 0, 0, 0, 0),
            backdrop: backdrop ? backdrop: '',
            timestamp: new Date(),
        };

        // console.debug('DownloadStatusStore.updateStatus()', key, data);
        const userDoc = firestore.collection('users').doc(this.dataUid);
        const statusCollection = userDoc.collection('items');
        statusCollection.doc(`${key}`).set(data,{
            merge: true
        });

        if (!skipLog) {
            // this.updateItemData(key, item);
            this.logTransaction(key, 'updateStatus', title, status, previousStatus, comment);
        }
    }

    @action async updateStatusByKey(key, title, status, previousStatus, comment, skipLog) {
        console.debug('DownloadStatusStore.updateStatusByKey()', key, title, status, previousStatus);
        if (!previousStatus) {
            previousStatus = '';
        }

        if (!status) {
            return;
        }

        const data = {
            status: status,
            timestamp: new Date(),
        };

        // console.debug('DownloadStatusStore.updateStatus()', key, data);
        const userDoc = firestore.collection('users').doc(this.dataUid);
        const statusCollection = userDoc.collection('items');
        statusCollection.doc(`${key}`).set(data,{
            merge: true
        });

        if (!skipLog) {
            // this.updateItemData(key, item);
            this.logTransaction(key, 'updateStatus', title, status, previousStatus, comment);
        }
    }

    @action async updatePriority(item, priority, previousPrority, comment, isImport) {
        const key = MetadataService.getKey(item);
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
            mediaType: mediaType,
            title: title ? title : '',
            release: release ? release.toDate() : new Date(0, 0, 0, 0, 0, 0, 0),
            backdrop: backdrop ? backdrop: '',
            timestamp: new Date(),
        },{
            merge: true
        });

        if (!isImport) {
            // this.updateItemData(key, item);
            this.logTransaction(key, 'updatePriority', title, priority, previousPrority, comment);
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
        });

        if (!isImport) {
            // this.updateItemData(key, item);
            this.logTransaction(key, 'updatePriority', title, priority, previousPrority, comment);
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

    @action async logTransaction(key, transaction, title, newValue, previousValue, comment){
        const date = new Date();
        const timestamp = Moment(date).format('YYYY-MM-DD HH-mm-ss-SSSS ZZ');
        comment = comment ? comment : '';
        previousValue = previousValue ? previousValue : '';
        // console.debug('DownloadStatusStore.logTransaction()', timestamp, transaction, newValue, comment);

        firestore.collection('users')
            .doc(this.dataUid)
            .collection('items')
            .doc(key)
            .collection('transactions')
            .doc(`${timestamp} - ${transaction}`)
            .set({
                timestamp: date,
                transaction: transaction,
                newValue: newValue,
                previousValue: previousValue,
                isAdminAction: this.isAdminAction,
                user: this.uid,
                userName: this.displayName,
                comment: comment,
            });

        firestore.collection('users')
            .doc(this.dataUid)
            .collection('transactions')
            .doc(`${timestamp} - ${transaction}`)
            .set({
                timestamp: date,
                transaction: transaction,
                newValue: newValue,
                previousValue: previousValue,
                isAdminAction: this.isAdminAction,
                user: this.uid,
                userName: this.displayName,
                key: key,
                title: title,
                comment: comment,
            });
    }

    @action loadNextPage() {
        runInAction(() => {
            this.page++;
        });
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
        return sortedList.slice(0, this.pageSize * this.page);
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
            comparison = aPriority < bPriority;
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
        if (this.searchString && this.searchString.length >= 2) {
            const itemTitle = item.title.toLowerCase();
            const searchString = this.searchString.toLowerCase();
            if (!itemTitle.includes(searchString)) {
                return false;
            }
        }
        if (this.filter.status === 'notReleased') {
            const now = Moment(new Date());
            const release = Moment(this.lastItem.release.toDate());
            if (now.isAfter(release)) {
                return false;
            }
        } else if (this.filter.status !== 'none') {
            const now = Moment(new Date());
            const release = Moment(this.lastItem.release.toDate());
            if (now.isBefore(release)) {
                return false;
            }
        }
        return true;
    }
}

// ensure single instance
const store = new DownloadStatusStore();
export default store;