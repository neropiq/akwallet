import * as React from 'react';
import * as actions from '../../actions';
import { State } from '../../reducers';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import SubHeader from '../subheader/subheader';
import TableHeader from '../tableheader/tableheader';
import Form from '../form/form';
import Table from '../table/table';
var tables = require('./table.json');
import Scrollbar from 'smooth-scrollbar';

interface changeLoadingProps {
    value: boolean
}

export interface Props {
    loading: boolean;
    changeLoading: ({ value }: changeLoadingProps) => void;
}

class SendAdk extends React.Component<Props> {
    componentDidMount() {
        document.title = "Dashboard || Aidos Wallet";
        // Scrollbar.initAll();
        Scrollbar.init(document.querySelector('#scrolle'));
        Scrollbar.init(document.querySelector('#scrolleTable'));
    }

    submit = (values: any) => {
    // print the form values to the console
        console.log(values);
        this.props.changeLoading({ value: !this.props.loading });
        setTimeout(() => {
            this.props.changeLoading({ value: !this.props.loading });
        }, 5000);
    }

    render() {
        // console.log(this.props);
        return (
            <div className="page-content-wrapper">
                <div className="page-content">
                    <SubHeader title="Send ADK" />
                    <div className="row send-adk-cards">
                        <div className="col-md-12 col-lg-5">
                            <div id="scrolle" className="card-height card bg-dark-green black-shadow mb-4 mb-lg-0 send-adk-form-card mCustomScrollbar" data-mcs-theme="dark">
                                <div className="cad-form-content">
                                    <TableHeader header="Send ADK" />
                                    <div className="card-body">
                                        <Form onSubmit={this.submit} loading={this.props.loading}/>
                                    </div>
                                </div>
                            </div> 
                        </div>
                        <div className="col-md-12 col-lg-7">
                            <div id="scrolleTable" className="card-height card bg-dark-green black-shadow  send-adk-table-card" data-mcs-theme="dark">
                                <div className="cad-table-content">                                   
                                    <TableHeader header={tables.header} />
                                    <Table componentsName={'sendAdk'} tables={tables} />                                   
                                </div> 
                            </div>
                        </div>
                    </div>    
                </div>
            </div>
        );
    }
}


export const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
      changeLoading: ({ value }: changeLoadingProps) => dispatch(actions.changeLoading({ value })),
    }
  }
  
  
  export const mapStateToProps = (state: State) => {
      const { loading } = state.sendAdk;
      return { loading };
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(SendAdk);
