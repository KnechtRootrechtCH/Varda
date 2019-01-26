import React from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import TransactionPanel from './TransactionPanel';

@withNamespaces()
@inject('DownloadHistoryStore')
@observer
class TransactionList extends React.Component {

    render () {
        // console.debug(`${this.constructor.name}.render()`);
        const classes = this.props.classes;
        // const t = this.props.t;

        let history = this.props.DownloadHistoryStore.history ? this.props.DownloadHistoryStore.history : [];
        history = this.props.sortAscending ? history : history.slice().reverse();

        return (
            <div className={classes.root}>
                { history.map(row => {
                    return (
                        <TransactionPanel transaction={row} key={`${row.timestamp} - ${row.transaction}`}/>
                    )
                })}
            </div>
        );
    }
}

const styles = theme => ({
    root: {

    },
});

TransactionList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TransactionList);