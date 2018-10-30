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

import { POPUP_VALUE, SHOW_POPUP} from '../actions/types';
import { IPopupEntity } from '../model';
import { state } from './index';

const INITIAL_STATE = (): IPopupEntity => ({    
    popup: false,
    popup_Value:''  
});

const PopUpReducer = (statee = INITIAL_STATE(), action: any) => {
    switch (action.type) {
        // case SET_AUTHENTICATION: 
        //     return { ...state, isAuthenticated: action.payload.value }
        case SHOW_POPUP:
            return {...statee, popup: action.payload.showPopup};
        case POPUP_VALUE:
            return {...statee, popup_Value: action.payload.popupvalue};       
        default:
            return statee;
    }
};

export default PopUpReducer;