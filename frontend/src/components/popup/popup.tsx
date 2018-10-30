import * as  React from 'react';
import { State } from '../../reducers';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
var QRCode = require('qrcode.react');
import * as actions from '../../actions/popupAction';

interface showPopupProps {
    showPopup: boolean
}

interface Props {    
    popup:boolean;
    showPopup : ({ showPopup }: showPopupProps) => void
}

class Popup extends React.Component<Props> {
   
    componentDidMount(){
       
        var modal = document.getElementById('myModal123')
        modal.style.display = "block padding-right: 15px";       
        document.getElementById('myModal123').className = 'z-index: 1050;display: block;overflow: hidden;outline: 0; position: fixed; top: 0;right: 0;bottom: 0;left: 0;';
  
    }
    closePopup= () =>{
        console.log('close');
        // console.log(this.props.popup);
        this.props.showPopup({ showPopup: !this.props.popup });
    }
    render() {
        return(
            <div >
                {/* <div ></div> */}
                <div className="modal fade c-t-modal show"  id="myModal123">
                    <div className="modal-dialog">
                        <div className="modal-content">                    
                            <div className="modal-header">
                                <span className="modal-title">Demo</span>
                                <button type="button" className="close" data-dismiss="modal" onClick={this.closePopup}>×</button>
                            </div>                        
                            <div className="modal-body">
                            <QRCode value="ajksdfhjhasdfjahdfjhasdfh" size={130} level="M"  />
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
        showPopup: ({ showPopup }: showPopupProps) => dispatch(actions.showPopup({showPopup})),
    }
  }
const  mapStateToProps = (state :State)  => {
    const { popup } = state.popup;
    return { popup }; 
}
export default  connect(mapStateToProps,mapDispatchToProps)(Popup);