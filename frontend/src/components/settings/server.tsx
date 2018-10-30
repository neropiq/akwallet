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

import * as React from 'react';
import * as reactRedux from 'react-redux';
import { Dispatch } from 'redux';
import * as actions from '../../actions';
import { IConfigEntity } from '../../model';
import { IStoreState } from '../../reducers';
import { getAettings, updateServer } from '../../utils/remote';

interface IProps {
    connected: boolean;
    servers: string[];
    updateConfig: (cfg: IConfigEntity) => void;
}

interface IStates {
    newServers: string[];
}

class Server extends React.Component<IProps, IStates> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            newServers: [],
        }
    }
    public componentDidMount() {
        this.revert()
    }
    public render() {
        return (
            <div className=" " id="tab-2" role="tabpanel" aria-labelledby="tab2">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                        <div className="send-adk-form">
                            {this.state.newServers && this.state.newServers.map((svr: string, i: number) => (
                                <div className="form-group" key={i}>
                                    <input type="text" autoComplete="off" className="form-control" name="comment" value={svr} onChange={this.handleChange(i)} />
                                </div>
                            ))
                            }
                            <div className="form-group mt-md-5">
                                <button className="btn btn-cancel btn-secondary mr-2" onClick={this.revert}>Revert</button>
                                <button className="btn btn-send btn-primary" onClick={this.handleSave}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    private handleSave = () => {
        let err = false
        const newservers: string[] = []
        this.state.newServers.map((s: string, i: number) => {
            if (!s) {
                return
            }
            try {
                const u = new URL(s)
                if (!u.hostname || !u.port || u.protocol !== "http:" ||
                    u.search || u.password || u.pathname !== "/" || u.hash || u.username) {
                    throw 0;
                }
                newservers.push(s)
            } catch (e) {
                alert("invalid server name at " + i)
                err = true
            }
        })
        if (err) {
            return
        }
        updateServer(this.props.connected, newservers, (errr: string) => {
            if (errr) {
                alert(errr)
                return
            }
        })
        // TODO
        alert("success")
        getAettings(this.props.connected, (cfg: IConfigEntity) => {
            this.props.updateConfig(cfg)
        })
    }

    private revert = () => {
        const servers: string[] = []
        this.props.servers.map((s: string) => {
            servers.push(s)
        })
        servers.push("")
        servers.push("")
        servers.push("")
        this.setState({
            newServers: servers,
        })
    }

    private handleChange = (i: number) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            const servers: string[] = []
            this.state.newServers.map((s: string) => {
                servers.push(s)
            })
            servers[i] = e.currentTarget.value
            this.setState({
                newServers: servers,
            })
        }
    }
}
export const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        updateConfig: (cfg: IConfigEntity) => dispatch(actions.updateConfig(cfg)),
    }
}

const mapStateToProps = (state: IStoreState) => {
    const { Servers: servers } = state.config;
    return { servers }
}
export default reactRedux.connect(mapStateToProps, mapDispatchToProps)(Server);