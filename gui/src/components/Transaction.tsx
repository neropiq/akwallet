

import { createStyles, WithStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
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
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom'
import SwipeableViews from 'react-swipeable-views';
import AKAppBar from './AKAppBar';

const styles = (theme: Theme) => createStyles({
    avatar: {
        height: 35,
        width: 35,
    },
    center: {
        display: "block",
        margin: "0 auto",
        width: "100%",
    },
    confirmed: {
        color: "lightgreen",
    },
    container: {
        [theme.breakpoints.up('sm')]: {
            width: "80%",
        },
        [theme.breakpoints.down('sm')]: {
            width: "100%",
        },
        margin: "auto",
    },
    logo: {
        align: "center",
        display: "block",
        height: "80%",
        margin: "0 auto",
        width: "80%",
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
    select: {
        display: "block",
        margin: "0 auto",
        maxWidth: 400,
    },
});

enum status {
    confirmed,
    pending,
    rejected,
}

enum ticket_stat {
    issued,
    mined,
    spent,
}

interface ITxSubProps extends WithStyles<typeof styles>, RouteComponentProps<any> {
    logined: boolean,
}
interface ITxSubState {
    span: string,
    tabvalue: number,
}

class Transaction extends React.Component<ITxSubProps, ITxSubState> {
    public constructor(prop: ITxSubProps) {
        super(prop)
        this.state = {
            span: "All",
            tabvalue: 0,
        }
        this.handleChangeSpan = this.handleChangeSpan.bind(this);
    }

    public handleChangeSpan(event: any) {
        this.setState({
            span: event.target.value,
        })
    }
    public handleChange = (event: any, tabvalue: number) => {
        this.setState({ tabvalue });
    };

    public handleChangeIndex = (index: number) => {
        this.setState({ tabvalue: index });
    };

    public render() {
        const classes = this.props.classes;
        return (
            <Slide direction="right" in={true} mountOnEnter={true} unmountOnExit={true}>
                <div>
                    <AKAppBar logined={this.props.logined} appname="Transactions" history={this.props.history} />
                    <div className={classes.container}>
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
                        <FormGroup row={true} className={classes.select}  >
                            <RadioGroup row={true}
                                aria-label="span"
                                name="span"
                                value={this.state.span}
                                onChange={this.handleChangeSpan}
                            >
                                <FormControlLabel value="All" control={<Radio color="secondary" />} label="All" />
                                <FormControlLabel value="Confirmed" control={<Radio color="secondary" />} label="Confirmed" />
                                <FormControlLabel value="Rejected" control={<Radio color="secondary" />} label="Rejected" />
                                <FormControlLabel value="Pending" control={<Radio color="secondary" />} label="Pending" />
                            </RadioGroup>
                        </FormGroup>
                        <AppBar position="static" color="default">
                            <Tabs
                                indicatorColor="secondary"
                                textColor=""
                                fullWidth={true}
                                value={this.state.tabvalue}
                                onChange={this.handleChange}
                            >
                                <Tab label="Normal" />
                                <Tab label="Tickets" />
                                <Tab label="MultiSigs" />
                                <Tab label="Anon" />
                            </Tabs>
                        </AppBar>
                        <SwipeableViews
                            axis='x'
                            index={this.state.tabvalue}
                            onChangeIndex={this.handleChangeIndex}
                        >
                            <div className={classes.root}>
                                <List dense={true}>
                                    {this.getNormalListItem(status.pending, -1, "2017/01/01 00:00:00", "0842b55817c6c3fec0318234352b515c977f9cc9c4305042a06794e2c51421e2")}
                                    {this.getNormalListItem(status.rejected, 12345678.12345678, "2017/01/01 00:00:00", "0842b55817c6c3fec0318234352b515c977f9cc9c4305042a06794e2c51421e2")}
                                    {
                                        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(value =>
                                            this.getNormalListItem(status.confirmed, -12345678.12345678, "2017/01/01 00:00:00", "0842b55817c6c3fec0318234352b515c977f9cc9c4305042a06794e2c51421e2")
                                        )
                                    }
                                </List>
                            </div>
                            <div className={classes.root}>
                                <List dense={true}>
                                    {this.getTicketListItem(status.pending, ticket_stat.issued, "2017/01/01 00:00:00", "0842b55817c6c3fec0318234352b515c977f9cc9c4305042a06794e2c51421e2")}
                                    {this.getTicketListItem(status.pending, ticket_stat.spent, "2017/01/01 00:00:00", "0842b55817c6c3fec0318234352b515c977f9cc9c4305042a06794e2c51421e2")}
                                    {
                                        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(value =>
                                            this.getTicketListItem(status.pending, ticket_stat.mined, "2017/01/01 00:00:00", "0842b55817c6c3fec0318234352b515c977f9cc9c4305042a06794e2c51421e2")
                                        )
                                    }
                                </List>
                            </div>
                            <div className={classes.root}>
                                <List dense={true}>
                                    {this.getNormalListItem(status.pending, -1, "2017/01/01 00:00:00", "0842b55817c6c3fec0318234352b515c977f9cc9c4305042a06794e2c51421e2")}
                                    {this.getNormalListItem(status.rejected, 12345678.12345678, "2017/01/01 00:00:00", "0842b55817c6c3fec0318234352b515c977f9cc9c4305042a06794e2c51421e2")}
                                    {
                                        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(value =>
                                            this.getNormalListItem(status.confirmed, -12345678.12345678, "2017/01/01 00:00:00", "0842b55817c6c3fec0318234352b515c977f9cc9c4305042a06794e2c51421e2")
                                        )
                                    }
                                </List>
                            </div>
                            <div className={classes.root}>
                                3
                    </div>
                        </SwipeableViews>
                    </div >
                </div >
            </Slide >
        )
    }

    private getNormalListItem(stat: status, val: number, date: string, txid: string) {
        return this.getListItem(stat, val + " ADK", val > 0, date, txid)
    }
    private getTicketListItem(stat: status, tstat: ticket_stat, date: string, txid: string) {
        let statstr = "";
        let recv = true;
        switch (tstat) {
            case ticket_stat.issued:
                statstr = "Issued"
                break
            case ticket_stat.mined:
                statstr = "Mined"
                break
            case ticket_stat.spent:
                statstr = "Spent"
                recv = false;
                break
        }
        return this.getListItem(stat, statstr, recv, date, txid)
    }
    private getListItem(stat: status, txt: string, recv: boolean, date: string, txid: string) {
        let statstr;
        const icon = recv ? "receive.png" : "send.png"

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
            <ListItem key={"li" + txid} >
                <Avatar className={this.props.classes.avatar} src={icon} />
                <ListItemText disableTypography={true}
                    primary={
                        <Grid container={true} justify="center" alignItems="center" alignContent="center">
                            <Grid item={true} xs={12} sm={10} >
                                <Grid container={true} justify="center" alignItems="center" alignContent="center">
                                    <Grid item={true} xs={12} sm={6} >
                                        <Typography variant="subheading" >{date}</Typography>
                                    </Grid>
                                    <Grid item={true} xs={12} sm={6} >
                                        <Typography noWrap={true} variant="body2" align="right">{txt}</Typography>
                                    </Grid>
                                    <Grid item={true} xs={12}>
                                        <Typography variant="caption" noWrap={true} align="left">{txid}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item={true} xs={12} sm={2} >
                                {statstr}
                            </Grid>
                        </Grid>
                    }
                />
            </ListItem>
        )
    }
}

export default withStyles(styles)(Transaction);