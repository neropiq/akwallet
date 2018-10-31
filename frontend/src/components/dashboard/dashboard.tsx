
import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { State } from '../../reducers';
import { Dispatch } from 'redux';
import SubHeader from '../subheader/subheader';
import Card from '../card/card';
import Table from '../table/table';
import TableHeader from '../tableheader/tableheader';
var cards = require('./cards.json');
var tables = require('./tables.json');
var QRCode = require('qrcode.react');
import Scrollbar from 'smooth-scrollbar';
import { ToastContainer, toast } from 'react-toastify';

interface changeFilterProps {
    newFilter: any;
    oldFilter: any;
}

interface changeSelectProps {
    value: boolean;
}

interface Props {
    title: string;
    filters: any;
    notification_count:number;
    changeFilter: ({ newFilter, oldFilter }: changeFilterProps) => void;
    changeSelect: ({ value }: changeSelectProps) => void;
    updateNotificationCount: ( notification_count:number ) => void;
}

class Dashboard extends React.Component<Props> {
    componentDidMount() {
        document.title = "Dashboard || Aidos Wallet";
        Scrollbar.init(document.querySelector('#scrolle'));
        toast.success("Success Notification !", {
			position: toast.POSITION.TOP_RIGHT
		});
		if(this.props.notification_count >= 0){
			var count = this.props.notification_count+1;
			this.props.updateNotificationCount(count);
		}
    }

    onFilterChange = (newFilter: any) => {
        this.props.changeFilter({ newFilter, oldFilter: this.props.filters });
    }

    onSelectChange = (value: boolean) => {
        this.props.changeSelect({ value });
    }

    render() {
       
        return (
            <div className="page-content-wrapper">
                <div className="page-content">
                    {/*Main Page Content*/}
                    
                    <SubHeader title={this.props.title} filters={this.props.filters} onFilterChange={this.onFilterChange} />
                    <Card cards={cards.data}/>
                    <div className="row">
                        <div className="col bg-color-overlay bg-dark-green black-shadow"></div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div id="scrolle" className="card bg-dark-green black-shadow db-table-card-height mCustomScrollbar" >
                                <div className="cad-table-content">
                                    <TableHeader header={tables.header} menus={tables.menus} onSelectChange={this.onSelectChange} />
                                    <Table componentsName={'dashboard'} tables={tables} />
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
    changeFilter: ({ newFilter, oldFilter }: changeFilterProps) => dispatch(actions.changeFilter({ newFilter, oldFilter })),
    changeSelect: ({ value }: changeSelectProps) => dispatch(actions.changeSelect({ value })),
    updateNotificationCount: ( notification_count:any) => dispatch(actions.updateNotificationCount( notification_count )),
  }
}


export const mapStateToProps = (state: State) => {
    const { title, filters } = state.dashboard.subHeader;
    const { notification_count } = state.notification;
    return { title, filters ,notification_count};
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);