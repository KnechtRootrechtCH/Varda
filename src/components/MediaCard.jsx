import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Typography } from '@material-ui/core';

import constants from '../config/constants';
import ImageService from '../service/ImageService';
import MetadataService from '../service/MetadataService';

@withNamespaces()
class ItemCard extends React.Component {

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props.item);
        const classes = this.props.classes;
        const t = this.props.t;

        const item = this.props.item;
        const title = MetadataService.getTitle(item);
        const release = MetadataService.getReleaseDateFormated(item, 'YYYY');
        const image = ImageService.getBackdropImage(item, constants.IMAGESIZE.BACKDROP.W500);

        return (
            <Card className={classes.root}>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image={image}
                        title={title}/>
                    <CardContent className={classes.content}>
                        <Typography gutterBottom variant='h6' noWrap>
                            {title}
                        </Typography>
                        <Typography gutterBottom variant='caption' noWrap>
                            {release}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions className={classes.actions}>
                    <Button size='small' color='primary' variant='text'>
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
    actions: {
        float: 'right',
    }
});

ItemCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemCard);