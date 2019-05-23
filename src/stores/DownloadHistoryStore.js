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
        key: 'updateStatus',
        field: 'transaction',
        operator: '==',
        value: 'updateStatus',
    }
    @observable sortField = 'timestamp';
    @observable sortAscending = false;
    @observable newTransactionsCount = 0;
    pageSize = 25;
    lastItem = null;
    newCountLimit = 5;
    lastQuery = null;
    lastCountQuery = null;

    @action async resetHistory () {
        this.history = new Map();
        this.lastItem = null;
    }

    @action async loadHistory () {
        if (this.lastQuery) {
            // console.debug('DownloadHistoryStore.loadHistory() : unsubscribing from last query', this.lastQuery);
            this.lastQuery.onSnapshot(function (){
                // Unsubscribe
              });
        }
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

        query = query.limit(this.pageSize)
        query.onSnapshot((snapshot) => {
                runInAction(() => {
                    snapshot.forEach(doc => {
                        this.lastItem = doc.data();
                        this.lastItem.external = this.lastItem.user !== this.uid;
                        this.history.set(doc.id, this.lastItem);
                    });
                    this.loading = false;
                });
            }, (error) => {
                ErrorHandlingStore.handleError('firebase.history.load', error);
            });

        this.lastQuery = query;
    }

    @action async resetItemHistory () {
        this.itemHistory = new Map();
    }

    @action async loadItemHistory (key) {
        if (this.lastQuery) {
            // console.debug('DownloadHistoryStore.loadItemHistory() : unsubscribing from last query', this.lastQuery);
            this.lastQuery.onSnapshot(function (){
                // Unsubscribe
            });
        }
        console.debug('DownloadHistoryStore.loadItemHistory() : loading', this.dataUid, key, this.filter);
        runInAction(() => {
            this.loading = true;
        })
        let query = firestore
            .collection('users')
            .doc(this.dataUid)
            .collection('items')
            .doc(key)
            .collection('transactions')
            .orderBy(this.sortField, this.sortAscending ? 'asc' : 'desc')
            // .where(this.filter.field, this.filter.operator, this.filter.value)

        query.onSnapshot((snapshot) => {
            runInAction(() => {
                snapshot.forEach(doc => {
                    let item = doc.data();
                    item.external = item.user !== this.uid;
                    this.itemHistory.set(doc.id, item);
                });
                this.loading = false;
            });
        }, (error) => {
            ErrorHandlingStore.handleError('firebase.history.item', error);
        });

        this.lastQuery = query;
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


            let transactionObject = {
                timestamp: date,
                transaction: transaction,
                newValue: newValue,
                previousValue: previousValue,
                key: key,
                title: title,
                comment: comment,
            };

            if (this.dataUid !== this.uid) {
                transactionObject.dataUid = this.dataUid;
                transactionObject.isAdminAction = this.isAdminAction;
            }

            firestore.collection('users')
            .doc(this.uid)
            .set({transaction: transactionObject},{
                    merge: true
                })
                .then(() => {
                    // console.debug('DownloadHistoryStore.logTransaction() : last => successfull');
                })
                .catch((error) => {
                    ErrorHandlingStore.handleError('firebase.transaction.last.update', error);
                });
    }

    @action loadNewTransactionsCount() {
        let timestamp = this.transactionsTimestamp;
        if (!timestamp) {
            console.debug('DownloadHistoryStore.loadNewTransactionsCount() => no timestamp!');
        }

        if (this.lastCountQuery) {
            // console.debug('DownloadHistoryStore.loadNewTransactionsCount() : unsubscribing from last query', this.lastCountQuery);
            this.lastCountQuery.onSnapshot(function (){
                // Unsubscribe
            });
        }

        let query = firestore
            .collection('users')
            .doc(this.dataUid)
            .collection('transactions')
            .orderBy('timestamp', 'desc');

        if (timestamp) {
            query = query.where('timestamp', '>', timestamp);
        }

        query = query
            .where(this.filter.field, this.filter.operator, this.filter.value)
            .limit(this.newCountLimit * 10);

        console.debug('DownloadHistoryStore.loadNewTransactionsCount() => ', this.dataUid, this.uid, timestamp);
        query.onSnapshot((snapshot) => {
            runInAction(() => {
                let count = 0;
                snapshot.forEach(doc => {
                    let data = doc.data();
                    if (data.user !== this.uid) {
                        // console.debug(data.user, doc.id);
                        count++;
                    }
                });
                this.newTransactionsCount = count;
                console.debug('DownloadHistoryStore.loadNewTransactionsCount() : loaded', this.dataUid, this.newTransactionsCount, this.uid, timestamp);
            });
        }, (error) => {
            ErrorHandlingStore.handleError('firebase.history.count', error);
        });

        this.lastCountQuery = query;
    }

    @action updateTimestamp() {

        const timestamp = new Date();
        firestore
            .collection('users')
            .doc(this.uid)
            .set({
                transactionsTimestamp: timestamp
            }, {
                merge: true
            })
            .then(() => {
                console.debug('DownloadHistoryStore.updateTimestamp() : successfull');
            })
            .catch((error) => {
                ErrorHandlingStore.handleError('firebase.history.updateTimestamp', error);
            });
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

    @computed get transactionsTimestamp () {
        return AuthenticationStore.transactionsTimestamp ? AuthenticationStore.transactionsTimestamp : null;
    }
}

// ensure single instance
const store = new DownloadHistoryStore();
export default store;