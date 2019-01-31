import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth';

import { Divider } from '@material-ui/core';

import ItemActions from './ItemActions';
import ItemCast from './ItemCast';
import ItemComments from './ItemComments';
import ItemHistory from './ItemHistory';
import ItemHeader from './ItemHeader'
import ItemMetadata from './ItemMetadata'
import ItemPriority from './ItemPriority'
import ItemRecommendations from './ItemRecommendations';
import ItemStatus from './ItemStatus'

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
                { mobile &&
                    <div className={classes.statusMobile}>
                        <ItemPriority item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>
                        <ItemStatus item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>
                    </div>
                }
                <ItemMetadata itemKey={key} item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>

                <ItemActions itemKey={key} item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>

                <Divider className={classes.divider}/>
                <ItemRecommendations itemKey={key} item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>

                <Divider className={classes.divider}/>
                <ItemCast itemKey={key} item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>

                <Divider className={classes.divider}/>
                <ItemComments itemKey={key} item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>

                <Divider className={classes.divider}/>
                <ItemHistory itemKey={key} item={item} statusItem={statusItem} mobile={mobile} desktop={desktop}/>
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