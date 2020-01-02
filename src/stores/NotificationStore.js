import {observable, action} from 'mobx';

class NotificationStore {
    @observable notifications = [];
    @observable index = 0;

    @action showPopup(key, message, details, variant, translateMessage, translateDetails) {
        const notification = {
            key: key,
            message: message,
            details: details,
            variant: variant,
            translateMessage: translateMessage,
            translateDetails: translateDetails,
        }

        this.notifications.push(notification);
    }

    @action showNotification(header, details, route) {
        console.log('NotificationStore.showNotification() :=> ', header, details, route);
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