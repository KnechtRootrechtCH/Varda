import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import {
    Button,
    ExpansionPanel,
    ExpansionPanelActions,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Table,
    TableBody,
    Typography } from '@material-ui/core';

import { ExpandMore } from '@material-ui/icons';

import Episode from './Episode';

import constants from '../../config/constants';
// import MetadataService from '../../service/MetadataService';

@withNamespaces()
@inject('DownloadStatusStore')
@inject('MovieDbStore')
@observer
class Season extends React.Component {

    componentDidMount = () => {
        const key = `${this.props.itemId}:${this.props.season.season_number}`;
        if (!this.props.MovieDbStore.seasons.get(key)) {
            this.props.MovieDbStore.loadSeason(this.props.itemId, this.props.season.season_number);
        }
    }

    handleStatusToggle = (downloaded) => {
        console.debug(`${this.constructor.name}.handleStatusToggle()`, downloaded);
        // console.debug(`${this.constructor.name}.handleStatusToggle()`, downloaded);

        const item = this.props.statusItem;
        const seasonNumber = this.props.season.season_number;

        const key = `${this.props.itemId}:${this.props.season.season_number}`;
        const seasonDetails = this.props.MovieDbStore.seasons.get(key);
        const episodes = seasonDetails && seasonDetails.episodes;
        if (episodes) {
            this.props.DownloadStatusStore.updateSeasonStatus(item, seasonNumber, episodes, downloaded)
        }
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        const mobile = this.props.mobile;
        const desktop = this.props.desktop;

        const season = this.props.season;
        const episodeCount = season.episode_count;
        const seasonNumber = this.props.season.season_number;

        const key = `${this.props.itemId}:${seasonNumber}`;
        const seasonDetails = this.props.MovieDbStore.seasons.get(key);

        const statusItem = this.props.statusItem;
        const showStatus = statusItem && statusItem.status && statusItem.status !== constants.STATUS.REMOVED;

        const title = season.name;
        // const releaseDate = MetadataService.getReleaseDateFormated(season, 'YYYY');

        let downloadedCount = 0;
        const episodes = statusItem.episodes;
        if (episodes) {
            const keys = Object.keys(episodes);
            const downloadedEpisodes = keys.filter((key) => key.indexOf(`${seasonNumber}:`) === 0 && episodes[key]);
            downloadedCount = downloadedEpisodes.length;
        }
        const countLabel = `${downloadedCount}/${episodeCount}`;

        const seasonComplete = downloadedCount >= episodeCount;
        const color = seasonComplete ? 'primary' : downloadedCount > 0 ? 'secondary' : 'textPrimary';
        console.debug(`${this.constructor.name}.render()`, season, statusItem);

        return (
            <ExpansionPanel key={season.id} className={classes.root} defaultExpanded={false}>
                <ExpansionPanelSummary className={classes.summary} expandIcon={<ExpandMore/>}>
                    <Typography
                        className={mobile ? classes.titleMobile : desktop ? classes.titleDesktop : classes.title}
                        color='textPrimary'
                        noWrap>
                        {title}
                    </Typography>
                    { showStatus &&
                        <Typography
                            className={classes.right}
                            color={color}
                            noWrap>
                            {countLabel}
                        </Typography>
                    }
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.details}>
                    { seasonDetails ?
                        <Table size='small' padding='dense' className={classes.episodeTable}>
                            <TableBody>
                            { seasonDetails.episodes.map((episode, index) => {
                                return (
                                    <Episode key={index} episode={episode} index={index} showStatus={showStatus} statusItem={statusItem} seasonNumber={seasonNumber} />
                                )
                            })}
                            </TableBody>
                        </Table>
                    :
                        <Typography color='textSecondary' variant='body2'>
                            {t('details.episodeListNotAvailable')}
                        </Typography>
                    }
                </ExpansionPanelDetails>
                { seasonDetails &&
                    <ExpansionPanelActions>
                        { seasonComplete ?
                            <Button size='small' onClick={() => this.handleStatusToggle(false)}>
                                {t('details.actions.markSeasonNotDownloaded')}
                            </Button>
                        :
                            <Button size='small' onClick={() => this.handleStatusToggle(true)}>
                                {t('details.actions.markSeasonDownloaded')}
                            </Button>
                        }

                    </ExpansionPanelActions>
                }
            </ExpansionPanel>
        );
    }
}

const styles = theme => ({
    root: {

    },
    summary: {
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
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
    },
    episodeTable: {
        padding: 0,
    },

});

Season.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Season);