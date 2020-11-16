import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth';

import { Fade, CircularProgress, Grid } from '@material-ui/core';

import ItemCard from '../card/ItemCard';

@withNamespaces()
@inject('DownloadStatusStore')
@inject('ThemeStore')
@observer
class DownloadItemGrid extends React.Component {

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props.DownloadStatusStore.listSorted);
        const classes = this.props.classes;
        // const t = this.props.t;

        const mobile = isWidthDown('xs', this.props.width);
        const desktop = isWidthUp('md', this.props.width);

        const spacing = mobile ? 0 : 8;
        const list = this.props.DownloadStatusStore.listSorted;

        return (
            <div className={classes.root}>
                <Grid container spacing={spacing}>
                    {list.map((item, index) => {
                        return (
                            <Grid key={index} item xs={12} sm={4} md={4} lg={3} xl={3}>
                                <ItemCard itemKey={item[0]} item={item[1]} downloadList={true}/>
                            </Grid>
                        )
                    })}
                    { this.props.DownloadStatusStore.lastItem &&
                        <Grid key='loading' className={mobile ? classes.progressGridMobile : classes.progressGrid} item xs={12} sm={4} md={4} lg={3} xl={3}>
                            { this.props.DownloadStatusStore.loading &&
                                <CircularProgress color='secondary'/>
                            }
                        </Grid>
                    }
                    <Fade in={this.props.DownloadStatusStore.loading} mountOnEnter={true} unmountOnExit={true}>
                        <div className={classes.progressContainer}>
                            <div className={desktop && this.props.ThemeStore.drawerState ? classes.progressShift : classes.progress}>
                                <CircularProgress color='secondary'/>
                            </div>
                        </div>
                    </Fade>
                </Grid>
            </div>
        );
     }
}

const drawerWidth = 220;

const styles = theme => ({
    root: {

    },
    progressGrid: {
        width: '100%',
        height: 48,
    },
    progressGridMobile: {
        width: '100%',
        height: 48,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: theme.spacing(1),
    },
    progressContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressContainerShifted: {
        position: 'absolute',
        top: 0,
        left: 0,
        paddingLeft: drawerWidth,
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressShift: {
        paddingLeft: drawerWidth,
        transition: theme.transitions.create('padding', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    progress: {
        transition: theme.transitions.create('padding', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
});

DownloadItemGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(DownloadItemGrid));