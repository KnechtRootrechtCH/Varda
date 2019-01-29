import React from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import { Link } from 'react-router-dom'
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import * as Moment from 'moment';

import {
    ExpansionPanelDetails,
    Tooltip,
    Typography } from '@material-ui/core';

@withNamespaces()
@inject('DownloadHistoryStore')
@observer
class TransactionDetails extends React.Component {

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        const data = this.props.data;
        const timestamp = Moment(data.timestamp, 'YYYY-MM-DD HH-mm-ss-SSSS ZZ');
        const timestampString = timestamp.format('DD.MM.YYYY HH:mm');
        const timestampLong = timestamp.format('DD.MM.YYYY HH:mm ZZ');

        let transaction = t(`history.transaction.${data.transaction}`);
        transaction = data.transaction === 'updateStatus' ? `${transaction}: ${t(`history.transaction.${data.newValue}`)}` : transaction;

        return (
            <ExpansionPanelDetails className={classes.root}>
                <table className={classes.releaseDateTable}>
                    <tbody>
                        { this.renderRow(t('history.label.user'), data.userName)}
                        { this.renderRow(t('history.label.timestamp'), timestampString, timestampLong)}
                        { this.renderRow(t('history.label.transaction'), transaction)}
                        { this.renderRow(t('history.label.previousValue'), data.previousValue ? data.previousValue : '-')}
                        { this.renderRow(t('history.label.newValue'), data.newValue ? data.newValue : '-')}
                        { this.renderRow(t('history.label.comment'), data.comment ? data.comment : '-')}
                    </tbody>
                </table>
            </ExpansionPanelDetails>
        )
    }

    renderRow (label, value, tooltipText, url) {
        const classes = this.props.classes;

        tooltipText = tooltipText ? tooltipText : value;
        return (
            <tr>
                <td>
                    <Typography variant='caption' className={classes.labelCell}>
                        <span className={classes.label}>
                            {label}
                        </span>
                    </Typography>
                </td>
                <td>
                    <Tooltip title={tooltipText} aria-label={tooltipText}>
                        { url ?
                            <Typography className={classes.link} variant='caption' component={Link} to={url} color='primary'>
                                {value}
                            </Typography>
                        :
                            <Typography variant='caption'>
                                {value}
                            </Typography>
                        }
                    </Tooltip>
                </td>
            </tr>
        )
    }
}

const styles = theme => ({
    root: {

    },
    label: {
        textTransform: 'uppercase',
    },
    labelCell: {
        width: 180,
    },
});

TransactionDetails.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TransactionDetails);