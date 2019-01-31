import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import * as Moment from 'moment';

import {
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Tooltip,
    Typography } from '@material-ui/core';

import { ExpandMore } from '@material-ui/icons';

@withNamespaces()
class Comment extends React.Component {

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        const mobile = this.props.mobile;
        const desktop = this.props.desktop;
        const itemComments = this.props.itemComments;

        const key = this.props.key;
        const comment = this.props.comment;
        const timestamp = Moment(comment.timestamp.toDate());
        const timestampString = timestamp.format('DD.MM.YYYY HH:mm');
        const userName = comment.userName;
        const text = comment.text;
        const expand = this.props.index === 0;
        const title = comment.itemTitle;
        const transactionColor = comment.isAdminComment ? 'secondary' : 'primary';

        const address = comment.key ? `/browse/${comment.key.replace(':', '/')}` : null;


        // const item = this.props.item;
        // const statusItem = this.props.statusItem;
        // const status = statusItem && statusItem.status ? statusItem.status : constants.STATUS.REMOVED;
        // console.debug(`${this.constructor.name}.render()`, item);

        return (
            <ExpansionPanel key={key} className={classes.root} defaultExpanded={expand}>
                <ExpansionPanelSummary className={classes.summary} expandIcon={<ExpandMore/>}>
                    <Typography className={mobile ? classes.titleMobile : desktop ? classes.titleDesktop : classes.title} noWrap>
                        {timestampString}
                    </Typography>
                    <Typography className={classes.transaction} align='right' color={transactionColor}>
                        {userName}
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    { !itemComments &&
                        <Typography>add link</Typography>
                    }
                    <Typography>{text}</Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

const styles = theme => ({
    root: {

    },
    summary: {
        paddingRight: theme.spacing.unit * 2,
        paddingLeft: theme.spacing.unit * 2,
    },
    titleActive: {
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        }
    },
    titleMobile: {
        display: 'inline-block',
        maxWidth: 250,
    },
    titleDesktop: {
        display: 'inline-block',
        maxWidth: 600,
    },
    title: {
        display: 'inline-block',
        maxWidth: 350,
    },
    transaction: {
        marginLeft: 'auto',
        display: 'inline-block',
    },
});

Comment.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Comment);