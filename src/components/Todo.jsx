import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

class ToDo extends React.Component {

    render () {
        console.debug(`${this.constructor.name}.render()`);
        const classes = this.props.classes;

        return (
            <div className={classes.root}>
                ToDo
            </div>
        );
     }
}

const styles = theme => ({
    root: {
    },
});

ToDo.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ToDo);