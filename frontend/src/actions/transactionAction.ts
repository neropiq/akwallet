import { CHANGE_TRANSACTION, CHANGE_SELECT ,CHANGE_CARD_TAB } from './types';

interface Props {
    value?: boolean;
    newFilter?: any;
    oldFilter?: any;
}

// export const changeSelect = ({ value }: Props) => {
//     return {
//         type: CHANGE_SELECT,
//         payload: { value }
//     }
// }

export const changeFilterTransaction = ({ newFilter, oldFilter }: Props) => {
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
        type: CHANGE_TRANSACTION,
        payload: { newFilters }
    }
};

export const changeCardTabTransaction = ({ newFilter, oldFilter }: Props) => {
    
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
        type: CHANGE_CARD_TAB,
        payload: { newFilters }
    }
};

