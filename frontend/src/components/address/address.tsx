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

import QRCode from 'qrcode.react';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import Scrollbar from 'smooth-scrollbar';
import * as actions from '../../actions';
import { IStoreState } from '../../reducers';
import { getAddresses, getNewaddress, IAddress, IaddressRecv, INewAddress, toADK } from '../../utils/remote';
import Grid from '../grid/grid';
import List from '../list/list';
import SubHeader from '../subheader/subheader';
import address from './address.json';

interface IchangeViewProps {
    newView: string;
    oldView: string;
}

interface IchangeGridFlagProps {
    value: boolean;
}


interface IProps {
    connected: boolean;
    title: string;
    views: string;
    addressValue: [];
    showGrid: boolean;
    popup: boolean;
    popup_Value: string;
    changeView: ({ newView, oldView }: IchangeViewProps) => void;
    changeGridFlag: ({ value }: IchangeGridFlagProps) => void;
    changeAddressValue: (address: any) => void;
    pushAddressValue: (address: any) => void;
}


class Address extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props);
        this.props.changeAddressValue(address.data);
    }
    public componentDidMount() {
        document.title = "Address || Aidos Wallet";
        Scrollbar.init(document.querySelector('#scrolle'));
        getAddresses(this.props.connected, (adr: IAddress) => {
            address.data = []
            adr.Normal.map((adrrecv: IaddressRecv, index: number) => {
                const val = {
                    value1: adrrecv.String,
                    value2: "Recv: " + toADK(adrrecv.Recv) + " ADK",
                }
                address.data.push(val)
            })
            this.props.changeAddressValue(address.data);
        })
    }

    public render() {
        return (
            <div>
                {/* Model Start  */}
                <div className="modal fade c-t-modal qr-code-modal" id="myModal123">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <span className="modal-title">{this.props.popup_Value}</span>
                                <button type="button" className="close" data-dismiss="modal" >×</button>
                            </div>
                            <div className="modal-body text-center">
                                <QRCode value={this.props.popup_Value} size={170} level="M" />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Model End  */}
                <div className="page-content-wrapper my-address-page">
                    <div className="page-content">
                        {/*Main Page Content*/}
                        <SubHeader title={this.props.title} views={this.props.views} onViewChange={this.onViewChange} />

                        <div className="row my-address-card">
                            <div className="col">
                                <div id="scrolle" className="card-height card bg-dark-green black-shadow mCustomScrollbar" data-mcs-theme="dark">
                                    <div className="card-content">
                                        {
                                            this.props.showGrid ?
                                                <div className="card-body p-4">
                                                    <Grid address={this.props.addressValue} />
                                                    {/* <div >
                                                </div> */}
                                                </div> :
                                                <List tables={this.props.addressValue} titleList={address.fields} />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-md-none d-block clearfix add-plus-btn">
                    <div className="float-right">
                        <a href="#"><i className="icon-plus"/></a>
                    </div>
                </div>

            </div>
        );
    }


    private onViewChange = (newView: any) => {
        if (newView === 'Grid' || newView === 'List') {
            this.props.changeView({ newView, oldView: this.props.views });
            const value = newView === 'Grid' ? true : false;
            this.props.changeGridFlag({ value });
        } else {
            getNewaddress(this.props.connected, (adr: INewAddress) => {
                if (adr.Error) {
                    alert(adr.Error)
                    return
                }
                const data = {
                    "value1": adr.Address,
                    "value2": "Recv: 0 ADK",
                }
                this.props.pushAddressValue(data);
            })
        }
    }
}

export const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        changeAddressValue: (addressValue: any) => dispatch(actions.changeAddressValue(addressValue)),
        changeGridFlag: ({ value }: IchangeGridFlagProps) => dispatch(actions.changeGridFlag({ value })),
        changeView: ({ newView, oldView }: IchangeViewProps) => dispatch(actions.changeView({ newView, oldView })),
        pushAddressValue: (addressData: any) => dispatch(actions.pushAddressValue(addressData)),
    }
}

export const mapStateToProps = (state: IStoreState) => {
    const { title, views } = state.address.subHeader;
    const { showGrid, addressValue } = state.address;
    const { popup, popup_Value } = state.popup;
    return { title, views, showGrid, popup, popup_Value, addressValue, connected: state.connected };
}


export default connect(mapStateToProps, mapDispatchToProps)(Address);