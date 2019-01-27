import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import { Divider } from '@material-ui/core';

import ItemCast from './ItemCast';
import ItemComments from './ItemComments';
import ItemDownloadActions from './ItemDownloadActions';
import ItemHeader from './ItemHeader'
import ItemLinks from './ItemLinks';
import ItemMetadata from './ItemMetadata'
import ItemRecommendations from './ItemRecommendations';

@withNamespaces()
@inject('AuthenticationStore')
@observer
class ItemDetailPanel extends React.Component {

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props.item);
        const classes = this.props.classes;
        // const t = this.props.t;

        const item = this.props.item;
        const statusItem = this.props.statusItem

        return (
            <div className={classes.root}>
                <ItemHeader item={item} statusItem={statusItem}/>
                <ItemMetadata item={item} statusItem={statusItem}/>
                { this.props.AuthenticationStore.isAdmin &&
                    <div>
                        <Divider className={classes.divider}/>
                        <ItemDownloadActions item={item} statusItem={statusItem}/>
                    </div>
                }
                <Divider className={classes.divider}/>
                <ItemLinks item={item} statusItem={statusItem}/>
                <Divider className={classes.divider}/>
                <ItemCast item={item} statusItem={statusItem}/>
                <Divider className={classes.divider}/>
                <ItemRecommendations item={item} statusItem={statusItem}/>
                <Divider className={classes.divider}/>
                <ItemComments item={item} statusItem={statusItem}/>
                { !this.props.AuthenticationStore.isAdmin &&
                    <div>
                        <Divider className={classes.divider}/>
                        <ItemDownloadActions item={item} statusItem={statusItem}/>
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

export default withStyles(styles)(ItemDetailPanel);