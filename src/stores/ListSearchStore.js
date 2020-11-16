import {observable, action, runInAction} from 'mobx';
// import axios from 'axios';

import ConfigurationStore from './ConfigurationStore';
// import ErrorHandlingStore from './ErrorHandlingStore';

// const movieDbApiKey = '23703a8a857927f41414fb155404393d';

class MovieDbStore {
    @observable locale = 'de';
    @observable searchStrings = [];
    @observable items = [];

    constructor() {
        const locale = navigator.language.trim();
        runInAction(() => {
            this.locale = locale.substring(0, 2);
        });
    }

    @action setSearchStrings(searchStrings) {
        this.searchStrings = searchStrings;
        this.items = [];
        runInAction(() => {
            searchStrings.forEach(s => {
                if (s && s.trim().length > 0) {
                    this.items.push({
                        originalSearchString: s,
                        editedSearchString: this.transform(s),
                        result: null
                    });
                }
            })
        });
    }

    @action setSearchString(index, searchString) {
        runInAction(() => {
            this.items[index] = searchString;
        });
    }

    transform(text) {
        ConfigurationStore.configuration.listSearchStringSplitter.forEach(s => {
            console.log('splitting', s, text);
            text = text.split(s)[0];
            
        });
        text = text.replaceAll('.', ' ');
        return text.trim();
    }

}

// ensure single instance
const store = new MovieDbStore();
export default store;