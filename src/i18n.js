import i18n from 'i18next';

i18n.init({
    debug: true,

    lng: navigator.language.trim(),

    react: {
        wait: false,
        bindI18n: 'languageChanged loaded',
        bindStore: 'added removed',
        nsMode: 'default'
    },

    resources: {
        'en': {
            'translation': {
                title: 'Varda',

                common: {
                    initializing: 'Initializing',
                    discover: 'Discover',
                    movies: 'Movies',
                    movie: 'Movie',
                    seriesPlural: 'Series',
                    series: 'Series',
                    list: 'Download List',
                    priority: {
                        1: 'High',
                        2: 'Medium',
                        3: 'Low',
                    },
                    status: {
                        none: '',
                        queued: 'queued',
                        notReleased: 'unreleased',
                        notAvailable: 'not yet available',
                        notFound: 'not found',
                        downloading: 'downloading',
                        downloaded: 'done',
                    },
                },

                authentication: {
                    mail: 'Mail',
                    password: 'Password',
                    signIn: 'Sign in',
                    signOut: 'Sign out',
                    signUp: 'Signup here.',
                    noAccount: 'Don\'t have an account?',
                    signInError: 'Authentification failed.'
                },

                browse: {
                    searchAll: 'Search…',
                    searchMovies: 'Search movie…',
                    searchTv: 'Search tv series…',

                    card: {
                        add: 'Add',
                        edit: 'Edit',
                        remove: 'Remove',
                        markDownloaded: 'Mark as downloaded',
                    },
                }
            }
        },
        'de': {
            'translation': {
                title: 'Varda',

                common: {
                    initializing: 'Initialisierung',
                    discover: 'Entdecken',
                    movies: 'Filme',
                    movie: 'Film',
                    seriesPlural: 'Serien',
                    series: 'Serie',
                    list: 'Download Liste',
                    priority: {
                        1: 'Hoch',
                        2: 'Mittel',
                        3: 'Tief',
                    },
                    status: {
                        none: '',
                        queued: 'hinzugefügt',
                        notReleased: 'unveröffentlicht',
                        notAvailable: 'noch nicht erhältlich',
                        notFound: 'noch nicht gefunden',
                        downloading: 'wird heruntergeladen',
                        downloaded: 'erledigt',
                    },
                },

                authentication: {
                    mail: 'Email',
                    password: 'Passwort',
                    signIn: 'Login',
                    signOut: 'Logout',
                    signUp: 'Hier registrieren.',
                    noAccount: 'Noch keinen Account?',
                    signInError: 'Authentifizierung fehlgeschlagen.'
                },

                browse: {
                    searchAll: 'Suchen…',
                    searchMovies: 'Film suchen…',
                    searchTv: 'Serie suchen…',

                    card: {
                        add: 'Hinzufügen',
                        edit: 'Bearbeiten',
                        remove: 'Entfernen',
                        markDownloaded: 'Als erledigt markieren',
                    },
                }
            }
        }
    }
});

export default i18n;