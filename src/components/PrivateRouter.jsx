import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';


import Browse from './Browse';
import Details from './Details';
import DownloadList from './DownloadList';
import Initializing from './Initializing';
import Navigation from './Navigation';
import SignIn from './SignIn';

import NavigationDrawer from './NavigationDrawer';

@inject('AuthenticationStore')
@inject('ConfigurationStore')
@inject('ThemeStore')
@observer
class PrivateRouter extends React.Component {

    render () {
        const classes = this.props.classes;
        const desktop = isWidthUp('md', this.props.width);
        const drawerOpen = desktop && this.props.ThemeStore.drawerState;

        return (
            <Router>
                <div className={classes.root}>
                    <Navigation/>
                    { desktop &&
                        <NavigationDrawer/>
                    }
                    { !this.props.AuthenticationStore.initialized ?
                        <Initializing/>
                    : !this.props.AuthenticationStore.authenticated ?
                        <SignIn/>
                    : !this.props.ConfigurationStore.initialized ?
                            <Initializing/>
                    :
                        <main className={classNames(classes.content, {
                            [classes.contentShift]: drawerOpen,
                        })}>
                            <Switch>
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
                                    component={Details}/>
                                <Route
                                    exact
                                    path='/list'
                                    component={DownloadList}/>
                                <Route
                                    exact
                                    path='/list/:mediaType'
                                    component={DownloadList}/>
                                <Route
                                    exact
                                    path='/list/:mediaType/:itemId'
                                    component={DownloadList}/>
                                <Route
                                    path='/'
                                    component={Browse}/>
                            </Switch>
                        </main>
                    }
                </div>
            </Router>
        )
     }
}

const drawerWidth = 215 + 18;

const styles = theme => ({
    root: {
        paddingTop: 64,
    },
    content: {

    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: drawerWidth,
        marginRight: 18,
    },
});

PrivateRouter.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(PrivateRouter));