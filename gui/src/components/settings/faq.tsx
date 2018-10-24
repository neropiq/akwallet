import * as React from 'react';
import Scrollbar from 'smooth-scrollbar';

class FAQ extends React.Component {
    componentDidMount(){
        Scrollbar.init(document.querySelector('#accordionExample'));
    }
    render() {
        return(
            <div className="" id="tab-5" role="tabpanel" aria-labelledby="tab5">
                <div  className="accordion custom-accordion" id="accordionExample">
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
                                    TODO
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
                                    You can change the server by selecting TODO on menu bar and changing the server to e.g. "localhost" .
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="faqs">
                        <div className="faqs-header" id="headingFive">
                            <h5 className="mb-0">
                                <a href="javascript:void(0)" className="faq-title collapsed" data-toggle="collapse" data-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                    How do I get a Lambo?
                                </a>
                            </h5>
                        </div>
                        <div id="collapseFive" className="collapse" aria-labelledby="headingFive" data-parent="#accordionExample">
                            <div className="faqs-body-para">
                                <p>
                                    <em>Even the rich are hungy for love, for being cared for, for being wanted, for having someone to call their own.</em>
                                    <strong>Mother Teresa</strong>
                                </p>
                                <p>
                                    What is your happiness? What are you living for?
                                    Are you really happy by fighting with or abusing other crypto guys ?
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