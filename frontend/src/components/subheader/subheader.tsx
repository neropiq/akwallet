import * as React from 'react';


interface Props {
    title?: string;
    filters?: any;
    transaction?: any;
    views?: any;
    onFilterChange?: (value: any) => void;
    onTrancationFilterChange?: (value: any) => void;
    onViewChange?: (value: any) => void;
}

interface State {
    value?: any;
    trancactionValue?: any;
}

interface DefaultProps {
    filters: any;
    views: any;
    transaction: any;
}

class SubHeader extends React.Component<Props, State> {
    constructor(props: Props) {
        
        super(props);
        this.state = {  
            value: (this.props.filters.length === 0) || this.props.filters[0] ,
            trancactionValue: (this.props.filters.length === 0) || this.props.filters[0] 
        };
      
        // window.onclick = function(event) {
           
        // }
    }

    static defaultProps: DefaultProps = {
        filters: [],
        views: [],
        transaction:[]
    }
    
    componentDidMount() {
        if(this.props.filters.length !== 0) {
            this.props.onFilterChange(this.props.filters[0].value);
        }
        if(this.props.transaction.length !== 0){
            this.props.onTrancationFilterChange(this.props.transaction[0].value);
        }
    }

    optionChange = (e: any) => {
        const value = e.target.value
        this.setState({
            value:value
        });
        this.props.onFilterChange(value);
    }

    onTrancationChange = (e: any) =>{
        const value = e.target.value        
        this.setState({
            trancactionValue:value
        });
        this.props.onTrancationFilterChange(value);
    }

    render() {
        return(
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
                                            onClick={() => this.props.onFilterChange(filter.value)}
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
                                            onClick={() =>this.props.onTrancationFilterChange(filter.value)}
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
                                        this.props.views.map((view: any,index: number)=> (
                                            <li className={view.active ? "active" : ""} key={index} >
                                                <a href="#"  onClick={() => this.props.onViewChange(view.value)}>
                                                    <i className={view.className}></i>
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
}

export default SubHeader;