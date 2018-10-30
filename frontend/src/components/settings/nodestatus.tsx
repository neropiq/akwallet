import * as React from 'react';

class NodeStatus extends React.Component {

    render() {
        return(
            <div className="" role="tabpanel" aria-labelledby="tab4">
                <div className="row node">
                    <div className="col-md-4 col-sm-12 node-status">
                        <div className="table-head">
                            <p> Node Status</p>
                        </div>
                        <div className="table-responsive node-table">
                            <table className="table">
                                <tbody>
                                <tr>
                                    <th>Server 1</th>
                                    <td>Working</td>
                                </tr>
                                <tr>
                                    <th>Server 2</th>
                                    <td>Working</td>
                                </tr>
                                <tr>
                                    <th>Server 3</th>
                                    <td>Working</td>
                                </tr>
                                <tr>
                                    <th>Server 4</th>
                                    <td>Working</td>
                                </tr>
                                <tr>
                                    <th>Server 5</th>
                                    <td>Working</td>
                                </tr>
                                </tbody>
                                
                            </table>
                        </div>
                    </div>
                    <div className="col-md-8 col-12 node-info">
                        <div className="table-head">
                            <p className="table-card-name">Transaction</p>
                            <div className="card-heading-element">
                                <select className="form-control custom-select-table" name="transaction-type" id="transaction-type">
                                    <option value="Server 1">Server 1</option>
                                    <option value="Server 2">Server 2</option>
                                    <option value="Server 3">Server 3</option>
                                    <option value="Server 4">Server 4</option>
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
                                        <td>MainNet</td>
                                    </tr>
                                    <tr>
                                        <th>Node Version</th>
                                        <td>Aknode 1.0.0</td>
                                    </tr>
                                    <tr>
                                        <th>Number of Peers</th>
                                        <td>12345</td>
                                    </tr>
                                    <tr>
                                        <th>Number of Leaves</th>
                                        <td>13425</td>
                                    </tr>
                                </tbody>
                                
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default NodeStatus;