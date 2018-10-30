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
import Scrollbar from 'smooth-scrollbar';
import * as actions from '../../actions';
import { IStoreState } from '../../reducers';
import { formatDate, getTransactions, ImultisigResp, IormalTxResp, IticketResp, ItxResp, toADK, toTimestamp, txStat } from '../../utils/remote';
import CardTab from '../cardTab/cardTab';
import SubHeader from '../subheader/subheader';
import Table from '../table/table';
import tables_multisig = require('./table_multisig.json');
import tables_normal = require('./table_normal.json');
import tables_ticket = require('./table_ticket.json');

interface IchangeProps {
    newFilter: any;
    oldFilter: any;
}

interface IProps {
    connected: boolean;
    title: string;
    filters: any;
    tab: any;
    changeFilterTransaction: ({ newFilter, oldFilter }: IchangeProps) => void;
    changeCardTabTransaction: ({ newFilter, oldFilter }: IchangeProps) => void;
}

interface IStates {
    fields: string[]
    data: string[][]
}

class Transactions extends React.Component<IProps, IStates> {
    // constructor(props) {
    //     super(props);
    //     this.state = {tables: tables};
    // }
    constructor(props: IProps) {
        super(props);
        this.state = {
            data: tables_normal.data,
            fields: tables_normal.fields,
        }
    }

   public componentDidMount() {
        document.title = "Transaction || Aidos Wallet";
        Scrollbar.init(document.querySelector('#scrolle'));
        console.log(this.props)
        this.updateTx(this.props.filters, this.props.tab)
    }

    public render() {
        return (
            <div>
                <div className="page-content-wrapper my-address-page">
                    <div className="page-content">
                        {/*Main Page Content*/}
                        <SubHeader title={this.props.title} transaction={this.props.filters} onTrancationFilterChange={this.onFilterChange} />
                        <div className="row transactions-card">
                            <div className="col-12">
                                <div id="scrolle" className="card-height card bg-dark-green black-shadow mCustomScrollbar" data-mcs-theme="dark">
                                    <div className="cad-table-content">
                                        <CardTab tab={this.props.tab} onCardChange={this.onCardChange} />
                                        <Table data={this.state.data} fields={this.state.fields} />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
   private updateTx = (filters: any, tab: any) => {
        let no = 0;
        filters.map((f: any, i: number) => {
            if (f.active) {
                no = i
            }
        })
        console.log(no)

        getTransactions(this.props.connected, no, (tr: ItxResp) => {
            if (tr.Error) {
                alert(tr.Error)
                return
            }
            let trr: any;
            const data: string[][] = []
            if (tab[0].active) {
                trr = tr.NormalTx
                if (trr != null) {
                    trr.map((resp: IormalTxResp, i: number) => {
                        const val = [
                            resp.Hash, resp.Amount > 0 ? "Receive" : "Send",
                            toADK(resp.Amount) + " ADK", formatDate(resp.Recv), txStat(resp)
                        ]
                        data.push(val)
                    })
                }
                this.setState({
                    data,
                    fields: tables_normal.fields,
                })
            }
            if (tab[1].active) {
                trr = tr.Ticket
                if (trr != null) {
                    trr.map((resp: IticketResp, i: number) => {
                        let source = "Mined"
                        if (resp.Reason === 0) {
                            source = "Spent"
                        }
                        if (resp.Reason === 1) {
                            source = "Issued"
                        }
                        const val = [
                            resp.Hash, source,
                            formatDate(resp.Recv), txStat(resp)
                        ]
                        data.push(val)
                    })
                }
                this.setState({
                    data,
                    fields: tables_ticket.fields,
                })
            }
            if (tab[2].active) {
                trr = tr.Multisig
                if (trr != null) {
                    trr.map((resp: ImultisigResp, i: number) => {
                        const val = [
                            resp.Hash, resp.Amount > 0 ? "Receive" : "Send", resp.Address,
                            toADK(resp.Amount) + " ADK", formatDate(resp.Recv), txStat(resp)
                        ]
                        data.push(val)
                    })
                }
                this.setState({
                    data,
                    fields: tables_multisig.fields,
                })
        }
            if (tab[3].active) {
                // TODO
                this.setState({
                    data,
                    fields: tables_normal.fields,
                })
            }

        })
    }

   private onFilterChange = (newFilter: any) => {
        console.log(newFilter)
        this.props.changeFilterTransaction({ newFilter, oldFilter: this.props.filters });
        const { payload } = actions.changeFilterTransaction({ newFilter, oldFilter: this.props.filters })
        this.updateTx(payload.newFilters, this.props.tab)
    }

    private onCardChange = (newFilter: any) => {
        console.log(newFilter)
        this.props.changeCardTabTransaction({ newFilter, oldFilter: this.props.tab });
        const { payload } = actions.changeCardTabTransaction({ newFilter, oldFilter: this.props.tab })
        this.updateTx(this.props.filters, payload.newFilters)
    }
}

export const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        changeCardTabTransaction: ({ newFilter, oldFilter }: IchangeProps) => dispatch(actions.changeCardTabTransaction({ newFilter, oldFilter })),
        changeFilterTransaction: ({ newFilter, oldFilter }: IchangeProps) => dispatch(actions.changeFilterTransaction({ newFilter, oldFilter })),
    }
}

export const mapStateToProps = (state: IStoreState) => {
    const { title, filters } = state.transaction.subHeader;
    const { tab } = state.transaction.cardHeaderTab;
    return { title, filters, connected: state.connected, tab };
}

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
