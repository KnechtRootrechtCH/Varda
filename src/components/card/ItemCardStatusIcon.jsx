import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import * as Moment from 'moment';

import {
    Fade,
    ListItemIcon,
    Menu,
    MenuItem } from '@material-ui/core';

import {
    AlertCircleOutline,
    Calendar,
    CalendarQuestion,
    Check,
    ClockOutline,
    Delete,
    Download,
    EyeOff,
    PlusCircleOutline,
    Sync }  from 'mdi-material-ui';

import MetadataService from '../../service/MetadataService';
import constants from '../../config/constants';

@withNamespaces()
@inject('DownloadStatusStore')
@observer
class ItemCardStatusIcon extends React.Component {

    state = {
        editMenuAnchor: null,
    }

    handleStatusChange = (status) => {
        const previous = this.props.statusItem ? this.props.statusItem.status : '';
        if (this.props.downloadList) {
            const key = this.props.itemKey;
            const title = this.props.statusItem.title;
            this.props.DownloadStatusStore.updateStatusByKey(key, title, status, previous);
        } else {
            const item = this.props.item;
            this.props.DownloadStatusStore.updateStatus(item, status, previous);
        }

        this.handleItemEditClose();
    }

    handleItemEditOpen = event => {
        // console.debug(`${this.constructor.name}.handleItemEditOpen()`, event);
        event.preventDefault();
        this.setState({
            editMenuAnchor: event.currentTarget
        });
    }

    handleItemEditClose = () => {
        // console.debug(`${this.constructor.name}.handleItemEditClose()`);
        this.setState({
            editMenuAnchor: null
        });
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;
        const status = this.props.statusItem ? this.props.statusItem.status : null;
        const mobile = this.props.mobile;

        /*
        let release = MetadataService.getReleaseDateMoment(this.props.item)
        if (!release) {
             release = this.props.statusItem && this.props.statusItem.release ? Moment(this.props.statusItem.release.toDate()) : null;
        }
        const unreleased = release ? Moment().isBefore(release) : false;
        */

        // console.debug(`${this.constructor.name}.render()`, this.props.item.title, release, unreleased, status);
        return (
            <Fade className={mobile ? classes.rootMobile : classes.root} in={status !== constants.STATUS.LOADING}>
                <div>
                    { !status || status.length === 0 || status === constants.STATUS.REMOVED ?
                        <PlusCircleOutline className={classes.statusIcon} onClick={() => this.handleStatusChange(constants.STATUS.QUEUED)}/>
                    : status === constants.STATUS.DOWNLOADING ?
                        <Download className={classes.statusIconPrimary} onClick={this.handleItemEditOpen}/>
                    : status === constants.STATUS.DOWNLOADED ?
                        <Check className={classes.statusIconPrimary} onClick={this.handleItemEditOpen} />
                    : status === constants.STATUS.QUEUED ?
                        <ClockOutline className={classes.statusIconPrimary} onClick={this.handleItemEditOpen}/>
                    : status === constants.STATUS.NOT_AVAILABLE ?
                        <CalendarQuestion className={classes.statusIconPrimary} onClick={this.handleItemEditOpen}/>
                    : status === constants.STATUS.NOT_FOUND ?
                        <EyeOff className={classes.statusIconPrimary} onClick={this.handleItemEditOpen}/>
                    : status === constants.STATUS.REDOWNLOAD ?
                        <Sync className={classes.statusIconPrimary} onClick={this.handleItemEditOpen}/>
                    :
                        <AlertCircleOutline className={classes.statusIcon} onClick={() => this.handleStatusChange(constants.STATUS.QUEUED)}/>
                    }
                    <Menu
                        id='editMenu'
                        anchorEl={this.state.editMenuAnchor}
                        open={Boolean(this.state.editMenuAnchor)}
                        onClose={this.handleItemEditClose}>
                        <MenuItem onClick={() => this.handleStatusChange(constants.STATUS.REMOVED)}>
                            <ListItemIcon>
                                <Delete/>
                            </ListItemIcon>
                            {t('browse.card.remove')}
                        </MenuItem>
                        { status !== constants.STATUS.DOWNLOADED &&
                            <MenuItem onClick={() => this.handleStatusChange(constants.STATUS.DOWNLOADED)}>
                                <ListItemIcon>
                                    <Check/>
                                </ListItemIcon>
                                {t('browse.card.markDownloaded')}
                            </MenuItem>
                        }
                        { status === constants.STATUS.DOWNLOADED &&
                            <MenuItem onClick={() => this.handleStatusChange(constants.STATUS.REDOWNLOAD)}>
                                <ListItemIcon>
                                    <Sync/>
                                </ListItemIcon>
                                {t('browse.card.markForRedownload')}
                            </MenuItem>
                        }
                    </Menu>
                </div>
            </Fade>
        );
     }
}

const styles = theme => ({
    root: {
        marginLeft: 'auto',
    },
    rootMobile: {
        float: 'right',
    },
    statusIcon: {
        cursor: 'pointer',
        color: theme.palette.action.active,
    },
    statusIconPrimary: {
        cursor: 'pointer',
        color: theme.palette.primary.main,
    },
    statusIconDisabled: {
        cursor: 'wait',
        color: theme.palette.action.disabled,
    },
    progress: {
        opacity: 0.2,
    }
});

ItemCardStatusIcon.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemCardStatusIcon);
/*
        REMOVED: 'removed',
        QUEUED: 'queued',
        NOT_RELEASED: 'notReleased',
        NOT_AVAILABLE: 'notAvailable',
        NOT_FOUND: 'notFound',
        DOWNLOADING: 'downloading',
        DOWNLOADED: 'downloaded',
*/