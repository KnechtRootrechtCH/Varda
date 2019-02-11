import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';

import { CircularProgress } from '@material-ui/core';

import TitleBar from './navigation/TitleBar';
import Browse from './Browse';
import History from './History';
import ItemDetails from './ItemDetails';
import DownloadList from './DownloadList';
import Messages from './Messages';
import NavigationBar from './navigation/NavigationBar';
import NavigationDrawer from './navigation/NavigationDrawer';
import Settings from './Settings';
import SignIn from './SignIn';

@inject('AuthenticationStore')
@inject('ConfigurationStore')
@inject('ThemeStore')
@observer
class PrivateRouter extends React.Component {

    render () {
        const classes = this.props.classes;
        const desktop = isWidthUp('md', this.props.width);
        const mobile = isWidthDown('xs', this.props.width);
        const drawerOpen = desktop && this.props.ThemeStore.drawerState;

        return (
            <Router>
                <div className={classes.root}>
                    <TitleBar/>
                    <NavigationDrawer/>
                    { mobile && this.props.AuthenticationStore.initialized ?
                        <div className={classes.mobileNavSpacer}/>
                    : this.props.AuthenticationStore.initialized &&
                        <div className={classes.desktopNavSpacer}/>
                    }
                    { !this.props.AuthenticationStore.initialized || !this.props.ConfigurationStore.initialized  ?
                        <div className={classes.progressContainer}>
                            <CircularProgress className={classes.progress} color='secondary'/>
                        </div>
                    : !this.props.AuthenticationStore.authenticated ?
                        <SignIn/>
                    :
                        <main className={classNames(classes.content, {
                            [classes.contentShift]: drawerOpen,
                        })}>
                            <Switch>
                                <Route
                                    exact
                                    path='/settings'
                                    component={Settings}/>
                                <Route
                                    exact
                                    path='/browse'
                                    component={Browse}/>
                                <Route
                                    exact
                                    path='/browse/:mediaType'
                                    component={Browse}/>
                                <Route
                                    exact
                                    path='/browse/:mediaType/:itemId'
                                    component={ItemDetails}/>
                                <Route
                                    exact
                                    path='/list'
                                    component={DownloadList}/>
                                <Route
                                    exact
                                    path='/list/:mediaType/:itemId'
                                    component={ItemDetails}/>
                                <Route
                                    exact
                                    path='/messages'
                                    component={Messages}/>
                                <Route
                                    exact
                                    path='/history'
                                    component={History}/>
                                <Route
                                    path='/'
                                    component={Browse}/>
                            </Switch>
                        </main>
                    }
                    { mobile && this.props.AuthenticationStore.initialized &&
                        <div className={classes.navBarSpacer}>
                            <NavigationBar/>
                        </div>
                    }
                </div>
            </Router>
        )
     }
}

const drawerWidth = 220;

const styles = theme => ({
    root: {
    },
    content: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: drawerWidth,
    },
    desktopNavSpacer: {
        height: 64,
    },
    mobileNavSpacer: {
        height: 56,
    },
    navBarSpacer: {
        height: 56,
    },
    progressContainer: {
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progress: {
        width: 40,
        height: 40,
        opacity: 0,
    },
});

PrivateRouter.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(PrivateRouter));