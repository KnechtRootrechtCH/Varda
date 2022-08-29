import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';

import {
    FormControl,
    Select,
    MenuItem,
    Typography } from '@material-ui/core';

@withNamespaces()
@observer
class LanguageSettings extends React.Component {

    state = {
        locale: localStorage.getItem('varda.locale') ? localStorage.getItem('varda.locale') : navigator.language.trim(),
        navigatorLocale: navigator.language.trim(),
    }

    handleChange = (value) => {
        this.setState({
            locale: value,
        });

        if (value === this.state.navigatorLocale) {
            localStorage.removeItem('varda.locale');
        } else {
            localStorage.setItem('varda.locale', value);
        }

        window.location.reload();
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        return (
            <div className={classes.root}>
                <Typography className={classes.title} variant='subtitle1' component='h2'>
                    <span>{t('settings.language.title')}</span>
                </Typography>
                <FormControl>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={this.state.locale}
                        label={t('settings.language.field')}
                        onChange={({ target: { value } }) => this.handleChange(value)}
                    >
                        <MenuItem value={navigator.language.trim()}>{t(`common.language.${this.state.navigatorLocale.replace('-', '')}`)}</MenuItem>
                        { navigator.language.trim() !== 'en-US' &&
                            <MenuItem value={'en-US'}>{t('common.language.enUS')}</MenuItem>
                        }
                        { navigator.language.trim() !== 'en-GB' &&
                            <MenuItem value={'en-GB'}>{t('common.language.enGB')}</MenuItem>
                        }
                        { navigator.language.trim() !== 'de-CH' &&
                            <MenuItem value={'de-CH'}>{t('common.language.deCH')}</MenuItem>
                        }
                    </Select>
                </FormControl>
            </div>
        );
     }
}

const styles = theme => ({
    root: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    title: {
        color: theme.palette.text.primary,
    },
    current: {
        marginBottom: theme.spacing(0.5),
        color: theme.palette.text.disabled,
    },
    textField: {
        width: 400,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    button: {
        paddingLeft: 0,
        paddingRight: 0,
        marginRight: theme.spacing(2),
    },
});

LanguageSettings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(LanguageSettings));