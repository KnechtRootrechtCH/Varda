import {observable, computed, action, runInAction} from 'mobx';
import {functions} from '../config/fire'

import AuthenticationStore from './AuthenticationStore';

class CloudFunctionsStore {
    @observable result = null;

    @action init () {
        // TODO: check execution data, then execute release status update (if x time has passed)
    }

    @action clearResult () {
        this.result = null;
    }

    @action executeUpdateItemCountsFunction() {
        const cloudFunction = functions.httpsCallable('updateItemCounts');
        console.debug('CloudFunctionsStore.executeUpdateItemCountsFunction()', cloudFunction);
        cloudFunction({
                uid: this.dataUid,
            })
            .then((result) => {
                console.debug('CloudFunctionsStore.executeUpdateItemCountsFunction() : successfull', result);
                runInAction(() => {
                    this.result = result;
                });
            })
            .catch((error) => {
                console.debug('CloudFunctionsStore.executeUpdateItemCountsFunction() : failed', error);
                runInAction(() => {
                    this.result = {
                        success: false,
                        error: error,
                        message: error.message,
                    };
                });
            });
    }

    @action incrementIndex() {
        this.index++;
    }

    @action setIndex(value) {
        this.index = value;
    }

    @computed get dataUid () {
        return AuthenticationStore.dataUid;
    }
}

// ensure single instance
const store = new CloudFunctionsStore();
export default store;