import {observable, computed, action, runInAction} from 'mobx';
import {functions} from '../config/fire'
import * as Moment from 'moment';

import AuthenticationStore from './AuthenticationStore';

class CloudFunctionsStore {
    @observable result = null;
    @observable actionRunning = false;
    @observable statusUpdateTimestamp = null;
    @observable itemCountTimestamp = null;

    @action executeAutomatedStatusUpdate () {
        let date = Moment();
        date.subtract(20, 'h');
        const timestamp = this.statusUpdateTimestamp ? Moment(this.statusUpdateTimestamp.toDate()) : null;

        if (!timestamp || timestamp.isBefore(date)) {
            console.log('CloudFunctionsStore.executeAutomatedFunctions() : More than 20 hours passed since the last update ==> execute status update');
            this.executeStatusUpdateCloudFunction();
        }
    }

    @action executeUpdateItemCountsFunction () {
        console.debug('CloudFunctionsStore.executeUpdateItemCountsFunction()');
        const cloudFunction = functions.httpsCallable('updateItemCounts');
        this.actionRunning = true;
        cloudFunction({
                uid: this.dataUid,
            })
            .then((result) => {
                console.debug('CloudFunctionsStore.executeUpdateItemCountsFunction() : successfull', result);
                runInAction(() => {
                    this.actionRunning = false;
                });
            })
            .catch((error) => {
                console.debug('CloudFunctionsStore.executeUpdateItemCountsFunction() : failed', error);
                runInAction(() => {
                    this.itemCounts = null;
                    this.actionRunning = false;
                });
            });
    }

    @action executeStatusUpdateCloudFunction () {
        console.debug('CloudFunctionsStore.executeStatusUpdateCloudFunction()');
        const cloudFunction = functions.httpsCallable('updateItemStatus');
        this.actionRunning = true;
        cloudFunction({
                uid: this.dataUid,
            })
            .then((result) => {
                console.debug('CloudFunctionsStore.executeStatusUpdateCloudFunction() : successfull', result);
                runInAction(() => {
                    this.actionRunning = false;
                });
            })
            .catch((error) => {
                console.debug('CloudFunctionsStore.executeStatusUpdateCloudFunction() : failed', error);
                runInAction(() => {
                    this.actionRunning = false;
                });
            });
    }

    @action setStatusUpdateTimestamp (timestamp) {
        this.statusUpdateTimestamp = timestamp;
    }

    @action setItemCountUpdateTimestamp (timestamp) {
        this.itemCountTimestamp = timestamp;
    }

    @action incrementIndex () {
        this.index++;
    }

    @action setIndex (value) {
        this.index = value;
    }

    @computed get dataUid () {
        return AuthenticationStore.dataUid;
    }
}

// ensure single instance
const store = new CloudFunctionsStore();
export default store;