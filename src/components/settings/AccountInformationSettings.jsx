import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';

import {
    Typography } from '@material-ui/core';

@withNamespaces()
@inject('AuthenticationStore')
@observer
class AccountInformationSettings extends React.Component {

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        const usernameString = `${t('settings.userName')}: ${this.props.AuthenticationStore.displayName}`;
        const dataUsernameString = `${t('settings.userName')}: ${this.props.AuthenticationStore.dataUserDisplayName}`;
        const uidString = `${t('settings.id')}: ${this.props.AuthenticationStore.uid}`;
        const dataUidString = `${t('settings.id')}: ${this.props.AuthenticationStore.dataUid}`
        const crossAccountAdmin = this.props.AuthenticationStore.isAdmin && this.props.AuthenticationStore.dataUid !== this.props.AuthenticationStore.uid;

        return (
            <div className={classes.root}>
                <Typography className={classes.title} variant='subtitle1' component='h2'>
                    <span>{t('settings.accountInformation')}</span>
                </Typography>
                <Typography className={classes.text} variant='body2' component='h2'>
                    <span>{usernameString}</span>
                </Typography>
                <Typography className={classes.text} variant='body2' component='h2'>
                    <span>{uidString}</span>
                </Typography>
                    { crossAccountAdmin &&
                        <React.Fragment>
                            <Typography className={classes.title} variant='subtitle1' component='h2'>
                                <span>{t('settings.dataAccountInformation')}</span>
                            </Typography>
                            <Typography className={classes.text} variant='body2' component='h2'>
                                <span>{dataUsernameString}</span>
                            </Typography>
                            <Typography className={classes.text} variant='body2' component='h2'>
                                <span>{dataUidString}</span>
                            </Typography>
                        </React.Fragment>
                    }
            </div>
        );
     }
}

const styles = theme => ({
    root: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    icon: {
        marginRight: theme.spacing(1),
        verticalAlign: 'middle',
        marginBottom: 3,
    },
    text: {
        marginBottom: theme.spacing(0.5),
        color: theme.palette.text.disabled,
    },
    title: {
        color: theme.palette.text.primary,
    },
});

AccountInformationSettings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(AccountInformationSettings));