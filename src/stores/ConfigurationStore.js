import { observable, action, runInAction } from 'mobx';
import { firestore } from '../config/fire'

import ErrorHandlingStore from './ErrorHandlingStore';

class ConfigurationStore {
    userId = null;

    @observable initialized = false;
    @observable configuration = {
        priorityCount: 5,
        showDiscovery: false,
        importPriorityShift: 1,
        castDisplayRows: 2,
        recommendationDisplayRows: 2,
        downloadLinks: new Map(),
    };

    constructor() {
        this.init();
    }

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