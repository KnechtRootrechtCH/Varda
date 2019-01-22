import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withRouter, Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import {
    Button,
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

        const imageBackground = {
            backgroundImage: `url('${image}')`,
            cursor: 'pointer',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            width: '100%',
            height: 150,
            '&:hover': {
                opacity: 0,
            }
        };

        return (
            <Fade in={this.props.MovieDbStore.page > 0 || !this.props.MovieDbStore.loading}>
                <div className={classes.item}>
                    <div className={classes.media}>
                        <div style={imageBackground}>
                        </div>
                    </div>
                    <div className={mobile ? classes.metadataMobile : classes.metadata}>
                        <Typography className={classes.title} variant='subtitle2' component='h2'>
                            {title}
                        </Typography>
                        <Typography className={classes.relaseDate} color='textSecondary'>
                            { isMovie &&
                                <Movie className={classes.mediaTypeIcon} color='inherit'/>
                            }
                            { isTv &&
                                <Tv className={classes.mediaTypeIcon} color='secondary'/>
                            }
                            {release}
                        </Typography>
                    </div>
                </div>
            </Fade>
        );
     }
}

const styles = theme => ({
    root: {
    },
    item: {
        width: '100%',
    },
    mediaOverlay: {
        width: '100%',
        height: '100%',
        '&:hover': {
            backgroundColor: 'black',
            opacity: 0.2,
        }
    },
    metadata: {
        marginTop: theme.spacing.unit,
    },
    metadataMobile: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit * 2,
        marginLeft: theme.spacing.unit * 2,
    },
    title: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
    releaseDate: {
    },
    mediaTypeIcon: {
        verticalAlign: 'middle',
        marginBottom: 3,
        marginLeft: 0,
        marginRight: theme.spacing.unit / 2,
        fontSize: 18,
    },



    content: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit / 2,
        paddingLeft: theme.spacing.unit,
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

});

ItemCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(withWidth()(ItemCard)));