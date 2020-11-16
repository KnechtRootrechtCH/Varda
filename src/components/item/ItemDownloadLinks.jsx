import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import {
    Link,
    Typography } from '@material-ui/core';

import { LinkVariant }  from 'mdi-material-ui';

import MetadataService from '../../service/MetadataService';

@withNamespaces()
@inject('ConfigurationStore')
@inject('MovieDbStore')
@observer
class ItemDownloadLinks extends React.Component {

    placeholder = '{query}';

    render () {
        const classes = this.props.classes;
        // const t = this.props.t;

        const item = this.props.item;
        const configuration = this.props.ConfigurationStore.configuration
        const downloadLinks = configuration.downloadLinks;
        const isMovie = MetadataService.isMovie(item);
        const isTv = MetadataService.isTv(item);

        const language = this.props.MovieDbStore.locale;
        const originalLanguage = item.original_language;

        const title = MetadataService.getTitle(item);
        const originalTitle = MetadataService.getOriginalTitle(item);
        const imdbId = item.imdb_id;

        let links = [];
        for (let key in downloadLinks) {
            const value = downloadLinks[key];
            if(isMovie && !value.movie) {
                continue;
            } else if (isTv && !value.tv) {
                continue;
            }
            if (value.languages.includes(language)) {
                links.push(value);
            } else if (originalLanguage && value.languages.includes(originalLanguage)) {
                links.push(value);
            }
        }

        // console.debug(`${this.constructor.name}.render()`, links);
        return (
            <div className={classes.root}>
                <table className={classes.table}>
                    <tbody>
                        { links.map((link, index) => {
                            return this.renderRow(link, index, title, originalTitle, imdbId);
                        })}
                    </tbody>
                </table>
            </div>
        );
    }


    renderRow (row, index, title, originalTitle, imdbId) {
        const classes = this.props.classes;
        // const t = this.props.t;

        const titleSanitized = MetadataService.sanitizeSearchString(title);
        const originalTitleSanitized = MetadataService.sanitizeSearchString(originalTitle);

        const titleDeUmlauted = MetadataService.deUmlautSearchString(title);
        const originalTitleDeUmlauted = MetadataService.deUmlautSearchString(originalTitle);

        const titleSanitizedAndDeUmlauted = MetadataService.deUmlautSearchString(titleSanitized);
        const originalTitleSanitizedAndDeUmlauted = MetadataService.deUmlautSearchString(originalTitleSanitized);

        const links = [];
        links.push({
            label: title,
            url: row.urlPattern.replace(this.placeholder, titleSanitized),
        })
        if (titleSanitizedAndDeUmlauted !== titleSanitized) {
            links.push({
                label: titleDeUmlauted,
                url: row.urlPattern.replace(this.placeholder, titleSanitizedAndDeUmlauted),
            })
        }

        if (originalTitleSanitized !== titleSanitized) {
            links.push({
                label: originalTitle,
                url: row.urlPattern.replace(this.placeholder, originalTitleSanitized),
            })
            if (originalTitleSanitizedAndDeUmlauted !== originalTitleSanitized) {
                links.push({
                    label: originalTitleDeUmlauted,
                    url: row.urlPattern.replace(this.placeholder, originalTitleSanitizedAndDeUmlauted),
                })
            }
        }

        links.push({
            label: `IMDB-ID (${imdbId})`,
            url: row.urlPattern.replace(this.placeholder, imdbId),
        })

        return (
            <tr key={index}>
                <td className={classes.labelCell}>
                    <Typography variant='body2'>
                        <span className={classes.label}>
                            {row.title}
                        </span>
                    </Typography>
                </td>
                <td className={classes.dataCell}>
                    <Typography  variant='body2'>
                        {links.map((link, index) => {
                            return this.renderLinks(link, index, links.length === (index + 1))
                        })}
                    </Typography>
                </td>
            </tr>
        )
    }

    renderLinks (link, index, last) {
        const classes = this.props.classes;
        return (
            <span key={index}>
            <Link className={classes.link} href={link.url} target='_blank' color='textPrimary'>
                {link.label}
                <LinkVariant className={classes.linkIcon} color='primary'/>
            </Link>
            { !last &&
                <span>,&nbsp;</span>
            }
            </span>
        )
    }
}

const styles = theme => ({
    root: {
    },
    header: {
        textTransform: 'uppercase',
        marginBottom: theme.spacing(0.5),
    },
    table: {
        borderSpacing: 0,
    },
    labelCell: {
        minWidth: 140,
        paddingRight: theme.spacing(1),
        paddingLeft: 0,
        verticalAlign: 'text-top',
    },
    dataCell: {
        overflow: 'hidden',
        width: 10000, // fill full width, overflow is hidden
    },
    label: {
        textTransform: 'uppercase',
    },
    link: {
        overflow: 'auto',
        cursor: 'pointer',
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    linkIcon: {
        cursor: 'pointer',
        verticalAlign: 'middle',
        width: 16,
        height: 16,
        marginBottom: 3,
        marginLeft: theme.spacing(0.5),
    },
});

ItemDownloadLinks.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemDownloadLinks);