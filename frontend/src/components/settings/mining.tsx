import * as React from 'react';

class Mining extends React.Component {
    
    render() {
        return(
            <div className=" show active" id="tab-1" role="tabpanel" aria-labelledby="tab1">
                <div className="row mb-2">
                    <div className="col-lg-2 col-md-3 col-sm-3 col-6">
                        <h5 className="mining-title">Self Mining</h5>
                    </div>
                    <div className="col-2">
                        <label className="c-switch">
                            <input type="checkbox"  onChange={() => {}} />
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
                            <input type="checkbox" />
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
                            <input type="checkbox" />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>
                <div className="form-group mt-md-5">
                    <button className="btn btn-cancel btn-secondary mr-2">Cancel</button>
                    <button className="btn btn-send btn-primary">Send</button>
                </div>
            </div>
        );
    }
}

export default Mining;