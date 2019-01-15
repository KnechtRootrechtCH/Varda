import React, { Component } from 'react';
import {inject, observer} from 'mobx-react';
import { Route, Redirect } from 'react-router-dom'

import Initializing from './Initializing'

@inject('AuthenticationStore')
@observer
class PrivateRoute extends Component {
    render () {
        return (
            <div>
                <Route render={props =>
                    !this.props.AuthenticationStore.initialized ?
                        <Initializing/>
                    : this.props.AuthenticationStore.authenticated ?
                        <Component {...props} />
                    :
                        <Redirect to={{
                            pathname: "/signin",
                            state: { from: props.location }
                        }}/>
                }/>
          </div>
        )
     }
}

export default PrivateRoute
