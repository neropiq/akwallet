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

import { CHANGE_CARD_TAB_SETTING , MIGRATION_POPUP} from './types';

interface IProps {
    newFilter?: any;
    oldFilter?: any;
    chackedMigractionPopup?:any;
}

export const changeCardTabSetting = ({ newFilter, oldFilter }: IProps) => {
    const newFilters = oldFilter.map((filter: any) => {
        if(filter.value === newFilter) {
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
        type: CHANGE_CARD_TAB_SETTING,
    }
};

export  const setMigrationPopUp = ({ chackedMigractionPopup }: IProps) => {        
    return {
        payload: { chackedMigractionPopup },
        type: MIGRATION_POPUP,
    }
}