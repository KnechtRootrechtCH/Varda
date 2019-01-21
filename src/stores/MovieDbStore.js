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

    @observable mediaType = null;
    @observable queryType = null;
    @observable searchString = '';

    constructor() {
        const locale = navigator.language.trim();
        this.locale = locale.substring(0, 2);
        // console.debug('MovieDbStore.constructor()', this.locale);
    }

    @action setSearchString(searchString) {
        this.searchString = searchString;
    }

    @action setMediaType(mediaType) {
        this.mediaType = mediaType;
    }

    @action clearItems() {
        console.debug('MovieDbStore.clearItems()');
        // this.items = [];
        this.page = 0;
        this.totalPages = 0;
        this.totalReults = 0;
        // this.searchString = null;
    }

    @action loadItems() {
        setTimeout(() => {
            this.loading = true;
            const apiKey = ConfigurationStore.configuration.movieDbApiKey;

            let queryType = this.searchString && this.searchString.length >= 2 ? 'search' : 'popular'
            if (!this.mediaType) {
                if (queryType === 'search') {
                    this.mediaType = 'multi';
                } else {
                    this.mediaType = 'movie';
                }
            }

            this.queryType = queryType;

            let query = null;
            if (queryType === 'search') {
                query = `https://api.themoviedb.org/3/${queryType}/${this.mediaType}?api_key=${apiKey}&language=${this.locale}&page=${this.page + 1}&query=${this.searchString}`;
            } else {
                query = `https://api.themoviedb.org/3/${this.mediaType}/${queryType}?api_key=${apiKey}&language=${this.locale}&page=${this.page + 1}`;
            }
            // console.debug('MovieDbStore.search() : query =>', query);

            axios(query).then((response) => {
                if (response.status === 200) {
                    if (this.page === 0) {
                        this.items = [];
                    }

                    const results = response.data.results;
                    results.forEach((result) => {
                        this.items.push(result);
                    })

                    this.page = response.data.page;
                    this.totalItems = response.data.total_results;
                    this.totalPages = response.data.total_pages;
                    this.loading = false;

                    console.debug('MovieDbStore.search() : items loaded from movieDb', this.items.length, this.page);
                } else {
                    this.loading = false;
                    this.items = [];
                    console.error('MovieDbStore.search() : error loading data from movieDb', response);
                }
            }).catch((error) => {
                this.loading = false;
                this.items = [];
                console.error('MovieDbStore.search() : error loading data from movieDb', error);
            });
        }, 0);
    }
}

// ensure single instance
const store = new MovieDbStore();
export default store;