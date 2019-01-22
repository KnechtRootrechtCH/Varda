import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Divider } from '@material-ui/core';

import ThemeSettings from './settings/ThemeSettings';

class Settings extends React.Component {

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props);
        const classes = this.props.classes;

        return (
            <div className={classes.root}>
                <ThemeSettings/>
                <Divider className={classes.divider}/>
            </div>
        );
     }

}

const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 2,
        marginLeft: theme.spacing.unit * 3,
    },
    divider: {
    }
});

Settings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Settings);