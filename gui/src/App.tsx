
import { createStyles, WithStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createBrowserHistory from 'history/createBrowserHistory';
import * as React from 'react';
import { Router } from 'react-router';
import { Route } from 'react-router-dom';
import { apps } from './components/apps';

const styles = (theme: Theme) => createStyles({
})

interface IAppProps extends WithStyles<typeof styles> {
}
interface IAppState {
    logined: boolean,
}

class App extends React.Component<IAppProps, IAppState> {

    private theme = createMuiTheme({
        palette: {
            type: 'dark',
        },
    });

    private history = createBrowserHistory()


    public constructor(prop: IAppProps) {
        super(prop)
        this.state = {
            logined: true, /*FIXME*/
        }
        this.setLogined = this.setLogined.bind(this);
    }

    public setLogined(login: boolean) :void {
        this.setState({
            logined: login,
        })
    }

    public render() {
        return (
            <MuiThemeProvider theme={this.theme}>
                <Router history={this.history}>
                    <div>
                        <Route exact={true} path={"/"}
                            render={this.getHandler("Login")}
                        />
                        {
                            Object.keys(apps).map(value => (
                                <Route key={"index" + value} exact={true} path={"/" + apps[value].path} render={this.getHandler(value)} />
                            ))}
                    </div>
                </Router>
            </MuiThemeProvider>
        )
    }

    private getHandler(name:string){
        if (name==="Login"){
            return (props:any) => <apps.Login.app logined={this.state.logined} setLogin={this.setLogined} {...props}  />;
        }
        const app=apps[name]
        return  (props:any) => <app.app logined={this.state.logined} {...props} />
    }
}

export default withStyles(styles)(App);