
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