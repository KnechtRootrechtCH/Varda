import {observable, action, computed, runInAction} from 'mobx';
import { firestore } from '../config/fire'
import * as Moment from 'moment';

import AuthenticationStore from './AuthenticationStore';
import MetadataService from '../service/MetadataService';
import constants from '../config/constants';

class DownloadStatusStore {
    @observable item = null;
    @observable items = {};

    @action async loadStatus(item) {
        const key = MetadataService.getKey(item);
        this.loadStatusByKey(key);
    }

    @action async loadStatusById(mediaType, id) {
        this.loadStatusByKey(`${mediaType}:${id}`);
    }

    @action async loadStatusByKey(key) {
        const statusItem = this.items[key];
        if (!statusItem || statusItem.status === constants.STATUS.LOADING) {
            // console.debug('DownloadStatusStore.loadStatus() : loading', key, this.dataUid);
            this.items[key] = { status: constants.STATUS.LOADING };
            const userDoc = firestore.collection('users').doc(this.dataUid);
            const collection = userDoc.collection('items');
            collection.doc(key).onSnapshot((doc) => {
                const data = doc.data();
                if (data) {
                    // console.debug('DownloadStatusStore.loadStatus() : item loaded/updated', data);
                    if (!data.status) {
                        data.status = '';
                    }
                    runInAction(() => {
                        this.items[key] = data;
                    });

                } else {
                    // console.debug('DownloadStatusStore.loadStatus() : not found', data);
                    runInAction(() => {
                        this.items[key] = { status: '' };
                    });
                }
            });
        }
    }

    @action async updateStatus(item, status, previousStatus, comment, skipLog) {
        const key = MetadataService.getKey(item);
        const title = MetadataService.getTitle(item);
        const release = MetadataService.getReleaseDateFormated(item, 'YYYY-MM-DD');
        const backdrop = item.backdrop_path;
        const timestamp = Moment().format('YYYY-MM-DD HH-mm-ss');

        if (!previousStatus) {
            previousStatus = '';
        }

        if (!status) {
            return;
        }

        const data = {
            status: status,
            title: title ? title : '',
            release: release ? release : '',
            backdrop: backdrop ? backdrop: '',
            timestamp: timestamp,
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
        const timestamp = Moment().format('YYYY-MM-DD HH-mm-ss');
        if (!previousPrority) {
            previousPrority = 0;
        }
        // console.debug('DownloadStatusStore.updatePriority()', key, priority);

        const userDoc = firestore.collection('users').doc(this.dataUid);
        const collection = userDoc.collection('items');
        collection.doc(`${key}`).set({
            priority: priority,
            timestamp: timestamp,
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
        const timestamp = Moment().format('YYYY-MM-DD HH-mm-ss-SSSS ZZ');
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
                timestamp: timestamp,
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
                timestamp: timestamp,
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
}

// ensure single instance
const store = new DownloadStatusStore();
export default store;