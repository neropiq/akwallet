import { CHANGE_CARD_TAB_SETTING , MIGRATION_POPUP} from './types';

interface Props {
    newFilter?: any;
    oldFilter?: any;
    chackedMigractionPopup?:any;
}

export const changeCardTabSetting = ({ newFilter, oldFilter }: Props) => {
    
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
        type: CHANGE_CARD_TAB_SETTING,
        payload: { newFilters }
    }
};

export  const setMigrationPopUp = ({ chackedMigractionPopup }: Props) => {        
    return {
        type: MIGRATION_POPUP,
        payload: { chackedMigractionPopup }
    }
}