import i18n from 'i18next';

i18n.init({
    debug: true,

    lng: navigator.language.trim().substring(0, 2),

    react: {
        wait: false,
        bindI18n: 'languageChanged loaded',
        bindStore: 'added removed',
        nsMode: 'default'
    },

    resources: {
        'en': {
            'translation': {
                title: 'Varda - Download List',

                common: {
                    discover: 'Discover',
                    movies: 'Movies',
                    movie: 'Movie',
                    seriesPlural: 'Series',
                    series: 'Series',
                    list: 'Download List',
                },


            }
        },
        'de': {
            'translation': {
                title: 'Varda - Download Liste',

                common: {
                    discover: 'Entdecken',
                    movies: 'Filme',
                    movie: 'Film',
                    seriesPlural: 'Serien',
                    series: 'Serie',
                    list: 'Download Liste',
                },

            }
        }
    }
});

export default i18n;