import {observable, action, computed} from 'mobx';
import {fire, googleAuthProvider} from '../config/fire'

class AuthenticationStore {
    @observable user = null;
    @observable initialized = false;
    @observable message = null;
    @observable details = null;

    constructor() {
        fire.auth().onAuthStateChanged((user) => {
            this.initialized = true;
            this.user = user;
        });
    }

    @action authWithGoogle() {
        fire.auth().signInWithPopup(googleAuthProvider).then((result) => {
            this.setMessage("signInSuccess");
            console.debug("AuthenticationStore.authWithGoogle() : successfull")
        }).catch((error) => {
            this.setMessage("signInError", error);
        });
    }

    @action authWithMail(mail, password) {
        fire.auth().signInWithEmailAndPassword(mail, password).then(
            (user) => {
                this.setMessage("signInSuccess");
                console.debug("AuthenticationStore.authWithMail() : successfull", user)
            },
            (error) => {
                this.setMessage("signInError", error);
            }
          );
    }

    @action signOut() {
        console.debug("AuthenticationStore.signOut()", this.user)
        fire.auth().signOut().then((result) => {
            this.setMessage("singedOutSuccess");
        }, function(error) {
            this.setMessage("singedOutError", error);
        });
    }

    @action setMessage = (message, details) => {
        this.message = message;
        this.details = details;
    }

    @computed get authenticated () {
        return this.user !== null;
    }
}

// ensure same instance is used across the entire app
const store = new AuthenticationStore();
export default store;
