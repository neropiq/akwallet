import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { State } from '../../reducers';
import { Dispatch } from 'redux';
import SubHeader from '../subheader/subheader';
import Grid from '../grid/grid';
import List from '../list/list';
// import { AddressModel } from './addressmodel';
var address = require('./address.json');


import Scrollbar from 'smooth-scrollbar';
// import Popup from '../popup/popup';

var QRCode = require('qrcode.react');

interface changeViewProps {
    newView: any;
    oldView: any;
}

interface changeGridFlagProps {
    value: boolean;
}
interface changeAddressProps {
    addressValue: [];
}

interface Props {
    title: string;
    tables:any[];
    titleList:any;
    views: any;
    addressValue:[];
    showGrid: boolean;
    popup:boolean;
    popup_Value:string;
    changeView: ({ newView, oldView }: changeViewProps) => void;
    changeGridFlag: ({ value }: changeGridFlagProps) => void;
    changeAddressValue: ( address:any ) => void;
    pushAddressValue:(address:any) => void;
}

interface state {
    grideAddress: [];
}

class Address extends React.Component<Props , state> {
    AddressModel:any[] = [] ;
    count =0;
    
    constructor(props: Props){
        super(props);
        this.AddressModel = address.data;       
        this.props.changeAddressValue(address.data);       
    }
    componentWillMount(){
       	
    }
    componentDidMount() {
        document.title = "Address || Aidos Wallet";
        Scrollbar.init(document.querySelector('#scrolle'));
    }

    onViewChange = (newView: any) => {
       
        if(newView == 'Grid' || newView == 'List' ){
            this.props.changeView({ newView, oldView: this.props.views });
            const value = newView === 'Grid' ? true : false;
            this.props.changeGridFlag({ value });
        }else{
            // {
            //     "value1": "AKADRST53rF6mZAS81...",
            //     "value2": "#Avail : 100/1024",
            //     "value3": "Recv: 1.12345678 ADK",
            //     "img": "../../assets/images/qr-code-big.png"
            // },
            var data = {
                "value1": "dami-"+ this.count+" AKADRST81...",
                "value2": "dami#Avail : 100/1024",
                "value3": "Recv: 1.12345678 ADK",
                "img": "../../assets/images/qr-code-big.png",
                "imgList":"../../assets/images/qr-code-list-icon.png"
            }
            this.count = this.count + 1;
            // this.AddressModel.push(data);
            this.props.pushAddressValue(data);
        }
        
    }

    render() {
        
        return (
            <div>
                {/* Model Start  */}
                <div className="modal fade c-t-modal qr-code-modal"  id="myModal123">
                    <div className="modal-dialog">
                        <div className="modal-content">                    
                            <div className="modal-header">
                                <span className="modal-title">Demo</span>
                                <button type="button" className="close" data-dismiss="modal" >×</button>
                            </div>                        
                            <div className="modal-body text-center">
                                <QRCode value={this.props.popup_Value} size={170} level="M"  />
                            </div>
                            
                        </div>
                    </div>
                </div>
                {/* Model End  */}
                <div className="page-content-wrapper my-address-page">
                    <div className="page-content">
                        {/*Main Page Content*/}
                        <SubHeader title={this.props.title}  views={this.props.views} onViewChange={this.onViewChange}/>
                        
                        <div className="row my-address-card">
                            <div className="col">
                                <div id="scrolle" className="card-height card bg-dark-green black-shadow mCustomScrollbar" data-mcs-theme="dark">
                                    <div className="card-content">
                                        {
                                            this.props.showGrid ? 
                                            <div className="card-body p-4">
                                                    <Grid address={this.props.addressValue} />
                                                {/* <div >
                                                </div> */}
                                            </div> :
                                            <List tables={this.props.addressValue} titleList={address.fields} />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-md-none d-block clearfix add-plus-btn">
                    <div className="float-right">
                        <a href="#"><i className="icon-plus"></i></a>
                    </div>
                </div>
               
            </div>
        );
    }
}

export const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        changeView: ({ newView, oldView }: changeViewProps) => dispatch(actions.changeView({ newView, oldView })),
        changeGridFlag: ({ value }: changeGridFlagProps) => dispatch(actions.changeGridFlag({ value })),
        changeAddressValue: ( addressValue:any) => dispatch(actions.changeAddressValue( addressValue )),
        pushAddressValue: ( addressData:any) => dispatch(actions.pushAddressValue( addressData )),
    }
  }
  
export const mapStateToProps = (state: State) => {
    const { title, views } = state.address.subHeader;
    const { showGrid,addressValue } = state.address;
    const { popup,popup_Value } = state.popup;
    return { title, views, showGrid ,popup,popup_Value,addressValue};
}


export default connect(mapStateToProps, mapDispatchToProps)(Address);