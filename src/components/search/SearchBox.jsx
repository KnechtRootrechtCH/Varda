import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import { withNamespaces } from 'react-i18next';

import { InputBase } from '@material-ui/core';

import { Search } from '@material-ui/icons';

@withNamespaces()
@inject('DownloadStatusStore')
@inject('MovieDbStore')
@observer
class SearchBox extends React.Component {

    state = {
        inputRef: null,
    }

    handleChange = (value) => {
        this.props.MovieDbStore.setSearchString(value);
        this.props.DownloadStatusStore.setSearchString(value);
        this.update();
    }

    handleReset = () => {
        if (this.props.MovieDbStore.searchString.length > 0) {
            this.props.MovieDbStore.setSearchString('');
        }
        if (this.props.DownloadStatusStore.searchString.length > 0) {
            this.props.DownloadStatusStore.setSearchString('');
        }
        this.state.inputRef.focus();
        this.loadItems();
    }

    update = debounce(() => {
        this.loadItems();
    }, 500)

    loadItems = () => {
        const location = this.props.location.pathname.toLowerCase();
        if (location.includes('/list')) {
            // this.props.DownloadStatusStore.resetStatusList();
            // this.props.DownloadStatusStore.loadStatusList();
        }
        if (location === '/' || location.includes('/browse')) {
            this.props.MovieDbStore.clearItems();
            this.props.MovieDbStore.loadItems();
        }
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
                    value={this.props.MovieDbStore.searchString}
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
        paddingLeft: theme.spacing(2),
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
        paddingRight: theme.spacing(1),
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
        height: '100%',
    },
      inputInput: {
        paddingTop: theme.spacing(1),
        paddingRight: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(7),
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

export default withStyles(styles)(withRouter(SearchBox));