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
import * as actions from '../../actions/loginAction';
import TermText from '../../constants';
import { IStoreState } from '../../reducers';
import { allPrivkeys, Iprivatekeys, login } from '../../utils/remote';

interface IProps {
    islogin: boolean;
    connected: boolean;
    privkeys: string[];
    onLogin: () => void,
    updatePrivkeys: (privkeys: string[]) => void,
    setAuths: (auth: boolean) => void,
}

interface IStates {
    password: string,
    privatekey: string,
}

class Login extends React.Component<IProps, IStates> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            password: '',
            privatekey: '',
        }
    }

    public componentDidMount() {
        allPrivkeys(this.props.connected, (p: Iprivatekeys) => {
            if (p.Error) {
                toast.error(p.Error, {
                    autoClose: false,
                    position: toast.POSITION.TOP_CENTER
                });
                return
            }
            this.props.updatePrivkeys(p.PKs)
        })
        return
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
                        <input type="text" className="form-control custom-control w-80" name="Private Key" id="privatekey"
                            onChange={this.handleChange} placeholder="Private Key" list="pks" />
                        <datalist id="pks">
                            {
                                this.props.privkeys && this.props.privkeys.map((p: string, index: number) =>
                                    <option key={index} value={p} />
                                )
                            }
                        </datalist>
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control custom-control w-80" name="Password" id="password"
                            onChange={this.handleChange} placeholder="Password" />
                    </div>
                    <div className="form-group">
                        <div className="form-group">
                            <label className="check-md text-white" data-toggle="modal" data-target="#myModal">
                                You need to accept the <a href="#" className="tNc">terms &amp; conditions</a> for using this application.
                            </label>
                        </div>
                        {/* <button type="button" className="btn btn-primary mybtn " data-toggle="modal" data-target="#myModal">
                    Click Me !
                </button>  */}
                    </div>
                </div>
                <div className="modal fade c-t-modal" id="myModal">
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
                                <button className="btn btn-send btn-primary btn-sm" data-dismiss="modal">Ok</button>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-lg btn-outline-light btn-light-white btn-light-white-hover mt-3" onClick={this.handleFormSubmit}>login</button>
            </div>
        );
    }

    private handleFormSubmit = (e: any) => {
        e.preventDefault();
        login(this.props.connected, { PrivKey: this.state.privatekey, Password: this.state.password }, (err: string) => {
            if (err) {
                toast.error("Failed to login: " + err, {
                    autoClose: 1500,
                    hideProgressBar: true,
                    position: toast.POSITION.TOP_CENTER
                });
                return
            }
            this.props.onLogin();
            this.props.setAuths(true)
        })
    }
    private handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        switch (e.currentTarget.id) {
            case "privatekey":
                this.setState({
                    privatekey: e.currentTarget.value
                })
                break
            case "password":
                this.setState({
                    password: e.currentTarget.value
                })
                break
        }
    }
}
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setAuths: (auth: boolean) => dispatch(actions.setAuths({ value: auth })),
        updatePrivkeys: (pks: string[]) => dispatch(actions.updatePrivkeys(pks)),
    }
}
const mapStateToProps = (state: IStoreState) => {
    const { login: islogin, privkeys } = state.login;
    return { islogin, connected: state.connected, privkeys };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);