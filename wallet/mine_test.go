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
	"testing"
	"time"

	"github.com/AidosKuneen/aklib"
	"github.com/AidosKuneen/aklib/tx"
)

func TestMine(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	setupRPC(ctx, t)
	setup(t)
	defer teardown(t)
	defer cancel()

	s.RunFeeMiner = true
	s.RunTicketMiner = false

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

	if _, err = mine(s); err == nil {
		t.Error("should be error")
	}

	tr := tx.NewMinableFee(s1.Config, genesis)
	tr.AddInput(genesis, 0)
	if err = tr.AddOutput(s.Config, a.Address58(s.Config), aklib.ADKSupply-10); err != nil {
		t.Error(err)
	}
	if err = tr.AddOutput(s.Config, "", 10); err != nil {
		t.Error(err)
	}
	if err = tr.Sign(a); err != nil {
		t.Error(err)
	}
	_, err = s.Client[0].SendRawTX(tr, tx.TypeRewardFee)
	if err != nil {
		t.Log(err)
	}
	time.Sleep(6 * time.Second)
	preh, err := mine(s)
	if err != nil {
		t.Error(err)
	}
	if preh == nil {
		t.Error("h should not be nil")
	}

	s.RunFeeMiner = false
	s.RunTicketMiner = true

	tkt, err := tx.IssueTicket(context.Background(), s1.Config, a.Address(s.Config), genesis)
	if err != nil {
		t.Error(err)
	}
	_, err = s.Client[0].SendRawTX(tkt, tx.TypeNormal)
	if err != nil {
		t.Log(err)
	}
	time.Sleep(6 * time.Second)
	tr2 := tx.NewMinableTicket(s1.Config, tkt.Hash(), genesis)
	tr2.AddInput(preh, 0)
	if err = tr2.AddOutput(s.Config, a.Address58(s.Config), aklib.ADKSupply-10); err != nil {
		t.Error(err)
	}
	if err = tr2.Sign(a); err != nil {
		t.Error(err)
	}
	_, err = s.Client[0].SendRawTX(tr2, tx.TypeRewardTicket)
	if err != nil {
		t.Log(err)
	}
	time.Sleep(6 * time.Second)
	h, err := mine(s)
	if err != nil {
		t.Error(err)
	}
	if h == nil {
		t.Error("h should not be nil")
	}
}

func TestSendMinable(t *testing.T) {
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

	trr := tx.New(s.Config, genesis)
	trr.AddInput(genesis, 0)
	if err = trr.AddOutput(s.Config, a.Address58(s.Config), aklib.ADKSupply-10*aklib.ADK); err != nil {
		t.Error(err)
	}
	if err = trr.AddOutput(s.Config, adr.Normal[0].String, 10*aklib.ADK); err != nil {
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
	time.Sleep(6 * time.Second)
	newtx, err := syncDB(s, true)
	if err != nil {
		t.Error(err)
	}
	if len(newtx) == 0 {
		t.Error("invalid sync")
	}
	confirmAll(t, true)
	time.Sleep(6 * time.Second)
	c, err := checkConfirmed(s)
	if err != nil {
		t.Error(err)
	}
	if len(c) == 0 {
		t.Error("invalid conf")
	}
	_, err = issueTicket(context.Background(), s)
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
	confirmAll(t, true)
	time.Sleep(6 * time.Second)
	_, err = checkConfirmed(s)
	if err != nil {
		t.Error(err)
	}

	err = Send(s, &tx.BuildParam{
		Dest: []*tx.RawOutput{
			&tx.RawOutput{
				Address: a.Address58(s.Config),
				Value:   1 * aklib.ADK,
			},
		},
		PoWType: tx.TypeRewardTicket,
	})
	if err != nil {
		t.Error(err)
	}
	time.Sleep(10 * time.Second)
	_, err = s.Client[0].GetMinableTicketTx()
	if err != nil {
		t.Error(err)
	}

	err = Send(s, &tx.BuildParam{
		Dest: []*tx.RawOutput{
			&tx.RawOutput{
				Address: a.Address58(s.Config),
				Value:   1 * aklib.ADK,
			},
		},
		Fee:     0.1 * aklib.ADK,
		PoWType: tx.TypeRewardFee,
	})
	if err != nil {
		t.Error(err)
	}
	time.Sleep(6 * time.Second)
	_, err = s.Client[0].GetMinableFeeTx(0.05)
	if err != nil {
		t.Error(err)
	}
}
