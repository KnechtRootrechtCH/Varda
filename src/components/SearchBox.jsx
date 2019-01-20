import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { withNamespaces } from 'react-i18next';

import { InputBase } from '@material-ui/core';

import {
    Clear,
    Search } from '@material-ui/icons';

@withNamespaces()
@inject('MovieDbStore')
@observer
class SearchBox extends React.Component {

    state = {
        searchString: '',
        inputRef: null,
    }

    handleChange = (value) => {
        this.setState({
            searchString: value,
        });
        this.update();
    }

    handleReset = () => {
        if (this.state.searchString.length === 0) {
            return;
        }
        this.setState({
            searchString: '',
        });
        this.state.inputRef.focus();
        this.loadItems();
    }

    update = debounce(() => {
        this.loadItems();
    }, 500)

    loadItems = () => {
        const mediaType = this.props.MovieDbStore.mediaType;
        this.props.MovieDbStore.clearItems();
        this.props.MovieDbStore.loadItems(mediaType, this.state.searchString);
    }

    setInputRef = ref => {
        this.setState({
            inputRef: ref,
        });
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        return (
            <div className={classes.search}>
                <div className={classes.searchIcon}>
                    <Search/>
                </div>
                <InputBase
                    placeholder={t('common.search') + '…'}
                    value={this.state.searchString}
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputRef={(input) => { this.setInputRef(input) }}
                    onChange={({ target: { value } }) => this.handleChange(value)}/>
            </div>
        );
     }
}

const styles = theme => ({
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.action.disabled, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.action.disabled, 0.25),
        },
        marginLeft: 0,
        width: '100%',
    },
    searchIcon: {
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: 0,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    clearIcon: {
        cursor: 'pointer',
        paddingRight: theme.spacing.unit,
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
        height: '100%',
    },
      inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 7,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 200,
            '&:focus': {
                width: 600,
            },
        },
    },
});

SearchBox.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchBox);