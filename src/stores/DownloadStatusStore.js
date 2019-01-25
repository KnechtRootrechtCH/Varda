import {observable, action, computed, runInAction} from 'mobx';
import { firestore } from '../config/fire'
import * as Moment from 'moment';

import AuthenticationStore from './AuthenticationStore';
import MetadataService from '../service/MetadataService';

import constants from '../config/constants';

class DownloadStatusStore {
    @observable loading = false;

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

    @action async updateStatus(item, status, previousStatus) {
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
        this.logTransaction(key, 'updateStatus', title, status, previousStatus);
    }

    @action async updatePriority(item, priority, previousPrority) {
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
        this.logTransaction(key, 'updatePriority', title, priority, previousPrority);
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

    @action async logTransaction(key, transaction, title, newValue, previousValue){
        console.debug('DownloadStatusStore.logTransaction()', transaction, newValue);

        const yearMonth = Moment().format('YYYY-MM');
        const day = Moment().format('DD - dddd');
        const time = Moment().format('HH-mm-ss ZZ');
        const dateTimeString = Moment().format('YYYY-MM-DD HH-mm-ss ZZ');

        const itemTransactionsCollection = firestore.collection('users')
            .doc(this.dataUid)
            .collection('items')
            .doc(key)
            .collection('transactions');
        itemTransactionsCollection
            .doc(dateTimeString)
            .set({
                transaction: transaction,
                newValue: newValue,
                previousValue: previousValue,
                isAdminAction: this.isAdminAction,
                user: this.uid,
            }, {
                merge: true
            });

        const userTransactionsCollection = firestore.collection('users')
            .doc(this.dataUid)
            .collection('transactions');
        userTransactionsCollection
            .doc(yearMonth)
            .collection(day)
            .doc(time)
            .set({
                key: key,
                transaction: transaction,
                newValue: newValue,
                previousValue: previousValue,
                title: title,
                isAdminAction: this.isAdminAction,
                user: this.uid,
            }, {
                merge: true
            });
    }

    @computed get isAdminAction(){
        return AuthenticationStore.authenticated && AuthenticationStore.isAdmin && AuthenticationStore.targetUid ? true : false;
    }

    @computed get uid(){
        return AuthenticationStore.authenticated ? AuthenticationStore.user.uid : null;
    }

    @computed get dataUid(){
        if (!AuthenticationStore.authenticated) {
            return null;
        }
        return AuthenticationStore.isAdmin && AuthenticationStore.targetUid ? AuthenticationStore.targetUid : AuthenticationStore.user.uid;
    }
}

// ensure single instance
const store = new DownloadStatusStore();
export default store;