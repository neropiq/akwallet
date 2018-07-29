
import { createStyles, WithStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom'
import AKAppBar from './AKAppBar';
import LeftImage from './LeftImage';


const styles = (theme: Theme) => createStyles({
    button: {
        display: "block",
        margin: "15pt auto",
    },
    seed: {
        clear: "both",
        display: "block",
        margin: "0pt auto 0pt",
        width: "100%",
    },
});

interface IMigrationProps extends WithStyles<typeof styles>, RouteComponentProps<any> {
    logined: boolean,
}
interface IMigrationState {
    open: boolean,
    snapbar: boolean,
}

class Migration extends React.Component<IMigrationProps, IMigrationState> {
    public constructor(prop: IMigrationProps) {
        super(prop)
        this.state = {
            open: false,
            snapbar: false,
        }
    }

    public handleClick = (event: any) => {
        this.setState({
            open: true,
        })
    };

    public handleClose = (event: any) => {
        this.setState({
            open: false,
            snapbar: true,
        })
    };
    public handleSnapClose = (event: any) => {
        this.setState({
            snapbar: false,
        })
    };

    public render() {
        const classes = this.props.classes;
        return (
            <Slide direction="right" in={true} mountOnEnter={true} unmountOnExit={true}>
                <div  >
                    <AKAppBar logined={this.props.logined} appname="Migration" history={this.props.history} />
                    <LeftImage>
                        <Typography variant="body2" align="left">
                            To migrate your ADK in your old wallet to new one, please fill in your old seed and push CLAIM button.
        </Typography>
                        <TextField
                            className={classes.seed}
                            fullWidth={true}
                            id="seed"
                            label="Seed of your old wallet"
                        />
                        <Button variant="outlined" size="large" className={classes.button} onClick={this.handleClick}>
                            Claim
                    </Button>
                    </LeftImage>
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Ready for Claiming Migration"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Please ensure that your amount of ADK is <br />
                                <Typography variant="body2" align="center" color="secondary">
                                    12345678.12345678 ADK.
                                </Typography>
                                If it's OK, procceed to migrate.
            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="secondary">
                                Cancel
            </Button>
                            <Button onClick={this.handleClose} color="secondary">
                                Proceed to Migrate
            </Button>
                        </DialogActions>
                    </Dialog>
                    <Snackbar
                        open={this.state.snapbar}
                        anchorOrigin={{
                            horizontal: 'center',
                            vertical: 'top',
                        }}
                        onClose={this.handleSnapClose}
                        autoHideDuration={3000}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">Your ADK is Successfully Claimed. </span>}
                    />
                </div >
            </Slide>
        );
    }
}

export default withStyles(styles)(Migration);