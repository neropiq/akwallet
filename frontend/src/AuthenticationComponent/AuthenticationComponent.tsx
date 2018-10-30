import * as React from 'react';
import AuthHeader from './header/header';
import Login from './login/login';
import Signup from './signup/signup';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { State } from '../reducers';

interface props {
  login:boolean,
  history:any,
  setAuths:any,
  isLoginTerms:boolean
}

class Authentication extends React.Component< props , {}> {
  componentWillMount(){
    document.getElementById('body').className = 'login-body';
  }
  
  componentWillUnmount(){
    document.getElementById('body').className=''
  }

  login = () => {
    // this.props.setAuths({ value: true });
    if(this.props.isLoginTerms == true){
        this.props.history.push('/dashboard');
    }
  }

  public render() {    
    return (
      //className = 'login-body'
      <div >
        <header className="login-header">
          <AuthHeader />
        </header>
        <div className="main-section-content">
            <div className="container">
                <div className="row login-content">
                
                { this.props.login  ? <Login onLogin={this.login} /> : <Signup />}  
                    <div className="col-lg-6 col-md-6 col-sm-12 order-set-image wow fadeInRight">
                        <img src={require("../assets/images/aidos-wallet-login.png")} width="400" className="img-fluid d-block m-auto wallet-img" alt="wallet-icon" />
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch:Dispatch) => {
  return {

  }
}
const  mapStateToProps = (state :State)  => {
  const { login, isAuthenticated ,isLoginTerms } = state.login;
  return { login, isAuthenticated, isLoginTerms }; 
}


export default connect(mapStateToProps)(Authentication);