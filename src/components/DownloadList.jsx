import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import {
    Typography } from '@material-ui/core';

import {
    Filter,
    SortAscending,
    SortDescending } from 'mdi-material-ui';

@withNamespaces()
@inject('DownloadStatusStore')
@observer
class DownloadList extends React.Component {

    state = {
        sortAscending: true,
    }

    render () {
        console.debug(`${this.constructor.name}.render()`);
        const classes = this.props.classes;
        const t = this.props.t;
        const mobile = isWidthDown('xs', this.props.width);

        return (
            <div className={classes.root}>
                <div className={mobile ? classes.containerMobile : classes.container}>
                    <div className={mobile ? classes.headerMobile : classes.header}>
                        <Typography className={classes.title} variant='h6' component='h2'>
                            <span>{t('common.list')}</span>
                        </Typography>
                        <div className={classes.controls}>
                            <Filter className={classes.control} onClick={this.handleFilterMenuOpen}/>
                            { this.state.sortAscending ?
                                <SortAscending className={classes.control} onClick={this.handleSortMenuOpen}/>
                            :
                                <SortDescending className={classes.control} onClick={this.handleSortMenuOpen}/>
                            }
                        </div>
                    </div>
                    <div className={mobile ? classes.listMobile : classes.list}>

                    </div>
                </div>
            </div>
        );
     }
}

const styles = theme => ({
    root: {
        padding: 0,
        maxWidth: 1280,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    container: {
        marginRight: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit,
        marginLeft: theme.spacing.unit * 3,
    },
    containerMobile: {
        marginRight: 0,
        marginBottom: theme.spacing.unit,
        marginLeft: 0,
    },
    header: {
        paddingTop: theme.spacing.unit * 2,
        marginRight: 0,
        marginBottom: theme.spacing.unit,
        marginLeft: 0,
    },
    headerMobile: {
        paddingTop: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 2,
    },
    title: {
        display: 'inline-block',
    },
    controls: {
        float: 'right',
        paddingTop: theme.spacing.unit / 2,
    },
    control: {
        cursor: 'pointer',
        color: theme.palette.action.active,
        marginLeft: theme.spacing.unit,
        marginRight: 0,
        '&:hover': {
            color: theme.palette.primary.main,
        }
    }
});

DownloadList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(DownloadList));