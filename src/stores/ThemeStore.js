import {observable, action} from 'mobx';

import LocalStorageService from '../service/LocalStorageService';

import { createMuiTheme } from '@material-ui/core/styles';
import {red, pink, purple, deepPurple} from '@material-ui/core/colors';
import {indigo, blue, lightBlue, cyan} from '@material-ui/core/colors';
import {teal, green, lightGreen, lime} from '@material-ui/core/colors';
import {yellow, amber, orange, deepOrange} from '@material-ui/core/colors';
import {grey, blueGrey} from '@material-ui/core/colors';

class ThemeStore {
    @observable colors = [
        red, pink, purple, deepPurple,
        indigo, blue, lightBlue, cyan,
        teal, green, lightGreen, lime,
        yellow, amber, orange, deepOrange,
        grey, blueGrey];

    @observable theme = {};
    @observable primary = {};
    @observable secondary = {};
    @observable type = '';

    @observable defaultPrimary = cyan;
    @observable defaultSecondary = orange;
    @observable defaultType = 'dark';

    @observable drawerState = false;

    constructor () {
        this.setDefaultTheme();

        // TODO: add theme settings page
        /*
        const primary = LocalStorageService.loadPrimaryColor();
        if (primary && primary['500']) {
          this.primary = primary;
        }

        const secondary = LocalStorageService.loadSecondaryColor();
        if (secondary && secondary['500']) {
          this.secondary = secondary;
        }

        const type = LocalStorageService.loadThemeType();
        if (type) {
          this.type = type;
        }
        */

        this.applyTheme();
    }

    @action setDefaultTheme() {
        this.setType(this.defaultType);
        this.setPrimary(this.defaultPrimary);
        this.setSecondary(this.defaultSecondary);
    }

    @action setPrimary(color) {
        this.primary = color;
    }

    @action setSecondary(color) {
        this.secondary = color;
    }

    @action setType(type) {
        this.type = type;
    }

    @action applyTheme() {
        const theme = createMuiTheme({
            typography: {
                useNextVariants: true,
                h6: {
                    textTransform: 'uppercase',
                },
                subtitle1: {
                    textTransform: 'uppercase',
                },
                caption: {
                    textTransform: 'uppercase',
                },
            },
            palette: {
                type: this.type,
                primary: this.primary,
                secondary: this.secondary,
            },
            zIndex: {
                appBar: 1200,
                drawer: 1100,
            }
        });
        console.debug('ThemeStore.applyTheme() : ', theme);
        this.theme = theme;
        LocalStorageService.savePrimaryColor(this.primary);
        LocalStorageService.saveSecondaryColor(this.secondary);
        LocalStorageService.saveThemeType(this.type);
    }

    @action setDrawerState(state) {
        this.drawerState = state;
        localStorage.setItem('varda.drawerState', JSON.stringify(state));
    }

    @action loadDrawerState() {
        this.drawerState = JSON.parse(localStorage.getItem('varda.drawerState'));
    }
}

// ensure single instance
const store = new ThemeStore();
export default store;