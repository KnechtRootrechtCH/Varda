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
    Fade,
    Tooltip,
    Typography } from '@material-ui/core';

import { ExpandMore } from '@material-ui/icons';
import { BellRing, BellOutline } from 'mdi-material-ui';

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
        const timestamp = Moment(data.timestamp.toDate());
        const timestampString = timestamp.format('DD.MM.YYYY HH:mm');
        const isNew = data.external && (!this.props.transactionsTimestamp || timestamp.isAfter(this.props.transactionsTimestamp));
        const itemHistory = this.props.itemHistory;
        const title = data.title ? data.title : '-';
        const newValue = data.transaction.indexOf('Status') > 0  ? t(`history.transaction.${data.newValue}`) : data.newValue;

        const subTargetString = data.subTarget ? ` (${data.subTarget})` : '';
        const transactionShort = data.transaction === 'updateStatus' ? `${t(`history.transaction.${data.newValue}`)}${subTargetString}` : t(`history.transaction.${data.transaction}`);
        const transactionLong = data.subTarget ? `${data.subTarget}: ${newValue}` : `${t( `history.transaction.${data.transaction}`)}: ${newValue}`;

        const transactionColor = data.isAdminAction ? 'secondary' : 'primary';
        // const expand = !itemHistory && this.props.index === 0;

        const address = data.key ? `/browse/${data.key.replace(':', '/')}` : null;

        return (
            <ExpansionPanel className={classes.root} defaultExpanded={false}>
                <ExpansionPanelSummary className={classes.summary} expandIcon={<ExpandMore/>}>
                    { itemHistory ?
                        <Typography
                            className={mobile ? classes.titleMobile : desktop ? classes.titleDesktop : classes.title}
                            color={isNew ? 'textPrimary' : 'textSecondary'}
                            noWrap>
                            <Fade in={isNew} timeout={{enter: 100, exit: 2000}} mountOnEnter={true} unmountOnExit={true}>
                                <BellRing color={transactionColor} className={classes.newTransactionBadge}/>
                            </Fade>
                            <Fade in={!isNew} timeout={{enter: 100, exit: 2000}} mountOnEnter={true} unmountOnExit={true}>
                                <BellOutline color='disabled' className={classes.newTransactionBadge}/>
                            </Fade>
                            {timestampString}
                        </Typography>
                    :
                        <Typography
                            className={classes.titleActive + ' ' + (mobile ? classes.titleMobile : desktop ? classes.titleDesktop : classes.title)}
                            color={isNew ? 'textPrimary' : 'textSecondary'}
                            component={Link}
                            to={address}
                            noWrap>
                            <Fade in={isNew} timeout={{enter: 100, exit: 2000}} mountOnEnter={true} unmountOnExit={true}>
                                <BellRing color={transactionColor} className={classes.newTransactionBadge}/>
                            </Fade>
                            <Fade in={!isNew} timeout={{enter: 100, exit: 2000}} mountOnEnter={true} unmountOnExit={true}>
                                <BellOutline color='disabled' className={classes.newTransactionBadge}/>
                            </Fade>
                            {title}
                        </Typography>
                    }
                    <Tooltip title={transactionLong} aria-label={transactionLong}>
                        <Typography className={classes.transaction} align='right' color={transactionColor}>
                            {transactionShort}
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
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
    },
    titleActive: {
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        }
    },
    titleMobile: {
        display: 'inline-block',
        maxWidth: 250,
    },
    titleDesktop: {
        display: 'inline-block',
        maxWidth: 600,
    },
    title: {
        display: 'inline-block',
        maxWidth: 350,
    },
    transaction: {
        marginLeft: 'auto',
        display: 'inline-block',
    },
    newTransactionBadge: {
        verticalAlign: 'middle',
        marginBottom: 3,
        marginLeft: 0,
        marginRight: theme.spacing(1),
        fontSize: 18,
    },
});

TransactionPanel.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(TransactionPanel));