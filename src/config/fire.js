import * as firebase from 'firebase';

const config = {
    apiKey: 'AIzaSyD-HqBxheYcdQUAUB1beYZCX60U51G5L5A',
    authDomain: 'varda-80e71.firebaseapp.com',
    databaseURL: 'https://varda-80e71.firebaseio.com',
    projectId: 'varda-80e71',
    storageBucket: 'varda-80e71.appspot.com',
    messagingSenderId: '629129663242'
};

const firestoreSettings = {
    timestampsInSnapshots: true
};

const fire = firebase.initializeApp(config)
const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
const firestore = fire.firestore();
firestore.settings(firestoreSettings);

export {fire, googleAuthProvider, firestore};
