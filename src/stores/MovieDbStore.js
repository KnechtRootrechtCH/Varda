import {observable, action} from 'mobx';
import axios from 'axios';

import ConfigurationStore from './ConfigurationStore';

class MovieDbStore {
    @observable locale = 'de';
    @observable items = [];
    @observable item = null;

    @observable loading = false;

    @observable page = 0;
    @observable totalPages = 0;
    @observable totalItems = 0;

    constructor() {
        const locale = navigator.language.trim();
        this.locale = locale.substring(0, 2);
        // console.debug('MovieDbStore.constructor()', this.locale);
    }

    @action clearItems() {
        this.items = [];
        this.page = 0;
        this.totalPages = 0;
        this.totalReults = 0;
    }

    @action loadItems(mediaType, searchString) {
        this.loading = true;
        const apiKey = ConfigurationStore.configuration.movieDbApiKey;
        
        let queryType = searchString && searchString.length >= 2 ? 'search' : 'popular'
        if (!mediaType) {
            if (queryType === 'search') {
                mediaType = 'multi';
            } else {
                mediaType = 'movie';
            }
        }

        let query = null;
        if (queryType === 'search') {
            query = `https://api.themoviedb.org/3/${queryType}/${mediaType}?api_key=${apiKey}&language=${this.locale}&page=${this.page + 1}&query=${searchString}`;
        } else {
            query = `https://api.themoviedb.org/3/${mediaType}/${queryType}?api_key=${apiKey}&language=${this.locale}&page=${this.page + 1}`;
        }
        // console.debug('MovieDbStore.search() : query =>', query);

        axios(query).then((response) => {
            if (response.status === 200) {
                this.items = response.data.results;
                this.page = response.data.page;
                this.totalItems = response.data.total_results;
                this.totalPages = response.data.total_pages;
                this.loading = false;
                console.debug('MovieDbStore.search() : items loaded from movieDb', this.items.length);
            } else {
                this.loading = false;
                console.error('MovieDbStore.search() : error loading data from movieDb', response);
            }
        }).catch(function (error) {
            this.loading = false;
            console.error('MovieDbStore.search() : error loading data from movieDb', error);
        });
    }
}

// ensure single instance
const store = new MovieDbStore();
export default store;