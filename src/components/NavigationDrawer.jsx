import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { withNamespaces } from 'react-i18next';

import {
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText } from '@material-ui/core';

import {
    ExitToApp,
    Explore,
    Movie,
    Tv,
    ViewList } from '@material-ui/icons';

@withNamespaces()
@inject('AuthenticationStore')
@inject('MovieDbStore')
@inject('ThemeStore')
@observer
class Navigation extends React.Component {

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
        const location = this.props.location.pathname.toLowerCase();

        const authenticated = this.props.AuthenticationStore.authenticated;
        const drawer = this.props.ThemeStore.drawerState && authenticated;

        const desktop = isWidthUp('md', this.props.width);
        const drawerVariant = desktop ? 'persistent' : null;

        let loc = '';
        if (!this.props.AuthenticationStore.authenticated) {
            loc = 'signIn';
        } else if (location.includes('browse/movie')) {
            loc = 'movies';
        } else if (location.includes('browse/tv')) {
            loc = 'tv';
        } else if (location.includes('browse')) {
            loc = 'browse';
        } else if (location.includes('list')) {
            loc = 'list';
        }

        return (
            <Drawer className={classes.root} open={drawer} onClose={this.handleCloseDrawer} variant={drawerVariant} anchor='left'>
                <List className={desktop ? classes.drawerItemsDesktop : classes.drawerItems}>
                    <ListItem
                        button
                        component={Link}
                        to='/browse'
                        onClick={this.handleCloseDrawer}
                        className={loc === 'browse' ? classes.drawerItemActive : null}>
                        <ListItemIcon>
                            <Explore className={loc === 'browse' ? classes.drawerIconActive : null}/>
                        </ListItemIcon>
                        <ListItemText primary={t('common.discover')}/>
                    </ListItem>
                    <ListItem
                        button
                        component={Link}
                        to='/browse/movie'
                        onClick={this.handleCloseDrawer}
                        className={loc === 'movies' ? classes.drawerItemActive : null}>
                        <ListItemIcon>
                            <Movie className={loc === 'movies' ? classes.drawerIconActive : null}/>
                        </ListItemIcon>
                        <ListItemText primary={t('common.movies')}/>
                    </ListItem>
                    <ListItem
                        button
                        component={Link}
                        to='/browse/tv'
                        onClick={this.handleCloseDrawer}
                        className={loc === 'tv' ? classes.drawerItemActive : null}>
                        <ListItemIcon>
                            <Tv className={loc === 'tv' ? classes.drawerIconActive : null}/>
                        </ListItemIcon>
                        <ListItemText primary={t('common.seriesPlural')}/>
                    </ListItem>
                    <ListItem
                        button
                        component={Link}
                        to='/list'
                        onClick={this.handleCloseDrawer}
                        className={loc === 'list' ? classes.drawerItemActive : null}>
                        <ListItemIcon>
                            <ViewList className={loc === 'list' ? classes.drawerIconActive : null}/>
                        </ListItemIcon>
                        <ListItemText primary={t('common.list')}/>
                    </ListItem>
                    <Divider/>
                    <ListItem
                        button
                        onClick={this.handleSignOut}>
                        <ListItemIcon>
                            <ExitToApp/>
                        </ListItemIcon>
                        <ListItemText primary={t('authentication.signOut')}/>
                    </ListItem>
                </List>
            </Drawer>
        );
     }
}

const styles = theme => ({
    root: {

    },
    drawerItems: {

    },
    drawerItemsDesktop: {
        marginTop: 64,
    },
    drawerItemActive: {
        backgroundColor: theme.palette.action.selected,
    },
    drawerIconActive: {
        color: theme.palette.primary.main,
    }
});

Navigation.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(withRouter(Navigation)));