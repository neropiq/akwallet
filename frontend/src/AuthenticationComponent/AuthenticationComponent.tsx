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
import { IStoreState } from '../reducers';
import AuthHeader from './header/header';
import Login from './login/login';
import Signup from './signup/signup';
import { ToastContainer } from 'react-toastify';

interface IProps {
  login: boolean,
  history: any,
  setAuths: any,
  isLoginTerms: boolean
}

class Authentication extends React.Component<IProps, {}> {
  public componentDidMount() {
    document.getElementById('body').className = 'login-body';
  }

  public componentWillUnmount() {
    document.getElementById('body').className = ''
  }

  public render() {
    return (
      // className = 'login-body'
      <div >
        <ToastContainer />
        <header className="login-header">
          <AuthHeader />
        </header>
        <div className="main-section-content">
          <div className="container">
            <div className="row login-content">

              {this.props.login ? <Login onLogin={this.login} /> : <Signup />}
              <div className="col-lg-6 col-md-6 col-sm-12 order-set-image wow fadeInRight">
                <img src={require("../assets/images/aidos-wallet-login.png")} width="400" className="img-fluid d-block m-auto wallet-img" alt="wallet-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private login = () => {
    // this.props.setAuths({ value: true });
    // if(this.props.isLoginTerms == true){
    this.props.history.push('/dashboard');
    // }
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {

  }
}
const mapStateToProps = (state: IStoreState) => {
  const { login, isAuthenticated } = state.login;
  return { login, isAuthenticated }
}


export default connect(mapStateToProps)(Authentication);