
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
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import IDefaultProp from '../defaultProp';
import AKAppBar from './AKAppBar';
import LeftImage from './LeftImage';

const styles = (theme: Theme) => createStyles({
    link:{
        color:"#ff0000",
    },
    root: {
        width: "100%",
    },
});

interface ITermsProps extends WithStyles<typeof styles> ,IDefaultProp{
}


function Terms(props: ITermsProps) {
    const {classes,...dprops} = props;
    return (
        <Slide direction="right" in={true} mountOnEnter={true} unmountOnExit={true}>

        <div  >
            <AKAppBar {...dprops} appname="Terms" />
            <LeftImage>
                <div className={classes.root}>
                    <Typography gutterBottom={true} variant="display2" color="default" >
                        Terms &amp; Agreement
                        </Typography>
                    <Typography gutterBottom={true}  color="default" >
                        PLEASE READ THESE TERMS & AGREEMENTS CAREFULLY. BY USING THIS SOFTWARE, 
                        YOU AGREE TO BE BOUND BY THESE TERMS OF SERVICE AND ALL TERMS INCORPORATED BY REFERENCE.
                        IF YOU DO NOT AGREE TO THESE TERMS DO NOT ACCESS OR USE THIS SOFTWARE.<br />
                        <br />
                        Aidos Kuneen is open-souce software that is licensed under the MIT License.
                         See <a  className={classes.link} href="https://github.com/AidosKuneen/akwallet/blob/master/LICENSE">License</a>.<br />
                        By the use of this Wallet you agree that the Aidos Foundation & Developers are under no circumstances liable
                         for any loss or injury suffered by any kind of errors including keyboard input errors by the user.<br />
                        <br />
                        AIDOS FOUNDATION & DEVELOPERS SHALL HAVE NO LIABILITY FOR ANY DAMAGES OF ANY KIND 
                        (INCLUDING WITHOUT LIMITATION INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR TORT DAMAGES, OR LOST COINS)
                        IN CONNECTION WITH YOUR USE OF THE SOFTWARE.
                    </Typography>
                </div>
            </LeftImage>
        </div >
        </Slide>
    );
}

export default withStyles(styles)(Terms);