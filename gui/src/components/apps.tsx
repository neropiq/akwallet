import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import BeenhereIcon from '@material-ui/icons/Beenhere';
import ClearIcon from '@material-ui/icons/Clear';
import InfoIcon from '@material-ui/icons/Info';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import PersonIcon from '@material-ui/icons/PersonAdd';
import QuestionAnswer from '@material-ui/icons/QuestionAnswer';
import SendIcon from '@material-ui/icons/Send';
import SettingsIcon from '@material-ui/icons/Settings';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import * as React from 'react';
import Address from "./Address"
import FAQ from "./FAQ"
import Login from "./Login"
import MyWallet from "./MyWallet"
import NodeStatus from "./NodeStatus"
import Register from "./Register"
import Send from "./Send"
import Setting from "./Setting"
import Terms from "./Terms"
import Transaction from "./Transaction"


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
    "Address": {
        app: Address,
        icon: <LibraryBooksIcon />,
        path:"address",
    },
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
    "Transaction": {
        app: Transaction,
        icon: <SwapHorizIcon />,
        path:"transaction",
    },
}
