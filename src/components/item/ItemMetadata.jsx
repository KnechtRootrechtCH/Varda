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
    Link,
    Typography } from '@material-ui/core';

import {
    Amazon,
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
        const isAmazon = MetadataService.isAmazonUrl(homepage);
        const movieDb = `https://www.themoviedb.org/${MetadataService.getMediaType(item)}/${item.id}`;
        const traktTv = `https://trakt.tv/search?query=${searchString}`;
        rows.push({
            key: 'links',
            value: {
                homepage: homepage,
                isNetflix: isNetflix,
                isAmazon: isAmazon,
                movieDb: movieDb,
                traktTv: traktTv,
            },
            display: rating,
        });

        // overview
        const overview = item.overview;

        // console.debug(`${this.constructor.name}.render()`, item);
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
                    <Typography className={classes.overview} variant='body2'>{overview}</Typography>
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
                    <Typography variant='body2'>
                        <span className={classes.label}>
                            {t(`details.${key}`)}&nbsp;
                        </span>
                    </Typography>
                </td>
                { key === 'links' ?
                <td>
                    {this.renderLinks(value)}
                </td>
                :  url ?
                <td>
                    <Link href={url} target='_blank' color='textPrimary'>
                        <Typography className={classes.infoActive} variant='body2'>
                            {value}
                            <InformationOutline className={classes.linkIcon} color='secondary' onClick={() => this.handleOpenUrl(url)}/>
                        </Typography>
                    </Link>
                </td>
                : key === 'releaseDate' ?
                <td>
                    <Typography className={classes.infoActive} color='textPrimary' onClick={this.handleReleaseDateExpand} variant='body2'>
                        {value}
                        <InformationOutline className={classes.linkIcon} color='secondary'/>
                    </Typography>
                </td>
                :
                <td>
                    <Typography className={classes.info} variant='body2'>
                        {value}
                    </Typography>
                </td>
                }

            </tr>
        )
    }

    renderLinks (links) {
        const classes = this.props.classes;

        return (
            <Typography variant='body2' className={classes.info}>
                <Link className={classes.infoActive} href={links.movieDb} target='_blank' color='textPrimary'>

                    MovieDb
                </Link>
                ,&nbsp;
                <Link className={classes.infoActive} href={links.traktTv} target='_blank' color='textPrimary'>
                    TraktTv
                </Link>
                ,&nbsp;
                { links.isNetflix ?
                    <Link className={classes.infoActive} href={links.homepage} target='_blank' color='textPrimary'>
                        Netflix
                        <Netflix className={classes.netflixIcon}/>
                    </Link>
                : links.isAmazon ?
                    <Link className={classes.infoActive} href={links.homepage} target='_blank' color='textPrimary'>
                        Amazon
                        <Amazon className={classes.amazonIcon}/>
                    </Link>
                :
                    <Link className={classes.infoActive} href={links.homepage} target='_blank' color='textPrimary'>
                        Homepage
                    </Link>
                }

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
                                        <Typography variant='body2'>
                                            {t(`details.${row.key}`)}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography variant='body2' noWrap>
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
        textDecoration: 'none',
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
    amazonIcon: {
        color: '#ffa724',
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