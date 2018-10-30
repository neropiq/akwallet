import * as React from 'react';

interface Props {
    tables: any;
}

class Table extends React.Component<Props> {
    componentDidMount(){
        // window.initCustomScrollbar();
        // $('.card-body').mCustomScrollbar;
    }
    
    render() {
        return(
            <div className="card-body px-4 py-0">
                <div className="table-responsive custom-table-theme scroll-table ">
                    <table className="table table-hover text-center">
                    
                        <thead>
                            <tr>
                                {
                                    this.props.tables.fields.map((field: string, index: number) => <th scope="col" key={index}>{field}</th>)
                                }
                            </tr>
                        </thead>
                        <tbody >
                            {
                                this.props.tables.data.map((rows: any, index: number) => (
                                    <tr key={index}>
                                        {
                                            rows.map((row: string, index: number) => <td className="td-set" key={index} title={row}><span>{row}</span></td>)
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
}

export default Table;