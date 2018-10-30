import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { State } from '../../reducers';
import * as actions from '../../actions/loginAction';

interface showLoginProps {
    showLogin: boolean
}
interface showSignupTerms {
    chackedSignupTerms:boolean
}

interface props {
    login:boolean;
    isSignupTerms:boolean;
    showLogin : ({ showLogin }: showLoginProps) => void,
    setCheckSignupTerms:({chackedSignupTerms}:showSignupTerms) => void
}

class Signup extends React.Component<props , {}> {
    signupTerms = () => {
        this.props.setCheckSignupTerms({ chackedSignupTerms: !this.props.isSignupTerms });
        this.props.showLogin({ showLogin: !this.props.login })
    }
    clickSignup(){
        if(this.props.isSignupTerms){
            this.props.showLogin({ showLogin: !this.props.login })
        }
    }
  public render() {    
    return (
        <div className="col-lg-6 col-md-6 col-sm-12 order-set-form wow fadeInLeft">
            <div className="welcome-title">
                <h4>Welcome to</h4>
                <h1>AIDOS KUNEEN!</h1>
            </div>
            <form className="aidos-kuneen-form">
                <div className="form-group">
                    <input type="text" className="form-control custom-control w-80" name="First Name" placeholder="First Name" />
                </div>
                <div className="form-group">
                    <input type="text" className="form-control custom-control w-80" name="Last Name" placeholder="Last Name" />
                </div>
                <div className="form-group">
                    <input type="email" className="form-control custom-control w-80" name="Email Id" placeholder="Email" />
                </div>
                <div className="form-group">
                    <label className="check-md text-white" data-toggle="modal" data-target="#myModal1">I accept the <a href='/login' className="tNc">terms &amp; conditions</a> of use of this site.
                        <input type="checkbox" checked={this.props.isSignupTerms} onChange={()=>{}} />
                        <span className="checkmark-md"></span>
                    </label>
                </div>
            </form>
            <div className="modal fade c-t-modal" id="myModal1">
                <div className="modal-dialog">
                    <div className="modal-content">                    
                        <div className="modal-header">
                            <span className="modal-title">Term & Conditions</span>
                            <button type="button" className="close" data-dismiss="modal">×</button>
                        </div>                        
                        <div className="modal-body">
                            <p className="text-intro">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit.</p>
                        </div>
                        <div className="modal-footer">
                            {/* <button className="btn btn-danger" data-dismiss="modal">Cancle</button> */}
                            <button className="btn btn-send btn-primary btn-sm" onClick={this.signupTerms} data-dismiss="modal">Ok</button>
                        </div>
                    </div>
                </div>
            </div>
            <button type="submit"  className="btn btn-lg btn-outline-light btn-light-white btn-light-white-hover mt-3" data-toggle="modal" data-target="#myModal1" onClick={this.clickSignup}>Signup</button>
        </div>     
    );
  }
}
const mapDispatchToProps = (dispatch:Dispatch) => {
    return {
        showLogin: ({ showLogin }: showLoginProps) => dispatch(actions.showLogin({showLogin})),
        setCheckSignupTerms:({chackedSignupTerms}:showSignupTerms) => dispatch(actions.setCheckSignupTerms({chackedSignupTerms}))
    }
}
const  mapStateToProps = (state :State)  => {
    const { login , isSignupTerms } = state.login;
    return { login , isSignupTerms}; 
}

export default connect(mapStateToProps,mapDispatchToProps)(Signup);