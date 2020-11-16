import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import { withNamespaces } from 'react-i18next';

import {
    AppBar,
    IconButton,
    Slide,
    InputBase,
    Toolbar } from '@material-ui/core';

import { Search } from '@material-ui/icons';

import {
    Close,
    ArrowLeft }  from 'mdi-material-ui';

@withNamespaces()
@inject('DownloadStatusStore')
@inject('MovieDbStore')
@observer
class SearchDrawer extends React.Component {

    state = {
        drawer: false,
        inputRef: null,
    }

    handleOpen = () =>
    {
        this.setState({
            drawer: true,
        });
    }

    handleClose = () =>
    {
        this.setState({
            drawer: false,
        });
        this.handleReset();
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

    handleChange = (value) => {
        this.props.MovieDbStore.setSearchString(value);
        this.props.DownloadStatusStore.setSearchString(value);
        this.update();
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
        if (location.includes('/browse')) {
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

        const searchString = this.props.MovieDbStore.searchString
        const searchActive = searchString && searchString.length > 0;
        const show = this.state.drawer || searchActive ? true : false;

        return (
            <div className={classes.root}>
                <IconButton onClick={this.handleOpen}>
                    <Search/>
                </IconButton>
                <Slide
                    in={show}
                    mountOnEnter={true}
                    unmountOnExit={true}>
                    <AppBar color='inherit'>
                        <Toolbar>
                            <InputBase
                                autoFocus={true}
                                value={searchString}
                                className={classes.input}
                                inputRef={(input) => { this.setInputRef(input) }}
                                onChange={({ target: { value } }) => this.handleChange(value)}
                                placeholder={t('common.search') + '…'}
                                startAdornment={
                                    <ArrowLeft className={classes.backIcon} onClick={this.handleClose}/>
                                }
                                endAdornment={
                                    searchString && searchString.length > 0 &&
                                        <Close className={classes.clearIcon} onClick={this.handleReset}/>
                                }/>
                        </Toolbar>
                    </AppBar>
                </Slide>
            </div>
        );
     }
}

const styles = theme => ({
    root: {
        display: 'inline-flex',
    },
    backIcon: {
        cursor: 'pointer',
        marginRight: theme.spacing(2),
    },
    clearIcon: {
        cursor: 'pointer',
        marginLeft: theme.spacing(2),
    },
    input: {
        width: '100%',
    },
});

SearchDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(SearchDrawer));