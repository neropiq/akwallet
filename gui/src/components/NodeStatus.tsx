
// Copyright (c) 2018 Aidos Developer

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import { createStyles, WithStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
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
import IDefaultProp from '../defaultProp';
import AKAppBar from './AKAppBar';

const styles = (theme: Theme) => createStyles({
    button: {
        display: "block",
        margin: "0 auto",
    },
    formControl: {
        display: "block",
        margin: "10pt auto",
        width: 260,

    },
    item: {
        fontWeight: "bold",
    },
    root: {
        margin: "0 auto",
        marginTop: theme.spacing.unit * 3,
        width: "80%",
    },
    select: {
        color: "white",
    },
    title: {
        margin: "15pt auto",
    },
});

interface IStatusProps extends WithStyles<typeof styles>, IDefaultProp {
}

interface IStatusState {
    anchorEl: any,
    server: string,
}

class NodeStatus extends React.Component<IStatusProps, IStatusState> {
    private status = {
        "Net": "MainNet",
        "Node Version": "AKnode 1.0.0",
        "Number of Leaves": "1324",
        "Number of Peers": "12345",
        "Total Supply": "25,000,000 ADK",
    }

    public constructor(prop: IStatusProps) {
        super(prop)
        this.state = {
            anchorEl: null,
            server: "Server2",
        }
    }

    public handleClose = (event: any) => {
        this.setState({
            anchorEl: null,
        }
        );
    };

    public handleChange = (event: any) => {
        this.setState({
            server: event.target.value,
        }
        );
    };
    public handleClick = (event: any) => {
        this.setState({
            anchorEl: event.currentTarget,
        }
        );
    }
    public onclick = (s: string) => (event: any) => {
        this.setState({
            anchorEl: null,
            server: s,
        }
        );
    }
    public render() {
        const {classes,...props} = this.props;
        return (
            <Slide direction="right" in={true} mountOnEnter={true} unmountOnExit={true}>
                <div  >
                    <AKAppBar {...props} appname="Node Status" />
                    <Grid container={true} justify="center" alignItems="center">
                        <Grid item={true} xs={12} sm={6} >
                            <Typography variant="body2" color="default" align="center" >
                                Node Status
                                                        </Typography>
                            <Paper className={classes.root} >
                                <Table >
                                    <TableBody >
                                        {
                                            ["Server1", "Server2", "Server3", "Server4", "Server5"].map(value => (
                                                <TableRow key={"tr" + value}>
                                                    <TableCell className={classes.item} component="th" scope="row">
                                                        <Typography variant="body2" color="default" >
                                                            {value}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell   >
                                                        <Typography variant="body1" color="default" >
                                                            Working
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Grid>
                        <Grid item={true} xs={12} sm={6} >
                            <Typography variant="body2" color="default" align="center" className={classes.title}>
                                Node Info
                            </Typography>
                            <Button className={classes.button}
                                aria-owns='simple-menu'
                                aria-haspopup="true"
                                onClick={this.handleClick}
                            >
                                {this.state.server === "" ? "Select Server" : this.state.server}
                            </Button>
                            <Menu
                                anchorEl={this.state.anchorEl}
                                id="simple-menu"
                                open={this.state.anchorEl != null}
                                onClose={this.handleClose}
                            >
                                <MenuItem onClick={this.onclick("Server1")}>Server1</MenuItem>
                                <MenuItem onClick={this.onclick("Server2")}>Server2</MenuItem>
                                <MenuItem onClick={this.onclick("Server3")}>Server3</MenuItem>
                                <MenuItem onClick={this.onclick("Server4")}>Server4</MenuItem>
                                <MenuItem onClick={this.onclick("Server5")}>Server5</MenuItem>
                            </Menu>
                            <Paper className={classes.root} >
                                <Table >
                                    <TableBody >
                                        {
                                            ["Total Supply", "Net", "Node Version", "Number of Peers", "Number of Leaves"].map(value => (
                                                <TableRow key={"tr" + value}>
                                                    <TableCell className={classes.item} component="th" scope="row">
                                                        <Typography variant="body2" color="default" >
                                                            {value}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell   >
                                                        <Typography variant="body1" color="default" >
                                                            {this.status[value]}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </Slide>
        );
    }
}

export default withStyles(styles)(NodeStatus);