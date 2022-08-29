import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';

import { Divider } from '@material-ui/core';

import AccountInformationSettings from './settings/AccountInformationSettings';
import CloudFunctionSettings from './settings/CloudFunctionSettings';
import ImportSettings from './settings/ImportSettings';
import ItemCountSettings from './settings/ItemCountSettings';
import LanguageSettings from './settings/LanguageSettings';
import NotificationSettings from './settings/NotificationSettings';
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

                <LanguageSettings/>
                <Divider className={classes.divider}/>

                <ItemCountSettings/>
                <Divider className={classes.divider}/>

                <ThemeSettings/>
                <Divider className={classes.divider}/>

                <NotificationSettings/>
                <Divider className={classes.divider}/>

                { this.props.AuthenticationStore.isAdmin &&
                    <React.Fragment>
                        <CloudFunctionSettings/>
                        <Divider className={classes.divider}/>

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
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(3),
        marginBottom: theme.spacing(2),
        marginLeft: theme.spacing(3),
    },
    divider: {
    }
});

Settings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Settings);