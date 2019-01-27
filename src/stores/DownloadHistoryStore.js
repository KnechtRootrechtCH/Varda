import {observable, action, computed, runInAction} from 'mobx';
import { firestore } from '../config/fire'

import AuthenticationStore from './AuthenticationStore';

class DownloadHistoryStore {
    @observable loading = false;
    @observable history = [];
    @observable filterField = 'transaction';
    @observable filterValue = 'updateStatus';
    @observable filterKey = 'updateStatus';
    @observable sortField = 'timestamp';
    @observable sortAscending = false;
    limit = 500;

    @action async loadHistory () {
        // console.debug('DownloadHistoryStore.loadHistory() : loading', this.dataUid, this.filterField, this.filterValue);
        runInAction(() => {
            this.loading = true;
        })
        firestore
            .collection('users')
            .doc(this.dataUid)
            .collection('transactions')
            .orderBy(this.sortField, this.sortAscending ? 'asc' : 'desc')
            .limit(this.limit)
            .onSnapshot((snapshot) => {
                runInAction(() => {
                    this.history = [];
                });
                snapshot.forEach(doc => {
                    this.addItem(doc.data())
                });
                runInAction(() => {
                    this.loading = false;
                });
        });
    }

    @action addItem(item) {
        if (!this.filterField || !this.filterValue) {
            this.history.push(item);
        } else if (item[this.filterField] === this.filterValue) {
            this.history.push(item);
        }
    }

    @action setFilter(filterKey, filterField, filterValue) {
        this.filterKey = filterKey;
        this.filterField = filterField;
        this.filterValue = filterValue;
    }

    @action setSorting(sortField, sortAscending) {
        this.sortField = sortField;
        this.sortAscending = sortAscending;
    }

    @computed get dataUid () {
        return AuthenticationStore.dataUid;
    }
}

// ensure single instance
const store = new DownloadHistoryStore();
export default store;