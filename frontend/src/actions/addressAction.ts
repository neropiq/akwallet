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

import { ADDRESS_VALUE, CHANGE_ADDRESS_TAB, CHANGE_GRID_FLAG, CHANGE_VIEW, PUSH_ADDRESS_DATA } from './types';

interface IProps {
    value?: boolean;
    newView?: any;
    oldView?: any;
    addressValue?: any;
    addressData?: any;
    newFilter?: any;
    oldFilter?: any;
}

export const changeGridFlag = ({ value }: IProps) => {
    return {
        payload: { value },
        type: CHANGE_GRID_FLAG,
    }
}

export const changeAddressValue = (addressValue: IProps) => {

    return {
        payload: { addressValue },
        type: ADDRESS_VALUE,
    }
}

export const pushAddressValue = (addressData: IProps) => {

    return {
        payload: { addressData },
        type: PUSH_ADDRESS_DATA,
    }
}

export const changeView = ({ newView, oldView }: IProps) => {
    const newViews = oldView.map((view: any) => {
        if (view.value === newView || view.value === '') {
            return {
                ...view,
                active: true,
                value: view.value
            }
        }
        return {
            ...view,
            active: false,
            value: view.value
        };
    });
    return {
        payload: { newViews },
        type: CHANGE_VIEW,
    }
};


export const changeCardTabAddress = ({ newFilter, oldFilter }: IProps) => {

    const newFilters = oldFilter.map((filter: any) => {
        if (filter.value === newFilter) {
            return {
                active: true,
                value: filter.value
            }
        }
        return {
            active: false,
            value: filter.value
        };
    });
    return {
        payload: { newFilters },
        type: CHANGE_ADDRESS_TAB,
    }
};