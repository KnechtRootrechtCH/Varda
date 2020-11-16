import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth';

import {
    Button,
    Grow,
    TextField,
    Typography } from '@material-ui/core';

import {
    CloseCircle,
    CommentPlusOutline,
    CommentText,
    SortAscending,
    SortDescending } from 'mdi-material-ui';

import CommentsList from './comments/CommentsList'

@withNamespaces()
@inject('AuthenticationStore')
@inject('ConfigurationStore')
@inject('CommentsStore')
@observer
class Messages extends React.Component {

    state = {
        showCommentInput: false,
        inputText: '',
        inputRef: null,
    }

    componentDidMount = () => {
        // console.debug(`${this.constructor.name}.componentDidMount() => Load items`);
        this.props.CommentsStore.setSorting('timestamp', false);
        this.props.CommentsStore.resetComments();
        this.props.CommentsStore.loadComments();

        let timeout = this.props.ConfigurationStore.configuration.commentsAutoMarkAsReadSeconds;
        if (timeout && timeout > 0) {
            setTimeout(() => {
                this.props.CommentsStore.updateTimestamp();
            }, timeout * 1000);
        }

        window.addEventListener('scroll', this.handleScroll);
    }

    UNSAFE_componentWillUnmount = () => {
        // console.debug(`${this.constructor.name}.componentWillUnmount()`);
        window.removeEventListener('scroll', this.handleScroll)
        this.props.CommentsStore.updateTimestamp();
    }

    toggleSortDirection = () => {
        const sortAscending = !this.props.CommentsStore.sortAscending;
        this.props.CommentsStore.resetComments();
        this.props.CommentsStore.setSorting('timestamp', sortAscending);
        this.props.CommentsStore.loadComments();
    }

    handleCommentSubmit = () => {
        console.debug(`${this.constructor.name}.handleCommentSubmit()`);
        this.props.CommentsStore.addComment('null', this.state.inputText, '');
        this.setState({
            inputText: '',
            showCommentInput: false,
        });
    }

    handleInputChange = (value) => {
        this.setState({
            inputText: value,
        });
    }

    handleFilterMenuOpen = event => {
        this.setState({ filterMenuAnchor: event.currentTarget });
    };

    setInputRef = ref => {
        this.setState({
            inputRef: ref,
        });
        if(ref) {
            ref.focus();
        }
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

    handleScroll = debounce(() => {
        if (this.props.CommentsStore.loading) {
            return;
        }

        const d = document.documentElement
        const offset = d.scrollTop + window.innerHeight
        const height = d.offsetHeight

        if (offset >= height - 100) {
            // console.debug(`${this.constructor.name}.handleScroll() : load next page!`);
            this.props.CommentsStore.loadComments();
        }
    }, 100)

    render () {
        // console.debug(`${this.constructor.name}.render()`);
        const classes = this.props.classes;
        const t = this.props.t;
        const mobile = isWidthDown('xs', this.props.width);
        const desktop = isWidthUp('md', this.props.width);
        const allowCommentsSorting = this.props.ConfigurationStore.configuration.allowCommentsSorting;

        return (
            <div className={classes.root}>
                <div className={mobile ? classes.containerMobile : classes.container}>
                    <div className={mobile ? classes.headerMobile : classes.header}>
                        <Typography className={classes.title} variant='h6' component='h2'>
                            <span>{t('common.messages')}</span>
                        </Typography>
                        <div className={classes.controls}>
                            { !this.state.showCommentInput &&
                                <CommentPlusOutline className={classes.control} onClick={this.handleOpenCommentDialog}/>
                            }
                            { allowCommentsSorting && this.props.CommentsStore.sortAscending ?
                                <SortAscending className={classes.control} onClick={this.toggleSortDirection}/>
                            : allowCommentsSorting &&
                                <SortDescending className={classes.control} onClick={this.toggleSortDirection}/>
                            }
                        </div>
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
                                    variant='text'
                                    onClick={() => this.handleCloseCommentDialog()}>
                                    <CloseCircle className={classes.buttonIcon}/>
                                    {t('details.actions.cancel')}
                                </Button>
                                <Button
                                    className={classes.submit}
                                    disabled={!this.state.inputText}
                                    color='primary'
                                    variant='text'
                                    onClick={() => this.handleCommentSubmit()}>
                                    <CommentText className={classes.buttonIcon}/>
                                    {t('details.actions.submit')}
                                </Button>
                            </div>
                        </Grow>
                    </div>
                    <div className={mobile ? classes.listMobile : classes.list}>
                        <CommentsList desktop={desktop} mobile={mobile}/>
                    </div>
                </div>
            </div>
        );
    }
}

const styles = theme => ({
    root: {
        padding: 0,
        maxWidth: 1280,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    container: {
        marginRight: theme.spacing(3),
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(3),
    },
    containerMobile: {
        marginRight: 0,
        marginBottom: theme.spacing(1),
        marginLeft: 0,
    },
    header: {
        paddingTop: theme.spacing(2),
        marginRight: 0,
        marginBottom: theme.spacing(1),
        marginLeft: 0,
    },
    headerMobile: {
        paddingTop: theme.spacing(2),
        paddingRight: theme.spacing(2),
        marginBottom: theme.spacing(1),
        paddingLeft: theme.spacing(2),
    },
    title: {
        display: 'inline-block',
        color: theme.palette.text.primary,
    },
    controls: {
        float: 'right',
        paddingTop: theme.spacing(0.5),
    },
    control: {
        cursor: 'pointer',
        color: theme.palette.action.active,
        marginLeft: theme.spacing(1),
        marginRight: 0,
        '&:hover': {
            color: theme.palette.primary.main,
        }
    },
    inputContainer: {
        marginTop: theme.spacing(2),
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
});

Messages.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(Messages));