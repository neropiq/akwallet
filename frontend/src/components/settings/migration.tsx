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

import "bootstrap"
import $ from 'jquery';
import * as React from 'react';
import { connect } from 'react-redux';
import { toast } from "react-toastify";
import { Dispatch } from 'redux';
import * as actions from '../../actions/settingsAction';
import { IStoreState } from '../../reducers';
import { claim, getOldbalance, IOldAmount } from '../../utils/remote';


interface IPopMigraction {
    chackedMigractionPopup: boolean
}

interface IProps {
    connected: boolean;
    Migration_popup: boolean,
    setMigrationPopUp: ({ chackedMigractionPopup }: IPopMigraction) => void
}

interface IStates {
    seed: string;
    amount: number;
}

class Migration extends React.Component<IProps, IStates> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            amount: 0,
            seed: "",
        }
    }

    public render() {
        return (
            <div className="" id="tab-3" role="tabpanel" aria-labelledby="tab3">
                <label className="note">To migrate your ADK in your old wallet to new one, please fill in your old seed and push CLAIM button.</label>
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                        <div className="send-adk-form">
                            <div className="form-group">
                                <input type="text" onChange={this.handleChange} className="form-control" name="comment" placeholder="Seed of your old wallet" />
                            </div>
                            <div className="form-group mt-md-5">
                                <a className="btn btn-send btn-primary" onClick={this.handlePrepare} id="toggleModal">Claim</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade c-t-modal" id="migraction">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <span className="modal-title">Claim Migration</span>
                                <button type="button" className="close" data-dismiss="modal">×</button>
                            </div>
                            <div className="modal-body">
                                <p className="text-intro">
                                    Make sure that your ADK amount  is <br />
                                    {this.state.amount} ADK<br /> <br />
                                    If everything is OK, procceed to migrate.
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-cancel btn-secondary mr-2" data-dismiss="modal">Cancel</button>
                                <button className="btn btn-send btn-primary btn-sm" data-dismiss="modal" onClick={this.handleClaim}>Ok</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            seed: e.currentTarget.value
        })
    }
    private handleClaim = (e: React.MouseEvent<HTMLButtonElement>) => {
        claim(this.props.connected, {
            Amount: this.state.amount,
            Seed: this.state.seed,
        }, (err: string) => {
            if (err) {
                toast.error(err, {
                    autoClose: false,
                    position: toast.POSITION.TOP_CENTER
                });
                return
            }
            toast.success("Claimed successfully", {
                autoClose: 1500,
                position: toast.POSITION.TOP_RIGHT
            });
        })
    }

    private handlePrepare = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (this.state.seed.length !== 81) {
            toast.error("invalid seed length", {
                autoClose: 3000,
                position: toast.POSITION.TOP_CENTER
            });
            return
        }
        for (const c of this.state.seed) {
            if (!(c === '9' || ('A' <= c && c <= 'Z'))) {
                toast.error("invalid character in seed " + c, {
                    autoClose: 3000,
                    position: toast.POSITION.TOP_CENTER
                });
                return
            }
        }
        getOldbalance(this.props.connected, this.state.seed, (amt: IOldAmount) => {
            if (amt.Error) {
                toast.error(amt.Error, {
                    autoClose: false,
                    position: toast.POSITION.TOP_CENTER
                });
                return
            }
            if (amt.Amount === 0) {
                toast.error("Amount of this seed is 0", {
                    autoClose: 3000,
                    position: toast.POSITION.TOP_CENTER
                });
                return
            }
            this.setState({
                amount: amt.Amount,
            })
            $("#migraction").modal()
        })
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setMigrationPopUp: ({ chackedMigractionPopup }: IPopMigraction) => dispatch(actions.setMigrationPopUp({ chackedMigractionPopup })),
    }
}
const mapStateToProps = (state: IStoreState) => {
    const { Migration_popup } = state.setting;
    return { Migration_popup };
}

export default connect(mapStateToProps, mapDispatchToProps)(Migration);