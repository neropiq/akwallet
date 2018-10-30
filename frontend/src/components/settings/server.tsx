import * as React from 'react';

class Server extends React.Component {
    
    render() {
        return(
            <div className=" " id="tab-2" role="tabpanel" aria-labelledby="tab2">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                        <form className="send-adk-form">
                            <div className="form-group">
                                <input type="text" className="form-control" name="comment" placeholder="Server 1" />
                            </div>

                            <div className="form-group">
                                <input type="text" className="form-control" name="comment" placeholder="Server 2" />
                            </div>

                            <div className="form-group">
                                <input type="text" className="form-control" name="comment" placeholder="Server 3" />
                            </div>

                            <div className="form-group">
                                <input type="text" className="form-control" name="comment" placeholder="Server 4" />
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-control" name="comment" placeholder="Server 5" />
                            </div>

                            <div className="form-group mt-md-5">
                                <button className="btn btn-cancel btn-secondary mr-2">Cancel</button>
                                <button className="btn btn-send btn-primary">Send</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Server;