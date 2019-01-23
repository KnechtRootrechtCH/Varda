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

    @action setLoading(loading) {
        this.loading = loading;
    }

    @action clearItems() {
        console.debug('MovieDbStore.clearItems()');
        this.items = [];
        this.page = 0;
        this.totalPages = 0;
        this.totalReults = 0;
        this.hasMore = true;
    }

    @action loadItems() {
        setTimeout(() => {
            if (!this.hasMore) {
                this.loading = false;
                return;
            }
            this.loading = true;
            // console.debug('MovieDbStore.search() :', this.mediaType, this.searchString, this.loading);
            const apiKey = ConfigurationStore.configuration.movieDbApiKey;

            let queryType = this.searchString && this.searchString.length >= 2 ? 'search' : 'popular'
            let mediaType = this.mediaType;
            if (!mediaType) {
                if (queryType === 'search') {
                    mediaType = 'multi';
                } else {
                    mediaType = 'movie';
                }
            }

            this.queryType = queryType;

            let query = null;
            if (queryType === 'search') {
                query = `https://api.themoviedb.org/3/${queryType}/${mediaType}?api_key=${apiKey}&language=${this.locale}&page=${this.page + 1}&query=${this.searchString}`;
            } else {
                query = `https://api.themoviedb.org/3/${mediaType}/${queryType}?api_key=${apiKey}&language=${this.locale}&page=${this.page + 1}`;
            }
            // console.debug('MovieDbStore.search() :', mediaType, queryType, this.searchString, query);

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
                    this.hasMore = this.totalPages > this.page;
                    this.loading = false;
                    console.debug(`MovieDbStore.search() : ${results.length} items loaded from movieDb (page ${this.page}/${this.totalPages})`);
                } else {
                    this.items = [];
                    this.loading = false;
                    console.error('MovieDbStore.search() : error loading data from movieDb', response);
                }
            }).catch((error) => {
                this.items = [];
                this.loading = false;
                console.error('MovieDbStore.search() : error loading data from movieDb', error);
            });
        }, 0);
    }
}

// ensure single instance
const store = new MovieDbStore();
export default store;