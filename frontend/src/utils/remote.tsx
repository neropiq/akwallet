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

import { socket } from "../components/adminPanel/adminpanel";
import { IConfigEntity } from "../model";


export interface InOut {
    Address: string
    Value: number
}


// MultiSigOut is an multisig output in transactions.
export interface IMultiSigInOut {
    M: number
    Addresses: string[]
    Value: number
    Address: string
}

export interface ITxCommon {
    Inputs: InOut[]
    Minputs: IMultiSigInOut[]
    Outputs: InOut[]
    MOutputs: IMultiSigInOut[]
    TicketInput: string
    TicketOutput: string
    Message: string
    Recv: number
    Hash: string
    IsRejected: boolean
    IsConfirmed: boolean
    StatNo: string
}


// normalTxResp is information about a normal tx.
export interface INormalTxResp extends ITxCommon{
    Amount: number
}

// ticketResp is information about a ticket.
export interface IticketResp extends ITxCommon{
    Reason: number
}

// multisigResp is information about a multisig tx.
export interface ImultisigResp extends ITxCommon{
    Amount: number
    Address: string
}

// TxResp is a response to transactrion..
export interface ItxResp {
    NormalTx: INormalTxResp[]
    Ticket: IticketResp[]
    Multisig: ImultisigResp[]
    Error: string
}

export const txStat = (trr: { IsConfirmed: boolean, IsRejected: boolean }) => {
    let stat = "Pending"
    if (trr.IsConfirmed) {
        if (trr.IsRejected) {
            stat = "Rejected"
        } else {
            stat = "Confirmed"
        }
    }
    return stat
}

export const toTimestamp = (t: number) => {
    let a = new Date().getTime() / 1000 - t;
    if (a < 60) {
        return Math.floor(a) + " Seconds"
    }
    a /= 60
    if (a < 60) {
        return Math.floor(a) + " Minutes"
    }
    a /= 60
    if (a < 24) {
        return Math.floor(a) + " Hours"
    }
    a /= 24
    if (a < 365) {
        return Math.floor(a) + " Days"
    }
    a /= 365
    return Math.floor(a) + " Years"
}

export const formatDate = (unix: number) => {
    const date = new Date(unix * 1000)
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const h = date.getHours();
    const mi = date.getMinutes();
    const s = date.getSeconds();

    const sm = ('0' + m).slice(-2);
    const sd = ('0' + d).slice(-2);
    const sh = ('0' + h).slice(-2);
    const smi = ('0' + mi).slice(-2);
    const ss = ('0' + s).slice(-2);

    return y + "/" + sm + "/" + sd + " " + sh + ":" + smi + ":" + ss

}


export const toADK = (t: number) => {
    return t / 100000000
}

export const getTransactions = (con: boolean, no: number, f: (t: ItxResp) => void) => {
    if (!con) {
        return
    }
    socket.emit("get_transactions", no, f)
}


export const version = (con: boolean, f: (t: string) => void) => {
    if (!con) {
        return
    }
    socket.emit("version", null, f)
}

export interface Iaddress {
    Address: string,
    Error: string
}

export const register = (con: boolean, pwd: string, f: (t: Iaddress) => void) => {
    if (!con) {
        return
    }

    socket.emit("register", pwd, f)
}


export interface ILogin {
    PrivKey: string,
    Password: string,
}


export const login = (con: boolean, t: ILogin, f: (t: string) => void) => {
    if (!con) {
        return
    }
    socket.emit("login", t, f)
}

export interface Ibalance {
    Avail: number;
    Recv: number;
    Sent: number;
    Ticket: number;
    Error: string;
}

export const getBalance = (con: boolean, span: number, f: (t: Ibalance) => void) => {
    if (!con) {
        return
    }
    socket.emit("get_balance", span, f)
}
export interface INewAddress {
    Address: string
    Error: string
}
export const getNewaddress = (con: boolean, f: (t: INewAddress) => void) => {
    if (!con) {
        return
    }
    socket.emit("get_newaddress", null, f)
}

export interface IaddressRecv {
    String: string
    Recv: number
    Sent: number
}
export interface IAddress {
    Normal: IaddressRecv[]
    Multisig: IaddressRecv[]
    Error: string
}

export const getAddresses = (con: boolean, f: (t: IAddress) => void) => {
    if (!con) {
        return
    }
    socket.emit("get_addresses", null, f)
}

export interface IRawOutput {
    Address: string
    Value: number
}
export interface IBuildParam {
    Comment: string
    Dest: IRawOutput[]
    PoWType: number
    Fee: number
}
export const send = (con: boolean, tr: IBuildParam, f: (t: string) => void) => {
    if (!con) {
        return
    }
    socket.emit("send", tr, f)
}
export const cancelPow = (con: boolean, f: (t: string) => void) => {
    if (!con) {
        return
    }
    socket.emit("cancel_pow", null, f)
}
export const validateAddresses = (con: boolean, adr: string[], f: (t: string[]) => void) => {
    if (!con) {
        return
    }
    socket.emit("validate_addresses", adr, f)
}
export const getSettings = (con: boolean, f: (t: IConfigEntity) => void) => {
    if (!con) {
        return
    }
    socket.emit("get_settings", null, f)
}

export interface INodeInfo {
    version: string
    protocolVersion: number
    walletversion: number
    connections: number
    proxy: string
    testnet: number
    keypoolsize: number
    leaves: number
    time: number
    txno: number
    latest_ledger: string
    latest_ledger_no: number
    Error: string
}

export const getNodeinfo = (con: boolean, n: number, f: (t: INodeInfo) => void) => {
    if (!con) {
        return
    }
    socket.emit("get_nodeinfo", n, f)
}


export const getNodesstatus = (con: boolean, f: (t: boolean[]) => void) => {
    if (!con) {
        return
    }
    socket.emit("get_nodesstatus", null, f)
}

export const updateServer = (con: boolean, svrs: string[], f: (t: string) => void) => {
    if (!con) {
        return
    }
    socket.emit("update_server", svrs, f)
}
export interface IMinerSetting {
    MinimumFee: number
    RunFeeMiner: boolean
    RunTicketMiner: boolean
    RunTicketIssuer: boolean
}

export const updateMinerSetting = (con: boolean, s: IMinerSetting, f: (t: string) => void) => {
    if (!con) {
        return
    }
    socket.emit("update_miner_setting", s, f)
}


export interface IOldAmount {
    Amount: number
    Error: string
}
export const getOldbalance = (con: boolean, seed: string, f: (t: IOldAmount) => void) => {
    if (!con) {
        return
    }
    socket.emit("get_oldbalance", seed, f)
}

export interface IClaimParam {
    Amount: number
    Seed: string
}
export const claim = (con: boolean, no: IClaimParam, f: (t: string) => void) => {
    if (!con) {
        return
    }
    socket.emit("claim", no, f)
}




export const logout = (con: boolean, ) => {
    if (!con) {
        return
    }
    socket.emit("logout", null, () => { return })
}

export interface Iprivatekeys {
    PKs: string[]
    Error: string
}
export const allPrivkeys = (con: boolean, f: (t: Iprivatekeys) => void) => {
    if (!con) {
        return
    }
    socket.emit("all_privkeys", null, f)
}


export const nets = [
    "MainNet", "TestNet", "DebugNet"
]

export const isUpdated = (s1: string[], s2: string[]) => {
    if (s1.length !== s2.length) {
        return true
    }
    s1.map((a: string, i: number) => {
        if (a !== s2[i]) {
            return true
        }
    })
    return false
}