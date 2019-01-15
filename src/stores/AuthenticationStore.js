import {observable, action, computed} from 'mobx';

class AuthenticationStore {

}

// ensure same instance is used across the entire app
const store = new AuthenticationStore();
export default store;
