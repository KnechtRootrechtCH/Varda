import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import { Typography } from '@material-ui/core';

import ItemGrid from './grid/ItemGrid';
import constants from '../config/constants'

@withNamespaces()
@inject('ConfigurationStore')
@inject('MovieDbStore')
@observer
class Browse extends React.Component {

    componentDidMount = () => {
        console.debug(`${this.constructor.name}.componentDidMount() => Load items`);
        this.loadItems();
        // console.debug(`${this.constructor.name}.componentDidMount() => adding scroll event listener`);
        window.addEventListener('scroll', this.handleScroll)
    }

    componentWillUnmount = () => {
        // console.debug(`${this.constructor.name}.componentWillUnmount() => removing scroll event listener`);
        window.removeEventListener('scroll', this.handleScroll)
    }

    componentDidUpdate (prevProps) {
        if (prevProps.match.params.mediaType !== this.props.match.params.mediaType) {
            console.debug(`${this.constructor.name}.componentDidUpdate() : Media type changed => Load items`);
            this.loadItems();
        }
    }

    loadItems = () => {
        // console.debug(`${this.constructor.name}.loadItems() : Media type => `, this.props.match.params.mediaType);
        window.scrollTo(0, 0);
        this.props.MovieDbStore.clearItems();
        this.props.MovieDbStore.setMediaType(this.props.match.params.mediaType);
        this.props.MovieDbStore.loadItems();
    }

    handleScroll = debounce(() => {
        if (this.props.MovieDbStore.loading) {
            return;
        }

        const d = document.documentElement
        const offset = d.scrollTop + window.innerHeight
        const height = d.offsetHeight

        if (offset >= height - 100) {
            // console.debug(`${this.constructor.name}.handleScroll() : load next page!`);
            this.props.MovieDbStore.setMediaType(this.props.match.params.mediaType);
            this.props.MovieDbStore.loadItems();
        }
    }, 100)

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props);
        const classes = this.props.classes;
        const t = this.props.t;
        const mobile = isWidthDown('xs', this.props.width);

        const mediaType = this.props.match.params.mediaType;
        let titleKey = 'common.discover'

        if (mediaType === constants.MEDIA_TYPE.MOVIE) {
            titleKey = 'common.mediaType.plural.movie'
        } else if (mediaType === constants.MEDIA_TYPE.TV) {
            titleKey = 'common.mediaType.plural.tv'
        }

        return (
            <div className={classes.root}>
                <Typography className={mobile ? classes.titleMobile : classes.title} variant='h6' component='h2'>
                    <span>{t(titleKey)}</span>
                </Typography>
                <div className={mobile ? classes.itemGridMobile : classes.itemGrid}>
                    <ItemGrid/>
                </div>
            </div>
        );
     }
}

const styles = theme => ({
    root: {
        padding: 0,
        maxWidth: 1280,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    title: {
        marginTop: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 3,
        marginBottom: 0,
        marginLeft: theme.spacing.unit * 3,
    },
    titleMobile: {
        marginTop: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        marginBottom: 0,
        marginLeft: theme.spacing.unit * 2,
    },
    itemGrid: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit,
        marginLeft: theme.spacing.unit * 3,
    },
    itemGridMobile: {
        marginTop: theme.spacing.unit,
        marginRight: 0,
        marginBottom: theme.spacing.unit,
        marginLeft: 0,
    },
});

Browse.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(Browse));