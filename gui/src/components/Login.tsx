
import { createStyles, WithStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Lock from '@material-ui/icons/Lock';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom'
import AKAppBar from './AKAppBar';
import LeftImage from './LeftImage';

const styles = (theme: Theme) => createStyles({
    button: {
        display: "block",
        margin: "15pt auto",
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
    title: {
        marginBottom: 50,
    },
});

interface ILoginProps extends WithStyles<typeof styles>, RouteComponentProps<any> {
    logined: boolean,
    setLogin: (_: boolean) => void,
}


class Login extends React.Component<ILoginProps, object> {
    public render() {
        const classes = this.props.classes;
        return (
            <Slide direction="right" in={true} mountOnEnter={true} unmountOnExit={true}>
                <div  >
                    <AKAppBar logined={this.props.logined} appname="Login" history={this.props.history} />
                    <LeftImage>
                        <Typography variant="title" color="default" align="center" className={classes.title} >
                            Welcome to Aidos Kuneen !
                            </Typography>
                        <TextField
                            className={classes.input}
                            fullWidth={true}
                            id="privkey"
                            label="Private Key"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            className={classes.input}
                            fullWidth={true}
                            id="password"
                            label="Password"
                            type="password"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button variant="outlined" size="large" className={classes.button} >
                            Login
                    </Button>
                    </LeftImage>
                </div>
            </Slide>
        );
    }
}

export default withStyles(styles)(Login);