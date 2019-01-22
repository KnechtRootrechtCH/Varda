import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import {
    CardContent,
    Typography } from '@material-ui/core';

import {
    Movie,
    Tv } from '@material-ui/icons';

import ItemCardStatusIcon from './ItemCardStatusIcon'


import constants from '../../config/constants';
import MetadataService from '../../service/MetadataService';

@withNamespaces()
@inject('DownloadStatusStore')
@observer
class ItemCardContent extends React.Component {

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props.item);
        const classes = this.props.classes;
        // const t = this.props.t;

        const mobile = this.props.mobile;
        const item = this.props.item;
        const statusItem = this.props.statusItem;

        const title = MetadataService.getTitle(item);
        const release = MetadataService.getReleaseDateFormated(item, 'YYYY');

        const isMovie = MetadataService.isMovie(item);
        const isTv = MetadataService.isTv(item);

        return (
            <CardContent className={mobile ? classes.rootMobile : classes.root}>
                <Typography className={classes.title} variant='subtitle2' component='h2' noWrap>
                    {title}
                </Typography>
                <ItemCardStatusIcon className={classes.statusIcon} item={item} statusItem={statusItem} mobile={mobile}/>
                <Typography className={classes.relaseDate} color='textSecondary'>
                    { isMovie &&
                        <Movie className={classes.mediaTypeIcon} color='inherit'/>
                    }
                    { isTv &&
                        <Tv className={classes.mediaTypeIcon} color='secondary'/>
                    }
                    {release}
                </Typography>
            </CardContent>
        );
     }
}

const styles = theme => ({
    root: {
        position: 'relative',
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit / 2,
        paddingLeft: theme.spacing.unit,
    },
    rootMobile: {
        position: 'relative',
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit * 3,
        paddingBottom: theme.spacing.unit / 2,
        paddingLeft: theme.spacing.unit * 3,
    },
    title: {
        paddingRight: theme.spacing.unit * 4,
    },
    statusIcon: {

    },
    mediaTypeIcon: {
        verticalAlign: 'middle',
        marginBottom: 3,
        marginLeft: -1,
        marginRight: theme.spacing.unit / 2,
        fontSize: 18,
    },
});

ItemCardContent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemCardContent);