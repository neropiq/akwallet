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
	"errors"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/AidosKuneen/aklib/address"
	crpc "github.com/AidosKuneen/aklib/rpc"
	"github.com/AidosKuneen/akwallet/setting"
	"github.com/AidosKuneen/gadk"
)

var oldServers = []string{
	"http://wallet1.aidoskuneen.com:14266",
	"http://wallet2.aidoskuneen.com:14266",
}

func getOldAPIs(w []string) []*gadk.API {
	apis := make([]*gadk.API, len(w))
	cl := http.Client{
		Timeout: 10 * time.Second,
	}
	for i, ww := range w {
		apis[i] = gadk.NewAPI(ww, &cl)
	}
	return apis
}

//GetOldUTXOs gets UTXOs in old wallet.
func GetOldUTXOs(cfg *setting.Setting, seed gadk.Trytes) (int64, error) {
	apis := getOldAPIs(oldServers)
	var err error
	var adrs []gadk.Address
	for _, api := range apis {
		_, adrs, err = gadk.GetUsedAddress(api, seed, 2)
		if err == nil {
			break
		}
	}
	if err != nil {
		log.Println(err)
		return 0, err
	}
	var utxos gadk.Balances
	for _, api := range apis {
		utxos, err = api.Balances(adrs)
		if err == nil {
			break
		}
	}
	if err != nil {
		log.Println(err)
		return 0, err
	}
	var bal int64
	for _, u := range utxos {
		bal += u.Value
	}
	return bal, nil
}

//ClaimParam is a param of claim.
type ClaimParam struct {
	Amount int64
	Seed   gadk.Trytes
}

//Claim clams a migration adk from old wallet to new one.
func Claim(cfg *setting.Setting, param *ClaimParam, debug bool) error {
	mutex.Lock()
	dest, err := wallet.NewAddress(&cfg.DBConfig, pwd, true)
	if err != nil {
		mutex.Unlock()
		return err
	}
	mutex.Unlock()
	adrstr := strings.ToUpper(hex.EncodeToString(dest.Address(cfg.Config)))
	enc := make([]rune, len(adrstr)+1)
	for i, c := range adrstr {
		if c >= '0' && c <= '8' {
			c = c - '0' + 'G'
		}
		enc[i] = c
	}
	enc[len(adrstr)] = 'Z'
	apis := getOldAPIs(oldServers)
	tr := gadk.Transfer{
		Address: pobAddress,
		Value:   param.Amount,
		Message: gadk.Trytes(enc),
	}
	_, f := gadk.GetBestPoW()
	if debug {
		f = nil
	}
	for _, api := range apis {
		_, err = gadk.Send(api, param.Seed, 2, []gadk.Transfer{tr}, f)
		if err == nil {
			break
		}
	}
	return err
}

//GetNodeinfo returns node info.
func GetNodeinfo(cfg *setting.Setting) (*crpc.NodeInfo, error) {
	var ni *crpc.NodeInfo
	err := cfg.CallRPC(func(cl setting.RPCIF) error {
		var err2 error
		ni, err2 = cl.GetNodeinfo()
		log.Println(cl, err2)
		return err2
	})
	return ni, err
}

//GetNodesStatus get node status from RPC servers.
func GetNodesStatus(cfg *setting.Setting) []bool {
	clients := cfg.GetClients()
	r := make([]bool, len(clients))
	for i, cl := range clients {
		r[i] = cl.Alive
	}
	log.Println("status", r)
	return r
}

//Register is for registering a new private key for the wallet.
func Register(cfg *setting.Setting, pwd string) (string, error) {
	pk := address.HDSeed58(cfg.Config, address.GenerateSeed32(), []byte(pwd), false)
	return pk, new(cfg, []byte(pwd), pk)
}

//ValidateAddress checks if the adrstr is a valid address or not.
func ValidateAddress(cfg *setting.Setting, adrstr string) error {
	_, isNode, err := address.ParseAddress58(cfg.Config, adrstr)
	if err != nil {
		return err
	}
	if isNode {
		return errors.New("the address is not valid")
	}
	return nil
}
func updateSevers(cfg *setting.Setting, svr []string) error {
	if err := cfg.SetClient(svr); err != nil {
		return err
	}
	return cfg.Save()
}

func updateMinerSetting(cfg *setting.Setting, s *setting.Miner) error {
	cfg.CancelMiner()
	time.Sleep(time.Second)
	ctx, cancel := context.WithCancel(context.Background())
	cfg.UpdateMiner(*s, cancel)
	RunMiner(ctx, cfg)
	return cfg.Save()
}

/*
//multisig is a set of M and addresses for multisig.
type multisig struct {
	M         byte
	Addresses []string
}

//multisigAddress returns a multisig address.
func multisigAddress(cfg *setting.Setting, msig *multisig) (string, error) {
	adrs := make([]address.Bytes, len(msig.Addresses))
	for i, adrstr := range msig.Addresses {
		a, isNode, err := address.ParseAddress58(cfg.Config, adrstr)
		if err != nil {
			return "", err
		}
		if isNode {
			return "", errors.New("the address is not valid")
		}
		adrs[i] = a
	}
	return address.MultisigAddress(cfg.Config, msig.M, adrs...), nil
}
*/
