import { LoginEntity } from '../model';
import { SHOW_LOGIN, SET_AUTHENTICATION , SET_TERMS , SET_TERMS_SIGNUP} from '../actions/types';
import { state } from './index';

const INITIAL_STATE = (): LoginEntity => ({
    isAuthenticated: false,
    login: true,
    isLoginTerms:false,
    isSignupTerms:false,
});

const LoginReducer = (state = INITIAL_STATE(), action: any) => {
    switch (action.type) {
        case SET_AUTHENTICATION: 
            return { ...state, isAuthenticated: action.payload.value }
        case SHOW_LOGIN:
            return {...state, login: action.payload.showLogin};
        case SET_TERMS:
            return {...state,isLoginTerms:action.payload.chackedLoginTerms}
        case SET_TERMS_SIGNUP:
            return {...state,isSignupTerms:action.payload.chackedSignupTerms}
        default:
            return state;
    }
};

export default LoginReducer;