import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import {
    Typography } from '@material-ui/core';

@withNamespaces()
@inject('DownloadStatusStore')
@observer
class ItemDownloadLinks extends React.Component {

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        // const mobile = this.props.mobile;
        // const desktop = this.props.desktop;

        return (
            <div className={classes.root}>
                <Typography className={classes.header} variant='body2'>{t('details.downloadLinks')}</Typography>
            </div>
        );
    }
}

const styles = theme => ({
    root: {
    },
    header: {
        textTransform: 'uppercase',
        marginBottom: theme.spacing.unit / 2,
    },
});

ItemDownloadLinks.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemDownloadLinks);