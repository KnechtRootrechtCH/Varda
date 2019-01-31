import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import * as Moment from 'moment';

import {
    ListItem,
    ListItemText } from '@material-ui/core';

@withNamespaces()
class Comment extends React.Component {

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        // const mobile = this.props.mobile;
        // const desktop = this.props.desktop;

        const key = this.props.key;
        const comment = this.props.comment;
        const timestamp = Moment(comment.timestamp.toDate());
        const timestampString = timestamp.format('DD.MM.YYYY HH:mm');
        const userName = comment.userName;
        const text = comment.text;
        const primaryText = `${userName} - ${timestampString}`;

        // const item = this.props.item;
        // const statusItem = this.props.statusItem;
        // const status = statusItem && statusItem.status ? statusItem.status : constants.STATUS.REMOVED;
        // console.debug(`${this.constructor.name}.render()`, item);

        return (
            <ListItem key={key}>
                <ListItemText
                    primary={primaryText}
                    secondary={text}
                />
            </ListItem>
        );
    }
}

const styles = theme => ({
    root: {

    },
});

Comment.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Comment);