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

import { ExpandMore } from '@material-ui/icons';

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
        const itemHistory = this.props.itemHistory;
        const title = data.title ? data.title : '-';

        const transactionKey = data.transaction === 'updateStatus' ? `history.transaction.${data.newValue}` : `history.transaction.${data.transaction}`;
        const newValue = data.transaction === 'updateStatus' ? t(`history.transaction.${data.newValue}`) : data.newValue;
        const transactionLong = data.transaction === 'comment' ? t( `history.transaction.${data.transaction}`) : `${t( `history.transaction.${data.transaction}`)}: ${newValue}`;
        const transactionColor = data.isAdminAction ? 'secondary' : 'primary';

        const expand = this.props.index === 0;

        const address = data.key ? `/browse/${data.key.replace(':', '/')}` : null;

        return (
            <ExpansionPanel className={classes.root} defaultExpanded={expand}>
                <ExpansionPanelSummary className={classes.summary} expandIcon={<ExpandMore/>}>
                    { itemHistory ?
                        <Typography className={mobile ? classes.titleMobile : desktop ? classes.titleDesktop : classes.title} noWrap>
                            {timestampString}
                        </Typography>
                    :
                        <Typography className={classes.titleActive + ' ' + (mobile ? classes.titleMobile : desktop ? classes.titleDesktop : classes.title)} component={Link} to={address} noWrap>
                            {title}
                        </Typography>
                    }
                    <Tooltip title={transactionLong} aria-label={transactionLong}>
                        <Typography className={classes.transaction} align='right' color={transactionColor}>
                            {t(transactionKey)}
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
});

TransactionPanel.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(TransactionPanel));