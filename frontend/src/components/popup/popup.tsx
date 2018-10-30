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

interface IProps {
    popup: boolean;
    showPopup: ({ showPopup }: IshowPopupProps) => void
}

class Popup extends React.Component<IProps> {

    public componentDidMount() {

        const modal = document.getElementById('myModal123')
        modal.style.display = "block padding-right: 15px";
        document.getElementById('myModal123').className = 'z-index: 1050;display: block;overflow: hidden;outline: 0; position: fixed; top: 0;right: 0;bottom: 0;left: 0;';

    }

    public render() {
        return (
            <div >
                {/* <div ></div> */}
                <div className="modal fade c-t-modal show" id="myModal123">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <span className="modal-title">Demo</span>
                                <button type="button" className="close" data-dismiss="modal" onClick={this.closePopup}>×</button>
                            </div>
                            <div className="modal-body">
                                <QRCode value="ajksdfhjhasdfjahdfjhasdfh" size={130} level="M" />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
    private closePopup = () => {
        console.log('close');
        // console.log(this.props.popup);
        this.props.showPopup({ showPopup: !this.props.popup });
    }
}
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        showPopup: ({ showPopup }: IshowPopupProps) => dispatch(actions.showPopup({ showPopup })),
    }
}
const mapStateToProps = (state: IStoreState) => {
    const { popup } = state.popup;
    return { popup };
}
export default connect(mapStateToProps, mapDispatchToProps)(Popup);