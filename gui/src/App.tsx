// Copyright (c) 2018 Aidos Developer

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import { createStyles, WithStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createBrowserHistory from 'history/createBrowserHistory';
import * as React from 'react';
import { Router } from 'react-router';
import { Route } from 'react-router-dom';
import { apps } from './components/apps';
import GUI from './GUI'


const styles = (theme: Theme) => createStyles({
})

interface IAppProps extends WithStyles<typeof styles> {
}

interface IAppState {
    disconnected: boolean,
    logined: boolean,
}




class App extends React.Component<IAppProps, IAppState> {
    private socket = new GUI();

    private theme = createMuiTheme({
        palette: {
            type: 'dark',
        },
    });

    private history = createBrowserHistory()


    public constructor(prop: IAppProps) {
        super(prop)

        this.socket.onConnect( () => {
            this.setState(
                { disconnected: false }
            )
        });
        this.socket.onDisconnect( () => {
            this.setState(
                { disconnected: true }
            )
        });

        this.state = {
            disconnected: true,
            logined: false,
        }
        this.socket.connect()
    }

    public setLogined = (login: boolean) => {
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

    private getHandler = (name: string) => {
        if (name === "Login") {
            return (props: any) => <apps.Login.app {...this.state} socket={this.socket} setLogin={this.setLogined} {...props} />;
        }
        const app = apps[name]
        return (props: any) => <app.app {...this.state} socket={this.socket}  {...props} />
    }
}

export default withStyles(styles)(App);