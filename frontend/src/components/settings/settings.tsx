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
import { Dispatch } from 'redux';
import * as actions from '../../actions';
import { IStoreState } from '../../reducers';
import CardTab from '../cardTab/cardTab';
import SubHeader from '../subheader/subheader';
import FAQ from './faq';
import Migration from './migration';
import Mining from './mining';
import NodeStatus from './nodestatus';
import Server from './server';
import Terms from './terms';

interface IchangeCardTabSettingProps {
    newFilter: any;
    oldFilter: any;
}

interface IProps {
    connected: boolean;
    title: string;
    settingTab: string[];
    changeCardTabSetting: ({ newFilter, oldFilter }: IchangeCardTabSettingProps) => void;
}

class Setting extends React.Component<IProps> {
    public componentDidMount() {
        document.title = "Setting || Aidos Wallet";
        $('#migrate').removeClass('active');
    }


    public render() {
        return (
            <div>
                <div className="page-content-wrapper my-address-page">
                    <div className="page-content">
                        {/*Main Page Content*/}
                        <SubHeader title={this.props.title} />
                        <div className="row settings-card transactions-card">
                            <div className="col-12">
                                <div className="card-height card bg-dark-green black-shadow mCustomScrollbar" data-mcs-theme="dark">
                                    <div className="cad-table-content">
                                        <CardTab settingTab={this.props.settingTab} onCardChange={this.onCardChange} />
                                    </div>
                                    <div className="card-body">
                                        <div className="tab-content" id="myTabContent">
                                            {
                                                this.props.settingTab.map((value: any, index: number) => {
                                                    if (value.value === "Mining" && value.active === true) {
                                                        return (<Mining key={index} connected={this.props.connected} />)
                                                    }
                                                    if (value.value === "Servers" && value.active === true) {
                                                        return (<Server key={index} connected={this.props.connected} />)
                                                    }
                                                    if (value.value === "Migration" && value.active === true) {
                                                        return (<Migration key={index} connected={this.props.connected} />)
                                                    }
                                                    if (value.value === "Node Status" && value.active === true) {
                                                        return (<NodeStatus key={index} connected={this.props.connected} />)
                                                    }
                                                    if (value.value === "FAQ" && value.active === true) {
                                                        return (<FAQ key={index} connected={this.props.connected} />)
                                                    }
                                                    if (value.value === "About" && value.active === true) {
                                                        return (<Terms key={index} connected={this.props.connected} />)
                                                    }
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    private onCardChange = (newFilter: any) => {
        this.props.changeCardTabSetting({ newFilter, oldFilter: this.props.settingTab });
    }
}


export const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        changeCardTabSetting: ({ newFilter, oldFilter }: IchangeCardTabSettingProps) => dispatch(actions.changeCardTabSetting({ newFilter, oldFilter })),
    }
}

export const mapStateToProps = (state: IStoreState) => {
    const { title, settingTab } = state.setting.cardSettingTab;
    return { title, settingTab,connected:state.connected };
}

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
