import firebase from 'firebase/app';
import auth from 'firebase/auth'; // eslint-disable-line no-unused-vars
import store from 'firebase/firestore'; // eslint-disable-line no-unused-vars

const config = {
    apiKey: 'AIzaSyD-HqBxheYcdQUAUB1beYZCX60U51G5L5A',
    authDomain: 'varda-80e71.firebaseapp.com',
    databaseURL: 'https://varda-80e71.firebaseio.com',
    projectId: 'varda-80e71',
    storageBucket: 'varda-80e71.appspot.com',
    messagingSenderId: '629129663242'
};

const fire = firebase.initializeApp(config)
const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

export {fire, googleAuthProvider, firestore};
