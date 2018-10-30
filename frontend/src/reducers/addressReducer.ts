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

import { ADDRESS_VALUE ,CHANGE_ADDRESS_TAB ,CHANGE_GRID_FLAG,CHANGE_VIEW,PUSH_ADDRESS_DATA} from '../actions/types';
import { IAddressEntity } from '../model';

const INITIAL_STATE = (): IAddressEntity => ({
    addressValue:[],
    cardHeaderTab:{
        tab: [
            {
                active: true,
                controle:"tab-1",
                value: 'Normal',
            },           
            {
                active: false,
                controle:"tab-3",
                value: "Multisigs",
            },
            {
                active: false,
                controle:"tab-4",
                value: "Anon",
            }
        ]
    },
    showGrid: true,
    subHeader: {
        title: 'My Address',
        views: [
            {
                active: true,
                className: 'icon-plus icon-big-2x align-middle',
                value: "",
            },
            {
                active: false,
                className: 'icon-list align-middle mr-2',
                value: 'List',
            },
            {
                active: true,
                className: 'icon-grid align-middle mr-2',
                value: "Grid",
            }
        ]
    },
 
})

const AddressReducer = (state = INITIAL_STATE(), action: any) => {
    switch (action.type) {
        case CHANGE_VIEW:
            return {
                ...state,
                subHeader: {
                    ...state.subHeader,
                    views: action.payload.newViews
                }
            }
        case CHANGE_GRID_FLAG:
            return { ...state, showGrid: action.payload.value }
        case ADDRESS_VALUE:
            return { ...state, addressValue: action.payload.addressValue }
        case PUSH_ADDRESS_DATA:
            
            return { ...state, addressValue: state.addressValue.concat(action.payload.addressData ) }
        case CHANGE_ADDRESS_TAB:
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

export default AddressReducer;