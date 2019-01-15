import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import * as serviceWorker from './serviceWorker';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'mobx-react';

import App from './App';
import AuthenticationStore from './stores/AuthenticationStore';
import ThemeStore from './stores/ThemeStore';
import i18n from './i18n.js';

const Root = (
    <Provider AuthenticationStore={AuthenticationStore} ThemeStore={ThemeStore}>
        <I18nextProvider i18n={i18n}>
            <App/>
        </I18nextProvider>
    </Provider>
);

ReactDOM.render(Root, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
