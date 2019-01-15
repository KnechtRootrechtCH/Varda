import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withNamespaces } from 'react-i18next';

import { Typography } from '@material-ui/core';

import { Autorenew } from '@material-ui/icons'

@withNamespaces()
class Initializing extends React.Component {
    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        return (
            <div className={classes.root}>
                <Autorenew className={classes.icon} color='primary' fontSize='large'/>
                <Typography variant='overline'>{t('common.initializing')}</Typography>
            </div>
        );
     }
}

const styles = theme => ({
    root: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // horizontal center
        justifyContent: 'center', // vertical center
        color: theme.palette.text.primary,
    },
    icon: {
        margin: theme.spacing.unit,
    }

});

Initializing.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Initializing);