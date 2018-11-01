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

import $ from 'jquery';
import * as React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Dispatch } from 'redux';
import * as actions from '../../actions';
import { IStoreState } from '../../reducers';
import { nets } from '../../utils/remote';

interface IProps {
    icons: any;
    location: any;
    testnet: number;
    noti: string[];
    notificationCount: number;
    changeHeader: () => void;
    updateNotificationCount: (notificationCount: number) => void;
}
interface IState {
    showNotification: boolean,
}

class Header extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            showNotification: false,
        }
    }
    public componentDidMount() {
        if (window.innerWidth < 992) {
            $('body').addClass('pushmenu-push');
        }
        else {
            $('body').removeClass('pushmenu-push');
        }

        const $menuLeft = $('.pushmenu-left');
        const $navlist = $('#nav_list');

        $navlist.click(function (e) {
            console.log('nav list called');
            $(this).toggleClass('active');
            $('.pushmenu-push').toggleClass('pushmenu-push-toright');
            $menuLeft.toggleClass('pushmenu-open');
            e.preventDefault();
            $('body').toggleClass('custome-active-menu');

        });

        $('.navlink-close').click(() => {
            $menuLeft.removeClass('pushmenu-open');
            $('body').removeClass('custome-active-menu');
        });
        $('.page-container').click((e) => {
            $('.pushmenu-push').toggleClass('pushmenu-push-toright');
            $menuLeft.removeClass('pushmenu-open');
            $('body').removeClass('custome-active-menu');
        });
    }
    public render() {
        const iconArray: any[] = this.props.icons;
        return (
            <div>
                <header className="dashboard-header d-none d-lg-block">
                    <nav className="nav fixed-header navbar fixed-top">
                        <div className="page-header-inner d-flex flex-row">
                            <div className="navbar-brand mr-0 py-0 page-logo">
                                <NavLink to='dashboard' className="navbar-brand dashboard-logo">
                                    <img src={require("../../assets/images/logo-small.png")} className="img-fluid" alt="logo" />
                                    <span className="brand-name">{this.props.testnet === 0 ? "" : nets[this.props.testnet]}</span>
                                </NavLink>
                            </div>
                        </div>
                        <div className="header-tool-action d-inline-flex">
                            <div className="top-menu">
                                <ul className="notification-group d-inline-block profile-list ">
                                    <li className="dropdown" >
                                        <a href='#' className="dropdown-toggle" id="dropdownNotification" data-toggle="dropdown"
                                            aria-haspopup="true" aria-expanded="false" onMouseDown={this.handleViewed} > {/* don't work if onClick (due to dropdown?)*/}
                                            <i className="icon-bell"  />
                                            <span className="badge badge-danger" >{this.props.notificationCount > 0 ? this.props.notificationCount : ''}</span>
                                        </a>
                                            <div className="dropdown-menu notification-dropdown" aria-labelledby="dropdownNotification">
                                                {
                                                    this.props.noti.map((n: string, i: number) => (
                                                        <a href='#' key={i} className="dropdown-item"> <i className="icon-user" />{n}</a>
                                                    ))
                                                }
                                            </div>
                                    </li>
                                </ul>

                                <ul className="profile-list">
                                    <li className="dropdown">
                                        <a href='#' className="btn dropdown-toggle" role="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            My Account
                                        </a>
                                        <div className="dropdown-menu profile-dropdown" aria-labelledby="dropdownMenuButton">
                                            <a href='#' className="dropdown-item"><i className="icon-logout" />Logout</a>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </header>
                <header className="d-lg-none d-block">
                    <div className="mob-header black-shadow">
                        <ul className="nav navbar-nav flex-row">
                            <li className="nav-item mobile-menu mr-auto">
                                <a id="nav_list" className="nav-link nav-menu-main menu-toggle" href="javascript:void(0);">
                                    <img src={require("../../assets/images/nav-menu-icon.png")} width="20" alt="menu-icon" />
                                </a>
                            </li>
                            <li className="nav-item">
                                <NavLink className="navbar-brand mob-nav-brand mr-0" to="/dashboard">
                                    <img className="brand-logo" alt="logo" src={require("../../assets/images/logo-small.png")} />
                                    <span className="brand-name">
                                        {this.props.testnet === 0 ? "" : nets[this.props.testnet]}
                                    </span>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link open-navbar-container collapsed" data-toggle="collapse" data-target="#navbar-mobile" aria-expanded="false">
                                    <img src={require("../../assets/images/dot-menu-icon.png")} height="20" alt="dot-icon" />
                                </a>
                            </li>
                        </ul>
                        <div className="collapse mob-profile-details clearfix" id="navbar-mobile">
                            <div className="float-right d-flex">
                                <div className="top-menu">
                                    <ul className="notification-group d-inline-block">
                                        <li className="dropdown">
                                            <a href='#' className="dropdown-toggle" id="dropdownNotification" data-toggle="dropdown" 
                                            aria-haspopup="true" aria-expanded="false"   onMouseDown={this.handleViewed}  >
                                                {/* data-balloon="Whats up!" data-balloon-pos="down" */}
                                                {/* data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" */}
                                                <i className="icon-bell" />
                                                <span className="badge badge-danger">{this.props.notificationCount > 0 ? this.props.notificationCount : ''}</span>
                                            </a>
                                                <div className="dropdown-menu notification-dropdown" aria-labelledby="dropdownNotification">
                                                    {
                                                        this.props.noti.map((n: string, i: number) => (
                                                            <a href='#' key={i} className="dropdown-item"> <i className="icon-user" />{n}</a>
                                                        ))
                                                    }
                                                </div>
                                        </li>
                                    </ul>

                                    <ul className="profile-list">
                                        <li className="dropdown">
                                            <a href="" className="btn dropdown-toggle" id="droptoolMob" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                My Account
                                            </a>
                                            <div className="dropdown-menu profile-dropdown" aria-labelledby="droptoolMob">
                                                <a className="dropdown-item" href="#"><i className="icon-logout" /> Logout</a>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <nav className="pushmenu pushmenu-left black-shadow">
                            <ul className="mob-sidebar-links">
                                {
                                    iconArray.map(({ linkActive, link, iconClass, iconTitle }, index: number) => (
                                        <li className={link === this.props.location ? 'active' : ''} key={index}>
                                            <NavLink to={`${link}`} className="navlink-close">
                                                <i className={iconClass} />
                                                <span className="title">{iconTitle}</span>
                                            </NavLink>
                                        </li>
                                    )
                                    )
                                }
                            </ul>
                        </nav>
                    </div>
                </header>
            </div>
        );
    }

    private handleViewed = () => {
        console.log("!!")
        this.props.updateNotificationCount(0)
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        updateNotificationCount: (notificationCount: any) => dispatch(actions.updateNotificationCount(notificationCount)),
    }
}
const mapStateToProps = (state: IStoreState) => {
    const { Testnet: testnet } = state.config;
    return { testnet, noti: state.notification.notification ,notificationCount:state.notification.notificationCount}
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
