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

import { UPDATE_CONFIG } from '../actions/types';
import { IConfigEntity } from '../model';

const INITIAL_STATE = (): IConfigEntity => ({
    MinimumFee: 0,
    RunFeeMiner: false,
    RunTicketIssuer: false,
    RunTicketMiner: false,
    Servers: [],
    Testnet: 0,
    Version: "",
});

const ConfigReducer = (state = INITIAL_STATE(), action: any) => {
    switch (action.type) {
        case UPDATE_CONFIG:
            console.log(action.payload)
            return action.payload 
        default:
            return state;
    }
};

export default ConfigReducer;