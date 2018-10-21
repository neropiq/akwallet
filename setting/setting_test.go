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

package setting

import (
	"context"
	"log"
	"math/rand"
	"os"
	"strconv"
	"testing"
	"time"

	"github.com/AidosKuneen/aklib"
	"github.com/AidosKuneen/aklib/address"
	"github.com/AidosKuneen/aklib/db"
	"github.com/AidosKuneen/aknode/imesh"
	"github.com/AidosKuneen/aknode/imesh/leaves"
	"github.com/AidosKuneen/aknode/node"
	"github.com/AidosKuneen/aknode/rpc"
	"github.com/AidosKuneen/aknode/setting"
)

var s1 = &setting.Setting{}

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
	a, err2 := address.New(s1.Config, seed)
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

	var err error
	_, err = node.Start(ctx, s1, true)
	if err != nil {
		t.Error(err)
	}
	t.Log(imesh.GetTxNo())
	rpc.Init(s1)
	rpc.Run(ctx, s1)
	pwd := []byte("pwd")
	if err := rpc.New(s1, pwd); err != nil {
		t.Error(err)
	}
}

func teardown(t *testing.T) {
	time.Sleep(3 * time.Second)
	if err := os.RemoveAll("./debug"); err != nil {
		t.Log(err)
	}
	if err := os.RemoveAll("./rpc_db"); err != nil {
		t.Log(err)
	}
}

func TestSetting(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	setupRPC(ctx, t)
	defer teardown(t)
	defer cancel()

	s, err := Load(".", 2)
	if err != nil {
		t.Error(err)
	}
	servers := s.Servers
	s.Servers = []string{"http://localhost:1010"}
	if err := s.SetClient(); err == nil {
		t.Error("should be error")
	}
	s.Servers = servers
	if err := s.SetClient(); err != nil {
		t.Error(err)
	}
	err = s.CallRPC(func(cl RPCIF) error {
		_, err := cl.GetNodeinfo()
		return err
	})
	if err != nil {
		t.Error(err)
	}
	s.Servers = []string{"localhost:1010"}
	if err := s.Save(); err != nil {
		t.Error(err)
	}
	if err := s.DB.Close(); err != nil {
		t.Error(err)
	}
	s2, err := Load(".", 2)
	if err != nil {
		t.Error(err)
	}
	if len(s2.Servers) != 1 || s2.Servers[0] != s.Servers[0] {
		t.Error("invliad servers", len(s2.Servers), s2.Servers[0] != s.Servers[0], s.Servers, s2.Servers)
	}
}
