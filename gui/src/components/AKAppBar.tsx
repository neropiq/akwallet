import { createStyles, WithStyles } from '@material-ui/core';
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
import * as H from 'history';
import * as React from 'react';
import { Link } from "react-router-dom";
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

interface IAKAppBarProps extends WithStyles<typeof styles> {
    logined: boolean;
    appname: string;
    history: H.History;
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
    public constructor(prop: IAKAppBarProps) {
        super(prop)
        this.state = {
            menuOpen: false,
        }
    }

    public render() {
        const classes = this.props.classes;
        const prop = this.props;
        return (
            <div className={prop.classes.root}>
                <LeftMenu logined={prop.logined} toggleDrawer={this.toggleDrawer} menuOpen={this.state.menuOpen} />
                <AppBar position="static" className={classes.appbar}>
                    <Toolbar>
                        <IconButton color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.title}>
                            {prop.appname}
                        </Typography>
                        <Tooltip title="Back">
                            <IconButton color="default" aria-label={"Back"} onClick={this.goBack()}>
                                <ArrowBackIcon />
                            </IconButton>
                        </Tooltip>
                        <Hidden xsDown={true}>
                            {
                                prop.logined &&
                                listIcons(prop.appname, ["My Wallet", "My Addresses", "Send", "Transactions"])
                            }
                            {
                                !prop.logined &&
                                listIcons(prop.appname, ["Login", "Register"])
                            }
                        </Hidden>
                    </Toolbar>
                </AppBar>
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
}

export default withStyles(styles)(AKAppBar);