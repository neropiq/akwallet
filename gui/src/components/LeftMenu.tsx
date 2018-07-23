
import { createStyles, WithStyles } from '@material-ui/core';
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
import { apps,logout } from "./apps"

const styles = (theme: Theme) => createStyles({
    aicon: {
        marginRight: "10pt",
    },
    amount: {
        color: "white",
        fontSize: "14pt",
        fontWeight: "bold",
        margin: "20px 20px",
        textAlign: "center",
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

interface ILeftMenuProps extends WithStyles<typeof styles> {
    logined: boolean;
    menuOpen: boolean;
    toggleDrawer: ((open: boolean) => () => void);
}

function LeftMenu(prop: ILeftMenuProps) {
    const classes = prop.classes;
    return (
        <div className={prop.classes.root}>
            <Drawer open={prop.menuOpen} onClose={prop.toggleDrawer(false)}>
                <div
                    tabIndex={0}
                    role="button"
                    onClick={prop.toggleDrawer(false)}
                >
                    <div>
                        {!prop.logined && (
                            <div>
                                <List>{listItems(["Login"])}</List>


                                <List>{listItems(["Register"])}</List>
                            </div>
                        )}

                        {prop.logined && (
                            <div>
                                <List component="nav" subheader={
                                    <ListSubheader component="div" className={classes.amount}><AccountIcon className={classes.aicon} />12,345,678+ ADK</ListSubheader>
                                }>
                                    {listItems(["My Wallet", "Address", "Send", "Transaction","Setting"])}
                                </List>
                                <Divider />
                            </div>
                        )}
                        <List>{listItems(["Node Status", "FAQ", "Terms"])}</List>
                        {prop.logined && (
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