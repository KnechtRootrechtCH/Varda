import React from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import { Link } from 'react-router-dom'
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import {
    ExpansionPanelDetails,
    Typography } from '@material-ui/core';

@withNamespaces()
@inject('DownloadHistoryStore')
@observer
class TransactionDetails extends React.Component {

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        const data = this.props.data;

        return (
            <ExpansionPanelDetails className={classes.root}>
                <table className={classes.releaseDateTable}>
                    <tbody>
                        { this.renderRow(t('history.label.user'), data.userName)}
                        { this.renderRow(t('history.label.transaction'), t(`history.transaction.${data.transaction}`))}
                        { this.renderRow(t('history.label.previousValue'), data.previousValue ? data.previousValue : '-')}
                        { this.renderRow(t('history.label.newValue'), data.newValue ? data.newValue : '-')}
                        { this.renderRow(t('history.label.comment'), data.comment ? data.comment : '-')}
                    </tbody>
                </table>
            </ExpansionPanelDetails>
        )
    }

    renderRow (label, value, url) {
        const classes = this.props.classes;
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
                    { url ?
                        <Typography className={classes.link} variant='caption' component={Link} to={url} color='primary'>
                            {value}
                        </Typography>
                    :
                        <Typography variant='caption'>
                            {value}
                        </Typography>
                    }
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