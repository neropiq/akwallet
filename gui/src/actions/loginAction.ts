import { SHOW_LOGIN , SET_AUTHENTICATION , SET_TERMS ,SET_TERMS_SIGNUP} from './types';

interface Props {
    showLogin?: boolean;
    value?: boolean;
    chackedLoginTerms?: boolean;
    chackedSignupTerms?:boolean;
}

export const showLogin = ({ showLogin }: Props) => {
    return {
        type:SHOW_LOGIN,
        payload:{ showLogin }
    }
}

export  const setAuths = ({ value }: Props) => {
    return {
        type: SET_AUTHENTICATION,
        payload: { value }
    }
}


export  const setCheckLoginTerms = ({ chackedLoginTerms }: Props) => {    
    return {
        type: SET_TERMS,
        payload: { chackedLoginTerms }
    }
}

export  const setCheckSignupTerms = ({ chackedSignupTerms }: Props) => {        
    return {
        type: SET_TERMS_SIGNUP,
        payload: { chackedSignupTerms }
    }
}