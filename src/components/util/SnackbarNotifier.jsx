import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'

import {
    IconButton,
    Snackbar,
    SnackbarContent } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

@inject('NotificationStore')
@observer
class SnackbarNotifier extends React.Component {
    displayed = new Map();
    state = {
        open: true
    }

    getNextNotification(notifications) {
        if (notifications.length <= 0 || this.state.ignore) {
            return null;
        }
        let result = null;
        notifications.every((notification) => {
            if (!this.displayed.has(notification.key)) {
                result = notification;
                this.displayed.set(notification.key, notification);
                return false;
            }
            return true;
        });
        console.debug(`${this.constructor.name}.getNextNotification()`, result);
        return result;
    }

    handleClick = (key) => {
        console.debug(`${this.constructor.name}.handleClick()`, key);
        this.props.NotificationStore.removeAllSnackbarNotifications();;
        this.setState({
            open: true,
        });
    };

    handleClose = (key) => {
        console.debug(`${this.constructor.name}.handleClose()`, key);
        this.props.NotificationStore.removeSnackbarNotification(key);
        this.setState({
            open: true,
        });
    };

    render () {
        const classes = this.props.classes;

        const notifications = this.props.NotificationStore.snackbarNotifications;
        const notification = this.getNextNotification(notifications);

        if (!notification)
        {
            return null;
        }
        
        console.debug(`${this.constructor.name}.render()`, notification);
        return (
            <Snackbar
                className={classes.margin}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={this.state.open && notification != null}
                autoHideDuration={5000}
                onClick={() => this.handleClose(notification.key)}
                onClose={() => this.handleClose(notification.key)}>
                <SnackbarContent
                    className={classes.primary}
                    aria-describedby="client-snackbar"
                    message={
                        ( notification.route ? 
                            <Link to={notification.route} id="client-snackbar" className={classes.message}>
                                <span>{notification.message}</span>
                                { notification.details &&
                                    <span>:&nbsp;{notification.details}</span>
                                }
                            </Link>
                        :
                            <div id="client-snackbar" className={classes.message}>
                                <span>{notification.message}</span>
                                { notification.details &&
                                    <span>:&nbsp;{notification.details}</span>
                                }
                            </div>
                        )
                    }
                    action={[
                        <IconButton key="close" aria-label="close" color="inherit" onClick={() => this.handleClick(notification.key)}>
                            <CloseIcon className={classes.icon} />
                        </IconButton>,
                    ]}
                />
            </Snackbar>
        )
    }
}

const styles = theme => ({
    root: {
    },
    primary: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.text.primary,
    },
    secondary: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.text.secondary,
    },
    icon: {
        fontSize: 20,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.text.primary,
        textDecoration: 'none',
    },
});

SnackbarNotifier.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SnackbarNotifier);