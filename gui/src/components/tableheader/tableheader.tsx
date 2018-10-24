import * as React from 'react';

interface Props {
    header: string;
    menus: any;
    onSelectChange?: (value: any) => void;
}

interface DefaultProps {
    menus: any;
}


interface State {
    value?: any;
}

class TableHeader extends React.Component<Props, State> {
    constructor(props: Props) {    
        super(props);
        this.state = {  
            value: (this.props.menus.length === 0) || this.props.menus[0]
        };
    }

    static defaultProps: DefaultProps = {
        menus: []
    }

    componentDidMount() {
        if(this.props.menus.length !== 0) {
            this.props.onSelectChange(this.props.menus[0]);
        }
    }

    optionChange = (e: any) => {
        const value = e.target.value
        this.setState(() => ({
            value
        }));
        this.props.onSelectChange(value);
    }

    render() {
        return(
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
}

export default TableHeader;