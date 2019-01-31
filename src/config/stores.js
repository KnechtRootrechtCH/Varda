import {configure} from 'mobx';

import AuthenticationStore from '../stores/AuthenticationStore';
import CommentsStore from '../stores/CommentsStore';
import ConfigurationStore from '../stores/ConfigurationStore';
import DownloadHistoryStore from '../stores/DownloadHistoryStore';
import DownloadStatusStore from '../stores/DownloadStatusStore';
import MovieDbStore from '../stores/MovieDbStore';
import ThemeStore from '../stores/ThemeStore';

// don't allow state modifications outside actions
configure({enforceActions: 'always'});

export default {
    AuthenticationStore,
    CommentsStore,
    ConfigurationStore,
    DownloadHistoryStore,
    DownloadStatusStore,
    MovieDbStore,
    ThemeStore,
}