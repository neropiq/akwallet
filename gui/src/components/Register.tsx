
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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Lock from '@material-ui/icons/Lock';
import * as React from 'react';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import IDefaultProp from '../defaultProp';
import AKAppBar from './AKAppBar';
import LeftImage from './LeftImage';
import Snap from './Snap';

const styles = (theme: Theme) => createStyles({
    button: {
        display: "block",
        margin: "15pt auto",
    },
    dialog: {
        height: "auto",
    },
    input: {
        [theme.breakpoints.up('sm')]: {
            width: "80%",
        },
        [theme.breakpoints.down('sm')]: {
            width: "100%",
        },
        display: "block",
        margin: "10pt auto",
    },
    inputdiv: {
        margin: "0 auto",
    },
    key: {
        color: "white",
        textAlign: "center",
        wordWrap: "break-word",
    },
    title: {
        marginBottom: 50,
    },
    warn: {
        color: "red",
        fontWeight: "bold",
        marginTop: 30,
        textAlign: "center",
    }
});

interface IRegisterProps extends WithStyles<typeof styles>, IDefaultProp {
}
interface IRegisterState {
    copied: boolean,
    open: boolean,
    privkey:string,
}

class Register extends React.Component<IRegisterProps, IRegisterState> {
    public constructor(prop: IRegisterProps) {
        super(prop)
        this.state = {
            copied: false,
            open: false,
            privkey:"",
        }
    }

    public onCopy = (a: string, b: boolean) => {
        this.setState({
            copied: true
        });
    }

    public handleSnapClose = (event: any, reason: string) => {
        this.setState({ copied: false });
    };

    public handleClickOpen = () => {
        this.props.socket.emit("register", "aaa",(privkey:string) =>{
            this.setState({ 
                open: true ,
                privkey,
            });
        })
    };

    public handleClose = () => {
        this.setState({ open: false });
    };

    public render() {
        const {classes,...props} = this.props;
        return (
            <Slide direction="right" in={true} mountOnEnter={true} unmountOnExit={true}>
                <div  >
                    <AKAppBar {...props} appname="Register" />
                    <LeftImage>
                        <Typography variant="title" color="default" align="center" className={classes.title} >
                            Create a private key
                            </Typography>
                        <div className={classes.inputdiv}>
                            <TextField className={classes.input}
                                id="name"
                                label="Password"
                                type="password"
                                fullWidth={true}
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                        <Button variant="outlined" size="large" className={classes.button} onClick={this.handleClickOpen}>
                            Register
                    </Button>
                    </LeftImage>
                    {this.dialog()}
                </div>
            </Slide>
        );
    }

    private dialog = () => (
        <Dialog fullScreen={true}
            className={this.props.classes.dialog}
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Your Private Key"}</DialogTitle>
            <DialogContent>
                <CopyToClipboard text="AKPRIVT1GTmXS8ybvEqJDM4XbLFC8KamweH1WUUummtMrK5df1TmPCtYacQfFTf"
                    onCopy={this.onCopy}>
                    <DialogContentText className={this.props.classes.key}  >
                        <div className={this.props.classes.key}>
                            {this.state.privkey}
                    </div>
                    </DialogContentText>
                </CopyToClipboard>
                <DialogContentText className={this.props.classes.warn} >
                    KEEP YOUR PRIVATE KEY ABOVE SAFE. <br />
                    KEEY YOUR PASSWORD SAFE AND SECRET. <br />
                    OR YOU WILL LOSE ACCESS TO YOUR COINS. <br /> <br />
                    In Japanese: 上のシードと入力したパスワードは安全かつ秘密裏に保存してください、さもないと直ちに全額失います　<br /> ＼(^o^)／ｵﾜﾀー
    </DialogContentText>

            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleClose} color="default">
                    OK
      </Button>
            </DialogActions>
            <Snap open={this.state.copied} onClose={this.handleSnapClose} msg="Private key was copied to clipboard" />
        </Dialog>
    )
}

export default withStyles(styles)(Register);