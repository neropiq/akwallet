import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { State } from '../../reducers';
import * as actions from '../../actions/loginAction';

interface loginTermsCheck{
    chackedLoginTerms:boolean
}

interface Props {
    login:boolean;
    isLoginTerms:boolean;
    onLogin:() => void,
    setCheckLoginTerms:({chackedLoginTerms}:loginTermsCheck) => void
}



class Login extends React.Component<Props> {
    handleFormSubmit(e :any){
        e.preventDefault();
        this.props.onLogin();
    }
    termsChecked = () => {
        this.props.setCheckLoginTerms({ chackedLoginTerms: !this.props.isLoginTerms });
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
                    <input type="text" className="form-control custom-control w-80" name="Private Key" placeholder="Private Key" />
                </div>
                <div className="form-group">
                    <input type="password" className="form-control custom-control w-80" name="Password" placeholder="Password" />
                </div>
                <div className="form-group">
                <div className="form-group">
                    <label className="check-md text-white"  data-toggle="modal" data-target="#myModal">I accept the <a href='/login' className="tNc">terms &amp; conditions</a> of use of this site.
                        <input type="checkbox" checked={this.props.isLoginTerms} onChange={()=>{}} />
                        <span className="checkmark-md"></span>
                    </label>
                </div>
                {/* <button type="button" className="btn btn-primary mybtn " data-toggle="modal" data-target="#myModal">
                    Click Me !
                </button>  */}
                </div>
            </form>           
            <div className="modal fade c-t-modal" id="myModal">
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
                            <button className="btn btn-send btn-primary btn-sm" onClick={this.termsChecked} data-dismiss="modal">Ok</button>
                        </div>
                    </div>
                </div>
            </div>
            <button type="submit" className="btn btn-lg btn-outline-light btn-light-white btn-light-white-hover mt-3" disabled={!this.props.isLoginTerms}  onClick={this.handleFormSubmit.bind(this)}>login</button>
        </div>      
    );
  }
}
const mapDispatchToProps = (dispatch:Dispatch) => {
    return {
        setCheckLoginTerms: ({chackedLoginTerms}:loginTermsCheck) =>  dispatch(actions.setCheckLoginTerms({chackedLoginTerms})),
    }
  }
const  mapStateToProps = (state :State)  => {
    const { login, isAuthenticated , isLoginTerms} = state.login;
    return { login, isAuthenticated , isLoginTerms}; 
}

export default  connect(mapStateToProps,mapDispatchToProps)(Login);