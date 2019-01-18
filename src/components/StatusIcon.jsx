import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import {
    ListItemIcon,
    Menu,
    MenuItem,
    Typography } from '@material-ui/core';

import {
    CalendarToday,
    Check,
    CheckCircle,
    CloudDownload,
    Delete,
    Visibility,
    Warning,
    WatchLater } from '@material-ui/icons';

import constants from '../config/constants';

@withNamespaces()
@inject('DownloadStatusStore')
@observer
class StatusIcon extends React.Component {

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

        return (
            <Typography className={classes.root}>
                { status === constants.STATUS.QUEUED ?
                    <WatchLater className={classes.statusIcon} onClick={this.handleItemEditOpen}/>
                : status === constants.STATUS.NOT_RELEASED ?
                    <CalendarToday className={classes.statusIcon} onClick={this.handleItemEditOpen}/>
                : status === constants.STATUS.NOT_AVAILABLE ?
                    <CalendarToday className={classes.statusIcon} onClick={this.handleItemEditOpen}/>
                : status === constants.STATUS.NOT_FOUND ?
                    <Visibility className={classes.statusIcon} onClick={this.handleItemEditOpen}/>
                : status === constants.STATUS.DOWNLOADING ?
                    <CloudDownload className={classes.statusIcon} onClick={this.handleItemEditOpen}/>
                : status === constants.STATUS.DOWNLOADED ?
                    <CheckCircle className={classes.statusIcon} onClick={this.handleItemEditOpen}/>
                :
                    <Warning className={classes.statusIcon}/>
                }
                <span className={classes.statusText}>{
                    t(`common.status.${status}`)}
                </span>
                <Menu
                    id="editMenu"
                    anchorEl={this.state.editMenuAnchor}
                    open={Boolean(this.state.editMenuAnchor)}
                    onClose={this.handleItemEditClose}>
                    <MenuItem onClick={() => this.handleStatusChange(constants.STATUS.REMOVED)}>
                        <ListItemIcon>
                            <Delete/>
                        </ListItemIcon>
                        {t('browse.card.remove')}
                    </MenuItem>
                    <MenuItem onClick={() => this.handleStatusChange(constants.STATUS.DOWNLOADED)}>
                        <ListItemIcon>
                            <Check/>
                        </ListItemIcon>
                        {t('browse.card.markDownloaded')}
                    </MenuItem>
                </Menu>
            </Typography>
        );
     }
}

const styles = theme => ({
    root: {
        margin: 0,
        color: theme.palette.action.active,
        verticalAlign: 'middle',
    },
    statusIcon: {
        cursor: 'pointer',
        marginRight: theme.spacing.unit,
    },
    statusText: {
    }
});

StatusIcon.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StatusIcon);
/*
        REMOVED: 'removed',
        QUEUED: 'queued',
        NOT_RELEASED: 'notReleased',
        NOT_AVAILABLE: 'notAvailable',
        NOT_FOUND: 'notFound',
        DOWNLOADING: 'downloading',
        DOWNLOADED: 'downloaded',
*/