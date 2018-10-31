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
import { toast } from 'react-toastify';
import { Dispatch } from 'redux';
import Scrollbar from 'smooth-scrollbar';
import * as actions from '../../actions';
import { Ifilter } from '../../model';
import { IStoreState } from '../../reducers';
import { getBalance, getTransactions, Ibalance, INormalTxResp, isUpdated, ItxResp, toADK, toTimestamp, txStat } from '../../utils/remote';
import Card, { ICardProps } from '../card/card';
import SubHeader from '../subheader/subheader';
import Table from '../table/table';
import TableHeader from '../tableheader/tableheader';
import cards = require('./cards.json');
import tables = require('./tables.json');

interface IchangeFilterProps {
    newFilter: string;
    oldFilter: Ifilter[];
}

interface IchangeSelectProps {
    value: string;
}

interface IProps {
    connected: boolean;
    title: string;
    filters: Ifilter[];
    noti: string[]; // for updating by notification
    changeFilter: ({ newFilter, oldFilter }: IchangeFilterProps) => void;
    changeSelect: ({ value }: IchangeSelectProps) => void;
    updateNotificationCount: (notificationCount: number) => void;
}
interface IStates {
    carddata: ICardProps[]
    data: string[][]
}

class Dashboard extends React.Component<IProps, IStates> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            carddata: cards.data,
            data: tables.data,
        }
    }
    public componentDidMount() {
        document.title = "Dashboard || Aidos Wallet";
        Scrollbar.init(document.querySelector('#scrolle'));
        this.updateBalance(this.props.filters[0].value)
        this.updateTx(this.props.filters[0].value)
    }
    public componentWillReceiveProps(nextProps: IProps) {
        if (isUpdated(this.props.noti, nextProps.noti)) {
            this.props.filters.map((f: Ifilter, i: number) => {
                if (f.active) {
                    this.updateBalance(f.value)
                    this.updateTx(f.value)
                }
            })
        }
    }
    public render() {
        return (
            <div className="page-content-wrapper" >
                <div className="page-content">
                    {/*Main Page Content*/}
                    <SubHeader title={this.props.title} filters={this.props.filters} onFilterChange={this.onFilterChange} />
                    <Card cards={this.state.carddata} />
                    <div className="row">
                        <div className="col bg-color-overlay bg-dark-green black-shadow" />
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div id="scrolle" className="card bg-dark-green black-shadow db-table-card-height mCustomScrollbar" >
                                <div className="cad-table-content">
                                    <TableHeader header={tables.header} menus={tables.menus} onSelectChange={this.onSelectChange} />
                                    <Table data={this.state.data} fields={tables.fields} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    private updateBalance = (f: string) => {
        let no = 0;
        for (no = 0; no < this.props.filters.length; no++) {
            if (this.props.filters[no].value === f) {
                break
            }
        }
        getBalance(this.props.connected, no, (bal: Ibalance) => {
            if (bal.Error) {
                toast.error(bal.Error, {
                    autoClose: false,
                    position: toast.POSITION.TOP_CENTER
                });
                return
            }
            console.log(bal)
            cards.data[0].cardPrice = toADK(bal.Recv)
            cards.data[1].cardPrice = toADK(bal.Sent)
            cards.data[2].cardPrice = toADK(bal.Avail)
            this.setState({
                carddata: cards.data
            })
        })
    }
    private updateTx = (f: string) => {
        let no = 0;
        for (no = 0; no < tables.menus.length; no++) {
            if (tables.menus[no] === f) {
                break
            }
        }
        getTransactions(this.props.connected, no, (tr: ItxResp) => {
            if (tr.Error) {
                toast.error(tr.Error, {
                    autoClose: false,
                    position: toast.POSITION.TOP_CENTER
                });
                return
            }
            const data: string[][] = []
            if (tr.NormalTx != null) {
                tr.NormalTx.map((trr: INormalTxResp, i: number) => {
                    if (i > 5) {
                        return
                    }
                    const val = [
                        trr.Hash, trr.Amount > 0 ? "Receive" : "Send",
                        toADK(trr.Amount) + " ADK", toTimestamp(trr.Recv), txStat(trr)
                    ]
                    data.push(val)
                })
            }
            this.setState({
                data
            })
        })
    }

    private onFilterChange = (newFilter: string) => {
        this.props.changeFilter({ newFilter, oldFilter: this.props.filters });
        this.updateBalance(newFilter)
    }

    private onSelectChange = (value: string) => {
        console.log(value)
        this.props.changeSelect({ value });
        this.updateTx(value)
    }
}

export const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        changeFilter: ({ newFilter, oldFilter }: IchangeFilterProps) => dispatch(actions.changeFilter({ newFilter, oldFilter })),
        changeSelect: ({ value }: IchangeSelectProps) => dispatch(actions.changeSelect({ value })),
        updateNotificationCount: (notificationCount: any) => dispatch(actions.updateNotificationCount(notificationCount)),
    }
}


export const mapStateToProps = (state: IStoreState) => {
    console.log(state.notification)
    const { title, filters } = state.dashboard.subHeader;
    return { title, filters, connected: state.connected, noti: [...state.notification.notification] }; // must make a new array.
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);