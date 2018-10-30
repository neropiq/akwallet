import * as React from 'react';

interface Props {
    tab: any;
    settingTab: any;
    onCardChange?: (value: any) => void;
    onFilterChange?: (value: any) => void;
}

interface State {
    value: any;
}

interface DefaultProps {
    tab: any;
    settingTab: any;
}

class CardTab extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {  
            value: (this.props.tab.length === 0) || this.props.tab[0]
        };
    }
    
    static defaultProps: DefaultProps = {
        tab:[],
        settingTab:[]
    }

    componentDidMount() {
       
        if(this.props.tab.length !== 0){
            this.props.onCardChange(this.props.tab[0].value);
        }
        if(this.props.settingTab.length !== 0){
            this.props.onCardChange(this.props.settingTab[0].value);
        }
    }

    optionChange = (e: any) => {
        const value = e.target.value
        this.setState(() => ({
            value
        }));
        this.props.onFilterChange(value);    
    }

    render() {
        
        return(
            <div className="card-header py-4 px-0">                    
                {                        
                    (this.props.tab.length !== 0) &&
                    <ul className="nav nav-tabs custom-tabs px-4" id="myTab" role="tablist">
                        {   
                            this.props.tab.map((tab: any, index: number) => (
                                
                                <li className="nav-item" key={index}>
                                    <a className={tab.active ? "nav-link active" : "nav-link "}  
                                        id="tab1" data-toggle="tab" href="#" role="tab" 
                                        aria-controls={tab.controle} aria-selected={tab.active ? "true" : "false" }
                                        onClick={() =>this.props.onCardChange(tab.value)}>
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
                                        aria-controls={settingTab.controle} aria-selected={settingTab.active ? "true" : "false" }
                                        onClick={() =>this.props.onCardChange(settingTab.value)}>
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
}

export default CardTab;