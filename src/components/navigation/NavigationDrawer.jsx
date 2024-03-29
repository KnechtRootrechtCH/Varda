import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { withNamespaces } from 'react-i18next';

import {
    Badge,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    SwipeableDrawer } from '@material-ui/core';

import {
    Comment,
    Explore,
    History,
    Movie,
    Tv } from '@material-ui/icons';

import { BriefcaseDownload }  from 'mdi-material-ui';

@withNamespaces()
@inject('AuthenticationStore')
@inject('ConfigurationStore')
@inject('CommentsStore')
@inject('DownloadHistoryStore')
@inject('MovieDbStore')
@inject('ThemeStore')
@observer
class Navigation extends React.Component {

    handleOpenDrawer = () => {
        console.debug(`${this.constructor.name}.handleOpenDrawer()`);
        this.props.ThemeStore.setDrawerState(true);
    }

    handleCloseDrawer = () => {
        console.debug(`${this.constructor.name}.handleCloseDrawer()`);
        const desktop = isWidthUp('md', this.props.width);
        if (desktop) {
            return;
        }
        this.props.ThemeStore.setDrawerState(false);
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;
        const location = this.props.location.pathname.toLowerCase();

        const authenticated = this.props.AuthenticationStore.authenticated;
        const drawer = this.props.ThemeStore.drawerState && authenticated ? true : false;

        const desktop = isWidthUp('md', this.props.width);
        const drawerVariant = desktop ? 'persistent' : null;

        const showDiscovery = this.props.ConfigurationStore.configuration.showDiscovery;

        const newCommentsCount = this.props.CommentsStore.newCommentsCount;
        const commentsBadgeInvisible = !newCommentsCount || newCommentsCount < 1;
        const newCommentsCountMax = this.props.CommentsStore.newCountLimit;

        const newTransactionsCount = this.props.DownloadHistoryStore.newTransactionsCount;
        const transactionsBadgeInvisible = !newTransactionsCount || newTransactionsCount < 1;
        const newTransactionsCountMax = this.props.DownloadHistoryStore.newCountLimit;

        let loc = showDiscovery ? 'browse' : 'movies';
        if (!this.props.AuthenticationStore.authenticated) {
            loc = null;
        } else if (location.includes('settings')) {
            loc = null;
        } else if (location.includes('browse/movie')) {
            loc = 'movies';
        } else if (location.includes('browse/tv')) {
            loc = 'tv';
        } else if (location.includes('list')) {
            loc = 'list';
        } else if (location.includes('messages')) {
            loc = 'messages';
        } else if (location.includes('history')) {
            loc = 'history';
        }

        return (
            <SwipeableDrawer className={classes.root} open={drawer} onOpen={() => this.handleOpenDrawer()} onClose={() => this.handleCloseDrawer()} variant={drawerVariant}>
                <List className={desktop ? classes.drawerItemsDesktop : classes.drawerItems}>
                    { showDiscovery &&
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
                    }
                    <ListItem
                        button
                        component={Link}
                        to='/browse/movie'
                        onClick={this.handleCloseDrawer}
                        className={loc === 'movies' ? classes.drawerItemActive : null}>
                        <ListItemIcon>
                            <Movie className={loc === 'movies' ? classes.drawerIconActive : null}/>
                        </ListItemIcon>
                        <ListItemText primary={t('common.mediaType.plural.movie')}/>
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
                        <ListItemText primary={t('common.mediaType.plural.tv')}/>
                    </ListItem>
                    <Divider/>
                    <ListItem
                        button
                        component={Link}
                        to='/list'
                        onClick={this.handleCloseDrawer}
                        className={loc === 'list' ? classes.drawerItemActive : null}>
                        <ListItemIcon>
                            <BriefcaseDownload className={loc === 'list' ? classes.drawerIconActive : null}/>
                        </ListItemIcon>
                        <ListItemText primary={t('common.list')}/>
                    </ListItem>
                    <ListItem
                        button
                        component={Link}
                        to='/messages'
                        onClick={this.handleCloseDrawer}
                        className={loc === 'messages' ? classes.drawerItemActive : null}>
                        <ListItemIcon>
                            <Badge badgeContent={newCommentsCount} invisible={commentsBadgeInvisible} color='secondary' max={newCommentsCountMax} overlap="rectangular">
                                <Comment className={loc === 'messages' ? classes.drawerIconActive : null}/>
                            </Badge>
                        </ListItemIcon>
                        <ListItemText primary={t('common.messages')}/>
                    </ListItem>
                    <ListItem
                        button
                        component={Link}
                        to='/history'
                        onClick={this.handleCloseDrawer}
                        className={loc === 'history' ? classes.drawerItemActive : null}>
                        <ListItemIcon>
                            <Badge badgeContent={newTransactionsCount} invisible={transactionsBadgeInvisible} color='secondary' max={newTransactionsCountMax} overlap="rectangular">
                                <History className={loc === 'history' ? classes.drawerIconActive : null}/>
                            </Badge>
                        </ListItemIcon>
                        <ListItemText primary={t('common.history')}/>
                    </ListItem>
                </List>
            </SwipeableDrawer>
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
        width: 220,
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