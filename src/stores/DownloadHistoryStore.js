import {observable, action, computed, runInAction} from 'mobx';
import { firestore } from '../config/fire'

import AuthenticationStore from './AuthenticationStore';

class DownloadHistoryStore {
    @observable loading = false;
    @observable history = [];
    @observable filter = {
        key: 'all',
        field: 'timestamp',
        operator: '>=',
        value: new Date(0, 0, 0, 0, 0, 0, 0),
    }
    @observable sortField = 'timestamp';
    @observable sortAscending = false;
    limit = 100;

    @action async loadHistory () {
        // console.debug('DownloadHistoryStore.loadHistory() : loading', this.dataUid, this.filter);
        runInAction(() => {
            this.loading = true;
        })
        firestore
            .collection('users')
            .doc(this.dataUid)
            .collection('transactions')
            .orderBy(this.sortField, this.sortAscending ? 'asc' : 'desc')
            .where(this.filter.field, this.filter.operator, this.filter.value)
            .limit(this.limit)
            .onSnapshot((snapshot) => {
                runInAction(() => {
                    this.history = [];
                    snapshot.forEach(doc => {
                        this.history.push(doc.data());
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
            .limit(this.limit)
            .where(this.filter.field, this.filter.operator, this.filter.value)
            .onSnapshot((snapshot) => {
                runInAction(() => {
                    this.history = [];
                    snapshot.forEach(doc => {
                        this.history.push(doc.data());
                    });
                    this.loading = false;
                });
        });
    }

    @action setFilter(filter) {
        this.filter = filter;
    }

    @action setSorting(sortField, sortAscending) {
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