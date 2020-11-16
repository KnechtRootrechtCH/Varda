import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import {
    Typography } from '@material-ui/core';

import { Reload } from 'mdi-material-ui';

import DownloadItemGrid from './grid/DownloadItemGrid';
import DownloadListFilterMenu from './list/DownloadListFilterMenu';
import DownloadListSortMenu from './list/DownloadListSortMenu';

@withNamespaces()
@inject('AuthenticationStore')
@inject('DownloadStatusStore')
@observer
class DownloadList extends React.Component {

    componentDidMount = () => {
        console.debug(`${this.constructor.name}.componentDidMount() => Load items`);
        const field = JSON.parse(localStorage.getItem('varda.list.sortField'));
        if (field) {
            const ascending = JSON.parse(localStorage.getItem('varda.list.sortAscending'));
            this.props.DownloadStatusStore.setSorting(field, ascending);
        }

        const filter = JSON.parse(localStorage.getItem('varda.list.filter'));
        if (filter) {
            this.props.DownloadStatusStore.setFilter(filter);
        }

        this.loadItems();
        // console.debug(`${this.constructor.name}.componentDidMount() => adding scroll event listener`);
        window.addEventListener('scroll', this.handleScroll)
    }

    UNSAFE_componentWillUnmount = () => {
        // console.debug(`${this.constructor.name}.componentWillUnmount() => removing scroll event listener`);
        window.removeEventListener('scroll', this.handleScroll)
    }

    loadItems = () => {
        window.scrollTo(0, 0);
        if (this.props.DownloadStatusStore.loading) {
            console.warn(`${this.constructor.name}.loadItems(): already loading!`);
            return;
        }
        console.debug(`${this.constructor.name}.loadItems()`);
        this.props.DownloadStatusStore.resetStatusList();
        this.props.DownloadStatusStore.loadStatusList();
    }

    handleScroll = debounce(() => {
        if (this.props.DownloadStatusStore.loading) {
            return;
        }
        if (!this.props.DownloadStatusStore.hasMoreItems) {
            return;
        }

        const d = document.documentElement
        const offset = d.scrollTop + window.innerHeight
        const height = d.offsetHeight

        if (offset >= height - 100) {
            // console.debug(`${this.constructor.name}.handleScroll() : load next page!`);
            this.props.DownloadStatusStore.loadStatusList();
        }
    }, 100)

    render () {
        // sconsole.debug(`${this.constructor.name}.render()`);
        const classes = this.props.classes;
        const t = this.props.t;
        const mobile = isWidthDown('xs', this.props.width);
        const itemCountString = '';
        /*
        const itemCount = this.props.DownloadStatusStore.list.size;
        if (itemCount > 0) {
            itemCountString = mobile ? ` (${itemCount})` : ` (${itemCount} ${t('common.items')})`
        }
        */

        return (
            <div className={classes.root}>
                <div className={mobile ? classes.containerMobile : classes.container}>
                    <div className={mobile ? classes.headerMobile : classes.header}>
                        <Typography className={classes.title} variant='h6' component='h2'>
                            <span>{t('common.list')}{itemCountString}</span>
                        </Typography>
                        <div className={classes.controls}>
                            <Reload className={classes.control} onClick={this.loadItems}/>
                            <DownloadListFilterMenu onUpdateList={this.loadItems} />
                            <DownloadListSortMenu onUpdateList={this.loadItems} />
                        </div>
                    </div>
                </div>
                <div className={mobile ? classes.itemGridMobile : classes.itemGrid}>
                    <DownloadItemGrid/>
                </div>
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
        marginRight: theme.spacing(3),
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(3),
    },
    containerMobile: {
        marginRight: 0,
        marginBottom: theme.spacing(1),
        marginLeft: 0,
    },
    header: {
        paddingTop: theme.spacing(2),
        marginRight: 0,
        marginBottom: theme.spacing(1),
        marginLeft: 0,
    },
    headerMobile: {
        paddingTop: theme.spacing(2),
        paddingRight: theme.spacing(2),
        marginBottom: theme.spacing(1),
        paddingLeft: theme.spacing(2),
    },
    title: {
        display: 'inline-block',
        color: theme.palette.text.primary,
    },
    controls: {
        float: 'right',
        paddingTop: theme.spacing(0.5),
    },
    control: {
        cursor: 'pointer',
        color: theme.palette.action.active,
        marginLeft: theme.spacing(1),
        marginRight: 0,
        '&:hover': {
            color: theme.palette.primary.main,
        }
    },
    itemGrid: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(3),
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(3),
    },
    itemGridMobile: {
        marginTop: theme.spacing(1),
        marginRight: 0,
        marginBottom: theme.spacing(1),
        marginLeft: 0,
    },
});

DownloadList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(DownloadList));