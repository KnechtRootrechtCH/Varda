import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';

@inject('NotificationStore')
@observer
class Notifier extends React.Component {
    displayed = [];

    storeDisplayed = (id) => {
        this.displayed = [...this.displayed, id];
    };

    componentDidUpdate () {
        const notifications = this.props.NotificationStore.snackbarNotifications;

        notifications.forEach((notification) => {
            // Do nothing if snackbar is already displayed
            if (this.displayed.includes(notification.key)) return;
            // Display snackbar using notistack
            this.props.enqueueSnackbar(notification.message, notification.options);
            // Keep track of snackbars that we've displayed
            this.storeDisplayed(notification.key);
            // Dispatch action to remove snackbar from mobx store
            this.props.NotificationStore.removeSnackbarNotification(notification.key);
        });
    }

    render () {
        const notifications = this.props.NotificationStore.snackbarNotifications;
        // trigger update by accesssing notifications
        if (notifications > 0) {
            return null;
        }
        return null;
    }
}

const styles = theme => ({
    root: {
    },
});

Notifier.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withSnackbar(Notifier));