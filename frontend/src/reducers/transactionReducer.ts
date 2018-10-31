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

import { CHANGE_CARD_TAB, CHANGE_TRANSACTION } from "../actions/types";
import { ITransactionEntity } from '../model';

const INITIAL_STATE = (): ITransactionEntity => ({
    cardHeaderTab: {
        tab: [
            {
                active: true,
                controle: "tab-1",
                value: 'Normal',
            },
            {
                active: false,
                controle: "tab-2",
                value: "Tickets",
            },
            {
                active: false,
                controle: "tab-3",
                value: "Multisigs",
            },
            {
                active: false,
                controle: "tab-4",
                value: "Anon",
            }
        ]
    },
    select: false,
    subHeader: {
        filters: [
            {
                active: true,
                value: 'All'
            },
            {
                active: false,
                value: "Confirmed"
            },
            {
                active: false,
                value: "Pending"
            },
            {
                active: false,
                value: "Rejected"
            },
        ],
        title: 'Transaction',
    },
})

const TransactionReducer = (state = INITIAL_STATE(), action: any) => {
    switch (action.type) {
        case CHANGE_TRANSACTION:
            return {
                ...state,
                subHeader: {
                    ...state.subHeader,
                    filters: action.payload.newFilters
                }
            }
        case CHANGE_CARD_TAB:
            return {
                ...state,
                cardHeaderTab: {
                    ...state.cardHeaderTab,
                    tab: action.payload.newFilters
                }
            }
        default:
            return state;
    }
};

export default TransactionReducer;
