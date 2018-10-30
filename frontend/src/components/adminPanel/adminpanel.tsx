// Copyright (c) 2018 Aidos Developer

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import loadjs = require('loadjs');
import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from "react-router-dom";
import { Dispatch } from 'redux';
import * as actions from '../../actions';
import GUI from '../../GUI'
import { IConfigEntity } from '../../model';
import { IStoreState } from '../../reducers';
import dashboardRoutes from "../../routes/route";
import { allPrivkeys, getAettings, Iprivatekeys } from '../../utils/remote';
import Header from "../header/header";
import Sidebar from '../sidebar/sidebar';
import './../../assets/css/animate.css';
import './../../assets/css/bootstrap.min.css';
import './../../assets/css/hover-min.css';
import './../../assets/css/icofont.css';
import './../../assets/css/jquery.mCustomScrollbar.css';
import './../../assets/css/nav-menu-mobile.css';
import './../../assets/css/style.css';
import sidebar from './sidebar.json'

const switchRoutes = (
	<Switch>
		{
			dashboardRoutes.map((prop, key) => {
				if (prop.redirect) {
					return <Redirect from={prop.path} to={prop.to} key={key} />;
				}
				return <Route path={prop.path} component={prop.component} key={key} />;
			})
		}
	</Switch>
);

interface IchangeCardTabSettingProps {
	newFilter: any;
	oldFilter: any;
}

interface IProps {
	connected: boolean;
	isAuthenticated: boolean;
	history: any;
	location: any;
	settingTab: any;
	changeCardTabSetting: ({ newFilter, oldFilter }: IchangeCardTabSettingProps) => void;
	updateConfig: (cfg: IConfigEntity) => void;
	updateConnected: (con: boolean) => void;
	updatePrivkeys: (privkeys: string[]) => void,
}

interface IState {
	previousLocation: string;
}

export let socket: GUI

class AdminPanel extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			previousLocation: ''
		}
	}

	public componentDidMount() {
		window.scrollTo(0, 0);
		socket = new GUI()
		if (this.props.isAuthenticated === false) {
			this.props.history.push('/login');
		}
		this.setState(() => ({
			previousLocation: this.props.history.location.pathname
		}));
		if (this.props.connected) {
			return
		}
		const to = setTimeout(() => {
			alert("Cannot connect to backend.")
		}, 3000)
		socket.onConnect(() => {
			clearTimeout(to)
			this.props.updateConnected(true)
			getAettings(true, (cfg: IConfigEntity) => {
				this.props.updateConfig(cfg)
			})
			allPrivkeys(true, (p: Iprivatekeys) => {
				if (p.Error) {
					alert(p.Error)
					return
				}
				this.props.updatePrivkeys(p.PKs)
			})
			console.log("connected", socket)
		});
		socket.on("new_tx",()=>{
			// TODO
			alert("new tx")
		})
		socket.on("confirmed",()=>{
			// TODO
			alert("confirmed")
		})
		socket.onDisconnect(() => {
			alert("Disconnected from backend. Please restart.")
			this.props.updateConnected(false)
		});
		socket.onError((str: string) => {
			alert(str)
		})
		socket.connect()
	}

	public componentDidUpdate() {
		window.scrollTo(0, 0);
		if (this.state.previousLocation !== this.props.history.location.pathname) {
			this.setState(() => ({
				previousLocation: this.props.history.location.pathname
			}));
		}
	}

	public componentWillUnmount() {
		socket.close()
	}

	public render() {
		return (
			(this.props.location.pathname === '/login' || this.props.location.pathname === '/signup') ?
				<div>{switchRoutes}</div> :
				<div>
					<Header icons={sidebar.data} location={this.props.location.pathname} changeHeader={this.changeHeader} />
					<div className="clearfix" />
					<div className="page-container">
						<Sidebar icons={sidebar.data} location={this.props.location.pathname} />
						{switchRoutes}
					</div>
					{/* <Footer /> */}
				</div>
		);
	}

	private changeHeader = () => {
		const newFilter: any = 'Migration';
		setTimeout(() => {
			this.props.changeCardTabSetting({ newFilter, oldFilter: this.props.settingTab });
		});
	}
}

export const mapDispatchToProps = (dispatch: Dispatch) => {
	return {
		changeCardTabSetting: ({ newFilter, oldFilter }: IchangeCardTabSettingProps) => dispatch(actions.changeCardTabSetting({ newFilter, oldFilter })),
		updateConfig: (cfg: IConfigEntity) => dispatch(actions.updateConfig(cfg)),
		updateConnected: (con: boolean) => dispatch(actions.updateConnnected(con)),
		updatePrivkeys: (pks: string[]) => dispatch(actions.updatePrivkeys(pks)),
	}
}

export function mapStateToProps(state: IStoreState) {
	const { isAuthenticated } = state.login;
	const { settingTab } = state.setting.cardSettingTab;
	return { isAuthenticated, settingTab, connected: state.connected };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel);