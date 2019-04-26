import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import { Typography } from '@material-ui/core';

import ItemStatus from './ItemStatus';
import MetadataService from '../../service/MetadataService';
import ImageService from '../../service/ImageService';
import constants from '../../config/constants';

import ItemPriority from './ItemPriority'

@withNamespaces()
class ItemHeader extends React.Component {

    render () {
        //  console.debug(`${this.constructor.name}.render()`, this.props.item);
        const classes = this.props.classes;
        // const t = this.props.t;

        const item = this.props.item;
        const statusItem = this.props.statusItem
        const mobile = this.props.mobile;
        const desktop = this.props.desktop;
        // const status = statusItem ? statusItem.status : null;

        const title = MetadataService.getTitle(item);
        const tagline = item.tagline;
        const poster = ImageService.getPosterImage(item, constants.IMAGESIZE.POSTER.W92);

        return (
            <div className={mobile ? classes.rootMobile : classes.root}>
                <img className={classes.poster} src={poster} alt={title} />
                <div className={classes.header}>
                    { !mobile &&
                        <ItemStatus item={item} statusItem={statusItem}/>
                    }
                    <Typography className={classes.title} variant='h6' component='h2' noWrap>
                        {title}
                    </Typography>
                    { !mobile &&
                        <ItemPriority item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>
                    }
                    <Typography className={classes.tagline} variant='caption' component='h2' noWrap>
                        { tagline ?
                            <span>{tagline}</span>
                            :
                            <span>&nbsp;</span>
                        }
                    </Typography>
                </div>
            </div>
        );
    }
}

const styles = theme => ({
    root: {
        marginBottom: theme.spacing.unit * 4,
        zIndex: 100,
    },
    rootMobile: {
        marginBottom: theme.spacing.unit,
        zIndex: 100,
    },
    header: {
        paddingTop: 90,
        marginLeft: 92 + theme.spacing.unit * 3,
    },
    title: {
        color: theme.palette.common.white,
    },
    tagline: {
        fontStyle: 'italic',
    },
    year: {
        color: theme.palette.grey['500'],
    },
    poster: {
        position: 'relative',
        float: 'left',
        borderColor: theme.palette.grey['300'],
        borderStyle: 'solid',
        boxShadow: '0 0 20px 0 #666',
    }
});

ItemHeader.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemHeader);