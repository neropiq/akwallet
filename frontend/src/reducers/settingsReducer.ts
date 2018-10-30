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

import { CHANGE_CARD_TAB_SETTING, MIGRATION_POPUP } from "../actions/types";
import { ISettingsEntity } from '../model';

const INITIAL_STATE = (): ISettingsEntity => ({
    Migration_popup: false,
    cardSettingTab: {
        settingTab: [
            {
                active: true,
                controle: "tab-1",
                value: 'Mining',
            },
            {
                active: false,
                controle: "tab-2",
                value: "Servers",
            },
            {
                active: false,
                controle: "tab-3",
                value: "Migration",
            },
            {
                active: false,
                controle: "tab-4",
                value: "Node Status",
            },
            {
                active: false,
                controle: "tab-4",
                value: "FAQ",
            },
            {
                active: false,
                controle: "tab-4",
                value: "About",
            }
        ]
    },
    select: false,
    title: 'Settings',
})

const SettingReducer = (state = INITIAL_STATE(), action: any) => {
    switch (action.type) {
        // case CHANGE_SETTINGS:
        //     return {
        //         ...state,
        //         subHeader: {
        //             ...state.subHeader,
        //             filters: action.payload.newFilters
        //         }
        //     }
        case CHANGE_CARD_TAB_SETTING:
            return {
                ...state,
                cardSettingTab: {
                    ...state.cardSettingTab,
                    settingTab: action.payload.newFilters
                }
            }
        case MIGRATION_POPUP:
            return {
                ...state,
                Migration_popup: action.payload.chackedMigractionPopup
            }
        default:
            return state;
    }
};

export default SettingReducer;