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
import { toast } from 'react-toastify';

interface IProps {
    fields: string[],
    data: string[][],
    componentsName: any;
    transactionClick?: (index: number) => void;
}

class Table extends React.Component<IProps> {
    public componentDidMount() {
        // window.initCustomScrollbar();

    }

    public render() {
        return (
            <div className="card-body px-4 py-0">
                <div className="table-responsive custom-table-theme scroll-table ">
                    <table className="table table-hover text-center">
                        <thead>
                            <tr>
                                {
                                    this.props.fields.map((field: string, index: number) => <th scope="col" key={index}>{field}</th>)
                                }
                            </tr>
                        </thead>
                        <tbody >
                            {
                                this.props.data &&
                                this.props.data.map((rows: any, index: number) => (
                                    <tr key={index} onClick={this.transactionClick(index)}>
                                        {
                                            rows.map((row: string, i: number) => <td className="td-set" key={i} onClick={this.copyText(row, this.props.fields[index])} title={row}><span>{row}</span></td>)
                                        }
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
    private transactionClick = (index: number) => {
        return () => {
            if (this.props.componentsName === 'transaction') {
                this.props.transactionClick(index);
            }
        }
    }

    private copyText = (value: any, text: any) => {
        return () => {
            if (text === 'From Address' || text === 'To Address') {
                console.log('address copy');
                const input = document.createElement('input');
                input.setAttribute('value', value);
                document.body.appendChild(input);
                input.select();
                const result = document.execCommand('copy');
                document.body.removeChild(input);

                toast.success(text + "was copied!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }
    }
}

export default Table;