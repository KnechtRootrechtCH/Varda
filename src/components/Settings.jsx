import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';

import { Divider } from '@material-ui/core';

import AccountInformationSettings from './settings/AccountInformationSettings';
import CloudFunctionSettings from './settings/CloudFunctionSettings';
import ImportSettings from './settings/ImportSettings';
import ThemeSettings from './settings/ThemeSettings';

@inject('AuthenticationStore')
@observer
class Settings extends React.Component {

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props);
        const classes = this.props.classes;

        return (
            <div className={classes.root}>
                <AccountInformationSettings/>
                <Divider className={classes.divider}/>

                <ThemeSettings/>
                <Divider className={classes.divider}/>

                <CloudFunctionSettings/>
                <Divider className={classes.divider}/>

                { this.props.AuthenticationStore.isAdmin &&
                    <React.Fragment>
                        <ImportSettings/>
                        <Divider className={classes.divider}/>
                    </React.Fragment>
                }
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

Settings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Settings);