
import { createStyles, WithStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom'
import AKAppBar from './AKAppBar';
import TransactionSub from './TransactionSub';

const styles = (theme: Theme) => createStyles({
    avatar: {
        height: 35,
        width: 35,
    },
    button: {
        marginLeft: "30%",
        marginTop: "5%",
    },
    center: {
        margin: "0 auto",
        width: 300,
    },
    confirmed: {
        color: "lightgreen",
    },
    img: {
        textAlign: "center",
        width: "80%",
    },
    list: {
    },
    litext: {
        overflow: "hidden",
    },
    logo: {
        align: "center",
        display: "block",
        height: "80%",
        margin: "0 auto",
        width: "80%",
    },
    pending: {
        color: "white",
    },
    pwd: {
        width: "80%",
    },
    rejected: {
        color: "red",
    },
    root: {
        backgroundColor: theme.palette.background.paper,
        margin: "0 auto",
        maxHeight: 360,
        overflow: 'auto',
        width: '100%',
    },
    search: {
        margin: "0 auto",
        width: 260,
    },
    txid: {
        width: "100%",
    },

});

interface ITxProps extends WithStyles<typeof styles>, RouteComponentProps<any> {
    logined: boolean,
}
interface ITxState {
    span: string,
}



class Transaction extends React.Component<ITxProps, ITxState> {
    public render() {
        const classes = this.props.classes;
        return (
            <Slide direction="right" in={true} mountOnEnter={true} unmountOnExit={true}>
                <div  >
                    <AKAppBar logined={this.props.logined} appname="Transaction" history={this.props.history} />
                    <Grid container={true} justify="center" alignItems="center">
                        <Grid item={true} xs={12} sm={6} >
                            <img className={classes.logo} src="logo.png" />
                        </Grid>
                        <TransactionSub {...this.props} />
                    </Grid>
                </div >
            </Slide>
        );
    }
}

export default withStyles(styles)(Transaction);