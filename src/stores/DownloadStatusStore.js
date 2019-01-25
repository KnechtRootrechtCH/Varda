import {observable, action, computed, runInAction} from 'mobx';
import { firestore } from '../config/fire'
import * as Moment from 'moment';

import MetadataService from '../service/MetadataService';

import constants from '../config/constants';

class DownloadStatusStore {
    @observable item = null;
    @observable items = {};

    isAdmin = false;
    uid = null;
    dataUid = null;
    userName = '';

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
            // console.debug('DownloadStatusStore.loadStatus() : loading', key);
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

    @action async updateStatus(item, status, previousStatus, comment) {
        const key = MetadataService.getKey(item);
        const title = MetadataService.getTitle(item);
        const release = MetadataService.getReleaseDateFormated(item, 'YYYY-MM-DD');
        const backdrop = item.backdrop_path;
        if (!previousStatus) {
            previousStatus = '';
        }
        console.debug('DownloadStatusStore.updateStatus()', key, status);

        const userDoc = firestore.collection('users').doc(this.dataUid);
        const statusCollection = userDoc.collection('items');
        statusCollection.doc(`${key}`).set({
            status: status,
            title: title,
            release: release,
            backdrop: backdrop,
        },{
            merge: true
        });

        this.updateItemData(key, item);
        this.logTransaction(key, 'updateStatus', title, status, previousStatus, comment);
    }

    @action async updatePriority(item, priority, previousPrority, comment) {
        const key = MetadataService.getKey(item);
        const title = MetadataService.getTitle(item);
        if (!previousPrority) {
            previousPrority = 0;
        }
        console.debug('DownloadStatusStore.updatePriority()', key, priority);

        const userDoc = firestore.collection('users').doc(this.dataUid);
        const collection = userDoc.collection('items');
        collection.doc(`${key}`).set({
            priority: priority,
        },{
            merge: true
        });

        this.updateItemData(key, item);
        this.logTransaction(key, 'updatePriority', title, priority, previousPrority, comment);
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
        const timestamp = Moment().format('YYYY-MM-DD HH-mm-ss-S ZZ');
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
                userName: this.userName,
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
                userName: this.userName,
                key: key,
                title: title,
            });
    }

    @action setUid(uid) {
        this.uid = uid;
    }

    @action setDataUid(uid) {
        this.dataUid = uid;
    }

    @action setIsAdmin(isAdmin) {
        this.isAdmin = isAdmin;
    }

    @action setDisplayName(name) {
        this.userName = name;
    }

    @computed get isAdminAction(){
        return this.isAdmin && this.dataUid !== this.uid;
    }
}

// ensure single instance
const store = new DownloadStatusStore();
export default store;