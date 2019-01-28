import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import { Typography } from '@material-ui/core';

@withNamespaces()
class ItemCast extends React.Component {

    state = {

    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        const item = this.props.item;

        // console.debug(`${this.constructor.name}.render()`, rows);
        return (
            <div className={classes.root}>
                <Typography className={classes.header} variant='body2'>{t('details.cast')}</Typography>
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

ItemCast.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemCast);