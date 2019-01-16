import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import { Grid } from '@material-ui/core';

import MediaCard from './MediaCard';

@withNamespaces()
@inject('MovieDbStore')
@observer
class MediaGrid extends React.Component {

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props.MovieDbStore.items);
        const classes = this.props.classes;
        // const t = this.props.t;

        return (
            <div className={classes.root}>
                <Grid container spacing={8}>
                    { this.props.MovieDbStore.items.map((item, index) => {
                        return (
                            <Grid key={index} item xs={12} sm={6} md={4} lg={3} xl={2}>
                                <MediaCard item={item}/>
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
        paddingTop: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
    },
});

MediaGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MediaGrid);