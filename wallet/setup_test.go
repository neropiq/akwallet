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
	s1.Testnet = 2
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
	s.Testnet = 2
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
