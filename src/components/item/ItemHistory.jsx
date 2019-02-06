import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import { Typography } from '@material-ui/core';

import TransactionList from '../history/TransactionList';

@withNamespaces()
class ItemHistory extends React.Component {

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