import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

class History extends React.Component {

    render () {
        console.debug(`${this.constructor.name}.render()`);
        const classes = this.props.classes;

        return (
            <div className={classes.root}>
                History
            </div>
        );
     }
}

const styles = theme => ({
    root: {
    },
});

History.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(History);