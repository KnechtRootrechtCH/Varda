import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import { Typography } from '@material-ui/core';

import MetadataService from '../../service/MetadataService';
import ImageService from '../../service/ImageService';
import constants from '../../config/constants';

@withNamespaces()
class ItemHeader extends React.Component {

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props.item);
        const classes = this.props.classes;
        // const t = this.props.t;

        const item = this.props.item;
        const statusItem = this.props.statusItem

        // const status = statusItem ? statusItem.status : null;
        const title = MetadataService.getTitle(item);

        const image = ImageService.getBackdropImage(item, constants.IMAGESIZE.BACKDROP.W1280);

        return (
            <div className={classes.root}>

            </div>
        );
     }
}

const styles = theme => ({
    root: {

    },
});

ItemHeader.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemHeader);