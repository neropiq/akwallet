import { SHOW_POPUP,POPUP_VALUE} from './types';

interface Props {
    showPopup?: boolean;
    value?: boolean;
    popupvalue?:string
}

export const showPopup = ({ showPopup }: Props) => {
    console.log('pop up action');
    return {
        type:SHOW_POPUP,
        payload:{ showPopup }
    }
}

export const popupValue = ({ popupvalue }: Props) => {
    console.log('pop up value');
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

