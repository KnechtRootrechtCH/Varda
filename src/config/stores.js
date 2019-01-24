import {configure} from 'mobx';

import AuthenticationStore from '../stores/AuthenticationStore';
import ConfigurationStore from '../stores/ConfigurationStore';
import DownloadStatusStore from '../stores/DownloadStatusStore';
import MovieDbStore from '../stores/MovieDbStore';
import ThemeStore from '../stores/ThemeStore';

// don't allow state modifications outside actions
configure({enforceActions: 'always'});

export default {
    AuthenticationStore,
    ConfigurationStore,
    DownloadStatusStore,
    MovieDbStore,
    ThemeStore,
}