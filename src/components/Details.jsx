import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

@withNamespaces()
class Details extends React.Component {

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props);
        const classes = this.props.classes;
        // const t = this.props.t;

        return (
            <div className={classes.root}>
                Details {this.props.match.params.mediaType}:{this.props.match.params.itemId}
            </div>
        );
     }
}

const styles = theme => ({
    root: {
    },
});

Details.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Details);