import {observable, action} from 'mobx';

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

    @observable defaultPrimary = indigo;
    @observable defaultSecondary = orange;
    @observable defaultType = 'dark';

    @observable drawerState = false;

    constructor () {
        this.loadTheme();
        this.applyTheme();
    }

    @action setPrimary(color) {
        this.primary = color;
        this.saveTheme();
        this.applyTheme();
    }

    @action setSecondary(color) {
        this.secondary = color;
        this.saveTheme();
        this.applyTheme();
    }

    @action setType(type) {
        this.type = type;
        this.saveTheme();
        this.applyTheme();
    }

    @action applyTheme() {
        const theme = createMuiTheme({
            typography: {
                useNextVariants: true,
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
    }

    @action saveTheme() {
        const theme = {
            type: this.type,
            primary: this.primary,
            secondary: this.secondary,
        }
        localStorage.setItem('varda.theme', JSON.stringify(theme));
    }

    @action loadTheme() {
        const theme = JSON.parse(localStorage.getItem('varda.theme'));
        if (theme) {
            this.type = theme.type;
            this.primary = theme.primary;
            this.secondary = theme.secondary;
            return;
        }
        this.type = this.defaultType;
        this.primary = this.defaultPrimary;
        this.secondary = this.defaultSecondary;
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