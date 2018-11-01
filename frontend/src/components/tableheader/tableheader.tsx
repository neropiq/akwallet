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
    header: string;
    menus: string[];
    onSelectChange?: (value: any) => void;
}

interface IDefaultProps {
    menus: string[];
}


interface IState {
    value?: string;
}

class TableHeader extends React.Component<IProps, IState> {
    public static defaultProps: IDefaultProps = {
        menus: []
    }
    constructor(props: IProps) {
        super(props);
        this.state = {
            value: this.props.menus.length === 0 ? "" : this.props.menus[0]
        };
    }

    public componentDidMount() {
        console.log(this.state.value)
        this.props.menus.map((v: string, i: number) => {
            if (v === this.state.value) {
                this.props.onSelectChange(v);
            }
        })
    }

    public render() {
        return (
            <div className="card-header p-4">
                <h3 className="card-name">{this.props.header}</h3>
                <div className="card-heading-element">
                    {
                        (this.props.menus.length !== 0) &&
                        <select value={this.state.value} onChange={this.optionChange} className="form-control custom-select-table" name="transaction-type" id="transaction-type">
                            {this.props.menus.map((menu: any, index: number) => <option value={menu} key={index}>{menu}</option>)}
                        </select>
                    }
                </div>
            </div>
        );
    }

    private optionChange = (e: any) => {
        const value = e.target.value
        this.setState(() => ({
            value
        }));
        this.props.onSelectChange(value);
    }
}

export default TableHeader;