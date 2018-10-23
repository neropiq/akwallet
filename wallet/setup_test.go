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
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net"
	"net/http"
	"os"
	"strconv"
	"testing"
	"time"

	"github.com/AidosKuneen/gadk"

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

func setupOldServer(ctx context.Context, t *testing.T) (gadk.Trytes, int64, chan struct{}) {
	bal := make(map[gadk.Address]int64)
	seed := gadk.NewSeed()
	var total int64
	for index := 0; index < 3; index++ {
		adr, err := gadk.NewAddress(seed, index, 2)
		if err != nil {
			t.Error(err)
		}
		bal[adr] = int64(index) + 1
		total += bal[adr]
	}
	mux := http.NewServeMux()
	ch := make(chan struct{}, 2)
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		handle(t, seed, bal, w, r, ch)
	})

	s := &http.Server{
		Addr:    ":14266",
		Handler: mux,
	}
	fmt.Println("Starting old RPC Server on 14266")
	ll, err := net.Listen("tcp", s.Addr)
	if err != nil {
		log.Fatal(err)
	}
	go func() {
		log.Println(s.Serve(ll))
	}()
	go func() {
		ctx2, cancel2 := context.WithCancel(ctx)
		defer cancel2()
		<-ctx2.Done()
		if err := s.Shutdown(ctx2); err != nil {
			log.Print(err)
		}
	}()
	return seed, total, ch
}

//need
//getBalances
//BroadcastTransactions
//GetTransactionsToApprove
//FindTransactions / address
func handle(t *testing.T, seed gadk.Trytes, bal map[gadk.Address]int64,
	w http.ResponseWriter, r *http.Request, ch chan struct{}) {
	defer func() {
		if err := r.Body.Close(); err != nil {
			t.Log(err)
		}
	}()
	p, err := ioutil.ReadAll(r.Body)
	if err != nil {
		t.Error(err)
	}
	cmd := struct {
		Command string `json:"command"`
	}{}
	if err = json.Unmarshal(p, &cmd); err != nil {
		t.Error(err)
	}
	t.Log(cmd.Command, " is requested")

	var result []byte
	switch cmd.Command {
	case "getBalances":
		var req gadk.GetBalancesRequest
		if err = json.Unmarshal(p, &req); err != nil {
			t.Error(err)
		}
		type getBalancesResponse struct {
			Duration       int64       `json:"duration"`
			Balances       []string    `json:"balances"`
			Milestone      gadk.Trytes `json:"milestone"`
			MilestoneIndex int64       `json:"milestoneIndex"`
		}
		resp := getBalancesResponse{}
		for _, adr := range req.Addresses {
			resp.Balances = append(resp.Balances, strconv.Itoa(int(bal[adr])))
		}
		result, err = json.Marshal(&resp)
	case "attachToMesh":
		var req gadk.AttachToMeshRequest
		if err = json.Unmarshal(p, &req); err != nil {
			t.Error(err)
		}
		resp := gadk.AttachToMeshResponse{}
		resp.Trytes = req.Trytes
		result, err = json.Marshal(&resp)
	case "broadcastTransactions":
		var req gadk.BroadcastTransactionsRequest
		if err = json.Unmarshal(p, &req); err != nil {
			t.Error(err)
		}
		checkTrytes(t, seed, bal, req.Trytes)
		result, err = json.Marshal(&struct{}{})
		ch <- struct{}{}
	case "getTransactionsToApprove":
		resp := gadk.GetTransactionsToApproveResponse{
			TrunkTransaction:  gadk.EmptyHash,
			BranchTransaction: gadk.EmptyHash,
		}
		result, err = json.Marshal(&resp)

	case "findTransactions":
		var req gadk.FindTransactionsRequest
		if err = json.Unmarshal(p, &req); err != nil {
			t.Error(err)
		}
		if len(req.Addresses) != 1 || len(req.Bundles) != 0 || len(req.Approvees) != 0 {
			t.Error("invalid findtr")
		}
		resp := gadk.FindTransactionsResponse{}
		if _, ok := bal[req.Addresses[0]]; ok {
			resp.Hashes = append(resp.Hashes, gadk.EmptyHash)
		}
		result, err = json.Marshal(&resp)
	default:
		t.Error("invalid cmd")
	}
	if err != nil {
		t.Log(err, string(p))
		t.Error(err)
		http.Error(w, err.Error(), 400)
		return
	}
	if _, err := w.Write(result); err != nil {
		log.Fatal(err)
	}

}

func checkTrytes(t *testing.T, seed gadk.Trytes, bal map[gadk.Address]int64, trs []gadk.Transaction) {
	var total int64
	for _, a := range bal {
		total += a
	}
	if len(trs) != 2*3+1 {
		t.Error("invalid trytes", len(trs))
	}
	for index, tr := range trs {
		// t.Log(tr.Trytes())
		if index == 0 {
			if tr.Address != pobAddress {
				t.Error("invalid address")
			}
			if tr.Value != total {
				t.Error("invalid out val")
			}
			var newadr []rune
			for _, t := range tr.SignatureMessageFragment {
				if t == 'Z' {
					break
				}
				if t >= 'G' {
					t = t - 'G' + '0'
				}
				newadr = append(newadr, t)
			}
			nadr, err := hex.DecodeString(string(newadr))
			if err != nil {
				t.Error(err)
			}
			nnadr, err := address.Address58(s.Config, nadr)
			if err != nil {
				t.Error(err)
			}
			t.Log(nnadr)
			adr, err := getAddresses(s)
			if err != nil {
				t.Error(err)
			}
			if adr.Normal[0].String != nnadr {
				t.Error("invalid adr")
			}
			continue
		}
		//sig only 2,4,6
		if index%2 == 0 {
			continue
		}
		//content 1,3,5
		adr, err := gadk.NewAddress(seed, index/2, 2)
		if err != nil {
			t.Error(err)
		}
		if tr.Address != adr {
			t.Error("invalid address")
		}
		if tr.Value != -bal[tr.Address] {
			t.Error("invalid in val", tr.Value, bal[tr.Address])
		}
	}
}
