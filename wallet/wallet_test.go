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
	"log"
	"math/rand"
	"net"
	"os"
	"strconv"
	"testing"
	"time"

	"github.com/AidosKuneen/aklib"
	"github.com/AidosKuneen/aklib/address"
	"github.com/AidosKuneen/aklib/arypack"
	"github.com/AidosKuneen/aklib/db"
	"github.com/AidosKuneen/aklib/tx"
	"github.com/AidosKuneen/aknode/akconsensus"
	"github.com/AidosKuneen/aknode/imesh"
	"github.com/AidosKuneen/aknode/imesh/leaves"
	"github.com/AidosKuneen/aknode/node"
	"github.com/AidosKuneen/aknode/rpc"
	isetting "github.com/AidosKuneen/aknode/setting"
	"github.com/AidosKuneen/akwallet/setting"
	"github.com/AidosKuneen/consensus"
	"github.com/dgraph-io/badger"
)

type gui struct {
}

func (g *gui) On(n string, f interface{}) {
}
func (g *gui) Emit(name string, dat interface{}, f interface{}) error {
	return nil
}

var s = &setting.Setting{}
var s1 = &isetting.Setting{}
var a, b *address.Address
var genesis tx.Hash
var l net.Listener

func confirmAll(t *testing.T, confirm bool) {
	var txs []tx.Hash
	ledger := &consensus.Ledger{
		ParentID:  consensus.GenesisID,
		Seq:       1,
		CloseTime: time.Now(),
	}
	id := ledger.ID()
	t.Log("ledger id", hex.EncodeToString(id[:]))
	if err := akconsensus.PutLedger(s1, ledger); err != nil {
		t.Fatal(err)
	}
	err := s1.DB.Update(func(txn *badger.Txn) error {
		it := txn.NewIterator(badger.DefaultIteratorOptions)
		defer it.Close()
		for it.Seek([]byte{byte(db.HeaderTxInfo)}); it.ValidForPrefix([]byte{byte(db.HeaderTxInfo)}); it.Next() {
			var dat []byte
			err2 := it.Item().Value(func(d []byte) error {
				dat = make([]byte, len(d))
				copy(dat, d)
				return nil
			})
			if err2 != nil {
				return err2
			}
			var ti imesh.TxInfo
			if err := arypack.Unmarshal(dat, &ti); err != nil {
				return err
			}
			if confirm && ti.StatNo != imesh.StatusGenesis {
				ti.StatNo = imesh.StatNo(id)
			}
			if !confirm && ti.StatNo != imesh.StatusGenesis {
				ti.StatNo = imesh.StatusPending
			}
			h := it.Item().Key()[1:]
			if err := db.Put(txn, h, &ti, db.HeaderTxInfo); err != nil {
				return err
			}
			if !bytes.Equal(h, genesis) {
				txs = append(txs, h)
			}
		}
		return nil
	})
	if err != nil {
		t.Error(err)
	}

}

func setupRPC(ctx context.Context, t *testing.T) {
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
	var err2 error
	if err := os.RemoveAll("./rpc_db"); err != nil {
		log.Println(err)
	}
	s1.DB, err2 = db.Open("./rpc_db")
	if err2 != nil {
		panic(err2)
	}

	s1.Config = aklib.DebugConfig
	s1.MaxConnections = 1
	s1.Bind = "127.0.0.1"
	s1.Port = uint16(rand.Int31n(10000)) + 1025
	s1.MyHostPort = ":" + strconv.Itoa(int(s1.Port))
	seed := address.GenerateSeed32()
	a, err2 = address.New(s.Config, seed)
	if err2 != nil {
		t.Error(err2)
	}
	s1.Config.Genesis = map[string]uint64{
		a.Address58(s1.Config): aklib.ADKSupply,
	}
	s1.RPCUser = "user"
	s1.RPCPassword = "user"
	s1.RPCTxTag = "test"
	s1.RPCBind = "127.0.0.1"
	s1.RPCPort = s1.Config.DefaultRPCPort
	s1.UsePublicRPC = true
	leaves.Init(s1)
	if err := imesh.Init(s1); err != nil {
		t.Error(err)
	}
	gs := leaves.Get(1)
	if len(gs) != 1 {
		t.Error("invalid genesis")
	}
	genesis = gs[0]

	var err error
	l, err = node.Start(ctx, s1, true)
	if err != nil {
		t.Error(err)
	}
	t.Log(imesh.GetTxNo())
	rpc.Init(s1)
	rpc.Run(ctx, s1)
	pwd = []byte("pwd")
	if err := rpc.New(s1, pwd); err != nil {
		t.Error(err)
	}
}
func setup(t *testing.T) {
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
	var err2 error
	if err := os.RemoveAll("./test_db"); err != nil {
		log.Println(err)
	}
	s.DB, err2 = db.Open("./test_db")
	if err2 != nil {
		panic(err2)
	}
	s.Config = aklib.DebugConfig
	seed := address.GenerateSeed32()
	b, err2 = address.New(s.Config, seed)
	if err2 != nil {
		t.Error(err2)
	}

	g := gui{}
	s.Servers = []string{"http://localhost:" + strconv.Itoa(int(s1.RPCPort))}
	if err := s.SetClient(); err != nil {
		t.Error(err)
	}
	s.GUI = &g
}

func teardown(t *testing.T) {
	time.Sleep(3 * time.Second)
	if err := os.RemoveAll("./test_db"); err != nil {
		t.Log(err)
	}
	if err := os.RemoveAll("./rpc_db"); err != nil {
		t.Log(err)
	}
}

func TestWallet(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	setupRPC(ctx, t)
	setup(t)
	defer teardown(t)
	defer cancel()

	pk, err := register(s, "test")
	if err != nil {
		t.Error(err)
	}
	err = login(s, &loginParam{
		PrivKey:  pk,
		Password: "test1",
	})
	if err == nil {
		t.Error("should be error")
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
	if newtx {
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
	if !newtx {
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
	if !newtx {
		t.Error("invalid sync")
	}

	h, err := issueTicket(s)
	if err != nil {
		t.Error(err)
	}
	time.Sleep(10 * time.Second)
	newtx, err = syncDB(s, true)
	if err != nil {
		t.Error(err)
	}
	if !newtx {
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
	if !newtx {
		t.Error("invalid sync")
	}

	b, err := getBalance(s, 0)
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
	if !confirmed {
		t.Error("should be confirmed")
	}

	h, err = sendEvent(s, &tx.BuildParam{
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
	t.Log("sent", h)

	time.Sleep(6 * time.Second)
	newtx, err = syncDB(s, true)
	if err != nil {
		t.Error(err)
	}
	if !newtx {
		t.Error("invalid syncdb")
	}

	st, err := imesh.GetTx(s1.DB, h)
	if err != nil {
		t.Error(err)
	}

	if err = st.Check(s.Config, tx.TypeNormal); err != nil {
		t.Error(err)
	}
	if len(st.Outputs) != 3 {
		t.Error("invalid out")
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
	if !confirmed {
		t.Fatal("should be confirmed")
	}

	b, err = getBalance(s, 0)
	if err != nil {
		t.Error(err)
	}
	if b.Avail != 29*aklib.ADK || b.Recv != 30*aklib.ADK || b.Sent != 1*aklib.ADK || b.Ticket != 1 {
		t.Log(b, b.Avail == 29*aklib.ADK, b.Recv == 30*aklib.ADK, b.Sent == 1*aklib.ADK, b.Ticket == 1)
		t.Error("should be 10*aklib.ADK")
	}

	adrs, err := getAddresses(s)
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
	txresp, err := transaction(s, txAll)
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
		if ntx.Hash.String() != trs[i].Hash().String() {
			t.Error("invalid hash")
		}
		if ntx.IsRejected || ntx.StatNo == imesh.StatusPending {
			t.Error("invalid status")
		}
	}

	if len(txresp.Ticket) != 1 {
		t.Error("invalid #Ticket tx")
	}
	if txresp.Ticket[0].Hash.String() != tsent1.Hash().String() {
		t.Error("invalid ticket tx hash")
	}
	if txresp.Ticket[0].Reason != reasonIssued {
		t.Error("invalid ticket tx reason")
	}
	if txresp.Ticket[0].IsRejected || txresp.Ticket[0].StatNo == imesh.StatusPending {
		t.Error("invalid status")
	}

	if len(txresp.Multisig) != 1 {
		t.Error("invalid #Multisig tx")
	}
	mul := txresp.Multisig[0]
	if mul.Hash.String() != tr3.Hash().String() {
		t.Error("invalid mul")
	}
	if mul.Amount != int64(tr3.MultiSigOuts[0].Value) {
		t.Error("invalid mul value")
	}
	if mul.IsRejected || mul.StatNo == imesh.StatusPending {
		t.Error("invalid status")
	}

	stopped := false
	go func() {
		_, err = sendEvent(s, &tx.BuildParam{
			Dest: []*tx.RawOutput{
				&tx.RawOutput{
					Address: a.Address58(s.Config),
					Value:   1 * aklib.ADK,
				},
			},
			PoWType: tx.TypeNormal,
		})
		if err == nil {
			t.Error("should be error")
		}
		stopped = true
	}()
	time.Sleep(time.Second)
	if err = cancelPoW(s); err != nil {
		t.Error(err)
	}
	time.Sleep(time.Second)
	if !stopped {
		t.Error("invalid cancelpow")
	}

	logout(s)
	err = login(s, &loginParam{
		PrivKey:  pk,
		Password: "test",
	})
	if err != nil {
		t.Error(err)
	}
}
