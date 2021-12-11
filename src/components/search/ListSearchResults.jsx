import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { withNamespaces } from 'react-i18next';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import ListSearchResultCard from './ListSearchResultCard';
import { Grid } from '@material-ui/core';


@withNamespaces()
@inject('ListSearchStore')
@observer
class ListSearchResults extends React.Component {

    handleSearchSubmit = () => {
        
    }

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props);
        // const classes = this.props.classes;
        // const t = this.props.t;

        const mobile = isWidthDown('xs', this.props.width);
        const spacing = mobile ? 0 : 1;

        let items = this.props.ListSearchStore.items;
        // console.debug(`${this.constructor.name}.render()`, this.props, items);

        return (
           <Grid container spacing={spacing}>
                {items.map((value, index) => {
                    return (
                        <Grid key={index} item xs={12} sm={4} md={4} lg={3} xl={3}>
                            <ListSearchResultCard key={index} index={index} item={value} mobile={mobile}/>
                        </Grid>
                    )
                })}
            </Grid>
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

export default withStyles(styles)(withWidth()(ListSearchResults));