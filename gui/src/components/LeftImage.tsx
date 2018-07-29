
import { createStyles, WithStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import * as React from 'react';

const styles = (theme: Theme) => createStyles({
    img: {
        align: "center",
        display: "block",
        height: "80%",
        margin: "0 auto",
        width: "80%",
    },
});

interface ILIeftmageProps extends WithStyles<typeof styles>, React.Props<any> {
}

function LeftImage(prop: ILIeftmageProps) {
    const classes = prop.classes;
    return (
        <div  >
            <Grid container={true} justify="center" alignItems="center">
                <Grid item={true} xs={12} sm={6} >
                    <img className={classes.img} src="logo.png" />
                </Grid>
                <Grid item={true} xs={12} sm={6} >
                    {prop.children}
                </Grid>
            </Grid>
        </div>
    );
}

export default withStyles(styles)(LeftImage);