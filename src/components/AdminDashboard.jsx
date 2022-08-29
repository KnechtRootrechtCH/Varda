import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';

import { Divider } from '@material-ui/core';

import AccountInformation from './dashboard/AccountInformation';
import AccessTimestamps from './dashboard/AccessTimestamps';
import ItemCountSettings from './settings/ItemCountSettings';

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
                <Divider className={classes.divider}/>
                <ItemCountSettings/>
            </div>
        );
     }

}

const styles = theme => ({
    root: {
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(3),
        marginBottom: theme.spacing(2),
        marginLeft: theme.spacing(3),
    },
    divider: {
    }
});

AdminDashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AdminDashboard);