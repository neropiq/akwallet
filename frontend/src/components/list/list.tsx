import * as  React from 'react';
import { State } from '../../reducers';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import * as actions from '../../actions/popupAction';
var QRCode = require('qrcode.react');

interface showPopupProps {
    showPopup: boolean
}

interface popupValueProps {
    popupvalue: string
}

interface props {    
    tables: any;
    titleList:any;    
    popup:boolean;
    showPopup : ({ showPopup }: showPopupProps) => void;
    popupValue: ({popupvalue}:popupValueProps) => void;
}
interface state {
    alert:false
} 


class List extends React.Component<props> {
    openPopupbox = (value :any) =>{
        
        this.props.popupValue({ popupvalue: value });
        this.props.showPopup({ showPopup: !this.props.popup });
        
    }
    copyText(value:any){
        var input = document.createElement('input');
        input.setAttribute('value', value);
        document.body.appendChild(input);
        input.select();
        var result = document.execCommand('copy');
        document.body.removeChild(input);
        toast.success("Address copy!", {
            position: toast.POSITION.TOP_RIGHT
        });  
    }
    render() {
        return(
            <div className="card-body px-4 py-0">
                <div className="table-responsive custom-table-theme list-address">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                {
                                    this.props.titleList.map((field: string, index: number) => <th scope="col" key={index}>{field}</th>)
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.tables.map((rows: any, index: number) => (
                                    <tr key={index}>
                                        <td key={index} ><QRCode value="ajksdfhjhasdfjahdfjhasdfh" size={60} data-toggle="modal" data-target="#myModal123" onClick={ () =>this.openPopupbox(rows.value1)}  /></td>
                                        
                                        {/* <td key={index}><img src={rows.imgList} alt="qr-code" /></td> */}
                                        <td className="list-set" title={rows.value1} onClick={() => this.copyText(rows.value1)}><span>{rows.value1}</span></td>
                                        <td >{rows.value2}</td>
                                        <td>{rows.value3}</td>
                                        {/* {
                                            rows.map((row: any, index: number) => {
                                                if(index === 0) {
                                                    return <td key={index}><img src={require('../../assets/images/qr-code-list-icon.png')} alt="qr-code" /></td>
                                                }
                                                return <td key={index}>{row}</td>
                                            })
                                        } */}
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
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

export default  connect(mapStateToProps,mapDispatchToProps)(List);