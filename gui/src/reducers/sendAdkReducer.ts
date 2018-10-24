import { SendAdkEntity } from '../model';
import { SET_LOADING } from '../actions/types';

const INITIAL_STATE = (): SendAdkEntity => ({
    loading: false
});

const LoginReducer = (state = INITIAL_STATE(), action: any) => {
    switch (action.type) {
        case SET_LOADING: 
            return { ...state, loading: action.payload.value }
        default:
            return state;
    }
};

export default LoginReducer;