
import { createStyles, WithStyles } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as React from 'react';
import {  RouteComponentProps } from 'react-router-dom'
import AKAppBar from './AKAppBar';
import LeftImage from './LeftImage';

const styles = (theme: Theme) => createStyles({
    root: {
        width: "100%",
    }
});

interface IFAQProps extends WithStyles<typeof styles> , RouteComponentProps<any>{
    logined: boolean,
}


function FAQ(prop: IFAQProps) {
    const classes = prop.classes;
    return (
        <Slide direction="right" in={true} mountOnEnter={true} unmountOnExit={true}>
        <div  >
            <AKAppBar logined={prop.logined} appname="FAQ" history={prop.history} />
            <LeftImage>
                <div className={classes.root}>
                    <Typography gutterBottom={true} variant="display2" color="default" >
                        FAQ
                        </Typography>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography >Register a new account</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography>
                                To register a new account generate a seed via Register on the login screen. If you already generated a seed before you can
                                    login with it and access your account.<br /> A seed can be seen like a password that is used to access
                    your account, and therefore grant access to your Aidos coins. Never share your seed with anyone and store it safely,
                    because if you lose your seed you lose access to your Aidos coins.
                                </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography >Why does my wallet / computer seem to be stuck when I generate an address / make a transaction?</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography>
                                In both cases your CPU carries out an amount of Proof-of-Work, which is compute-intensive. This means that the time it takes
                                for those actions depend greatly on your computing power. We advice to be patient and grab a drink in the meantime.
                                </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>


                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography >Can I re-use addresses?</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography>
                                TODO
                                </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography >How to change the server? </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography>
                                You can change the server by selecting  TODO on menu bar and changing the server to e.g. "localhost" .
                                </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography >How do I get a Lambo? </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography>
                                <cite>Even the rich are hungy for love, for being cared for, for being wanted, for having someone to call their own.</cite>
                                <Typography align="right">
                                    Mother Teresa
                                </Typography>
                                What is your happiness? What are you living for? <br/>
                            Are you really happy by fighting with or abusing other crypto guys ?
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                </div>
            </LeftImage>
        </div>
        </Slide>
    );
}

export default withStyles(styles)(FAQ);