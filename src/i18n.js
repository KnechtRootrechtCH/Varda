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
                        markForRedownload: 'Mark for redownload',
                        status: {
                            removed: '',
                            queued: '',
                            notReleased: 'unreleased',
                            notAvailable: 'not yet available',
                            notFound: 'not found',
                            redownload: 'redownload',
                            downloading: 'downloading',
                            downloaded: '',
                        },
                    },
                },

                settings: {
                    themeSettings: 'Theme settings',
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
                        markDownloaded: 'Erledigt',
                        markForRedownload: 'Erneut herunterladen',
                        status: {
                            removed: '',
                            queued: '',
                            notReleased: 'unveröffentlicht',
                            notAvailable: 'noch nicht erhältlich',
                            notFound: 'noch nicht gefunden',
                            redownload: 'nochmals herunterladen',
                            downloading: 'wird heruntergeladen',
                            downloaded: '',
                        },
                    },
                },

                settings: {
                    themeSettings: 'Darstellungsoptionen',
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