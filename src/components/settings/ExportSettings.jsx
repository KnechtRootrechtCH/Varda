import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';

import {
    DatabaseExport,
    FileExcel,
    FileDocument,
    UndoVariant }  from 'mdi-material-ui';

import {
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Step,
    StepLabel,
    StepContent,
    Stepper,
    Typography } from '@material-ui/core';

@withNamespaces()
@inject('AuthenticationStore')
@inject('DataExportStore')
@inject('DownloadStatusStore')
@observer
class AccountInformationSettings extends React.Component {

    state = {
        activeStep: 0,
        type: 'none',
        status: 'none',
    }

    selectStep = (step) => {
        this.setState({
            activeStep: step,
        });
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

    handleTypeChange = (value) => {
        this.setState({
            type: value,
        });
    }

    handleStatusChange = (value) => {
        this.setState({
            status: value,
        });
    }

    handleDataLoad = () => {
        this.props.DownloadStatusStore.resetStatusList();
        this.props.DownloadStatusStore.setSortField('title');
        this.props.DownloadStatusStore.setMediaTypeFilter(this.state.type);
        this.props.DownloadStatusStore.setStatusFilter(this.state.status);
        this.props.DownloadStatusStore.loadStatusList(true);
        this.handleNext();
    }

    handleCsvSave = () => {
        let data = this.props.DownloadStatusStore.list;
        this.props.DataExportStore.registerI18nFunction(this.props.t);
        this.props.DataExportStore.runCsvExport(data, this.state.type, this.state.status, false);
    }

    handleDbExport = () => {
        let data = this.props.DownloadStatusStore.list;
        this.props.DataExportStore.registerI18nFunction(this.props.t);
        this.props.DataExportStore.runCsvExport(data, this.state.type, this.state.status, true);
    }

    handleTxtSave = () => {
        let data = this.props.DownloadStatusStore.list;
        this.props.DataExportStore.registerI18nFunction(this.props.t);
        this.props.DataExportStore.runTxtExport(data, this.state.type, this.state.status);
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        const mediaType = ['none', 'movie', 'tv'];
        const status = ['none', 'queued', 'notReleased', 'notAvailable', 'notFound', 'redownload', 'downloading', 'downloaded'];

        return (
            <div className={classes.root}>
                <Typography className={classes.title} variant='subtitle1' component='h2'>
                    <span>{t('settings.export.title')}</span>
                </Typography>
                <Stepper activeStep={this.state.activeStep} orientation='vertical'>
                    <Step key='type'>
                        <StepLabel className={classes.stepLabel} onClick={() => this.selectStep(0)}>
                        {t('settings.export.typeFilter')}:&nbsp;{t(`common.mediaType.plural.${this.state.type}`)}
                        </StepLabel>
                        <StepContent>
                            <FormControl>
                                <RadioGroup>
                                { mediaType.map((value) => {
                                    return (
                                        <FormControlLabel
                                            key={value}
                                            value={value}
                                            label={t(`common.mediaType.plural.${value}`)}
                                            onClick={() => this.handleTypeChange(value)}
                                            control={
                                                <Radio checked={value === this.state.type} />
                                        }/>
                                    )
                                })}
                                </RadioGroup>
                                <div>
                                    <Button
                                        variant='outlined'
                                        color='primary'
                                        onClick={this.handleNext}
                                        className={classes.button}>
                                        {t('common.ok')}
                                    </Button>
                                </div>
                            </FormControl>
                        </StepContent>
                    </Step>
                    <Step key='status'>
                        <StepLabel className={classes.stepLabel} onClick={() => this.selectStep(1)}>
                        {t('settings.export.statusFilter')}:&nbsp;{t(`common.status.${this.state.status}`)}
                        </StepLabel>
                        <StepContent>
                        <FormControl>
                            <RadioGroup>
                                { status.map((value) => {
                                    return (
                                        <FormControlLabel
                                            key={value}
                                            value={value}
                                            label={t(`common.status.${value}`)}
                                            onClick={() => this.handleStatusChange(value)}
                                            control={
                                                <Radio checked={value === this.state.status} />
                                        }/>
                                    )
                                })}
                                </RadioGroup>
                            </FormControl>
                            <div>
                                <Button
                                    variant='outlined'
                                    color='primary'
                                    onClick={this.handleNext}
                                    className={classes.button}>
                                    {t('common.ok')}
                                </Button>
                            </div>
                        </StepContent>
                    </Step>
                    <Step key='release'>
                        <StepLabel className={classes.stepLabel} onClick={() => this.selectStep(2)}>
                            {t('settings.export.load')}
                        </StepLabel>
                        <StepContent>
                            <Typography>{t('settings.export.loadDescription')}</Typography>
                            <Button
                                variant='outlined'
                                color='primary'
                                onClick={this.handleDataLoad}
                                className={classes.button}>
                                {t('settings.export.loadButton')}
                            </Button>
                        </StepContent>
                    </Step>
                    <Step key='release'>
                        <StepLabel>
                            {t('settings.export.save')}
                        </StepLabel>
                        <StepContent>
                            { this.props.DownloadStatusStore.loading ?
                                <React.Fragment>
                                    <Typography>{t('settings.export.loading')}</Typography>
                                    <CircularProgress color='secondary'/>
                                </React.Fragment>
                            :
                                <React.Fragment>
                                    <Typography>{t('settings.export.saveDescription')}: {this.props.DownloadStatusStore.list.size}</Typography>
                                    <Button
                                        variant='outlined'
                                        color='primary'
                                        onClick={this.handleTxtSave}
                                        className={classes.button}>
                                        <FileDocument className={classes.buttonIcon}/>
                                        {t('settings.export.saveTxtButton')}
                                    </Button>
                                    <Button
                                        variant='outlined'
                                        color='primary'
                                        onClick={this.handleCsvSave}
                                        className={classes.button}>
                                        <FileExcel className={classes.buttonIcon}/>
                                        {t('settings.export.saveCsvButton')}
                                    </Button>
                                    <Button
                                        variant='outlined'
                                        color='primary'
                                        onClick={this.handleDbExport}
                                        className={classes.button}>
                                        <DatabaseExport className={classes.buttonIcon}/>
                                        {t('settings.export.saveDbExportButton')}
                                    </Button>
                                    <Button
                                        variant='outlined'
                                        color='primary'
                                        onClick={this.handleReset}
                                        className={classes.button}>
                                        <UndoVariant className={classes.buttonIcon}/>
                                        {t('settings.export.resetButton')}
                                    </Button>
                                </React.Fragment>
                            }
                        </StepContent>
                    </Step>
                </Stepper>
            </div>
        );
     }
}

const styles = theme => ({
    button: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    stepLabel: {
        cursor: 'pointer',
    },
    buttonIcon: {
        marginRight: 2 * theme.spacing.unit,
        marginLeft: 0,
    },
});

AccountInformationSettings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(AccountInformationSettings));