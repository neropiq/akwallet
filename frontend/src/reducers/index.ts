import { combineReducers } from 'redux';
import { PopupEntity,LoginEntity, DashboardEntity, AddressEntity, TransactionEntity, SettingsEntity, SendAdkEntity } from '../model';
import { reducer as formReducer } from 'redux-form'
import DashboardReducer from './dashboardReducer';
import LoginReducer from './loginReducer';
import AddressReducer from './addressReducer';
import TransactionReducer from './transactionReducer';
import SettingReducer from './settingsReducer';
import SendAdkReducer from './sendAdkReducer';
import PopUpReducer from './popup';

export interface State {
  login: LoginEntity;
  dashboard: DashboardEntity;
  address: AddressEntity;
  form: any;
  transaction: TransactionEntity;
  setting: SettingsEntity;
  sendAdk: SendAdkEntity;
  popup:PopupEntity;
};

export const state = combineReducers<State>({
  login: LoginReducer,
  dashboard: DashboardReducer,
  address: AddressReducer,
  form: formReducer,
  transaction: TransactionReducer,
  setting: SettingReducer,
  sendAdk: SendAdkReducer,
  popup: PopUpReducer
});