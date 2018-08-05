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

import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import BeenhereIcon from '@material-ui/icons/Beenhere';
import ClearIcon from '@material-ui/icons/Clear';
import InfoIcon from '@material-ui/icons/Info';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import PersonIcon from '@material-ui/icons/PersonAdd';
import QuestionAnswer from '@material-ui/icons/QuestionAnswer';
import SendIcon from '@material-ui/icons/Send';
import SettingsIcon from '@material-ui/icons/SettingsApplications';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import TransformIcon from '@material-ui/icons/Transform';
import * as React from 'react';
import FAQ from "./FAQ"
import Login from "./Login"
import Migration from "./Migration"
import MyAddress from "./MyAddress"
import MyWallet from "./MyWallet"
import NodeStatus from "./NodeStatus"
import Register from "./Register"
import Send from "./Send"
import Setting from "./Setting"
import Terms from "./Terms"
import Transaction from "./Transaction"
import TxDetails from "./TxDetails"


interface Iinfo{
    app: any,
    icon: JSX.Element,
    path:string,
}

interface Iapps {
    [index: string]: Iinfo;
}

export const logout:Iinfo={
        app: Login,
        icon: <ClearIcon />,
        path:"login",
}

export const apps: Iapps = {
    "FAQ": {
        app: FAQ,
        icon: <QuestionAnswer />,
        path:"faq",
    },
    "Login": {
        app: Login,
        icon: < InboxIcon />,
        path:"login",
    },
    "Migration": {
        app: Migration,
        icon: <TransformIcon />,
        path:"migration",
    },
    "My Addresses": {
        app: MyAddress,
        icon: <LibraryBooksIcon />,
        path:"myaddress",
    },
    "My Wallet": {
        app: MyWallet,
        icon: <AccountBalanceWalletIcon />,
        path:"mywallet",
    },
    "Node Status": {
        app: NodeStatus,
        icon: <InfoIcon />,
        path:"node_status",
    },
    "Register": {
        app: Register,
        icon: <PersonIcon />,
        path:"register",
    },
    "Send": {
        app: Send,
        icon: <SendIcon />,
        path:"send",
    },
    "Setting": {
        app: Setting,
        icon: <SettingsIcon />,
        path:"setting",
    },
    "Terms": {
        app: Terms,
        icon: <BeenhereIcon />,
        path:"terms",
    },
    "Transactions": {
        app: Transaction,
        icon: <SwapHorizIcon />,
        path:"transaction",
    },
    "Tx Details": {
        app: TxDetails,
        icon: <SwapHorizIcon />,
        path:"tx_details",
    },
}
