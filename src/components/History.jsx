import React from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
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
@inject('DownloadHistoryStore')
@observer
class History extends React.Component {

    state = {
        sortAscending: true,
        filterMenuAnchor: null,
        filterKey: 'updateStatus',
    }

    filters = [{
            key: 'none',
            field: '',
            value: ''
        },{
            key: 'comments',
            field: 'transaction',
            value: 'comment'
        },{
            key: 'priorityChange',
            field: 'transaction',
            value: 'updatePriority'
        },{
            key: 'updateStatus',
            field: 'transaction',
            value: 'updateStatus'
        },{
            key: 'queued',
            field: 'newValue',
            value: constants.STATUS.QUEUED
        },{
            key: 'notAvailable',
            field: 'newValue',
            value: constants.STATUS.NOT_AVAILABLE
        },{
            key: 'notFound',
            field: 'newValue',
            value: constants.STATUS.NOT_FOUND
        },{
            key: 'redownload',
            field: 'newValue',
            value: constants.STATUS.REDOWNLOAD
        },{
            key: 'downloading',
            field: 'newValue',
            value: constants.STATUS.DOWNLOADING
        },{
            key: 'downloaded',
            field: 'newValue',
            value: constants.STATUS.DOWNLOADED,
        }
    ]
    componentDidMount = () => {
        // console.debug(`${this.constructor.name}.componentDidMount() => Load items`);
        this.loadItems();
    }

    loadItems () {
        // console.debug(`${this.constructor.name}.loadItems()`);
        this.props.DownloadHistoryStore.loadHistory();
    }

    toggleSortDirection = () => {
        const sortAscending = !this.state.sortAscending;
        this.setState({
            sortAscending: sortAscending
        })
    }

    handleFilterMenuOpen = event => {
        this.setState({ filterMenuAnchor: event.currentTarget });
    };

    handleFilterMenuClose = () => {
        this.setState({ filterMenuAnchor: null });
    }

    handFilterChange = (filter) => {
        // console.debug(`${this.constructor.name}.handFilterChange()`, filter.field, filter.value);
        this.props.DownloadHistoryStore.setFilter(filter.field, filter.value);
        this.loadItems();
        this.handleFilterMenuClose();
        this.setState({
            filterKey: filter.key,
        })
    }

    render () {
        // console.debug(`${this.constructor.name}.render()`);
        const classes = this.props.classes;
        const t = this.props.t;
        const mobile = isWidthDown('xs', this.props.width);
        const desktopLarge = isWidthUp('lg', this.props.width);

        return (
            <div className={classes.root}>
                <div className={classes.container}>
                    <div className={mobile ? classes.headerMobile : desktopLarge ? classes.headerDesktop : classes.header}>
                        <Typography className={classes.title} variant='h6' component='h2'>
                            <span>{t('common.history')}</span>
                        </Typography>
                        <div className={classes.controls}>
                            <Filter className={classes.control} onClick={this.handleFilterMenuOpen}/>
                            { this.state.sortAscending ?
                                <SortAscending className={classes.control} onClick={this.toggleSortDirection}/>
                            :
                                <SortDescending className={classes.control} onClick={this.toggleSortDirection}/>
                            }

                        </div>
                    </div>
                    <div className={mobile ? classes.listMobile : classes.list}>
                        <TransactionList sortAscending={this.state.sortAscending}/>
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
                                        { this.state.filterKey === filter.key ?
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
    itemGrid: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit,
        marginLeft: theme.spacing.unit * 3,
    },
    itemGridMobile: {
        marginTop: theme.spacing.unit,
        marginRight: 0,
        marginBottom: theme.spacing.unit,
        marginLeft: 0,
    },
    header: {
        paddingTop: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 2,
    },
    headerDesktop: {
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