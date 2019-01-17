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

import constants from '../config/constants';
import ImageService from '../service/ImageService';
import MetadataService from '../service/MetadataService';

@withNamespaces()
@inject('DownloadStatusStore')
@observer
class ItemCard extends React.Component {

    componentDidMount = () => {
        const item = this.props.item;
        this.props.DownloadStatusStore.loadStatus(item);
    }

    handleItemAdd = () => {
        const item = this.props.item;
        const status = constants.STATUS.QUEUED;
        this.props.DownloadStatusStore.updateStatus(item, status);
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

        const statusItem = this.props.DownloadStatusStore.items[key]

        return (
            <Card className={classes.root}>
                <CardActionArea component={Link} to={route}>
                    <CardMedia
                        className={classes.media}
                        image={image}
                        title={title}/>
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
                                <Tv className={classes.mediaTypeIcon} color='primary'/>
                            }
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions className={classes.actions}>
                    { statusItem !== undefined && statusItem.status !== constants.STATUS.NONE &&
                        <div>
                            <Star className={classes.actionIcon}/>
                            <Star className={classes.actionIcon}/>
                            <Star className={classes.actionIcon}/>
                        </div>
                    }
                    <Button 
                        className={classes.actionButton} 
                        onClick={this.handleItemAdd}
                        size='small' 
                        color='primary' 
                        variant='text'>
                        {t('browse.card.add')}
                    </Button>
                </CardActions>
            </Card>
        );
     }
}

const styles = theme => ({
    root: {
    },
    media: {
        height: 140,
    },
    content: {
        padding: theme.spacing.unit,
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
    },
    actionIcon: {
        color: theme.palette.action.hover,
        '&:hover': {
            color: theme.palette.action.active,
        }
    },
    actionIconActive: {
        color: theme.palette.action.active,
    },
    actionButton: {
        marginLeft: 'auto',
    },
    mediaTypeIcon: {
        verticalAlign: 'middle',
        marginBottom: 3,
        marginLeft: theme.spacing.unit / 2,
        fontSize: 18,
    }
});

ItemCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(ItemCard));