import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';

import { Divider } from '@material-ui/core';

import AccountInformation from './dashboard/AccountInformation';
import AccessTimestamps from './dashboard/AccessTimestamps';

@inject('AuthenticationStore')
@observer
class AdminDashboard extends React.Component {

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props);
        const classes = this.props.classes;

        return (
            <div className={classes.root}>
                <AccountInformation/>
                <Divider className={classes.divider}/>
                <AccessTimestamps/>
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

AdminDashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AdminDashboard);