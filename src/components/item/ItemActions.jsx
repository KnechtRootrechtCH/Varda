import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import {
    Button,
    Fade } from '@material-ui/core';

import { CommentText }  from 'mdi-material-ui';

@withNamespaces()
@inject('ConfigurationStore')
@inject('DownloadStatusStore')
@observer
class ItemActions extends React.Component {

    state = {

    }

    handleOpenCommentDialog = () => {
        console.debug(`${this.constructor.name}.handleOpenCommentDialog()`);
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        const mobile = this.props.mobile;
        const buttonVariant = mobile ? 'text' : 'text';

        // const item = this.props.item;
        // const statusItem = this.props.statusItem;
        // const status = statusItem && statusItem.status ? statusItem.status : constants.STATUS.REMOVED;
        // console.debug(`${this.constructor.name}.render()`, item);
        /*
        REMOVED: 'removed',
        QUEUED: 'queued',
        NOT_RELEASED: 'notReleased',
        NOT_AVAILABLE: 'notAvailable',
        NOT_FOUND: 'notFound',
        REDOWNLOAD: 'redownload',
        DOWNLOADING: 'downloading',
        DOWNLOADED: 'downloaded',
        */
        return (
            <div className={mobile ? classes.rootMobile : classes.root}>
                <Fade in={true}>
                    <Button
                        className={mobile ? classes.buttonMobile : classes.button}
                        color='primary'
                        variant={buttonVariant}>
                        <CommentText className={classes.buttonIcon}
                        onClick={this.handleOpenCommentDialog}/>
                        {t('details.actions.comment')}
                    </Button>
                </Fade>
            </div>
        );
    }
}

const styles = theme => ({
    root: {
        textAlign: 'center'
    },
    rootMobile: {
        textAlign: 'center',
    },
    header: {
        textTransform: 'uppercase',
        marginBottom: theme.spacing.unit / 2,
    },
    button: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginLeft: theme.spacing.unit,
    },
    buttonMobile: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginLeft: theme.spacing.unit,
    },
    buttonIcon: {
        marginRight: theme.spacing.unit,
        marginLeft: 0,
    },
    priorities: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
});

ItemActions.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemActions);