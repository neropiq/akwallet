
import { createStyles, WithStyles } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import {  RouteComponentProps } from 'react-router-dom'
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

interface ITermsProps extends WithStyles<typeof styles> ,RouteComponentProps<any>{
    logined : boolean,
}


function Terms(prop: ITermsProps) {
    const classes = prop.classes;
    return (
        <Slide direction="right" in={true} mountOnEnter={true} unmountOnExit={true}>

        <div  >
            <AKAppBar logined={prop.logined} appname="Terms" history={prop.history} />
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