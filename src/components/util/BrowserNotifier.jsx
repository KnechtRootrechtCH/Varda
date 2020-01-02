import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import ReactNotifications from 'react-browser-notifications';

@inject('NotificationStore')
@observer
class BrowserNotifier extends React.Component {
    displayed = new Map();

    componentDidUpdate () {
        const notifications = this.props.NotificationStore.browserNotifications;

        if (notifications.length <= 0) {
            return null;
        }

        notifications.forEach((notification) => {
            // Do nothing if notification is already displayed
            if (this.displayed.has(`${notification.key}`)) return;
            // Display browser notification
            this.showNotification(notification);
            // Keep track of notifications that we've displayed
            this.displayed.set(`${notification.key}`, notification);
            // Dispatch action to remove notification from mobx store
            this.props.NotificationStore.removeBrowserNotification(notification.key);
        });
    }

    showNotification(notification) {
        console.log(`${this.constructor.name}.showNotification()`, notification);
        // If the Notifications API is supported by the browser
        // then show the notification
        if(this.n.supported()) this.n.show();
    }

    handleClick(event) {
        const notification = this.displayed.get(event.target.tag);
        console.log(`${this.constructor.name}.handleClick()`, event, notification);

        // If route is available, navigate there
        if (notification && notification.route) {
            this.props.history.push(notification.route)
        }

        // Close the notification
        this.n.close(event.target.tag);
    }

    render () {
        const notifications = this.props.NotificationStore.browserNotifications;
        if (notifications.length <= 0) {
            return null;
        }
        const notification = notifications[0];
        console.log(`${this.constructor.name}.render()`, notification);

        return (
              <ReactNotifications
                onRef={ref => (this.n = ref)} // Required
                title={notification.message} // Required
                body={notification.details}
                icon='favicon.png'
                tag={notification.key}
                onClick={event => this.handleClick(event)}
              />
          )
    }
}

const styles = theme => ({
    root: {
    },
});

BrowserNotifier.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(BrowserNotifier));