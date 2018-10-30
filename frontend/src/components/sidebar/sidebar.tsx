import * as React from 'react';
import { NavLink } from 'react-router-dom';

interface iconProps {
    link: string;
    iconClass: string;
    iconTitle: string;
}

interface Props {
    icons: any;
    location: any;
}

class Sidebar extends React.Component<Props> {
    render() {
        // console.log('sidebar', this.props);
        // var iconArray: Array<any> = this.props.icons;
        return(
            <div className="page-sidebar-wrapper d-none d-lg-block">
                <div className="page-sidebar black-shadow">
                    <ul className="page-sidebar-menu navbar-collapse">
                        {
                            this.props.icons.map(({ link, iconClass, iconTitle }: iconProps, index: number) => (
                                    <li className={link === this.props.location ? 'active' : ''} key={index}>
                                        <NavLink to={`${link}`}>
                                            <i className={iconClass}></i>
                                            <span className="title">{iconTitle}</span>
                                        </NavLink>
                                    </li>
                                )
                            )
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default Sidebar;