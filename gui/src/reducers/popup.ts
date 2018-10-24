import { PopupEntity } from '../model';
import { SHOW_POPUP, POPUP_VALUE} from '../actions/types';
import { state } from './index';

const INITIAL_STATE = (): PopupEntity => ({    
    popup: false,
    popup_Value:''  
});

const PopUpReducer = (state = INITIAL_STATE(), action: any) => {
    switch (action.type) {
        // case SET_AUTHENTICATION: 
        //     return { ...state, isAuthenticated: action.payload.value }
        case SHOW_POPUP:
            return {...state, popup: action.payload.showPopup};
        case POPUP_VALUE:
            return {...state, popup_Value: action.payload.popupvalue};       
        default:
            return state;
    }
};

export default PopUpReducer;