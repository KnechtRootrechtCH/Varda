import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import { Typography } from '@material-ui/core';

import Season from '../episodes/Season';

@withNamespaces()
class ItemEpisodeList extends React.Component {

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        const mobile = this.props.mobile;
        const desktop = this.props.desktop;
        const item = this.props.item;
        const statusItem = this.props.statusItem;

        return (
            <div className={classes.root}>
                <Typography className={classes.header} variant='body2'>{t('common.episodes')}</Typography>
                <div>
                { item.seasons.map((season, index) => {
                    return (
                        <Season key={index} itemId={item.id} season={season} index={index} statusItem={statusItem} mobile={mobile} desktop={desktop} />
                    )
                })}
                </div>
            </div>
        );
    }
}

const styles = theme => ({
    root: {
    },
    header: {
        textTransform: 'uppercase',
        marginBottom: theme.spacing(0.5),
    }
});

ItemEpisodeList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemEpisodeList);