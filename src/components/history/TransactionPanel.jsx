import React from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import { Link } from 'react-router-dom'
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth';
import * as Moment from 'moment';

import {
    ExpansionPanel,
    ExpansionPanelSummary,
    Tooltip,
    Typography } from '@material-ui/core';

import TransactionDetails from './TransactionDetails';

@withNamespaces()
@inject('DownloadHistoryStore')
@observer
class TransactionPanel extends React.Component {

    render () {
        const classes = this.props.classes;
        const t = this.props.t;
        const mobile = isWidthDown('xs', this.props.width);
        const desktop = isWidthUp('md', this.props.width);

        const data = this.props.transaction;
        const timestamp = Moment(data.timestamp, 'YYYY-MM-DD HH-mm-ss-S ZZ');
        const timestampShort = timestamp.format('DD.MM.YYYY HH:mm');
        const timestampLong = timestamp.format('DD.MM.YYYY HH:mm ZZ');
        const title = data.title ? data.title : '-';

        const transactionKey = data.transaction === 'updateStatus' ? `history.transaction.${data.newValue}` : `history.transaction.${data.transaction}`;
        const newValue = data.transaction === 'updateStatus' ? t(`history.transaction.${data.newValue}`) : data.newValue;
        const transactionLong = data.transaction === 'comment' ? t( `history.transaction.${data.transaction}`) : `${t( `history.transaction.${data.transaction}`)}: ${newValue}`;
        const transactionColor = data.isAdminAction ? 'secondary' : 'primary';

        const now = Moment();
        const diff = now.diff(timestamp, 'minutes');
        const timeColor = diff < 60 ? 'primary' : 'textPrimary';

        const address = data.key ? `/browse/${data.key.replace(':', '/')}` : null;

        return (
            <ExpansionPanel className={classes.root}>
                <ExpansionPanelSummary className={classes.summary}>
                    <Typography className={mobile ? classes.titleMobile : desktop ? classes.titleDesktop : classes.title} component={Link} to={address} noWrap>
                        {title}
                    </Typography>
                    <Tooltip title={transactionLong} aria-label={transactionLong}>
                        <Typography className={classes.transaction} align='right' color={transactionColor}>
                            {t(transactionKey)}
                        </Typography>
                    </Tooltip>
                    <Tooltip title={timestampLong} aria-label={timestampLong}>
                        <Typography className={classes.timestamp} align='right' color={timeColor}>
                            {timestampShort}
                        </Typography>
                    </Tooltip>
                </ExpansionPanelSummary>
                <TransactionDetails data={data}/>
            </ExpansionPanel>
        )
    }
}

const styles = theme => ({
    root: {

    },
    summary: {
        paddingRight: theme.spacing.unit * 2,
        paddingLeft: theme.spacing.unit * 2,
    },
    titleMobile: {
        display: 'inline-block',
        maxWidth: 220,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        }
    },
    titleDesktop: {
        display: 'inline-block',
        maxWidth: 580,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        }
    },
    title: {
        display: 'inline-block',
        maxWidth: 320,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        }
    },
    transaction: {
        marginLeft: 'auto',
        marginRight: theme.spacing.unit * 2,
    },
    timestamp: {
        display: 'inline-block',
        paddingRight: '0 !important',
    },
});

TransactionPanel.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(TransactionPanel));