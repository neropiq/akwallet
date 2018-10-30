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

import * as React from 'react';
import { NavLink } from 'react-router-dom';

interface IIconProps {
    link: string;
    iconClass: string;
    iconTitle: string;
}

interface IProps {
    icons: any;
    location: any;
}

class Sidebar extends React.Component<IProps> {
    public render() {
        // console.log('sidebar', this.props);
        // var iconArray: Array<any> = this.props.icons;
        return(
            <div className="page-sidebar-wrapper d-none d-lg-block">
                <div className="page-sidebar black-shadow">
                    <ul className="page-sidebar-menu navbar-collapse">
                        {
                            this.props.icons.map(({ link, iconClass, iconTitle }: IIconProps, index: number) => (
                                    <li className={link === this.props.location ? 'active' : ''} key={index}>
                                        <NavLink to={`${link}`}>
                                            <i className={iconClass}/>
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