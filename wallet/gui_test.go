// +build !travis

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
	"fmt"
	"testing"
	"time"

	"github.com/AidosKuneen/aklib"
	"github.com/AidosKuneen/aklib/tx"
	wgui "github.com/AidosKuneen/akwallet/gui"
	"github.com/AidosKuneen/gogui"
)

func TestGUI(t *testing.T) {
	oldServers = []string{"http://localhost:14266"}
	debug = true
	ctx, cancel := context.WithCancel(context.Background())
	setupRPC(ctx, t)
	setup(t)
	seed, total, _ := setupOldServer(ctx, t)
	defer teardown(t)
	defer cancel()

	_, cancel2 := context.WithCancel(context.Background())
	s.CancelMiner = cancel2

	s.DBConfig.Config.Name = "DEBUG"
	s.Version = "0.0.1"

	fmt.Println("old seed", seed, "total bal", total)
	guis := gogui.New()
	s.GUI = guis
	SetupEvents(s, guis)
	go func() {
		if err := wgui.Run(guis, "http://localhost:8080"); err != nil {
			t.Error(err)
		}
	}()
	pk, err := Register(s, "test")
	if err != nil {
		t.Error(err)
	}
	t.Log("privkey", pk)
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

	trr := tx.New(s.Config, genesis)
	trr.AddInput(tr3.Hash(), 0)
	if err = trr.AddOutput(s.Config, a.Address58(s.Config), aklib.ADKSupply-(5+10)*aklib.ADK); err != nil {
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
	time.Sleep(10 * time.Second)
	newtx, err := syncDB(s, true)
	if err != nil {
		t.Error(err)
	}
	if len(newtx) == 0 {
		t.Error("invalid sync")
	}
	t.Log("sent 10ADK to normal, 5ADK to multisig synced")
	if err := notify(s, newtx, nil); err != nil {
		t.Error(err)
	}

	time.Sleep(10 * time.Second)
	confirmAll(t, true)
	confirmed, err := checkConfirmed(s)
	if err != nil {
		t.Error(err)
	}
	if len(confirmed) == 0 {
		t.Error("should be confirmed")
	}
	t.Log("confirmed")
	if err := notify(s, nil, confirmed); err != nil {
		t.Error(err)
	}

	time.Sleep(1000 * time.Hour)
	wgui.Wait(guis)

}
