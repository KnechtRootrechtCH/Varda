import {observable, action, computed, runInAction} from 'mobx';
import { firestore } from '../config/fire'

import AuthenticationStore from './AuthenticationStore';

class DownloadHistoryStore {
    @observable history = [];
    filterField = 'transaction';
    filterValue = 'updateStatus';
    filter = null;

    @action async loadHistory () {
        // console.debug('DownloadHistoryStore.loadHistory() : loading', this.dataUid, this.filterField, this.filterValue);
        runInAction(() => {
            this.loading = true;
        })
        if (this.filterField && this.filterValue) {
            firestore
                .collection('users')
                .doc(this.dataUid)
                .collection('transactions')
                .where(this.filterField, '==', this.filterValue)
                .get()
                .then((snapshot) => {
                    runInAction(() => {
                        this.loading = false;
                        this.history = [];
                    });
                    snapshot.forEach(doc => {
                        runInAction(() => {
                            this.history.push(doc.data());
                        });
                    });
                });
        } else {
            firestore
                .collection('users')
                .doc(this.dataUid)
                .collection('transactions')
                .get()
                .then((snapshot) => {
                    runInAction(() => {
                        this.loading = false;
                        this.history = [];
                    });
                    snapshot.forEach(doc => {
                        runInAction(() => {
                            this.history.push(doc.data());
                        });
                    });
                });
        }
    }

    @action setFilter(filterField, filterValue) {
        this.filterField = filterField;
        this.filterValue = filterValue;
    }

    @computed get dataUid () {
        return AuthenticationStore.dataUid;
    }
}

// ensure single instance
const store = new DownloadHistoryStore();
export default store;