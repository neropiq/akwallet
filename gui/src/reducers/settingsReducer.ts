import { SettingsEntity } from '../model';
import {  CHANGE_SETTINGS , CHANGE_CARD_TAB_SETTING ,MIGRATION_POPUP } from "../actions/types";

const INITIAL_STATE = (): SettingsEntity => ({
    cardSettingTab:{
        title:'Settings',
        settingTab: [
            {
                active: true,
                value: 'Mining',
                controle:"tab-1"
            },
            {
                active: false,
                value: "Servers",
                controle:"tab-2"
            },
            {
                active: false,
                value: "Migration",
                controle:"tab-3"
            },
            {
                active: false,
                value: "Node Status",
                controle:"tab-4"
            },
            {
                active: false,
                value: "FAQ",
                controle:"tab-4"
            },
            {
                active: false,
                value: "Terms",
                controle:"tab-4"
            }
        ]
    },
    select: false,
    Migration_popup:false
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
                Migration_popup:action.payload.chackedMigractionPopup
            }
        default:
            return state;
    }
};

export default SettingReducer;