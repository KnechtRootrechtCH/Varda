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
class StatusUpdateSettings extends React.Component {

    handleExecute = () => {
        // console.debug(`${this.constructor.name}.handleExecute()`);
        this.props.CloudFunctionsStore.executeStatusUpdateCloudFunction();
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        const timestamp = this.props.CloudFunctionsStore.statusUpdateTimestamp;
        const lastUpdated = timestamp ? Moment(timestamp) : null;
        const updateString = lastUpdated ? `${t('settings.lastUpdate')}: ${lastUpdated.format('DD.MM.YYYY')}` : t('settings.neverRun');

        return (
            <div className={classes.root}>
                <Typography className={classes.title} variant='subtitle1' component='h2'>
                    <span>{t('settings.statusUpdate')}</span>
                </Typography>
                <div className={classes.actions}>
                    <Typography className={classes.text} variant='body2' component='h2'>
                        <span>{updateString}</span>
                    </Typography>
                    <Button
                        className={classes.button}
                        color='primary'
                        variant='text'
                        disabled={this.props.CloudFunctionsStore.actionRunning}
                        onClick={() => this.handleExecute()}>
                        {t('settings.executeStatusUpdate')}
                    </Button>
                </div>
            </div>
        );
     }
}

const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
    icon: {
        marginRight: theme.spacing.unit,
        verticalAlign: 'middle',
        marginBottom: 3,
    },
    text: {
        marginBottom: theme.spacing.unit / 2,
    },
});

StatusUpdateSettings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(StatusUpdateSettings));