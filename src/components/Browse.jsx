import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import {
    Typography } from '@material-ui/core';

import MediaGrid from './MediaGrid';
import constants from '../config/constants'

@withNamespaces()
@inject('ConfigurationStore')
@inject('MovieDbStore')
@observer
class Browse extends React.Component {

    componentDidMount = () => {
        if (this.props.ConfigurationStore.initialized) {
            // console.debug(`${this.constructor.name}.componentDidMount() => Load items`);
            this.loadItems();
        }
        // console.debug(`${this.constructor.name}.componentDidMount() => adding scroll event listener`);
        window.addEventListener('scroll', this.handleScroll)
    }

    componentWillUnmount = () => {
        // console.debug(`${this.constructor.name}.componentWillUnmount() => removing scroll event listener`);
        window.removeEventListener('scroll', this.handleScroll)
    }

    componentDidUpdate (prevProps) {
        if (!prevProps.ConfigurationStore.initialized && this.props.ConfigurationStore.initialized) {
            // console.debug(`${this.constructor.name}.componentDidUpdate() : Config store initialized => Load items`);
            this.loadItems();
        }
        if (prevProps.match.params.mediaType !== this.props.match.params.mediaType) {
            // console.debug(`${this.constructor.name}.componentDidUpdate() : Media type changed => Load items`);
            this.loadItems();
        }
    }

    loadItems = () => {
        const mediaType = this.props.match.params.mediaType;
        this.props.MovieDbStore.clearItems();
        window.scrollTo(0, 0)
        this.props.MovieDbStore.loadItems(mediaType);
    }

    handleScroll = debounce(() => {
        const d = document.documentElement
        const offset = d.scrollTop + window.innerHeight
        const height = d.offsetHeight

        if (offset >= height - 100) {
            // console.debug(`${this.constructor.name}.handleScroll() : load next page!`);
            const mediaType = this.props.match.params.mediaType;
            if (!this.props.MovieDbStore.loading) {
                this.props.MovieDbStore.loadItems(mediaType);
            }
        }
    }, 100)

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props);
        const classes = this.props.classes;
        const t = this.props.t;

        const mediaType = this.props.match.params.mediaType;
        let titleKey = 'common.discover'

        if (mediaType === constants.MEDIA_TYPE.MOVIE) {
            titleKey = 'common.movies'
        } else if (mediaType === constants.MEDIA_TYPE.TV) {
            titleKey = 'common.seriesPlural'
        }

        return (
            <div className={classes.root}>
                <Typography className={classes.title} variant='subtitle1' component='h2'>
                    <span>{t(titleKey)}</span>
                </Typography>
                <MediaGrid/>
            </div>
        );
     }
}

const styles = theme => ({
    root: {
        padding: 0,
    },
    title: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginBottom: 0,
        marginLeft: theme.spacing.unit,
    },
});

Browse.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Browse);