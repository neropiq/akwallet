
import { createStyles, WithStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import TextField from '@material-ui/core/TextField';
import Lock from '@material-ui/icons/Lock';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom'
import AKAppBar from './AKAppBar';
import LeftImage from './LeftImage';

const styles = (theme: Theme) => createStyles({
    button: {
        marginLeft: "35%",
        marginTop: "5%",
    },
    input: {
        [theme.breakpoints.up('sm')]: {
            width: "80%",
        },
        [theme.breakpoints.down('sm')]: {
            width: "100%",
        },
    },
    inputdiv: {
        margin: "0 auto",
    },
    root: {
    },
});

interface IRegisterProps extends WithStyles<typeof styles>, RouteComponentProps<any> {
    logined: boolean,
}


class Register extends React.Component<IRegisterProps, object> {
    public render() {
        const classes = this.props.classes;
        return (
            <Slide direction="right" in={true} mountOnEnter={true} unmountOnExit={true}>
                <div  >
                    <AKAppBar logined={this.props.logined} appname="Register" history={this.props.history} />
                    <LeftImage imgSrc="logo.png">
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
                        <Button variant="outlined" size="large" className={classes.button} >
                            Register
                    </Button>
                    </LeftImage>
                </div>
            </Slide>
        );
    }
}

export default withStyles(styles)(Register);