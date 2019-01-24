import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth';

import ItemDetailPanel from './item/ItemDetailPanel';
import MetadataService from '../service/MetadataService';
import ImageService from '../service/ImageService';
import constants from '../config/constants';

@withNamespaces()
@inject('ConfigurationStore')
@inject('DownloadStatusStore')
@inject('MovieDbStore')
@observer
class ItemDetails extends React.Component {

    componentDidMount = () => {
        console.debug(`${this.constructor.name}.componentDidMount() => Load item`);
        this.loadItem();
    }

    componentWillUnmount = () => {
        this.props.MovieDbStore.clearItem();
    }

    componentDidUpdate (prevProps) {
        if (prevProps.match.params.mediaType !== this.props.match.params.mediaType) {
            console.debug(`${this.constructor.name}.componentDidUpdate() : Media type changed => Load item`);
            this.loadItem();
        }
        if (prevProps.match.params.itemId !== this.props.match.params.itemId) {
            console.debug(`${this.constructor.name}.componentDidUpdate() : ItemId changed => Load item`);
            this.loadItem();
        }
    }

    loadItem = () => {
        // console.debug(`${this.constructor.name}.loadItems() : Media type => `, this.props.match.params.mediaType);
        const mediaType = this.props.match.params.mediaType
        const itemId = this.props.match.params.itemId
        this.props.MovieDbStore.loadItem(mediaType, itemId);
        this.props.DownloadStatusStore.loadStatusById(mediaType, itemId);
    }

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props);
        const classes = this.props.classes;
        const mobile = isWidthDown('xs', this.props.width);
        const desktop = isWidthUp('md', this.props.width);
        // const t = this.props.t;

        const item = this.props.MovieDbStore.item;
        if (!item) {
            return (
                <div className={classes.root}>
                </div>
            )
        }

        const key = MetadataService.getKey(item);
        const statusItem = this.props.DownloadStatusStore.items[key];

        const backdropImage = ImageService.getBackdropImage(item, constants.IMAGESIZE.BACKDROP.W1280);
        const headerBackgroundHeight = mobile ? 200 : desktop ? 300 : 250;
        const headerSpacerHeight = headerBackgroundHeight - (mobile ? 56 : 64) - 120;

        const backdrop = {
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6)), url('${backdropImage}')`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top',
            backgroundSize: 'cover',
            margin: 0,
            width: '100%',
            height: headerBackgroundHeight,
            '&:hover': {
                opacity: 0,
            },
            zIndex: 0,
        };

        const spacer = {
            height: headerSpacerHeight,
        }

        return (
            <div className={classes.root}>
                <div style={backdrop}/>
                <div style={spacer}/>
                <div className={mobile ? classes.contentMobile : classes.content}>
                    <ItemDetailPanel item={item} statusItem={statusItem} mobile={mobile}/>
                </div>
            </div>
        );
     }
}

const styles = theme => ({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        zIndex: 1,
        maxWidth: 1280,
        marginRight: 'auto',
        marginLeft: 'auto',
        width: '100%',
        display: 'flex',
    },
    contentMobile: {
        zIndex: 1,
    },
});

ItemDetails.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(ItemDetails));