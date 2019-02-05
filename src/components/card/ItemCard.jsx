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
    CardMedia,
    Fade,
    Paper,
    Typography } from '@material-ui/core';

import ItemCardActions from './ItemCardActions'
import ItemCardContent from './ItemCardContent'

import constants from '../../config/constants';
import ImageService from '../../service/ImageService';
import MetadataService from '../../service/MetadataService';

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
        if (!this.props.downloadList) {
            this.props.DownloadStatusStore.loadStatus(item);
        }
    }

    handleStatusChange = (status) => {
        const item = this.props.item;
        const previous = this.props.statusItem ? this.props.statusItem.status : '';
        this.props.DownloadStatusStore.updateStatus(item, status, previous);
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
        const downloadList = this.props.downloadList;


        const item = this.props.item;
        const key = downloadList ? this.props.itemKey : MetadataService.getKey(item);
        const mediaType = downloadList ? key.split(':')[0] : MetadataService.getMediaType(item);
        const id = downloadList ? key.split(':')[1] : item.id;
        const title = downloadList ? item.title : MetadataService.getTitle(item);
        const image = downloadList ?
            ImageService.getMovieDbImage(item.backdrop, constants.IMAGESIZE.BACKDROP.W500) :
            ImageService.getBackdropImage(item, constants.IMAGESIZE.BACKDROP.W500);

        const route = `/browse/${mediaType}/${id}`;

        let statusItem = downloadList ? item : this.props.DownloadStatusStore.items.get(key);
        if (!statusItem) {
            statusItem = {
                status: constants.STATUS.REMOVED,
                priority: 100,
            }
        }

        const status = statusItem ? statusItem.status : null;

        const show = downloadList ? true : this.props.MovieDbStore.page > 0 || !this.props.MovieDbStore.loading;

        return (
            <Fade in={show}>
                <Card className={mobile ? classes.rootMobile : classes.root} raised={!mobile} square={mobile}>
                    <CardActionArea component={Link} to={route}>
                        <CardMedia
                            className={classes.media}
                            image={image}
                            title={title}>
                            { status &&
                                <Paper className={mobile ? classes.statusMobile : classes.status}>
                                    <Typography variant='caption'>{t(`browse.card.status.${status}`)}</Typography>
                                </Paper>
                            }
                        </CardMedia>
                    </CardActionArea>
                    <ItemCardContent
                        item={item}
                        itemKey={key}
                        statusItem={statusItem}
                        mobile={mobile}
                        downloadList={downloadList}
                        mediaType={mediaType}/>
                    {!mobile &&
                        <ItemCardActions
                            item={item}
                            itemKey={key}
                            statusItem={statusItem}
                            mobile={mobile}
                            downloadList={downloadList}
                            mediaType={mediaType}/>
                    }

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
    statusMobile: {
        background: theme.palette.common.black,
        opacity: 0.8,
        position: 'absolute',
        right: theme.spacing.unit,
        bottom: theme.spacing.unit / 2,
        paddingLeft: theme.spacing.unit / 2,
        paddingRight: theme.spacing.unit / 2,
    },
    status: {
        background: theme.palette.common.black,
        opacity: 0.8,
        position: 'absolute',
        right: theme.spacing.unit,
        bottom: theme.spacing.unit / 2,
        paddingLeft: theme.spacing.unit / 2,
        paddingRight: theme.spacing.unit / 2,
    },
});

ItemCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(withWidth()(ItemCard)));