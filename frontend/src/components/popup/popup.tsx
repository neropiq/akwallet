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

import * as  React from 'react';

interface IProps {
    textvalue:string;
    onclosepopup?: () => void;
}
class Popup extends React.Component<IProps> {
    public componentDidMount(){
        window.onclick = (event)=>{
            return
        }
    }
    public crender() {
        return(
            <div className="popup  c-t-modal qr-code-modal"  >
                <div className="modal-dialog">
                    <div className="modal-content">                    
                        <div className="modal-header">
                            <span className="modal-title">You have a new Notification</span>
                            <button type="button" className="close" onClick={this.props.onclosepopup} >×</button>
                        </div>                        
                        <div className="modal-body text-center">
                            <p>{this.props.textvalue}</p>
                        </div>
                        
                    </div>
                </div>
            </div>
            
        );
    }
}

export default  Popup;