import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import {
    Button,
    TextField,
    Typography } from '@material-ui/core';

import {
    CalendarQuestion,
    Check,
    ClockOutline,
    Download,
    EyeOff,
    Sync }  from 'mdi-material-ui';

import ItemDownloadLinks from './ItemDownloadLinks';
import constants from '../../config/constants';

@withNamespaces()
@inject('DownloadStatusStore')
@observer
class ItemDownloadActions extends React.Component {

    state = {
        comment: '',
    }

    handleInputChange = (value) => {
        this.setState({
            comment: value,
        })
    }

    handleStatusChange = (status) => {
        const item = this.props.item;
        const statusItem = this.props.statusItem;
        const previousStatus = statusItem.status;
        const comment = this.state.comment;
        // console.debug(`${this.constructor.name}.handleStatusChangee()`, item.media_type, item.id, status, previousStatus, comment);
        this.props.DownloadStatusStore.updateStatus(item, status, previousStatus, comment);
        this.setState({
            comment: '',
        })
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        const mobile = this.props.mobile;
        // const desktop = this.props.desktop;
        const buttonVariant = mobile ? 'text' : 'text';

        return (
            <div className={classes.root}>
                <Typography className={classes.header} variant='body2'>{t('details.downloadActions')}</Typography>
                <ItemDownloadLinks item={this.props.item}/>
                <TextField
                    className={classes.input}
                    value={this.state.comment}
                    label={t('details.actions.comment')}
                    placeholder='…'
                    fullWidth
                    margin='normal'
                    variant='outlined'
                    onChange={({ target: { value } }) => this.handleInputChange(value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <div className={classes.buttonContainer}>
                    <Button
                        className={classes.action}
                        color='default'
                        variant={buttonVariant}
                        onClick={() => this.handleStatusChange(constants.STATUS.QUEUED)}>
                        <ClockOutline className={classes.buttonIcon}/>
                        {t('details.actions.queue')}
                    </Button>
                    <Button
                        className={classes.action}
                        color='default'
                        variant={buttonVariant}
                        onClick={() => this.handleStatusChange(constants.STATUS.NOT_FOUND)}>
                        <EyeOff className={classes.buttonIcon}/>
                        {t('details.actions.notFound')}
                    </Button>
                    <Button
                        className={classes.action}
                        color='default'
                        variant={buttonVariant}
                        onClick={() => this.handleStatusChange(constants.STATUS.NOT_AVAILABLE)}>
                        <CalendarQuestion className={classes.buttonIcon}/>
                        {t('details.actions.notAvailable')}
                    </Button>
                    <Button
                        className={classes.action}
                        color='default'
                        variant={buttonVariant}
                        onClick={() => this.handleStatusChange(constants.STATUS.REDOWNLOAD)}>
                        <Sync className={classes.buttonIcon}/>
                        {t('details.actions.redownload')}
                    </Button>
                    <Button
                        className={classes.action}
                        color='secondary'
                        variant={buttonVariant}
                        onClick={() => this.handleStatusChange(constants.STATUS.DOWNLOADING)}>
                        <Download className={classes.buttonIcon}/>
                        {t('details.actions.downloading')}
                    </Button>
                    <Button
                        className={classes.action}
                        color='primary'
                        variant={buttonVariant}
                        onClick={() => this.handleStatusChange(constants.STATUS.DOWNLOADED)}>
                        <Check className={classes.buttonIcon}/>
                        {t('details.actions.donwloaded')}
                    </Button>
                </div>

            </div>
        );
    }
}

const styles = theme => ({
    root: {
    },
    action: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
    buttonContainer: {
        textAlign: 'right',
    },
    buttonIcon: {
        marginRight: theme.spacing(1),
        marginLeft: 0,
    },
    header: {
        textTransform: 'uppercase',
        marginBottom: theme.spacing(0.5),
    },
});

ItemDownloadActions.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemDownloadActions);