import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withNamespaces } from 'react-i18next';

@withNamespaces()
class Initializing extends React.Component {
    render () {
        const classes = this.props.classes;
        // const t = this.props.t;

        return (
            <div className={classes.root}>

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
});

Initializing.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Initializing);