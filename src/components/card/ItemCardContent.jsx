import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import * as Moment from 'moment';

import {
    CardContent,
    Typography } from '@material-ui/core';

import {
    Movie,
    Star,
    Tv } from '@material-ui/icons';

import ItemCardStatusIcon from './ItemCardStatusIcon'
import MetadataService from '../../service/MetadataService';

@withNamespaces()
@inject('ConfigurationStore')
@inject('DownloadStatusStore')
@observer
class ItemCardContent extends React.Component {

    state = {
        priority: 100,
    }

    handlePriorityChange = (priority) => {
        // console.debug(`${this.constructor.name}.handlePriorityChange()`, priority);
        const previous = this.props.statusItem ? this.props.statusItem.priority : 0;
        if (this.props.downloadList) {
            const key = this.props.itemKey;
            const title = this.props.item.title;
            this.props.DownloadStatusStore.updatePriorityByKey(key, title, priority, previous);
        } else {
            const item = this.props.item;
            this.props.DownloadStatusStore.updatePriority(item, priority, previous);
        }
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

        const mobile = this.props.mobile;
        const downloadList = this.props.downloadList;
        const item = this.props.item;
        const key = this.props.itemKey;
        const statusItem = this.props.statusItem;

        const isMovie = this.props.mediaType === 'movie';
        const isTv = this.props.mediaType === 'tv';

        let title;
        let releaseMoment;
        if (downloadList) {
            title = item.title;
            releaseMoment = Moment(item.release.toDate());
        } else {
            title = MetadataService.getTitle(item);
            releaseMoment = MetadataService.getReleaseDateMoment(item);
        }

        const release = releaseMoment ? releaseMoment.format('YYYY') : '????';
        const unreleased = releaseMoment ? Moment().isBefore(releaseMoment) : true;
        const releaseDateColor = unreleased ? 'error' : 'textPrimary';

        const priority = this.state.priority < 100 ? this.state.priority : statusItem ? statusItem.priority : 100;
        const priorityCount = this.props.ConfigurationStore.configuration.priorityCount;

        let priorities = [];
        for (let i = priorityCount; i > 0; i--) {
            priorities.push(i);
        }

        return (
            <CardContent className={mobile ? classes.rootMobile : classes.root}>
                <Typography className={mobile ? classes.titleMobile : classes.title} variant='subtitle2' component='h2' noWrap>
                    {title}
                </Typography>

                <Typography className={classes.relaseDate} color='textSecondary' color={releaseDateColor}>
                    {release}
                    { isMovie &&
                        <Movie className={classes.mediaTypeIcon} color='action'/>
                    }
                    { isTv &&
                        <Tv className={classes.mediaTypeIcon} color='secondary'/>
                    }
                </Typography>
                { mobile &&
                    <div className={classes.priority}>
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
                    <ItemCardStatusIcon
                        className={classes.statusIcon}
                        itemKey={key}
                        item={item}
                        statusItem={statusItem}
                        mobile={mobile}
                        downloadList={downloadList}/>
                    </div>
                }
            </CardContent>
        );
     }
}

const styles = theme => ({
    root: {
        position: 'relative',
        padding: theme.spacing.unit,
    },
    rootMobile: {
        position: 'relative',
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 2,
    },
    title: {

    },
    titleMobile: {
        paddingRight: theme.spacing.unit * 4,
    },
    statusIcon: {

    },
    mediaTypeIcon: {
        verticalAlign: 'middle',
        marginBottom: 3,
        marginLeft: theme.spacing.unit / 2,
        marginRight: theme.spacing.unit / 2,
        fontSize: 18,
    },
    priority: {
        marginLeft: -3,
    },
    priorityIcon: {
        color: theme.palette.action.hover,
        cursor: 'pointer',
        transition: theme.transitions.create('color', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    priorityIconActive: {
        color: theme.palette.action.active,
        cursor: 'pointer',
        transition: theme.transitions.create('color', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
});

ItemCardContent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemCardContent);