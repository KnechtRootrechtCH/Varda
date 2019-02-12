import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';

import {
    Button,
    Typography } from '@material-ui/core';

@withNamespaces()
@inject('CloudFunctionsStore')
@observer
class CloudFunctionsSettings extends React.Component {

    handleUpdateItemCounts = () => {
        // console.debug(`${this.constructor.name}.handleUpdateItemCounts()`);
        this.props.CloudFunctionsStore.executeUpdateItemCountsFunction();
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        return (
            <div className={classes.root}>
                <Typography className={classes.title} variant='subtitle1' component='h2'>
                    <span>{t('settings.cloudFunctions')}</span>
                </Typography>
                <div className={classes.actions}>
                    <Button color='primary' className={classes.button} variant='text' onClick={() => this.handleUpdateItemCounts()}>
                        {t('settings.executeItemCountUpdate')}
                    </Button>
                </div>
            </div>
        );
     }
}

const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
});

CloudFunctionsSettings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(CloudFunctionsSettings));