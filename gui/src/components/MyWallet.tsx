
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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import CountUp from 'react-countup';
import IDefaultProp from '../defaultProp';
import AKAppBar from './AKAppBar';
import LeftImage from './LeftImage';

const styles = (theme: Theme) => createStyles({
    available: {
        paddingTop: 30,
    },
    center: {
        margin: "0 auto",
        width: 300,
    },
    receive: {
        color: "lightgreen"
    },
    sent: {
        color: "yellow"
    },
    title: {
        marginBottom: 50,
    },
});

interface IMyWalletProps extends WithStyles<typeof styles>, IDefaultProp {
}
interface IMyWalletState {
    span: string,
}



class MyWallet extends React.Component<IMyWalletProps, IMyWalletState> {
    public constructor(prop: IMyWalletProps) {
        super(prop)
        this.state = {
            span: "All",
        }
    }

    public handleChangeSpan = (event: any) => {
        this.setState({
            span: event.target.value,
        })
    }

    public render() {
        const {classes,...props} = this.props
        return (
            <Slide direction="right" in={true} mountOnEnter={true} unmountOnExit={true}>
                <div>
                    <AKAppBar {...props} appname="My Wallet" />
                    <LeftImage>
                        <Typography variant="display3" color="default" className={classes.title} align="center" >
                            Welcome Back !
                    </Typography>
                        <Grid container={true} justify="center" alignItems="center">
                            <Grid item={true} xs={12}>
                                <FormGroup row={true} className={classes.center}  >
                                    <RadioGroup row={true}
                                        aria-label="span"
                                        name="span"
                                        value={this.state.span}
                                        onChange={this.handleChangeSpan}
                                    >                                    >
                                        <FormControlLabel value="Monthly" control={<Radio color="secondary" />} label="Monthly" />
                                        <FormControlLabel value="Weekly" control={<Radio />} label="Weekly" />
                                        <FormControlLabel value="All" control={<Radio />} label="All" />
                                    </RadioGroup>
                                </FormGroup>
                            </Grid>
                            <Grid item={true} xs={6} >
                                <Typography variant="body2" color="default" align="center" >
                                    <CountUp start={0} end={12345678.12345678} decimals={8} /> ADK
                        <Typography variant="subheading" color="default" className={classes.receive} align="center" >
                                        Receive
                        </Typography>
                                </Typography>
                            </Grid>

                            <Grid item={true} xs={6} >
                                <Typography variant="body2" align="center" >
                                    <CountUp start={0} end={12345678.12345678} decimals={8} /> ADK
                        <Typography variant="subheading" className={classes.sent} align="center" >
                                        Sent
                        </Typography>
                                </Typography>
                            </Grid>

                        </Grid>
                        <Grid container={true} justify="center" alignItems="center">
                            <Grid item={true} xs={12} >
                                <Typography variant="headline" color="default" align="center" className={classes.available}>
                                    <CountUp start={0} end={12345678.12345678} decimals={8} /> ADK
                        <Typography variant="title" color="default" align="center" >
                                        Available
                        </Typography>
                                </Typography>
                            </Grid>
                        </Grid>
                    </LeftImage>
                </div>
            </Slide >
        );
    }
}

export default withStyles(styles)(MyWallet);