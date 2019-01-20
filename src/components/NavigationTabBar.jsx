import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import { withNamespaces } from 'react-i18next';

import {
    Tab,
    Tabs,
    Typography } from '@material-ui/core';

import {
    Explore,
    Movie,
    Tv,
    ViewList } from '@material-ui/icons';

@withNamespaces()
@inject('AuthenticationStore')
@inject('MovieDbStore')
@inject('ThemeStore')
@observer
class Navigation extends React.Component {

    handleChange = () => {

    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;
        const location = this.props.location.pathname.toLowerCase();

        let loc = 'browse';
        if (!this.props.AuthenticationStore.authenticated) {
            loc = false;
        } else if (location.includes('browse/movie')) {
            loc = 'movies';
        } else if (location.includes('browse/tv')) {
            loc = 'tv';
        } else if (location.includes('list')) {
            loc = 'list';
        }

        return (
            <Tabs
                value={loc}
                classes={{ indicator: classes.indicator }}
                centered
                variant='fullWidth'
                indicatorColor='primary'
                textColor='inherit'>
                <Tab
                    key='browse'
                    value='browse'
                    component={Link}
                    to='/browse'
                    icon={<Explore className={classes.icon}/>}
                    label={
                        <Typography className={classes.label} variant='body2' component='p'>
                            {t('common.discover')}
                        </Typography>
                    }/>
                <Tab
                    key='movies'
                    value='movies'
                    component={Link}
                    to='/browse/movie'
                    icon={<Movie className={classes.icon}/>}
                    label={
                        <Typography className={classes.label} variant='body2' component='p'>
                            {t('common.movies')}
                        </Typography>
                    }/>
                <Tab
                    key='tv'
                    value='tv'
                    component={Link}
                    to='/browse/tv'
                    icon={<Tv className={classes.icon}/>}
                    label={
                        <Typography className={classes.label} variant='body2' component='h3'>
                            {t('common.seriesPlural')}
                        </Typography>
                    }/>
                <Tab
                    key='list'
                    value='list'
                    component={Link}
                    to='/list'
                    icon={<ViewList className={classes.icon}/>}
                    label={
                        <Typography className={classes.label} variant='body2' component='p'>
                            {t('common.listShort')}
                        </Typography>
                    }/>
            </Tabs>
        );
     }
}

const styles = theme => ({
    root: {

    },
    icon: {

    },
    label: {
        textTransform: 'capitalize',
    },
    indicator: {
        display: 'none'
    },
});

Navigation.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(Navigation));