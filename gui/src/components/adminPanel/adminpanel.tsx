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
import './../../assets/css/jquery.mCustomScrollbar.css';
import './../../assets/css/style.css';
import * as $ from 'jquery';
var loadjs = require('loadjs');

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
	history: any;
	location: any;
	settingTab: any;
	changeCardTabSetting: ({ newFilter, oldFilter }: changeCardTabSettingProps) => void;
}

interface state {
	previousLocation: string;
}

class AdminPanel extends  React.Component<Props, state> {
	
	constructor(props: Props) {
		super(props);
		this.state = {
			previousLocation: ''
		}
	}

	componentDidMount(){	
		window.scrollTo(0, 0);
		
		if(this.props.isAuthenticated === false){
			this.props.history.push('/login');

		}	
		this.setState(() => ({
			previousLocation: this.props.history.location.pathname 
		}));

		// loadjs(['../../assets/js/jquery-3.3.1.min.js','../../assets/js/jquery.mCustomScrollbar.js'],function(){							
			
		// });
	}

	componentDidUpdate() {
		window.scrollTo(0, 0);
		if(this.state.previousLocation !== this.props.history.location.pathname) {
			this.setState(() => ({
				previousLocation: this.props.history.location.pathname 
			}));	
		}
	}

	changeHeader = () => {
		const newFilter: any = 'Migration';
		setTimeout(() => {
			this.props.changeCardTabSetting({ newFilter, oldFilter: this.props.settingTab });
		});
	}

    public render() {     

      	return (
        	(this.props.location.pathname === '/login' || this.props.location.pathname === '/signup') ?
			<div>{switchRoutes}</div> :
			<div>
				<Header icons={sidebar.data} location={this.props.location.pathname} changeHeader={this.changeHeader} />
				<div className="clearfix"></div>
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
    }
  }

export function mapStateToProps(state: State) {
	const { isAuthenticated } = state.login;
	const { settingTab } = state.setting.cardSettingTab;
    return { isAuthenticated, settingTab };    
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel);