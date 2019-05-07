import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import { withNamespaces } from 'react-i18next';

import {
    Badge,
    BottomNavigation,
    BottomNavigationAction } from '@material-ui/core';

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
@inject('MovieDbStore')
@inject('ThemeStore')
@observer
class NavigationBar extends React.Component {

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props);

        const classes = this.props.classes;
        const t = this.props.t;
        const location = this.props.location.pathname.toLowerCase();
        const showDiscovery = this.props.ConfigurationStore.configuration.showDiscovery;
        const showComments = this.props.ConfigurationStore.configuration.showCommentsInNavbar;
        const showHistory = this.props.ConfigurationStore.configuration.showHistoryInNavbar;

        const newCommentsCount = this.props.CommentsStore.newCommentsCount;
        const badgeInvisible = !newCommentsCount || newCommentsCount < 1;

        let loc = showDiscovery ? 'browse' : 'movies';
        if (!this.props.AuthenticationStore.authenticated) {
            loc = false;
        } else if (location.includes('settings')) {
            loc = false;
        } else if (location.includes('browse/movie')) {
            loc = 'movies';
        } else if (location.includes('browse/tv')) {
            loc = 'tv';
        } else if (location.includes('list')) {
            loc = 'list';
        } else if (location.includes('history')) {
            loc = 'history';
        } else if (location.includes('messages')) {
            loc = 'messages';
        }

        return (
            <BottomNavigation
                className={classes.root}
                showLabels={true}
                value={loc}>
                { showDiscovery &&
                    <BottomNavigationAction
                    value='browse'
                    label={t('common.discover')}
                    icon={<Explore />}
                    component={Link}
                    to='/browse'/>
                }
                <BottomNavigationAction
                    value='movies'
                    label={t('common.movies')}
                    icon={<Movie />}
                    component={Link}
                    to='/browse/movie'/>
                <BottomNavigationAction
                    value='tv'
                    label={t('common.seriesPlural')}
                    icon={<Tv />}
                    component={Link}
                    to='/browse/tv'/>
                <BottomNavigationAction
                    value='list'
                    label={t('common.listShort')}
                    icon={<BriefcaseDownload />}
                    component={Link}
                    to='/list'/>
                { showHistory &&
                    <BottomNavigationAction
                        value='history'
                        label={t('common.history')}
                        icon={<History />}
                        component={Link}
                        to='/history'/>
                }
                { showComments &&
                        <BottomNavigationAction
                            value='messages'
                            label={t('common.messages')}
                            icon={
                                <Badge badgeContent={newCommentsCount} invisible={badgeInvisible} color='secondary' variant='standard' max={5} className={classes.badge}>
                                    <Comment/>
                                </Badge>
                            }
                            component={Link}
                            to='/messages'/>
                }

            </BottomNavigation>
        );
     }
}

const styles = theme => ({
    root: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
        zIndex: 100,
    },
    badge: {

    }
});

NavigationBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(NavigationBar));