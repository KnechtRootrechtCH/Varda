import {observable, action} from 'mobx';
import i18n from 'i18next';

class NotificationStore {
    @observable snackbarNotifications = [];
    @observable index = 0;

    @action pushBrowserNotification(message, details, variant, route) {
        console.log('NotificationStore.pushBrowserNotification() :=> ', message, details, variant, route);
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
        console.debug('NotificationStore.pushSnackbarNotification() :=> ', notification);
    }

    @action removeSnackbarNotification(key) {
        this.snackbarNotifications.remove(key);
        console.debug('NotificationStore.removeSnackbarNotification() :=> ', key);
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