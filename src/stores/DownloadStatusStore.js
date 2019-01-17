import {observable, action, computed} from 'mobx';
import { firestore } from '../config/fire'

import AuthenticationStore from './AuthenticationStore';
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
            const collection = userDoc.collection('itemStatus');
            collection.doc(key).onSnapshot((doc) => {
                const data = doc.data();
                if (data) {
                    console.debug('DownloadStatusStore.loadStatus() : item loaded/updated', data);
                    this.items[key] = data;
                }
                
            });
        }
    }

    

    @action updateStatus(item, status) {
        console.debug('DownloadStatusStore.updateStatus()', this.uid, item, status);

        const key = MetadataService.getKey(item);
        const title = MetadataService.getTitle(item);   
        const release = MetadataService.getReleaseDateFormated(item, 'YYYY-MM-DD');

        const userDoc = firestore.collection('users').doc(this.uid);
        const collection = userDoc.collection('itemStatus');
        collection.doc(`${key}`).set({
            status: status,
            title: title,
            release: release,
        });
    }

    @computed get uid(){
        return AuthenticationStore.authenticated ? AuthenticationStore.user.uid : null;
    }
}

// ensure single instance
const store = new DownloadStatusStore();
export default store;