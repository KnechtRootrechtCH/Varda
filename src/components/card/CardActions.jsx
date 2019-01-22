import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withRouter, Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import {
    Button,
    CardActions } from '@material-ui/core';

import { Star } from '@material-ui/icons';

import StatusIcon from './StatusIcon';

import constants from '../config/constants';
import ImageService from '../service/ImageService';
import MetadataService from '../service/MetadataService';

@withNamespaces()
@inject('ConfigurationStore')
@inject('DownloadStatusStore')
@inject('MovieDbStore')
@observer
class ItemCard extends React.Component {

    state = {
        priority: 100,
    }

    componentDidMount = () => {
        const item = this.props.item;
        this.props.DownloadStatusStore.loadStatus(item);
    }

    handleStatusChange = (status) => {
        const item = this.props.item;
        const previous = this.props.statusItem ? this.props.statusItem.status : '';
        this.props.DownloadStatusStore.updateStatus(item, status, previous);
    }

    handlePriorityChange = (priority) => {
        console.debug(`${this.constructor.name}.handlePriorityChange()`, priority);
        const item = this.props.item;
        const previous = this.props.statusItem ? this.props.statusItem.priority : 0;
        this.props.DownloadStatusStore.updatePriority(item, priority, previous);
    }

    handlePriorityHover = (priority) => {
        // console.debug(`${this.constructor.name}.handlePriorityHover()`, priority);
        this.setState({
            priority: priority,
        });
    }

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props.item);
        const classes = this.props.classes;
        const t = this.props.t;

        const mobile = isWidthDown('xs', this.props.width);

        const item = this.props.item;
        const key = MetadataService.getKey(item);

        let statusItem = this.props.DownloadStatusStore.items[key];
        if (!statusItem) {
            statusItem = {
                status: constants.STATUS.REMOVED,
                priority: 100,
            }
        }

        const priority = this.state.priority < 100 ? this.state.priority : statusItem.priority;
        const priorityCount = this.props.ConfigurationStore.configuration.priorityCount;
        let priorities = [];
        for (let i = priorityCount; i > 0; i--) {
            priorities.push(i);
        }

        const selected = statusItem && statusItem.status && statusItem.status !== constants.STATUS.REMOVED ? true : false;

        return (
            <CardActions className={mobile ? classes.rootMobile : classes.root}>
                { selected &&
                    <StatusIcon item={item} statusItem={statusItem}/>
                }
                { selected ?
                    <div className={classes.actionRight}>
                    { priorities.map((p) => {
                        return (
                            <Star
                                key={p}
                                className={priority <= p ? classes.priorityIconActive : classes.priorityIcon}
                                onMouseOut={() => this.handlePriorityHover(100)}
                                onMouseOver={() => this.handlePriorityHover(p)}
                                onClick={() => this.handlePriorityChange(p)}/>
                        )
                    })}
                    </div>
                :
                    <Button
                        className={classes.actionRight}
                        onClick={() => this.handleStatusChange(constants.STATUS.QUEUED)}
                        size='small'
                        color='primary'
                        variant='text'>
                        {t('browse.card.add')}
                    </Button>
                }
            </CardActions>
        );
     }
}

const styles = theme => ({
    root: {
        display: 'flex',
        height: 46,
        padding: theme.spacing.unit,
    },
    rootMobile: {
        display: 'flex',
        height: 46,
        paddingTop: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 3,
        paddingBottom: theme.spacing.unit,
        paddingRight: theme.spacing.unit * 3,
    },
    actionRight: {
        margin: 0,
        marginLeft: 'auto',
    },
    priorityIcon: {
        color: theme.palette.action.hover,
        cursor: 'pointer',
    },
    priorityIconActive: {
        color: theme.palette.action.active,
        cursor: 'pointer',
    },
    mediaTypeIcon: {
        verticalAlign: 'middle',
        marginBottom: 3,
        marginLeft: theme.spacing.unit / 2,
        marginRight: theme.spacing.unit / 2,
        fontSize: 18,
    },
});

ItemCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(withWidth()(ItemCard)));