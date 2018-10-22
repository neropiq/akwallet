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
	"errors"
	"log"
	"net/http"
	"net/url"
	"os"
	"os/user"
	"path/filepath"
	"strconv"
	"time"

	"github.com/AidosKuneen/aklib"
	"github.com/AidosKuneen/aklib/db"
	crpc "github.com/AidosKuneen/aklib/rpc"
	"github.com/AidosKuneen/aklib/tx"

	"github.com/dgraph-io/badger"
)

//Version is the version of aknode
const Version = "1.0.0"

//Address represents an address.
type Address struct {
	Address string
	Port    uint16
}

//GUIIF is an interface for gogui.GUI.
type gui interface {
	On(n string, f interface{})
	Emit(name string, dat interface{}, f interface{}) error
}

//RPCIF is a interface for public RPCs.
type RPCIF interface {
	GetLastHistory(adr string) ([]*tx.InoutHash, error)
	GetTxsStatus(txid ...string) ([]*crpc.TxStatus, error)
	GetNodeinfo() (*crpc.NodeInfo, error)
	GetLeaves() ([]string, error)
	SendRawTX(tx *tx.Transaction, typ tx.Type) (string, error)
	GetRawTx(txid string) (*tx.Transaction, error)
	GetMinableTicketTx() (*tx.Transaction, error)
	GetMinableFeeTx(fee float64) (*tx.Transaction, error)
}

//Setting is  a aknode setting.
type Setting struct {
	Version string
	RootDir string
	Testnet int
	UseTor  bool

	Servers []string

	Proxy string

	MinimumFee      float64
	RunFeeMiner     bool
	RunTicketMiner  bool
	RunTicketIssuer bool

	Client []RPCIF `msgpack:"-"`

	aklib.DBConfig `msgpack:"-"`
	GUI            gui                `msgpack:"-"`
	CancelPoW      context.CancelFunc `msgpack:"-"`
}

//Load parse a json file fname , open DB and returns Settings struct .
func Load(rootdir string, net int) (*Setting, error) {
	var se Setting
	var err error

	cfg := aklib.Configs[net]
	dbDir := filepath.Join(baseDir(rootdir, cfg), "db")
	if err = os.MkdirAll(dbDir, 0755); err != nil {
		return nil, err
	}
	dbb, err := db.Open(dbDir)
	if err != nil {
		return nil, err
	}

	err = dbb.View(func(txn *badger.Txn) error {
		return db.Get(txn, nil, &se, db.HeaderWalletConfig)
	})
	if err != nil && err != badger.ErrKeyNotFound {
		return nil, err
	}
	se.DB = dbb
	se.RootDir = rootdir
	se.Config = cfg

	if se.Testnet >= len(aklib.Configs) {
		return nil, errors.New("testnet must be 0(mainnet) or 1")
	}

	usr, err2 := user.Current()
	if err2 != nil {
		return nil, err2
	}
	if se.RootDir == "" {
		se.RootDir = filepath.Join(usr.HomeDir, ".akwallet")
	}

	if se.UseTor && se.Proxy == "" {
		return nil, errors.New("should be proxied for using Tor")
	}

	if se.RunFeeMiner && se.MinimumFee == 0 {
		se.MinimumFee = 0.05
	}

	if len(se.Servers) == 0 {
		se.Servers = []string{"http://localhost:" +
			strconv.Itoa(int(se.Config.DefaultRPCPort))}
	}

	if err := se.SetClient(); err != nil {
		//for now ignore err
		log.Println(err)
	}

	return &se, nil
}

//Save saves the cfg
func (cfg *Setting) Save() error {
	return cfg.DB.Update(func(txn *badger.Txn) error {
		return db.Put(txn, nil, cfg, db.HeaderWalletConfig)
	})
}

//BaseDir returns a dir which contains a setting file and db dir.
func (cfg *Setting) BaseDir() string {
	return baseDir(cfg.RootDir, cfg.Config)
}

func baseDir(root string, cfg *aklib.Config) string {
	return filepath.Join(root, cfg.Name)
}

//SetClient sets http.Client objs from cfg.Servers.
func (cfg *Setting) SetClient() error {
	cl := http.Client{
		Timeout: 10 * time.Second,
	}
	if cfg.Proxy != "" {
		p, err := url.Parse(cfg.Proxy)
		if err != nil {
			return err
		}
		cl.Transport = &http.Transport{Proxy: http.ProxyURL(p)}
	}
	cfg.Client = make([]RPCIF, 0, len(cfg.Servers))
	for _, s := range cfg.Servers {
		cl := crpc.New(s, "", "", &cl)
		ni, err := cl.GetNodeinfo()
		if err != nil {
			log.Println(s, err)
			continue
		}
		if ni.Testnet != byte(cfg.Testnet) {
			log.Println(s, "wrong net")
			continue
		}
		cfg.Client = append(cfg.Client, cl)
	}
	if len(cfg.Client) == 0 {
		return errors.New("no servers")
	}
	return nil
}

//CallRPC calls an RPC by servers in config.
func (cfg *Setting) CallRPC(f func(RPCIF) error) error {
	var err error
	for _, cl := range cfg.Client {
		if err = f(cl); err != nil {
			log.Println(err)
		} else {
			break
		}
	}
	return err
}