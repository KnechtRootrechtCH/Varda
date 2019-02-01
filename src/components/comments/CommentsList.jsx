import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import Comment from './Comment';

@withNamespaces()
@inject('CommentsStore')
@observer
class CommentsList extends React.Component {

    render () {
        const classes = this.props.classes;
        // const t = this.props.t;

        const mobile = this.props.mobile;
        const desktop = this.props.desktop;
        const itemComments = this.props.itemComments;

        let comments = [...this.props.CommentsStore.comments].sort();
        if (!this.props.CommentsStore.sortAscending) {
            comments = comments.reverse();
        }

        return (
            <div className={classes.root}>
                <div>
                { comments.map(([key, value], index) => {
                    return (
                        <Comment key={key} comment={value} index={index} itemComments={itemComments} mobile={mobile} desktop={desktop}/>
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