import { observable, action } from 'mobx';
import { firestore } from '../config/fire'

class ConfigurationStore {
    @observable initialized = false;
    @observable configuration = null;

    @action init() {
        firestore.collection('static').doc('configuration').onSnapshot((doc) => {
            // console.debug('ConfigurationStore.init() : loaded', doc.data());
            this.configuration = doc.data();
            this.initialized = true;
        })
    }
}

// ensure single instance
const store = new ConfigurationStore();
export default store;