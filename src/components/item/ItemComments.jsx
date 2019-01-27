import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

@withNamespaces()
class ItemComments extends React.Component {

    state = {

    }

    render () {
        const classes = this.props.classes;
        // const t = this.props.t;

        const item = this.props.item;

        // console.debug(`${this.constructor.name}.render()`, rows);
        return (
            <div className={classes.root}>
                Comments and History
            </div>
        );
    }
}

const styles = theme => ({
    root: {
    },
});

ItemComments.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemComments);