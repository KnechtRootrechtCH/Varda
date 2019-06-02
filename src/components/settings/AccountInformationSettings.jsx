import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import * as Moment from 'moment';

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
class AccountInformationSettings extends React.Component {

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
        const usernameString = `${t('settings.userName')}: ${this.props.AuthenticationStore.displayName}`;
        const dataUsernameString = `${t('settings.userName')}: ${this.props.AuthenticationStore.dataUserDisplayName}`;
        const uidString = `${t('settings.id')}: ${this.props.AuthenticationStore.uid}`;
        const dataUidString = `${t('settings.id')}: ${this.props.AuthenticationStore.dataUid}`
        const crossAccountAdmin = this.props.AuthenticationStore.isAdmin && this.props.AuthenticationStore.dataUid !== this.props.AuthenticationStore.uid;

        const lastAccess = this.props.AuthenticationStore.lastAccess ? Moment(this.props.AuthenticationStore.lastAccess).format('dddd DD.MM.YYYY HH:mm') : '-';
        const lastAccessString = `${t('settings.lastAccess')}: ${lastAccess}`;

        const lastTransaction = this.props.AuthenticationStore.lastTransactionTimestamp ? Moment(this.props.AuthenticationStore.lastTransactionTimestamp).format('dddd DD.MM.YYYY HH:mm') : '-';
        const lastTransactionString = `${t('settings.lastTransaction')}: ${lastTransaction}`;
        
        const commentsTimestamp = this.props.AuthenticationStore.dataUserCommentsTimestamp ? Moment(this.props.AuthenticationStore.dataUserCommentsTimestamp).format('dddd DD.MM.YYYY HH:mm') : '-';
        const commentsTimestampString = `${t('settings.commentsTimestamp')}: ${commentsTimestamp}`;

        const transactionTimestamp = this.props.AuthenticationStore.dataUserTransactionsTimestamp ? Moment(this.props.AuthenticationStore.dataUserTransactionsTimestamp).format('dddd DD.MM.YYYY HH:mm') : '-';
        const transactionTimestampString = `${t('settings.transactionTimestamp')}: ${transactionTimestamp}`;

        return (
            <div className={classes.root}>
                <Typography className={classes.title} variant='subtitle1' component='h2'>
                    <span>{t('settings.accountInformation')}</span>
                </Typography>
                <Typography className={classes.text} variant='body2' component='h2'>
                    <span>{usernameString}</span>
                </Typography>
                <Typography className={classes.text} variant='body2' component='h2'>
                    <span>{uidString}</span>
                </Typography>
                    { crossAccountAdmin &&
                        <React.Fragment>
                            <Typography className={classes.title} variant='subtitle1' component='h2'>
                                <span>{t('settings.dataAccountInformation')}</span>
                            </Typography>
                            <Typography className={classes.text} variant='body2' component='h2'>
                                <span>{dataUsernameString}</span>
                            </Typography>
                            <Typography className={classes.text} variant='body2' component='h2'>
                                <span>{dataUidString}</span>
                            </Typography>
                            <Typography className={classes.text} variant='body2' component='h2'>
                                <span>{lastAccessString}</span>
                            </Typography>
                            <Typography className={classes.text} variant='body2' component='h2'>
                                <span>{lastTransactionString}</span>
                            </Typography>
                            <Typography className={classes.text} variant='body2' component='h2'>
                                <span>{commentsTimestampString}</span>
                            </Typography>
                            <Typography className={classes.text} variant='body2' component='h2'>
                                <span>{transactionTimestampString}</span>
                            </Typography>
                        </React.Fragment>
                    }
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

AccountInformationSettings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(AccountInformationSettings));