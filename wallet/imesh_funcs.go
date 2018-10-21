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

package wallet

import (
	"encoding/hex"

	"github.com/AidosKuneen/aklib/tx"
	"github.com/AidosKuneen/aknode/imesh"
	"github.com/AidosKuneen/akwallet/setting"
	"github.com/dgraph-io/badger"
)

//GetLeaves get leaves by RPC if needed.
func GetLeaves(cfg *setting.Setting) ([]tx.Hash, error) {
	var ls []string
	err := cfg.CallRPC(func(cl setting.RPCIF) error {
		var err2 error
		ls, err2 = cl.GetLeaves()
		return err2
	})
	lss := make([]tx.Hash, len(ls))
	for i := range ls {
		lss[i], err = hex.DecodeString(ls[i])
		if err != nil {
			return nil, err
		}
	}
	return lss, err
}

func sendtx(s *setting.Setting, tr *tx.Transaction) error {
	return s.CallRPC(func(cl setting.RPCIF) error {
		_, err2 := cl.SendRawTX(tr, tx.TypeNormal)
		return err2
	})
}

//PreviousOutput returns output refered by inputs by RPC if needed.
func PreviousOutput(conf *setting.Setting, in *tx.Input) (*tx.Output, error) {
	prev, err := imesh.GetTxInfo(conf.DB, in.PreviousTX)
	if err != nil {
		return nil, err
	}
	return prev.Body.Outputs[in.Index], nil
}

//PreviousMultiOutput returns multisig output refered by inputs by RPC if needed.
func PreviousMultiOutput(conf *setting.Setting, in *tx.MultiSigIn) (*tx.MultiSigOut, error) {
	prev, err := imesh.GetTxInfo(conf.DB, in.PreviousTX)
	if err != nil {
		return nil, err
	}
	return prev.Body.MultiSigOuts[in.Index], nil
}

func putTxFromRemote(conf *setting.Setting, h tx.Hash) error {
	var ntr *tx.Transaction
	err := conf.CallRPC(func(cl setting.RPCIF) error {
		var err2 error
		ntr, err2 = cl.GetRawTx(hex.EncodeToString(h))
		return err2
	})
	if err != nil {
		return err
	}
	return imesh.PutRawTxDirect(&conf.DBConfig, ntr)
}

//stores a tx with input txs for calling PutAddress.
//need to call the func for updating tx relations with addresses.
func putTx(conf *setting.Setting, tr *tx.Transaction) error {
	for _, inp := range tr.MultiSigIns {
		if _, err := imesh.GetTxInfo(conf.DB, inp.PreviousTX); err == nil {
			continue
		}
		if err := putTxFromRemote(conf, inp.PreviousTX); err != nil {
			return err
		}
	}
	for _, inp := range tr.Inputs {
		if _, err := imesh.GetTxInfo(conf.DB, inp.PreviousTX); err == nil {
			continue
		}
		if err := putTxFromRemote(conf, inp.PreviousTX); err != nil {
			return err
		}
	}
	if tr.TicketInput != nil {
		if _, err := imesh.GetTxInfo(conf.DB, tr.TicketInput); err != nil {
			if err2 := putTxFromRemote(conf, tr.TicketInput); err2 != nil {
				return err2
			}
		}

	}
	if err := imesh.PutRawTxDirect(&conf.DBConfig, tr); err != nil {
		return err
	}
	return conf.DB.Update(func(txn *badger.Txn) error {
		return imesh.PutAddressToTx(txn, tr)
	})
}
