
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
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add'
import SearchIcon from '@material-ui/icons/Search';
import classNames from 'classnames';
import * as QRCode from "qrcode.react"
import * as React from 'react';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import IDefaultProp from '../defaultProp';
import AKAppBar from './AKAppBar';
import Snap from './Snap';

const styles = (theme: Theme) => createStyles({
    fab: {
        marginRight:10,
    },
    icon: {
        color: "lightgreen",
    },
    img: {
        align: "center",
        backgroundColor: "white",
        height: 150,
        margin: "0 auto",
        width: 150,
    },
    input:{
        align:"center",
        margin: "0 auto",
        textAlign:"center",
        width:"80%",
    },
    list: {
        backgroundColor: theme.palette.background.paper,
        margin: "0 auto",
        maxHeight: 360,
        maxWidth: 630,
        overflow: 'auto',
    },
    margin_top: {
        marginTop: 10,
    },
    not_selected: {
    },
    qrcode: {
        align: "center",
        display: "block",
        margin: "0 auto",
        paddingTop: 13,
    },
    search: {
        margin: "0 auto",
        paddingBottom: 10,
        paddingTop: 10,
        width: 400,
    },
    selected: {
        backgroundColor: "maroon",
    },
    smalladr: {
        [theme.breakpoints.up('sm')]: {
            fontSize: "1vw",
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: "2.5vw",
        },
    }
});

interface IAddressProps extends WithStyles<typeof styles>,IDefaultProp {
}

interface IAddressState {
    adr: string,
    copied: boolean,
    list: string[],
}

class MyAddress extends React.Component<IAddressProps, IAddressState> {
    public constructor(prop: IAddressProps) {
        super(prop)
        this.state = {
            adr: "",
            copied: false,
            list: [
            ],
        }
    }

    public onCopy = (a: string, b: boolean): void => {
        this.setState({
            adr: a,
            copied: true
        });
    }

    public handleClose = (event: any, reason: string) => {
        this.setState({ copied: false });
    };

    public handleAdd = (event: any) => {
        this.setState(
            {
                list: this.state.list.concat(["AKADRST53rF6mZAS81pojv6Fz2CNLVbo3pXiso6LX13CpBJoJHmMNVMVE9"]),
            }
        )
    };

    public render() {
        const {classes,...props} = this.props
        return (
            <Slide direction="right" in={true} mountOnEnter={true} unmountOnExit={true}>
                <div >
                    <AKAppBar {...props} appname="My Addresses" />
                    <Grid container={true} justify="center" alignItems="center">
                        <Grid item={true} xs={12} sm={5} >
                            <div className={classes.margin_top}>
                                <div className={classes.img}>
                                    <QRCode
                                        className={classes.qrcode}
                                        level="H"
                                        value={this.state.adr} />
                                </div>
                            </div>
                            <Typography noWrap={true} className={classes.smalladr} align="center">
                                {this.state.adr}
                            </Typography>
                        </Grid>
                        <Grid item={true} xs={12} sm={7} >
                            <div className={classes.search}>
                            <Button mini={true} variant="fab" color="secondary" aria-label="Add" className={classes.fab} onClick={this.handleAdd}>
                                    <AddIcon />
                                </Button>
                                <TextField
                                    fullWidth={true}
                                    className={classes.input}
                                    id="input-with-icon-textfield"
                                    label="Search"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                            <List className={classes.list} dense={true}>
                                {
                                    this.state.list.map(value =>
                                        this.renderAddress(value, 12345678.12345678, 100, 1024)
                                    )
                                }
                                {this.renderAddress("AKADRST53rF6mZAS81pojv6Fz2CNLVbo3pXiso6LX13CpBJoJHmMNVMVEi", 1, 100, 1024)}
                                {
                                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(value =>
                                        this.renderAddress("AKADRST53rF6mZAS81pojv6Fz2CNLVbo3pXiso6LX13CpBJoJHmMNVMVE" + value, 12345678.12345678, 100, 1024)
                                    )
                                }
                            </List>
                        </Grid>
                    </Grid>
                    <Snap open={this.state.copied} onClose={this.handleClose} msg="Address was copied to clipboard"/>
                </div >
            </Slide >
        );
    }

    private getClass = (adr: string) => {
        if (adr === this.state.adr) {
            return this.props.classes.selected
        }
        return this.props.classes.not_selected
    }

    private renderAddress = (adr: string, bal: number, avail: number, total: number) => {
        return (
            <ListItem key={"list" + adr} className={this.getClass(adr)}>
                <i className={classNames(this.props.classes.icon, 'fa fa-address-card')} />
                <ListItemText disableTypography={true}
                    primary={
                        <div >
                            <CopyToClipboard text={adr}
                                onCopy={this.onCopy}>
                                <Grid container={true} justify="center" alignItems="center" alignContent="center">
                                    <Grid item={true} xs={12} >
                                        <Typography noWrap={true} variant="body2" align="left">
                                            {adr}
                                        </Typography>
                                    </Grid>
                                    <Grid item={true} xs={12} sm={4} >
                                        <Typography noWrap={true} variant="body1" align="left">
                                            #Avail : {avail}/{total}
                                        </Typography>
                                    </Grid>
                                    <Grid item={true} xs={12} sm={8} >
                                        <Typography noWrap={true} variant="body1" align="right">
                                            Recv: {bal} ADK
                        </Typography>
                                    </Grid>
                                </Grid>
                            </CopyToClipboard>
                        </div>
                    }
                />
            </ListItem>
        )
    }
}

export default withStyles(styles)(MyAddress);