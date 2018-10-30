import { CHANGE_VIEW , CHANGE_GRID_FLAG ,ADDRESS_VALUE,PUSH_ADDRESS_DATA,CHANGE_ADDRESS_TAB} from './types';

interface Props {
    value?: boolean;
    newView?: any;
    oldView?: any;
    addressValue?: any;
    addressData?: any;
    newFilter?:any;
    oldFilter?:any;
}

export const changeGridFlag = ({ value }: Props) => {
    return {
        type: CHANGE_GRID_FLAG,
        payload: { value }
    }
}

export const changeAddressValue = ( addressValue : Props) => {
    
    return {
        type: ADDRESS_VALUE,
        payload: { addressValue }
    }
}

export const pushAddressValue = ( addressData : Props) => {
    
    return {
        type: PUSH_ADDRESS_DATA,
        payload: { addressData }
    }
}

export const changeView = ({ newView, oldView }: Props) => {
    const newViews = oldView.map((view: any) => {
        if(view.value === newView || view.value === '') {
            return {
                ...view,
                active: true,
                value: view.value
            }
        }
        return {
            ...view,
            active: false,
            value: view.value
        };
    });
    return {
        type: CHANGE_VIEW,
        payload: { newViews }
    }
};


export const changeCardTabAddress = ({ newFilter, oldFilter }: Props) => {
    
    const newFilters = oldFilter.map((filter: any) => {
        if(filter.value === newFilter) {
            return {
                active: true,
                value: filter.value
            }
        }
        return {
            active: false,
            value: filter.value
        };
    });
    return {
        type: CHANGE_ADDRESS_TAB,
        payload: { newFilters }
    }
};