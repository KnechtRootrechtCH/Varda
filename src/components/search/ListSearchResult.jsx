import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { withNamespaces } from 'react-i18next';

import {
    Card,
    CardContent,
    CardHeader,
    TextField,
    Typography } from '@material-ui/core';

import {
    TextBoxSearch }  from 'mdi-material-ui';


@withNamespaces()
@inject('ListSearchStore')
@observer
class ListSearchResult extends React.Component {
    state = {

    }

    handleInputChange = (value) => {
        this.props.updateSearchString(this.props.index, value)
    }

    setInputRef = ref => {
        this.setState({
            inputRef: ref,
        });
        if(ref) {
            ref.focus();
        }
    }

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props);
        const classes = this.props.classes;
        const t = this.props.t;
        const item = this.props.item;

        return (
            <Card className={classes.root}>
                <CardContent>
                    <TextField
                        className={classes.searchAsYouType}
                        label={t('settings.listSearch.movieDbSearch')} 
                        variant="outlined"
                        value={item.editedSearchString}/>
                    <Typography>{item.result ? item.result.title : `${t('common.status.notFound')}…`}</Typography>
                    <Typography>{item.originalSearchString}</Typography>
                </CardContent>
            </Card>
        );
     }

}

const styles = theme => ({
    root: {
        marginBottom: theme.spacing.unit,
    },
    title: {

    },
    searchAsYouType: {
        width: '100%'
    },
});

ListSearchResult.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListSearchResult);