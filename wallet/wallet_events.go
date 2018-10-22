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
	"bytes"
	"errors"
	"sort"
	"time"

	"github.com/AidosKuneen/aklib/address"
	"github.com/AidosKuneen/aklib/tx"
	"github.com/AidosKuneen/aknode/imesh"
	"github.com/AidosKuneen/aknode/walletImpl"
	"github.com/AidosKuneen/akwallet/setting"
	"github.com/AidosKuneen/gadk"
	"github.com/dgraph-io/badger"
)

//                               999999999999999999999999999999999999999999999999999999999999999999999999999999999
const pobAddress gadk.Address = "PROOF9OF9BURN9FOR9MIGRATING9TO9NEW9AKWALLET9BY9SIIKUIN9AKA9ANONYMOUSCOWARD9HEHEHE"

//loginParam is a param for login.
type loginParam struct {
	PrivKey  string
	Password string
}

//login is for logging event in the wallet.
func login(cfg *setting.Setting, param *loginParam) error {
	mutex.Lock()
	defer mutex.Unlock()
	_, isNode, err := address.HDFrom58(cfg.Config, param.PrivKey, []byte(param.Password))
	if err != nil {
		return err
	}
	if isNode {
		return errors.New("invalidd private key")
	}
	err = Load(cfg, []byte(param.Password), param.PrivKey)
	if err != badger.ErrKeyNotFound {
		return err
	}
	return New(cfg, []byte(param.Password), param.PrivKey)
}

//balance represents available coins, received coins and sent coins.
type balance struct {
	Avail  int64
	Recv   int64
	Sent   int64
	Ticket int64
}

//getBalance returns a total balance  received/sent amount in the span in the wallet.
//span:
//All=0
//monthly = 1
//Weekly = 2
func getBalance(cfg *setting.Setting, span byte) (*balance, error) {
	mutex.RLock()
	defer mutex.RUnlock()

	var from time.Time
	if span == 1 {
		from = time.Now().AddDate(0, 0, -7)
	}
	if span == 2 {
		from = time.Now().AddDate(0, -1, 0)
	}

	hs, err := walletImpl.GetHistory(&cfg.DBConfig)
	if err != nil {
		return nil, err
	}
	sort.Slice(hs, func(i, j int) bool {
		return bytes.Compare(hs[i].Hash, hs[j].Hash) < 0
	})
	var b balance
	var prev tx.Hash
	for _, h := range hs {
		if h.Received.Before(from) {
			continue
		}
		tr, err := imesh.GetTxInfo(cfg.DB, h.Hash)
		if err != nil {
			return nil, err
		}
		if !tr.IsAccepted() {
			continue
		}
		switch h.Type {
		case tx.TypeTicketin:
			b.Ticket--
		case tx.TypeTicketout:
			b.Ticket++
		case tx.TypeIn:
			fallthrough
		case tx.TypeOut:
			if bytes.Equal(prev, h.Hash) {
				continue
			}
			bal, err := allAmount(cfg, tr)
			if err != nil {
				return nil, err
			}
			if bal > 0 {
				b.Recv += bal
			} else {
				b.Sent += -bal
			}
			b.Avail += bal
			prev = h.Hash
		}
	}
	return &b, nil
}

//logout is for logging out.
func logout(s *setting.Setting) {
	wallet = nil
}

//newAddress generates a new address.
func newAddress(s *setting.Setting) error {
	mutex.Lock()
	defer mutex.Unlock()
	_, err := wallet.NewAddress(&s.DBConfig, pwd, true)
	return err
}

//addressRecv is a pair of address string and its adk.
//Value of Recv/Sent maybe not what is intuitive.
//So just use the calculated value remain=recv-sent
type addressRecv struct {
	String string
	Recv   uint64
	Sent   uint64
}

//getAddressResp is a response of GetAddress.
type getAddressResp struct {
	Normal   []*addressRecv
	Multisig []*addressRecv
}

//getAddresses returns addresses with some info.
func getAddresses(cfg *setting.Setting) (*getAddressResp, error) {
	mutex.RLock()
	defer mutex.RUnlock()
	nadrs := make(map[string]*addressRecv)
	madrs := make(map[string]*addressRecv)

	for adrstr := range wallet.AddressPublic {
		nadrs[adrstr] = &addressRecv{
			String: adrstr,
		}
	}

	hs, err := walletImpl.GetHistory(&cfg.DBConfig)
	if err != nil {
		return nil, err
	}
	for _, h := range hs {
		tr, err := imesh.GetTxInfo(cfg.DB, h.Hash)
		if err != nil {
			return nil, err
		}
		switch h.Type {
		case tx.TypeOut:
			out := tr.Body.Outputs[h.Index]
			adrstr := out.Address.String()
			if r, isMine := nadrs[adrstr]; isMine {
				r.Recv += out.Value
			}
		case tx.TypeIn:
			out, err := PreviousOutput(cfg, tr.Body.Inputs[h.Index])
			if err != nil {
				return nil, err
			}
			adrstr := out.Address.String()
			if r, isMine := nadrs[adrstr]; isMine {
				r.Sent += out.Value
			}
		case tx.TypeMulout:
			out := tr.Body.MultiSigOuts[h.Index]
			adrstr := out.Address(cfg.Config)
			has, err := wallet.HasAddress(&cfg.DBConfig, out)
			if err != nil {
				return nil, err
			}
			if !has {
				continue
			}
			r, isMine := madrs[adrstr]
			if !isMine {
				r = &addressRecv{
					String: adrstr,
				}
				madrs[adrstr] = r
			}
			r.Recv += out.Value
		case tx.TypeMulin:
			in := tr.Body.MultiSigIns[h.Index]
			out, err := PreviousMultiOutput(cfg, in)
			if err != nil {
				return nil, err
			}
			has, err := wallet.HasAddress(&cfg.DBConfig, out)
			if err != nil {
				return nil, err
			}
			if !has {
				continue
			}
			adrstr := out.Address(cfg.Config)
			r, isMine := madrs[adrstr]
			if !isMine {
				r = &addressRecv{
					String: adrstr,
				}
				madrs[adrstr] = r
			}
			r.Sent += out.Value
		}
	}

	ret := &getAddressResp{
		Normal:   make([]*addressRecv, 0, len(nadrs)),
		Multisig: make([]*addressRecv, 0, len(madrs)),
	}
	for _, r := range nadrs {
		ret.Normal = append(ret.Normal, r)
	}
	for _, r := range madrs {
		ret.Multisig = append(ret.Multisig, r)
	}
	return ret, nil
}

//cancelPoW cancles PoW.
func cancelPoW(cfg *setting.Setting) error {
	if cfg.CancelPoW != nil {
		cfg.CancelPoW()
		return nil
	}
	return errors.New("PoW is not running")
}

//sendEvent sends  ADK.
func sendEvent(cfg *setting.Setting, param *tx.BuildParam) (tx.Hash, error) {
	return Send(cfg, param)
}

const (
	reasonSpent = iota
	reasonIssued
	reasonMined
)

//normalTxResp is information about a normal tx.
type normalTxResp struct {
	Recv        time.Time
	Hash        tx.Hash
	Amount      int64
	IsRejected  bool
	IsConfirmed bool
	StatNo      imesh.StatNo
}

//ticketResp is information about a ticket.
type ticketResp struct {
	Recv        time.Time
	Hash        tx.Hash
	Reason      byte
	IsRejected  bool
	IsConfirmed bool
	StatNo      imesh.StatNo
}

//multisigResp is information about a multisig tx.
type multisigResp struct {
	Recv        time.Time
	Hash        tx.Hash
	Amount      int64
	IsRejected  bool
	IsConfirmed bool
	StatNo      imesh.StatNo
	Address     string
}

//txResp is a response to transactrion..
type txResp struct {
	NormalTx []*normalTxResp
	Ticket   []*ticketResp
	Multisig []*multisigResp
}

const (
	txAll = iota
	txConfirmed
	txPending
	txRejected
)

//transaction returns txs in the wallet.
//total balance for normal addresses per a tx(send or recv for each txs)
//send or recv for each multisig address
func transaction(cfg *setting.Setting, typ byte) (*txResp, error) {
	mutex.RLock()
	defer mutex.RUnlock()
	var resp txResp
	histories, err := walletImpl.GetHistory(&cfg.DBConfig)
	if err != nil {
		return nil, err
	}
	sort.Slice(histories, func(i, j int) bool {
		return bytes.Compare(histories[i].Hash, histories[j].Hash) < 0
	})

	var prev tx.Hash
	for _, h := range histories {
		ti, err := imesh.GetTxInfo(cfg.DB, h.Hash)
		if err != nil {
			return nil, err
		}
		if typ == txConfirmed && ti.StatNo == imesh.StatusPending {
			continue
		}
		if typ == txPending && ti.StatNo != imesh.StatusPending {
			continue
		}
		if typ == txRejected && !ti.IsRejected {
			continue
		}
		switch h.Type {
		case tx.TypeTicketout:
			var reason byte = reasonIssued
			if len(ti.Body.Inputs) > 0 {
				reason = reasonMined
			}
			resp.Ticket = append(resp.Ticket, &ticketResp{
				Recv:        ti.Received,
				Hash:        h.Hash,
				Reason:      reason,
				IsConfirmed: ti.StatNo != imesh.StatusPending,
				IsRejected:  ti.IsRejected,
				StatNo:      ti.StatNo,
			})
		case tx.TypeTicketin:
			resp.Ticket = append(resp.Ticket, &ticketResp{
				Recv:        ti.Received,
				Hash:        h.Hash,
				Reason:      reasonSpent,
				IsConfirmed: ti.StatNo != imesh.StatusPending,
				IsRejected:  ti.IsRejected,
				StatNo:      ti.StatNo,
			})
		}

		if bytes.Equal(h.Hash, prev) {
			continue
		}
		v, err := allAmount(cfg, ti)
		if err != nil {
			return nil, err
		}
		if v != 0 {
			resp.NormalTx = append(resp.NormalTx, &normalTxResp{
				Recv:        ti.Received,
				Hash:        h.Hash,
				Amount:      v,
				IsRejected:  ti.IsRejected,
				IsConfirmed: ti.StatNo != imesh.StatusPending,
				StatNo:      ti.StatNo,
			})
		}

		values := make(map[string]int64)
		for _, in := range ti.Body.MultiSigIns {
			out, err := PreviousMultiOutput(cfg, in)
			if err != nil {
				return nil, err
			}
			has, err := wallet.FindAddressByte(&cfg.DBConfig, out.Addresses...)
			if err != nil {
				return nil, err
			}
			if !has {
				continue
			}
			values[out.Address(cfg.Config)] -= int64(out.Value)
		}
		for _, out := range ti.Body.MultiSigOuts {
			has, err := wallet.FindAddressByte(&cfg.DBConfig, out.Addresses...)
			if err != nil {
				return nil, err
			}
			if !has {
				continue
			}
			values[out.Address(cfg.Config)] += int64(out.Value)
		}
		for adr, amt := range values {
			resp.Multisig = append(resp.Multisig, &multisigResp{
				Recv:        ti.Received,
				Hash:        h.Hash,
				Amount:      amt,
				IsRejected:  ti.IsRejected,
				IsConfirmed: ti.StatNo != imesh.StatusPending,
				StatNo:      ti.StatNo,
				Address:     adr,
			})
		}
		prev = h.Hash
	}
	sort.Slice(resp.NormalTx, func(i, j int) bool {
		return !resp.NormalTx[i].Recv.Before(resp.NormalTx[j].Recv)
	})
	sort.Slice(resp.Multisig, func(i, j int) bool {
		return !resp.Multisig[i].Recv.Before(resp.Multisig[j].Recv)
	})
	sort.Slice(resp.Ticket, func(i, j int) bool {
		return !resp.Ticket[i].Recv.Before(resp.Ticket[j].Recv)
	})
	return &resp, nil
}
