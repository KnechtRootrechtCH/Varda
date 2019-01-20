import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth';
import { withNamespaces } from 'react-i18next';

import {
    AppBar,
    Toolbar,
    Typography} from '@material-ui/core';

import { Menu } from '@material-ui/icons';

import { DeathStarVariant } from 'mdi-material-ui/';

import NavigationDrawer from './NavigationDrawer';
import NavigationTabBar from './NavigationTabBar';


@withNamespaces()
@inject('AuthenticationStore')
@inject('MovieDbStore')
@inject('ThemeStore')
@observer
class Navigation extends React.Component {

    handleToggleDrawer = () => {
        if ( this.props.ThemeStore.drawerState) {
            this.props.ThemeStore.setDrawerState(false);
        } else {
            this.handleOpenDrawer();
        }
    };

    handleOpenDrawer = () => {
        if (!this.props.AuthenticationStore.authenticated) {
            return;
        }
        this.props.ThemeStore.setDrawerState(true);
    }

    handleCloseDrawer = () => {
        const desktop = isWidthUp('md', this.props.width);
        if (desktop) {
            return;
        }
        this.props.ThemeStore.setDrawerState(false);
    }

    handleSignOut = () => {
        this.props.AuthenticationStore.signOut();
        this.props.ThemeStore.setDrawerState(false);
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        const mobile = isWidthDown('xs', this.props.width);
        const desktop = isWidthUp('md', this.props.width);

        const showHeader = true;
        const appBarPosition = mobile ? 'absolute'  : 'fixed'

        return (
            <div className={classes.root}>
                <AppBar className={classes.appBar} position={appBarPosition} color='default'>
                    <Toolbar className={classes.toolbar}>
                        { !mobile &&
                            <Menu className={classes.menuButton} onClick={this.handleToggleDrawer}/>
                        }
                        { showHeader &&
                            <Typography className={classes.header} variant='h5' color='default'>
                                <DeathStarVariant className={classes.logo} color='primary'/>
                                {t('title')}
                            </Typography>
                        }
                    </Toolbar>
                </AppBar>
                { !desktop &&
                    <NavigationDrawer/>
                }
                { mobile &&
                    <AppBar className={classes.appBarBottom} position='fixed' color='default'>
                        <NavigationTabBar/>
                    </AppBar>
                }
            </div>
        );
     }
}

const styles = theme => ({
    root: {

    },
    appBar: {
        flexGrow: 1,
    },
    toolbar: {

    },
    menuButton: {
        cursor: 'pointer',
        marginRight: theme.spacing.unit * 2,
    },
    header: {

    },
    logo: {
        verticalAlign: 'middle',
        marginRight: 0,
        marginBottom: 3,
        marginLeft: theme.spacing.unit / 4,
    },
    appBarBottom: {
        top: 'auto',
        bottom: 0,
    }
});

Navigation.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(withRouter(Navigation)));