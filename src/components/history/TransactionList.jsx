import React from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import * as Moment from 'moment';

import { Fade, CircularProgress } from '@material-ui/core';

import TransactionPanel from './TransactionPanel';

@withNamespaces()
@inject('AuthenticationStore')
@inject('DownloadHistoryStore')
@inject('ThemeStore')
@observer
class TransactionList extends React.Component {

    render () {
        const classes = this.props.classes;
        // const t = this.props.t;
        // const mobile = this.props.mobile;
        const desktop = this.props.desktop;
        const itemHistory = this.props.itemHistory;

        let transactions = itemHistory ? [...this.props.DownloadHistoryStore.itemHistory].sort() : [...this.props.DownloadHistoryStore.history].sort();
        if (!this.props.DownloadHistoryStore.sortAscending) {
            transactions = transactions.reverse();
        }

        const transactionsTimestamp = this.props.DownloadHistoryStore.transactionsTimestamp;
        const transactionsTimestampMoment = transactionsTimestamp ? Moment(transactionsTimestamp) : null;

        // console.debug(`${this.constructor.name}.render()`, itemHistory, transactions);
        return (
            <div className={classes.root}>
                { transactions.map(([key, value], index) => {
                    return (
                        <TransactionPanel key={key} transaction={value} index={index} itemHistory={itemHistory} transactionsTimestamp={transactionsTimestampMoment}/>
                    )
                })}

                <Fade in={this.props.DownloadHistoryStore.loading && transactions.length === 0} mountOnEnter={true} unmountOnExit={true}>
                    <div className={classes.progressContainer}>
                        <div className={desktop && this.props.ThemeStore.drawerState ? classes.progressShift : classes.progress}>
                            <CircularProgress color='secondary'/>
                        </div>
                    </div>
                </Fade>
            </div>
        );
    }
}

const drawerWidth = 220;

const styles = theme => ({
    root: {

    },
    progressContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressContainerShifted: {
        position: 'absolute',
        top: 0,
        left: 0,
        paddingLeft: drawerWidth,
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressShift: {
        paddingLeft: drawerWidth,
        transition: theme.transitions.create('padding', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    progress: {
        transition: theme.transitions.create('padding', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
});

TransactionList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TransactionList);