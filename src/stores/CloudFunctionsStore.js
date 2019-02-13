import {observable, computed, action, runInAction} from 'mobx';
import {functions} from '../config/fire'

import AuthenticationStore from './AuthenticationStore';

class CloudFunctionsStore {
    @observable result = null;
    @observable actionRunning = false;
    @observable itemCounts = {};
    @observable statusUpdateTimestamp = null;

    @action init () {
        // TODO: check execution data, then execute release status update (if x time has passed)
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
                    this.itemCounts = result.data.itemCounts;
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
                    this.statusUpdateTimestamp = result.timestamp;
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

    @action setItemCounts (itemCounts) {
        this.itemCounts = itemCounts;
    }

    @action setStatusUpdateTimestamp (timestamp) {
        this.statusUpdateTimestamp = timestamp;
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