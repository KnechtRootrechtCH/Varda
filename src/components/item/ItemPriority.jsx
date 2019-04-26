import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import { Star }  from 'mdi-material-ui';

@withNamespaces()
@inject('ConfigurationStore')
@inject('DownloadStatusStore')
@observer
class ItemPriority extends React.Component {

    state = {
        priority: 100,
    }

    handlePriorityChange = (priority) => {
        console.debug(`${this.constructor.name}.handlePriorityChange()`, priority);
        const item = this.props.item;
        const priorityCount = this.props.ConfigurationStore.configuration.priorityCount;
        const previous = this.props.statusItem ? this.props.statusItem.priority : 0;
        priority = priority === priorityCount && priority === previous ? priority + 1 : priority;
        this.props.DownloadStatusStore.updatePriority(item, priority, previous);
    }

    handlePriorityHover = (priority) => {
        // console.debug(`${this.constructor.name}.handlePriorityHover()`, priority);
        this.setState({
            priority: priority,
        });
    }

    render () {
        const classes = this.props.classes;
        const statusItem = this.props.statusItem;
        const mobile = this.props.mobile;
        const priority = this.state.priority < 100 ? this.state.priority : statusItem ? statusItem.priority : 100;
        const priorityCount = this.props.ConfigurationStore.configuration.priorityCount;

        let priorities = [];
        for (let i = priorityCount; i > 0; i--) {
            priorities.push(i);
        }
        return (
            <div className={mobile ? classes.rootMobile : classes.root}>
                { priorities.map((p) => {
                    return (
                        <Star
                            key={p}
                            className={priority <= p ? classes.priorityIconActive : classes.priorityIcon}
                            onMouseOut={() => this.handlePriorityHover(100)}
                            onMouseOver={() => this.handlePriorityHover(p)}
                            onClick={() => this.handlePriorityChange(p)}/>
                    )
                })}
            </div>
        );
    }
}

const styles = theme => ({
    root: {
        float: 'right',
    },
    rootMobile: {
        paddingTop: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
        marginLeft: -3,
        display: 'inline',
    },
    priority: {
        marginLeft: -3,
    },
    priorityIcon: {
        color: theme.palette.action.hover,
        cursor: 'pointer',
        transition: theme.transitions.create('color', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    priorityIconActive: {
        color: theme.palette.action.active,
        cursor: 'pointer',
        transition: theme.transitions.create('color', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
});

ItemPriority.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemPriority);