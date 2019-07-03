import {observable, action, runInAction} from 'mobx';
import axios from 'axios';

import ConfigurationStore from './ConfigurationStore';
import ErrorHandlingStore from './ErrorHandlingStore';

const movieDbApiKey = '23703a8a857927f41414fb155404393d';

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

    @observable seasons = new Map();

    constructor() {
        const locale = navigator.language.trim();
        runInAction(() => {
            this.locale = locale.substring(0, 2);
        });
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
        // console.debug('MovieDbStore.clearItems()');
        this.items = [];
        this.page = 0;
        this.totalPages = 0;
        this.totalReults = 0;
        this.hasMore = true;
    }

    @action async loadItems() {
        if (!this.hasMore) {
            this.loading = false;
            return;
        }
        this.loading = true;
        // console.debug('MovieDbStore.loadItems() :', this.mediaType, this.searchString);

        const discovery = ConfigurationStore.configuration.showDiscovery;
        let queryType = this.searchString && this.searchString.length >= 2 ? 'search' : 'popular'
        let mediaType = this.mediaType;
        if (!mediaType) {
            if (queryType === 'search' && discovery) {
                mediaType = 'multi';
            } else {
                mediaType = 'movie';
            }
        }

        this.queryType = queryType;

        let query = null;
        if (queryType === 'search') {
            query = `https://api.themoviedb.org/3/${queryType}/${mediaType}?api_key=${movieDbApiKey}&language=${this.locale}&page=${this.page + 1}&query=${this.searchString}`;
        } else {
            query = `https://api.themoviedb.org/3/${mediaType}/${queryType}?api_key=${movieDbApiKey}&language=${this.locale}&page=${this.page + 1}`;
        }

        try {
            console.debug('MovieDbStore.loadItems() :', query);
            const response = await axios.get(`${query}&cachebuster=${Math.random()}`);
            runInAction(() => {
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
                    console.log(`MovieDbStore.loadItems() : ${results.length} items loaded from movieDb (page ${this.page}/${this.totalPages})`, results);
                } else {
                    this.items = [];
                    this.loading = false;
                    ErrorHandlingStore.handleError('moviedb.items.load', response);
                }
            });

        } catch (error) {
            runInAction(() => {
                this.items = [];
                this.loading = false;
                ErrorHandlingStore.handleError('moviedb.items.load', error);
            });
        }
    }

    @action clearItem() {
        // console.debug('MovieDbStore.clearItem()');
        this.item = null;
    }

    @action async loadItem(mediaType, id) {
        this.loading = true;
        // console.debug('MovieDbStore.loadItem() :', mediaType, id);

        const query = `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${movieDbApiKey}&language=${this.locale}&append_to_response=credits,recommendations,release_dates`;

        try {
            console.debug('MovieDbStore.loadItem() :', query);
            const response = await axios.get(`${query}&cachebuster=${Math.random()}`);
            runInAction(() => {
                if (response.status === 200) {
                    this.item = response.data;
                    this.loading = false;
                    console.debug('MovieDbStore.loadItem() : item loaded', response.data);
                } else {
                    this.item = null;
                    this.loading = false;
                    ErrorHandlingStore.handleError('moviedb.item.load', response);
                }
            });
        } catch (error) {
            runInAction(() => {
                this.item = null;
                this.loading = false;
                ErrorHandlingStore.handleError('moviedb.item.load', error);
            });

        }
    }

    @action async loadSeason(itemId, seasonNumber) {
        // console.debug('MovieDbStore.loadItem() :', mediaType, id);
        const query = `https://api.themoviedb.org/3/tv/${itemId}/season/${seasonNumber}?api_key=${movieDbApiKey}&language=${this.locale}`;

        try {
            console.debug('MovieDbStore.loadSeason() :', query);
            const response = await axios.get(`${query}&cachebuster=${Math.random()}`);
            runInAction(() => {
                if (response.status === 200) {
                    const seasonNumber = response.data.season_number;
                    if (this.item.seasons && this.item.seasons[seasonNumber]) {
                        const key = `${itemId}:${response.data.season_number}`;
                        this.seasons.set(key, response.data);
                        console.debug('MovieDbStore.loadSeason() : season loaded', response.data);
                    }
                } else {
                    ErrorHandlingStore.handleError('moviedb.season.load', response);
                }
            });
        } catch (error) {
            runInAction(() => {
                ErrorHandlingStore.handleError('moviedb.season.load', error);
            });

        }
    }
}

// ensure single instance
const store = new MovieDbStore();
export default store;