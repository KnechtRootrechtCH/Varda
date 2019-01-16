import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route} from 'react-router-dom'
import {inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';

import Browse from './Browse';
import Initializing from './Initializing';
import SignIn from './SignIn';

@inject('AuthenticationStore')
@observer
class ProtectedContent extends React.Component {
    render () {
        const classes = this.props.classes;

        return (
            <div className={classes.root}>
                { !this.props.AuthenticationStore.initialized ?
                    <Initializing/>
                : 
                    <div className={classes.content}>
                        { !this.props.AuthenticationStore.authenticated ?
                            <SignIn/>
                        :
                            <BrowserRouter>
                                <Switch>
                                    <Route key='home' path='/' component={Browse}/>
                                </Switch>
                            </BrowserRouter>
                        }
                    </div>
                }
            </div>
        )
     }
}

const styles = theme => ({
    root: {
    },
    content: {
        paddingTop: 64,
    },
});

ProtectedContent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProtectedContent);