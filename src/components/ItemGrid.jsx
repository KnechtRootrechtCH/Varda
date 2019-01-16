import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import {
    Grid,
    Card } from '@material-ui/core';

@withNamespaces()
@inject('MovieDbStore')
@observer
class ItemGrid extends React.Component {

    render () {
        console.debug(`${this.constructor.name}.render()`, this.props.MovieDbStore.items);
        const classes = this.props.classes;
        const t = this.props.t;

        return (
            <div className={classes.root}>
                <Grid container>
                    { this.props.MovieDbStore.items.map((item, index) => {
                        return (
                            <Grid key={index} item xs={12}>
                                item grid
                            </Grid>
                        )
                    })}
                </Grid>
            </div>
        );
     }
}

const styles = theme => ({
    root: {
    },
});

ItemGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemGrid);