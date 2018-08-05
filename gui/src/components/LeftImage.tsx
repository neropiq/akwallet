
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
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import * as React from 'react';

const styles = (theme: Theme) => createStyles({
    img: {
        align: "center",
        display: "block",
        height: "80%",
        margin: "0 auto",
        width: "80%",
    },
});

interface ILIeftmageProps extends WithStyles<typeof styles> {
}

class LeftImage extends React.Component<ILIeftmageProps, object> {
    public render() {
        const classes = this.props.classes;
        return (
            <div  >
                <Grid container={true} justify="center" alignItems="center">
                    <Grid item={true} xs={12} sm={6} >
                        <img className={classes.img} src="logo.png" />
                    </Grid>
                    <Grid item={true} xs={12} sm={6} >
                        {this.props.children}
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(LeftImage);