import {observable, action, computed, runInAction} from 'mobx';
import {fire, firestore, googleAuthProvider} from '../config/fire'
import * as Moment from 'moment';

import DownloadHistoryStore from './DownloadHistoryStore';
import DownloadStatusStore from './DownloadStatusStore';

class AuthenticationStore {
    @observable user = null;
    @observable initialized = false;
    @observable message = null;
    @observable details = null;
    @observable isAdmin = false;
    @observable targetUid = null;
    dispalyNameInternal = null;

    constructor() {
        fire.auth().onAuthStateChanged((user) => {
            this.onAuthStateChanged(user);
        });
    }

    @action onAuthStateChanged(user) {
        // console.debug('AuthenticationStore.onAuthStateChanged()', user);
        this.user = user;
        if(user) {
            DownloadStatusStore.setUid(user.uid) ;
            DownloadStatusStore.setDataUid(user.uid);
            DownloadStatusStore.setDisplayName(this.displayName);
            DownloadHistoryStore.setDataUid(user.uid);
            this.logAccess();
            this.loadAdminSettings();
            this.loadUserData();
        } else {
            DownloadStatusStore.setUid(null) ;
            DownloadStatusStore.setDataUid(null);
            DownloadStatusStore.setDisplayName('');
            DownloadHistoryStore.setDataUid(null);
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

    @action async loadAdminSettings() {
        firestore.collection('static')
            .doc('configuration')
            .collection('administrators')
            .doc(this.user.uid)
            .onSnapshot((doc) => {
                let data = doc.data();
                if (data) {
                    runInAction(() => {
                        this.isAdmin = data.isAdmin;
                        this.targetUid = data.targetUid;
                        DownloadStatusStore.setIsAdmin(data.isAdmin);
                        DownloadStatusStore.setDataUid(data.targetUid);
                        DownloadHistoryStore.setDataUid(data.targetUid);
                    });
                }
        })
    }

    @action async loadUserData() {
        firestore.collection('users')
            .doc(this.user.uid)
            .onSnapshot((doc) => {
                let settings = doc.data().settings;
                if (!settings) {
                    settings = {}
                }
                runInAction(() => {
                    this.userSettings = settings;
                    this.dispalyNameInternal = doc.data().displayName;
                    DownloadStatusStore.setDisplayName(this.displayName);
                });
        })
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

    @computed get displayName () {
        return this.dispalyNameInternal ? this.dispalyNameInternal : this.user.email;
    }
}

// ensure same instance is used across the entire app
const store = new AuthenticationStore();
export default store;
