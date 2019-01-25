import React from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth';
import * as Moment from 'moment';

import {
    ExpansionPanel,
    ExpansionPanelActions,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Typography } from '@material-ui/core';

@withNamespaces()
@inject('DownloadHistoryStore')
@observer
class History extends React.Component {

    state = {
        filter: [],
        sortField: 'timestamp',
        sortDirection: 'desc',
    }
    componentDidMount = () => {
        console.debug(`${this.constructor.name}.componentDidMount() => Load items`);
        this.loadItems();
    }

    loadItems () {
        this.props.DownloadHistoryStore.setFilter(this.state.filter);
        this.props.DownloadHistoryStore.setSorting(this.state.sortField, this.state.sortDirection);
        this.props.DownloadHistoryStore.loadHistory();
    }

    render () {
        console.debug(`${this.constructor.name}.render()`);
        const classes = this.props.classes;
        const mobile = isWidthDown('xs', this.props.width);

        const history = this.props.DownloadHistoryStore.history ? this.props.DownloadHistoryStore.history : [];

        return (
            <div className={classes.root}>
                <div className={mobile ? classes.contentMobile : classes.content}>
                    <div className={classes.historyContainer}>
                        { history.map(row => {
                            return this.renderPanel(row);
                        })}
                    </div>
                </div>
            </div>
        );
    }

    renderPanel(data) {
        const classes = this.props.classes;
        const t = this.props.t;

        return (
            <ExpansionPanel className={classes.panel} key={`${data.timestamp} - ${data.transaction}`}>
                <ExpansionPanelSummary>
                    <Typography className={classes.summary}>
                        {data.title}:&nbsp;{t(`history.transaction.${data.transaction}`)}
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    test, test
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )

    }
}

const styles = theme => ({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        zIndex: 1,
        maxWidth: 1280,
        marginRight: 'auto',
        marginLeft: 'auto',
        width: '100%',
        display: 'flex',
    },
    contentMobile: {
        zIndex: 1,
    },
    panel: {

    },
    summary: {

    },
});

History.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(History));