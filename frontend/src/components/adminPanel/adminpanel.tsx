import * as React from 'react';
import { Redirect, Route,  Switch } from "react-router-dom";
import * as actions from '../../actions';
import { State } from '../../reducers';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import dashboardRoutes from "../../routes/route";
import Sidebar from '../sidebar/sidebar';
import Header from "../header/header";
var sidebar = require('./sidebar.json');
import './../../assets/css/bootstrap.min.css';
import './../../assets/css/icofont.css';
import './../../assets/css/animate.css';
import './../../assets/css/hover-min.css';
import './../../assets/css/nav-menu-mobile.css';
import Popup from '../popup/popup';
import './../../assets/css/style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const switchRoutes = (
	<Switch>
	  	{
		  	dashboardRoutes.map((prop, key) => {	
				if (prop.redirect)
					return <Redirect from={prop.path} to={prop.to} key={key} />;
				return <Route path={prop.path} component={prop.component} key={key} />; 
		  	})
		}
	</Switch>
);

interface changeCardTabSettingProps {
    newFilter: any;
    oldFilter: any;
}

interface Props {
	isAuthenticated: boolean;
	notification_count:number;
	history: any;
	location: any;
	settingTab: any;
	updateNotificationCount: ( notification_count:number ) => void;
	changeCardTabSetting: ({ newFilter, oldFilter }: changeCardTabSettingProps) => void;
}

interface state {
	popup:boolean;
	value:string;
	
	// previousLocation:any;
}

class AdminPanel extends  React.Component<Props, state> {
	
	constructor(props: Props) {
		super(props);
		this.state = {			
			popup:true,
			value:'You Received Payment from Jack',			
		}
	}
	
	componentDidMount(){	
		window.scrollTo(0, 0);
		
		// toast("Wow so easy !");
		if(this.props.isAuthenticated === false){
			this.props.history.push('/login');

		}
		
		// this.setState(() => ({
		// 	previousLocation: this.props.history.location.pathname 
		// }));

	}

	componentDidUpdate()  {		
		window.scrollTo(0, 0);		
		// if(this.state.previousLocation !== this.props.history.location.pathname) {
		// 	this.setState(() => ({
		// 		previousLocation: this.props.history.location.pathname 
		// 	}));	
		// }
	}
	toasterCalled(){
		console.log('totacer functin called');
		toast.success("Success Notification !", {
			position: toast.POSITION.TOP_RIGHT
		});
		if(this.props.notification_count >= 0){
			var count = this.props.notification_count+1;
			this.props.updateNotificationCount(count);
		}
		
	}

	closepopup = () =>{
		
		this.setState(() => ({
			popup: false
		}));
	}

	changeHeader = () => {
		const newFilter: any = 'Migration';
		setTimeout(() => {
			this.props.changeCardTabSetting({ newFilter, oldFilter: this.props.settingTab });
		});
	}
	
	onNotificationClick =() =>{
		console.log('notification click');
		var count = 0;
		this.props.updateNotificationCount(count);
	}

    public render() {     

      	return (
        	(this.props.location.pathname === '/login' || this.props.location.pathname === '/signup') ?
			<div>{switchRoutes}</div> :
			<div>
				<ToastContainer  />
				{/* {this.state.popup ? <Popup textvalue={this.state.value} onclosepopup={this.closepopup}/>: ''} */}
				{/* {this.state.popup ? <ToastContainer  />: ''} */}
				<Header  icons={sidebar.data} location={this.props.location.pathname} changeHeader={this.changeHeader} notiCount={this.props.notification_count} onNotificationClick={this.onNotificationClick} />
				<div className="clearfix" ></div>
				<div className="page-container">
					<Sidebar icons={sidebar.data} location={this.props.location.pathname} />
					{switchRoutes}
		  		</div>
				{/* <Footer /> */}
			</div>
      	);
    }
  }

export const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
		changeCardTabSetting: ({ newFilter, oldFilter }: changeCardTabSettingProps) => dispatch(actions.changeCardTabSetting({ newFilter, oldFilter })),		
		updateNotificationCount: ( notification_count:any) => dispatch(actions.updateNotificationCount( notification_count )),
    }
  }

export function mapStateToProps(state: State) {
	const { isAuthenticated } = state.login;
	const { notification_count } = state.notification;
	const { settingTab } = state.setting.cardSettingTab;
    return { isAuthenticated, settingTab,notification_count };    
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel);