class LocalStorageService {
    // Theme
    themeTypeKey = 'varda.themeType';
    primaryColorKey = 'varda.primaryColor';
    secondaryColorKey = 'varda.secondaryColor';

    loadThemeType() {
        const value = localStorage.getItem(this.themeTypeKey);
        return value === 'undefined' ? 'dark' : value
    }

    loadPrimaryColor() {
        const value = localStorage.getItem(this.primaryColorKey);
        return value === 'undefined' ? null : JSON.parse(value);
    }

    loadSecondaryColor() {
        const value = localStorage.getItem(this.secondaryColorKey);
        return value === 'undefined' ? null : JSON.parse(value);
    }

    saveThemeType(value) {
        localStorage.setItem(this.themeTypeKey, value);
    }

    savePrimaryColor(value) {
        localStorage.setItem(this.primaryColorKey, JSON.stringify(value));
    }

    saveSecondaryColor(value) {
        localStorage.setItem(this.secondaryColorKey, JSON.stringify(value));
    }
}

// ensure single instance
const service = new LocalStorageService();
export default service;