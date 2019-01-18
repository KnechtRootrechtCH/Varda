import {observable, action, computed} from 'mobx';
import { firestore } from '../config/fire'
import * as Moment from 'moment';

import AuthenticationStore from './AuthenticationStore';
import ConfigurationStore from './ConfigurationStore';
import MetadataService from '../service/MetadataService';

class DownloadStatusStore {
    @observable loading = false;

    @observable item = null;
    @observable items = {};

    @action loadStatus(item) {
        const key = MetadataService.getKey(item);
        const existing = this.items[key];
        if (!existing) {
            // console.debug('DownloadStatusStore.loadStatus() : loading', key);
            // this.items[key] = { status: 'loading' };
            const userDoc = firestore.collection('users').doc(this.uid);
            const collection = userDoc.collection('items');
            collection.doc(key).onSnapshot((doc) => {
                const data = doc.data();
                if (data) {
                    console.debug('DownloadStatusStore.loadStatus() : item loaded/updated', data);
                    this.items[key] = data;
                }

            });
        }
    }

    @action updateStatus(item, status, previousStatus) {
        const key = MetadataService.getKey(item);
        const title = MetadataService.getTitle(item);
        const release = MetadataService.getReleaseDateFormated(item, 'YYYY-MM-DD');
        const backdrop = item.backdrop_path;
        console.debug('DownloadStatusStore.updateStatus()', key, status);

        const userDoc = firestore.collection('users').doc(this.uid);
        const statusCollection = userDoc.collection('items');
        statusCollection.doc(`${key}`).set({
            status: status,
            title: title,
            release: release,
            backdrop: backdrop,
            priority: ConfigurationStore.configuration.priorityDefault,
        },{
            merge: true
        });

        this.updateItemData(key, item);
        this.logTransaction(key, 'updateStatus', title, status, previousStatus);
    }

    @action updatePriority(item, priority, previousPrority) {
        const key = MetadataService.getKey(item);
        const title = MetadataService.getTitle(item);
        console.debug('DownloadStatusStore.updatePriority()', key, priority);

        const userDoc = firestore.collection('users').doc(this.uid);
        const collection = userDoc.collection('items');
        collection.doc(`${key}`).set({
            priority: priority,
        },{
            merge: true
        });

        this.updateItemData(key, item);
        this.logTransaction(key, 'updatePriority', title, priority, previousPrority);
    }

    @action updateItemData(key, item) {
        const itemDataCollection = firestore.collection('users')
            .doc(this.uid)
            .collection('items')
            .doc(key)
            .collection('data');

        itemDataCollection
            .doc('movieDb')
            .set(item);
    }

    @action logTransaction(key, transaction, title, newValue, previousValue){
        console.debug('DownloadStatusStore.logTransaction()', transaction, newValue);

        const yearMonth = Moment().format('YYYY-MM');
        const day = Moment().format('DD - dddd');
        const time = Moment().format('HH-mm-ss ZZ');
        const dateTimeString = Moment().format('YYYY-MM-DD HH-mm-ss ZZ');

        const itemTransactionsCollection = firestore.collection('users')
            .doc(this.uid)
            .collection('items')
            .doc(key)
            .collection('transactions');
        itemTransactionsCollection
            .doc(dateTimeString)
            .set({
                transaction: transaction,
                newValue: newValue,
                previousValue: previousValue,
            }, {
                merge: true
            });

        const userTransactionsCollection = firestore.collection('users')
            .doc(this.uid)
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
            }, {
                merge: true
            });
    }

    @computed get uid(){
        return AuthenticationStore.authenticated ? AuthenticationStore.user.uid : null;
    }
}

// ensure single instance
const store = new DownloadStatusStore();
export default store;