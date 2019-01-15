import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withNamespaces } from 'react-i18next';

import {
    AppBar,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    SwipeableDrawer } from '@material-ui/core';

import {
    Explore,
    Menu,
    Movie,
    Tv,
    ViewList } from '@material-ui/icons';

@withNamespaces()
class Navigation extends React.Component {

    state = {
        drawer: false,

    }

    toggleDrawer = (open) => () => {
        console.debug(`${this.constructor.name}.toggleDrawer()`, open);
        this.setState({
          drawer: open,
        });
    };

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                    <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)}>
                        <Menu />
                    </IconButton>
                    <Typography variant="h6" color="inherit">
                        {t('title')}
                    </Typography>
                    </Toolbar>
                    <SwipeableDrawer open={this.state.drawer} onClose={this.toggleDrawer(false)} onOpen={this.toggleDrawer(true)}>
                        <List>
                            <ListItem button key='discover'>
                                <ListItemIcon><Explore/></ListItemIcon>
                                <ListItemText primary={t('common.discover')}/>
                            </ListItem>
                            <ListItem button key='movies'>
                                <ListItemIcon><Movie/></ListItemIcon>
                                <ListItemText primary={t('common.movies')}/>
                            </ListItem>
                            <ListItem button key='series'>
                                <ListItemIcon><Tv/></ListItemIcon>
                                <ListItemText primary={t('common.seriesPlural')}/>
                            </ListItem>
                            <ListItem button key='list'>
                                <ListItemIcon><ViewList/></ListItemIcon>
                                <ListItemText primary={t('common.list')}/>
                            </ListItem>
                        </List>
                    </SwipeableDrawer>
                </AppBar>
            </div>
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