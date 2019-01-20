import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { inject, observer } from 'mobx-react';
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
    ChevronLeft }  from 'mdi-material-ui';

@withNamespaces()
@inject('MovieDbStore')
@observer
class SearchDrawer extends React.Component {

    state = {
        drawer: false,
        searchString: '',
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

    handleChange = (value) => {
        this.setState({
            searchString: value,
        });
        this.update();
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
            <div className={classes.root}>
                <IconButton onClick={this.handleOpen}>
                    <Search/>
                </IconButton>
                <Slide in={this.state.drawer} mountOnEnter={true} unmountOnExit={true}>
                    <AppBar color='default'>
                        <Toolbar>
                            <InputBase
                                autoFocus={true}
                                value={this.state.searchString}
                                className={classes.input}
                                inputRef={(input) => { this.setInputRef(input) }}
                                onChange={({ target: { value } }) => this.handleChange(value)}
                                placeholder={t('common.search')}
                                startAdornment={
                                    <ChevronLeft className={classes.backIcon} onClick={this.handleClose}/>
                                }
                                endAdornment={
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
        marginRight: theme.spacing.unit * 2,
    },
    clearIcon: {
        cursor: 'pointer',
        marginLeft: theme.spacing.unit * 2,
    },
    input: {
        width: '100%',
    },
});

SearchDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchDrawer);