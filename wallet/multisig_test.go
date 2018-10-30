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
	"context"
	"encoding/hex"
	"testing"
	"time"

	"github.com/AidosKuneen/aklib"
	"github.com/AidosKuneen/aklib/address"
	"github.com/AidosKuneen/aklib/tx"
	"github.com/AidosKuneen/aknode/imesh"
)

func TestMultisig(t *testing.T) {
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

	tr3 := tx.New(aklib.DebugConfig, genesis)
	tr3.AddInput(genesis, 0)

	if err = tr3.AddOutput(aklib.DebugConfig, a.Address58(s.Config), aklib.ADKSupply-5*aklib.ADK); err != nil {
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
	newtx, err := syncDB(s, true)
	if err != nil {
		t.Error(err)
	}
	if !newtx {
		t.Error("invalid sync")
	}

	tr4 := tx.New(aklib.DebugConfig, genesis)
	tr4.AddMultisigIn(tr3.Hash(), 0)

	if err = tr4.AddOutput(aklib.DebugConfig, a.Address58(s.Config), 4*aklib.ADK); err != nil {
		t.Error(err)
	}
	if err = tr4.AddMultisigOut(aklib.DebugConfig, 2, aklib.ADK,
		adr.Normal[0].String, b.Address58(s.Config), a.Address58(s.Config)); err != nil {
		t.Error(err)
	}
	if err = tr4.Sign(a); err != nil {
		t.Error(err)
	}
	if err = tr4.Sign(b); err != nil {
		t.Error(err)
	}
	if err = tr4.PoW(); err != nil {
		t.Error(err)
	}
	_, err = s.Client[0].SendRawTX(tr4, tx.TypeNormal)
	if err != nil {
		t.Log(err)
	}
	time.Sleep(10 * time.Second)
	newtx, err = syncDB(s, true)
	if err != nil {
		t.Error(err)
	}
	if !newtx {
		t.Error("invalid sync")
	}

	confirmAll(t, true)
	confirmed, err := checkConfirmed(s)
	if err != nil {
		t.Fatal(err)
	}
	if !confirmed {
		t.Fatal("should be confirmed")
	}

	txresp, err := Transaction(s, txAll)
	if err != nil {
		t.Error(err)
	}
	if len(txresp.NormalTx) != 0 {
		t.Error("invalid #normal tx", len(txresp.NormalTx))
	}
	trs := []*tx.Transaction{tr4, tr3}
	for _, ttt := range trs {
		t.Log(ttt.Hash())
	}

	if len(txresp.Ticket) != 0 {
		t.Error("invalid #Ticket tx")
	}

	if len(txresp.Multisig) != 2 {
		t.Error("invalid #Multisig tx")
	}
	mul := txresp.Multisig[0]
	if mul.Hash != trs[0].Hash().String() {
		t.Error("invalid mul")
	}
	if mul.Amount != -int64(trs[0].Outputs[0].Value) {
		t.Error("invalid mul value", mul.Amount)
	}
	if mul.IsRejected || mul.StatNo == hex.EncodeToString(imesh.StatusPending[:]) {
		t.Error("invalid status")
	}
	mul = txresp.Multisig[1]
	if mul.Hash != trs[1].Hash().String() {
		t.Error("invalid mul")
	}
	if mul.Amount != int64(trs[1].MultiSigOuts[0].Value) {
		t.Error("invalid mul value")
	}
	if mul.IsRejected || mul.StatNo == hex.EncodeToString(imesh.StatusPending[:]) {
		t.Error("invalid status")
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
	if adrs.Normal[0].Recv != 0 {
		t.Error("invalid recv", adrs.Normal[0].Recv)
	}
	aaa, _, err := address.ParseAddress58(s.Config, adrs.Normal[0].String)
	if err != nil {
		t.Error(err)
	}
	muladr := address.MultisigAddress(s.Config, 2,
		a.Address(s.Config), b.Address(s.Config), aaa)
	if len(adrs.Multisig) != 1 {
		t.Error("invalid addresses")
	}
	if adrs.Multisig[0].String != muladr {
		t.Error("invalid address")
	}
	if adrs.Multisig[0].Recv != 6*aklib.ADK {
		t.Error("invalid recv", adrs.Multisig[0].Recv)
	}
	if adrs.Multisig[0].Sent != 5*aklib.ADK {
		t.Error("invalid sent", adrs.Multisig[0].Sent)
	}
}
