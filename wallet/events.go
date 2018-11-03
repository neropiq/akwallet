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
	"log"

	crpc "github.com/AidosKuneen/aklib/rpc"
	"github.com/AidosKuneen/aklib/tx"
	"github.com/AidosKuneen/aknode/walletImpl"
	"github.com/AidosKuneen/akwallet/setting"
	"github.com/AidosKuneen/gadk"
	"github.com/AidosKuneen/gogui"
)

func errString(err error) string {
	if err != nil {
		return err.Error()
	}
	return ""
}

var debug = false

//SetupEvents setup events to GUI struct.
func SetupEvents(cfg *setting.Setting, gui *gogui.GUI) {
	gui.On("version", func(interface{}) interface{} {
		return setting.Version
	})

	gui.On("register", func(pwd string) interface{} {
		log.Println("reg", pwd)
		adr, err := Register(cfg, pwd)
		return struct {
			Address string
			Error   string
		}{
			Address: adr,
			Error:   errString(err),
		}
	})
	gui.On("login", func(p *LoginParam) interface{} {
		log.Println("login")
		err := errString(Login(cfg, p))
		log.Println("end of login")
		return err
	})

	gui.On("get_balance", func(span byte) interface{} {
		log.Println("get_balance", span)
		bal, err := GetBalance(cfg, span)
		log.Println(bal)
		return struct {
			*Balance
			Error string
		}{
			Balance: bal,
			Error:   errString(err),
		}
	})
	gui.On("get_transactions", func(typ byte) interface{} {
		log.Println("get_transactions", typ)
		tr, err := Transaction(cfg, typ)
		return struct {
			*TxResp
			Error string
		}{
			TxResp: tr,
			Error:  errString(err),
		}
	})

	gui.On("get_newaddress", func(interface{}) interface{} {
		adr, err := NewAddress(cfg)
		return struct {
			Address string
			Error   string
		}{
			Address: adr.Address58(cfg.Config),
			Error:   errString(err),
		}
	})
	gui.On("get_addresses", func(interface{}) interface{} {
		adrs, err := GetAddresses(cfg)
		log.Println("getadr", adrs.Normal)
		log.Println("getadr", adrs.Multisig)
		return struct {
			*GetAddressResp
			Error string
		}{
			GetAddressResp: adrs,
			Error:          errString(err),
		}
	})

	gui.On("send", func(p *tx.BuildParam) interface{} {
		err := Send(cfg, p)
		log.Println(p, err)
		return errString(err)
	})
	gui.On("cancel_pow", func(interface{}) interface{} {
		log.Println("cancel pow")
		err := errString(CancelPoW(cfg))
		log.Println("end of cancel pow")
		return err
	})
	gui.On("validate_addresses", func(adrs []string) interface{} {
		errs := make([]string, len(adrs))
		for i, adr := range adrs {
			if err := ValidateAddress(cfg, adr); err != nil {
				errs[i] = adr + " is an invalid address"
			}
		}
		return errs
	})

	gui.On("get_settings", func(interface{}) interface{} {
		return cfg
	})
	gui.On("get_nodeinfo", func(n int) interface{} {
		log.Println("getnodeinfo start")
		if len(cfg.Client) <= n {
			return "Invalid N"
		}
		ni, err := cfg.Client[n].GetNodeinfo()
		log.Println("getnodeinfo end", ni)
		return struct {
			*crpc.NodeInfo
			Error string
		}{
			NodeInfo: ni,
			Error:    errString(err),
		}
	})
	gui.On("get_nodesstatus", func(interface{}) interface{} {
		log.Println("getnodestatus start")
		defer log.Println("end of getnodestatus")
		return GetNodesStatus(cfg)
	})
	gui.On("update_server", func(servers []string) interface{} {
		return errString(updateSevers(cfg, servers))
	})
	gui.On("update_miner_setting", func(mset *setting.Miner) interface{} {
		return errString(updateMinerSetting(cfg, mset))
	})
	gui.On("get_oldbalance", func(seed gadk.Trytes) interface{} {
		amount, err := GetOldUTXOs(cfg, seed)
		return struct {
			Amount int64
			Error  string
		}{
			Amount: amount,
			Error:  errString(err),
		}
	})
	gui.On("claim", func(p *ClaimParam) interface{} {
		log.Println("claim", p)
		err := errString(Claim(cfg, p, debug))
		log.Println(err)
		return err
	})
	gui.On("logout", func(interface{}) interface{} {
		Logout(cfg)
		return ""
	})
	gui.On("all_privkeys", func(interface{}) interface{} {
		log.Println("all_privkeys")
		pks, err := walletImpl.GetAllPrivateKeys(&cfg.DBConfig)
		log.Println("end of all_privkeys", pks)
		return struct {
			PKs   []string
			Error string
		}{
			PKs:   pks,
			Error: errString(err),
		}
	})

}
