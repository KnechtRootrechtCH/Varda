import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth';

import { Typography } from '@material-ui/core';

import {
    SortAscending,
    SortDescending } from 'mdi-material-ui';

import CommentsList from './comments/CommentsList'

@withNamespaces()
@inject('AuthenticationStore')
@inject('CommentsStore')
@observer
class Messages extends React.Component {

    componentDidMount = () => {
        // console.debug(`${this.constructor.name}.componentDidMount() => Load items`);
        this.props.CommentsStore.setSorting('timestamp', false);
        this.props.CommentsStore.resetComments();
        this.props.CommentsStore.loadComments();
        window.addEventListener('scroll', this.handleScroll)
    }

    componentWillUnmount = () => {
        // console.debug(`${this.constructor.name}.componentWillUnmount() => removing scroll event listener`);
        window.removeEventListener('scroll', this.handleScroll)
    }

    toggleSortDirection = () => {
        const sortAscending = !this.props.CommentsStore.sortAscending;
        this.props.CommentsStore.resetComments();
        this.props.CommentsStore.setSorting('timestamp', sortAscending);
        this.props.CommentsStore.loadComments();
    }

    handleFilterMenuOpen = event => {
        this.setState({ filterMenuAnchor: event.currentTarget });
    };

    handleScroll = debounce(() => {
        if (this.props.CommentsStore.loading) {
            return;
        }

        const d = document.documentElement
        const offset = d.scrollTop + window.innerHeight
        const height = d.offsetHeight

        if (offset >= height - 100) {
            // console.debug(`${this.constructor.name}.handleScroll() : load next page!`);
            this.props.CommentsStore.loadComments();
        }
    }, 100)

    render () {
        // console.debug(`${this.constructor.name}.render()`);
        const classes = this.props.classes;
        const t = this.props.t;
        const mobile = isWidthDown('xs', this.props.width);
        const desktop = isWidthUp('md', this.props.width);

        return (
            <div className={classes.root}>
                <div className={mobile ? classes.containerMobile : classes.container}>
                    <div className={mobile ? classes.headerMobile : classes.header}>
                        <Typography className={classes.title} variant='h6' component='h2'>
                            <span>{t('common.messages')}</span>
                        </Typography>
                        <div className={classes.controls}>
                            { this.props.CommentsStore.sortAscending ?
                                <SortAscending className={classes.control} onClick={this.toggleSortDirection}/>
                            :
                                <SortDescending className={classes.control} onClick={this.toggleSortDirection}/>
                            }
                        </div>
                    </div>
                    <div className={mobile ? classes.listMobile : classes.list}>
                        <CommentsList desktop={desktop} mobile={mobile}/>
                    </div>
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
    }
});

Messages.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(Messages));