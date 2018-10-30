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

import { SET_AUTHENTICATION, SHOW_LOGIN, UPDATE_PRIVKEYS } from '../actions/types';
import { ILoginEntity } from '../model';

const INITIAL_STATE = (): ILoginEntity => ({
    isAuthenticated: false,
    login: true,
    privkeys: [],
});

const LoginReducer = (state = INITIAL_STATE(), action: any) => {
    switch (action.type) {
        case SET_AUTHENTICATION:
            return { ...state, isAuthenticated: action.payload.value }
        case SHOW_LOGIN:
            return { ...state, login: action.payload.showLogin };
        case UPDATE_PRIVKEYS:
            return { ...state, privkeys: action.payload };
        default:
            return state;
    }
};

export default LoginReducer;