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
import * as actions from '../../actions';
import { IConfigEntity } from '../../model';
import { IStoreState } from '../../reducers';
import { getSettings, IMinerSetting, updateMinerSetting } from '../../utils/remote';

interface IProps {
    connected: boolean;
    minerSetting: IMinerSetting;
    updateConfig: (cfg: IConfigEntity) => void;
}

interface IStates {
    newSetting: IMinerSetting;
    fee: string;
}

class Mining extends React.Component<IProps, IStates> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            fee: "0",
            newSetting: props.minerSetting,
        }
    }
    public componentDidMount() {
        this.revert()
    }
    public render() {
        return (
            <div className=" show active" id="tab-1" role="tabpanel" aria-labelledby="tab1">
                <div className="row mb-2">
                    <div className="col-lg-2 col-md-3 col-sm-3 col-6">
                        <h5 className="mining-title">Issue Tickets</h5>
                    </div>
                    <div className="col-2">
                        <label className="c-switch">
                            <input type="checkbox" name="RunTicketIssuer" onChange={this.fieldChecked} checked={this.state.newSetting.RunTicketIssuer} />
                            <span className="slider round" />
                        </label>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col-lg-2 col-md-3 col-sm-3 col-6">
                        <h5 className="mining-title">Ticket Mining</h5>
                    </div>
                    <div className="col-2">
                        <label className="c-switch">
                            <input type="checkbox" name="RunTicketMiner" onChange={this.fieldChecked} checked={this.state.newSetting.RunTicketMiner} />
                            <span className="slider round" />
                        </label>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col-lg-2 col-md-3 col-sm-3 col-6">
                        <h5 className="mining-title">Fee Mining</h5>
                    </div>
                    <div className="col-2">
                        <label className="c-switch">
                            <input type="checkbox" name="RunFeeMiner" onChange={this.fieldChecked} checked={this.state.newSetting.RunFeeMiner} />
                            <span className="slider round" />
                        </label>
                    </div>
                </div>
                {
                    this.state.newSetting.RunFeeMiner ?
                        <div className="send-adk-form">
                            <div className="form-inline">
                                <input type='text' id="fee" value={this.props.minerSetting.MinimumFee} onChange={this.updateFee} className="form-control" name={name} placeholder='Fees' />ADK
                                <span className="invalid-feedback text-warning">
                                    invalid minimum fee, must be greater than 0
                                    </span>
                            </div>
                        </div> : ''
                }

                <div className="form-group mt-md-5">
                    <button className="btn btn-cancel btn-secondary mr-2" onClick={this.revert}>Revert</button>
                    <button className="btn btn-send btn-primary" onClick={this.handleSave}>Save</button>
                </div>
            </div>
        );
    }
    private updateFee = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            fee: event.currentTarget.value
        })
    }

    private fieldChecked = (event: any) => {
        const stat = { ...this.state.newSetting, [event.target.name]: event.target.checked }
        this.setState({
            newSetting: stat
        })
    }
    private handleSave = () => {
        let fee = 0;
        if (this.state.newSetting.RunFeeMiner) {
            fee = parseInt(this.state.fee, 10)
            if (!fee) {
                $("#fee").addClass("is-invalid")
                return
            }
        }
        updateMinerSetting(this.props.connected, { ...this.state.newSetting, MinimumFee: fee }, (errr: string) => {
            if (errr) {
                toast.error(errr, {
                    autoClose: false,
                    position: toast.POSITION.TOP_CENTER
                });
                return
            }
            toast.success("Saved successfully", {
                position: toast.POSITION.TOP_RIGHT
            });
            getSettings(this.props.connected, (cfg: IConfigEntity) => {
                this.props.updateConfig(cfg)
            })
        })
    }

    private revert = () => {
        this.setState({
            newSetting: this.props.minerSetting,
        })
    }
}

export const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        updateConfig: (cfg: IConfigEntity) => dispatch(actions.updateConfig(cfg)),
    }
}
const mapStateToProps = (state: IStoreState) => {
    const { MinimumFee, RunFeeMiner, RunTicketMiner, RunTicketIssuer } = state.config;
    return {
        minerSetting: {
            MinimumFee, RunFeeMiner, RunTicketIssuer, RunTicketMiner,
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Mining);
