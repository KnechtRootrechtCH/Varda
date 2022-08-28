import React from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import { Link } from 'react-router-dom'
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import * as Moment from 'moment';

import {
    AccordionDetails,
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
        const timestamp = Moment(data.timestamp.toDate());
        const timestampString = timestamp.format('DD.MM.YYYY HH:mm');
        const timestampLong = timestamp.format('DD.MM.YYYY HH:mm Z');

        let transaction = t(`history.transaction.${data.transaction}`);
        transaction = data.transaction === 'updateStatus' ? `${transaction}: ${t(`history.transaction.${data.newValue}`)}` : transaction;

        return (
            <AccordionDetails className={classes.root}>
                <table className={classes.releaseDateTable}>
                    <tbody>
                        { data.subTarget ? this.renderRow(t('history.label.subTarget'), data.subTarget) : null}
                        { this.renderRow(t('history.label.user'), data.userName)}
                        { this.renderRow(t('history.label.timestamp'), timestampString, timestampLong)}
                        { this.renderRow(t('history.label.transaction'), transaction)}
                        { this.renderRow(t('history.label.previousValue'), data.previousValue ? data.previousValue : '-')}
                        { this.renderRow(t('history.label.newValue'), data.newValue ? data.newValue : '-')}
                        { this.renderRow(t('history.label.comment'), data.comment ? data.comment : '-')}
                    </tbody>
                </table>
            </AccordionDetails>
        )
    }

    renderRow (label, value, tooltipText, url) {
        const classes = this.props.classes;
        if (typeof value !== 'string') {
            value = "invalid data";
        }
        tooltipText = tooltipText ? tooltipText : value;
        return (
            <tr>
                <td className={classes.labelCell}>
                    <Typography variant='caption' className={classes.labelTypography}>
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
        paddingTop: 0,
        paddingLeft: theme.spacing(2),
    },
    label: {
        textTransform: 'uppercase',
    },
    labelTypography: {
        width: 180,
    },
    labelCell: {
        paddingLeft: 0,
    }
});

TransactionDetails.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TransactionDetails);