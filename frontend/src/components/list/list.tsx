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
import { Dispatch } from 'redux';
import * as actions from '../../actions/popupAction';
import { IStoreState } from '../../reducers';

interface IshowPopupProps {
    showPopup: boolean
}

interface IpopupValueProps {
    popupvalue: string
}

export interface Ivalues {
    value1: string
    value2: string
    value3: string
}

interface IProps {
    tables: Ivalues[];
    titleList: string[];
    popup: boolean;
    showPopup: ({ showPopup }: IshowPopupProps) => void;
    popupValue: ({ popupvalue }: IpopupValueProps) => void;
}
interface Istate {
    alert: false
}


class List extends React.Component<IProps> {

    public render() {
        return (
            <div className="card-body px-4 py-0">
                <div className="table-responsive custom-table-theme list-address">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                {
                                    this.props.titleList.map((field: string, index: number) => <th scope="col" key={index}>{field}</th>)
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.tables.map((rows: any, index: number) => (
                                    <tr key={index} onClick={this.openPopupbox(rows.value1)} >
                                        <td key={index}>
                                            <div className="mx-auto text-center">
                                                <div className="bg-white   mx-auto  align-middle " style={{ width: 64, height: 64 }} >
                                                    <div className="bg-white   mx-auto  align-middle " style={{ width: 2, height: 2 }} />
                                                    <QRCode value={rows.value1} size={60} level="H" data-toggle="modal" data-target="#myModal123" />
                                                </div>
                                            </div>
                                        </td>

                                        {/* <td key={index}><img src={rows.imgList} alt="qr-code" /></td> */}
                                        <td className="list-set" title={rows.value1}><span>{rows.value1}</span></td>
                                        <td >{rows.value2}</td>
                                        <td>{rows.value3}</td>
                                        {/* {
                                            rows.map((row: any, index: number) => {
                                                if(index === 0) {
                                                    return <td key={index}><img src={require('../../assets/images/qr-code-list-icon.png')} alt="qr-code" /></td>
                                                }
                                                return <td key={index}>{row}</td>
                                            })
                                        } */}
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
    public openPopupbox = (value: string) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(List);