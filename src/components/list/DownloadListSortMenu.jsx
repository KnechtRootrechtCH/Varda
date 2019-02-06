import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import {
    Divider,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem } from '@material-ui/core';

import {
    CheckboxBlankCircleOutline,
    CheckboxMarkedCircle,
    SortAscending,
    SortDescending } from 'mdi-material-ui';

@withNamespaces()
@inject('DownloadStatusStore')
@observer
class DownloadListSortMenu extends React.Component {

    state = {
        anchor: null,
    }

    handleMenuOpen = event => {
        this.setState({ anchor: event.currentTarget });
    };

    handleMenuClose = () => {
        this.setState({ anchor: null });
        if (this.props.DownloadStatusStore.listParametersChanged) {
            const ascending = this.props.DownloadStatusStore.sortAscending;
            const field = this.props.DownloadStatusStore.sortField;
            localStorage.setItem('varda.list.sortAscending', JSON.stringify(ascending));
            localStorage.setItem('varda.list.sortField', JSON.stringify(field));
            this.props.onUpdateList();
        }
    }

    handleDirectionChange = () => {
        const current = this.props.DownloadStatusStore.sortAscending;
        this.props.DownloadStatusStore.setSortDirection(!current);
        this.handleMenuClose();
    }

    handleFieldChange = (field) => {
        this.props.DownloadStatusStore.setSortField(field);
        this.handleMenuClose();
    }

    render () {
        // sconsole.debug(`${this.constructor.name}.render()`);
        const classes = this.props.classes;
        const t = this.props.t;

        const anchor = this.state.anchor;
        const ascending = this.props.DownloadStatusStore.sortAscending;
        const sortField = this.props.DownloadStatusStore.sortField;
        const fields = ['title', 'release', 'priority', 'timestamp'];

        return (
            <React.Fragment>
                { this.props.DownloadStatusStore.sortAscending ?
                    <SortAscending className={classes.control} onClick={this.handleMenuOpen}/>
                :
                    <SortDescending className={classes.control} onClick={this.handleMenuOpen}/>
                }
                <Menu
                    id='sortMenu'
                    anchorEl={anchor}
                    open={Boolean(anchor)}
                    onClose={this.handleMenuClose}>
                    <MenuItem onClick={() => this.handleDirectionChange()}>
                        <ListItemIcon>
                            { ascending ?
                                <SortAscending/>
                            :
                                <SortDescending/>
                            }
                        </ListItemIcon>
                        <ListItemText>
                            { ascending ?
                                <span>{t('list.sort.ascending')}</span>
                            :
                                <span>{t('list.sort.descending')}</span>
                            }
                        </ListItemText>
                    </MenuItem>
                    <Divider/>
                    { fields.map((field) => {
                        return (
                            <MenuItem key={field} onClick={() => this.handleFieldChange(field)}>
                                <ListItemIcon>
                                    { sortField === field ?
                                        <CheckboxMarkedCircle/>
                                    :
                                        <CheckboxBlankCircleOutline/>
                                    }
                                </ListItemIcon>
                                <ListItemText>
                                    {t(`list.sort.${field}`)}
                                </ListItemText>
                            </MenuItem>
                        )
                    })}
                </Menu>
            </React.Fragment>
        );
     }
}

const styles = theme => ({
    root: {

    },
    control: {
        cursor: 'pointer',
        color: theme.palette.action.active,
        marginLeft: theme.spacing.unit,
        marginRight: 0,
        '&:hover': {
            color: theme.palette.primary.main,
        }
    },
});

DownloadListSortMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DownloadListSortMenu);