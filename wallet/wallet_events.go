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
	"encoding/hex"
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

//LoginParam is a param for login.
type LoginParam struct {
	PrivKey  string
	Password string
}

//Login is for logging event in the wallet.
func Login(cfg *setting.Setting, param *LoginParam) error {
	mutex.Lock()
	defer mutex.Unlock()
	_, isNode, err := address.HDFrom58(cfg.Config, param.PrivKey, []byte(param.Password))
	if err != nil {
		return err
	}
	if isNode {
		return errors.New("invalidd private key")
	}
	err = load(cfg, []byte(param.Password), param.PrivKey)
	if err != badger.ErrKeyNotFound {
		return err
	}
	return new(cfg, []byte(param.Password), param.PrivKey)
}

//Balance represents available coins, received coins and sent coins.
type Balance struct {
	Avail  int64
	Recv   int64
	Sent   int64
	Ticket int64
}

//GetBalance returns a total balance  received/sent amount in the span in the wallet.
//span:
//All=0
//monthly = 1
//Weekly = 2
func GetBalance(cfg *setting.Setting, span byte) (*Balance, error) {
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
	var b Balance
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

//Logout is for logging out.
func Logout(s *setting.Setting) {
	mutex.Lock()
	defer mutex.Unlock()
	wallet = nil
}

//NewAddress generates a new address.
func NewAddress(s *setting.Setting) (*address.Address, error) {
	mutex.Lock()
	defer mutex.Unlock()
	return wallet.NewAddress(&s.DBConfig, pwd, true)
}

//addressRecv is a pair of address string and its adk.
//Value of Recv/Sent for multisig maybe not what is intuitive.
//So just use the calculated value remain=recv-sent
type addressRecv struct {
	String string
	Recv   uint64
	Sent   uint64
	no     int
}

//GetAddressResp is a response of GetAddress.
type GetAddressResp struct {
	Normal   []*addressRecv
	Multisig []*addressRecv
}

//GetAddresses returns addresses with some info.
func GetAddresses(cfg *setting.Setting) (*GetAddressResp, error) {
	mutex.RLock()
	defer mutex.RUnlock()
	nadrs := make(map[string]*addressRecv)
	madrs := make(map[string]*addressRecv)

	for adrstr := range wallet.AddressPublic {
		a, err := wallet.GetAddress(&cfg.DBConfig, adrstr, pwd)
		if err != nil {
			return nil, err
		}
		nadrs[adrstr] = &addressRecv{
			String: adrstr,
			no:     a.No,
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

	ret := &GetAddressResp{
		Normal:   make([]*addressRecv, 0, len(nadrs)),
		Multisig: make([]*addressRecv, 0, len(madrs)),
	}
	for _, r := range nadrs {
		ret.Normal = append(ret.Normal, r)
	}
	for _, r := range madrs {
		ret.Multisig = append(ret.Multisig, r)
	}
	sort.Slice(ret.Normal, func(i, j int) bool {
		return ret.Normal[i].no < ret.Normal[j].no
	})
	sort.Slice(ret.Multisig, func(i, j int) bool {
		return ret.Multisig[i].no < ret.Multisig[j].no
	})
	return ret, nil
}

//CancelPoW cancles PoW.
func CancelPoW(cfg *setting.Setting) error {
	if cfg.CancelPoW != nil {
		cfg.CancelPoW()
		return nil
	}
	return errors.New("PoW is not running")
}

const (
	reasonSpent = iota
	reasonIssued
	reasonMined
)

//Output is an output in transactions.
type Output struct {
	Address string
	Value   uint64
}

//MultiSigOut is an multisig output in transactions.
type MultiSigOut struct {
	M         byte
	Addresses []string
	Value     uint64
	Address   string
}

//TxCommon is the common info for all txResps
type TxCommon struct {
	Inputs       []*Output
	MInputs      []*MultiSigOut
	Signs        map[string]bool
	Outputs      []*Output
	MOutputs     []*MultiSigOut
	TicketInput  string
	TicketOutput string
	Message      string
	Recv         int64
	Hash         string
	IsRejected   bool
	IsConfirmed  bool
	StatNo       string
}

//normalTxResp is information about a normal tx.
type normalTxResp struct {
	*TxCommon
	Amount int64
}

//ticketResp is information about a ticket.
type ticketResp struct {
	*TxCommon
	Reason byte
}

//multisigResp is information about a multisig tx.
type multisigResp struct {
	*TxCommon
	Amount  int64
	Address string
}

//TxResp is a response to transactrion..
type TxResp struct {
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

func makeTxCommon(cfg *setting.Setting, ti *imesh.TxInfo) (*TxCommon, error) {
	tc := &TxCommon{
		Inputs:      make([]*Output, len(ti.Body.Inputs)),
		MInputs:     make([]*MultiSigOut, len(ti.Body.MultiSigIns)),
		Signs:       make(map[string]bool),
		Outputs:     make([]*Output, len(ti.Body.Outputs)),
		MOutputs:    make([]*MultiSigOut, len(ti.Body.MultiSigOuts)),
		Message:     string(ti.Body.Message),
		Recv:        ti.Received.Unix(),
		Hash:        ti.Hash.String(),
		IsConfirmed: ti.StatNo != imesh.StatusPending,
		IsRejected:  ti.IsRejected,
		StatNo:      hex.EncodeToString(ti.StatNo[:]),
	}
	if len(ti.Body.TicketOutput) > 0 {
		to, err := address.Address58(cfg.Config, ti.Body.TicketOutput)
		if err != nil {
			return nil, err
		}
		tc.TicketOutput = to
	}
	if ti.Body.TicketInput != nil {
		ti2, err2 := imesh.GetTxInfo(cfg.DB, ti.Body.TicketInput)
		if err2 != nil {
			return nil, err2
		}
		tc.TicketInput = ti2.Body.TicketOutput.String()
	}
	for i, inp := range ti.Body.Inputs {
		ins, err := PreviousOutput(cfg, inp)
		if err != nil {
			return nil, err
		}
		tc.Inputs[i] = &Output{
			Address: ins.Address.String(),
			Value:   ins.Value,
		}
	}
	for i, inp := range ti.Body.Outputs {
		tc.Outputs[i] = &Output{
			Address: inp.Address.String(),
			Value:   inp.Value,
		}
	}
	for i, inp := range ti.Body.MultiSigIns {
		ti2, err2 := imesh.GetTxInfo(cfg.DB, inp.PreviousTX)
		if err2 != nil {
			return nil, err2
		}
		mo := ti2.Body.MultiSigOuts[inp.Index]
		tc.MInputs[i] = &MultiSigOut{
			M:     mo.M,
			Value: mo.Value,
		}
		tc.MInputs[i].Address = mo.Address(cfg.Config)
		tc.MInputs[i].Addresses = make([]string, len(mo.Addresses))
		for j, a := range mo.Addresses {
			tc.MInputs[i].Addresses[j] = a.String()
		}
	}
	for i, mo := range ti.Body.MultiSigOuts {
		tc.MOutputs[i] = &MultiSigOut{
			M:     mo.M,
			Value: mo.Value,
		}
		tc.MOutputs[i].Addresses = make([]string, len(mo.Addresses))
		tc.MOutputs[i].Address = mo.Address(cfg.Config)
		for j, a := range mo.Addresses {
			tc.MOutputs[i].Addresses[j] = a.String()
		}

	}
	return tc, nil
}

//Transaction returns txs in the wallet.
//total balance for normal addresses per a tx(send or recv for each txs)
//send or recv for each multisig address
func Transaction(cfg *setting.Setting, typ byte) (*TxResp, error) {
	mutex.RLock()
	defer mutex.RUnlock()
	var resp TxResp
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
		tc, err := makeTxCommon(cfg, ti)
		if err != nil {
			return nil, err
		}
		switch h.Type {
		case tx.TypeTicketout:
			var reason byte = reasonIssued
			if len(ti.Body.Inputs) > 0 {
				reason = reasonMined
			}
			resp.Ticket = append(resp.Ticket, &ticketResp{
				TxCommon: tc,
				Reason:   reason,
			})
		case tx.TypeTicketin:
			resp.Ticket = append(resp.Ticket, &ticketResp{
				TxCommon: tc,
				Reason:   reasonSpent,
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
				TxCommon: tc,
				Amount:   v,
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
				TxCommon: tc,
				Amount:   amt,
				Address:  adr,
			})
		}
		prev = h.Hash
	}
	sort.Slice(resp.NormalTx, func(i, j int) bool {
		return !(resp.NormalTx[i].Recv < resp.NormalTx[j].Recv)
	})
	sort.Slice(resp.Multisig, func(i, j int) bool {
		return !(resp.Multisig[i].Recv < resp.Multisig[j].Recv)
	})
	sort.Slice(resp.Ticket, func(i, j int) bool {
		return !(resp.Ticket[i].Recv < resp.Ticket[j].Recv)
	})
	return &resp, nil
}
