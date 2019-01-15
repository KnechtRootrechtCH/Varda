import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

class Protected extends React.Component {

    render () {
        console.debug(`${this.constructor.name}.render()`);
        const classes = this.props.classes;

        return (
            <div className={classes.root}>
                Protected
            </div>
        );
     }
}

const styles = theme => ({
    root: {
    },
});

Protected.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Protected);