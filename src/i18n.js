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
                subTitle: 'Downloads',

                common: {
                    initializing: 'Initializing',
                    loading: 'Loading',
                    discover: 'Discover',
                    movies: 'Movies',
                    movie: 'Movie',
                    seriesPlural: 'Series',
                    series: 'Series',
                    items: 'items',
                    list: 'Download List',
                    listShort: 'Downloads',
                    settings: 'Settings',
                    search: 'Search',
                    history: 'History',
                    messages: 'Comments',
                    comment: 'Comment',
                    more: 'more',
                    less: 'less',
                    unknown: 'unknown',
                    total: 'Total',
                    priority: {
                        1: 'High',
                        2: 'Medium',
                        3: 'Low',
                    },
                    status: {
                        label: 'Status',
                        removed: '',
                        queued: 'Todo',
                        notReleased: 'Unreleased',
                        notAvailable: 'Not yey available',
                        notFound: 'Not found',
                        redownload: 'Redownload',
                        downloading: 'Downloading',
                        downloaded: 'Done',
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
                            loading: '',
                        },
                    },
                },

                list: {
                    sort: {
                        ascending: 'Ascending',
                        descending: 'Descending',
                        title: 'Title',
                        release: 'Release date',
                        priority: 'Priority',
                        timestamp: 'Last change',
                    },
                    filter: {
                        mediaType: {
                            none: 'All',
                            movie: 'Movies',
                            tv: 'TV Series',
                        },
                        status: {
                            none: 'Status: All',
                            queued: 'Status: TodDo',
                            notReleased: 'Status: Unreleased',
                            notAvailable: 'Status: Not yet available',
                            notFound: 'Status: Not found',
                            redownload: 'Status: Redownload',
                            downloading: 'Status: Downloading',
                            downloaded: 'Status: Done',
                        },
                    },
                },

                details: {
                    originalTitle: 'Original title',
                    status: 'Status',
                    runtime: 'Runtime',
                    rating: 'Rating',
                    director: 'Director',
                    genres: 'Genres',
                    firstAirDate: 'First air date',
                    releaseDate: 'Release date',
                    releaseDates: 'Release dates',
                    links: 'Links',
                    downloadActions: 'Downloads',
                    comments: 'Comments',
                    cast: 'Cast',
                    recommendations: 'Recommendations',
                    downloadLinks: 'Download search',
                    release: {
                        ch: {
                            type1: 'CH Premiere',
                            type2: 'CH Limited Theatrical Release',
                            type3: 'CH Theatrical Release',
                            type4: 'CH Digital Release',
                            type5: 'CH Physical Release',
                            type6: 'CH TV'
                        },
                        us: {
                            type1: 'US Premiere',
                            type2: 'US Limited Theatrical Release',
                            type3: 'US Theatrical Release',
                            type4: 'US Digital Release',
                            type5: 'US Physical Release',
                            type6: 'US TV'
                        },
                    },
                    actions: {
                        add: 'Add',
                        remove: 'Remove',
                        redownload: 'Redownload',
                        notAvailable: 'Not yet available',
                        notFound: 'Not found',
                        downloading: 'Downloading',
                        donwloaded: 'Done',
                        comment: 'Comment',
                        addComment: 'Add comment',
                        submit: 'Submit',
                        cancel: 'Cancel',
                    }
                },

                history: {
                    filter: {
                        all: 'Everything',
                        updateStatus: 'Status updates',
                        priorityChange: 'Priority update',
                        comments: 'Comments',
                        queued: 'Status updates: Queued',
                        notAvailable: 'Status updates: Not available',
                        notFound: 'Status updates: Not found',
                        redownload: 'Status updates: Redownload',
                        downloading: 'Status updates: Downloading',
                        downloaded: 'Status updates: Done',
                        removed: 'Status updates: Removed',
                    },
                    transaction: {
                        updatePriority: 'Priority',
                        updateStatus: 'Status update',
                        comment: 'Comment',
                        queued: 'Queued',
                        removed: 'Removed',
                        notAvailable: 'Not available',
                        notFound: 'Not found',
                        redownload: 'Redownload',
                        downloading: 'Downloading',
                        downloaded: 'Done',
                    },
                    label: {
                        title: 'Title',
                        user: 'User',
                        timestamp: 'Date/Time',
                        transaction: 'Transaction',
                        previousValue: 'Old value',
                        newValue: 'New value',
                        comment: 'Comment',
                    },
                },

                settings: {
                    themeSettings: 'Theme settings',
                    darkTheme: 'Dark theme',
                    on: 'On',
                    off: 'Off',
                    primaryColor: 'Primary color',
                    secondaryColor: 'Secondary color',
                    importSettings: 'Data Import',
                    startImport: 'Import data',
                    cullImport: 'Cull data',
                    validateImport: 'Validate data',
                    cloudFunctions: 'Cloud Functions',
                    executeItemCountUpdate: 'Calculate item count',
                    executeStatusUpdate : 'Execute status update',
                    itemCount: 'Item count',
                    statusUpdate: 'Status update',
                    lastUpdate: 'Updated',
                    neverRun: 'Cloud function never executed!',
                },

                error: {
                    message: 'Ooops, something went wrong',
                    mobieDb: {
                        items: {
                            load: 'Unable to load data (themoviedb.org)',
                        },
                        item: {
                            load: 'Unable to load data (themoviedb.org)',
                        },
                    },
                    firebase: {
                        auth: {
                            settings: {
                                admin: 'Error loading user data',
                                user: 'Error loading user data',
                            },
                        },
                        comments: {
                            add: 'Failed to save comment',
                            load: 'Error loading comments',
                            item: {
                                load: 'Error loading comments',
                            },
                        },
                        configuration: {
                            load: 'Error loading configuration',
                        },
                        history: {
                            load: 'Error loading history',
                            item: 'Error loading history',
                        },
                        transaction: {
                            user: {
                                add: '',
                            },
                            item: {
                                add: '',
                            },
                            last: {
                                update: '',
                            },
                        },
                        status: {
                            item: {
                                load: 'Unable to load data (firebase)',
                                update: 'Failed to update status',
                            },
                            list: {
                                load: 'Unable to load data (firebase)',
                            },
                            priority: {
                                update: 'Failed to update priority',
                            }
                        },
                    },
                },
            }
        },
        'de': {
            'translation': {
                title: 'Varda',
                subTitle: 'Downloads',

                common: {
                    initializing: 'Initialisierung',
                    loading: 'Lade',
                    discover: 'Entdecken',
                    movies: 'Filme',
                    movie: 'Film',
                    seriesPlural: 'Serien',
                    series: 'Serie',
                    items: 'Downloads',
                    list: 'Download Liste',
                    listShort: 'Downloads',
                    settings: 'Einstellungen',
                    search: 'Suchen',
                    history: 'Verlauf',
                    messages: 'Kommentare',
                    comment: 'Kommentar',
                    more: 'mehr',
                    less: 'weniger',
                    unknown: 'unbekannt',
                    total: 'Total',
                    priority: {
                        1: 'Hoch',
                        2: 'Mittel',
                        3: 'Tief',
                    },
                    status: {
                        label: 'Status',
                        removed: '',
                        queued: 'Todo',
                        notReleased: 'Unveröffentlicht',
                        notAvailable: 'Noch nicht erhältlich',
                        notFound: 'Nicht gefunden',
                        redownload: 'Nochmals herunterladen',
                        downloading: 'Wird heruntergeladen',
                        downloaded: 'Erledigt',
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
                            notFound: 'nicht gefunden',
                            redownload: 'nochmals herunterladen',
                            downloading: 'wird heruntergeladen',
                            downloaded: '',
                            loading: '',
                        },
                    },
                },

                list: {
                    sort: {
                        ascending: 'Aufsteigend',
                        descending: 'Absteigend',
                        title: 'Titel',
                        release: 'Veröffentlichung',
                        priority: 'Priorität',
                        timestamp: 'Letzte Änderung',
                    },
                    filter: {
                        mediaType: {
                            none: 'Alle',
                            movie: 'Filme',
                            tv: 'Serien',
                        },
                        status: {
                            none: 'Status: Alle',
                            queued: 'Status: ToDo',
                            notReleased: 'Status: Unveröffentlicht',
                            notAvailable: 'Status: Noch nicht erhältlich',
                            notFound: 'Status: Nicht gefunden',
                            redownload: 'Status: Erneut herunterladen',
                            downloading: 'Status: Wird heruntergeladen',
                            downloaded: 'Status: Erledigt',
                        },
                    },
                },

                details: {
                    originalTitle: 'Originaltitel',
                    status: 'Status',
                    runtime: 'Laufzeit',
                    rating: 'Bewertung',
                    director: 'Regisseur',
                    genres: 'Genres',
                    firstAirDate: 'Erstausstrahlung',
                    releaseDate: 'Veröffentlichung',
                    releaseDates: 'Veröffentlichungs Daten',
                    links: 'Links',
                    downloadActions: 'Downloads',
                    comments: 'Kommentare',
                    cast: 'Besetzung',
                    recommendations: 'Empfehlungen',
                    downloadLinks: 'Download Suche',
                    release: {
                        ch: {
                            type1: 'CH Premiere',
                            type2: 'CH Limitierter Kinostart',
                            type3: 'CH Kinostart',
                            type4: 'CH Digitale Veröffentlichung',
                            type5: 'CH DVD/Blu-ray',
                            type6: 'CH TV'
                        },
                        us: {
                            type1: 'US Premiere',
                            type2: 'US Limitierter Kinostart',
                            type3: 'US Kinostart',
                            type4: 'US Digitale Veröffentlichung',
                            type5: 'US DVD/Blu-ray',
                            type6: 'US TV'
                        },
                    },
                    actions: {
                        add: 'Hinzufügen',
                        remove: 'Entfernen',
                        redownload: 'Nochmals herunterladen',
                        notAvailable: 'Noch nicht verfügbar',
                        notFound: 'Nicht gefunden',
                        downloading: 'Wird heruntergeladen',
                        donwloaded: 'Erledigt',
                        comment: 'Kommentar',
                        addComment: 'Kommentar hinzufügen',
                        submit: 'Speichern',
                        cancel: 'Abbrechen',
                    }
                },

                history: {
                    filter: {
                        all: 'Alle',
                        updateStatus: 'Statusänderungen',
                        priorityChange: 'Prioritätswechel',
                        comments: 'Kommentare',
                        queued: 'Statusänderungen: Hinzugefügt',
                        notAvailable: 'Statusänderungen: Noch nicht verfügbar',
                        notFound: 'Statusänderungen: Nicht gefunden',
                        redownload: 'Statusänderungen: Nochmals herunterladen',
                        downloading: 'Statusänderungen: Wird heruntergeladen',
                        downloaded: 'Statusänderungen: Erledigt',
                        removed: 'Statusänderungen: Entfernt',
                    },
                    transaction: {
                        updatePriority: 'Priorität',
                        updateStatus: 'Statuswechsel',
                        comment: 'Kommentar',
                        queued: 'Hinzugefügt',
                        removed: 'Entfernt',
                        notAvailable: 'Noch nicht verfügbar',
                        notFound: 'Nicht gefunden',
                        redownload: 'Nochmals herunterladen',
                        downloading: 'Wird heruntergeladen',
                        downloaded: 'Erledigt',
                    },
                    label: {
                        title: 'Titel',
                        user: 'Benutzer',
                        timestamp: 'Datum/Zeit',
                        transaction: 'Transaktion',
                        previousValue: 'Vorheriger Wert',
                        newValue: 'Neuer Wert',
                        comment: 'Kommentar',
                    },
                },

                settings: {
                    themeSettings: 'Darstellungsoptionen',
                    darkTheme: 'Dunkles Design',
                    on: 'Ein',
                    off: 'Aus',
                    primaryColor: 'Hauptfarbe',
                    secondaryColor: 'Sekondärfarbe',
                    importSettings: 'Daten Import',
                    startImport: 'Import data',
                    cullImport: 'Cull data',
                    validateImport: 'Validate data',
                    cloudFunctions: 'Cloud Functions',
                    executeItemCountUpdate: 'Download Anzahl berechnen',
                    executeStatusUpdate : 'Status update durchführen',
                    itemCount: 'Download Anzahl',
                    statusUpdate: 'Status Update',
                    lastUpdate: 'Aktualisiert',
                    neverRun: 'Cloud function nie ausgeführt!',
                },

                error: {
                    message: 'Ooops, da ging etwas schief',
                    moviedb: {
                        items: {
                            load: 'TheMovieDb.org unerreichbar',
                        },
                        item: {
                            load: 'TheMovieDb.org unerreichbar',
                        },
                    },
                    firebase: {
                        auth: {
                            settings: {
                                admin: 'Fehler beim Laden der Userdaten',
                                user: 'Fehler beim Laden der Userdaten',
                            },
                        },
                        comments: {
                            add: 'Kommentar konnte nicht gespeichert werden',
                            load: 'Fehler beim Laden der Kommentare',
                            item: {
                                load: 'Fehler beim Laden der Kommentare',
                            },
                        },
                        configuration: {
                            load: 'Fehler beim Laden der Configuration',
                        },
                        history: {
                            load: 'Verlauf konnte nicht geladen werden',
                            item: 'Verlauf konnte nicht geladen werden',
                        },
                        transaction: {
                            user: {
                                add: '',
                            },
                            item: {
                                add: '',
                            },
                            last: {
                                update: '',
                            },
                        },
                        status: {
                            item: {
                                load: 'Firebase unerreichbar',
                                update: 'Status konnte nicht gespeichert werden',
                            },
                            list: {
                                load: 'Firebase unerreichbar',
                            },
                            priority: {
                                update: 'Priorität konnte nicht gespeichert werden',
                            }
                        },
                    },
                },
            }
        }
    }
});

export default i18n;