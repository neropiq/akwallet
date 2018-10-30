import * as React from 'react';
import '../../assets/css/bootstrap.min.css'
import '../../assets/css/animate.css';
import '../../assets/css/login.css';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { State } from '../../reducers';
import * as actions from '../../actions/loginAction';

interface showLoginProps {
    showLogin: boolean
}

interface props {
    login:boolean;
    showLogin : ({ showLogin }: showLoginProps) => void
}

class AuthHeader extends React.Component<props> {

    onClickButton = () => {
        this.props.showLogin({ showLogin: !this.props.login });    
    }
    public render() {
     
      return (
        <div className="container">
            <div className="row">
                <div className="col wow fadeInDown">
                    <nav className="navbar navbar-light">
                        <a href='/login' className="navbar-brand">
                            <img  src ={require('../../assets/images/logo-icon.png')} className="img-fluid" alt="logo" />
                            <span className="brand-name">AIDOS WALLET</span>
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
  }
const mapDispatchToProps = (dispatch:Dispatch) => {
    return {
        showLogin: ({ showLogin }: showLoginProps) => dispatch(actions.showLogin({showLogin})),
    }
}
const  mapStateToProps = (state :State)  => {
    const { login } = state.login;
    return { login }; 
}
  

export default  connect(mapStateToProps,mapDispatchToProps)(AuthHeader);