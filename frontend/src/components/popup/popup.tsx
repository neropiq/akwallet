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

import * as  React from 'react';
import Scrollbar from 'smooth-scrollbar';
import { IMultiSigInOut, InOut, ITxCommon, toADK } from '../../utils/remote';

interface IProps {
    PopUpvalue: ITxCommon;
    onclosepopup?: () => void;
}

class PopupTx extends React.Component<IProps> {
    public componentDidMount() {
        // window.onclick = function(){   
        //     this.props.onclosepopup();     
        // }                
        Scrollbar.init(document.querySelector('#popupscrollecard1'));
        Scrollbar.init(document.querySelector('#popupscrollecard2'));
    }
    public render() {
        const tx = this.props.PopUpvalue;
        return (
            <div className="c-popup-modal popup c-t-modal qr-code-modal">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <span className="modal-title">Transaction</span>
                            <button type="button" className="close" onClick={this.props.onclosepopup} >×</button>
                        </div>
                        <div className="modal-body py-4" >
                            {/* <p>{this.props.textvalue}</p> */}
                            <div className="row position-relative">
                                <div className="col-md-6" >
                                    <div className="card bg-dark-green mb-4 mb-md-0 black-shadow">
                                        <div className="card-header">
                                            <div className="card-name">{(tx.Inputs ? tx.Inputs.length : 0) + (tx.Minputs ? tx.Minputs.length : 0)} INPUT CONSUMED</div>
                                        </div>
                                        <div id="popupscrollecard1" className="card-body">
                                            {
                                                tx.Inputs && tx.Inputs.map((inp: InOut, i: number) => (
                                                    <div className="mb-4" key={"in" + i}>
                                                        <h6>{toADK(inp.Value)} ADK</h6>
                                                        <p  className='text-light-green font-size'>{inp.Address}</p>
                                                    </div>
                                                ))
                                            }
                                            {tx.Minputs && tx.Minputs.length>0 && 
                                                <div>
                                                    <h6 className="card-name mb-3 text-uppercase">MULTISIG INPUTS</h6>
                                                    {
                                                        tx.Minputs && tx.Minputs.map((inp: IMultiSigInOut, i: number) => (
                                                            <div className="mb-4" key={"min" + i}>
                                                                <h6>{toADK(inp.Value)} ADK</h6>
                                                                <p className='text-light-green font-size'>{inp.Address}</p>
                                                                {
                                                                    inp.Addresses.map((a: string, ii: number) => (
                                                                        <p key={"min" + i + "-" + ii}>{a}</p>
                                                                    ))
                                                                }
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="share-add d-none d-md-block">
                                    <img src={require('../../assets/images/share-icon-arrrow.png')} width="25" alt="" />
                                </div>
                                <div className="col-md-6" >
                                    <div className="card bg-dark-green black-shadow">
                                        <div className="card-header">
                                            <div className="card-name">{(tx.Outputs ? tx.Outputs.length : 0) + (tx.MOutputs ? tx.MOutputs.length : 0)} OUTPUT CREATED</div>
                                        </div>
                                        <div id="popupscrollecard2" className="card-body c-body-height">
                                            {
                                                tx.Outputs && tx.Outputs.map((inp: InOut, i: number) => (
                                                    <div className="mb-4" key={"out" + i}>
                                                        <h6>{toADK(inp.Value)} ADK</h6>
                                                        <p className='text-light-green font-size'>{inp.Address}</p>
                                                    </div>
                                                ))
                                            }
                                            {tx.MOutputs && tx.MOutputs.length>0 && 
                                                <div>
                                                    <h6 className="card-name mb-3 text-uppercase">MULTISIG OUTPUTS</h6>
                                                    {
                                                        tx.MOutputs && tx.MOutputs.map((inp: IMultiSigInOut, i: number) => (
                                                            <div className="mb-4" key={"mout" + i}>
                                                                <h6 >{toADK(inp.Value)} ADK</h6>
                                                                <p className='text-light-green font-size'>{inp.Address}</p>
                                                                {
                                                                    inp.Addresses.map((a: string, ii: number) => (
                                                                        <h6 key={"mout" + i + "-" + ii}>{a}</h6>
                                                                    ))
                                                                }
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default PopupTx;