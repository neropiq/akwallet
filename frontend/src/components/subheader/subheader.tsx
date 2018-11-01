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
    title?: string;
    filters?: any;
    transaction?: any;
    views?: any;
    onFilterChange?: (value: any) => void;
    onTrancationFilterChange?: (value: any) => void;
    onViewChange?: (value: any) => void;
}

interface IState {
    value?: any;
    trancactionValue?: any;
}

interface IDefaultProps {
    filters: any;
    views: any;
    transaction: any;
}

class SubHeader extends React.Component<IProps, IState> {
    public static defaultProps: IDefaultProps = {
        filters: [],
        transaction: [],
        views: [],
    }

    constructor(props: IProps) {
        super(props);
        this.state = {
            trancactionValue: (this.props.filters.length === 0) || this.props.filters[0],
            value: (this.props.filters.length === 0) || this.props.filters[0],
        };

        // window.onclick = function(event) {

        // }
    }

    public componentDidMount() {
        this.props.filters.map((v: any, i: number) => {
            if (v.active) {
                this.props.onFilterChange(v.value);
            }
        })
        this.props.transaction.map((v: any, i: number) => {
            if (v.active) {
                this.props.onTrancationFilterChange(v.value);
            }
        })
    }

    public render() {
        return (
            <div className="row">
                <div className="col">
                    <div className="page-title">
                        <h2 className="m-0 page-head-title">{this.props.title}</h2>
                        {
                            (this.props.filters.length !== 0) &&
                            <div className="actions d-none d-sm-block">
                                <ul className="actions-list btn-group">
                                    {
                                        this.props.filters.map((filter: any, index: number) => (
                                            <li
                                                className={filter.active ? "active" : ""}
                                                key={index}
                                                onClick={this.onFilterChangeFunc(filter.value)}
                                            >
                                                <a href="#">{filter.value}</a>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        }
                        {
                            (this.props.filters.length !== 0) &&
                            <div className="actions d-block d-sm-none">
                                <select value={this.state.value} onChange={this.optionChange} className="form-control custom-select-table" name="transaction-type" id="transaction-type">
                                    {this.props.filters.map((filter: any, index: number) => <option key={index} value={filter.value}>{filter.value}</option>)}
                                </select>
                            </div>
                        }
                        {
                            (this.props.transaction.length !== 0) &&
                            <div className="actions d-none d-sm-block">
                                <ul className="actions-list btn-group">
                                    {
                                        this.props.transaction.map((filter: any, index: number) => (
                                            <li
                                                className={filter.active ? "active" : ""}
                                                key={index}
                                                onClick={this.onTrancationFilterChangeFunc(filter.value)}
                                            // onClick={()=>this.props.onTrancationFilterChange(filter.value)}
                                            >
                                                <a href="#">{filter.value}</a>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        }
                        {
                            (this.props.transaction.length !== 0) &&
                            <div className="actions d-block d-sm-none">
                                <select value={this.state.trancactionValue} onChange={this.onTrancationChange} className="form-control custom-select-table" name="transaction-type" id="transaction-type">
                                    {this.props.transaction.map((filter: any, index: number) => <option key={index} value={filter.value}>{filter.value}</option>)}
                                </select>
                            </div>
                        }

                        {
                            (this.props.views.length > 0) &&
                            <div className="actions d-none d-md-block">
                                <ul className="actions-list btn-group grid-actions">
                                    {
                                        this.props.views.map((view: any, index: number) => (
                                            <li className={view.active ? "active" : ""} key={index} >
                                                <a href="#" onClick={this.onViewChangeFunc(view.value)}>
                                                    <i className={view.className} />
                                                    {view.value}
                                                </a>
                                            </li>
                                        ))
                                    }

                                </ul>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }

    private optionChange = (e: any) => {
        const value = e.target.value
        this.setState({
            value
        });
        this.props.onFilterChange(value);
    }

    private onTrancationChange = (e: any) => {
        const value = e.target.value
        this.setState({
            trancactionValue: value
        });
        this.props.onTrancationFilterChange(value);
    }

    private onFilterChangeFunc = (v: string) => {
        return () => {
            this.props.onFilterChange(v)
        }
    }
    private onTrancationFilterChangeFunc = (v: string) => {
        return () => {
            this.props.onTrancationFilterChange(v)
        }
    }
    private onViewChangeFunc = (v: string) => {
        return () => {
            this.props.onViewChange(v)
        }
    }
}

export default SubHeader;