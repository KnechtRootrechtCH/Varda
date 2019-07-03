import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import {
    Divider,
    ListItem,
    Typography } from '@material-ui/core';

import {
    Check,
    ClockOutline }  from 'mdi-material-ui';

import MetadataService from '../../service/MetadataService';

@withNamespaces()
@inject('DownloadStatusStore')
@observer
class Episode extends React.Component {

    handleStatusToggle = (downloaded) => {
        // console.debug(`${this.constructor.name}.handleStatusToggle()`, downloaded);
        const item = this.props.statusItem;
        const seasonNumber = this.props.seasonNumber;
        const episodeNumber = this.props.episode.episode_number;

        this.props.DownloadStatusStore.updateEpisodeStatus(item, seasonNumber, episodeNumber, downloaded)
    }

    render () {
        const classes = this.props.classes;
        // const t = this.props.t;

        const mobile = this.props.mobile;
        const desktop = this.props.desktop;

        const showStatus = this.props.showStatus;
        const seasonNumber = this.props.seasonNumber;
        const episode = this.props.episode;
        const episodeNumber = `${episode.episode_number}`.padStart(2, '0');
        const title = episode.name;
        const airDate = MetadataService.getReleaseDateFormated(episode, 'DD.MM.YYYY');

        const statusItem = this.props.statusItem;
        const downloaded = statusItem.episodes && statusItem.episodes[`${seasonNumber}:${episode.episode_number}`];
       
        // console.debug(`${this.constructor.name}.render()`, title, episodeStatus);

        return (
            <React.Fragment>
                <ListItem className={classes.root}>
                    <Typography
                        className={mobile ? classes.titleMobile : desktop ? classes.titleDesktop : classes.title}
                        color='textSecondary'
                        noWrap>
                        {seasonNumber}x{episodeNumber}: {title} ({airDate})
                    </Typography>
                    { showStatus &&
                        <Typography
                        className={classes.right}
                        align='right'
                        color='textSecondary'>
                        { downloaded ?
                            <Check className={classes.statusIconPrimary} onClick={() => this.handleStatusToggle(false)} />
                        :
                            <ClockOutline className={classes.statusIconPrimary} onClick={() => this.handleStatusToggle(true)} />
                        }
                        </Typography>
                    }
                </ListItem>
                <Divider />
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    root: {
        width: '100%',
    },
    titleMobile: {
        display: 'inline-block',
        maxWidth: 250,
    },
    titleDesktop: {
        display: 'inline-block',
        maxWidth: 600,
    },
    title: {
        display: 'inline-block',
        maxWidth: 350,
    },
    right: {
        marginLeft: 'auto',
        display: 'inline-block',
    },
    details: {
        paddingTop: 0,
        paddingLeft: theme.spacing.unit * 2,
    },
    statusIconPrimary: {
        cursor: 'pointer',
        color: theme.palette.primary.main,
    },
});

Episode.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Episode);