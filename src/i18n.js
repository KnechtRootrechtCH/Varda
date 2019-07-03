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
                    date: 'Date',
                    loading: 'Loading',
                    discover: 'Discover',
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
                    ok: 'Ok',
                    next: 'Next',
                    back: 'Back',
                    previous: 'Previous',
                    count: 'Count',
                    seasons: 'Seasons',
                    season: 'Season',
                    episodes: 'Episodes',
                    episode: 'Episode',
                    status: {
                        label: 'Status',
                        none: 'All',
                        removed: '',
                        queued: 'Todo',
                        notReleased: 'Unreleased',
                        notAvailable: 'Not yey available',
                        notFound: 'Not found',
                        redownload: 'Retry',
                        downloading: 'Downloading',
                        downloaded: 'Done',
                    },
                    mediaType: {
                        label: 'MediaType',
                        none: 'All',
                        movie: 'Movie',
                        tv: 'TV Series',
                        plural: {
                            none: 'All',
                            movie: 'Movies',
                            tv: 'TV Series',
                        }
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
                        markForRedownload: 'Retry',
                        status: {
                            removed: '',
                            queued: '',
                            notReleased: 'unreleased',
                            notAvailable: 'not yet available',
                            notFound: 'not found',
                            redownload: 'retry',
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
                    episodeListNotAvailable: 'Episode list not yet available.',
                    lastEpisode: 'Last episode',
                    nextEpisode: 'Next episode',
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
                        queue: 'Queue',
                        remove: 'Remove',
                        redownload: 'Retry',
                        notAvailable: 'Not yet available',
                        notFound: 'Not found',
                        downloading: 'Downloading',
                        donwloaded: 'Done',
                        comment: 'Comment',
                        addComment: 'Add comment',
                        submit: 'Submit',
                        cancel: 'Cancel',
                        markSeasonDownloaded: 'Mark season done',
                        markSeasonNotDownloaded: 'Requeue season',
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
                        redownload: 'Status updates: Retry',
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
                        redownload: 'Retry',
                        downloading: 'Downloading',
                        downloaded: 'Done',
                        updateSeasonStatus: 'Season',
                        updateEpisodeStatus: 'Episode',
                    },
                    label: {
                        title: 'Title',
                        user: 'User',
                        timestamp: 'Date/Time',
                        transaction: 'Transaction',
                        previousValue: 'Old value',
                        newValue: 'New value',
                        comment: 'Comment',
                        subTarget: 'Season/Episode',
                    },
                },

                settings: {
                    accountInformation: 'User Information',
                    dataAccountInformation: 'User Information (Data)',
                    userName: 'Username',
                    dataUserName: 'Data Username',
                    id: 'User ID',
                    dataId: 'Data User ID',
                    lastAccess: 'Last access',
                    lastTransaction: 'Last transaction',
                    commentsTimestamp: 'Comments timestamp',
                    transactionTimestamp: 'Transactions timestamp',
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
                    lastUpdate: 'Last execution',
                    neverRun: 'Cloud function never executed!',
                    export: {
                        title: 'Data Export',
                        statusFilter: 'Select status filter',
                        typeFilter: 'Select type filter',
                        load: 'Load export data',
                        loadDescription: 'This might take several seconds to complete.',
                        loadButton: 'Start',
                        loading: 'Loading data…',
                        save: 'Save export data',
                        saveDescription: 'Successfully loaded datasets',
                        saveTxtButton: 'TXT Export',
                        saveCsvButton: 'CSV Export',
                        saveDbExportButton: 'DB Export',
                        fileHeader: 'Data Export',
                        resetButton: 'Reset',
                        fields: {
                            id: 'ID',
                            title: 'Title',
                            release: 'Release Date',
                            status: 'Status',
                            priority: 'Priority',
                        },
                    },
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
                        season: {
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
                            updateTimestamp: 'Failed to save comments view timestamp',
                            count: 'Failed to load new comments count',
                        },
                        configuration: {
                            load: 'Error loading configuration',
                        },
                        history: {
                            load: 'Error loading history',
                            item: 'Error loading history',
                            updateTimestamp: 'Failed to save history view timestamp',
                            count: 'Failed to load new history entries count',
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
                    date: 'Datum',
                    loading: 'Lade',
                    discover: 'Entdecken',
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
                    ok: 'Ok',
                    next: 'Nächste',
                    back: 'Zurück',
                    previous: 'Verherige',
                    count: 'Anzahl',
                    seasons: 'Staffeln',
                    season: 'Staffel',
                    episodes: 'Episoden',
                    episode: 'Episode',
                    status: {
                        label: 'Status',
                        none: 'Alle',
                        removed: '',
                        queued: 'Todo',
                        notReleased: 'Unveröffentlicht',
                        notAvailable: 'Noch nicht erhältlich',
                        notFound: 'Nicht gefunden',
                        redownload: 'Nochmals suchen',
                        downloading: 'Wird heruntergeladen',
                        downloaded: 'Erledigt',
                    },
                    mediaType: {
                        label: 'Medien-Typ',
                        none: 'Alle',
                        movie: 'Film',
                        tv: 'Serie',
                        plural: {
                            none: 'Alle',
                            movie: 'Filme',
                            tv: 'Serien',
                        }
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
                        markForRedownload: 'Nochmals suchen',
                        status: {
                            removed: '',
                            queued: '',
                            notReleased: 'unveröffentlicht',
                            notAvailable: 'noch nicht erhältlich',
                            notFound: 'nicht gefunden',
                            redownload: 'nochmals suchen',
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
                    episodeListNotAvailable: 'Episodenliste noch nicht verfügbar.',
                    lastEpisode: 'Letzte Episode',
                    nextEpisode: 'Nächste Episode',
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
                        queue: 'ToDo',
                        remove: 'Entfernen',
                        redownload: 'Nochmals suchen',
                        notAvailable: 'Noch nicht verfügbar',
                        notFound: 'Nicht gefunden',
                        downloading: 'Wird heruntergeladen',
                        donwloaded: 'Erledigt',
                        comment: 'Kommentar',
                        addComment: 'Kommentar hinzufügen',
                        submit: 'Speichern',
                        cancel: 'Abbrechen',
                        markSeasonDownloaded: 'Staffel erledigt',
                        markSeasonNotDownloaded: 'Staffel zurücksetzen',
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
                        redownload: 'Statusänderungen: Nochmals suchen',
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
                        redownload: 'Nochmals suchen',
                        downloading: 'Wird heruntergeladen',
                        downloaded: 'Erledigt',
                        updateSeasonStatus: 'Staffel',
                        updateEpisodeStatus: 'Episode',
                    },
                    label: {
                        title: 'Titel',
                        user: 'Benutzer',
                        timestamp: 'Datum/Zeit',
                        transaction: 'Transaktion',
                        previousValue: 'Vorheriger Wert',
                        newValue: 'Neuer Wert',
                        comment: 'Kommentar',
                        subTarget: 'Staffel/Episode',
                    },
                },

                settings: {
                    accountInformation: 'User Informationen',
                    dataAccountInformation: 'User Informationen (Daten)',
                    userName: 'Benutzername',
                    dataUserName: 'Daten Beutzername',
                    id: 'Benutzer ID',
                    dataID: 'Daten Benutzer ID',
                    lastAccess: 'Letzter Zugriff',
                    lastTransaction: 'Letzte Transaktion',
                    commentsTimestamp: 'Kommentar-Zeitstempel',
                    transactionTimestamp: 'Transaktions-Zeitstempel',
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
                    lastUpdate: 'Letzte Ausführung',
                    neverRun: 'Cloud Function nie ausgeführt!',
                    export: {
                        title: 'Datenexport',
                        statusFilter: 'Status Filter auswählen',
                        typeFilter: 'Medien-Typ Filter auswählen',
                        load: 'Export-Daten laden',
                        loadDescription: 'Diese Operation kann einige Sekunden dauern.',
                        loadButton: 'Start',
                        loading: 'Daten werden geladen…',
                        save: 'Export-Daten speichern',
                        saveDescription: 'Datensätze erfolgreich geladen: ',
                        saveTxtButton: 'TXT Export',
                        saveCsvButton: 'CSV Export',
                        saveDbExportButton: 'DB Export',
                        fileHeader: 'Datenexport',
                        resetButton: 'Reset',
                        fields: {
                            id: 'ID',
                            title: 'Titel',
                            release: 'Veröffentlichung',
                            status: 'Status',
                            priority: 'Priorität',
                        },
                    },
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
                        season: {
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
                            updateTimestamp: 'Fehler beim Speicher des Kommentar-Zeitstempels',
                            count: 'Fehler beim Laden der Anzahl neuer Kommentare',
                        },
                        configuration: {
                            load: 'Fehler beim Laden der Configuration',
                        },
                        history: {
                            load: 'Verlauf konnte nicht geladen werden',
                            item: 'Verlauf konnte nicht geladen werden',
                            updateTimestamp: 'Fehler beim Speicher des Verlauf-Zeitstempels',
                            count: 'Fehler beim Laden der Anzahl neuer Verlauf-Enträge',
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
            },
        },
    },
});

export default i18n;