
class ImageService {
    getBackdropImage (item, size) {
        if (item && item.backdrop_path) {
          return this.getMovieDbImage(item.backdrop_path, size);
        } else {
          return this.getBackdropPlaceholder(size);
        }
    }

    getProfileImage (person, size) {
        if (person && person.profile_path) {
          return this.getMovieDbImage(person.profile_path, size);
        } else {
          return this.getProfilePlaceholder(size);
        }
    }

    getPosterImage (item, size) {
        if (item && item.poster_path) {
          return this.getMovieDbImage(item.poster_path, size);
        } else {
          return this.getPosterPlaceholder(size);
        }
    }

    getStillImage (item, size) {
        if (item && item.still_path) {
          return this.getMovieDbImage(item.still_path, size);
        } else {
          return this.getStillPlaceholder(size);
        }
    }

    getMovieDbImage (path, size) {
        return 'https://image.tmdb.org/t/p/' + size.key + path;
    }

    getBackdropPlaceholder (size) {
        return this.getPlaceholderImage(size, '+', '444499', 'ededed');
    }

    getProfilePlaceholder (size) {
        return this.getPlaceholderImage(size, '??', '444499', 'ededed');
    }

    getStillPlaceholder (size) {
        return this.getPlaceholderImage(size, '??', '444499', 'ededed');
    }

    getPosterPlaceholder (size) {
        return this.getPlaceholderImage(size, '+', '495057', 'ededed');
    }

    getPlaceholderImage (size, text, background, textColor) {
        // https://dummyimage.com/200x300/CC0000/ffffff&text=dummyimage.com+rocks!
        return `https://dummyimage.com/${size.width}x${size.height}/${background}/${textColor}&text=${text}`;
    }
}

// ensure single instance
const service = new ImageService();
export default service;