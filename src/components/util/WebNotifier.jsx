import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import Notification from 'react-web-notification';

@inject('NotificationStore')
@observer
class WebNotifier extends React.Component {
    state = {
        displayed: new Map(),
        ignore: false
    }
    displayed = new Map();

    handlePermissionGranted(){
        console.debug(`${this.constructor.name}.handlePermissionGranted()`);
        this.setState({
            ignore: false,
        });
    }

    handlePermissionDenied(){
        console.debug(`${this.constructor.name}.handlePermissionDenied()`);
        this.setState({
            ignore: true,
        });
    }

    handleNotSupported(){
        console.debug(`${this.constructor.name}.handleNotSupported()`);
        this.setState({
            ignore: true,
        });
    }

    handleNotificationOnClick(e, tag){
        const notification = this.displayed.get(tag);
        console.debug(`${this.constructor.name}.handleNotificationOnClick()`, e, tag, notification);

        // If route is available, navigate there
        if (notification && notification.route) {
            this.props.history.push(notification.route)
        }
    }
    
    handleNotificationOnError(e, tag){
        console.debug(`${this.constructor.name}.handleNotificationOnError()`, e, tag);
    }
    
    handleNotificationOnClose(e, tag){
        console.debug(`${this.constructor.name}.handleNotificationOnClose()`, e, tag);
    }
    
    handleNotificationOnShow(e, tag){
        console.debug(`${this.constructor.name}.handleNotificationOnShow()`, e, tag);
        this.props.NotificationStore.removeBrowserNotification(tag);
    }

    getNextNotification(notifications) {
        if (notifications.length <= 0 || this.state.ignore) {
            return null;
        }
        let result = null;
        notifications.every((notification) => {
            if (!this.displayed.has(notification.key)) {
                this.displayed.set(notification.key, notification);
                result = notification;
                return false;
            }
            return true;
        });
        return result;
    }

    render () {
        const notifications = this.props.NotificationStore.browserNotifications;
        const notification = this.getNextNotification(notifications);

        if (!notification)
        {
            return null;
        }

        const title = notification.message;
        const options = {
            tag: notification.key,
            body:  notification.details,
            icon: 'favicon.png',
        }
        console.debug(`${this.constructor.name}.render()`, title, options);

        return (
            <div>
                    
                    return (
                        <Notification
                            ignore={this.state.ignore && title !== ''}
                            notSupported={this.handleNotSupported.bind(this)}
                            onPermissionGranted={this.handlePermissionGranted.bind(this)}
                            onPermissionDenied={this.handlePermissionDenied.bind(this)}
                            onShow={this.handleNotificationOnShow.bind(this)}
                            onClick={this.handleNotificationOnClick.bind(this)}
                            onClose={this.handleNotificationOnClose.bind(this)}
                            onError={this.handleNotificationOnError.bind(this)}
                            timeout={0}
                            title={title}
                            options={options}
                            swRegistration={this.props.swRegistration}
                        />
                    )
                })}
            </div>
            
        );
    }
}

const styles = theme => ({
    root: {
    },
});

WebNotifier.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(WebNotifier));