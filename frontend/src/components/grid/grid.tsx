import * as  React from 'react';
import { State } from '../../reducers';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../../actions/popupAction';
var QRCode = require('qrcode.react');

interface showPopupProps {
    showPopup: boolean
}

interface popupValueProps {
    popupvalue: string
}

interface Props {
    address: any;
    popup:boolean;
    showPopup : ({ showPopup }: showPopupProps) => void;
    popupValue: ({popupvalue}:popupValueProps) => void;
}
interface state {
    alert:false
} 
class Gride extends React.Component<Props,state> {
    componentDidMount(){
        
       
    }
    openPopupbox = (value :any) =>{
       
        this.props.popupValue({ popupvalue: value });
        this.props.showPopup({ showPopup: !this.props.popup });
       
        
    }
    render() {
        return( 
            // <Popup />
            <div className="row">
                
                {
                    this.props.address.map((rows: any, index: number) => (
                        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 qr-code-address" key={index}>
                            <div className="row">
                                <div className="col-lg-4 col-md-4 col-sm-3 col-4">
                                    {/* <img src={require('../../assets/images/qr-code-big.png')} alt="qr-code" /> */}
                                    <QRCode value={rows.value1} size={80} level="M" data-toggle="modal" data-target="#myModal123" onClick={ () =>this.openPopupbox(rows.value1)} />
                                </div>
                                <div className="col-lg-8 col-md-8 col-sm-9 col-8 address-qr-details align-self-center align-content-center">
                                    <p>{rows.value1}</p>
                                    <p>{rows.value2}</p>
                                    <p>{rows.value3}</p>
                                </div>
                            </div>                    
                        </div>
                    ))
                }
               
            </div>
            

        );
    }
}
const mapDispatchToProps = (dispatch:Dispatch) => {
    return {
        showPopup: ({ showPopup }: showPopupProps) => dispatch(actions.showPopup({showPopup})),
        popupValue: ({ popupvalue }: popupValueProps) => dispatch(actions.popupValue({popupvalue})),
    }
  }
const  mapStateToProps = (state :State)  => {
    const { popup } = state.popup;
    return { popup }; 
}

export default connect(mapStateToProps,mapDispatchToProps)(Gride) ;