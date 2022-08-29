import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import * as Moment from 'moment';

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Fade,
    Grid,
    Typography } from '@material-ui/core';

import { ExpandMore } from '@material-ui/icons';
import { BellRing, BellOutline } from 'mdi-material-ui';

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
        const isNew = comment.external && (!this.props.commentsTimestamp || timestamp.isAfter(this.props.commentsTimestamp));
        const userName = comment.userName;
        const text = comment.text;
        // const expand = isNew || this.props.index === 0;

        const color = comment.isAdminComment ? 'secondary' : 'primary';

        const address = comment.key ? `/browse/${comment.key.replace(':', '/')}` : null;
        // console.debug(`${this.constructor.name}.render()`, key, title, itemComments, comment);
        // console.debug(`${this.constructor.name}.render()`, timestamp, this.props.commentsTimestamp, isNew);

        return (
            <Accordion key={key} className={classes.root} defaultExpanded={true}>
                <AccordionSummary className={classes.summary} expandIcon={<ExpandMore/>}>
                    <Typography
                        className={mobile ? classes.titleMobile : desktop ? classes.titleDesktop : classes.title}
                        noWrap>
                        <Fade in={isNew} timeout={{enter: 100, exit: 2000}} mountOnEnter={true} unmountOnExit={true}>
                            <BellRing color={color} className={classes.newCommentBadge}/>
                            </Fade>
                        <Fade in={!isNew} timeout={{enter: 100, exit: 2000}} mountOnEnter={true} unmountOnExit={true}>
                            <BellOutline color='disabled' className={classes.newCommentBadge}/>
                        </Fade>
                        {timestampString}
                    </Typography>
                    <Typography
                        className={classes.userName}
                        align='right'
                        color={color}>
                        {userName}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.details}>
                    <Grid container>
                        { !itemComments && title &&
                            <Grid item xs={12}>
                                <Typography
                                    className={classes.titleActive + ' ' + (mobile ? classes.titleMobile : desktop ? classes.titleDesktop : classes.title)}
                                    color='inherit'
                                    component={Link}
                                    to={address}
                                    noWrap>
                                    {title}
                                </Typography>
                            </Grid>
                        }
                        <Grid item xs={12}>
                            <Typography color='textSecondary'>
                                {text}
                            </Typography>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        );
    }
}

const styles = theme => ({
    root: {

    },
    summary: {
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
    },
    titleActive: {
        textDecoration: 'underline',
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

    },
    userName: {
        marginLeft: 'auto',
        display: 'inline-block',
    },
    details: {
        paddingTop: 0,
        paddingLeft: theme.spacing(2),
    },
    newCommentBadge: {
        verticalAlign: 'middle',
        marginBottom: 3,
        marginLeft: 0,
        marginRight: theme.spacing(1),
        fontSize: 18,
    },
});

Comment.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Comment);