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

import ItemGrid from './ItemGrid';

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
            console.debug(`${this.constructor.name}.componentDidMount() => Load items`);
            this.loadItems();
        }
    }

    componentDidUpdate (prevProps) {
        if (!prevProps.ConfigurationStore.initialized && this.props.ConfigurationStore.initialized) {
            console.debug(`${this.constructor.name}.componentDidUpdate() : Config store initialized => Load items`);
            this.loadItems();
        }
        if (prevProps.match.params.mediaType !== this.props.match.params.mediaType) {
            console.debug(`${this.constructor.name}.componentDidUpdate() : Media type changed => Load items`);
            this.loadItems();
        }
    }

    loadItems = () => {
        const mediaType = this.props.match.params.mediaType;
        this.props.MovieDbStore.loadItems(mediaType, this.state.search)
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
                <ItemGrid/>
            </div>
        );
     }
}

const styles = theme => ({
    root: {
        padding: 25,
    },
    paper: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    input: {
        marginLeft: 8,
        flex: 1,
    },
    iconButton: {
        padding: 10,
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