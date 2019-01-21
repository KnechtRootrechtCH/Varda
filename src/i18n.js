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
                    loading: 'Loading',
                    discover: 'Discover',
                    movies: 'Movies',
                    movie: 'Movie',
                    seriesPlural: 'Series',
                    series: 'Series',
                    list: 'Download List',
                    listShort: 'List',
                    settings: 'Settings',
                    search: 'Search',
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
                },

                settings: {
                    darkTheme: 'Dark theme',
                    on: 'On',
                    off: 'Off',
                    primaryColor: 'Primary color',
                    secondaryColor: 'Secondary color',
                }
            }
        },
        'de': {
            'translation': {
                title: 'Varda',

                common: {
                    initializing: 'Initialisierung',
                    loading: 'Lade',
                    discover: 'Entdecken',
                    movies: 'Filme',
                    movie: 'Film',
                    seriesPlural: 'Serien',
                    series: 'Serie',
                    list: 'Download Liste',
                    listShort: 'Liste',
                    settings: 'Einstellungen',
                    search: 'Suchen',
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
                    signIn: 'Einloggen',
                    signOut: 'Ausloggen',
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
                },

                settings: {
                    darkTheme: 'Dunkles Design',
                    on: 'Ein',
                    off: 'Aus',
                    primaryColor: 'Hauptfarbe',
                    secondaryColor: 'Sekondärfarbe',
                }
            }
        }
    }
});

export default i18n;