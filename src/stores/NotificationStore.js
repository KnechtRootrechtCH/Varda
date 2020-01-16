import {observable, action, computed, runInAction} from 'mobx';
import { firestore } from '../config/fire'
import i18n from 'i18next';

import AuthenticationStore from './AuthenticationStore';
import ErrorHandlingStore from './ErrorHandlingStore';

class NotificationStore {
    commentSubscription = null;
    transactionSubscription = null;
    @observable browserNotifications = [];
    @observable snackbarNotifications = [];
    @observable commentNotifications = false;
    @observable transactionNotifications = false;

    constructor () {
        this.loadSettings();
        console.debug('NotificationStore.constructor()', this.commentNotifications, this.transactionNotifications);
    }

    @action subscribeNotifications() {
        this.subscribeComments();
        this.subscribeTransactions();
    }

    @action subscribeComments() {
        console.debug('NotificationStore.subscribeNotifications()');

        if (this.commentSubscription) {
            this.commentSubscription.onSnapshot(function (){
                // Unsubscribe
              });
        }

        this.commentSubscription = firestore
            .collection('users')
            .doc(this.dataUid)
            .collection('comments')
            .orderBy('timestamp', 'asc')
            .where('timestamp', '>', new Date());

        this.commentSubscription.onSnapshot((snapshot) => {
            runInAction(() => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        let data = change.doc.data();
                        this.handleCommentNotification(data);
                    }
                });
            });
        }, (error) => {
            ErrorHandlingStore.handleError('firebase.comments.notification', error);
        });
    }

    @action handleCommentNotification(notification) {
        if (notification.userName !== this.displayName) {
            console.debug('NotificationStore.handleNotification() => ', notification);
            const messageSnackbar = notification.itemTitle ? `${notification.text} (${notification.itemTitle})` : notification.text
            const messageNotification  = notification.itemTitle ? `${notification.itemTitle}: ${notification.text}` : notification.text

            this.pushSnackbarNotification(notification.userName, messageSnackbar, 'info', false, false, '/messages');
            if(this.commentNotifications) {
                this.pushBrowserNotification(notification.userName, messageNotification, false, false, '/messages');
            }
        }
    }

    @action subscribeTransactions() {
        console.debug('NotificationStore.subscribeNotifications()');

        if (this.transactionSubscription) {
            this.transactionSubscription.onSnapshot(function (){
                // Unsubscribe
              });
        }

        this.transactionSubscription = firestore
            .collection('users')
            .doc(this.dataUid)
            .collection('transactions')
            .orderBy('timestamp', 'desc')
            .where('timestamp', '>', new Date());

        this.transactionSubscription.onSnapshot((snapshot) => {
            runInAction(() => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        let data = change.doc.data();
                        this.handleTransactionNotification(data);
                    }
                });
            });
        }, (error) => {
            ErrorHandlingStore.handleError('firebase.history.notification', error);
        });
    }

    @action handleTransactionNotification(notification) {
        if (notification.userName !== this.displayName && notification.transaction !== 'updatePriority') {
            console.log('NotificationStore.handleNotification() => ', notification, i18n.translator.translate('title'));

            const newValue = notification.transaction.indexOf('Status') > 0  ? i18n.translator.translate(`history.transaction.${notification.newValue}`) : notification.newValue;
            const details = notification.subTarget ? `${notification.subTarget}: ${newValue}` : `${i18n.translator.translate( `history.transaction.${notification.transaction}`)} '${newValue}'`;

            this.pushSnackbarNotification(notification.title, details, 'info', false, false, '/history');
            if (this.transactionNotifications) {
                this.pushBrowserNotification(notification.title, details, false, false, '/history');
            }
        }
    }

    @action pushBrowserNotification(message, details, translateMessage, translateDetails, route) {
        message = translateMessage ? i18n.translator.translate(message) : message;
        if (details) {
            details = translateDetails ? i18n.translator.translate(details) : details;
        }

        const notification = {
            message: message,
            details: details,
            route: route,
        }

        this.browserNotifications.push({
            key: `varda-notification-${Math.random()}`,
            ...notification
        });
        console.debug('NotificationStore.pushBrowserNotification()', notification);
    }

    @action removeBrowserNotification(key) {
        this.browserNotifications.remove(key);
        console.debug('NotificationStore.removeBrowserNotification()', key, this.browserNotifications);
    }

    @action pushSnackbarNotification(message, details, variant, translateMessage, translateDetails, route) {
        message = translateMessage ? i18n.translator.translate(message) : message;
        if (details) {
            details = translateDetails ? i18n.translator.translate(details) : details;
            message = `${message}: ${details}`;
        }

        const notification = {
            message: message,
            route: route,
            options: {
                variant: variant,
                persist: false
            }
        }

        this.snackbarNotifications.push({
            key: new Date().getTime() + Math.random(),
            ...notification
        });
        console.debug('NotificationStore.pushSnackbarNotification()', notification);
    }

    @action removeSnackbarNotification(key) {
        this.snackbarNotifications.remove(key);
        console.debug('NotificationStore.removeSnackbarNotification()', key);
    }

    @action incrementIndex() {
        this.index++;
    }

    @action setIndex(value) {
        this.index = value;
    }

    @action loadSettings() {
        const settings = JSON.parse(localStorage.getItem('varda.pushNotifications'));
        if (settings) {
            this.transactionNotifications = settings.transactions;
            this.commentNotifications = settings.comments;
            return;
        }
        this.transactionNotifications = false;
        this.commentNotifications = false;
    }

    @action saveSettings() {
        const settings = {
            transactions: this.transactionNotifications,
            comments: this.commentNotifications,
        }
        localStorage.setItem('varda.pushNotifications', JSON.stringify(settings));
    }

    @action toggleCommentNotifications() {
        this.commentNotifications = !this.commentNotifications;
        this.saveSettings();
    }

    @action toggleTransactionNotifications() {
        this.transactionNotifications = !this.transactionNotifications;
        this.saveSettings();
    }

    @computed get dataUid () {
        return AuthenticationStore.dataUid;
    }

    @computed get displayName () {
        return AuthenticationStore.displayName;
    }
}

// ensure single instance
const store = new NotificationStore();
export default store;