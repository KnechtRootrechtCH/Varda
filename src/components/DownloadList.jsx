import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

class DownloadList extends React.Component {

    render () {
        console.debug(`${this.constructor.name}.render()`);
        const classes = this.props.classes;

        return (
            <div className={classes.root}>
                DownloadList: {this.props.contentType}
            </div>
        );
     }
}

const styles = theme => ({
    root: {
    },
});

DownloadList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DownloadList);