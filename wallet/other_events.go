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
	"encoding/hex"
	"errors"
	"net/http"
	"strings"
	"time"

	crpc "github.com/AidosKuneen/aklib/rpc"
	"github.com/AidosKuneen/aklib/tx"
	"github.com/AidosKuneen/gadk"

	"github.com/AidosKuneen/aklib/address"
	"github.com/AidosKuneen/akwallet/setting"
	"github.com/AidosKuneen/gogui"
)

func errString(err error) string {
	if err != nil {
		return err.Error()
	}
	return ""
}

//SetupEvents setup events to GUI struct.
func SetupEvents(cfg *setting.Setting, gui *gogui.GUI) {
	gui.On("register", func(pwd string) interface{} {
		adr, err := register(cfg, pwd)
		return struct {
			Address string
			Error   string
		}{
			Address: adr,
			Error:   errString(err),
		}
	})
	gui.On("login", func(p *loginParam) interface{} {
		return errString(login(cfg, p))
	})

	gui.On("get_balance", func(span byte) interface{} {
		bal, err := getBalance(cfg, span)
		return struct {
			*balance
			Error string
		}{
			balance: bal,
			Error:   errString(err),
		}
	})
	gui.On("get_transactions", func(typ byte) interface{} {
		tr, err := transaction(cfg, typ)
		return struct {
			*txResp
			Error string
		}{
			txResp: tr,
			Error:  errString(err),
		}
	})

	gui.On("get_newaddress", func() interface{} {
		return errString(newAddress(cfg))
	})
	gui.On("get_addresses", func() interface{} {
		adrs, err := getAddresses(cfg)
		return struct {
			*getAddressResp
			Error string
		}{
			getAddressResp: adrs,
			Error:          errString(err),
		}
	})

	gui.On("send", func(p *tx.BuildParam) interface{} {
		_, err := sendEvent(cfg, p)
		return errString(err)
	})
	gui.On("cancel_pow", func() interface{} {
		return errString(cancelPoW(cfg))
	})
	gui.On("validate_address", func(adr string) interface{} {
		return errString(validateAddress(cfg, adr))
	})

	gui.On("get_settings", func() interface{} {
		return cfg
	})
	gui.On("get_nodeinfo", func() interface{} {
		ni, err := getNodeinfo(cfg)
		return struct {
			*crpc.NodeInfo
			Error string
		}{
			NodeInfo: ni,
			Error:    errString(err),
		}
	})
	gui.On("get_nodesstatus", func() interface{} {
		return getNodesStatus(cfg)
	})
	gui.On("save_settings", func(ncfg *setting.Setting) interface{} {
		cfg = ncfg
		return errString(cfg.Save())
	})
	gui.On("get_oldbalance", func(seed gadk.Trytes) interface{} {
		amount, err := getOldUTXOs(cfg, seed)
		return struct {
			Amount int64
			Error  string
		}{
			Amount: amount,
			Error:  errString(err),
		}
	})
	gui.On("claim", func(p *claimParam) interface{} {
		return errString(claim(cfg, p))
	})
	gui.On("logout", func() interface{} {
		logout(cfg)
		return ""
	})

}

func getOldAPIs() []*gadk.API {
	apis := make([]*gadk.API, 2)
	cl := http.Client{
		Timeout: 10 * time.Second,
	}
	apis[0] = gadk.NewAPI("http://wallet1.aidoskuneen.com", &cl)
	apis[1] = gadk.NewAPI("http://wallet2.aidoskuneen.com", &cl)
	return apis
}

//getOldUTXOs gets UTXOs in old wallet.
func getOldUTXOs(cfg *setting.Setting, seed gadk.Trytes) (int64, error) {
	apis := getOldAPIs()
	var err error
	var adrs []gadk.Address
	for _, api := range apis {
		_, adrs, err = gadk.GetUsedAddress(api, seed, 2)
		if err == nil {
			break
		}
	}
	var utxos gadk.Balances
	for _, api := range apis {
		utxos, err = api.Balances(adrs)
		if err == nil {
			break
		}
	}
	if err != nil {
		return 0, err
	}
	var bal int64
	for _, u := range utxos {
		bal += u.Value
	}
	return bal, nil
}

//claimParam is a param of claim.
type claimParam struct {
	Amount int64
	Seed   gadk.Trytes
}

//claim clams a migration adk from old wallet to new one.
func claim(cfg *setting.Setting, param *claimParam) error {
	dest, err := wallet.NewAddress(&cfg.DBConfig, pwd, true)
	if err != nil {
		return err
	}
	adrstr := strings.ToUpper(hex.EncodeToString(dest.Address(cfg.Config)))
	enc := make([]rune, len(adrstr))
	for i, c := range adrstr {
		if c >= '0' && c <= '8' {
			c = c - '0' + 'G'
		}
		enc[i] = c
	}
	apis := getOldAPIs()
	tr := gadk.Transfer{
		Address: pobAddress,
		Value:   param.Amount,
		Message: gadk.Trytes(enc),
	}
	for _, api := range apis {
		_, err = gadk.Send(api, param.Seed, 2, []gadk.Transfer{tr}, nil)
		if err == nil {
			break
		}
	}
	return err
}

//getNodeinfo returns node info.
func getNodeinfo(cfg *setting.Setting) (*crpc.NodeInfo, error) {
	mutex.RLock()
	defer mutex.RUnlock()
	var ni *crpc.NodeInfo
	err := cfg.CallRPC(func(cl setting.RPCIF) error {
		var err2 error
		ni, err2 = cl.GetNodeinfo()
		return err2
	})
	return ni, err
}

func getNodesStatus(cfg *setting.Setting) []bool {
	mutex.RLock()
	defer mutex.RUnlock()
	r := make([]bool, len(cfg.Client))
	for i, cl := range cfg.Client {
		_, err := cl.GetNodeinfo()
		if err != nil {
			r[i] = true
		}
	}
	return r
}

//register is for registering a new private key for the wallet.
func register(cfg *setting.Setting, pwd string) (string, error) {
	return address.HDSeed58(cfg.Config, address.GenerateSeed32(), []byte(pwd), false), nil
}

//validateAddress checks if the adrstr is a valid address or not.
func validateAddress(cfg *setting.Setting, adrstr string) error {
	_, isNode, err := address.ParseAddress58(cfg.Config, adrstr)
	if err != nil {
		return err
	}
	if isNode {
		return errors.New("the address is not valid")
	}
	return nil
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
