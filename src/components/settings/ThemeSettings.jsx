import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';

import {
    FormControlLabel,
    Grid,
    Switch,
    Typography } from '@material-ui/core';

@withNamespaces()
@inject('ThemeStore')
@observer
class ThemeSettings extends React.Component {

    handleColorSelection = (type, color) => {
        if (type === 'primary') {
            this.props.ThemeStore.setPrimary(color);
        } else if (type === 'secondary') {
            this.props.ThemeStore.setSecondary(color);
        } else {
            console.warn(`${this.constructor.name}.handleColorSelection() : Unknown type! =>`, type);
            return;
        }
    }

    handleDarkThemeToggle = () => {
        const current = this.props.ThemeStore.type;
        let type = 'dark';
        if (current === 'dark') {
            type = 'light';
        }
        this.props.ThemeStore.setType(type);
    }

    render () {
        const classes = this.props.classes;
        const t = this.props.t;

        const darkTheme = this.props.ThemeStore.type === 'dark';

        // handle realy narrow devices
        const paletteGridSize = window.innerWidth > 350 ? 6 : 12;

        return (
            <Grid container className={classes.root} spacing={8}>
                <Grid item xs={12}>
                    <Typography className={classes.title} variant='subtitle1' component='h2'>
                        <span>{t('settings.themeSettings')}</span>
                    </Typography>
                </Grid>
                <Grid item xs={paletteGridSize}>
                    {this.renderColorGrid('primary')}
                </Grid>
                <Grid item xs={paletteGridSize}>
                    {this.renderColorGrid('secondary')}
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        className={classes.switch}
                        labelPlacement='start'
                        control={
                            <Switch
                            checked={darkTheme}
                            onChange={this.handleDarkThemeToggle}
                            color='primary'/>
                        }
                        label={
                            <Typography variant='subtitle2' component='h3'>{t('settings.darkTheme')}</Typography>
                        }/>
                </Grid>
            </Grid>
        );
     }

     renderColorGrid(type) {
        const { classes } = this.props;
        const t = this.props.t;
        let colors = this.props.ThemeStore.colors;

        if(!colors || colors.length === 0) {
            return (<div></div>);
        }

        return (
            <div className={classes.palette}>
                <Typography className={classes.header} variant='subtitle2' component='h3'>{t(`settings.${type}Color`)}</Typography>
                <Grid container>
                    {colors.map((color, index) => {
                    return this.renderColorItem(type, color, index)
                    })}
                </Grid>
            </div>
        );
    }

    renderColorItem (type, color, index) {
        const { classes } = this.props;

        const style = {
            background: color['500'],
        };

        const current = type === 'primary' ?
            this.props.ThemeStore.primary :
            this.props.ThemeStore.secondary;
        const selected = current['500'] === color['500'];
        const key = type + index;

        return (
            <Grid
                key={key}
                className={ classes.paletteItem + (selected ? ' selected' : '')}
                onClick={(e) => this.handleColorSelection(type, color)}
                item
                xs={3}
                style={style}>
            </Grid>
        )
    }
}

const styles = theme => ({
    root: {
        maxWidth: 350,
        marginTop: theme.spacing.unit,
    },
    title: {
        margin: 0,
    },
    paletteColumn: {

    },
    palette: {
        width: 140,
        maxWidth: 140,
    },
    paletteItem: {
        cursor: 'pointer',
        width: 38,
        height: 38,
        maxWidth: 38,
        maxHeight: 38,
        '&.selected': {
            border: '2px solid',
            borderColor: theme.palette.text.primary,
        },
    },
    switch: {
        margin: 0,
    }
});

ThemeSettings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withWidth()(ThemeSettings));