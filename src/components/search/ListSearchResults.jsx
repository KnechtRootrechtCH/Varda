import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { withNamespaces } from 'react-i18next';

import ListSearchResult from './ListSearchResult';
// import { Typography } from '@material-ui/core';


@withNamespaces()
@inject('ListSearchStore')
@observer
class ListSearchResults extends React.Component {

    handleSearchSubmit = () => {
        
    }

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props);
        const classes = this.props.classes;
        // const t = this.props.t;

        let items = this.props.ListSearchStore.items;
        console.debug(`${this.constructor.name}.render()`, this.props, items);

        return (
            <div className={classes.root}>
                {items.map((value, index) => {
                    return (
                        <ListSearchResult key={index} index={index} item={value}/>
                    )
                })}
            </div>
        );
     }

}

const styles = theme => ({
    root: {

    },
});

ListSearchResults.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListSearchResults);