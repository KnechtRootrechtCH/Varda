import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import {
    Divider,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem } from '@material-ui/core';

import {
    CheckboxBlankCircleOutline,
    CheckboxMarkedCircle,
    Filter } from 'mdi-material-ui';

@withNamespaces()
@inject('DownloadStatusStore')
@observer
class DownloadListFilterMenu extends React.Component {

    state = {
        anchor: null,
    }

    handleMenuOpen = event => {
        this.setState({ anchor: event.currentTarget });
    };

    handleMenuClose = () => {
        this.setState({ anchor: null });
        if (this.props.DownloadStatusStore.listParametersChanged) {
            const filter = this.props.DownloadStatusStore.filter;
            localStorage.setItem('varda.list.filter', JSON.stringify(filter));
            this.props.onUpdateList();
        }
    }

    handleDirectionChange = () => {
        const current = this.props.DownloadStatusStore.sortAscending;
        this.props.DownloadStatusStore.setSortDirection(!current);
        this.handleMenuClose();
    }

    handleMediaTypeChange = (value) => {
        this.props.DownloadStatusStore.setMediaTypeFilter(value);
        this.handleMenuClose();
    }

    handleStatusChange = (value) => {
        this.props.DownloadStatusStore.setStatusFilter(value);
        this.handleMenuClose();
    }

    handlePriorityChange = (value) => {
        this.props.DownloadStatusStore.setPriorityFilter(value);
        this.handleMenuClose();
    }

    render () {
        // sconsole.debug(`${this.constructor.name}.render()`);
        const classes = this.props.classes;
        const t = this.props.t;

        const anchor = this.state.anchor;

        const mediaType = ['none', 'movie', 'tv'];
        const status = ['none', 'queued', 'notReleased', 'notAvailable', 'notFound', 'redownload', 'downloading', 'downloaded'];
        // const priority = [0, 1, 2, 3, 4, 5];

        const mediaTypeValue = this.props.DownloadStatusStore.filter.mediaType;
        let statusValue = this.props.DownloadStatusStore.filter.status;
        statusValue = statusValue ? statusValue : 'none';
        // const priorityValue = this.props.DownloadStatusStore.filter.priority;

        return (
            <React.Fragment>
                <Filter className={classes.control} onClick={this.handleMenuOpen}/>
                <Menu
                    id='sortMenu'
                    anchorEl={anchor}
                    open={Boolean(anchor)}
                    onClose={this.handleMenuClose}>
                    { mediaType.map((value) => {
                        return (
                            <MenuItem key={value} onClick={() => this.handleMediaTypeChange(value)}>
                                <ListItemIcon>
                                    { mediaTypeValue === value ?
                                        <CheckboxMarkedCircle/>
                                    :
                                        <CheckboxBlankCircleOutline/>
                                    }
                                </ListItemIcon>
                                <ListItemText>
                                    {t(`list.filter.mediaType.${value}`)}
                                </ListItemText>
                            </MenuItem>
                        )
                    })}
                    <Divider/>
                    { status.map((value) => {
                        return (
                            <MenuItem key={value} onClick={() => this.handleStatusChange(value)}>
                                <ListItemIcon>
                                    { statusValue === value ?
                                        <CheckboxMarkedCircle/>
                                    :
                                        <CheckboxBlankCircleOutline/>
                                    }
                                </ListItemIcon>
                                <ListItemText>
                                    {t(`list.filter.status.${value}`)}
                                </ListItemText>
                            </MenuItem>
                        )
                    })}
                </Menu>
            </React.Fragment>
        );
     }
}

const styles = theme => ({
    root: {

    },
    control: {
        cursor: 'pointer',
        color: theme.palette.action.active,
        marginLeft: theme.spacing.unit,
        marginRight: 0,
        '&:hover': {
            color: theme.palette.primary.main,
        }
    },
});

DownloadListFilterMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DownloadListFilterMenu);