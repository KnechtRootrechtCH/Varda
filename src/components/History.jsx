import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth';

import {
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Typography } from '@material-ui/core';

import {
    CheckboxBlankCircleOutline,
    CheckboxMarkedCircle,
    Filter,
    SortAscending,
    SortDescending } from 'mdi-material-ui';

import TransactionList from './history/TransactionList'
import constants from '../config/constants';

@withNamespaces()
@inject('AuthenticationStore')
@inject('ConfigurationStore')
@inject('DownloadHistoryStore')
@observer
class History extends React.Component {

    state = {
        filterMenuAnchor: null,
    }

    defaultFilterIndex = 2;

    filters = [{
            key: 'all',
            field: 'timestamp',
            operator: '>=',
            value: new Date(0, 0, 0, 0, 0, 0, 0),
        },{
            key: 'priorityChange',
            field: 'transaction',
            operator: '==',
            value: 'updatePriority'
        },{
            key: 'updateStatus',
            field: 'transaction',
            operator: '==',
            value: 'updateStatus'
        },{
            key: 'queued',
            field: 'newValue',
            operator: '==',
            value: constants.STATUS.QUEUED
        },{
            key: 'notAvailable',
            field: 'newValue',
            operator: '==',
            value: constants.STATUS.NOT_AVAILABLE
        },{
            key: 'notFound',
            field: 'newValue',
            operator: '==',
            value: constants.STATUS.NOT_FOUND
        },{
            key: 'redownload',
            field: 'newValue',
            operator: '==',
            value: constants.STATUS.REDOWNLOAD
        },{
            key: 'downloading',
            field: 'newValue',
            operator: '==',
            value: constants.STATUS.DOWNLOADING
        },{
            key: 'downloaded',
            field: 'newValue',
            operator: '==',
            value: constants.STATUS.DOWNLOADED,
        },{
            key: 'removed',
            field: 'newValue',
            operator: '==',
            value: constants.STATUS.REMOVED,
        }
    ]
    componentDidMount = () => {
        // console.debug(`${this.constructor.name}.componentDidMount() => Load items`);
        this.props.DownloadHistoryStore.setSorting('timestamp', false);
        const i = this.defaultFilterIndex;
        this.props.DownloadHistoryStore.resetHistory();
        this.props.DownloadHistoryStore.setFilter(this.filters[i]);
        this.props.DownloadHistoryStore.loadHistory();

        let timeout = this.props.ConfigurationStore.configuration.historyAutoMarkAsReadSeconds;
        if (timeout && timeout > 0) {
            setTimeout(() => {
                this.props.DownloadHistoryStore.updateTimestamp();
            }, timeout * 1000);
        }

        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount = () => {
        // console.debug(`${this.constructor.name}.componentWillUnmount() => removing scroll event listener`);
        window.removeEventListener('scroll', this.handleScroll);
        this.props.DownloadHistoryStore.updateTimestamp();
    }

    toggleSortDirection = () => {
        const sortAscending = !this.props.DownloadHistoryStore.sortAscending;
        this.props.DownloadHistoryStore.resetHistory();
        this.props.DownloadHistoryStore.setSorting('timestamp', sortAscending);
        this.props.DownloadHistoryStore.loadHistory();
    }

    handleFilterMenuOpen = event => {
        this.setState({ filterMenuAnchor: event.currentTarget });
    };

    handleFilterMenuClose = () => {
        this.setState({ filterMenuAnchor: null });
    }

    handFilterChange = (filter) => {
        // console.debug(`${this.constructor.name}.handFilterChange()`, filter.field, filter.value);
        this.props.DownloadHistoryStore.resetHistory();
        this.props.DownloadHistoryStore.setFilter(filter);
        this.props.DownloadHistoryStore.loadHistory();
        this.handleFilterMenuClose();
    }

    handleScroll = debounce(() => {
        if (this.props.DownloadHistoryStore.loading) {
            return;
        }

        const d = document.documentElement
        const offset = d.scrollTop + window.innerHeight
        const height = d.offsetHeight

        if (offset >= height - 100) {
            // console.debug(`${this.constructor.name}.handleScroll() : load next page!`);
            this.props.DownloadHistoryStore.loadHistory();
        }
    }, 100)

    render () {
        // console.debug(`${this.constructor.name}.render()`);
        const classes = this.props.classes;
        const t = this.props.t;
        const mobile = isWidthDown('xs', this.props.width);
        const desktop = isWidthUp('md', this.props.width);

        const activeFilter = this.props.DownloadHistoryStore.filter
        const activeFilterKey = activeFilter.key;

        return (
            <div className={classes.root}>
                <div className={mobile ? classes.containerMobile : classes.container}>
                    <div className={mobile ? classes.headerMobile : classes.header}>
                        <Typography className={classes.title} variant='h6' component='h2'>
                            <span>{t('common.history')}</span>
                        </Typography>
                        <div className={classes.controls}>
                            <Filter className={classes.control} onClick={this.handleFilterMenuOpen}/>
                            { this.props.DownloadHistoryStore.sortAscending ?
                                <SortAscending className={classes.control} onClick={this.toggleSortDirection}/>
                            :
                                <SortDescending className={classes.control} onClick={this.toggleSortDirection}/>
                            }
                        </div>
                    </div>
                    <div className={mobile ? classes.listMobile : classes.list}>
                        <TransactionList desktop={desktop} mobile={mobile}/>
                    </div>
                </div>
                <Menu
                    id='editMenu'
                    anchorEl={this.state.filterMenuAnchor}
                    open={Boolean(this.state.filterMenuAnchor)}
                    onClose={this.handleFilterMenuClose}>
                        { this.filters.map((filter) => {
                            return (
                                <MenuItem key={filter.key} onClick={() => this.handFilterChange(filter)}>
                                    <ListItemIcon>
                                        { activeFilterKey === filter.key ?
                                            <CheckboxMarkedCircle/>
                                        :
                                            <CheckboxBlankCircleOutline/>
                                        }
                                    </ListItemIcon>
                                    <ListItemText>
                                        {t(`history.filter.${filter.key}`)}
                                    </ListItemText>
                                </MenuItem>
                            )
                        })}
                </Menu>
            </div>
        );
    }
}

const styles = theme => ({
    root: {
        padding: 0,
        maxWidth: 1280,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    container: {
        marginRight: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit,
        marginLeft: theme.spacing.unit * 3,
    },
    containerMobile: {
        marginRight: 0,
        marginBottom: theme.spacing.unit,
        marginLeft: 0,
    },
    header: {
        paddingTop: theme.spacing.unit * 2,
        marginRight: 0,
        marginBottom: theme.spacing.unit,
        marginLeft: 0,
    },
    headerMobile: {
        paddingTop: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 2,
    },
    title: {
        display: 'inline-block',
    },
    controls: {
        float: 'right',
        paddingTop: theme.spacing.unit / 2,
    },
    control: {
        cursor: 'pointer',
        color: theme.palette.action.active,
        marginLeft: theme.spacing.unit,
        marginRight: 0,
        '&:hover': {
            color: theme.palette.primary.main,
        }
    }
});

History.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(History));