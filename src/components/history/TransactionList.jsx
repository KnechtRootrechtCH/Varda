import React from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import { Fade, CircularProgress } from '@material-ui/core';

import TransactionPanel from './TransactionPanel';

@withNamespaces()
@inject('DownloadHistoryStore')
@inject('ThemeStore')
@observer
class TransactionList extends React.Component {

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props.DownloadHistoryStore.history);
        const classes = this.props.classes;
        // const t = this.props.t;
        // const mobile = this.props.mobile;
        const desktop = this.props.desktop;

        let transactions = [...this.props.DownloadHistoryStore.history].sort();
        if (!this.props.DownloadHistoryStore.sortAscending) {
            transactions = transactions.reverse();
        }

        return (
            <div className={classes.root}>
                { transactions.map(([key, value], index) => {
                    return (
                        <TransactionPanel transaction={value} key={`${value.timestamp} - ${value.transaction}`} index={index} itemHistory={this.props.itemHistory}/>
                    )
                })}

                <Fade in={this.props.DownloadHistoryStore.loading && transactions.length == 0} mountOnEnter={true} unmountOnExit={true}>
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