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
                    list: 'Download List',
                    listShort: 'Downloads',
                    settings: 'Settings',
                    search: 'Search',
                    history: 'History',
                    messages: 'Messages',
                    more: 'more',
                    less: 'less',
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
                            loading: '',
                        },
                    },
                },

                details: {
                    originalTitle: 'Original title',
                    runtime: 'Runtime',
                    rating: 'Rating',
                    director: 'Director',
                    genres: 'Genres',
                    firstAirDate: 'First air date',
                    releaseDate: 'Release date',
                    releaseDates: 'Release dates',
                    links: 'Links',
                    downloadActions: 'Actions',
                    comments: 'Comments',
                    cast: 'Cast',
                    recommendations: 'Recommendations',
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
                }
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
                    list: 'Download Liste',
                    listShort: 'Downloads',
                    settings: 'Einstellungen',
                    search: 'Suchen',
                    history: 'Verlauf',
                    messages: 'Nachrichten',
                    more: 'mehr',
                    less: 'weniger',
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
                            notFound: 'nicht gefunden',
                            redownload: 'nochmals herunterladen',
                            downloading: 'wird heruntergeladen',
                            downloaded: '',
                            loading: '',
                        },
                    },
                },

                details: {
                    originalTitle: 'Originaltitel',
                    runtime: 'Laufzeit',
                    rating: 'Bewertung',
                    director: 'Regisseur',
                    genres: 'Genres',
                    firstAirDate: 'Erstausstrahlung',
                    releaseDate: 'Veröffentlichung',
                    releaseDates: 'Veröffentlichungs Daten',
                    links: 'Links',
                    downloadActions: 'Aktionen',
                    comments: 'Kommentare',
                    cast: 'Besetzung',
                    recommendations: 'Empfehlungen',
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
                }
            }
        }
    }
});

export default i18n;