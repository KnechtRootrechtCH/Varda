import {observable, action, runInAction} from 'mobx';
import axios from 'axios';

import ConfigurationStore from './ConfigurationStore';
import DownloadStatusStore from './DownloadStatusStore';
import MetadataService from '../service/MetadataService';

const movieDbApiKey = '23703a8a857927f41414fb155404393d';

class ListSearchStore {
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
                const baseSearchString = this.transformOriginalString(s)
                if (baseSearchString && !this.filter(baseSearchString)) {
                    const searchString = this.transformSearchString(baseSearchString);
                    const year = this.getReleaseYear(baseSearchString);
                    const season = this.getSeason(baseSearchString);
                    this.items.push({
                        originalSearchString: baseSearchString,
                        initialSearchString: searchString,
                        searchString: searchString,
                        year: year,
                        season: season,
                        results: [],
                        result: null,
                        loading: false
                    });
                }
            })

            this.items.forEach((item, index)=> {
                this.searchMovieDb(index, item.searchString);
            });
        });
    }

    @action setSelected(index, id) {
        runInAction(() => {
            let result = this.items[index].results.find(r => r.id === id);
            if(result) {
                this.items[index].resultId = result.id;
                this.items[index].result = result;
                this.items[index].searchString = MetadataService.getTitle(result);;
            }

        });
    }

    @action setSearchString(index, searchString) {
        runInAction(() => {
            this.items[index].searchString = searchString;
        });
    }

    @action async searchMovieDb(index) {
        let item = this.items[index];
        let searchString = item.searchString;
        runInAction(() => {
            item.loading = true;
        });
        const query = `https://api.themoviedb.org/3/search/multi?api_key=${movieDbApiKey}&language=${this.locale}&page=1&query=${searchString}`;
        try {
            // console.debug('ListSearchStore.loadMovieData()', query);
            const response = await axios.get(query);
            runInAction(() => {
                if (response.status === 200) {
                    const results = response.data.results;
                    if (results) {
                        item.results = results;
                    } else {
                        item.results = [];
                    }
                    if (results && results.length > 0) {
                        item.result = results[0];
                        item.resultId = results[0].id;
                        DownloadStatusStore.loadStatus(results[0]);
                    }
                    item.loading = false;
                    // console.debug('ListSearchStore.loadMovieData() => successfull', item);
                } else {
                    item.loading = false;
                    console.error(`ListSearchStore.loadMovieData() => failed to load movie data for ${item.searchString}; error code: ${response.code}`);
                }
            });
        } catch (error) {
            runInAction(() => {
                item.loading = false;
            });
            console.error(`ListSearchStore.loadMovieData() => failed to load movie data for ${item.searchString}`, error);
        }
    }

    filter(text) {
        if (text.trim().length <= 0) {
            console.debug(`ListSearchStore.filter() string.empty => ignore`,);
            return true;
        }

        let filter = false;
        ConfigurationStore.configuration.listSearchIgnore.forEach(s => {
            const regex = new RegExp(s);
            if (regex.test(text)) {
                console.debug(`ListSearchStore.filter() '${text}' matches reges '${s}' => ignore`,);
                filter = true;
            }
        });
        return filter;
    }

    transformOriginalString(text) {
        if (!text || text.trim().length === 0) {
            return null;
        }
        ConfigurationStore.configuration.listSearchStringRegexps.forEach(s => {
            const regex = new RegExp(s);
            const matches = text.match(regex);
            if (matches && matches.length > 1) {
                text = matches[1];
            }
        });
        return text.trim();
    }

    getReleaseYear(text) {
        if (!text || text.trim().length === 0) {
            return null;
        }
        const regex = new RegExp(".*\\.(\\d{4})\\..*");
        const matches = text.match(regex);
        if (matches && matches.length > 1) {
            return matches[1];
        }
        return null;
    }

    getSeason(text) {
        if (!text || text.trim().length === 0) {
            return null;
        }
        const regex = new RegExp(".*\\.S(\\d{2}).*");
        const matches = text.match(regex);
        if (matches && matches.length > 1) {
            return matches[1];
        }
        return null;
    }


    transformSearchString(text) {
        // const original = text;
        ConfigurationStore.configuration.listSearchStringSplitter.forEach(s => {
            text = text.split(s)[0];
        });
        ConfigurationStore.configuration.listSearchStringPrefixes.forEach(s => {
            text = text.replace(s, '');
        });
        text = text.replaceAll('.', ' ');
        text = text.trim();
        // console.debug(`ListSearchStore.transform() ${original} => ${text}`,);
        return text.trim();
    }

}

// ensure single instance
const store = new ListSearchStore();
export default store;