import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import {
    Typography } from '@material-ui/core';

import DownloadItemGrid from './DownloadItemGrid';
import DownloadListFilterMenu from './list/DownloadListFilterMenu';
import DownloadListSortMenu from './list/DownloadListSortMenu';

@withNamespaces()
@inject('AuthenticationStore')
@inject('DownloadStatusStore')
@observer
class DownloadList extends React.Component {

    state = {
        isAdmin: false,
    }

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

    componentWillUnmount = () => {
        // console.debug(`${this.constructor.name}.componentWillUnmount() => removing scroll event listener`);
        window.removeEventListener('scroll', this.handleScroll)
    }

    componentDidUpdate (prevProps) {
        if (!this.state.isAdmin && this.props.AuthenticationStore.isAdmin) {
            this.setState({
                isAdmin: true,
            });
            console.debug(`${this.constructor.name}.componentDidUpdate() : Media type changed => Load items`);
            this.loadItems();
        }
    }

    loadItems = () => {
        console.debug(`${this.constructor.name}.loadItems()`);
        window.scrollTo(0, 0);
        this.props.DownloadStatusStore.resetStatusList();
        this.props.DownloadStatusStore.loadStatusList();
    }

    handleScroll = debounce(() => {
        if (this.props.DownloadStatusStore.loading) {
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

        return (
            <div className={classes.root}>
                <div className={mobile ? classes.containerMobile : classes.container}>
                    <div className={mobile ? classes.headerMobile : classes.header}>
                        <Typography className={classes.title} variant='h6' component='h2'>
                            <span>{t('common.list')}</span>
                        </Typography>
                        <div className={classes.controls}>
                            <DownloadListFilterMenu onUpdateList={this.loadItems}/>
                            <DownloadListSortMenu onUpdateList={this.loadItems}/>
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
});

DownloadList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(DownloadList));