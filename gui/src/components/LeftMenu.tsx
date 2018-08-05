
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
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import AccountIcon from '@material-ui/icons/AccountBalance';
import * as React from 'react';
import { Link } from "react-router-dom";
import IDefaultProp from '../defaultProp';
import { apps, logout } from "./apps"

const styles = (theme: Theme) => createStyles({
    aicon: {
        paddingRight:10,
    },
    amount: {
        color: "white",
        fontSize: "12pt",
        fontWeight: "bold",
        margin: "20px 20px",
        textAlign: "center",
    },
    p: {
        marginBottom: 10,
    },
    root: {
        flexGrow: 1,
    },
});


function listItems(lists: string[]) {
    return (
        <div>
            {
                lists.map(value => (
                    <Link key={value} to={"/" + apps[value].path}>
                        <ListItem button={true}>
                            <ListItemIcon>
                                {apps[value].icon}
                            </ListItemIcon>
                            <ListItemText primary={value} />
                        </ListItem>
                    </Link>
                ))
            }
        </div>
    )
}

interface ILeftMenuProps extends WithStyles<typeof styles>,IDefaultProp {
    menuOpen: boolean;
    toggleDrawer: ((open: boolean) => () => void);
}

function LeftMenu(props: ILeftMenuProps) {
    const classes = props.classes;
    return (
        <div className={classes.root}>
            <Drawer open={props.menuOpen} onClose={props.toggleDrawer(false)}>
                <div
                    tabIndex={0}
                    role="button"
                    onClick={props.toggleDrawer(false)}
                >
                    <div>
                        {!props.logined && (
                            <div>
                                <List>{listItems(["Login"])}</List>
                                <List>{listItems(["Register"])}</List>
                            </div>
                        )}

                        {props.logined && (
                            <div>
                                <List component="nav" subheader={
                                    <ListSubheader component="div" >
                                        <Button className={classes.amount}>
                                            <AccountIcon className={classes.aicon} />
                                            12,345,678+ ADK
                                        </Button>
                                    </ListSubheader>
                                }>
                                    {listItems(["My Wallet", "My Addresses", "Send", "Transactions", "Setting", "Migration"])}
                                </List>
                                <Divider />
                            </div>
                        )}
                        <List>{listItems(["Node Status", "FAQ", "Terms"])}</List>
                        {props.logined && (
                            <div>
                                <Divider />
                                <List>
                                    <Link to={"/" + logout.path}>
                                        <ListItem button={true}>
                                            <ListItemIcon>
                                                {logout.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={"Logout"} />
                                        </ListItem>
                                    </Link>
                                </List>
                            </div>
                        )}
                    </div>
                </div>
            </Drawer>
        </div>
    );
}

export default withStyles(styles)(LeftMenu);