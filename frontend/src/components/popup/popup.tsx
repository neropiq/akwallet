import * as  React from 'react';

interface Props {
    textvalue:string;
    onclosepopup?: () => void;    
}
class Popup extends React.Component<Props> {
    componentDidMount(){
        window.onclick = function(event){
            
            
        }
    }
    render() {
        return(
            <div className="popup  c-t-modal qr-code-modal"  >
                <div className="modal-dialog">
                    <div className="modal-content">                    
                        <div className="modal-header">
                            <span className="modal-title">You have a new Notification</span>
                            <button type="button" className="close" onClick={() => this.props.onclosepopup()} >×</button>
                        </div>                        
                        <div className="modal-body text-center">
                            <p>{this.props.textvalue}</p>
                        </div>
                        
                    </div>
                </div>
            </div>
            
        );
    }
}

export default  Popup;