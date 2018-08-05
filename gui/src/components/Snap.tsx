
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
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import * as React from 'react';

const styles = (theme: Theme) => createStyles({
});

interface ISnapProps extends WithStyles<typeof styles> {
    onClose: (event: any, reason: string) => void,
    msg: string,
    open: boolean,
}


function Snap(prop: ISnapProps) {
    return (
        <Snackbar
            open={prop.open}
            anchorOrigin={{
                horizontal: 'center',
                vertical: 'top',
            }}
            onClose={prop.onClose}
            autoHideDuration={3000}
            ContentProps={{
                'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{prop.msg}</span>}
        />
    )
}

export default withStyles(styles)(Snap);