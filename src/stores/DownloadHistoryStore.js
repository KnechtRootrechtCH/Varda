import {observable, action, computed, runInAction} from 'mobx';
import { firestore } from '../config/fire'

class DownloadHistoryStore {
    @observable history = [];

    dataUid = null;
    sortField = 'timestamp';
    sortDirection = 'desc';
    filter = null;

    @action async loadHistory() {
        // console.debug('DownloadHistoryStore.loadHistory() : loading', key);
        firestore
            .collection('users')
            .doc(this.dataUid)
            .collection('transactions')
            .orderBy(this.sortField, this.sortDirection)
            .get()
            .then((snapshot) => {
                runInAction(() => {
                    this.history = [];
                });
                snapshot.forEach(doc => {
                    runInAction(() => {
                        this.history.push(doc.data());
                    });
                });
            });
    }

    @action setFilter(filter) {
        this.filter = filter;
    }

    @action setSorting(sortField, sortDirection) {
        this.sortField = sortField;
        this.sortDirection = sortDirection;
    }

    @action setDataUid(uid) {
        this.dataUid = uid;
    }
}

// ensure single instance
const store = new DownloadHistoryStore();
export default store;