import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import { CircularProgress, Grid } from '@material-ui/core';

import ItemCard from './card/ItemCard';

@withNamespaces()
@inject('MovieDbStore')
@observer
class ItemGrid extends React.Component {

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props.MovieDbStore.items);
        const classes = this.props.classes;
        // const t = this.props.t;

        const mobile = isWidthDown('xs', this.props.width);

        const spacing = mobile ? 0 : 8;

        return (
            <div className={mobile ? classes.rootMobile : classes.root}>
                <Grid container spacing={spacing}>
                    { this.props.MovieDbStore.items.map((item, index) => {
                        return (
                            <Grid key={index} item xs={12} sm={4} md={4} lg={3} xl={3}>
                                <ItemCard item={item}/>
                            </Grid>
                        )
                    })}
                    {this.props.MovieDbStore.hasMore &&
                        <Grid key='loading' className={classes.loadingGrid} item xs={12} sm={4} md={4} lg={3} xl={3}>
                            { this.props.MovieDbStore.loading &&
                                <CircularProgress className={mobile ? classes.loadingMobile : classes.loading} color='primary'/>
                            }
                        </Grid>
                    }
                </Grid>
            </div>
        );
     }
}

const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit,
        marginLeft: theme.spacing.unit * 3,
    },
    rootMobile: {
        marginTop: theme.spacing.unit,
        marginRight: 0,
        marginBottom: theme.spacing.unit,
        marginLeft: 0,
    },
    loadingGrid: {
        width: '100%',
        height: 48,
    },
    loading: {

    },
    loadingMobile: {
        marginTop: theme.spacing.unit,
        marginLeft: theme.spacing.unit * 2,
    },
    loadMore: {
        width: '100%',
        textAlign: 'center',
        color: theme.palette.action.active,
    }
});

ItemGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(ItemGrid));