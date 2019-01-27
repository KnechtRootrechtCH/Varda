import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import * as Moment from 'moment';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography } from '@material-ui/core';

import {
    InformationOutline,
    Netflix }  from 'mdi-material-ui';

import MetadataService from '../../service/MetadataService';

@withNamespaces()
class ItemMetadata extends React.Component {

    state = {
        expandReleaseDates: false,
    }

    handleReleaseDateExpand = () => {
        this.setState({
            expandReleaseDates: true,
        });
    }

    handleReleaseDateClose = () => {
        this.setState({
            expandReleaseDates: false,
        });
    }

    handleOpenUrl(url) {
        console.debug(`${this.constructor.name}.handleOpenUrl()`, url);
        const win = window.open(url, '_blank');
    }

    loadExpandedReleaseDates() {
        const item = this.props.item;
        let releaseDates = [];

        const us = MetadataService.getReleaseDates(item, 'US');
        if (us) {
            us.release_dates.forEach((r) => {
                const dateString = Moment(r.release_date).format('DD.MM.YYYY');
                const value = r.note ? `${dateString} - ${r.note}` : dateString;
                releaseDates.push({
                    key: `release.us.type${r.type}`,
                    value: value,
                    display: true,
                })
            });
        }

        const ch = MetadataService.getReleaseDates(item, 'CH');
        if (ch) {
            ch.release_dates.forEach((r) => {
                const dateString = Moment(r.release_date).format('DD.MM.YYYY');
                const value = r.note ? `${dateString} - ${r.note}` : dateString;
                releaseDates.push({
                    key: `release.ch.type${r.type}`,
                    value: value,
                    display: true,
                })
            });
        }

        return releaseDates;
    }

    render () {
        const classes = this.props.classes;
        // const t = this.props.t;

        const item = this.props.item;
        // const isMovie = MetadataService.isMovie(item);
        const isTv = MetadataService.isTv(item);
        // const statusItem = this.props.statusItem

        // const status = statusItem ? statusItem.status : null;
        let rows = [];

        // original title
        const title = MetadataService.getTitle(item);
        const originalTitle = MetadataService.getOriginalTitle(item);
        const originalLanguage = item.original_language;
        rows.push({
            key: 'originalTitle',
            value: `${originalTitle} (${originalLanguage})`,
            display: originalTitle !== title,
        });

        // director
        const director = MetadataService.getDirector(item);
        const directorName = director ? director.name : '';
        const directorUrl = director ? `https://www.themoviedb.org/person/${director.id}` : '';
        rows.push({
            key: 'director',
            value:  directorName,
            display: director,
            url: directorUrl,
        });

        // runtime
        const runtime = `${item.runtime} min`;
        rows.push({
            key: 'runtime',
            value: runtime,
            display: item.runtime,
        });

        // genres
        const genres = item.genres ? item.genres.map(g => g.name).join(', ') : null;
        rows.push({
            key: 'genres',
            value: genres,
            display: genres,
        });

        // release date
        const releaseDate = MetadataService.getReleaseDateFormated(item, 'DD.MM.YYYY');
        if (isTv) {
            rows.push({
                key: 'firstAirDate',
                value: releaseDate,
                display: releaseDate,
            });
        } else {
            rows.push({
                key: 'releaseDate',
                value: releaseDate,
                display: releaseDate,
            });
        }

        // rating
        const rating = item.vote_average;
        rows.push({
            key: 'rating',
            value: `${rating}/10`,
            display: rating,
        });

        // links
        const searchString = MetadataService.getTitleSearchString(item);
        const homepage = item.homepage;
        const isNetflix = MetadataService.isNetflixUrl(homepage);
        const movieDb = `https://www.themoviedb.org/${MetadataService.getMediaType(item)}/${item.id}`;
        const traktTv = `https://trakt.tv/search?query=${searchString}`;
        rows.push({
            key: 'links',
            value: {
                homepage: homepage,
                isNetflix: isNetflix,
                movieDb: movieDb,
                traktTv: traktTv,
            },
            display: rating,
        });

        // overview
        const overview = item.overview;

        console.debug(`${this.constructor.name}.render()`, item);
        return (
            <div className={classes.root}>
                <table className={classes.table}>
                    <tbody>
                        { rows.filter(r => r.display).map((row) => {
                            return this.renderRow(row.key, row.value, row.url);
                        })}
                    </tbody>
                </table>
                { overview &&
                    <Typography className={classes.overview} variant='caption'>{overview}</Typography>
                }
                { this.renderDialog()}
            </div>
        );
    }

    renderRow (key, value, url) {
        const classes = this.props.classes;
        const t = this.props.t;

        return (
            <tr key={key}>
                <td className={classes.cell}>
                    <Typography variant='caption'>
                        <span className={classes.label}>
                            {t(`details.${key}`)}&nbsp;
                        </span>
                    </Typography>
                </td>
                { key === 'links' ?
                <td>
                    {this.renderLinks(value)}
                </td>
                :
                <td>
                    <Typography
                        variant='caption'
                        className={url || key === 'releaseDate'? classes.infoActive : classes.info}
                        onClick={url ? () => this.handleOpenUrl(url) : key  === 'releaseDate' ? this.handleReleaseDateExpand : null}>
                        {value}
                        { url ?
                            <InformationOutline className={classes.linkIcon} color='secondary' onClick={() => this.handleOpenUrl(url)}/>
                        : key === 'releaseDate' &&
                            <InformationOutline className={classes.linkIcon} color='secondary' onClick={this.handleReleaseDateExpand}/>
                        }
                    </Typography>
                </td>
                }

            </tr>
        )
    }

    renderLinks (links) {
        const classes = this.props.classes;

        return (
            <Typography variant='caption' className={classes.info}>
            <span>
                <span className={classes.infoActive} onClick={() => this.handleOpenUrl(links.movieDb)}>
                    MovieDb
                </span>
                ,&nbsp;
                <span className={classes.infoActive} onClick={() => this.handleOpenUrl(links.traktTv)}>
                    TraktTv
                </span>
                ,&nbsp;
                <span className={classes.infoActive} onClick={() => this.handleOpenUrl(links.homepage)}>
                    Homepage
                { links.isNetflix &&
                    <Netflix className={classes.netflixIcon}/>
                }
                </span>
            </span>
            </Typography>
        )
    }

    renderDialog () {
        const classes = this.props.classes;
        const t = this.props.t;

        // expanded release dates
        let expandedReleaseDates = null;
        if (this.state.expandReleaseDates) {
            expandedReleaseDates = this.loadExpandedReleaseDates();
        }

        return (
            <Dialog open={this.state.expandReleaseDates} onClose={this.handleReleaseDateClose}>
                <DialogTitle >{t('details.releaseDates')}</DialogTitle>
                <DialogContent>
                    <table className={classes.releaseDateTable}>
                        <tbody>
                        { expandedReleaseDates && expandedReleaseDates.map((row) => {
                            return (
                                <tr key={row.key + Math.random()}>
                                    <td>
                                        <Typography variant='caption'>
                                            {t(`details.${row.key}`)}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography variant='caption' noWrap>
                                            {row.value}
                                        </Typography>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleReleaseDateClose} color="primary" autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

const styles = theme => ({
    root: {
    },
    table: {
        borderSpacing: 0,
    },
    cell: {
        minWidth: 140,
        paddingRight: theme.spacing.unit,
        paddingLeft: 0,
        verticalAlign: 'text-top',
    },
    label: {
        textTransform: 'uppercase',
    },
    info: {
        overflow: 'auto',
    },
    infoActive: {
        overflow: 'auto',
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    overview: {
        marginTop: theme.spacing.unit,
    },
    linkIcon: {
        cursor: 'pointer',
        verticalAlign: 'middle',
        width: 16,
        height: 16,
        marginBottom: 3,
        marginLeft: theme.spacing.unit / 2,
    },
    netflixIcon: {
        color: '#B9090B',
        verticalAlign: 'middle',
        width: 16,
        height: 16,
        marginBottom: 3,
    },
    releaseDateTable : {
        margin: theme.spacing.unit,
    }
});

ItemMetadata.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemMetadata);