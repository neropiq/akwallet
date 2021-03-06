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
	"context"
	"encoding/hex"
	"testing"
	"time"

	"github.com/AidosKuneen/aklib"
	"github.com/AidosKuneen/aklib/tx"
	"github.com/AidosKuneen/aknode/imesh"
)

func TestWallet(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	setupRPC(ctx, t)
	setup(t)
	defer teardown(t)
	defer cancel()

	pk, err := Register(s, "test")
	if err != nil {
		t.Error(err)
	}
	err = Login(s, &LoginParam{
		PrivKey:  pk,
		Password: "test1",
	})
	if err == nil {
		t.Error("should be error")
	}
	err = Login(s, &LoginParam{
		PrivKey:  pk,
		Password: "test",
	})
	if err != nil {
		t.Error(err)
	}

	if _, err = NewAddress(s); err != nil {
		t.Error(err)
	}

	adr, err := GetAddresses(s)
	if err != nil {
		t.Error(err)
	}
	if len(adr.Normal) != 1 {
		t.Error("# should be 1", len(adr.Normal))
	}

	trr := tx.New(s.Config, genesis)
	trr.AddInput(genesis, 0)
	if err = trr.AddOutput(s.Config, a.Address58(s.Config), aklib.ADKSupply-10*aklib.ADK); err != nil {
		t.Error(err)
	}
	if err = trr.AddOutput(s.Config, b.Address58(s.Config), 10*aklib.ADK); err != nil {
		t.Error(err)
	}
	if err = trr.Sign(a); err != nil {
		t.Error(err)
	}
	if err = trr.PoW(); err != nil {
		t.Error(err)
	}
	_, err = s.Client[0].SendRawTX(trr, tx.TypeNormal)
	if err != nil {
		t.Log(err)
	}
	time.Sleep(10 * time.Second)
	newtx, err := syncDB(s, true)
	if err != nil {
		t.Error(err)
	}
	if len(newtx) != 0 {
		t.Error("invalid sync")
	}

	remain := aklib.ADKSupply
	tr := tx.New(s.Config, genesis)
	tr.AddInput(genesis, 0)
	remain -= 10 * aklib.ADK
	if err = tr.AddOutput(s.Config, a.Address58(s.Config), remain); err != nil {
		t.Error(err)
	}
	if err = tr.AddOutput(s.Config, adr.Normal[0].String, 10*aklib.ADK); err != nil {
		t.Error(err)
	}
	if err = tr.Sign(a); err != nil {
		t.Error(err)
	}
	if err = tr.PoW(); err != nil {
		t.Error(err)
	}
	_, err = s.Client[0].SendRawTX(tr, tx.TypeNormal)
	if err != nil {
		t.Log(err)
	}
	time.Sleep(10 * time.Second)
	newtx, err = syncDB(s, true)
	if err != nil {
		t.Error(err)
	}
	if len(newtx) == 0 {
		t.Error("invalid sync")
	}

	tr2 := tx.New(s.Config, genesis)
	tr2.AddInput(tr.Hash(), 0)
	remain -= 20 * aklib.ADK
	if err = tr2.AddOutput(s.Config, a.Address58(s.Config),
		remain); err != nil {
		t.Error(err)
	}
	if err = tr2.AddOutput(s.Config, adr.Normal[0].String, 20*aklib.ADK); err != nil {
		t.Error(err)
	}
	if err = tr2.Sign(a); err != nil {
		t.Error(err)
	}
	if err = tr2.PoW(); err != nil {
		t.Error(err)
	}
	_, err = s.Client[0].SendRawTX(tr2, tx.TypeNormal)
	if err != nil {
		t.Log(err)
	}
	time.Sleep(10 * time.Second)
	newtx, err = syncDB(s, true)
	if err != nil {
		t.Error(err)
	}
	if len(newtx) == 0 {
		t.Error("invalid sync")
	}

	h, err := issueTicket(context.Background(), s)
	if err != nil {
		t.Error(err)
	}
	time.Sleep(10 * time.Second)
	newtx, err = syncDB(s, true)
	if err != nil {
		t.Error(err)
	}
	if len(newtx) == 0 {
		t.Error("invalid sync")
	}
	tsent1, err := imesh.GetTx(s1.DB, h)
	if err != nil {
		t.Error(err)
	}
	if err = tsent1.Check(s.Config, tx.TypeNormal); err != nil {
		t.Error(err)
	}

	tr3 := tx.New(aklib.DebugConfig, genesis)
	tr3.AddInput(tr2.Hash(), 0)
	remain -= 5 * aklib.ADK

	if err = tr3.AddOutput(aklib.DebugConfig, a.Address58(s.Config), remain); err != nil {
		t.Error(err)
	}
	if err = tr3.AddMultisigOut(aklib.DebugConfig, 2, 5*aklib.ADK,
		adr.Normal[0].String, b.Address58(s.Config), a.Address58(s.Config)); err != nil {
		t.Error(err)
	}
	if err = tr3.Sign(a); err != nil {
		t.Error(err)
	}
	if err = tr3.PoW(); err != nil {
		t.Error(err)
	}

	_, err = s.Client[0].SendRawTX(tr3, tx.TypeNormal)
	if err != nil {
		t.Log(err)
	}
	time.Sleep(10 * time.Second)
	newtx, err = syncDB(s, true)
	if err != nil {
		t.Error(err)
	}
	if len(newtx) == 0 {
		t.Error("invalid sync")
	}

	b, err := GetBalance(s, 0)
	if err != nil {
		t.Error(err)
	}
	if b.Avail != 0 || b.Recv != 0 || b.Ticket != 0 || b.Sent != 0 {
		t.Error("should be 0", b)
	}

	// imesh.StatusConfirmed
	confirmAll(t, true)
	confirmed, err := checkConfirmed(s)
	if err != nil {
		t.Error(err)
	}
	if len(confirmed) == 0 {
		t.Error("should be confirmed")
	}

	guiobj.emit = make(chan struct{})
	err = Send(s, &tx.BuildParam{
		Comment: "moemoe",
		Dest: []*tx.RawOutput{
			&tx.RawOutput{
				Address: a.Address58(s.Config),
				Value:   1 * aklib.ADK,
			},
			&tx.RawOutput{
				Address: adr.Normal[0].String,
				Value:   2 * aklib.ADK,
			},
		},
		PoWType: tx.TypeNormal,
	})
	if err != nil {
		t.Error(err)
	}
	select {
	case <-guiobj.emit:
	case <-time.After(3 * time.Minute):
		t.Error("failed to pow")
	}
	guiobj.emit = nil
	time.Sleep(6 * time.Second)
	newtx, err = syncDB(s, true)
	if err != nil {
		t.Error(err)
	}
	if len(newtx) == 0 {
		t.Error("invalid syncdb")
	}
	h = newtx[0].Hash
	t.Log("sent", h)

	st, err := imesh.GetTx(s1.DB, h)
	if err != nil {
		t.Error(err)
	}

	if err = st.Check(s.Config, tx.TypeNormal); err != nil {
		t.Error(err)
	}
	if len(st.Outputs) != 3 {
		t.Error("invalid out", len(st.Outputs))
	}
	loc := len(st.Outputs) - 1
	if !bytes.Equal(st.Outputs[loc-1].Address, a.Address(s.Config)) {
		t.Error("invalid out")
	}
	if st.Outputs[loc-1].Value != 1*aklib.ADK {
		t.Error("invalid out val")
	}
	if st.Outputs[loc].Address.String() != adr.Normal[0].String {
		t.Error("invalid out")
	}
	if st.Outputs[loc].Value != 2*aklib.ADK {
		t.Error("invalid out val")
	}
	if string(st.Message) != "moemoe" {
		t.Error("invalid message")
	}

	confirmAll(t, true)
	confirmed, err = checkConfirmed(s)
	if err != nil {
		t.Fatal(err)
	}
	if len(confirmed) == 0 {
		t.Fatal("should be confirmed")
	}

	b, err = GetBalance(s, 0)
	if err != nil {
		t.Error(err)
	}
	if b.Avail != 29*aklib.ADK || b.Recv != 30*aklib.ADK || b.Sent != 1*aklib.ADK || b.Ticket != 1 {
		t.Log(b, b.Avail == 29*aklib.ADK, b.Recv == 30*aklib.ADK, b.Sent == 1*aklib.ADK, b.Ticket == 1)
		t.Error("should be 10*aklib.ADK")
	}

	adrs, err := GetAddresses(s)
	if err != nil {
		t.Error(err)
	}
	if len(adrs.Normal) != 1 {
		t.Error("invalid addresses")
	}
	if adrs.Normal[0].String != adr.Normal[0].String {
		t.Error("invalid address")
	}
	if adrs.Normal[0].Recv != 32*aklib.ADK {
		t.Error("invalid recv", adrs.Normal[0].Recv)
	}
	txresp, err := Transaction(s, txAll)
	if err != nil {
		t.Error(err)
	}
	if len(txresp.NormalTx) != 3 {
		t.Error("invalid #normal tx", len(txresp.NormalTx))
	}
	trs := []*tx.Transaction{st, tr2, tr}
	for _, ttt := range trs {
		t.Log(ttt.Hash())
	}

	if txresp.NormalTx[0].Amount != -1*aklib.ADK {
		t.Error("invalid value", 0, txresp.NormalTx[0].Amount, trs[1].Outputs[1].Value)
	}
	if txresp.NormalTx[1].Amount != int64(trs[1].Outputs[1].Value) {
		t.Error("invalid value", 1, txresp.NormalTx[1].Amount, trs[1].Outputs[1].Value)
	}
	if txresp.NormalTx[2].Amount != 10*aklib.ADK {
		t.Error("invalid value", 2, txresp.NormalTx[2].Amount)
	}

	for i, ntx := range txresp.NormalTx {
		t.Log(ntx.Hash)
		if ntx.Hash != trs[i].Hash().String() {
			t.Error("invalid hash")
		}
		if ntx.IsRejected || ntx.StatNo == hex.EncodeToString(imesh.StatusPending[:]) {
			t.Error("invalid status")
		}
	}

	if len(txresp.Ticket) != 1 {
		t.Error("invalid #Ticket tx")
	}
	if txresp.Ticket[0].Hash != tsent1.Hash().String() {
		t.Error("invalid ticket tx hash")
	}
	if txresp.Ticket[0].Reason != reasonIssued {
		t.Error("invalid ticket tx reason")
	}
	if txresp.Ticket[0].IsRejected ||
		txresp.Ticket[0].StatNo == hex.EncodeToString(imesh.StatusPending[:]) {
		t.Error("invalid status")
	}

	if len(txresp.Multisig) != 1 {
		t.Error("invalid #Multisig tx")
	}
	mul := txresp.Multisig[0]
	if mul.Hash != tr3.Hash().String() {
		t.Error("invalid mul")
	}
	if mul.Amount != int64(tr3.MultiSigOuts[0].Value) {
		t.Error("invalid mul value")
	}
	if mul.IsRejected || mul.StatNo == hex.EncodeToString(imesh.StatusPending[:]) {
		t.Error("invalid status")
	}

	err = Send(s, &tx.BuildParam{
		Dest: []*tx.RawOutput{
			&tx.RawOutput{
				Address: a.Address58(s.Config),
				Value:   1 * aklib.ADK,
			},
		},
		PoWType: tx.TypeNormal,
	})
	if err != nil {
		t.Error(err)
	}
	time.Sleep(time.Second)
	if err = CancelPoW(s); err != nil {
		t.Error(err)
	}
	time.Sleep(time.Second)

	Logout(s)
	err = Login(s, &LoginParam{
		PrivKey:  pk,
		Password: "test",
	})
	if err != nil {
		t.Error(err)
	}
}

func TestEvents(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	setupRPC(ctx, t)
	setup(t)
	defer teardown(t)
	defer cancel()

	pk, err := Register(s, "test")
	if err != nil {
		t.Error(err)
	}
	err = Login(s, &LoginParam{
		PrivKey:  pk,
		Password: "test",
	})
	if err != nil {
		t.Error(err)
	}

	if _, err = NewAddress(s); err != nil {
		t.Error(err)
	}

	adr, err := GetAddresses(s)
	if err != nil {
		t.Error(err)
	}
	if len(adr.Normal) != 1 {
		t.Error("# should be 1", len(adr.Normal))
	}
	if err = ValidateAddress(s, adr.Normal[0].String); err != nil {
		t.Error(err)
	}
	if err = ValidateAddress(s, adr.Normal[0].String[:len(adr.Normal[0].String)-1]); err == nil {
		t.Error("should be err")
	}
	resp, err := GetNodeinfo(s)
	if err != nil {
		t.Error(err)
	}
	if resp.Testnet != 2 {
		t.Error("invalid nodeinfo", resp.Testnet)
	}
	res := GetNodesStatus(s)
	if len(res) != 1 || !res[0] {
		t.Error("invalid node status", len(res), res[0])
	}
}

func TestClaim(t *testing.T) {
	oldServers = []string{"http://localhost:14266"}
	ctx, cancel := context.WithCancel(context.Background())
	setupRPC(ctx, t)
	setup(t)
	seed, total, ch := setupOldServer(ctx, t)
	defer teardown(t)
	defer cancel()

	pk, err := Register(s, "test")
	if err != nil {
		t.Error(err)
	}
	err = Login(s, &LoginParam{
		PrivKey:  pk,
		Password: "test",
	})
	if err != nil {
		t.Error(err)
	}
	time.Sleep(2 * time.Second)
	bal, err := GetOldUTXOs(s, seed)
	if err != nil {
		t.Error(err)
	}
	if bal != total {
		t.Error("invalid utxo")
	}
	err = Claim(s, &ClaimParam{
		Amount: bal,
		Seed:   seed,
	}, true)
	if err != nil {
		t.Error(err)
	}
	select {
	case <-ch:
	case <-time.After(3 * time.Second):
		t.Error("invalid send")
	}
}
