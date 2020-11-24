import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withRouter, Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { debounce } from 'lodash';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    CircularProgress,
    Paper,
    TextField,
    Typography } from '@material-ui/core';

import Autocomplete from '@material-ui/lab/Autocomplete';

import ItemCardActions from '../card/ItemCardActions'
import ItemCardContent from '../card/ItemCardContent'

import constants from '../../config/constants';
import ImageService from '../../service/ImageService';
import MetadataService from '../../service/MetadataService';

@withNamespaces()
@inject('DownloadStatusStore')
@inject('ListSearchStore')
@observer
class ListSearchResultCard extends React.Component {

    state = {
        priority: 100,
        open: false,
    }

    setOpen(value) {
        this.setState({
            open: value
        });
    }

    componentDidMount = () => {
        const item = this.props.item.result;
        if (item) {
            this.props.DownloadStatusStore.loadStatus(item.result);
        }
    }

    handleStatusChange = (status) => {
        const item = this.props.item.result;
        if(item) {
            const previous = this.props.statusItem ? this.props.statusItem.status : '';
            this.props.DownloadStatusStore.updateStatus(item, status, previous);
        }
    }

    handleInputChange = (value) => {
        this.props.ListSearchStore.setSearchString(this.props.index, value);
        this.updateOptions();
    }

    updateOptions = debounce(() => {
        this.props.ListSearchStore.searchMovieDb(this.props.index);
    }, 500)

    handleSelect = (object, value) => {
        // console.log(object, value);
        this.props.ListSearchStore.setSelected(this.props.index, value.id);
    }

    handlePriorityHover = (priority) => {
        // console.debug(`${this.constructor.name}.handlePriorityHover()`, priority);
        this.setState({
            priority: priority,
        });
    }

    filterOptions = (options, state) => {
        // console.debug(`${this.constructor.name}.filterOptions()`, options, state);
        return options;
    }

    getOptionSelected = (option, value) => {
        // console.debug(`${this.constructor.name}.getOptionSelected()`, option, value);
        return true;
    }

    render () {
        // console.debug(`${this.constructor.name}.render()`, this.props.item);
        const classes = this.props.classes;
        const t = this.props.t;

        const mobile = isWidthDown('xs', this.props.width);


        let item = this.props.item.result;
        let image = null;
        let key = null;
        let mediaType = null;
        let id = null;
        let route = null;
        let statusItem = null;

        let title = t('common.status.notFound');

        if (item) {
            key = MetadataService.getKey(item);
            mediaType = MetadataService.getMediaType(item);
            id = item.id;
            title = MetadataService.getTitle(item);
            image = ImageService.getBackdropImage(item, constants.IMAGESIZE.BACKDROP.W500);
            route = `/browse/${mediaType}/${id}`;
    
            statusItem = this.props.DownloadStatusStore.items.get(key);
            if (!statusItem) {
                statusItem = {
                    status: constants.STATUS.REMOVED,
                    priority: 100,
                }
            }
        }

        const status = statusItem ? statusItem.status : null;

        return (
            <Card className={mobile ? classes.rootMobile : classes.root} raised={!mobile} square={mobile}>
                <CardContent>
                    <Autocomplete
                        className={classes.searchAsYouType}
                        options={this.props.item.results}
                        open={this.state.open}
                        autoComplete={true}
                        autoHighlight={true}
                        autoSelect={true}
                        inputValue={this.props.item.searchString}
                        onChange={this.handleSelect}
                        onOpen={() => {
                            this.setOpen(true);
                        }}
                        onClose={() => {
                            this.setOpen(false);
                        }}
                        getOptionSelected={this.getOptionSelected}
                        getOptionLabel={(option) => MetadataService.getTitleWithReleaseYear(option)}
                        filterOptions={this.filterOptions}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t('settings.listSearch.movieDbSearch')} 
                                variant="outlined"
                                onChange={({ target: { value } }) => this.handleInputChange(value)}
                                InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                <React.Fragment>
                                    {this.props.item.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                                ),
                            }}
                            />
                        )}
                    />
                </CardContent>
                { item ?
                <React.Fragment>
                    <CardActionArea component={Link} to={route}>
                        <CardMedia
                            className={classes.media}
                            image={image}
                            title={title}>
                            { status &&
                                <Paper className={mobile ? classes.statusMobile : classes.status}>
                                    <Typography variant='caption'>{t(`browse.card.status.${status}`)}</Typography>
                                </Paper>
                            }
                        </CardMedia>
                    </CardActionArea>
                    <CardContent className={mobile ? classes.footerMobile : classes.footer}>
                        <Typography variant="caption" display="block" color="textSecondary">{this.props.item.originalSearchString}</Typography>
                    </CardContent>
                    <ItemCardContent
                    item={item}
                    itemKey={key}
                    statusItem={statusItem}
                    mobile={mobile}
                    downloadList={false}
                    mediaType={mediaType}/>
                    {!mobile &&
                        <ItemCardActions
                            item={item}
                            itemKey={key}
                            statusItem={statusItem}
                            mobile={mobile}
                            downloadList={false}
                            mediaType={mediaType}/>
                    }
                </React.Fragment>
                :
                <CardContent className={mobile ? classes.footerMobile : classes.footer}>
                    <Typography variant="caption" display="block" color="textSecondary">{this.props.item.originalSearchString}</Typography>
                </CardContent>
                }
            </Card>
        );
     }
}

const styles = theme => ({
    root: {

    },
    rootMobile: {
        background: theme.palette.background.default,
    },
    media: {
        height: 150,
    },
    statusMobile: {
        background: theme.palette.common.black,
        opacity: 0.8,
        position: 'absolute',
        right: theme.spacing(1),
        bottom: theme.spacing(0.5),
        paddingLeft: theme.spacing(0.5),
        paddingRight: theme.spacing(0.5),
    },
    status: {
        background: theme.palette.common.black,
        opacity: 0.8,
        position: 'absolute',
        right: theme.spacing(1),
        bottom: theme.spacing(0.5),
        paddingLeft: theme.spacing(0.5),
        paddingRight: theme.spacing(0.5),
    },
    searchAsYouType: {
        width: '100%'
    },
    footer: {
        position: 'relative',
        padding: theme.spacing(1),
    },
    footerMobile: {
        position: 'relative',
        paddingTop: theme.spacing(1),
        paddingRight: theme.spacing(2),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(2),
    },
});

ListSearchResultCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(withWidth()(ListSearchResultCard)));