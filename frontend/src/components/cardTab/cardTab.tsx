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

interface IProps {
    tab: any;
    settingTab: any;
    addressTab: any;
    onCardChange?: (value: any) => void;
    onFilterChange?: (value: any) => void;
}

interface IState {
    value: any;
}

interface IDefaultProps {
    tab: any;
    settingTab: any;
    addressTab: any;
}

class CardTab extends React.Component<IProps, IState> {
    public static defaultProps: IDefaultProps = {
        addressTab: [],
        settingTab: [],
        tab: [],
    }
    constructor(props: IProps) {
        super(props);
        this.state = {
            value: (this.props.tab.length === 0) || this.props.tab[0]
        };
    }

    public componentDidMount() {
        this.props.tab.map((v: any, i: number) => {
            if (v.active) {
                this.props.onCardChange(v.value);
            }
        })
        this.props.settingTab.map((v: any, i: number) => {
            if (v.active) {
                this.props.onCardChange(v.value);
            }
        })
        this.props.addressTab.map((v: any, i: number) => {
            if (v.active) {
                this.props.onCardChange(v.value);
            }
        })
    }

    public render() {
        return (
            <div className="card-header py-4 px-0">
                {
                    (this.props.tab.length !== 0) &&
                    <ul className="nav nav-tabs custom-tabs px-4" id="myTab" role="tablist">
                        {
                            this.props.tab.map((tab: any, index: number) => (

                                <li className="nav-item" key={index}>
                                    <a className={tab.active ? "nav-link active" : "nav-link "}
                                        id="tab1" data-toggle="tab" href="#" role="tab"
                                        aria-controls={tab.controle} aria-selected={tab.active ? "true" : "false"}
                                        onClick={this.onCardChangeFunc(tab.value)}>
                                        {tab.value}
                                    </a>
                                </li>
                            ))
                        }
                    </ul>
                }
                {
                    (this.props.addressTab.length !== 0) &&
                    <ul className="nav nav-tabs custom-tabs px-4" id="myTab" role="tablist">
                        {
                            this.props.addressTab.map((tab: any, index: number) => (

                                <li className="nav-item" key={index}>
                                    <a className={tab.active ? "nav-link active" : "nav-link "}
                                        id="tab1" data-toggle="tab" href="#" role="tab"
                                        aria-controls={tab.controle} aria-selected={tab.active ? "true" : "false"}
                                        onClick={this.onCardChangeFunc(tab.value)}>
                                        {tab.value}
                                    </a>
                                </li>
                            ))
                        }
                    </ul>
                }
                {
                    (this.props.settingTab.length !== 0) &&
                    <ul className="nav nav-tabs custom-tabs px-4" id="myTab" role="tablist">
                        {
                            this.props.settingTab.map((settingTab: any, index: number) => (

                                <li className="nav-item" key={index}>
                                    <a className={settingTab.active ? "nav-link active" : "nav-link "}
                                        id="tab1" data-toggle="tab" href="#" role="tab"
                                        aria-controls={settingTab.controle} aria-selected={settingTab.active ? "true" : "false"}
                                        onClick={this.onCardChangeFunc(settingTab.value)} >
                                        {settingTab.value}
                                    </a>
                                </li>
                            ))
                        }
                    </ul>
                }
            </div>
        );
    }

    private onCardChangeFunc = (v: string) => {
        return () => this.props.onCardChange(v)
    }

    private optionChange = (e: any) => {
        const value = e.target.value
        this.setState(() => ({
            value
        }));
        this.props.onFilterChange(value);
    }
}

export default CardTab;