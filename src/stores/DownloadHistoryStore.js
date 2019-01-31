import {observable, action, computed, runInAction} from 'mobx';
import { firestore } from '../config/fire'

import AuthenticationStore from './AuthenticationStore';

class DownloadHistoryStore {
    @observable loading = false;
    @observable history = new Map();
    @observable filter = {
        key: 'all',
        field: 'timestamp',
        operator: '>=',
        value: new Date(0, 0, 0, 0, 0, 0, 0),
    }
    @observable sortField = 'timestamp';
    @observable sortAscending = false;
    pageSize = 15;
    lastItem = null;

    @action async resetHistory () {
        this.history = new Map();
        this.lastItem = null;
    }

    @action async loadHistory () {
        // console.debug('DownloadHistoryStore.loadHistory() : loading', this.dataUid, this.filter);
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
            });
    }

    @action async loadItemHistory (key) {
        // console.debug('DownloadHistoryStore.loadItemHistory() : loading', this.dataUid, loadItemHistory);
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
                        this.lastItem = doc.data();
                        this.history.set(doc.id, this.lastItem);
                   });
                    this.loading = false;
                });
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

    @computed get dataUid () {
        return AuthenticationStore.dataUid;
    }

    @computed get filterKey () {
        return this.filter.key;
    }
}

// ensure single instance
const store = new DownloadHistoryStore();
export default store;