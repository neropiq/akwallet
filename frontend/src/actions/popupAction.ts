// Copyright (c) 2018 Aidos Developer

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import { POPUP_VALUE,SHOW_POPUP} from './types';

interface IProps {
    showPopup?: boolean;
    value?: boolean;
    popupvalue?:string
}

export const showPopup = ({ showPopup:sp }: IProps) => {
    console.log('pop up action');
    return {
        payload:{ sp },
        type:SHOW_POPUP,
    }
}

export const popupValue = ({ popupvalue }: IProps) => {
    console.log('pop up value');
    return {
        payload:{ popupvalue },
        type:POPUP_VALUE,
    }
}

// export  const setAuths = ({ value }: Props) => {
//     return {
//         type: SET_AUTHENTICATION,
//         payload: { value }
//     }
// }

