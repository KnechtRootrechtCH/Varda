import React, { Component } from 'react';
import MetaTags from 'react-meta-tags';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import PrivateRouter from './components/PrivateRouter'

@inject('ThemeStore')
@observer
class App extends Component {
    componentDidMount = () => {
        const desktop = isWidthUp('md', this.props.width);
        if (desktop) {
            this.props.ThemeStore.loadDrawerState();
        }
    }

    render() {
        const classes = this.props.classes;
        const theme = this.props.ThemeStore.theme;
        const themedNavbar = this.props.ThemeStore.themedNavbar;
        const navbarColor = themedNavbar ? theme.palette.primary['500'] : theme.palette.grey['900'];

        return (
            <div className={classes.root}>
              <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500' />
              <link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons' />
              <MetaTags>
                  <meta name='theme-color' content={navbarColor} />
                  <meta name='msapplication-navbutton-color' content={navbarColor}/>
                  <meta name='apple-mobile-web-app-status-bar-style' content={navbarColor}/>
                  <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'/>
              </MetaTags>
              <Helmet>
                  <style>{`body { background-color: ${theme.palette.background.default}; }`}</style>
              </Helmet>

              <MuiThemeProvider theme={theme}>
                  <PrivateRouter/>
              </MuiThemeProvider>

            </div>
          );
    }
}

const styles = theme => ({
    root: {
    },
});

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(App));
