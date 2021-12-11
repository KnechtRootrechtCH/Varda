import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import * as Moment from 'moment';

import {
    Button,
    TextField,
    Typography } from '@material-ui/core';

import constants from '../../config/constants';

@withNamespaces()
@inject('AuthenticationStore')
@inject('ConfigurationStore')
@inject('DownloadStatusStore')
@observer
class ImportSettings extends React.Component {

    state = {
        import: '',
    }

    handleChange = (value) => {
        this.setState({
            import: value,
        });
    }

    handleStartImport = () => {
        console.debug(`${this.constructor.name}.handleStartImport()`);
        const importData = JSON.parse(this.state.import);
        console.debug(`${this.constructor.name}.handleStartImport()`, importData);
        const timestamp = Moment().format('YYYY-MM-DD HH-mm-ss');
        const comment = `Imported ${timestamp}`;
        const priorityShift = Number(this.props.ConfigurationStore.configuration.importPriorityShift);
        setTimeout(() => {
            let data = [];
            for(let key in importData) {
                data.push(importData[key]);
            }
            let index = 0;
            let intervalId = setInterval(() => {
                let item = data[index];
                index++;
                // this.validateItem(item.key, item, index)
                this.importItem(item.key, item, comment, priorityShift, index);
                if (index === data.length) {
                    clearInterval(intervalId)
                }
            }, 100);
        }, 100);
    }

    handleCullImportData = () => {
        console.debug(`${this.constructor.name}.handleCullExportData()`);
        const importData = JSON.parse(this.state.import);
        console.debug(`${this.constructor.name}.handleStartImport()`, importData);
        let results = {};
        setTimeout(() => {
            for(let key in importData) {
                results[key] = this.cullImportItem(importData[key]);
            }
            this.setState({
                import: JSON.stringify(results),
            });
        }, 100);
    }

    handleValidateImport = () => {
        console.debug(`${this.constructor.name}.handleValidateImport()`);
        const importData = JSON.parse(this.state.import);
        console.debug(`${this.constructor.name}.handleValidateImport()`, importData);
        setTimeout(() => {
            let count = 0;
            for(let key in importData) {
                count++;
                this.validateItem(key, importData[key], count);
            }
            console.debug(`${this.constructor.name}.handleValidateImport() => Validated ${count} items!`);
        }, 100);
    }

    importItem = (key, item, comment, priorityShift, index) => {
        console.debug(`${this.constructor.name}.importItem()`, key, item, index);
        const priority = Number(item.priority) + priorityShift;
        let status = item.downloadStatus;
        status = status === 'hardToFind' ? constants.STATUS.NOT_FOUND : status;
        status = status === 'notYetAvailable' ? constants.STATUS.NOT_AVAILABLE : status;
        status = status === 'queued' ? constants.STATUS.DOWNLOADING : status;
        status = status === null || status === undefined || status.length === 0 ? constants.STATUS.QUEUED : status;
        status = item.downloaded ? constants.STATUS.DOWNLOADED : status;
        this.props.DownloadStatusStore.updateStatus(item, status, '', comment, true);
        this.props.DownloadStatusStore.updatePriority(item, priority, 0, comment, true);
    }

    cullImportItem = (item) => {
        // id, name if around, title if around, priority, backdrop_path, release_date, first_air_date, air_date, downloadStatus
        delete item['credits'];
        delete item['recommendations'];
        delete item['release_dates'];
        return item;
    }

    validateItem = (key, item, count) => {
        console.debug(`${this.constructor.name}.validateItem()`, key, item, count);
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        const userInfo = `Data UID: ${this.props.AuthenticationStore.dataUid}`

        return (
            <div className={classes.root}>
                <Typography className={classes.title} variant='subtitle1' component='h2'>
                    <span>{t('settings.importSettings')}</span>
                </Typography>
                <Typography className={classes.user} variant='body2' component='h2'>
                    <span>{userInfo}</span>
                </Typography>
                <TextField
                    label='Import Data'
                    multiline
                    value={this.state.import}
                    rows={10}
                    onChange={({ target: { value } }) => this.handleChange(value)}
                    className={classes.textField}
                    variant='filled'/>
                <div className={classes.actions}>
                    <Button color='primary' className={classes.button} variant='text' onClick={this.handleStartImport}>
                        {t('settings.startImport')}
                    </Button>
                    <Button color='primary' className={classes.button} variant='text' onClick={this.handleCullImportData}>
                        {t('settings.cullImport')}
                    </Button>
                    <Button color='primary' className={classes.button} variant='text' onClick={this.handleValidateImport}>
                        {t('settings.validateImport')}
                    </Button>
                </div>
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
    textField: {
        width: 400,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    user: {
        marginBottom: theme.spacing(0.5),
        color: theme.palette.text.disabled,
    },
    actions: {

    },
    button: {
        paddingLeft: 0,
        paddingRight: 0,
        marginRight: theme.spacing(2),
    },
});

ImportSettings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(ImportSettings));