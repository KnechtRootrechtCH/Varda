import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';

import {
    Typography } from '@material-ui/core';

import {
    Calendar,
    CalendarSearch,
    Check,
    ClockOutline,
    Download,
    EyeOff,
    Sigma,
    Sync }  from 'mdi-material-ui';

@withNamespaces()
@inject('AuthenticationStore')
@observer
class ItemCountSettings extends React.Component {

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        const itemCounts = this.props.AuthenticationStore.itemCounts;
        const total = itemCounts && itemCounts['total'] ? itemCounts['total'] : '0';
        const queued = itemCounts && itemCounts['queued'] ? itemCounts['queued'] : '0';
        const notReleased = itemCounts && itemCounts['notReleased'] ? itemCounts['notReleased'] : '0';
        const notAvailable = itemCounts && itemCounts['notAvailable'] ? itemCounts['notAvailable'] : '0';
        const notFound = itemCounts && itemCounts['notFound'] ? itemCounts['notFound'] : '0';
        const redownload = itemCounts && itemCounts['redownload'] ? itemCounts['redownload'] : '0';
        const downloading = itemCounts && itemCounts['downloading'] ? itemCounts['downloading'] : '0';
        const downloaded = itemCounts && itemCounts['downloaded'] ? itemCounts['downloaded'] : '0';

        return (
            <div className={classes.root}>
                <Typography className={classes.title} variant='subtitle1' component='h2'>
                    <span>{t('settings.itemCount')}</span>
                </Typography>
                <div className={classes.actions}>
                    <Typography className={classes.text} variant='body2' component='h2'>
                        <ClockOutline className={classes.icon} color='primary'/>
                        <span>{queued}</span>
                        <span>&nbsp;&ndash;&nbsp;{t('common.status.queued')}</span>
                    </Typography>
                    <Typography className={classes.text} variant='body2' component='h2'>
                        <Calendar className={classes.icon} color='primary'/>
                        <span>{notReleased}</span>
                        <span>&nbsp;&ndash;&nbsp;{t('common.status.notReleased')}</span>
                    </Typography>
                    <Typography className={classes.text} variant='body2' component='h2'>
                        <CalendarSearch className={classes.icon} color='primary'/>
                        <span>{notAvailable}</span>
                        <span>&nbsp;&ndash;&nbsp;{t('common.status.notAvailable')}</span>
                    </Typography>
                    <Typography className={classes.text} variant='body2' component='h2'>
                        <EyeOff className={classes.icon} color='primary'/>
                        <span>{notFound}</span>
                        <span>&nbsp;&ndash;&nbsp;{t('common.status.notFound')}</span>
                    </Typography>
                    <Typography className={classes.text} variant='body2' component='h2'>
                        <Sync className={classes.icon} color='primary'/>
                        <span>{redownload}</span>
                        <span>&nbsp;&ndash;&nbsp;{t('common.status.redownload')}</span>
                    </Typography>
                    <Typography className={classes.text} variant='body2' component='h2'>
                        <Download className={classes.icon} color='primary'/>
                        <span>{downloading}</span>
                        <span>&nbsp;&ndash;&nbsp;{t('common.status.downloading')}</span>
                    </Typography>
                    <Typography className={classes.text} variant='body2' component='h2'>
                        <Check className={classes.icon} color='primary'/>
                        <span>{downloaded}</span>
                        <span>&nbsp;&ndash;&nbsp;{t('common.status.downloaded')}</span>
                    </Typography>
                    <Typography className={classes.text} variant='body2' component='h2'>
                        <Sigma className={classes.icon} color='primary'/>
                        <span>{total}</span>
                        <span>&nbsp;&ndash;&nbsp;{t('common.total')}</span>
                    </Typography>
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
        color: theme.palette.text.disabled,
    },
});

ItemCountSettings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(ItemCountSettings));