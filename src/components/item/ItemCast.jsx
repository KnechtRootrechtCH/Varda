import React from 'react';
import PropTypes from 'prop-types';
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
import constants from '../../config/constants';

@withNamespaces()
@inject('ConfigurationStore')
@observer
class ItemCast extends React.Component {

    state = {
        showMore: false,
    }

    handleMoreToggle = ()  => {
        this.setState({
            showMore: !this.state.showMore,
        });
    }

    handleOpenUrl(url) {
        console.debug(`${this.constructor.name}.handleOpenUrl()`, url);
        window.open(url, '_blank');
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        const item = this.props.item;
        const cast = item.credits ? item.credits.cast : null;
        const cols = this.props.mobile ? 2 : this.props.desktop ?  5 : 3;
        const rows = this.props.ConfigurationStore.configuration.castDisplayRows;
        const count = rows > 0 ? rows * cols : cast.length;
        const hasMore = count < cast.length;

        // console.debug(`${this.constructor.name}.render()`, cast);
        return (
            <div className={classes.root}>
                <Typography className={classes.header} variant='body2'>{t('details.cast')}</Typography>
                <div className={classes.content}>
                    <GridList className={classes.list} cols={cols}>
                        { cast.map((profile, index) => {
                            return this.renderCastMember(profile, index, count);
                        })}
                    </GridList>
                </div>
                { hasMore &&
                    <div className={classes.actionContainer}>
                        <Button className={classes.more} onClick={this.handleMoreToggle} color='primary'>
                            { this.state.showMore ? t('common.less') : t('common.more') }
                        </Button>
                    </div>
                }
            </div>
        );
    }

    renderCastMember (profile, index, count) {
        const classes = this.props.classes;
        const profileImage = ImageService.getProfileImage(profile, constants.IMAGESIZE.PROFILE.H632);
        const url = `https://www.themoviedb.org/person/${profile.id}`;

        return (
            <Fade in={this.state.showMore || index < count} key={index} mountOnEnter={true} unmountOnExit={true}>
                <GridListTile cols={1}>
                    <img src={profileImage} alt={profile.name} />
                    <GridListTileBar
                        title={profile.name}
                        subtitle={profile.character}
                        actionIcon={
                            <IconButton className={classes.icon} onClick={() => this.handleOpenUrl(url)}>
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
        width: '100%',
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
        marginTop: theme.spacing.unit / 2,
        marginRight: 0,
        marginLeft: 'auto',
    },
    icon: {
        cursor: 'pointer',
        color: 'rgba(255, 255, 255, 0.54)',
    }
});

ItemCast.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemCast);