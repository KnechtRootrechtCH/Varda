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
@inject('AuthenticationStore')
@inject('CommentsStore')
@inject('DownloadHistoryStore')
@observer
class NotificationSettings extends React.Component {

    handleTransactionNotificationsToggle = () => {
        this.props.DownloadHistoryStore.toggleNotifactions();
    }

    handleCommentNotificationsToggle = () => {
        this.props.CommentsStore.toggleNotifactions();
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        const transactionNotifications = this.props.AuthenticationStore.transactionNotificationsEnabled;
        const commentNotifications = this.props.AuthenticationStore.commentNotificationsEnabled;

        return (
            <Grid container className={classes.root} spacing={8}>
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
                            <Typography variant='body1' component='h3'>{t('settings.transactionNotifications')}</Typography>
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
                            <Typography variant='body1' component='h3'>{t('settings.commentNotifications')}</Typography>
                        }/>
                </Grid>
            </Grid>
        );
     }
}

const styles = theme => ({
    root: {
        maxWidth: 350,
        marginTop: theme.spacing.unit,
    },
    title: {
        margin: 0,
    },
    switch: {
        margin: 0,
    }
});

NotificationSettings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(NotificationSettings));