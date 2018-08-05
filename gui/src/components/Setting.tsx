
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
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import ComputerIcon from '@material-ui/icons/Computer';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import * as React from 'react';
import IDefaultProp from '../defaultProp';
import AKAppBar from './AKAppBar';
import LeftImage from './LeftImage';

const styles = (theme: Theme) => createStyles({
    collapse: {
        margin: "0 auto",
    },
    root: {
        align: "center",
        backgroundColor: theme.palette.background.paper,
        margin: "0 auto",
        maxWidth: 360,
        width: "100%",
    },
    server: {
        marginLeft: theme.spacing.unit * 4,
        width: "80%",
    }
});

interface ISettingProps extends WithStyles<typeof styles>, IDefaultProp {
}
interface ISettingState {
    sopen: boolean,
    mopen: boolean,
}

class Setting extends React.Component<ISettingProps, ISettingState> {
    public constructor(prop: ISettingProps) {
        super(prop)
        this.state = {
            mopen: false,
            sopen: false,
        }
    }

    public handleClickS = () => {
        this.setState(state => ({ sopen: !state.sopen }));
    };
    public handleClickM = () => {
        this.setState(state => ({ mopen: !state.mopen }));
    };

    public render() {
        const {classes,...props} = this.props;
        return (
            <Slide direction="right" in={true} mountOnEnter={true} unmountOnExit={true}>
                <div>
                    <AKAppBar {...props} appname="Setting" />
                    <LeftImage>
                        <div className={classes.root} >
                            <List subheader={<ListSubheader>Settings</ListSubheader>}>
                                <ListItem button={true} onClick={this.handleClickM}>
                                    <ListItemIcon>
                                        <MonetizationOnIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Mining" />
                                    {this.state.mopen ? <ExpandLess /> : <ExpandMore />}
                                </ListItem>
                                <Collapse className={classes.collapse} in={this.state.mopen} timeout="auto" unmountOnExit={true}>
                                    <ListItem className={classes.server}>
                                        <ListItemText primary="Self Mining" />
                                        <ListItemSecondaryAction>
                                            <Switch
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>

                                    <ListItem className={classes.server}>
                                        <ListItemText primary="Ticket Mining" />
                                        <ListItemSecondaryAction>
                                            <Switch
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>


                                    <ListItem className={classes.server}>
                                        <ListItemText primary="Coin Mining" />
                                        <ListItemSecondaryAction>
                                            <Switch
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </Collapse>

                                <ListItem button={true} onClick={this.handleClickS}>
                                    <ListItemIcon>
                                        <ComputerIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Servers" />
                                    {this.state.sopen ? <ExpandLess /> : <ExpandMore />}
                                </ListItem>
                                <Collapse className={classes.collapse} in={this.state.sopen} timeout="auto" unmountOnExit={true}>
                                    {
                                        [0, 1, 2, 3, 4].map(value => (
                                            <TextField className={classes.server} key={"setting" + value}
                                                id={"serve" + value}
                                                label={"Server " + value}
                                                fullWidth={true}
                                            />
                                        ))
                                    }
                                </Collapse>
                            </List>
                        </div>
                    </LeftImage>
                </div>
            </Slide>
        );
    }
}

export default withStyles(styles)(Setting);