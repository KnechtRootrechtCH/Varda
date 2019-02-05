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
    @observable filter = {
        mediaType: 'movie',
        status: null,
        prioriy: null,
    }
    @observable sortField = 'title';
    @observable sortAscending = true;
    pageSize = 100;
    lastItem = null;

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
        this.lastItem = null;
    }

    @action async loadStatusList() {
        console.debug('DownloadHistoryStore.loadHistory() : loading', this.dataUid, this.filter);
        runInAction(() => {
            this.loading = true;
        })
        let query = firestore
            .collection('users')
            .doc(this.dataUid)
            .collection('items')
            .orderBy(this.sortField, this.sortAscending ? 'asc' : 'desc')
        if (this.filter.status) {
            query = query.where('status', '==', this.filter.status);
        }
        if (this.filter.mediaType) {
            //query = query.where(this.filter.field, this.filter.operator, this.filter.value)
        }

        if (this.filter.prioriy) {
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
        .limit(this.pageSize)
        .onSnapshot((snapshot) => {
            runInAction(() => {
                snapshot.forEach(doc => {
                    this.lastItem = doc.data();
                    if (this.lastItem.status && this.lastItem.status !== constants.STATUS.REMOVED) {
                        this.list.set(doc.id, this.lastItem);
                    }

                });
                this.loading = false;
            });
        });
    }

    @action async updateStatus(item, status, previousStatus, comment, skipLog) {
        const key = MetadataService.getKey(item);
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

    @computed get listSorted () {
        let list = [...this.list].sort((a, b) => this.compare(a, b));
        if (this.sortAscending) {
            list = list.reverse();
        }
        return list;
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

    compare(a, b) {
        if (this.sortField === 'timestamp') {
            return a.timestamp < b.timestamp ? this.sortAscending : !this.sortAscending;
        }
        if (this.sortField === 'release') {
            return a.release < b.release ? this.sortAscending : !this.sortAscending;
        }
        if (this.sortField === 'title') {
            return a.title < b.title ? this.sortAscending : !this.sortAscending;
        }
        if (this.sortField === 'priority') {
            return a.priority < b.priority ? this.sortAscending : !this.sortAscending;
        }
        return -1;
    }
}

// ensure single instance
const store = new DownloadStatusStore();
export default store;