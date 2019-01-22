import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import {
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
    Plus }  from 'mdi-material-ui';

import constants from '../../config/constants';

@withNamespaces()
@inject('DownloadStatusStore')
@observer
class ItemCardStatusIcon extends React.Component {

    state = {
        editMenuAnchor: null,
    }

    handleStatusChange = (status) => {
        const item = this.props.item;
        const previous = this.props.statusItem ? this.props.statusItem.status : '';
        this.props.DownloadStatusStore.updateStatus(item, status, previous);
        this.handleItemEditClose();
    }

    handleItemEditOpen = event => {
        console.debug(`${this.constructor.name}.handleItemEditOpen()`, event);
        event.preventDefault();
        this.setState({
            editMenuAnchor: event.currentTarget
        });
    }

    handleItemEditClose = () => {
        console.debug(`${this.constructor.name}.handleItemEditClose()`);
        this.setState({
            editMenuAnchor: null
        });
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;
        const status = this.props.statusItem.status;
        const mobile = this.props.mobile;

        return (
            <div className={mobile ? classes.rootMobile : classes.root}>
                { status === constants.STATUS.QUEUED ?
                    <ClockOutline className={classes.statusIcon} onClick={this.handleItemEditOpen}/>
                : status === constants.STATUS.NOT_RELEASED ?
                    <Calendar className={classes.statusIcon} onClick={this.handleItemEditOpen}/>
                : status === constants.STATUS.NOT_AVAILABLE ?
                    <CalendarQuestion className={classes.statusIcon} onClick={this.handleItemEditOpen}/>
                : status === constants.STATUS.NOT_FOUND ?
                    <EyeOff className={classes.statusIcon} onClick={this.handleItemEditOpen}/>
                : status === constants.STATUS.REDOWNLOAD ?
                    <AlertCircleOutline className={classes.statusIcon} onClick={this.handleItemEditOpen}/>
                : status === constants.STATUS.DOWNLOADING ?
                    <Download className={classes.statusIcon} onClick={this.handleItemEditOpen}/>
                : status === constants.STATUS.DOWNLOADED ?
                    <Check className={classes.statusIcon} onClick={this.handleItemEditOpen}/>
                :
                    <Plus className={classes.statusIcon} onClick={() => this.handleStatusChange(constants.STATUS.QUEUED)}/>
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
                                <AlertCircleOutline/>
                            </ListItemIcon>
                            {t('browse.card.markForRedownload')}
                        </MenuItem>
                    }
                </Menu>
            </div>
        );
     }
}

const styles = theme => ({
    root: {
        position: 'absolute',
        top: theme.spacing.unit,
        right: theme.spacing.unit,
    },
    rootMobile: {
        position: 'absolute',
        top: theme.spacing.unit,
        right: theme.spacing.unit * 3,
    },
    statusIcon: {
        cursor: 'pointer',
        color: theme.palette.action.active,
    },
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