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
import Scrollbar from 'smooth-scrollbar';

interface IProps {
    connected: boolean;
}

class FAQ extends React.Component<IProps> {
    public componentDidMount() {
        Scrollbar.init(document.querySelector('#accordionExample'));
    }
    public render() {
        return (
            <div className="" id="tab-5" role="tabpanel" aria-labelledby="tab5">
                <div className="accordion custom-accordion" id="accordionExample">
                    <div className="faqs">
                        <div className="faqs-header" id="headingOne">
                            <h5 className="mb-0">
                                <a href="javascript:void(0)" className="faq-title " data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    Register your Account
                                </a>
                            </h5>
                        </div>

                        <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                            <div className="faqs-body-para">
                                <p>
                                    To register a new account generate a seed via Register on the login screen. If you already generated a seed before you can login with it and access your account.
                                </p>
                                <p>
                                    A seed can be seen like a password that is used to access your account, and therefore grant access to your Aidos coins. Never share your seed with anyone and store it safely, because if you lose your seed you lose access to your Aidos coins.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="faqs">
                        <div className="faqs-header" id="headingTwo">
                            <h5 className="mb-0">
                                <a href="javascript:void(0)" className="faq-title collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    Why does my wallet / computer seem to be stuck when I generate an address / make a transaction?
                                </a>
                            </h5>
                        </div>
                        <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                            <div className="faqs-body-para">
                                <p>
                                    In both cases your CPU carries out an amount of Proof-of-Work, which is compute-intensive. This means that the time it takes for those actions depend greatly on your computing power. We advice to be patient and grab a drink in the meantime.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="faqs">
                        <div className="faqs-header" id="headingThree">
                            <h5 className="mb-0">
                                <a href="javascript:void(0)" className="faq-title collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                    Can I re-use addresses?
                                </a>
                            </h5>
                        </div>
                        <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
                            <div className="faqs-body-para">
                                <p>
                                    Yes. Use as many times as you want.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="faqs">
                        <div className="faqs-header" id="headingFour">
                            <h5 className="mb-0">
                                <a href="javascript:void(0)" className="faq-title collapsed" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                    How to change the server?
                                </a>
                            </h5>
                        </div>
                        <div id="collapseFour" className="collapse" aria-labelledby="headingFour" data-parent="#accordionExample">
                            <div className="faqs-body-para">
                                <p>
                                    You can change the server by selecting setting on menu bar and changing the server to e.g. "http://localhost:14271" .
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default FAQ;