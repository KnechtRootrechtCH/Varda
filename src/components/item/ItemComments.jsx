import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import {
    Button,
    Grow,
    TextField,
    Typography } from '@material-ui/core';

import {
    CommentText,
    CloseCircle }  from 'mdi-material-ui';

import CommentsList from '../comments/CommentsList';
import MetadataService from '../../service/MetadataService';

@withNamespaces()
@inject('CommentsStore')
@inject('ConfigurationStore')
@inject('DownloadStatusStore')
@observer
class ItemComments extends React.Component {

    state = {
        showCommentInput: false,
        inputText: '',
    }

    handleInputChange = (value) => {
        this.setState({
            inputText: value,
        });
    }

    handleOpenCommentDialog = () => {
        console.debug(`${this.constructor.name}.handleOpenCommentDialog()`);
        this.setState({
            showCommentInput: true,
        });
    }

    handleCloseCommentDialog = () => {
        console.debug(`${this.constructor.name}.handleCloseCommentDialog()`);
        this.setState({
            inputText: '',
            showCommentInput: false,
        });
    }

    handleCommentSubmit = () => {
        console.debug(`${this.constructor.name}.handleCommentSubmit()`);
        const itemTitle = MetadataService.getTitle(this.props.item);
        this.props.CommentsStore.addComment(this.props.item, this.state.inputText, itemTitle);
        this.setState({
            inputText: '',
            showCommentInput: false,
        });
    }

    setInputRef = ref => {
        if(ref && this.state.showCommentInput) {
            ref.focus();
        }
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        const mobile = this.props.mobile;
        const desktop = this.props.desktop;
        const buttonVariant = mobile ? 'text' : 'text';

        const hasComments = this.props.CommentsStore.itemComments.size > 0;

        // const item = this.props.item;
        // const statusItem = this.props.statusItem;
        // const status = statusItem && statusItem.status ? statusItem.status : constants.STATUS.REMOVED;
        // console.debug(`${this.constructor.name}.render()`, item);

        return (
            <div className={classes.root}>
                <Grow in={!this.state.showCommentInput}>
                    <div className={classes.buttonContainer}>
                        <Button
                            className={classes.button}
                            color='primary'
                            variant={buttonVariant}
                            onClick={() => this.handleOpenCommentDialog()}>
                            <CommentText className={classes.buttonIcon}/>
                            {t('details.actions.addComment')}
                        </Button>
                    </div>
                </Grow>
                <Grow in={this.state.showCommentInput} mountOnEnter={true} unmountOnExit={true}>
                    <div className={classes.inputContainer}>
                        <TextField
                            className={classes.input}
                            value={this.state.inputText}
                            label={t('common.comment')}
                            placeholder='…'
                            fullWidth
                            multiline
                            margin='normal'
                            variant='outlined'
                            inputRef={(input) => { this.setInputRef(input) }}
                            onChange={({ target: { value } }) => this.handleInputChange(value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            />
                        <Button
                            className={classes.submit}
                            color='primary'
                            variant={buttonVariant}
                            onClick={() => this.handleCloseCommentDialog()}>
                            <CloseCircle className={classes.buttonIcon}/>
                            {t('details.actions.cancel')}
                        </Button>
                        <Button
                            className={classes.submit}
                            disabled={!this.state.inputText}
                            color='primary'
                            variant={buttonVariant}
                            onClick={() => this.handleCommentSubmit()}>
                            <CommentText className={classes.buttonIcon}/>
                            {t('details.actions.submit')}
                        </Button>
                    </div>
                </Grow>
                <Grow in={hasComments} mountOnEnter={true} unmountOnExit={true}>
                    <div className={classes.commentsList}>
                        <Typography className={classes.header} variant='body2'>{t('details.comments')}</Typography>
                        <CommentsList itemComments={true} mobile={mobile} desktop={desktop}/>
                    </div>
                </Grow>
            </div>
        );
    }
}

const styles = theme => ({
    root: {

    },
    buttonContainer: {
        textAlign: 'center',
    },
    button: {
        marginRight: theme.spacing(1),
        marginLeft: theme.spacing(1),
    },
    inputContainer: {
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        textAlign: 'right',
    },
    input: {
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
    },
    submit: {
        marginLeft: theme.spacing(2),
    },
    buttonIcon: {
        marginRight: theme.spacing(1),
        marginLeft: 0,
    },
    header: {
        textTransform: 'uppercase',
        marginBottom: theme.spacing(0.5),
    },
    commentsList: {
        marginBottom: theme.spacing(2),
    }
});

ItemComments.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemComments);