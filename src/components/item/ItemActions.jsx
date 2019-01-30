import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import {
    Button,
    Fade } from '@material-ui/core';

import {
    AlertCircleOutline,
    Calendar,
    CalendarQuestion,
    Check,
    CommentText,
    ClockOutline,
    Delete,
    Download,
    EyeOff,
    PlusCircleOutline,
    Star,
    Sync }  from 'mdi-material-ui';

import constants from '../../config/constants';

@withNamespaces()
@inject('ConfigurationStore')
@inject('DownloadStatusStore')
@observer
class ItemActions extends React.Component {

    state = {

    }

    handleStatusChange = (status) => {
        const item = this.props.item;
        const previous = this.props.statusItem ? this.props.statusItem.status : '';
        this.props.DownloadStatusStore.updateStatus(item, status, previous);
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        const item = this.props.item;
        const statusItem = this.props.statusItem;
        const mobile = this.props.mobile;
        const buttonVariant = mobile ? 'text' : 'text';

        const status = statusItem && statusItem.status ? statusItem.status : constants.STATUS.REMOVED;

        const priority = this.state.priority < 100 ? this.state.priority : statusItem ? statusItem.priority : 100;
        const priorityCount = this.props.ConfigurationStore.configuration.priorityCount;

        let priorities = [];
        for (let i = priorityCount; i > 0; i--) {
            priorities.push(i);
        }

        // console.debug(`${this.constructor.name}.render()`, rows);
        /*
        REMOVED: 'removed',
        QUEUED: 'queued',
        NOT_RELEASED: 'notReleased',
        NOT_AVAILABLE: 'notAvailable',
        NOT_FOUND: 'notFound',
        REDOWNLOAD: 'redownload',
        DOWNLOADING: 'downloading',
        DOWNLOADED: 'downloaded',
        */
        return (
            <div className={mobile ? classes.rootMobile : classes.root}>
                { status === constants.STATUS.REMOVED &&
                <Fade in={true}>
                    <Button
                        className={mobile ? classes.buttonMobile : classes.button}
                        color='primary'
                        variant={buttonVariant}
                        onClick={() => this.handleStatusChange(constants.STATUS.QUEUED)}>
                        <PlusCircleOutline className={classes.buttonIcon}/>
                        {t('details.actions.add')}
                    </Button>
                </Fade>
                }

                { status !== constants.STATUS.REMOVED && status !== constants.STATUS.DOWNLOADED &&
                <Fade in={true}>
                    <Button
                        className={mobile ? classes.buttonMobile : classes.button}
                        color='primary'
                        variant={buttonVariant}
                        onClick={() => this.handleStatusChange(constants.STATUS.REMOVED)}>
                        <Delete className={classes.buttonIcon}/>
                        {t('details.actions.remove')}
                    </Button>
                </Fade>
                }

                { status === constants.STATUS.DOWNLOADED &&
                <Fade in={true}>
                    <Button
                        className={mobile ? classes.buttonMobile : classes.button}
                        color='primary'
                        variant={buttonVariant}
                        onClick={() => this.handleStatusChange(constants.STATUS.REDOWNLOAD)}>
                        <Sync className={classes.buttonIcon}/>
                        {t('details.actions.redownload')}
                    </Button>
                </Fade>
                }

                <Fade in={true}>
                    <Button
                        className={mobile ? classes.buttonMobile : classes.button}
                        color='primary'
                        variant={buttonVariant}>
                        <CommentText className={classes.buttonIcon}/>
                        {t('details.actions.comment')}
                    </Button>
                </Fade>
            </div>
        );
    }
}

const styles = theme => ({
    root: {
        textAlign: 'center'
    },
    rootMobile: {
        textAlign: 'center',
    },
    header: {
        textTransform: 'uppercase',
        marginBottom: theme.spacing.unit / 2,
    },
    button: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginLeft: theme.spacing.unit,
    },
    buttonMobile: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginLeft: theme.spacing.unit,
    },
    buttonIcon: {
        marginRight: theme.spacing.unit,
        marginLeft: 0,
    },
    priorities: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
});

ItemActions.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemActions);