import { observable, action, runInAction } from 'mobx';
import { firestore } from '../config/fire'

import ErrorHandlingStore from './ErrorHandlingStore';

class ConfigurationStore {
    userId = null;

    @observable initialized = false;
    @observable configuration = {
        castDisplayRows: 2,
        downloadLinks: new Map(),
        importPriorityShift: 1,
        recommendationDisplayRows: 2,
        priorityCount: 5,
        showCommentsInNavbar: false,
        showDiscovery: false,
        showHistoryInNavbar: true,
        allowCommentsSorting: false,
        historyAutoMarkAsReadSeconds: 0,
        commentsAutoMarkAsReadSeconds: 0,
        listSearchIgnore: [],
        listSearchStringPrefixes: [],
        listSearchStringSplitter: [],
        listSearchStringTransformators: []
    };

    @action async init() {
        firestore.collection('static').doc('configuration').onSnapshot((doc) => {
            // console.debug('ConfigurationStore.init() : configuration loaded', doc.data());
            runInAction(() => {
                const configuration = doc.data();
                if (configuration) {
                    this.configuration = configuration;
                }
                this.initialized = true;
            });
        }, (error) => {
            ErrorHandlingStore.handleError('firebase.configuration.load', error);
        });
    }
}

// ensure single instance
const store = new ConfigurationStore();
export default store;