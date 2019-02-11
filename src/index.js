import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import * as serviceWorker from './serviceWorker';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'mobx-react';
import { SnackbarProvider } from 'notistack';

import App from './App';
import i18n from './i18n.js';

import stores from './config/stores'

const Root = (
    <Provider {...stores}>
        <I18nextProvider i18n={i18n}>
            <SnackbarProvider maxSnack={3}>
                <App/>
            </SnackbarProvider>
        </I18nextProvider>
    </Provider>
);

ReactDOM.render(Root, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
