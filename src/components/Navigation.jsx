import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { withNamespaces } from 'react-i18next';

import {
    AppBar,
    Divider,
    Fade,
    IconButton,
    InputBase,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Slide,
    Toolbar,
    Typography,
    SwipeableDrawer } from '@material-ui/core';

import {
    Clear,
    ExitToApp,
    Explore,
    Menu,
    Movie,
    Search,
    Tv,
    ViewList } from '@material-ui/icons';

import { DeathStarVariant } from 'mdi-material-ui/'

@withNamespaces()
@inject('AuthenticationStore')
@inject('MovieDbStore')
@observer
class Navigation extends React.Component {

    state = {
        drawer: false,
        search: false,
        searchButton: true,
        searchString: '',
        inputField: null,
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

    toggleSearch = (search) => {
        this.setState({
            search: search,
            searchButton: false,
        })
    }

    handleSearchEntered = () => {
        this.state.inputField.focus();
    }

    handleSearchExited = () => {
        this.setState({
            searchButton: true,
        })
    }

    handleSearchStringChange = (value) => {
        this.setState({
            searchString: value,
        });
        this.update();
    }

    handleSearchStringClear = () => {
        if (this.state.searchString && this.state.searchString.length > 0) {
            this.setState({
                searchString: '',
            });
            this.loadItems();
        }
        this.toggleSearch(false);
    }

    update = debounce(() => {
        this.loadItems();
    }, 500)

    loadItems = () => {
        const mediaType = this.props.MovieDbStore.mediaType;
        this.props.MovieDbStore.clearItems();
        this.props.MovieDbStore.loadItems(mediaType, this.state.searchString);
    }

    setInputField = field => {
        this.setState({
            inputField: field,
        });
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;
        const location = this.props.location.pathname.toLowerCase();

        const isDesktop = isWidthUp('sm', this.props.width);
        const showHeader = isWidthUp('sm', this.props.width) || ! this.state.search;
        let showSearch = true;
        let placeholderKey = 'browse.searchAll';

        if (!this.props.AuthenticationStore.authenticated) {
            showSearch = false;
        } else if (location.includes('browse/movie')) {
            placeholderKey = 'browse.searchMovies';
        } else if (location.includes('browse/tv')) {
            placeholderKey = 'browse.searchTv';
        } else if (location.includes('comments')) {
            showSearch = false;
        }

        return (
            <AppBar className={classes.root} position="fixed">
                <Toolbar className={classes.toolbar}>
                    <Fade in={isDesktop} mountOnEnter={true} unmountOnExit={true}>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)}>
                            <Menu />
                        </IconButton>
                    </Fade>
                    { this.state.searchButton &&
                        <Typography className={classes.header} variant='h5' component='h2' color="inherit">
                            <DeathStarVariant className={classes.logo} color='secondary'/>
                            {t('title')}
                        </Typography>
                    }
                    { showSearch &&
                        <div className={classes.search}>
                            <Fade in={this.state.searchButton} mountOnEnter={true} unmountOnExit={true}>
                                { !this.state.search ?
                                    <IconButton className={classes.searchButton} onClick={() => this.toggleSearch(true)}>
                                        <Search />
                                    </IconButton>
                                    :
                                    <div></div>
                                }
                            </Fade>
                            <Slide
                                in={this.state.search}
                                direction='left'
                                mountOnEnter={true}
                                unmountOnExit={true}
                                onExited={this.handleSearchExited}
                                onEntered={this.handleSearchEntered}>
                                <div className={classes.paper} elecation={1}>
                                    <IconButton className={classes.iconButton} aria-label="search" onClick={this.loadItems}>
                                        <Search />
                                    </IconButton>
                                    <InputBase
                                        inputRef={(input) => { this.setInputField(input) }}
                                        className={classes.input}
                                        value={this.state.searchString}
                                        placeholder={t(placeholderKey)}
                                        onChange={({ target: { value } }) => this.handleSearchStringChange(value)}/>
                                    <Divider className={classes.divider} />
                                    <IconButton className={classes.iconButton} aria-label="clear" onClick={() => this.handleSearchStringClear()}>
                                        <Clear />
                                    </IconButton>
                                </div>
                            </Slide>
                        </div>
                    }
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
    toolbar: {
        minHeight: 48,
        height: 48,
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
    },
    menuButton: {
        marginLeft: 0,
        marginRight: theme.spacing.unit,
        padding: theme.spacing.unit / 2,
    },
    header: {

    },
    logo: {
        verticalAlign: 'middle',
        marginBottom: 3,
        marginRight: theme.spacing.unit / 2,
    },
    search: {
        marginLeft: 'auto',
        marginRight: 0,
    },
    searchButton: {
        padding: theme.spacing.unit / 2,
    },
    paper: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
    },
    input: {
        marginLeft: theme.spacing.unit,
        flex: 1,
    },
    iconButton: {
        padding: theme.spacing.unit / 2,
        margin: theme.spacing.unit / 2,
    },
    divider: {
        width: 1,
        height: 28,
        margin: 4,
    },
});

Navigation.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(withRouter(Navigation)));