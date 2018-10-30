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
import * as actions from '../../actions/signupAction';
import '../../assets/css/animate.css';
import '../../assets/css/bootstrap.min.css'
import '../../assets/css/login.css';
import { IStoreState } from '../../reducers';
import { nets } from '../../utils/remote';

interface IshowLoginProps {
    showLogin: boolean;
}

interface Iprops {
    login: boolean;
    testnet: number;
    showLogin: ({ showLogin }: IshowLoginProps) => void
}

class AuthHeader extends React.Component<Iprops> {
    public render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col wow fadeInDown">
                        <nav className="navbar navbar-light">
                            <a href='/login' className="navbar-brand">
                                <img src={require('../../assets/images/logo-icon.png')} className="img-fluid" alt="logo" />
                                <span className="brand-name">
                                {this.props.testnet===0 ? "AIDOS WALLET" : (nets[this.props.testnet])}
                                </span>
                            </a>
                            <div>
                                <button
                                    className="btn btn-lg btn-outline-light btn-white-outline"
                                    onClick={this.onClickButton}
                                >
                                    {this.props.login ? 'Signup' : 'Login'}

                                </button>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        );
    }
    private onClickButton = () => {
        this.props.showLogin({ showLogin: !this.props.login });
    }
}
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        showLogin: ({ showLogin }: IshowLoginProps) => dispatch(actions.showLogin({ showLogin })),
    }
}
const mapStateToProps = (state: IStoreState) => {
    const { login } = state.login;
    const {Testnet:testnet} = state.config;
    return { login, testnet};
}


export default connect(mapStateToProps, mapDispatchToProps)(AuthHeader);