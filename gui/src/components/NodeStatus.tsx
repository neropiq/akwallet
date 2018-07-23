
import { createStyles, WithStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom'
import AKAppBar from './AKAppBar';

const styles = (theme: Theme) => createStyles({
    button: {
        marginLeft: "30%",
        marginTop: "5%",
    },
    cont: {
        fontSize: "10pt",
    },
    img: {
        textAlign: "center",
        width: "80%",
    },
    item: {
        fontSize: "14pt",
        fontWeight: "bold",
    },
    root: {
        margin: "0 auto",
        marginTop: theme.spacing.unit * 3,
        [theme.breakpoints.up('sm')]: {
            width: "70%",
        },
    },
});

interface IStatusProps extends WithStyles<typeof styles>, RouteComponentProps<any> {
    logined: boolean,
}

interface IStatusState {
    dummy: string,
}

class NodeStatus extends React.Component<IStatusProps, IStatusState> {
    public render() {
        const classes = this.props.classes;
        return (
            <Slide direction="right" in={true} mountOnEnter={true} unmountOnExit={true}>
                <div  >
                    <AKAppBar logined={this.props.logined} appname="Node Status" history={this.props.history} />
                    <Typography variant="headline" color="default" align="center" >
                        Server1 : Working
                    </Typography>
                    <Paper className={classes.root} >
                        <Table >
                            <TableBody >
                                <TableRow >
                                    <TableCell className={classes.item} component="th" scope="row">
                                        Total Supply
                                    </TableCell>
                                    <TableCell   >25,000,000 ADK</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.item} component="th" scope="row">
                                        Net
                                    </TableCell>
                                    <TableCell  >Main Net</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.item} component="th" scope="row">
                                        Application Version
                                    </TableCell>
                                    <TableCell   >AKnode 1.0.0</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.item} component="th" scope="row">
                                        Number of Peers
                                    </TableCell>
                                    <TableCell >15</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.item} component="th" scope="row">
                                        Time
                                    </TableCell>
                                    <TableCell  >2018-07-19 10:23:21 UTC</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.item} component="th" scope="row">
                                        Number of Transactions
                                    </TableCell>
                                    <TableCell   >1500000</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.item} component="th" scope="row">
                                        Number of Leaves
                                    </TableCell>
                                    <TableCell  > 5</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Paper>
                </div>
            </Slide>
        );
    }
}

export default withStyles(styles)(NodeStatus);