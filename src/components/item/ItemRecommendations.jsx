import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import {
    Button,
    Fade,
    GridList,
    GridListTile,
    GridListTileBar,
    IconButton,
    Typography } from '@material-ui/core';

import { Information }  from 'mdi-material-ui';

import ImageService from '../../service/ImageService';
import MetadataService from '../../service/MetadataService';
import constants from '../../config/constants';

@withNamespaces()
@inject('ConfigurationStore')
@observer
class ItemRecommendations extends React.Component {

    state = {
        showMore: false,
    }

    handleMoreToggle = ()  => {
        this.setState({
            showMore: !this.state.showMore,
        });
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        const item = this.props.item;
        const recommendations = item.recommendations ? item.recommendations.results : null;
        const cols = this.props.mobile ? 2 : this.props.desktop ?  5 : 3;
        const rows = this.props.ConfigurationStore.configuration.recommendationDisplayRows;
        const count = rows > 0 ? rows * cols : recommendations.length;
        const hasMore = count < recommendations.length;

        // console.debug(`${this.constructor.name}.render()`, recommendations);
        return (
            <div className={classes.root}>
                <Typography className={classes.header} variant='body2'>{t('details.recommendations')}</Typography>
                <div className={classes.content}>
                    <GridList className={classes.list} cols={cols}>
                        { recommendations.map((recommendation, index) => {
                            return this.renderRecommendation(recommendation, index, count);
                        })}
                    </GridList>
                </div>
                { hasMore &&
                    <div className={classes.actionContainer}>
                        <Button className={classes.more} onClick={this.handleMoreToggle}>
                            { this.state.showMore ? t('common.less') : t('common.more') }
                        </Button>
                    </div>
                }
            </div>
        );
    }

    renderRecommendation (recommendation, index, count) {
        const classes = this.props.classes;
        // const image = ImageService.getPosterImage(recommendation, constants.IMAGESIZE.POSTER.W342);
        const image = ImageService.getBackdropImage(recommendation, constants.IMAGESIZE.BACKDROP.W500);
        const title = MetadataService.getTitle(recommendation);
        const release = MetadataService.getReleaseDateFormated(recommendation, 'YYYY');
        const mediaType = MetadataService.getMediaType(recommendation);
        const id = recommendation.id;
        const address = `/browse/${mediaType}/${id}`;

        return (
            <Fade in={this.state.showMore || index < count} key={index} mountOnEnter={true} unmountOnExit={true}>
                <GridListTile cols={1}>
                    <img src={image} alt={title} />
                    <GridListTileBar
                        title={title}
                        subtitle={release}
                        actionIcon={
                            <IconButton className={classes.icon} component={Link} to={address}>
                                <Information />
                            </IconButton>
                        }>
                    </GridListTileBar>
                </GridListTile>
            </Fade>
        )
    }
}

const styles = theme => ({
    root: {

    },
    content: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
    },
    list: {
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    header: {
        textTransform: 'uppercase',
        marginBottom: theme.spacing.unit / 2,
    },
    actionContainer: {
        width: '100%',
        textAlign: 'right',
    },
    more: {
        margin: theme.spacing.unit / 2,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    }
});

ItemRecommendations.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemRecommendations);