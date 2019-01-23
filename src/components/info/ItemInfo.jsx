import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import { Typography } from '@material-ui/core';

import MetadataService from '../../service/MetadataService';
import ImageService from '../../service/ImageService';

import constants from '../../config/constants';

@withNamespaces()
class ItemInfo extends React.Component {

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props.item);
        const classes = this.props.classes;
        const t = this.props.t;

        const item = this.props.item;
        const statusItem = this.props.statusItem

        // const status = statusItem ? statusItem.status : null;
        const title = MetadataService.getTitle(item);

        const image = ImageService.getBackdropImage(item, constants.IMAGESIZE.BACKDROP.W1280);
        const imageBackground = {
            backgroundImage: `linear-gradient(rgba(88, 88, 88, 0.0), rgba(0, 0, 0, 0.5)), url('${image}')`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top',
            backgroundSize: 'cover',
            width: '100%',
            height: 200,
            '&:hover': {
                opacity: 0,
            }
        };

        return (
            <div style={imageBackground}>
                <div className={classes.header}>
                    <Typography variant="h5" component="h3">
                        {statusItem && JSON.stringify(statusItem)}
                    </Typography>
                    <Typography variant="caption" component="h3">
                        {JSON.stringify(item)}
                    </Typography>
                </div>
            </div>
        );
     }
}

const styles = theme => ({
    header: {
        height: 500,
    },
});

ItemInfo.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemInfo);