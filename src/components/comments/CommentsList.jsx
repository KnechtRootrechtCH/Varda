import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import * as Moment from 'moment';

import Comment from './Comment';

@withNamespaces()
@inject('CommentsStore')
@observer
class CommentsList extends React.Component {

    sort(a, b) {
        let aMoment = Moment(a[1].timestamp.toDate());
        let bMoment = Moment(b[1].timestamp.toDate());
        return aMoment.diff(bMoment);
    }

    render () {
        const classes = this.props.classes;
        // const t = this.props.t;

        const mobile = this.props.mobile;
        const desktop = this.props.desktop;
        const itemComments = this.props.itemComments;

        const commentsTimestamp = this.props.CommentsStore.commentsTimestamp;
        const commentsTimestampMoment = commentsTimestamp ? Moment(commentsTimestamp) : null;

        let comments = itemComments ? [...this.props.CommentsStore.itemComments].sort(this.sort) : [...this.props.CommentsStore.comments].sort(this.sort);
        if (!this.props.CommentsStore.sortAscending) {
            comments = comments.reverse();
        }

        return (
            <div className={classes.root}>
                <div>
                { comments.map(([key, value], index) => {
                    return (
                        <Comment key={key} comment={value} index={index} itemComments={itemComments} mobile={mobile} desktop={desktop} commentsTimestamp={commentsTimestampMoment}/>
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
});

CommentsList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CommentsList);