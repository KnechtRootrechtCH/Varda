import React from 'react';
import PropTypes from 'prop-types';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth';
import { withNamespaces } from 'react-i18next';

import {
    AppBar,
    Avatar,
    Divider,
    IconButton,
    Fade,
    LinearProgress,
    ListItemIcon,
    Menu,
    MenuItem,
    Toolbar,
    Typography} from '@material-ui/core';

import {
    Account,
    AccountCircle,
    ArrowLeft,
    Brightness4,
    ExitToApp,
    Settings,
    Menu as MenuIcon }  from 'mdi-material-ui';

import SearchDrawer from '../search/SearchDrawer';
import SearchBox from '../search/SearchBox';

@withNamespaces()
@inject('AuthenticationStore')
@inject('MovieDbStore')
@inject('ThemeStore')
@observer
class TitleBar extends React.Component {

    state = {
        menuAnchor: null,
    }

    handleToggleDrawer = () => {
        if ( this.props.ThemeStore.drawerState) {
            this.props.ThemeStore.setDrawerState(false);
        } else {
            this.handleOpenDrawer();
        }
    };

    handleHeaderClick = () => {
        this.props.history.push('/')
    }

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

    handleMenuOpen = event => {
        // console.debug(`${this.constructor.name}.handleMenuOpen()`, event);
        event.preventDefault();
        this.setState({
            menuAnchor: event.currentTarget
        });
    }

    handleMenuClose = () => {
        // console.debug(`${this.constructor.name}.handleMenuClose()`);
        this.setState({
            menuAnchor: null
        });
    }

    handleSignOut = () => {
        this.props.AuthenticationStore.signOut();
        this.props.ThemeStore.setDrawerState(false);
        this.handleMenuClose();
    }

    handleDarkThemeToggle = () => {
        const current = this.props.ThemeStore.type;
        let type = 'dark';
        if (current === 'dark') {
            type = 'light';
        }
        this.props.ThemeStore.setType(type);
        this.handleMenuClose();
    }

    handleNavigateBack = () => {
        this.props.history.goBack();
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        const mobile = isWidthDown('xs', this.props.width);
        const desktop = isWidthUp('md', this.props.width);
        const authenticated = this.props.AuthenticationStore.authenticated;
        const location = this.props.location.pathname.toLowerCase();

        const appBarPosition = mobile ? 'absolute' : 'fixed';

        const photoUrl = this.props.AuthenticationStore.photoUrl;
        const darkThemeStateKey = this.props.ThemeStore.type === 'dark' ? 'settings.on' : 'settings.off'

        const isAdmin = this.props.AuthenticationStore.isAdmin;
        const barColor = isAdmin ? 'primary' : 'default';
        const loading = false; //this.props.MovieDbStore.loading;

        let title = t('title');
        let subTitle = true;
        let showBackButton = false;
        let headerColor = isAdmin ? 'secondary' : 'primary';
        let subheaderColor = isAdmin ? 'inherit' : 'inherit';
        let showSearch = false;

        const item = this.props.MovieDbStore.item;
        if (item && !desktop) {
            title = ''; // MetadataService.getTitle(item);
            showBackButton = true;
            headerColor = 'inherit';
            subTitle = false;
        }
        if (location.includes('/settings') && !desktop) {
            title = t('common.settings');
            showBackButton = true;
            headerColor = 'inherit';
            subTitle = false;
        }
        if (location === '/' || location.includes('/browse')) {
            showSearch = true;
        }
        if (location.includes('/list')) {
            showSearch = false;
        }


        return (
            <div className={classes.root}>
                <AppBar className={classes.appBar} position={appBarPosition} color={barColor}>
                    <Toolbar className={classes.toolbar}>
                        { showBackButton ?
                            <ArrowLeft className={classes.menuButton} onClick={this.handleNavigateBack}/>
                        :
                            <MenuIcon className={classes.menuButton} onClick={this.handleToggleDrawer}/>
                        }
                        <Typography className={classes.header} variant='h5' color={headerColor} noWrap onClick={this.handleHeaderClick}>
                            {title}
                        </Typography>
                        { subTitle &&
                            <Typography className={classes.header} variant='h5' color={subheaderColor} noWrap onClick={this.handleHeaderClick}>
                                &nbsp;{t('subTitle')}
                            </Typography>
                        }
                        <Fade className={classes.controls} in={authenticated}>
                            <div className={classes.controlArea}>
                                <Fade in={showSearch} mountOnEnter={true} unmountOnExit={true}>
                                { desktop ?
                                    <SearchBox/>
                                :
                                    <SearchDrawer/>
                                }
                                </Fade>
                            { desktop && photoUrl ?
                                <Avatar className={classes.avatar} alt={t('common.settings')} src={photoUrl} onClick={this.handleMenuOpen}/>
                            : desktop ?
                                <Avatar className={classes.avatar} alt={t('common.settings')} onClick={this.handleMenuOpen}>
                                    <Account/>
                                </Avatar>
                            : photoUrl ?
                                <IconButton onClick={this.handleMenuOpen}>
                                    <Avatar className={classes.avatarSmall} alt={t('common.settings')} src={photoUrl}/>
                                </IconButton>
                            :
                                <IconButton onClick={this.handleMenuOpen}>
                                    <AccountCircle/>
                                </IconButton>
                            }
                            </div>
                        </Fade>
                    </Toolbar>
                    { loading &&
                        <LinearProgress className={classes.progress} color='primary' variant='query'/>
                    }
                </AppBar>
                <Menu
                    id='user'
                    anchorEl={this.state.menuAnchor}
                    open={Boolean(this.state.menuAnchor)}
                    onClose={this.handleMenuClose}>
                    <MenuItem component={Link} to='/settings' onClick={this.handleMenuClose}>
                        <ListItemIcon>
                            <Settings/>
                        </ListItemIcon>
                        {t('common.settings')}
                    </MenuItem>
                    <MenuItem onClick={this.handleDarkThemeToggle}>
                        <ListItemIcon>
                            <Brightness4/>
                        </ListItemIcon>
                        {t('settings.darkTheme') + ': ' + t(darkThemeStateKey)}
                    </MenuItem>
                    <Divider/>
                    <MenuItem onClick={this.handleSignOut}>
                        <ListItemIcon>
                            <ExitToApp/>
                        </ListItemIcon>
                        {t('authentication.signOut')}
                    </MenuItem>
                </Menu>
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
        cursor: 'pointer',
    },
    logo: {
        verticalAlign: 'middle',
        marginRight: 0,
        marginBottom: 3,
        marginLeft: theme.spacing.unit / 4,
    },
    controls: {
        marginLeft: 'auto',
        display: 'inline-flex',
        position: 'relative',
    },
    controlArea: {
    },
    avatar: {
        cursor: 'pointer',
        color: theme.palette.primary.main,
        marginLeft: theme.spacing.unit * 2,
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
    },
    avatarSmall: {
        height: theme.spacing.unit * 3,
        width: theme.spacing.unit * 3,
    },
    progress: {
        height: 2,
    },
});

TitleBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(withRouter(TitleBar)));