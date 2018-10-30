import { CHANGE_VIEW , CHANGE_GRID_FLAG ,ADDRESS_VALUE,PUSH_ADDRESS_DATA} from './types';

interface Props {
    value?: boolean;
    newView?: any;
    oldView?: any;
    addressValue?: any;
    addressData?: any;
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
