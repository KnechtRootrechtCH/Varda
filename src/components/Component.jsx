import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

class Component extends React.Component {

    render () {
        console.debug(`${this.constructor.name}.render()`, open);
        const classes = this.props.classes;

        return (
            <div className={classes.root}>
                Component
            </div>
        );
     }
}

const styles = theme => ({
    root: {
    },
});

Component.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Component);