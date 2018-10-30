import { AddressEntity } from '../model';
import { CHANGE_VIEW ,CHANGE_GRID_FLAG ,ADDRESS_VALUE,PUSH_ADDRESS_DATA} from '../actions/types';

const INITIAL_STATE = (): AddressEntity => ({
    subHeader: {
        title: 'My Address',
        views: [
            {
                active: true,
                value: "",
                className: 'icon-plus icon-big-2x align-middle'
            },
            {
                active: false,
                value: 'List',
                className: 'icon-list align-middle mr-2'
            },
            {
                active: true,
                value: "Grid",
                className: 'icon-grid align-middle mr-2'
            }
        ]
    },
    showGrid: true,
    addressValue:[]
    
})

const AddressReducer = (state = INITIAL_STATE(), action: any) => {
    switch (action.type) {
        case CHANGE_VIEW:
            return {
                ...state,
                subHeader: {
                    ...state.subHeader,
                    views: action.payload.newViews
                }
            }
        case CHANGE_GRID_FLAG:
            return { ...state, showGrid: action.payload.value }
        case ADDRESS_VALUE:
            return { ...state, addressValue: action.payload.addressValue }
        case PUSH_ADDRESS_DATA:
            console.log('reducer');
            console.log(action.payload.addressData)
            return { ...state, addressValue: state.addressValue.concat(action.payload.addressData ) }
        default:
            return state;
    }
};

export default AddressReducer;