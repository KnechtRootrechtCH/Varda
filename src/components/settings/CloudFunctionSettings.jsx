import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import * as Moment from 'moment';

import {
    Button,
    Typography } from '@material-ui/core';

@withNamespaces()
@inject('CloudFunctionsStore')
@observer
class CloudFunctionSettings extends React.Component {

    handleStatusUpdateExecute = () => {
        this.props.CloudFunctionsStore.executeStatusUpdateCloudFunction();
    }

    handleCountUpdateExecute = () => {
        this.props.CloudFunctionsStore.executeUpdateItemCountsFunction();
    }

    handleRequeueItemsExecute = () => {
        this.props.CloudFunctionsStore.executereRequeueItemsCloudFunction();
    }


    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        const statusUpdate = this.props.CloudFunctionsStore.statusUpdateTimestamp;
        const statusUpdateTimestamp = statusUpdate ? Moment(statusUpdate.toDate()) : null;
        const statusUpdateString = statusUpdateTimestamp ? `${t('settings.lastUpdate')}: ${statusUpdateTimestamp.format('DD.MM.YYYY HH:mm')}` : t('settings.neverRun');

        const countUpdate = this.props.CloudFunctionsStore.itemCountTimestamp;
        const countUpdateTimestamp = countUpdate ? Moment(countUpdate) : null;
        const countUpdateString = countUpdateTimestamp ? `${t('settings.lastUpdate')}: ${countUpdateTimestamp.format('DD.MM.YYYY HH:mm')}` : t('settings.neverRun');

        const requeueItems = this.props.CloudFunctionsStore.requeueItemsTimestamp;
        const requeueItemsTimestamp = requeueItems ? Moment(requeueItems) : null;
        const requeueItemsString = requeueItemsTimestamp ? `${t('settings.lastUpdate')}: ${requeueItemsTimestamp.format('DD.MM.YYYY HH:mm')}` : t('settings.neverRun');

        return (
            <div className={classes.root}>
                <Typography className={classes.title} variant='subtitle1' component='h2'>
                    <span>{t('settings.cloudFunctions')}</span>
                </Typography>
                <div className={classes.actions}>
                    <Button
                        className={classes.button}
                        color='primary'
                        variant='text'
                        disabled={this.props.CloudFunctionsStore.actionRunning}
                        onClick={() => this.handleStatusUpdateExecute()}>
                        {t('settings.executeStatusUpdate')}
                    </Button>
                    <Typography className={classes.text} variant='body2' component='h2'>
                        <span>{statusUpdateString}</span>
                    </Typography>
                </div>
                <div className={classes.actions}>
                    <Button
                        className={classes.button}
                        color='primary'
                        variant='text'
                        disabled={this.props.CloudFunctionsStore.actionRunning}
                        onClick={() => this.handleCountUpdateExecute()}>
                        {t('settings.executeItemCountUpdate')}
                    </Button>
                    <Typography className={classes.text} variant='body2' component='h2'>
                        <span>{countUpdateString}</span>
                    </Typography>
                </div>
                <div className={classes.actions}>
                    <Button
                        className={classes.button}
                        color='primary'
                        variant='text'
                        disabled={this.props.CloudFunctionsStore.actionRunning}
                        onClick={() => this.handleRequeueItemsExecute()}>
                        {t('settings.executeRequeueItems')}
                    </Button>
                    <Typography className={classes.text} variant='body2' component='h2'>
                        <span>{requeueItemsString}</span>
                    </Typography>
                </div>
            </div>
        );
     }
}

const styles = theme => ({
    root: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    actions: {
        marginTop: theme.spacing(1),
    },
    button: {
        paddingLeft: 0,
        paddingRight: 0,
    },
    icon: {
        marginRight: theme.spacing(1),
        verticalAlign: 'middle',
        marginBottom: 3,
    },
    text: {
        marginBottom: theme.spacing(0.5),
        color: theme.palette.text.disabled,
    },
    title: {
        color: theme.palette.text.primary,
    },
});

CloudFunctionSettings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(CloudFunctionSettings));