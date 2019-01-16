import React from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';

import Browse from './Browse';
import Details from './Details';
import DownloadList from './DownloadList';
import Initializing from './Initializing';
import Navigation from './Navigation';
import SignIn from './SignIn';

@inject('AuthenticationStore')
@observer
class PrivateRouter extends React.Component {
    render () {
        const classes = this.props.classes;

        return (
            <Router>
                <div className={classes.root}>
                    <Navigation/>
                    { !this.props.AuthenticationStore.initialized ?
                        <Initializing/>
                    : !this.props.AuthenticationStore.authenticated ?
                        <SignIn/>
                    :
                        <Switch>
                            <Route
                                exact
                                path='/browse'
                                component={Browse}/>
                            <Route
                                exact
                                path='/browse/:contentType'
                                component={Browse}/>
                            <Route
                                exact
                                path='/browse/:contentType/:itemId'
                                component={Details}/>
                            <Route
                                exact
                                path='/list'
                                component={DownloadList}/>
                            <Route
                                exact
                                path='/list/:contentType'
                                component={DownloadList}/>
                            <Route
                                exact
                                path='/list/:contentType/:itemId'
                                component={DownloadList}/>
                            <Route
                                path='/'
                                component={Browse}/>
                        </Switch>
                    }
                </div>
            </Router>
        )
     }
}

const styles = theme => ({
    root: {
        paddingTop: 64,
    },
    content: {
        
    },
});

PrivateRouter.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PrivateRouter);