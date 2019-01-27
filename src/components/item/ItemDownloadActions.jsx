import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

@withNamespaces()
class ItemDownloadActions extends React.Component {

    state = {

    }

    render () {
        const classes = this.props.classes;
        // const t = this.props.t;

        const item = this.props.item;

        // console.debug(`${this.constructor.name}.render()`, rows);
        return (
            <div className={classes.root}>
                Download Actions
            </div>
        );
    }
}

const styles = theme => ({
    root: {
    },
});

ItemDownloadActions.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemDownloadActions);