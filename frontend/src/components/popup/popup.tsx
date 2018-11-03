import * as  React from 'react';
import Scrollbar from 'smooth-scrollbar';
interface Props {
    PopUpvalue:any;
    onclosepopup?: () => void;    
}
class Popup extends React.Component<Props> {   
    componentDidMount(){
        // window.onclick = function(){   
        //     this.props.onclosepopup();     
        // }                
        Scrollbar.init(document.querySelector('#popupscrollecard1'));
        Scrollbar.init(document.querySelector('#popupscrollecard2'));        
    }
    render() {
        return(
            <div  className="c-popup-modal popup c-t-modal qr-code-modal">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">                    
                        <div className="modal-header">
                            <span className="modal-title">Transaction</span>
                            <button type="button" className="close" onClick={() => this.props.onclosepopup()} >×</button>
                        </div>                        
                        <div  className="modal-body py-4" >
                            {/* <p>{this.props.textvalue}</p> */}
                            <div className="row position-relative">
                                <div className="col-md-6" >
                                    <div className="card bg-dark-green mb-4 mb-md-0 black-shadow">
                                        <div className="card-header">
                                            <div className="card-name">1 INPUT CONSUMED</div>
                                        </div>
                                        <div id="popupscrollecard1" className="card-body">
                                            <div className="mb-4">
                                                <h6>{this.props.PopUpvalue.input.value1} ADK</h6>
                                                <p className='text-light-green font-size'>{this.props.PopUpvalue.input.data}</p>
                                            </div>
                                            <div>
                                                <h6 className="card-name mb-3 text-uppercase">MULTISIG INPUTS</h6>  
                                                <h6>{this.props.PopUpvalue.input.value1} ADK</h6>
                                                <p className='text-light-green font-size'>{this.props.PopUpvalue.input.data}</p>
                                            </div>                                         
                                        </div>
                                    </div>
                                </div>
                                <div className="share-add d-none d-md-block">
                                    <img src={require('../../assets/images/share-icon-arrrow.png')} width="25" alt=""/>
                                </div>
                                <div className="col-md-6" >
                                    <div className="card bg-dark-green black-shadow">
                                        <div className="card-header">
                                            <div className="card-name">2 OUTPUT CREATED</div>
                                        </div>
                                        <div id="popupscrollecard2" className="card-body c-body-height">
                                            <div className="mb-4">
                                                <h6>{this.props.PopUpvalue.output.value1} ADK</h6>
                                                <p className='text-light-green font-size'>{this.props.PopUpvalue.output.data}</p>
                                            </div>

                                            <div className="mb-4">
                                                <h6>{this.props.PopUpvalue.output.value1} ADK</h6>
                                                <p className='text-light-green font-size'>{this.props.PopUpvalue.output.data}</p>
                                            </div>

                                            <div>
                                                <h6 className="card-name mb-3 text-uppercase">MULTISIG OUTPUTS</h6>  
                                                <h6>{this.props.PopUpvalue.output.value1} ADK</h6>
                                                <p className='text-light-green font-size'>{this.props.PopUpvalue.output.data}</p>
                                                <p className='text-light-green font-size'>{this.props.PopUpvalue.output.data}</p>
                                                <p className='text-light-green font-size'>{this.props.PopUpvalue.output.data}</p>
                                                <p className='text-light-green font-size'>{this.props.PopUpvalue.output.data}</p>                                                
                                            </div>                                              
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>
            
        );
    }
}

export default  Popup;