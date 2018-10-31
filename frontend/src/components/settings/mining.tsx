import * as React from 'react';

class Mining extends React.Component {
    readonly state = {CoinMining:false,SelfMining:true,TicketMining:false};
    fieldChecked=(event:any) =>{
        
        this.setState({
            [event.target.name]:event.target.checked
        });
       
    }
    render() {
        return(
            <div className=" show active" id="tab-1" role="tabpanel" aria-labelledby="tab1">
                <div className="row mb-2">
                    <div className="col-lg-2 col-md-3 col-sm-3 col-6">
                        <h5 className="mining-title">Self Mining</h5>
                    </div>
                    <div className="col-2">
                        <label className="c-switch">
                            <input type="checkbox"  name="SelfMining" checked={this.state.SelfMining} onChange={this.fieldChecked} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col-lg-2 col-md-3 col-sm-3 col-6">
                        <h5 className="mining-title">Ticket Mining</h5>
                    </div>
                    <div className="col-2">
                        <label className="c-switch">
                            <input type="checkbox" name="TicketMining" checked={this.state.TicketMining} onChange={this.fieldChecked} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col-lg-2 col-md-3 col-sm-3 col-6">
                        <h5 className="mining-title">Coin Mining</h5>
                    </div>
                    <div className="col-2">
                        <label className="c-switch">
                            <input type="checkbox" name="CoinMining" checked={this.state.CoinMining} onChange={this.fieldChecked} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>
                {
                    this.state.CoinMining ?  
                    <div className="send-adk-form">
                        <div className="form-group">
                            <input  type='text' className="form-control" name={name} placeholder='Fees' />
                        </div>
                    </div> : ''   
                }
                
                <div className="form-group mt-md-5">
                    <button className="btn btn-cancel btn-secondary mr-2">Cancel</button>
                    <button className="btn btn-send btn-primary">Send</button>
                </div>
            </div>
        );
    }
}

export default Mining;