import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { withNamespaces } from 'react-i18next';

import {
    AppBar,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    SwipeableDrawer } from '@material-ui/core';

import {
    ExitToApp,
    Explore,
    Menu,
    Movie,
    Tv,
    ViewList } from '@material-ui/icons';

@withNamespaces()
@inject('AuthenticationStore')
@observer
class Navigation extends React.Component {

    state = {
        drawer: false,
    }

    toggleDrawer = (open) => () => {
        // console.debug(`${this.constructor.name}.toggleDrawer()`, open);
        if (!this.props.AuthenticationStore.initialized) {
            open = false;
        }
        this.setState({
          drawer: open,
        });
    };

    handleSignOut = () => {
        this.props.AuthenticationStore.signOut();
        this.setState({
            drawer: false,
        });
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        return (
            <AppBar className={classes.root} position="fixed">
                <Toolbar>
                <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)} disabled={!this.props.AuthenticationStore.authenticated}>
                    <Menu />
                </IconButton>
                <Typography variant="h6" color="inherit">
                    {t('title')}
                </Typography>
                </Toolbar>
                <SwipeableDrawer open={this.state.drawer} onClose={this.toggleDrawer(false)} onOpen={this.toggleDrawer(true)}>
                    <List>
                        <ListItem button key='discover' component={Link} to='/browse' onClick={this.toggleDrawer(false)}>
                            <ListItemIcon><Explore/></ListItemIcon>
                            <ListItemText primary={t('common.discover')}/>
                        </ListItem>
                        <ListItem button key='movies' component={Link} to='/browse/movie' onClick={this.toggleDrawer(false)}>
                            <ListItemIcon><Movie/></ListItemIcon>
                            <ListItemText primary={t('common.movies')}/>
                        </ListItem>
                        <ListItem button key='series' component={Link} to='/browse/tv' onClick={this.toggleDrawer(false)}>
                            <ListItemIcon><Tv/></ListItemIcon>
                            <ListItemText primary={t('common.seriesPlural')}/>
                        </ListItem>
                        <ListItem button key='list' component={Link} to='/list' onClick={this.toggleDrawer(false)}>
                            <ListItemIcon><ViewList/></ListItemIcon>
                            <ListItemText primary={t('common.list')}/>
                        </ListItem>
                        <Divider/>
                        <ListItem button key='signout' onClick={this.handleSignOut}>
                            <ListItemIcon><ExitToApp/></ListItemIcon>
                            <ListItemText primary={t('authentication.signOut')}/>
                        </ListItem>
                    </List>
                </SwipeableDrawer>
            </AppBar>
        );
     }
}

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
});

Navigation.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigation);