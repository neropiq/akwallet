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
import { IRawOutput, send, validateAddresses } from '../../utils/remote';
import Form from '../form/form';
import SubHeader from '../subheader/subheader';
import TableHeader from '../tableheader/tableheader';

interface IchangeLoadingProps {
    value: boolean
}

export interface IProps {
    connected: boolean;
    loading: boolean;
    changeLoading: ({ value }: IchangeLoadingProps) => void;
}


class SendAdk extends React.Component<IProps> {
    public componentDidMount() {
        document.title = "Dashboard || Aidos Wallet";
        // Scrollbar.initAll();
        Scrollbar.init(document.querySelector('#scrolle'));
        Scrollbar.init(document.querySelector('#scrolleTable'));
    }


    public render() {
        // console.log(this.props);
        return (
            <div className="page-content-wrapper">
                <div className="page-content">
                    <SubHeader title="Send ADK" />
                    <div className="row send-adk-cards">
                        <div className="col-md-12 col-lg-5">
                            <div id="scrolle" className="card-height card bg-dark-green black-shadow mb-4 mb-lg-0 send-adk-form-card mCustomScrollbar" data-mcs-theme="dark">
                                <div className="cad-form-content">
                                    <TableHeader header="Send ADK" />
                                    <div className="card-body">
                                        <Form onSubmit={this.submit} loading={this.props.loading} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 col-lg-7">
                            <div id="scrolleTable" className="card-height card bg-dark-green black-shadow  send-adk-table-card" data-mcs-theme="dark">
                                <div className="cad-table-content">
                                    <TableHeader header="Send From Multisig Address" />
                                    <div className="terms">
                                        <p>T.B.D</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private submit = (values: any) => {
        // print the form values to the console
        console.log(values);
        const adrs: string[] = []
        let isErr = false
        values.members.map((adrval: any, i: number) => {
            if (!adrval) {
                return
            }
            const amount = parseInt(adrval.amount, 10)
            if (!amount || !adrval.address) {
                alert("invalid amount or address at " + i)
                isErr = true
                return
            }
            adrs.push(adrval.address)
        })
        if (isErr) {
            return
        }
        console.log(adrs)
        if (!adrs || adrs.length === 0) {
            alert("There is no send address.")
            return
        }
        validateAddresses(this.props.connected, adrs, (errs: string) => {
            if (errs != null && errs.length > 0) {
                alert(errs)
                return
            }
            const dest: IRawOutput[] = [];
            values.members.map((adrval: any, i: number) => {
                if (!adrval) {
                    return
                }
                const amount = parseInt(adrval.amount, 10)
                if (adrval.address !== "" && amount && amount > 0) {
                    dest.push({
                        Address: adrval.address,
                        Value: parseInt(adrval.amount, 10),
                    })
                }
            })
            this.props.changeLoading({ value: !this.props.loading });
            send(this.props.connected, {
                Comment: values.comment,
                Dest: dest,
                Fee: 0, // TODO
                PoWType: parseInt(values.powType, 10),
            }, (err: string) => {
                if (err) {
                    alert(err)
                } else {
                    // TODO
                }
                this.props.changeLoading({ value: !this.props.loading });
            })
        })
    }
}


export const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        changeLoading: ({ value }: IchangeLoadingProps) => dispatch(actions.changeLoading({ value })),
    }
}


export const mapStateToProps = (state: IStoreState) => {
    const { loading } = state.sendAdk;
    return { loading, connected: state.connected };
}

export default connect(mapStateToProps, mapDispatchToProps)(SendAdk);
