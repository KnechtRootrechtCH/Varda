import { observable, action, runInAction } from 'mobx';
import { firestore } from '../config/fire'

class ConfigurationStore {
    userId = null;

    @observable initialized = false;
    @observable userSettings = null;
    @observable configuration = {
        priorityCount: 5,
        showDiscovery: false,
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

    @action async loadUserSettings(userId) {
        this.userId = userId;

        firestore.collection('users').doc(userId).onSnapshot((doc) => {
            // console.debug('ConfigurationStore.init() : personal settings loaded', doc.data());
            let settings = doc.data().settings;
            if (!settings) {
                settings = {}
            }
            runInAction(() => {
                this.userSettings = settings;
            });
        })
    }

    @action updateUserSettings(data) {
        /*
        const doc = firestore.collection('users').doc(this.userId)
        doc.set({
            settings: data,
            mail: this.user.email,
        }, {
            merge: true
        });
        */
    }
}

// ensure single instance
const store = new ConfigurationStore();
export default store;