export default Object.freeze({
    MEDIA_TYPE: {
        TV: 'tv',
        MOVIE: 'movie',
        PERSON: 'person',
    },
    STATUS: {
        REMOVED: 'removed',
        QUEUED: 'queued',
        NOT_RELEASED: 'notReleased',
        NOT_AVAILABLE: 'notAvailable',
        NOT_FOUND: 'notFound',
            REDOWNLOAD: 'redownload',
        DOWNLOADING: 'downloading',
        DOWNLOADED: 'downloaded',
    },
    JOB: {
        DIRECTOR: 'director',
    },
    IMAGESIZE: {
        BACKDROP: {
            W300: { key: 'w300', width: 300, height: 170 },
            W500: { key: 'w500', width: 500, height: 281 },
            W780: { key: 'w780', width: 780, height: 440 },
            W1280: { key: 'w1280', width: 1280, height: 723 },
            W1400: { key: 'w1400_and_h450_face', width: 1400, height: 450 },
        },
        POSTER: {
            W92: { key: 'w92', width: 92, height: 130 },
            W154: { key: 'w154', width: 154, height: 218 },
            W185: { key: 'w185', width: 185, height: 262 },
            W342: { key: 'w342', width: 342, height: 482 },
            W500: { key: 'w500', width: 500, height: 705 },
            W780: { key: 'w780', width: 780, height: 1100 },
        },
        PROFILE: {
            W45: { key: 'w45', width: 45, height: 68 },
            W185: { key: 'w185', width: 185, height: 278 },
            H632: { key: 'h632', width: 421, height: 632 }
        },
        STILL: {
            W185: { key: 'w185', width: 185, height: 104 },
        }
    },
})