import { SHOW_POPUP,POPUP_VALUE} from './types';

interface Props {
    showPopup?: boolean;
    value?: boolean;
    popupvalue?:string
}

export const showPopup = ({ showPopup }: Props) => {
   
    return {
        type:SHOW_POPUP,
        payload:{ showPopup }
    }
}

export const popupValue = ({ popupvalue }: Props) => {
   
    return {
        type:POPUP_VALUE,
        payload:{ popupvalue }
    }
}



// export  const setAuths = ({ value }: Props) => {
//     return {
//         type: SET_AUTHENTICATION,
//         payload: { value }
//     }
// }

