import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import { Typography } from '@material-ui/core';

import TransactionList from '../history/TransactionList';

@withNamespaces()
@inject('AuthenticationStore')
@inject('DownloadHistoryStore')
@observer
class ItemHistory extends React.Component {

    state = {

    }

    componentDidMount = () => {
        // console.debug(`${this.constructor.name}.componentDidMount() => Load items`);
        this.props.DownloadHistoryStore.resetHistory();
        this.props.DownloadHistoryStore.setSorting('timestamp', false);
        this.props.DownloadHistoryStore.setFilter({
            key: 'all',
            field: 'timestamp',
            value: new Date(0, 0, 0, 0, 0, 0, 0),
            operator: '>=',
        });
        this.props.DownloadHistoryStore.loadItemHistory(this.props.itemKey);
        this.setState({
            isAdmin: this.props.AuthenticationStore.isAdmin,
        });
    }

    componentDidUpdate = () => {
        if (!this.state.isAdmin && this.props.AuthenticationStore.isAdmin) {
            this.setState({
                isAdmin: true,
            });
            console.debug(`${this.constructor.name}.componentDidUpdate() : admin mode activated => reload`);
            this.props.DownloadHistoryStore.resetHistory();
            this.props.DownloadHistoryStore.setSorting('timestamp', false);
            this.props.DownloadHistoryStore.loadItemHistory(this.props.itemKey);
        }
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        return (
            <div className={classes.root}>
                <Typography className={classes.header} variant='body2'>{t('common.history')}</Typography>
                <TransactionList desktop={this.props.desktop} mobile={this.props.mobile} itemHistory={true}/>
            </div>
        );
    }
}

const styles = theme => ({
    root: {
    },
    header: {
        textTransform: 'uppercase',
        marginBottom: theme.spacing.unit / 2,
    }
});

ItemHistory.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemHistory);