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
import { connect } from 'react-redux';
import TermText from '../../constants';
import { IStoreState } from '../../reducers';

interface IProps {
    version:string;
    connected: boolean;
}
class Terms extends React.Component<IProps>{

   public render() {
        return (
            <div className="" id="tab-6" role="tabpanel" aria-labelledby="tab6">
                <label className="note">
                    AKWallet Version {this.props.version} <br />
                    Copyright ©2019 Aidos Developer / Aidos Foundation
                </label>
                <br /><br />
                <div className="terms">
                    <p>Terms & conditions</p> <br />
                    <TermText />
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state: IStoreState) => {
    return { version:state.config.Version};
}


export default connect(mapStateToProps)(Terms);