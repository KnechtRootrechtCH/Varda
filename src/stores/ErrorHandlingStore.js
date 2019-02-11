import {observable, action} from 'mobx';
import { firestore } from '../config/fire'
import * as Moment from 'moment';

import AuthenticationStore from './AuthenticationStore';
import NotificationStore from './NotificationStore';

class ErrorHandlingStore {
    @observable error = null;

    @action clearError () {
        this.error = null;
    }

    @action handleError(source, info) {
        const date = new Date();
        const message = info.message;
        const code = info.getCode ? info.getCode() : info.code ? info.code : info.status ? info.status : 0;
        const timestamp = Moment(date).format('YYYY-MM-DD HH-mm-ss-SSSS ZZ');
        const error = {
            source: source,
            code: code,
            message: message,
            userName: AuthenticationStore.displayName,
            uid: AuthenticationStore.uid,
            dataUid: AuthenticationStore.dataUid,
            isAdmin: AuthenticationStore.isAdmin,
            timestamp: timestamp,
        }

        console.error(`ErrorHandlingStore.handlingError() : Error occured in '${source}'`, source, info);
        firestore.collection('errors').add(error);

        NotificationStore.showNotification(timestamp, 'error.message', `error.${source}`, 'error', true, true);
    }
}

// ensure single instance
const store = new ErrorHandlingStore();
export default store;