import { TransactionEntity } from '../model';
import {  CHANGE_TRANSACTION , CHANGE_CARD_TAB } from "../actions/types";

const INITIAL_STATE = (): TransactionEntity => ({
    subHeader: {
        title: 'Transaction',
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
                value: "Rejected"
            },
            {
                active: false,
                value: "Pending"
            }
        ]
    },
    cardHeaderTab:{
        tab: [
            {
                active: true,
                value: 'Normal',
                controle:"tab-1"
            },
            {
                active: false,
                value: "Tickets",
                controle:"tab-2"
            },
            {
                active: false,
                value: "Multisigs",
                controle:"tab-3"
            },
            {
                active: false,
                value: "Anon",
                controle:"tab-4"
            }
        ]
    },
    select: false
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