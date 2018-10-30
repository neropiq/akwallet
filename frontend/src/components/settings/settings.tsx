import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { State } from '../../reducers';
import { Dispatch } from 'redux';
import SubHeader from '../subheader/subheader';
import CardTab from '../cardTab/cardTab';
// import './../../assets/css/jquery.mCustomScrollbar.css';
import Mining from './mining';
import Migration from './migration';
import NodeStatus from './nodestatus';
import FAQ from './faq';
import Terms from './terms';
import Server from './server';

interface changeCardTabSettingProps {
    newFilter: any;
    oldFilter: any;
}

interface Props {
    title: string;
    settingTab: any;
    changeCardTabSetting: ({ newFilter, oldFilter }: changeCardTabSettingProps) => void;
}

class Setting extends React.Component<Props> {
    
    componentDidMount() {       
        document.title = "Setting || Aidos Wallet";
        $('#migrate').removeClass('active');
    }

    onCardChange = (newFilter: any) => {
        this.props.changeCardTabSetting({ newFilter, oldFilter: this.props.settingTab });
    }

    render() {
        
        return (
            <div>
                <div className="page-content-wrapper my-address-page">
                    <div className="page-content">
                        {/*Main Page Content*/}
                        <SubHeader title={this.props.title}  />
                        <div className="row settings-card transactions-card">
                            <div className="col-12">
                                <div className="card-height card bg-dark-green black-shadow mCustomScrollbar" data-mcs-theme="dark">
                                    <div className="cad-table-content">
                                        <CardTab settingTab={this.props.settingTab} onCardChange={this.onCardChange}/>
                                    </div>
                                    <div className="card-body">                                    
                                        <div className="tab-content" id="myTabContent">
                                            {
                                                this.props.settingTab.map((value: any, index: number)=>{                                                   
                                                    if(value.value == "Mining" && value.active == true){
                                                        return (  <Mining key={index} /> )
                                                    }
                                                    if(value.value == "Servers" && value.active == true){
                                                        return (  <Server key={index} /> )
                                                    }
                                                    if(value.value == "Migration" && value.active == true ){    
                                                        return (<Migration key={index} />)
                                                    }
                                                    if(value.value == "Node Status" && value.active == true ){
                                                        return (<NodeStatus key={index} />)
                                                    }
                                                    if(value.value == "FAQ" && value.active == true){
                                                        return (<FAQ key={index} />)
                                                    }
                                                    if(value.value == "Terms" && value.active == true){
                                                        return (<Terms key={index} />)
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
}

    
export const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        changeCardTabSetting: ({ newFilter, oldFilter }: changeCardTabSettingProps) => dispatch(actions.changeCardTabSetting({ newFilter, oldFilter })),
    }
  }
  
  export const mapStateToProps = (state: State) => {
    const { title , settingTab} = state.setting.cardSettingTab;
    return { title,  settingTab};
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(Setting);
