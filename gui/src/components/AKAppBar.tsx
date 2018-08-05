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

import {  createStyles, Dialog, DialogContent, DialogContentText, DialogTitle, WithStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MenuIcon from '@material-ui/icons/Menu';
import * as React from 'react';
import { Link } from "react-router-dom";
import IDefaultProp from '../defaultProp';
import { apps } from './apps';
import LeftMenu from "./LeftMenu"


const styles = (theme: Theme) => createStyles({
    appbar: {
        background: " linear-gradient(135deg, rgba(32,35,33,1) 0%,rgba(61,151,44,1) 51%,rgba(32,35,33,1) 100%);",
    },
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
});

interface IAKAppBarProps extends WithStyles<typeof styles>, IDefaultProp {
    appname: string;
}

interface IAKAppBarState {
    menuOpen: boolean,
}

function listIcons(loc: string, lists: string[]) {
    lists = lists.filter(value => {
        if (value === loc) {
            return false
        }
        return true
    })
    return (
        <div>
            {
                lists.map(value => (
                    <Tooltip key={"akappbar" + value} title={value}>
                        <Link to={"/" + apps[value].path}>
                            <IconButton color="default" aria-label={value}>
                                {apps[value].icon}
                            </IconButton>
                        </Link>
                    </Tooltip>
                ))
            }
        </div>
    )
}

class AKAppBar extends React.Component<IAKAppBarProps, IAKAppBarState> {
    public constructor(props: IAKAppBarProps) {
        super(props)
        this.state = {
            menuOpen: false,
        }
    }

    public render() {
        const {classes,appname,...props} = this.props
        return (
            <div className={classes.root}>
                <LeftMenu {...props} toggleDrawer={this.toggleDrawer} menuOpen={this.state.menuOpen} />
                <AppBar position="static" className={classes.appbar}>
                    <Toolbar>
                        <IconButton color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.title}>
                            {appname}
                        </Typography>
                        <Tooltip title="Back">
                            <IconButton color="default" aria-label={"Back"} onClick={this.goBack()}>
                                <ArrowBackIcon />
                            </IconButton>
                        </Tooltip>
                        <Hidden xsDown={true}>
                            {
                                props.logined &&
                                listIcons(appname, ["My Wallet", "My Addresses", "Send", "Transactions"])
                            }
                            {
                                !props.logined &&
                                listIcons(appname, ["Login", "Register"])
                            }
                        </Hidden>
                    </Toolbar>
                </AppBar>
                {props.disconnected && this.dialog()}
            </div>
        );
    }
    private toggleDrawer = (open: boolean) => () => {
        this.setState({
            menuOpen: open,
        });
    }
    private goBack = () => () => {
        this.props.history.goBack()
    }
    private dialog = () => {
        return (
            <div>
                <Dialog
                    open={this.props.disconnected}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                    Info
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Connecting to Backend...
            </DialogContentText>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }
}

export default withStyles(styles)(AKAppBar);