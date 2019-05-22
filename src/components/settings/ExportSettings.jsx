import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';

import {
    Step,
    StepLabel,
    StepContent,
    Stepper,
    Typography } from '@material-ui/core';

import {
    Calendar,
    CalendarSearch,
    Check,
    ClockOutline,
    Download,
    EyeOff,
    Sigma,
    Sync }  from 'mdi-material-ui';

@withNamespaces()
@inject('AuthenticationStore')
@observer
class AccountInformationSettings extends React.Component {

    state = {
        activeStep: 0,
    }

    handleNext = () => {
        this.setState(state => ({
            activeStep: state.activeStep + 1,
        }));
    };

    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    };

    handleReset = () => {
        this.setState({
            activeStep: 0,
        });
    };

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        return (
            <div className={classes.root}>
                <Typography className={classes.title} variant='subtitle1' component='h2'>
                    <span>{t('settings.export')}</span>
                </Typography>
                <Stepper activeStep={this.state.activeStep} orientation="vertical">
                    <Step key='type'>
                        <StepLabel>{t('settings.export.type')}</StepLabel>
                        <StepContent>
                            <Typography>{t('settings.export.typeDescription')}</Typography>
                        </StepContent>
                    </Step>
                    <Step key='status'>
                        <StepLabel>{t('settings.export.status')}</StepLabel>
                        <StepContent>
                            <Typography>{t('settings.export.statusDescription')}</Typography>
                        </StepContent>
                    </Step>
                    <Step key='status'>
                        <StepLabel>{t('settings.export.priority')}</StepLabel>
                        <StepContent>
                            <Typography>{t('settings.export.priorityDescription')}</Typography>
                        </StepContent>
                    </Step>
                    <Step key='status'>
                        <StepLabel>{t('settings.export.releaseDate')}</StepLabel>
                        <StepContent>
                            <Typography>{t('settings.export.releaseDateDescription')}</Typography>
                        </StepContent>
                    </Step>
                </Stepper>
            </div>
        );
     }
}

const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
    icon: {
        marginRight: theme.spacing.unit,
        verticalAlign: 'middle',
        marginBottom: 3,
    },
    text: {
        marginBottom: theme.spacing.unit / 2,
        color: theme.palette.text.disabled,
    },
});

AccountInformationSettings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(AccountInformationSettings));