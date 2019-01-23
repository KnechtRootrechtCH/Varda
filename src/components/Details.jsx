import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth';

import { Paper } from '@material-ui/core';

import ItemInfo from './info/ItemInfo';
import MetadataService from '../service/MetadataService';

@withNamespaces()
@inject('ConfigurationStore')
@inject('DownloadStatusStore')
@inject('MovieDbStore')
@observer
class Details extends React.Component {

    componentDidMount = () => {
        if (this.props.ConfigurationStore.initialized) {
            console.debug(`${this.constructor.name}.componentDidMount() => Load item`);
            this.loadItem();
        }
    }

    componentWillUnmount = () => {
        this.props.MovieDbStore.clearItem();
    }

    componentDidUpdate (prevProps) {
        if (!prevProps.ConfigurationStore.initialized && this.props.ConfigurationStore.initialized) {
            console.debug(`${this.constructor.name}.componentDidUpdate() : Config store initialized => Load item`);
            this.loadItem();
        }
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
                    loading...
                </div>
            )
        }

        const key = MetadataService.getKey(item);
        const statusItem = this.props.DownloadStatusStore.items[key];

        return (
            <div className={classes.root}>
                { mobile ?
                    <ItemInfo item={item} statusItem={statusItem} mobile={mobile}/>
                : desktop ?
                    <div className={classes.container}>
                        <Paper className={classes.paper}>
                            <ItemInfo item={item} statusItem={statusItem} mobile={mobile}/>
                        </Paper>
                    </div>
                :
                    <Paper className={classes.paper}>
                        <ItemInfo item={item} statusItem={statusItem} mobile={mobile}/>
                    </Paper>
                }
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
    container: {
        maxWidth: 1280,
        marginRight: 'auto',
        marginLeft: 'auto',
    },
    paper: {
        margin: theme.spacing.unit * 3,
    },
});

Details.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(Details));