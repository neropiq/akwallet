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
import * as  React from 'react';
import { connect } from 'react-redux';
import {  toast } from 'react-toastify';
import { Dispatch } from 'redux';
import * as actions from '../../actions/popupAction';
import { IStoreState } from '../../reducers';

interface IshowPopupProps {
    showPopup: boolean
}

interface IpopupValueProps {
    popupvalue: string
}

interface IProps {
    address: any;
    popup: boolean;
    showPopup: ({ showPopup }: IshowPopupProps) => void;
    popupValue: ({ popupvalue }: IpopupValueProps) => void;
}
interface IState {
    alert: false
}
class Gride extends React.Component<IProps, IState> {

    public componentDidMount() {
        // Scrollbar.init(document.querySelector('#scrolleGride'));
    }

    public render() {

        return (
            // <Popup />
            <div className="row" >
                { this.props.address && this.props.address.length>0 &&
                    this.props.address.map((rows: any, index: number) => (
                        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 qr-code-address" key={index}>
                            <div className="row">
                                <div className="col-lg-4 col-md-4 col-sm-3 col-4" onClick={this.openPopupbox(rows.value1)}>
                                    <div className="mx-auto text-center">
                                        <div className="bg-white   mx-auto  align-middle " style={{ width: 82, height: 82 }} >
                                            <div className="bg-white   mx-auto  align-middle " style={{ width: 1, height: 1 }} />
                                            <QRCode value={rows.value1} size={80} level="H" data-toggle="modal" data-target="#myModal123" />
                                        </div>
                                    </div>


                                </div>
                                <div className="col-lg-8 col-md-8 col-sm-9 col-8 address-qr-details align-self-center align-content-center">
                                    <p className="grid-dot" title={rows.value1} onClick={this.copyText(rows.value1)}>{rows.value1}</p>
                                    <p className="grid-dot" title={rows.value2}>{rows.value2}</p>
                                    <p className="grid-dot" title={rows.value3}>{rows.value3}</p>
                                </div>
                            </div>
                        </div>
                    ))
                }

            </div>
        );
    }
    private copyText = (value: any) => {
        return () => {
            const input = document.createElement('input');
            input.setAttribute('value', value);
            document.body.appendChild(input);
            input.select();
            const result = document.execCommand('copy');
            document.body.removeChild(input);
            toast.success("Address was copied!", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    private openPopupbox = (value: any) => {
        return () => {
            this.props.popupValue({ popupvalue: value });
            this.props.showPopup({ showPopup: !this.props.popup });
        }
    }
}
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        popupValue: ({ popupvalue }: IpopupValueProps) => dispatch(actions.popupValue({ popupvalue })),
        showPopup: ({ showPopup }: IshowPopupProps) => dispatch(actions.showPopup({ showPopup })),
    }
}
const mapStateToProps = (state: IStoreState) => {
    const { popup } = state.popup;
    return { popup };
}

export default connect(mapStateToProps, mapDispatchToProps)(Gride);