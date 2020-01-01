import {fireConfig} from './fireConfig';
import firebase from 'firebase/app';
import auth from 'firebase/auth'; // eslint-disable-line no-unused-vars
import store from 'firebase/firestore'; // eslint-disable-line no-unused-vars
import func from 'firebase/functions'; // eslint-disable-line no-unused-vars

const fire = firebase.initializeApp(fireConfig)
const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
const firestore = firebase.firestore();
const functions = firebase.functions();
const settings = {};
firestore.settings(settings);

export {fire, googleAuthProvider, firestore, functions};
