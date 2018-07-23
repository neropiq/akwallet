

import { createStyles, WithStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom'

const styles = (theme: Theme) => createStyles({
    avatar: {
        height: 35,
        width: 35,
    },
    button: {
        marginLeft: "30%",
        marginTop: "5%",
    },
    center: {
        margin: "0 auto",
        width: 300,
    },
    confirmed: {
        color: "lightgreen",
    },
    img: {
        textAlign: "center",
        width: "80%",
    },
    list: {
    },
    litext: {
        overflow: "hidden",
    },
    logo: {
        align: "center",
        display: "block",
        height: "80%",
        margin: "0 auto",
        width: "80%",
    },
    pending: {
        color: "white",
    },
    pwd: {
        width: "80%",
    },
    rejected: {
        color: "red",
    },
    root: {
        backgroundColor: theme.palette.background.paper,
        margin: "0 auto",
        maxHeight: 360,
        overflow: 'auto',
        width: '100%',
    },
    search: {
        margin: "0 auto",
        width: 260,
    },
    txid: {
        width: "100%",
    },

});

enum status {
    confirmed,
    pending,
    rejected,
}

interface ITxSubProps extends WithStyles<typeof styles>, RouteComponentProps<any> {
    logined: boolean,
}
interface ITxSubState {
    span: string,
}

class TransactionSub extends React.Component<ITxSubProps, ITxSubState> {
    public constructor(prop: ITxSubProps) {
        super(prop)
        this.state = {
            span: "All",
        }
        this.handleChangeSpan = this.handleChangeSpan.bind(this);
    }

    public handleChangeSpan(event: any) {
        this.setState({
            span: event.target.value,
        })
    }

    public render() {
        const classes = this.props.classes;
        return (
            <Grid item={true} xs={12} sm={6} >
                <div className={classes.search}>
                    <TextField
                        id="input-with-icon-textfield"
                        label="Search"
                        fullWidth={true}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <FormGroup row={true} className={classes.center}  >
                    <RadioGroup row={true}
                        aria-label="span"
                        name="span"
                        value={this.state.span}
                        onChange={this.handleChangeSpan}
                    >
                        <FormControlLabel value="Monthly" control={<Radio color="secondary" />} label="Monthly" />
                        <FormControlLabel value="Weekly" control={<Radio color="secondary" />} label="Weekly" />
                        <FormControlLabel value="All" control={<Radio color="secondary" />} label="All" />
                    </RadioGroup>
                </FormGroup>

                <div className={classes.root}>
                    <List className={classes.list} dense={true}>
                        <ListItem >
                            <Avatar className={classes.avatar} src="send.png" />
                            <ListItemText disableTypography={true}
                                primary={
                                    <div>
                                        {this.getListItem(status.pending, "-1", "2017/01/01 00:00:00", "0842b55817c6c3fec0318234352b515c977f9cc9c4305042a06794e2c51421e2")}
                                    </div>
                                }
                            />
                        </ListItem>
                        <ListItem >
                            <Avatar className={classes.avatar} src="receive.png" />
                            <ListItemText disableTypography={true}
                                primary={
                                    <div>
                                        {this.getListItem(status.rejected, "+12345678.12345678", "2017/01/01 00:00:00", "0842b55817c6c3fec0318234352b515c977f9cc9c4305042a06794e2c51421e2")}
                                    </div>
                                }
                            />
                        </ListItem>
                        {
                            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(value => (
                                <ListItem key={value}>
                                    <Avatar className={classes.avatar} src="send.png" />
                                    <ListItemText disableTypography={true}
                                        primary={
                                            <div>
                                                {this.getListItem(status.confirmed, "-12345678.12345678", "2017/01/01 00:00:00", "0842b55817c6c3fec0318234352b515c977f9cc9c4305042a06794e2c51421e2")}
                                            </div>
                                        }
                                    />
                                </ListItem>
                            )

                            )
                        }
                    </List>
                </div>
            </Grid>
        )
    }

    private getListItem(stat: status, val: string, date: string, txid: string) {
        let statstr;

        switch (stat) {
            case status.confirmed:
                statstr = <Typography variant="subheading" align="right" className={this.props.classes.confirmed} >Confirmed</Typography>
                break
            case status.rejected:
                statstr = <Typography variant="subheading" align="right" color="error">Rejected</Typography>
                break
            case status.pending:
                statstr = <Typography variant="subheading" align="right" color="default">Pending</Typography>
                break
        }
        return (
            <div>
                <Grid container={true} justify="center" alignItems="center" alignContent="center">
                    <Grid item={true} xs={12} sm={10} >
                        <Grid container={true} justify="center" alignItems="center" alignContent="center">
                            <Grid item={true} xs={12} sm={6} >
                                <Typography variant="subheading" >{date}</Typography>
                            </Grid>
                            <Grid item={true} xs={12} sm={6} >
                                <Typography noWrap={true} variant="body2" align="right">{val} ADK</Typography>
                            </Grid>
                            <Typography variant="caption" noWrap={true}>{txid}</Typography>
                        </Grid>
                    </Grid>
                    <Grid item={true} xs={12} sm={2} >
                        {statstr}
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(TransactionSub);