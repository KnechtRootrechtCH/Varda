import {configure} from 'mobx';

import AuthenticationStore from '../stores/AuthenticationStore';
import CloudFunctionsStore from '../stores/CloudFunctionsStore';
import CommentsStore from '../stores/CommentsStore';
import ConfigurationStore from '../stores/ConfigurationStore';
import DataExportStore from '../stores/DataExportStore';
import DownloadHistoryStore from '../stores/DownloadHistoryStore';
import DownloadStatusStore from '../stores/DownloadStatusStore';
import ErrorHandlingStore from '../stores/ErrorHandlingStore';
import ListSearchStore from '../stores/ListSearchStore';
import MovieDbStore from '../stores/MovieDbStore';
import NotificationStore from '../stores/NotificationStore';
import ThemeStore from '../stores/ThemeStore';

// don't allow state modifications outside actions
configure({enforceActions: 'always'});

export default {
    AuthenticationStore,
    CloudFunctionsStore,
    CommentsStore,
    ConfigurationStore,
    DataExportStore,
    DownloadHistoryStore,
    DownloadStatusStore,
    ErrorHandlingStore,
    ListSearchStore,
    MovieDbStore,
    NotificationStore,
    ThemeStore,
}