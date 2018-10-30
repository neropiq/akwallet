import { CHANGE_FILTER, CHANGE_SELECT } from './types';

interface Props {
    value?: boolean;
    newFilter?: any;
    oldFilter?: any;
}

export const changeSelect = ({ value }: Props) => {
    return {
        type: CHANGE_SELECT,
        payload: { value }
    }
}

export const changeFilter = ({ newFilter, oldFilter }: Props) => {
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
        type: CHANGE_FILTER,
        payload: { newFilters }
    }
};
