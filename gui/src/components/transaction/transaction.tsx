import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { State } from '../../reducers';
import { Dispatch } from 'redux';
import SubHeader from '../subheader/subheader';
import Table from '../table/table';
var tables =  require('./table.json');
import CardTab from '../cardTab/cardTab';
// import './../../assets/css/jquery.mCustomScrollbar.css';
import Scrollbar from 'smooth-scrollbar';

interface changeProps {
    newFilter: any;
    oldFilter: any;
}

interface Props {
    title: string;
    filters: any;
    tab: any;
    changeFilterTransaction: ({ newFilter, oldFilter }: changeProps) => void;
    changeCardTabTransaction: ({ newFilter, oldFilter }: changeProps) => void;
}

class Transactions extends React.Component<Props> {
    // constructor(props) {
    //     super(props);
    //     this.state = {tables: tables};
    // }
    
    componentDidMount() {
        document.title = "Transaction || Aidos Wallet";
        Scrollbar.init(document.querySelector('#scrolle'));
    }

    onFilterChange = (newFilter: any) => {
        this.props.changeFilterTransaction({ newFilter, oldFilter: this.props.filters });
    }

    onCardChange = (newFilter: any) => {
        this.props.changeCardTabTransaction({ newFilter, oldFilter: this.props.tab });
       
    }

    render() {
        
        return (
            <div>
                <div className="page-content-wrapper my-address-page">
                    <div className="page-content">
                        {/*Main Page Content*/}
                        <SubHeader title={this.props.title}  transaction={this.props.filters} onTrancationFilterChange={this.onFilterChange} />
                        <div className="row transactions-card">
                            <div className="col-12">
                                <div id="scrolle" className="card-height card bg-dark-green black-shadow mCustomScrollbar" data-mcs-theme="dark">
                                    <div className="cad-table-content">
                                        <CardTab tab={this.props.tab} onCardChange={this.onCardChange}/>
                                        <Table  tables={tables} />
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
    
export const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        changeFilterTransaction: ({ newFilter, oldFilter }: changeProps) => dispatch(actions.changeFilterTransaction({ newFilter, oldFilter })),
        changeCardTabTransaction: ({ newFilter, oldFilter }: changeProps) => dispatch(actions.changeCardTabTransaction({ newFilter, oldFilter })),
    }
  }
  
  export const mapStateToProps = (state: State) => {
    const { title, filters } = state.transaction.subHeader;
    const { tab } = state.transaction.cardHeaderTab;
    return { title, filters , tab};
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
