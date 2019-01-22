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
        margin: theme.spacing.unit * 2,
    },
    divider: {
    }
});

Settings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Settings);