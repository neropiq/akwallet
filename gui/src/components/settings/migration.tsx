import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { State } from '../../reducers';
import * as actions from '../../actions/settingsAction';

interface PopMigraction{
    chackedMigractionPopup:boolean
}

interface props{
    Migration_popup:boolean,
    setMigrationPopUp:({chackedMigractionPopup}:PopMigraction) => void
}

class Migration extends React.Component <props> {
    componentWillMount(){
        
    }
    render() {
        return(
            <div className="" id="tab-3" role="tabpanel" aria-labelledby="tab3">
                <label className="note">To migrate your ADK in your old wallet to new one, please fill in your old seed and push CLAIM button.</label>
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                        <form className="send-adk-form">
                            <div className="form-group">
                                <input type="text" className="form-control" name="comment" placeholder="Seed of your old wallet" />
                            </div>
                            <div className="form-group mt-md-5">
                                <button className="btn btn-cancel btn-secondary mr-2">Cancel</button>
                                <a className="btn btn-send btn-primary" data-toggle="modal" data-target="#migraction">Claim</a>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="modal fade c-t-modal" id="migraction">
                    <div className="modal-dialog">
                        <div className="modal-content">                    
                            <div className="modal-header">
                                <span className="modal-title">Demo</span>
                                <button type="button" className="close" data-dismiss="modal">×</button>
                            </div>                        
                            <div className="modal-body">
                                <p className="text-intro">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit.</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-send btn-primary btn-sm" data-dismiss="modal">Ok</button>
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
        setMigrationPopUp: ({chackedMigractionPopup}:PopMigraction) =>  dispatch(actions.setMigrationPopUp({chackedMigractionPopup})),
    }
}
const  mapStateToProps = (state :State)  => {
    const { Migration_popup} = state.setting;
    return {Migration_popup }; 
}

export default connect(mapStateToProps,mapDispatchToProps)(Migration);