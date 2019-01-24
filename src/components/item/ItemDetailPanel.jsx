import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import { Divider } from '@material-ui/core';

import ItemHeader from './ItemHeader'
import ItemMetadata from './ItemMetadata'

@withNamespaces()
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
                <Divider className={classes.divider}/>
            </div>
        );
     }
}

const styles = theme => ({
    root: {
        paddingRight: theme.spacing.unit * 3,
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