import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

class Browse extends React.Component {

    render () {
        const classes = this.props.classes;

        return (
            <div className={classes.root}>
                Browse {this.props.match.params.contentType}
            </div>
        );
     }
}

const styles = theme => ({
    root: {
    },
});

Browse.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Browse);