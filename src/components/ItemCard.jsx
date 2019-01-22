import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withRouter, Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import {
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Fade,
    Typography } from '@material-ui/core';

import {
    Movie,
    Tv,
    Star } from '@material-ui/icons';

import ItemCardContent from './card/ItemCardContent'

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
        const title = MetadataService.getTitle(item);
        const image = ImageService.getBackdropImage(item, constants.IMAGESIZE.BACKDROP.W500);

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
            <Fade in={this.props.MovieDbStore.page > 0 || !this.props.MovieDbStore.loading}>
                <Card className={mobile ? classes.rootMobile : classes.root} raised={!mobile} square={mobile}>
                    <CardActionArea component={Link} to={route}>
                        <CardMedia
                            className={classes.media}
                            image={image}
                            title={title}>
                            <Typography textAlign='right'>test</Typography>
                        </CardMedia>
                    </CardActionArea>
                    <ItemCardContent item={item} statusItem={statusItem} selected={selected} mobile={mobile}/>
                    <CardActions className={mobile ? classes.actionsMobile : classes.actions}>
                        { selected &&
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
                        }
                    </CardActions>
                </Card>
            </Fade>
        );
     }
}

const styles = theme => ({
    root: {

    },
    rootMobile: {
        background: theme.palette.background.default,
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
    contentMobile: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit * 3,
        paddingBottom: theme.spacing.unit / 2,
        paddingLeft: theme.spacing.unit * 3,
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
        height: 46,
        padding: theme.spacing.unit,
    },
    actionsMobile: {
        display: 'flex',
        height: 46,
        paddingTop: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 3,
        paddingBottom: theme.spacing.unit,
        paddingRight: theme.spacing.unit * 3,
    },
    actionRight: {
        margin: 0,
        marginLeft: 0,
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