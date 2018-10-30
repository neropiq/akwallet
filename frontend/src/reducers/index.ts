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

import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'
import { UPDATE_CONNECTED } from '../actions/types';
import { IAddressEntity, IConfigEntity,IDashboardEntity, ILoginEntity, IPopupEntity, ISendAdkEntity, ISettingsEntity, ISignupEntity, ITransactionEntity } from '../model';
import AddressReducer from './addressReducer';
import ConfigReducer from './configReducer';
import DashboardReducer from './dashboardReducer';
import LoginReducer from './loginReducer';
import PopUpReducer from './popup';
import SendAdkReducer from './sendAdkReducer';
import SettingReducer from './settingsReducer';
import SignupReducer from './signupReducer';
import TransactionReducer from './transactionReducer';


const ConnectedReducer = (statee = false, action: any) => {
  switch (action.type) {
      case UPDATE_CONNECTED:
          return  action.payload 
      default:
          return statee;
  }
};

export interface IStoreState {
  signup: ISignupEntity;
  login: ILoginEntity;
  dashboard: IDashboardEntity;
  address: IAddressEntity;
  form: any;
  transaction: ITransactionEntity;
  setting: ISettingsEntity;
  sendAdk: ISendAdkEntity;
  popup:IPopupEntity;
  config:IConfigEntity;
  connected:boolean;
};

export const state = combineReducers<IStoreState>({
  address: AddressReducer,
  config:ConfigReducer,
  connected:ConnectedReducer,
  dashboard: DashboardReducer,
  form: formReducer,
  login: LoginReducer,
  popup: PopUpReducer,
  sendAdk: SendAdkReducer,
  setting: SettingReducer,
  signup:SignupReducer,
  transaction: TransactionReducer,
});
