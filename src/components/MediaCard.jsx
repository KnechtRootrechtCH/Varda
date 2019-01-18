import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withRouter, Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';

import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Typography } from '@material-ui/core';

import {
    Movie,
    Tv,
    Star } from '@material-ui/icons';

import StatusIcon from './StatusIcon';

import constants from '../config/constants';
import ImageService from '../service/ImageService';
import MetadataService from '../service/MetadataService';

@withNamespaces()
@inject('ConfigurationStore')
@inject('DownloadStatusStore')
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
        this.props.DownloadStatusStore.updateStatus(item, status);
    }

    handlePriorityChange = (priority) => {
        console.debug(`${this.constructor.name}.handlePriorityChange()`, priority);
        const item = this.props.item;
        this.props.DownloadStatusStore.updatePriority(item, priority);
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

        const item = this.props.item;
        const key = MetadataService.getKey(item);
        const title = MetadataService.getTitle(item);
        const release = MetadataService.getReleaseDateFormated(item, 'YYYY');
        const image = ImageService.getBackdropImage(item, constants.IMAGESIZE.BACKDROP.W500);

        const isMovie = MetadataService.isMovie(item);
        const isTv = MetadataService.isTv(item);

        const location = this.props.location.pathname.toLowerCase();
        const route = `${location}/${item.id}`;

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
            <Card className={classes.root}>
                <CardActionArea component={Link} to={route}>
                    <CardMedia
                        className={classes.media}
                        image={image}
                        title={title}>
                    </CardMedia>
                </CardActionArea>
                <CardContent className={classes.content}>
                        <Typography className={classes.title} variant='h5' component='h2'>
                            {title}
                        </Typography>
                        <Typography className={classes.relaseDate} color='textSecondary'>
                            {release}
                            { isMovie &&
                                <Movie className={classes.mediaTypeIcon} color='inherit'/>
                            }
                            { isTv &&
                                <Tv className={classes.mediaTypeIcon} color='secondary'/>
                            }

                        </Typography>
                </CardContent>
                <CardActions className={classes.actions}>
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
            </Card>
        );
     }
}

const styles = theme => ({
    root: {
    },
    media: {
        height: 150,
    },
    content: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit / 2,
        paddingLeft: theme.spacing.unit,
    },
    title: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
    releaseDate: {
    },
    actions: {
        display: 'flex',
        padding: theme.spacing.unit,
        height: 46,
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

export default withStyles(styles)(withRouter(ItemCard));