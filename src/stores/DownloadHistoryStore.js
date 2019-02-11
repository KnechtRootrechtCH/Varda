import {observable, action, computed, runInAction} from 'mobx';
import { firestore } from '../config/fire';
import * as Moment from 'moment';

import AuthenticationStore from './AuthenticationStore';
import ErrorHandlingStore from './ErrorHandlingStore';

class DownloadHistoryStore {
    @observable loading = false;
    @observable history = new Map();
    @observable itemHistory = new Map();
    @observable filter = {
        key: 'all',
        field: 'timestamp',
        operator: '>=',
        value: new Date(0, 0, 0, 0, 0, 0, 0),
    }
    @observable sortField = 'timestamp';
    @observable sortAscending = false;
    pageSize = 25;
    lastItem = null;

    @action async resetHistory () {
        this.history = new Map();
        this.lastItem = null;
    }

    @action async loadHistory () {
        console.debug('DownloadHistoryStore.loadHistory() : loading', this.dataUid, this.filter);
        runInAction(() => {
            this.loading = true;
        })
        let query = firestore
            .collection('users')
            .doc(this.dataUid)
            .collection('transactions')
            .orderBy(this.sortField, this.sortAscending ? 'asc' : 'desc')
            .where(this.filter.field, this.filter.operator, this.filter.value);

        if (this.lastItem) {
            // console.debug('DownloadHistoryStore.loadHistory() : loading', this.lastItem);
            query = query.startAfter(this.lastItem.timestamp.toDate());
        }

        query
            .limit(this.pageSize)
            .onSnapshot((snapshot) => {
                runInAction(() => {
                    snapshot.forEach(doc => {
                        this.lastItem = doc.data();
                        this.history.set(doc.id, this.lastItem);
                    });
                    this.loading = false;
                });
            }, (error) => {
                ErrorHandlingStore.handleError('firebase.history.load', error);
            });
    }

    @action async resetItemHistory () {
        this.itemHistory = new Map();
    }

    @action async loadItemHistory (key) {
        console.debug('DownloadHistoryStore.loadItemHistory() : loading', this.dataUid, key, this.filter);
        runInAction(() => {
            this.loading = true;
        })
        firestore
            .collection('users')
            .doc(this.dataUid)
            .collection('items')
            .doc(key)
            .collection('transactions')
            .orderBy(this.sortField, this.sortAscending ? 'asc' : 'desc')
            .where(this.filter.field, this.filter.operator, this.filter.value)
            .onSnapshot((snapshot) => {
                runInAction(() => {
                    snapshot.forEach(doc => {
                        this.itemHistory.set(doc.id, doc.data());
                   });
                    this.loading = false;
                });
            }, (error) => {
                ErrorHandlingStore.handleError('firebase.history.item', error);
            });
    }

    @action async logTransaction(key, transaction, title, newValue, previousValue, comment){
        const date = new Date();
        const timestamp = Moment(date).format('YYYY-MM-DD HH-mm-ss-SSSS ZZ');
        comment = comment ? comment : '';
        previousValue = previousValue ? previousValue : '';
        // console.debug('DownloadHistoryStore.logTransaction()', timestamp, transaction, newValue, comment);

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
            })
            .then(() => {
                // console.debug('DownloadHistoryStore.logTransaction() : item => successfull');
            })
            .catch((error) => {
                ErrorHandlingStore.handleError('firebase.transaction.item.add', error);
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
            })
            .then(() => {
                // console.debug('DownloadHistoryStore.logTransaction() : user => successfull');
            })
            .catch((error) => {
                ErrorHandlingStore.handleError('firebase.transaction.user.add', error);
            });

            if (this.dataUid === this.uid) {
                firestore.collection('users')
                .doc(this.dataUid)
                .set({transaction: {
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
                    }},{
                        merge: true
                    })
                    .then(() => {
                        // console.debug('DownloadHistoryStore.logTransaction() : last => successfull');
                    })
                    .catch((error) => {
                        ErrorHandlingStore.handleError('firebase.transaction.last.update', error);
                    });
            }
    }

    @action setFilter(filter) {
        this.resetHistory();
        this.filter = filter;
    }

    @action setSorting(sortField, sortAscending) {
        this.resetHistory();
        this.sortField = sortField;
        this.sortAscending = sortAscending;
    }

    @computed get filterKey () {
        return this.filter.key;
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
const store = new DownloadHistoryStore();
export default store;