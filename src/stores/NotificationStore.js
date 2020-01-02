import {observable, action} from 'mobx';
import i18n from 'i18next';

class NotificationStore {
    @observable browserNotifications = [];
    @observable snackbarNotifications = [];

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
            key: new Date().getTime() + Math.random(),
            ...notification
        });
        console.debug('NotificationStore.pushBrowserNotification()', notification);
    }

    @action removeBrowserNotification(key) {
        this.browserNotifications.remove(key);
        console.debug('NotificationStore.removeBrowserNotification()', key);
    }

    @action pushSnackbarNotification(message, details, variant, translateMessage, translateDetails, route) {
        // Compose message
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
}

// ensure single instance
const store = new NotificationStore();
export default store;