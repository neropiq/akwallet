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
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IStoreState } from '../../reducers';
import { formatDate, getNodeinfo, getNodesstatus, INodeInfo, nets } from '../../utils/remote';

interface IProps {
    connected: boolean;
    servers: string[];
}

interface IStates {
    stats: boolean[];
    info: INodeInfo;
    selected: number;
}

class NodeStatus extends React.Component<IProps, IStates> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            info: null,
            selected: 0,
            stats: [],
        }
    }

    public componentDidMount() {
        console.log("nodestaus didmount")
        getNodesstatus(this.props.connected, (stats: boolean[]) => {
            this.setState({
                stats
            })
            this.updateState(this.state.selected)
            console.log("end of didmount")
        })
    }

    public render() {
        return (
            <div className="" role="tabpanel" aria-labelledby="tab4">
                <div className="row node">
                    <div className="col-md-4 col-sm-12 node-status">
                        <div className="table-head">
                            <p> Node Status</p>
                        </div>
                        <div className="table-responsive node-table">
                            <table className="table">
                                <tbody>
                                    {this.props.servers && this.props.servers.map((svr: string, i: number) => (
                                        <tr key={i}>
                                            <th>{new URL(svr).hostname}</th>
                                            <td>{this.state.stats[i] ? "working" : "dead"}</td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    </div>
                    <div className="col-md-8 col-12 node-info">
                        <div className="table-head">
                            <p className="table-card-name">Node Info</p>
                            <div className="card-heading-element">
                                <select value={this.state.selected} onChange={this.onSelectServer} className="form-control custom-select-table" name="transaction-type" id="transaction-type" >
                                    {this.props.servers && this.props.servers.map((svr: string, i: number) => (
                                        <option key={i} value={i}>{new URL(svr).hostname}</option>
                                    ))
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="table-responsive node-table">
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <th>Total Supply</th>
                                        <td>25,000,000 ADK</td>
                                    </tr>
                                    <tr>
                                        <th>Net</th>
                                        <td>{this.state.info ? nets[this.state.info.testnet] : "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>Node Version</th>
                                        <td>{this.state.info ? this.state.info.version : "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>Number of Peers</th>
                                        <td>{this.state.info ? this.state.info.connections : "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>Number of Leaves</th>
                                        <td>{this.state.info ? this.state.info.leaves : "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>Time in the Node</th>
                                        <td>{this.state.info ? formatDate(this.state.info.time) : "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>Transaction numbers</th>
                                        <td>{this.state.info ? this.state.info.txno : "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>Last Ledger No</th>
                                        <td>{this.state.info ? this.state.info.latest_ledger_no : "-"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    private updateState = (n: number) => {
        getNodeinfo(this.props.connected, n, (info: INodeInfo) => {
            if (info.Error) {
                console.log(n + " is dead")
                this.setState({
                    info:null,
                })            
                return
            }
            console.log("state", info)
            this.setState({
                info,
            })
        })
        this.setState({
            selected: n,
        })
    }
    private onSelectServer = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const n = parseInt(e.currentTarget.value, 10)
        this.updateState(n)
    }
}
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
    }
}
const mapStateToProps = (state: IStoreState) => {
    const { Servers: servers } = state.config;
    return { servers }
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeStatus);