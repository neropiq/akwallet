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
import * as actions from '../../actions/signupAction';
import TermText from '../../constants';
import { IStoreState } from '../../reducers';
import { Iaddress, register } from '../../utils/remote';

interface IshowLoginProps {
    showLogin: boolean
}
interface IshowSignupTerms {
    chackedSignupTerms: boolean
}

interface IProps {
    login: boolean;
    connected: boolean;
    isSignupTerms: boolean;
    showLogin: ({ showLogin }: IshowLoginProps) => void,
    setCheckSignupTerms: ({ chackedSignupTerms }: IshowSignupTerms) => void
}

interface IStates {
    password: string;
    privatekey: string;
}



class Signup extends React.Component<IProps, IStates> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            password: '',
            privatekey: ''
        }
    }

    public render() {
        return (
            <div className="col-lg-6 col-md-6 col-sm-12 order-set-form wow fadeInLeft">
                <div className="welcome-title">
                    <h4>Welcome to</h4>
                    <h1>AIDOS KUNEEN!</h1>
                </div>
                <div className="aidos-kuneen-form">
                    <div className="form-group">
                        <input type="password" className="form-control custom-control w-80" name="Password"
                            placeholder="Password" onChange={this.handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="check-md text-white" data-toggle="modal" data-target="#myModal1">
                            I accept the <a href='#' className="tNc">terms &amp; conditions</a> of use of this application.
                        <input type="checkbox" checked={this.props.isSignupTerms} onChange={this.onCheckTerm} />
                            <span className="checkmark-md" />
                        </label>
                    </div>
                </div>
                <div className="modal fade c-t-modal" id="myModal1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <span className="modal-title">Term & Conditions</span>
                                <button type="button" className="close" data-dismiss="modal">×</button>
                            </div>
                            <div className="modal-body">
                                <TermText />
                            </div>
                            <div className="modal-footer">
                                {/* <button className="btn btn-danger" data-dismiss="modal">Cancle</button> */}
                                <button className="btn btn-send btn-primary btn-sm" onClick={this.signupTerms} data-dismiss="modal">Ok</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade c-t-modal" id="myModal2">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <span className="modal-title">Your PrivateKey</span>
                                <button type="button" className="close" data-dismiss="modal">×</button>
                            </div>
                            <div className="modal-body">
                                <p>Your PrivateKey is:</p>
                                <p style={{ wordBreak: "break-all" }}>{this.state.privatekey}</p>
                                <br />
                                <p>
                                    The PrivateKey can be seen like a password that is used to access your account, and therefore grant access to your Aidos coins.
                                    Never share your PrivateKey with anyone and store it safely,
                                    because if you lose your PrivateKey you lose access to your Aidos coins.
                                </p>
                                <p>
                                    <em>このプライベートキーと入力したパスワードは忘れないでください。忘れるとADKにアクセスできなくなります。
                                また絶対に他人に見せないでください。</em>
                                </p>
                            </div>
                            <div className="modal-footer">
                                {/* <button className="btn btn-danger" data-dismiss="modal">Cancle</button> */}
                                <button className="btn btn-send btn-primary btn-sm" onClick={this.clickModal} data-dismiss="modal">Ok</button>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-lg btn-outline-light btn-light-white btn-light-white-hover mt-3" disabled={!this.props.isSignupTerms} data-toggle="modal" data-target="#myModal2"
                    onClick={this.clickSignup} >Signup</button>
            </div>
        );
    }

    // dummy but needed
    private onCheckTerm = () => {
        return
    }

    private signupTerms = () => {
        this.props.setCheckSignupTerms({ chackedSignupTerms: true });
    }
    private clickSignup = () => {
        register(this.props.connected, this.state.password, (adr: Iaddress) => {
            if (adr.Error) {
                toast.error(adr.Error, {
                    autoClose: false,
                    position: toast.POSITION.TOP_CENTER
                });
                return
            }
            this.setState({
                privatekey: adr.Address
            })
        })
    }
    private clickModal = () => {
        this.props.showLogin({ showLogin: true })
    }
    private handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            password: e.currentTarget.value
        })
    }
}
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setCheckSignupTerms: ({ chackedSignupTerms }: IshowSignupTerms) => dispatch(actions.setCheckSignupTerms({ chackedSignupTerms })),
        showLogin: ({ showLogin }: IshowLoginProps) => dispatch(actions.showLogin({ showLogin })),
    }
}
const mapStateToProps = (state: IStoreState) => {
    const { isSignupTerms } = state.signup;
    const { login } = state.login;
    return { isSignupTerms, login, connected: state.connected, };
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);