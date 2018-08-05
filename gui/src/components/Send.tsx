
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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import LinearProgress from '@material-ui/core/LinearProgress';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup'
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear';
import MoneyIcon from '@material-ui/icons/Money';
import classNames from 'classnames';
import * as React from 'react';
import IDefaultProp from '../defaultProp';
// import QrReader from 'react-qr-reader'
import AKAppBar from './AKAppBar';
import LeftImage from './LeftImage';

const styles = (theme: Theme) => createStyles({
    address: {
        clear: "both",
        display: "block",
        margin: "0pt auto 0pt",
        width: "100%",
    },
    amount: {
        display: "block",
        margin: "0 auto 30pt",
        width: "100%",
    },
    button: {
        display: "block",
        margin: "15pt auto",
    },
    comment: {
        clear: "both",
        display: "block",
        margin: "0pt auto 30pt",
        width: "100%",
    },
    container: {
        [theme.breakpoints.up('sm')]: {
            width: "80%",
        },
        [theme.breakpoints.down('sm')]: {
            width: "100%",
        },
        margin: "auto",
    },
    fab: {
    },
    icon: {
        color: "white",
    },
    input: {
        clear: "both",
        display: "block",
        margin: "0pt auto 30pt",
        width: "100%",
    },
    pow: {
        display: "block",
        margin: "0 auto",
        maxWidth: 400,
    },
    powdiv: {
        display: "block",
        margin: "0pt auto",
        maxWidth: 400,
    },
    progress: {
        display: "block",
        margin: "30pt auto",
        width: "80%",
    },
    tx: {
        border: "1px solid grey",
        borderRadius: 5,
        margin: "0 0",
        marginTop: 10,
        maxWidth: "100%",
        padding: 15,
    },
});

interface IPayment {
    address: string,
    amount: number,
}

interface IMulti {
    address: string[],
    amount: number,
    txid: string,
}

interface ISendProps extends WithStyles<typeof styles>, IDefaultProp {
}
interface ISendState {
    inputs: IPayment[],
    multiin: string[],
    multiout: IMulti[],
    pow: string,
    result: string,
}

class Send extends React.Component<ISendProps, ISendState> {
    public constructor(prop: ISendProps) {
        super(prop)
        this.state = {
            inputs: [{
                address: "",
                amount: 0,
            }],
            multiin: [],
            multiout: [],
            pow: "pow",
            result: "",
        }
    }

    public handleChangePoW = (event: any) => {
        this.setState({
            pow: event.target.value,
        })
    }
    public handleOutAdd = (event: any) => {
        this.setState({
            inputs: this.state.inputs.concat([{
                address: "",
                amount: 0,
            }]),
        })
    };
    public handleOutRemove = (event: any) => {
        let inputs = [...this.state.inputs]
        inputs = inputs.filter(value => {
            if (value.address === "" && value.amount === 0) {
                return false
            }
            return true
        }
        )
        if (inputs.length === 0) {
            inputs = [{
                address: "",
                amount: 0,
            }]
        }
        this.setState({
            inputs,
        })
    }

    public handleScan = (data: string) => {
        if (data) {
            this.setState({
                result: data,
            })
        }
        //
    }

    public handleError = (err: string) => {
        //
    }

    public render() {
        const {classes,...props} = this.props;
        return (
            <Slide direction="right" in={true} mountOnEnter={true} unmountOnExit={true}>
                <div  >
                    <AKAppBar {...props} appname="Send" />
                    <LeftImage>
                        <div className={classes.container}>
                            <TextField
                                className={classes.comment}
                                fullWidth={true}
                                id="comment"
                                label="comment (255 chars)"
                            />
                            <Button color="secondary" aria-label="Remove" className={classes.fab} onClick={this.handleOutRemove}>
                                <ClearIcon /> Remove  Empty Fields
                            </Button>
                            <Button color="secondary" aria-label="Add" className={classes.fab} onClick={this.handleOutAdd}>
                                <AddIcon /> Add a Payment Address
                            </Button>
                            {
                                this.state.inputs.map(value =>
                                    (
                                        <div>
                                            <TextField key={"input" + value.address + value.amount}
                                                className={classes.address}
                                                fullWidth={true}
                                                id="Address to Send"
                                                label="Address To Send"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <i className={classNames(this.props.classes.icon, 'fa fa-address-card')} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            <TextField
                                                className={classes.amount}
                                                fullWidth={true}
                                                id="Amount to Send"
                                                label="Amount to Send"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <MoneyIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </div>
                                    ))}
                            <div className={classes.powdiv}>
                                <FormGroup row={true} className={classes.pow} >
                                    <FormLabel component="legend" className={classes.pow} >PoW Type:</FormLabel>
                                    <RadioGroup row={true}
                                        aria-label="pow"
                                        name="pow"
                                        value={this.state.pow}
                                        onChange={this.handleChangePoW}

                                    >
                                        <FormControlLabel value="pow" control={<Radio color="secondary" />} label="Do PoW" />
                                        <FormControlLabel value="ticket" control={<Radio />} label="Use Ticket" />
                                        <FormControlLabel value="feeee" control={<Radio />} label="Pay Fee" />
                                    </RadioGroup>
                                </FormGroup>
                            </div>

                            <Button variant="outlined" size="large" className={classes.button} >
                                Send
                    </Button>
                        </div>
                    </LeftImage>
                    <Typography variant="title" color="secondary" align="center" >
                        Doing PoW, please be patient.
                    </Typography>
                    <LinearProgress color="secondary" className={classes.progress} />
                    {/* <div>
                        <QrReader
                            delay={300}
                            onError={this.handleError}
                            onScan={this.handleScan}
                            style={{ width: '100%' }}
                        />
                        <p>{this.state.result}</p>
                    </div> */}
                </div>
            </Slide >
        );
    }


}

export default withStyles(styles)(Send);