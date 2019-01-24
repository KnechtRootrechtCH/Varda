import * as Moment from 'moment';
import constants from '../config/constants';

class MetadataService {

    getKey (item) {
        const mediaType = this.getMediaType(item);
        const id = item.id;
        return `${mediaType}:${id}`;
    }

    getMediaType (item) {
        if (this.isMovie(item)) {
            return 'movie';
        } else if (this.isTv(item)) {
            return 'tv';
        } else if (this.isTvSeason(item)) {
            return 'season';
        } else {
            return 'invalid';
        }
    }

    isMovie (item) {
        return item && item.title;
    }

    isTv (item) {
        return item && item.name && !item.episode_count;
    }

    isTvSeason (item) {
        return item && item.name && item.episode_count;
    }

    getTitle (item) {
        if (item.title) {
            return item.title;
        } else if (item.name) {
            return item.name;
        }
        return null;
    }

    getOriginalTitle (item) {
        if (item.original_title) {
            return item.original_title;
        } else if (item.original_name) {
            return item.original_name;
        }
        return null;
    }

    getReleaseDateMoment (item) {
        let date = null
        if (item.release_date) {
            date = item.release_date;
        } else if (item.first_air_date) {
            date = item.first_air_date;
        } else if (item.air_date) {
            date = item.air_date;
        }
        if (date) {
            let moment = Moment(date)
            return moment;
        }
        return null
    }

    getMovieDbUrl (item) {
        let url = 'https://www.themoviedb.org/' + item.media_type + '/' + item.id;
        return url
    }

    isAvailableOnNetflix (item) {
        if (item.homepage) {
            return item.homepage.indexOf('www.netflix.com/') > -1;
        }
        return false
    }

    getNetflixUrl (item) {
        if (item.homepage && item.homepage.indexOf('www.netflix.com/') > -1) {
            return item.homepage;
        }
    }

    getReleaseDateFormated (item, format) {
        let moment = this.getReleaseDateMoment(item);
        if (!moment) {
            return null;
        }
        let formated = moment.format(format);
        return formated;
    }

    getSanitizedSearchString (item) {
        let query = this.getTitle(item);
        query = query.replace(/[-+():;]/gi, '');
        query = query.replace(/ +(?= )/g, '');
        query = query.replace(/\s/g, '+');
        return query
    }

    getCrew(item) {
        if (!item.credits) {
            return null;
        }
        return item.credits.crew;
    }

    getCast(item) {
        if (!item.credits) {
            return null;
        }
        return item.credits.cast;
    }

    getDirector(item) {
        const crew = this.getCrew(item);
        if (!crew) {
            return false;
        }

        let director = null;
        crew.forEach(c => {
            if (c.job.toLowerCase() === constants.JOB.DIRECTOR) {
                director = c;
            }
        })

        return director;
    }

    getReleaseDates (item, country) {
        const releases = item.release_dates;
        if (!releases) {
          return null
        }

        let releaseDates = null;
        releases.results.forEach(result => {
            if (country.toUpperCase() === result.iso_3166_1.toUpperCase()) {
                releaseDates = result;
            }
        })
        return releaseDates;
    }
}

// ensure single instance
const service = new MetadataService();
export default service;