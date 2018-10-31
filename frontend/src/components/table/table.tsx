import * as React from 'react';
import { ToastContainer, toast } from 'react-toastify';
interface Props {
    tables: any;
    componentsName:any;
    transactionClick?: (value:any) => void;
}

class Table extends React.Component<Props> {
    componentDidMount(){
        // window.initCustomScrollbar();
        
    }
    transactionClick = () =>{
              
        var data = {
            input:{
                value1:'00.0012',
                data:'ajksdhfuiashdfjkasdfhjksdfhajksdhfuiashdfjkasdfhjksdfhajksdhfuiashdfjkasdfhjksdfh'
            },
            output:{
                value1:'1.0000',
                data:'ajksdhfuiashdfjkasdfhjksdfhajksdhfuiashdfjkasdfhjksdfhajksdhfuiashdfjkasdfhjksdfh'
            }
        }
        if(this.props.componentsName == 'transaction'){
            this.props.transactionClick(data);
        }
    }

    copyText(value:any,text:any){
        if(text == 'From Address' || text == 'To Address'){
            console.log('address copy');
            var input = document.createElement('input');
            input.setAttribute('value', value);
            document.body.appendChild(input);
            input.select();
            var result = document.execCommand('copy');
            document.body.removeChild(input);
            
            toast.success( text +" copy!", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
                
        
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
                                    <tr key={index} onClick={this.transactionClick}>
                                        {
                                            rows.map((row: string, index: number) => <td className="td-set" key={index} onClick={()=>this.copyText(row,this.props.tables.fields[index])} title={row} ><span >{row}</span></td>)
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