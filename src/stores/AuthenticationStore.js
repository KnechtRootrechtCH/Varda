import {observable, action, computed} from 'mobx';
import {fire, firestore, googleAuthProvider} from '../config/fire'
import * as Moment from 'moment';

import ConfigurationStore from './ConfigurationStore';

class AuthenticationStore {
    @observable user = null;
    @observable dataUserId = null;
    @observable initialized = false;
    @observable message = null;
    @observable details = null;

    constructor() {
        fire.auth().onAuthStateChanged((user) => {
            this.onAuthStateChanged(user);
        });
    }

    @action onAuthStateChanged(user) {
        // console.debug('AuthenticationStore.onAuthStateChanged()', user);
        this.user = user;
        if(user) {
            this.dataUserId = user.uid;
            ConfigurationStore.loadUserSettings(user.uid);
            this.logAccess();
        }
        this.initialized = true;
    }

    @action authWithGoogle() {
        console.debug('AuthenticationStore.authWithGoogle()')
        fire.auth().signInWithPopup(googleAuthProvider).then((result) => {
            this.clearMessage();
            console.debug('AuthenticationStore.authWithGoogle() : successfull');
        }).catch((error) => {
            console.debug('AuthenticationStore.authWithGoogle() : failed');
            this.setMessage('signInError', error);
        });
    }

    @action authWithMail(mail, password) {
        console.debug('AuthenticationStore.authWithMail()', mail, password);
        fire.auth().signInWithEmailAndPassword(mail, password).then(
            (user) => {
                this.clearMessage();
                console.debug('AuthenticationStore.authWithMail() : successfull', user);
            },
            (error) => {
                console.debug('AuthenticationStore.authWithMail() : failed', error);
                this.setMessage('signInError', error);
            }
          );
    }

    @action signOut() {
        console.debug('AuthenticationStore.signOut()', this.user)
        fire.auth().signOut().then((result) => {
            console.debug('AuthenticationStore.signOut() : successfull');
            this.clearMessage();
        }, function(error) {
            console.error('AuthenticationStore.signOut() : failed!', error);
            this.setMessage('singedOutError', error);
        });
    }

    @action logAccess() {
        // console.debug('AuthenticationStore.logAccess()', this.user);
        const userAgent = window.navigator.userAgent;
        const access = {
            time: Moment().format('dddd DD.MM.YYYY HH:mm:ss ZZ'),
            userAgent: userAgent,
        }

        const doc = firestore.collection('users').doc(this.user.uid)
        doc.set({
            access: access,
            mail: this.user.email,
        }, {
            merge: true
        });

        const accessYearMonth = Moment().format('YYYY-MM');
        const accessDay = Moment().format('DD - dddd');
        const accessTime = Moment().format('HH-mm-ss ZZ');

        doc.collection('access')
            .doc(accessYearMonth)
            .collection(accessDay)
            .doc(accessTime)
            .set({
                userAgent: userAgent,
            }, {
                merge: true
            });
        }

    @action clearMessage = () => {
        this.message = null;
        this.details = null;
    }

    @action setMessage = (message, details) => {
        this.message = message;
        this.details = details;
    }

    @computed get authenticated () {
        return this.user !== null;
    }

    @computed get photoUrl () {
        if (this.user) {
            return this.user.photoURL;
        }
        return null;
    }
}

// ensure same instance is used across the entire app
const store = new AuthenticationStore();
export default store;
