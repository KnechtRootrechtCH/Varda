import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import * as Moment from 'moment';

import {
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Grid,
    Typography } from '@material-ui/core';

import { ExpandMore } from '@material-ui/icons';

@withNamespaces()
class Comment extends React.Component {

    render () {
        const classes = this.props.classes;
        // const t = this.props.t;

        const mobile = this.props.mobile;
        const desktop = this.props.desktop;
        const itemComments = this.props.itemComments;

        const comment = this.props.comment;
        const key = comment.key;
        const title = comment.itemTitle;
        const timestamp = Moment(comment.timestamp.toDate());
        const timestampString = timestamp.format('DD.MM.YYYY HH:mm');
        const userName = comment.userName;
        const text = comment.text;
        const expand = true; // this.props.index === 0;

        const color = comment.isAdminComment ? 'secondary' : 'primary';

        const address = comment.key ? `/browse/${comment.key.replace(':', '/')}` : null;
        // console.debug(`${this.constructor.name}.render()`, key, title, itemComments, comment);

        return (
            <ExpansionPanel key={key} className={classes.root} defaultExpanded={expand}>
                <ExpansionPanelSummary className={classes.summary} expandIcon={<ExpandMore/>}>
                { itemComments ?
                    <Typography
                        className={mobile ? classes.titleMobile : desktop ? classes.titleDesktop : classes.title}
                        noWrap>
                        {timestampString}
                    </Typography>
                :
                    <Typography
                        className={classes.titleActive + ' ' + (mobile ? classes.titleMobile : desktop ? classes.titleDesktop : classes.title)}
                        color='primary'
                        component={Link}
                        to={address}
                        noWrap>
                        {title}
                    </Typography>
                }
                <Typography
                    className={classes.userName}
                    align='right'
                    color={color}>
                    {userName}
                </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.details}>
                    <Grid container>
                        { !itemComments &&
                            <Grid item xs={12}>
                                <Typography className={classes.timeHeader}>
                                    {timestampString}
                                </Typography>
                            </Grid>
                        }
                        <Grid item xs={12}>
                            <Typography>
                                {text}
                            </Typography>
                        </Grid>
                    </Grid>
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
    timeHeader: {
        textDecoration: 'underline',
    },
    userName: {
        marginLeft: 'auto',
        display: 'inline-block',
    },
    details: {
        paddingTop: 0,
        paddingLeft: theme.spacing.unit * 2,
    },
});

Comment.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Comment);