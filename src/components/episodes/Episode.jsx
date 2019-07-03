import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import {
    Checkbox,
    TableRow,
    TableCell } from '@material-ui/core';

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

        // const mobile = this.props.mobile;
        // const desktop = this.props.desktop;

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
            <TableRow className={classes.root}>
                { showStatus &&
                    <TableCell className={classes.checkboxCell} padding='checkbox' align='left'>
                        <Checkbox
                            checked={downloaded}
                            color='primary'
                            onChange={() => this.handleStatusToggle(!downloaded)}/>
                    </TableCell>
                }
                <TableCell align='left'>
                    {seasonNumber}x{episodeNumber}
                </TableCell>
                <TableCell align='left'>
                    {airDate}
                </TableCell>
                <TableCell align='left'>
                    {title}
                </TableCell>
            </TableRow>
        );
    }
}

const styles = theme => ({
    root: {
    },
    checkboxCell: {
        paddingLeft: 0,
    }
});

Episode.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Episode);