
import { createStyles, WithStyles } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import * as React from 'react';
import {  RouteComponentProps } from 'react-router-dom'
import AKAppBar from './AKAppBar';
import LeftImage from './LeftImage';

const styles = (theme: Theme) => createStyles({
    button: {
        marginLeft: "30%",
        marginTop: "5%",
    },
    img: {
        textAlign: "center",
        width: "80%",
    },
    pwd: {
        width:"80%",
    },
    root: {
    },
    seed: {
        width:"80%",
    },
});

interface ISendProps extends WithStyles<typeof styles>, RouteComponentProps<any>{ 
    logined:boolean,
}
interface ISendState {
    dummy:string,
}

class Send extends React.Component<ISendProps, ISendState> {
    public render() {
        // const classes = this.props.classes;
        return (
            <Slide direction="right" in={true} mountOnEnter={true} unmountOnExit={true}>

            <div  >
                <AKAppBar logined={this.props.logined}  appname="Send" history={this.props.history}/>
                <LeftImage imgSrc="logo.png">
                aa
                </LeftImage>
            </div>
            </Slide>
        );
    }
}

export default withStyles(styles)(Send);