
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
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import IDefaultProp from '../defaultProp';
import AKAppBar from './AKAppBar';

const styles = (theme: Theme) => createStyles({
    button: {
        display: "block",
        margin: "0 auto",
    },
    confirmed: {
        backgroundColor: "#5cb85c",
        display: "block",
        margin: "0 auto",
    },
    icon: {
        color: "lightgreen",
        fontSize: 25,
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

interface ITxDetailsProps extends WithStyles<typeof styles>, IDefaultProp {
    txid: string,
}

interface ITxDetailsState {
    dummy: string,
}

class TxDetails extends React.Component<ITxDetailsProps, ITxDetailsState> {
    public tx = (adr: string, val: number) => {
        return (
            <div className={this.props.classes.tx}>
                <Typography component="p" noWrap={true}>
                    {adr}
                </Typography>
                <Typography component="p" noWrap={true} align="right">
                    {val} ADK
</Typography>
            </div>
        )
    }

    public ticket = (adr: string) => {
        return (
            <div className={this.props.classes.tx}>
                <Typography component="p" noWrap={true}>
                    {adr}
                </Typography>
            </div>
        )
    }

    public multi = (m: number, adr: string[], val: number) => {
        return (
            <div className={this.props.classes.tx}>
                <Typography component="p" noWrap={true} align="center">
                    {m} out of {adr.length}
                </Typography>
                {
                    adr.map(value => (
                        <Typography component="p" noWrap={true}>
                            {value}
                        </Typography>
                    ))
                }
                <Typography component="p" noWrap={true} align="right">
                    {val} ADK
</Typography>
            </div>
        )
    }

    public render() {
        const {classes,txid,...props} = this.props
        return (
            <Slide direction="right" in={true} mountOnEnter={true} unmountOnExit={true}>
                <div  >
                    <AKAppBar {...props} appname="Tx Details" />
                    <Typography variant="body2" align="center" noWrap={true}>
                        TxID: 0842b55817c6c3fec0318234352b515c977f9cc9c4305042a06794e2c51421e2
        </Typography>
                    <Button variant="contained" color="secondary" className={classes.button}>
                        Rejected
      </Button>
                    <Button variant="contained" className={classes.confirmed}>
                        Confirmed
      </Button>
                    <Button variant="contained" color="default" className={classes.button}>
                        Pending
      </Button>
                    <Grid container={true} justify="space-around" alignItems="center">
                        <Grid item={true} xs={12} sm={5} >
                            <Typography variant="headline" component="h3">
                                Input
        </Typography>
                            {this.tx("AKADRST53rF6mZAS81pojv6Fz2CNLVbo3pXiso6LX13CpBJoJHmMNVMVE9", 24999951.34292406)}
                            {this.tx("AKADRST53rF6mZAS81pojv6Fz2CNLVbo3pXiso6LX13CpBJoJHmMNVMVE9", 24999951.34292406)}
                            {this.tx("AKADRST53rF6mZAS81pojv6Fz2CNLVbo3pXiso6LX13CpBJoJHmMNVMVE9", 24999951.34292406)}
                            {this.tx("AKADRST53rF6mZAS81pojv6Fz2CNLVbo3pXiso6LX13CpBJoJHmMNVMVE9", 24999951.34292406)}
                            {this.tx("AKADRST53rF6mZAS81pojv6Fz2CNLVbo3pXiso6LX13CpBJoJHmMNVMVE9", 24999951.34292406)}
                            <Typography variant="headline" component="h3">
                                Multisig Input
        </Typography>
                            {this.multi(3, ["AKADRST53rF6mZAS81pojv6Fz2CNLVbo3pXiso6LX13CpBJoJHmMNVMVE9",
                                "AKADRST53rF6mZAS81pojv6Fz2CNLVbo3pXiso6LX13CpBJoJHmMNVMVE9",
                                "AKADRST53rF6mZAS81pojv6Fz2CNLVbo3pXiso6LX13CpBJoJHmMNVMVE9",
                                "AKADRST53rF6mZAS81pojv6Fz2CNLVbo3pXiso6LX13CpBJoJHmMNVMVE9"],
                                24999951.34292406)}
                            <Typography variant="headline" component="h3">
                                Ticket Input
        </Typography>
                            {this.ticket("AKADRST53rF6mZAS81pojv6Fz2CNLVbo3pXiso6LX13CpBJoJHmMNVMVE9")}

                        </Grid>
                        <Grid item={true} xs={12} sm={5} >
                            <Typography variant="headline" component="h3">
                                Output
        </Typography>
                            {this.tx("AKADRST53rF6mZAS81pojv6Fz2CNLVbo3pXiso6LX13CpBJoJHmMNVMVE9", 24999951.34292406)}
                            {this.tx("AKADRST53rF6mZAS81pojv6Fz2CNLVbo3pXiso6LX13CpBJoJHmMNVMVE9", 24999951.34292406)}
                            {this.tx("AKADRST53rF6mZAS81pojv6Fz2CNLVbo3pXiso6LX13CpBJoJHmMNVMVE9", 24999951.34292406)}
                            {this.tx("AKADRST53rF6mZAS81pojv6Fz2CNLVbo3pXiso6LX13CpBJoJHmMNVMVE9", 24999951.34292406)}
                            {this.tx("AKADRST53rF6mZAS81pojv6Fz2CNLVbo3pXiso6LX13CpBJoJHmMNVMVE9", 24999951.34292406)}
                            <Typography variant="headline" component="h3">
                                Multisig Output
        </Typography>
                            {this.multi(3, ["AKADRST53rF6mZAS81pojv6Fz2CNLVbo3pXiso6LX13CpBJoJHmMNVMVE9",
                                "AKADRST53rF6mZAS81pojv6Fz2CNLVbo3pXiso6LX13CpBJoJHmMNVMVE9",
                                "AKADRST53rF6mZAS81pojv6Fz2CNLVbo3pXiso6LX13CpBJoJHmMNVMVE9",
                                "AKADRST53rF6mZAS81pojv6Fz2CNLVbo3pXiso6LX13CpBJoJHmMNVMVE9"],
                                24999951.34292406)}
                            <Typography variant="headline" component="h3">
                                Ticket Output
        </Typography>
                            {this.ticket("AKADRST53rF6mZAS81pojv6Fz2CNLVbo3pXiso6LX13CpBJoJHmMNVMVE9")}
                        </Grid>
                    </Grid>
                </div>
            </Slide>
        );
    }
}

export default withStyles(styles)(TxDetails);