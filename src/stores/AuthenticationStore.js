import {observable, action, computed, runInAction} from 'mobx';
import {fire, firestore, googleAuthProvider} from '../config/fire'
import * as Moment from 'moment';

import CloudFunctionsStore from './CloudFunctionsStore';
import ConfigurationStore from './ConfigurationStore';
import ErrorHandlingStore from './ErrorHandlingStore';

class AuthenticationStore {
    @observable user = null;
    @observable authenticationInitialized = false;
    @observable userDataInitialized = false;
    @observable adminSettingsInitialized = false;
    @observable message = null;
    @observable details = null;
    @observable isAdmin = false;
    @observable dataUid = null;
    @observable displayName = null;
    dispalyNameInternal = null;

    constructor() {
        fire.auth().onAuthStateChanged((user) => {
            this.onAuthStateChanged(user);
        });
    }

    @action onAuthStateChanged(user) {
        console.log('AuthenticationStore.onAuthStateChanged()', user);
        runInAction(() => {
            this.user = user;
            this.isAdmin = false;
            if (user) {
                this.uid = user.uid;
                this.dataUid = user.uid;
                this.displayName = user.email;
                this.logAccess();
                this.loadAdminSettings();
                this.loadUserData();
                ConfigurationStore.init();
            } else {
                this.uid = null;
                this.dataUid = null;
                this.displayName = null;
            }
        });
        this.authenticationInitialized = true;

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
        console.debug('AuthenticationStore.authWithMail()', mail);
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
        }, (error) => {
            console.error('AuthenticationStore.signOut() : failed!', error);
            this.setMessage('singedOutError', error);
        });
    }

    @action logAccess() {
        // console.debug('AuthenticationStore.logAccess()', this.user);
        const userAgent = window.navigator.userAgent;
        const now = new Date();
        const access = {
            timestamp: now,
            userAgent: userAgent,
        }

        const doc = firestore.collection('users').doc(this.user.uid)
        doc.set({
            access: access,
            mail: this.user.email,
        }, {
            merge: true
        });

        const timestamp = Moment(now).format('YYYY-MM-DD HH-mm-ss Z')

        doc.collection('access')
            .doc(timestamp)
            .set({
                userAgent: userAgent,
                timestamp: now,
            }, {
                merge: true
            });
    }

    @action async loadAdminSettings() {
        firestore.collection('static')
            .doc('configuration')
            .collection('administrators')
            .doc(this.user.uid)
            .get()
            .then((doc) => {
                runInAction(() => {
                    let data = doc.data();
                    if (data) {
                        if(data.isAdmin) {
                            this.dataUid = data.targetUid;
                        }
                        this.isAdmin = data.isAdmin;
                    }
                    this.adminSettingsInitialized = true;
                    // console.debug('AuthenticationStore.loadAdminSettings() : successfull');
                });
            })
            .catch((error) => {
                ErrorHandlingStore.handleError('firebase.auth.settings.admin', error);
            });
    }

    @action async loadUserData() {
        firestore.collection('users')
            .doc(this.user.uid)
            .get()
            .then((doc) => {
                runInAction(() => {
                    let settings = doc.data().settings;
                    if (!settings) {
                        settings = {}
                    }
                    this.userSettings = settings;

                    let itemCounts = doc.data().itemCounts;
                    if (!itemCounts) {
                        itemCounts = {}
                    }
                    CloudFunctionsStore.setItemCounts(itemCounts);
                    CloudFunctionsStore.setStatusUpdateTimestamp(doc.data().statusUpdateTimestamp);
                    CloudFunctionsStore.executeAutomatedStatusUpdate();


                    const displayName = doc.data().displayName;
                    if (displayName) {
                        this.displayName = displayName;
                    } else {
                        this.displayName = this.user.email;
                    }
                    this.userDataInitialized = true;
                    console.debug('AuthenticationStore.loadUserData() : successfull');
                });
            })
            .catch((error) => {
                ErrorHandlingStore.handleError('firebase.auth.settings.user', error);
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

    @computed get initialized () {
        return this.authenticationInitialized && this.userDataInitialized && this.adminSettingsInitialized;
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
