import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';

import {
    FormControlLabel,
    Grid,
    Switch,
    Typography } from '@material-ui/core';

@withNamespaces()
@inject('CommentsStore')
@inject('DownloadHistoryStore')
@inject('NotificationStore')
@observer
class NotificationSettings extends React.Component {

    handleTransactionNotificationsToggle = () => {
        let current = this.props.NotificationStore.transactionNotifications;
        if (!current) {
            const t = this.props.t;
            this.props.NotificationStore.pushBrowserNotification(t('title'), t('settings.transactionNotificationsEnabled'), true, true, null);
        }
        this.props.NotificationStore.toggleTransactionNotifications();
    }

    handleCommentNotificationsToggle = () => {
        let current = this.props.NotificationStore.commentNotifications;
        if (!current) {
            const t = this.props.t;
            this.props.NotificationStore.pushBrowserNotification(t('title'), t('settings.commentNotificationsEnabled'), true, true, null);
        }
        this.props.NotificationStore.toggleCommentNotifications();
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        const transactionNotifications = this.props.NotificationStore.transactionNotifications;
        const commentNotifications = this.props.NotificationStore.commentNotifications;

        return (
            <Grid container className={classes.root} spacing={1}>
                <Grid item xs={12}>
                    <Typography className={classes.title} variant='subtitle1' component='h2'>
                        <span>{t('settings.notificationSettings')}</span>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        className={classes.switch}
                        labelPlacement='end'
                        control={
                            <Switch
                            checked={transactionNotifications}
                            onChange={this.handleTransactionNotificationsToggle}
                            color='primary'/>
                        }
                        label={
                            <Typography class={classes.label} variant='body1'>{t('settings.transactionNotifications')}</Typography>
                        }/>
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        className={classes.switch}
                        labelPlacement='end'
                        control={
                            <Switch
                            checked={commentNotifications}
                            onChange={this.handleCommentNotificationsToggle}
                            color='primary'/>
                        }
                        label={
                            <Typography class={classes.label} variant='body1'>{t('settings.commentNotifications')}</Typography>
                        }/>
                </Grid>
            </Grid>
        );
     }
}

const styles = theme => ({
    root: {
        maxWidth: 350,
        marginTop: theme.spacing(1),
    },
    title: {
        margin: 0,
        color: theme.palette.text.primary,
    },
    switch: {
        margin: 0,
    },
    label: {
        color: theme.palette.text.primary,
    },
});

NotificationSettings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(NotificationSettings));