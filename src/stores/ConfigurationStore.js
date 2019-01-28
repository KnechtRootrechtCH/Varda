import { observable, action, runInAction } from 'mobx';
import { firestore } from '../config/fire'

class ConfigurationStore {
    userId = null;

    @observable initialized = false;
    @observable configuration = {
        priorityCount: 5,
        showDiscovery: false,
        importPriorityShift: 1,
    };

    constructor() {
        this.init();
    }

    @action async init() {
        firestore.collection('static').doc('configuration').onSnapshot((doc) => {
            // console.debug('ConfigurationStore.init() : configuration loaded', doc.data());
            runInAction(() => {
                this.configuration = doc.data();
                this.initialized = true;
            });
        })
    }
}

// ensure single instance
const store = new ConfigurationStore();
export default store;