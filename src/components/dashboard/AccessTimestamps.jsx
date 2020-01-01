import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import * as Moment from 'moment';

import {
    Grid,
    Typography } from '@material-ui/core';

@withNamespaces()
@inject('AuthenticationStore')
@inject('CommentsStore')
@inject('DownloadHistoryStore')
@observer
class AccessTimestamps extends React.Component {

    render () {
        const classes = this.props.classes;
        const t = this.props.t;
        const today =  Moment().hour(0).minute(0).second(0);
        const yesterday = Moment().hour(0).minute(0).second(0).subtract(1, 'days');

        const lastAccess = this.props.AuthenticationStore.lastAccess ? Moment(this.props.AuthenticationStore.lastAccess).format('dddd DD.MM.YYYY HH:mm') : '-';
        const lastAccessToday = today.isBefore(Moment(this.props.AuthenticationStore.lastAccess));
        const lastAccessYesterday = !lastAccessToday && yesterday.isBefore(Moment(this.props.AuthenticationStore.lastAccess));
        const lastAccessColor = lastAccessToday ? 'secondary' : lastAccessYesterday ? 'primary' : 'textSecondary';

        const lastTransaction = this.props.AuthenticationStore.lastTransactionTimestamp ? Moment(this.props.AuthenticationStore.lastTransactionTimestamp).format('dddd DD.MM.YYYY HH:mm') : '-';
        const lastTransactionToday = today.isBefore(Moment(this.props.AuthenticationStore.lastTransactionTimestamp));
        const lastTransactionYesterday = !lastTransactionToday && yesterday.isBefore(Moment(this.props.AuthenticationStore.lastTransactionTimestamp));
        const lastTransactionColor = lastTransactionToday ? 'secondary' : lastTransactionYesterday ? 'primary' : 'textSecondary';

        const commentsTimestamp = this.props.AuthenticationStore.dataUserCommentsTimestamp ? Moment(this.props.AuthenticationStore.dataUserCommentsTimestamp).format('dddd DD.MM.YYYY HH:mm') : '-';
        const commentsTimestampToday = today.isBefore(Moment(this.props.AuthenticationStore.dataUserCommentsTimestamp));
        const commentsTimestampYesterday = !commentsTimestampToday && yesterday.isBefore(Moment(this.props.AuthenticationStore.dataUserCommentsTimestamp));
        const commentsTimestampColor = commentsTimestampToday ? 'secondary' : commentsTimestampYesterday ? 'primary' : 'textSecondary';

        const transactionTimestamp = this.props.AuthenticationStore.dataUserTransactionsTimestamp ? Moment(this.props.AuthenticationStore.dataUserTransactionsTimestamp).format('dddd DD.MM.YYYY HH:mm') : '-';
        const transactionTimestampToday = today.isBefore(Moment(this.props.AuthenticationStore.dataUserTransactionsTimestamp));
        const transactionTimestampYesterday = !transactionTimestampToday && yesterday.isBefore(Moment(this.props.AuthenticationStore.dataUserTransactionsTimestamp));
        const transactionTimestampColor = transactionTimestampToday ? 'secondary' : transactionTimestampYesterday ? 'primary' : 'textSecondary';

        const newTransactionsCount = this.props.DownloadHistoryStore.newTransactionsCount;
        const newTransactions = newTransactionsCount > 0;
        const newTransactionsColor = newTransactions ? 'primary' : 'textSecondary';

        const newCommentsCount = this.props.CommentsStore.newCommentsCount;
        const newComments = newCommentsCount > 0;
        const newCommentsColor = newComments ? 'primary' : 'textSecondary';

        return (
            <div className={classes.root}>
                <Typography className={classes.title} variant='subtitle1' component='h2'>
                    <span>{t('settings.accessTimestamp')}</span>
                </Typography>

                <Grid container>
                    <Grid item xs={12} sm={4} md={2}>
                        <Typography variant='body2' color='textPrimary'>
                            {t('settings.lastAccess')}:&nbsp;
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8} md={10}>
                        <Typography variant='body2' color={lastAccessColor}>
                            {lastAccess}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4} md={2}>
                        <Typography variant='body2' color='textPrimary'>
                            {t('settings.lastTransaction')}:&nbsp;
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8} md={10}>
                        <Typography variant='body2' color={lastTransactionColor}>
                            {lastTransaction}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4} md={2}>
                        <Typography variant='body2' color='textPrimary'>
                            {t('settings.commentsTimestamp')}:&nbsp;
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8} md={10}>
                        <Typography variant='body2' color={commentsTimestampColor}>
                            {commentsTimestamp}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4} md={2}>
                        <Typography variant='body2' color='textPrimary'>
                            {t('settings.transactionTimestamp')}:&nbsp;
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8} md={10}>
                        <Typography variant='body2' color={transactionTimestampColor}>
                            {transactionTimestamp}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4} md={2}>
                        <Typography variant='body2' color='textPrimary'>
                            {t('settings.newTransactions')}:&nbsp;
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8} md={10}>
                        { newTransactions ? 
                            <Typography variant='body2' color={newTransactionsColor} component={Link} to='/history'>
                                {newTransactionsCount}
                            </Typography>
                        :
                            <Typography variant='body2' color={newCommentsColor}>-</Typography>
                        }

                    </Grid>

                    <Grid item xs={12} sm={4} md={2}>
                        <Typography variant='body2' color='textPrimary'>
                            {t('settings.newComments')}:&nbsp;
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8} md={10}>
                        { newComments ? 
                            <Typography variant='body2' color={newCommentsColor} component={Link} to='/messages'>
                                {newCommentsCount}
                            </Typography>
                        :
                            <Typography variant='body2' color={newCommentsColor}>-</Typography>
                        }
                    </Grid>
                </Grid>
            </div>
        );
     }
}

const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
});

AccessTimestamps.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(AccessTimestamps));