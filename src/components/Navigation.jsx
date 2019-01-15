import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

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

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                    <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)}>
                        <Menu />
                    </IconButton>
                    <Typography variant="h6" color="inherit">
                        Varda
                    </Typography>
                    </Toolbar>
                    <SwipeableDrawer open={this.state.drawer} onClose={this.toggleDrawer(false)} onOpen={this.toggleDrawer(true)}>
                        <List>
                            <ListItem button key='discover'>
                                <ListItemIcon><Explore/></ListItemIcon>
                                <ListItemText primary='Discover'/>
                            </ListItem>
                            <ListItem button key='movies'>
                                <ListItemIcon><Movie/></ListItemIcon>
                                <ListItemText primary='Movies'/>
                            </ListItem>
                            <ListItem button key='series'>
                                <ListItemIcon><Tv/></ListItemIcon>
                                <ListItemText primary='Series'/>
                            </ListItem>
                            <ListItem button key='list'>
                                <ListItemIcon><ViewList/></ListItemIcon>
                                <ListItemText primary='Download List'/>
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