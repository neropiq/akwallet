import { DashboardEntity } from '../model';
import { CHANGE_FILTER, CHANGE_SELECT }  from '../actions/types';

const INITIAL_STATE = (): DashboardEntity => ({
    subHeader: {
        title: 'My Wallet',
        filters: [
            {
                active: true,
                value: 'Daily'
            },
            {
                active: false,
                value: "Weekend"
            },
            {
                active: false,
                value: "Monthly"
            }
        ]
    },
    select: false
});

const DashboardReducer = (state = INITIAL_STATE(), action: any) => {
    switch (action.type) {
        case CHANGE_FILTER:
            return {
                ...state,
                subHeader: {
                    ...state.subHeader,
                    filters: action.payload.newFilters
                }
            }
        case CHANGE_SELECT:
            return { ...state, select: action.payload.value }
        default:
            return state;
    }
};

export default DashboardReducer;