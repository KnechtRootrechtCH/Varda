import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { withNamespaces } from 'react-i18next';

import {
    Button,
    Grid,
    TextField,
    Link,
    Typography } from '@material-ui/core';

@withNamespaces()
@inject('AuthenticationStore')
@observer
class SignIn extends React.Component {

    state = {
        mail: '',
        password: '',
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    }

    handleSignup = (event) => {
        console.debug(`${this.constructor.name}.handleSignup()`);
    }

    handleSignin = () => {
        console.debug(`${this.constructor.name}.handleSignin()`);
        this.props.AuthenticationStore.authWithMail(this.state.mail, this.state.password);
    }

    handleSigninWithGoogleAuth = () => {
        console.debug(`${this.constructor.name}.handleSigninWithGoogleAuth()`);
        this.props.AuthenticationStore.authWithGoogle();
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;
        const buttonDisabled = !this.state.mail || !this.state.password;
        const messageKey = this.props.AuthenticationStore.message;
        const error = messageKey != null;
        const errorMessage = error ? t(`authentication.${messageKey}`) : null;

        if(this.props.AuthenticationStore.authenticated) {
            console.debug(`${this.constructor.name}.render() : authenticated => redirect to home`);
            return (
                <div>Something went wrong, you shouldn't see this.</div>
            )
        }

        return (
            <div className={classes.root}>
                <form>
                    <Grid container className={classes.container} spacing={24}>
                        <Grid item className={classes.item} xs={12}>
                            <TextField
                                id='email'
                                type='text'
                                label={t('authentication.mail')}
                                error={error}
                                onChange={this.handleChange('mail')}
                                autoComplete='username'/>
                        </Grid>
                        <Grid item className={classes.item} xs={12}>
                            <TextField id='password'
                                type='password'
                                label={t('authentication.password')}
                                error={error} helperText={errorMessage}
                                onChange={this.handleChange('password')}
                                autoComplete='current-password'/>
                        </Grid>
                        <Grid item className={classes.item} xs={12}>
                            <Button variant='outlined' onClick={this.handleSignin} disabled={buttonDisabled}>
                                {t('authentication.signIn')}
                            </Button>
                        </Grid>
                        <Grid item className={classes.item} xs={12}>
                            <Typography variant='body2'>
                                {t('authentication.noAccount')}
                            </Typography>
                            <Link color='secondary' onClick={this.handleSignup}>
                                {t('authentication.signUp')}
                            </Link>
                        </Grid>
                        <Grid item className={classes.item} xs={12}>
                            <img className={classes.googleAuth} onClick={this.handleSigninWithGoogleAuth} src='https://developers.google.com/identity/images/btn_google_signin_light_normal_web.png' alt='Sign in with google'/>
                        </Grid>
                    </Grid>
                </form>
            </div>
        );
     }
}

const styles = theme => ({
    root: {
        padding: 20,
    },
    container: {

    },
    item: {
        textAlign: 'center',
    },
    googleAuth: {
        cursor: 'pointer',
    }
});

SignIn.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignIn);