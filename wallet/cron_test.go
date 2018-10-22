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
	"os"
	"testing"
	"time"

	"github.com/AidosKuneen/aklib"
	"github.com/AidosKuneen/aklib/address"
	"github.com/AidosKuneen/aklib/db"
	"github.com/AidosKuneen/aklib/tx"
)

func TestSync(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	setupRPC(ctx, t)
	setup(t)
	defer teardown(t)
	defer cancel()

	s.RunFeeMiner = true
	s.RunTicketMiner = false

	pk, err := register(s, "test")
	if err != nil {
		t.Error(err)
	}
	err = login(s, &loginParam{
		PrivKey:  pk,
		Password: "test",
	})
	if err != nil {
		t.Error(err)
	}
	if err = newAddress(s); err != nil {
		t.Error(err)
	}

	adr, err := getAddresses(s)
	if err != nil {
		t.Error(err)
	}
	if len(adr.Normal) != 1 {
		t.Error("# should be 1", len(adr.Normal))
	}
	t.Log("address", adr.Normal[0].String)

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
	time.Sleep(6 * time.Second)
	up, err := searchLastAddress(s, true)
	if err != nil {
		t.Error(err)
	}
	if up != 0 {
		t.Error("invalid search")
	}
	logout(s)

	if err := s.DB.Close(); err != nil {
		t.Error(err)
	}
	if err := os.RemoveAll("./test_db"); err != nil {
		t.Log(err)
	}
	s.DB, err = db.Open("./test_db")
	if err != nil {
		t.Error(err)
	}
	err = login(s, &loginParam{
		PrivKey:  pk,
		Password: "test",
	})
	if err != nil {
		t.Error(err)
	}
	up, err = searchLastAddress(s, true)
	if err != nil {
		t.Error(err)
	}
	if up != 1 {
		t.Error("invalid search", up)
	}
	newtx, err := syncDB(s, true)
	if err != nil {
		t.Error(err)
	}
	if !newtx {
		t.Error("invalid sync")
	}
	adr2, err := getAddresses(s)
	if err != nil {
		t.Error(err)
	}
	if len(adr2.Normal) != 1 || adr.Normal[0].String != adr2.Normal[0].String {
		t.Error("invalid search")
	}
	aaa, _, err := address.ParseAddress58(s.Config, adr2.Normal[0].String)
	if err != nil {
		t.Error(err)
	}
	muladr := address.MultisigAddress(s.Config, 2,
		a.Address(s.Config), b.Address(s.Config), aaa)

	if len(adr2.Multisig) != 1 || adr2.Multisig[0].String != muladr {
		t.Error("invalid address")
	}
}
