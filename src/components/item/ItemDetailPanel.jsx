import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth';

import { Divider } from '@material-ui/core';

import ItemCast from './ItemCast';
import ItemComments from './ItemComments';
import ItemDownloadActions from './ItemDownloadActions';
import ItemDownloadLinks from './ItemDownloadLinks';
import ItemHistory from './ItemHistory';
import ItemHeader from './ItemHeader'
import ItemMetadata from './ItemMetadata'
import ItemPriority from './ItemPriority'
import ItemRecommendations from './ItemRecommendations';
import ItemStatus from './ItemStatus'

import MetadataService from '../../service/MetadataService';
import constants from '../../config/constants';

@withNamespaces()
@inject('AuthenticationStore')
@inject('DownloadHistoryStore')
@observer
class ItemDetailPanel extends React.Component {

    render () {
        // console.debug(`${this.constructor.name}.render()`);
        const classes = this.props.classes;
        // const t = this.props.t;
        const mobile = isWidthDown('xs', this.props.width);
        const desktop = isWidthUp('md', this.props.width);

        const item = this.props.item;
        const statusItem = this.props.statusItem
        const key = MetadataService.getKey(item);

        const status = statusItem ? statusItem.status : null;
        const active = status && status.length > 0 && status !== constants.STATUS.REMOVED

        return (
            <div className={classes.root}>
                <ItemHeader itemKey={key} item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>
                { mobile &&
                    <div className={classes.statusMobile}>
                        <ItemPriority item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>
                        <ItemStatus item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>
                    </div>
                }
                <ItemMetadata itemKey={key} item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>

                { this.props.AuthenticationStore.isAdmin && active &&
                    <React.Fragment>
                        <Divider className={classes.divider}/>
                        <ItemDownloadLinks itemKey={key} item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>
                        <Divider className={classes.divider}/>
                        <ItemDownloadActions itemKey={key} item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>
                    </React.Fragment>
                }

                <Divider className={classes.divider}/>
                <ItemComments itemKey={key} item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>

                { item.recommendations && item.recommendations.results && item.recommendations.results.length > 0 &&
                    <React.Fragment>
                        <Divider className={classes.divider}/>
                        <ItemRecommendations itemKey={key} item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>
                    </React.Fragment>
                }

                { item.credits &&  item.credits.cast && item.credits.cast.length > 0 &&
                    <React.Fragment>
                        <Divider className={classes.divider}/>
                        <ItemCast itemKey={key} item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>
                    </React.Fragment>
                }

                { !this.props.DownloadHistoryStore.loading && this.props.DownloadHistoryStore.history && this.props.DownloadHistoryStore.history.size  > 0 &&
                    <React.Fragment>
                        <Divider className={classes.divider}/>
                        <ItemHistory itemKey={key} item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>
                    </React.Fragment>
                }
            </div>
        );
     }
}

const styles = theme => ({
    root: {
        paddingRight: theme.spacing.unit * 3,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 3,
    },
    divider: {
        marginTop: theme.spacing.unit,
        marginRight: 0,
        marginBottom: theme.spacing.unit,
        marginLeft: 0,
    },
    statusMobile: {
        paddingTop: theme.spacing.unit / 2,
        marginBottom: theme.spacing.unit / 2,
    },
});

ItemDetailPanel.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(ItemDetailPanel));