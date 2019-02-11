import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import { withNamespaces } from 'react-i18next';

@withNamespaces()
@inject('NotificationStore')
@observer
class Notifier extends React.Component {

    componentDidUpdate () {
        const t = this.props.t;
        const notifications = this.props.NotificationStore.notifications;
        const index = this.props.NotificationStore.index;

        if(notifications.length > index) {
            for (let i = index; i < notifications.length; i++) {
                const notification = notifications[i];
                let message = notification.translateMessage ? t(notification.message) : notification.message;
                if (notification.details) {
                    const details = notification.translateDetails ? t(notification.details) : notification.details;
                    message = `${message}: ${details}`;
                }

                this.props.enqueueSnackbar(message, {
                    variant: notification.variant,
                });
            }
            this.props.NotificationStore.setIndex(notifications.length);
        }
    }

    render () {
        const notifications = this.props.NotificationStore.notifications;
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