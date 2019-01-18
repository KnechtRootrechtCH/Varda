import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import {
    Divider,
    InputBase,
    IconButton,
    Paper } from '@material-ui/core';

import {
    Clear,
    Search } from '@material-ui/icons';

import MediaGrid from './MediaGrid';

@withNamespaces()
@inject('ConfigurationStore')
@inject('MovieDbStore')
@observer
class Browse extends React.Component {
    state = {
        search: '',
    }

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
        this.props.MovieDbStore.loadItems(mediaType, this.state.search);
    }

    handleChange = (value) => {
        this.setState({
            search: value,
        });
        this.update();
    }

    handleClear = () => {
        this.setState({
            search: '',
        });
        this.loadItems();
    }

    handleScroll = () => {
        const d = document.documentElement
        const offset = d.scrollTop + window.innerHeight
        const height = d.offsetHeight

        if (offset >= height - 100) {
            // console.debug(`${this.constructor.name}.handleScroll() : load next page!`);
            const mediaType = this.props.match.params.mediaType;
            this.props.MovieDbStore.loadItems(mediaType, this.state.search);
        }
    }

    update = debounce(() => {
        this.loadItems();
    }, 500)

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props);
        const classes = this.props.classes;
        const t = this.props.t;

        const mediaType = this.props.match.params.mediaType;

        let placeholderKey = 'browse.searchAll';
        if (mediaType === 'movie') {
            placeholderKey = 'browse.searchMovies'
        }
        if (mediaType === 'tv') {
            placeholderKey = 'browse.searchTv'
        }

        return (
            <div className={classes.root}>
                <Paper className={classes.paper} elecation={1}>
                    <IconButton className={classes.iconButton} aria-label="search" onClick={this.updateSearch}>
                        <Search />
                    </IconButton>
                    <InputBase
                        className={classes.input}
                        value={this.state.search}
                        placeholder={t(placeholderKey)}
                        onChange={({ target: { value } }) => this.handleChange(value)}/>
                    <Divider className={classes.divider} />
                    <IconButton className={classes.iconButton} aria-label="clear" onClick={this.handleClear}>
                        <Clear />
                    </IconButton>
                </Paper>
                <MediaGrid/>
            </div>
        );
     }
}

const styles = theme => ({
    root: {
        padding: theme.spacing.unit,
    },
    paper: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    input: {
        marginLeft: theme.spacing.unit,
        flex: 1,
    },
    iconButton: {
        padding: theme.spacing.unit / 2,
        margin: theme.spacing.unit / 2,
    },
    divider: {
        width: 1,
        height: 28,
        margin: 4,
    },
});

Browse.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Browse);