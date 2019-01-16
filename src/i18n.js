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
                title: 'Varda - Download List',

                common: {
                    initializing: 'Initializing',
                    discover: 'Discover',
                    movies: 'Movies',
                    movie: 'Movie',
                    seriesPlural: 'Series',
                    series: 'Series',
                    list: 'Download List',
                },

                authentication: {
                    mail: 'Mail',
                    password: 'Password',
                    signIn: 'Sign in',
                    signOut: 'Sign out',
                    signUp: 'Signup here.',
                    noAccount: 'Don\'t have an account?',
                    signInError: 'Authentification failed.'
                }
            }
        },
        'de': {
            'translation': {
                title: 'Varda - Download Liste',

                common: {
                    initializing: 'Initialisierung',
                    discover: 'Entdecken',
                    movies: 'Filme',
                    movie: 'Film',
                    seriesPlural: 'Serien',
                    series: 'Serie',
                    list: 'Download Liste',
                },

                authentication: {
                    mail: 'Email',
                    password: 'Passwort',
                    signIn: 'Login',
                    signOut: 'Logout',
                    signUp: 'Hier registrieren.',
                    noAccount: 'Noch keinen Account?',
                    signInError: 'Authentifizierung fehlgeschlagen.'
                }
            }
        }
    }
});

export default i18n;