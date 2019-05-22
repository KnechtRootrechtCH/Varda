import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import ExportSettings from './settings/ExportSettings';

class Export extends React.Component {

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props);
        const classes = this.props.classes;

        return (
            <div className={classes.root}>
                <ExportSettings/>
            </div>
        );
     }

}

const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 2,
        marginLeft: theme.spacing.unit * 3,
    },
    divider: {
    }
});

Export.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Export);