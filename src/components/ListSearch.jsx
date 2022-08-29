import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { withNamespaces } from 'react-i18next';

import {
    Button,
    TextField,
    Typography } from '@material-ui/core';

import {
    TextBoxSearch }  from 'mdi-material-ui';
import ListSearchResults from './search/ListSearchResults';

@withNamespaces()
@inject('ListSearchStore')
@observer
class ListsSearch extends React.Component {
    state = {
        searchInput: '',
        searchText: '',
        searchItems: [],
        searchSubmited: false,
    }

    handleInputChange = (value) => {
        this.setState({
            searchInput: value
        });
    }

    handleSearchSubmit = () => {
        console.debug(`${this.constructor.name}.handleSearchSubmit()`);
        const items = this.state.searchInput.split('\n');
        this.setState({
            searchSubmited: true,
            searchInput: '',
            searchItems: items
        });
        this.props.ListSearchStore.setSearchStrings(items);
    }

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props);
        const classes = this.props.classes;
        const t = this.props.t;

        return (
            <div className={classes.root}>
                <div className={classes.container}>
                    <div className={classes.header}>
                        <Typography className={classes.title} variant='h6' component='h2'>
                            <span>{t('settings.listSearch.title')}</span>
                        </Typography>
                    </div>
                    <div className={classes.inputContainer}>
                        <TextField
                            className={classes.input}
                            value={this.state.searchInput}
                            label={t('settings.listSearch.searchInput')}
                            placeholder='…'
                            fullWidth
                            multiline
                            minRows={this.state.searchSubmited && this.state.searchInput.length === 0 ? 1 : 10}
                            margin='normal'
                            variant='outlined'
                            onChange={({ target: { value } }) => this.handleInputChange(value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            />
                        <Button
                            className={classes.search}
                            disabled={!this.state.searchInput}
                            color='primary'
                            variant='text'
                            onClick={() => this.handleSearchSubmit()}>
                            <TextBoxSearch className={classes.buttonIcon}/>
                            {t('common.search')}
                        </Button>
                    </div>
                    <ListSearchResults/>
                </div>
            </div>
        );
     }

}

const styles = theme => ({
    root: {
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(3),
        marginBottom: theme.spacing(2),
        marginLeft: theme.spacing(3),
    },
    container: {
        marginRight: theme.spacing(3),
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(3),
    },
    header: {
        paddingTop: theme.spacing(2),
        marginRight: 0,
        marginBottom: theme.spacing(1),
        marginLeft: 0,
    },
    content: {
        paddingTop: theme.spacing(2),
        marginRight: 0,
        marginBottom: theme.spacing(1),
        marginLeft: 0,
    },
    title: {
        display: 'inline-block',
        color: theme.palette.text.primary,
    },
    inputContainer: {
        marginTop: theme.spacing(2),
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        textAlign: 'right',
    },
    input: {
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
    },
    buttonIcon: {
        marginRight: theme.spacing(1),
        marginLeft: 0,
    },
    search: {
        marginLeft: theme.spacing(2),
    },
});

ListsSearch.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListsSearch);