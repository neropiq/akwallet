import * as React from 'react';
import { NavLink } from 'react-router-dom';
import * as $ from 'jquery';

interface Props {
    icons: any;
    location: any;
    notiCount:number;
    changeHeader: () => void;
    onNotificationClick: () => void;
    logOut: () => void;
}
interface state {
    showNotification:boolean
}

class Header extends React.Component<Props,state> {
    constructor(props:Props){
        super(props);
        this.state ={
            showNotification:false
        }
    }
    componentDidMount(){
        
        if (window.innerWidth < 992) {
            
            $('body').addClass('pushmenu-push');
        }
        else
        {
            $('body').removeClass('pushmenu-push');
        }

        var $menuLeft = $('.pushmenu-left');
        var $nav_list = $('#nav_list');
        
        $nav_list.click(function(e) {
            
            $(this).toggleClass('active');
            $('.pushmenu-push').toggleClass('pushmenu-push-toright');
            $menuLeft.toggleClass('pushmenu-open');
            e.preventDefault();
            $('body').toggleClass('custome-active-menu');
            
        });
        
        $('.navlink-close').click(function(){
            $menuLeft.removeClass('pushmenu-open');        
            $('body').removeClass('custome-active-menu');
        });
        $('.page-container').click (function(e) {
                $('.pushmenu-push').toggleClass('pushmenu-push-toright');
                $menuLeft.removeClass('pushmenu-open');            
                $('body').removeClass('custome-active-menu');
        });
    }
    componentWillMount(){
      
    
    }
    
    clickNotification =() =>{
       
       console.log('click');
       this.props.onNotificationClick();
    }
    render() {
        var iconArray: Array<any> = this.props.icons;
       
        return (
            <div>
                <header className="dashboard-header d-none d-lg-block">
                    <nav className="nav fixed-header navbar fixed-top">
                        <div className="page-header-inner d-flex flex-row">
                            <div className="navbar-brand mr-0 py-0 page-logo">
                                <NavLink to='dashboard' className="navbar-brand dashboard-logo">
                                    <img src={require("../../assets/images/logo-small.png")} className="img-fluid" alt="logo" />
                                    <span className="brand-name">DEBUGNET</span>
                                </NavLink>
                            </div>
                            <div className="search-action">
                                <div className="input-group header-search-box">
                                    <input type="search" className="form-control" placeholder="Search..." aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                    <div className="input-group-append">
                                        <span className="input-group-text icon-magnifier"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="header-tool-action d-inline-flex">
                            <div className="top-menu">
                                <ul className="notification-group d-inline-block profile-list ">
                                    <li className="dropdown">
                                        <a href='#' className="dropdown-toggle" id="dropdownNotification"   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >                                       
                                            <i className="icon-bell" ></i>
                                            <span className="badge badge-danger">{this.props.notiCount > 0 ? this.props.notiCount : ''}</span>
                                        </a>
                                        <div className="dropdown-menu notification-dropdown" aria-labelledby="dropdownNotification">
                                            
                                            <a href='#' className="dropdown-item"> <i className="icon-user"></i> You Received Payment from Jack</a>
                                            <a href='#' className="dropdown-item"><i className="icon-user"></i> You Received Payment from Jack</a>                                            
                                            <a href='#' className="dropdown-item"><i className="icon-user"></i> You Received Payment from Jack</a>
                                            <a href='#' className="dropdown-item"><i className="icon-user"></i> You Received Payment from Jack</a>
                                        </div>
                                    </li>

                                    <li className="dropdown">
                                        <a href='#' className="dropdown-toggle" id="dropdownMsg"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i className="icon-envelope-letter"></i>
                                        </a>
                                        
                                    </li>

                                    <li className="dropdown">
                                        <a href='#' className="dropdown-toggle" id="dropdownCalender"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i className="icon-calendar"></i>
                                        </a>
                                        
                                    </li>
                                </ul>

                                <ul className="profile-list">
                                    <li className="dropdown">
                                        <a href='# ' className="dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            My Account <span><img src={require("../../assets/images/avatar.png")} className="img-fluid" alt="profile-pic" /></span>
                                        </a>
                                        <div className="dropdown-menu profile-dropdown" aria-labelledby="dropdownMenuButton">
                                            <a href='#' className="dropdown-item"> <i className="icon-user"></i> Edit Profile</a>
                                            <a href='#' className="dropdown-item"><i className="icon-key"></i> Change Password</a>
                                            <NavLink id="migrate" className="dropdown-item" to="/setting" onClick={this.props.changeHeader}><i className="icofont-spinner-alt-3"></i> Migration</NavLink>
                                            <a href='#' className="dropdown-item" onClick={()=>this.props.logOut()}><i className="icon-logout"></i> Logout</a>
                                        </div>
                                        <span className="Profile-name">Nick</span>
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
                                <NavLink className="navbar-brand mob-nav-brand mr-0" to='dashboard'>
                                    <img className="brand-logo" alt="logo" src={require("../../assets/images/logo-small.png")} />
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
                                            <a href='#' className="dropdown-toggle" id="dropdownNotification" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"  >
                                            {/* data-balloon="Whats up!" data-balloon-pos="down" */}
                                            {/* data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" */}
                                                <i className="icon-bell" ></i>
                                                <span className="badge badge-danger">{this.props.notiCount > 0 ? this.props.notiCount : ''}</span>
                                            </a>
                                            <div className="dropdown-menu notification-dropdown" aria-labelledby="dropdownNotification">
                                               
                                                <a href='#' className="dropdown-item"> <i className="icon-user"></i> You Received Payment from Jack</a>
                                                <a href='#' className="dropdown-item"><i className="icon-user"></i> You Received Payment from Jack</a>                                            
                                                <a href='#' className="dropdown-item"><i className="icon-user"></i> You Received Payment from Jack</a>
                                                <a href='#' className="dropdown-item"><i className="icon-user"></i> You Received Payment from Jack</a>
                                            </div>
                                        </li>

                                        <li>
                                            <a href="">
                                                <i className="icon-envelope-letter"></i>
                                            </a>
                                        </li>

                                        <li>
                                            <a href="">
                                                <i className="icon-calendar"></i>
                                            </a>
                                        </li>
                                    </ul>

                                    <ul className="profile-list">
                                        <li className="dropdown">
                                            <a href="#" className="dropdown-toggle" id="droptoolMob" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                My Account <span><img src={require("../../assets/images/avatar.png")} className="img-fluid" alt="profile-pic" /></span>
                                            </a>
                                            <div className="dropdown-menu profile-dropdown" aria-labelledby="droptoolMob">
                                                <a className="dropdown-item" href="#"> <i className="icon-user"></i> Edit Profile</a>
                                                <a className="dropdown-item" href="#"><i className="icon-key"></i> Change Password</a>
                                                <NavLink className="dropdown-item" to="/setting"><i className="icofont-spinner-alt-3"></i> Migration</NavLink>
                                                <a className="dropdown-item" href="#" onClick={()=>this.props.logOut()}><i className="icon-logout"></i> Logout</a>
                                            </div>
                                            <span className="Profile-name">Nick</span>
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
                                                    <i className={iconClass}></i>
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
}

export default Header;