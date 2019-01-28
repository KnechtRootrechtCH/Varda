import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth';

import { Divider } from '@material-ui/core';

import ItemCast from './ItemCast';
import ItemHistory from './ItemHistory';
import ItemDownloadActions from './ItemDownloadActions';
import ItemHeader from './ItemHeader'
import ItemMetadata from './ItemMetadata'
import ItemRecommendations from './ItemRecommendations';

import MetadataService from '../../service/MetadataService';

@withNamespaces()
@inject('AuthenticationStore')
@observer
class ItemDetailPanel extends React.Component {

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props.item);
        const classes = this.props.classes;
        // const t = this.props.t;
        const mobile = isWidthDown('xs', this.props.width);
        const desktop = isWidthUp('md', this.props.width);

        const item = this.props.item;
        const statusItem = this.props.statusItem
        const key = MetadataService.getKey(item);

        return (
            <div className={classes.root}>
                <ItemHeader itemKey={key} item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>
                <ItemMetadata itemKey={key} item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>
                { this.props.AuthenticationStore.isAdmin &&
                    <div>
                        <Divider className={classes.divider}/>
                        <ItemDownloadActions itemKey={key} item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>
                    </div>
                }
                <Divider className={classes.divider}/>
                <ItemCast itemKey={key} item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>
                <Divider className={classes.divider}/>
                <ItemRecommendations itemKey={key} item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>
                <Divider className={classes.divider}/>
                <ItemHistory itemKey={key} item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>
                { !this.props.AuthenticationStore.isAdmin &&
                    <div>
                        <Divider className={classes.divider}/>
                        <ItemDownloadActions itemKey={key} item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>
                    </div>
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
    }
});

ItemDetailPanel.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(ItemDetailPanel));