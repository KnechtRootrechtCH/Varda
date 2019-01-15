import i18n from 'i18next';

i18n.init({
    debug: true,
  
    lng: 'de-CH',
    
    react: {
        wait: false,
        bindI18n: 'languageChanged loaded',
        bindStore: 'added removed',
        nsMode: 'default'
    },

    resources: {
        'en-US': {
            'translation': {
                title: 'Varda - Download List'
            }
        },
        'de-CH': {
            'translation': {
                title: 'Varda - Download Liste'
            }
        }
    }
});

export default i18n;