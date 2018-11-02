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
	"errors"
	"fmt"
	"log"
	"sync"

	"github.com/AidosKuneen/aklib/address"
	"github.com/AidosKuneen/aklib/tx"
	"github.com/AidosKuneen/aknode/imesh"
	"github.com/AidosKuneen/akwallet/setting"
)

type trWallet struct {
	conf *setting.Setting
}

//GetUTXO returns UTXOs whose total is over outtotal.
func (w *trWallet) GetUTXO(outtotal uint64) ([]*tx.UTXO, error) {
	var utxos []*tx.UTXO
	u2, total, err := wallet.GetUTXO(&w.conf.DBConfig, pwd, false)
	if err != nil {
		return nil, err
	}
	utxos = append(utxos, u2...)
	if outtotal > total {
		u10, bal10, err := wallet.GetUTXO(&w.conf.DBConfig, pwd, true)
		if err != nil {
			return nil, err
		}
		total += bal10
		utxos = append(utxos, u10...)
		if outtotal > total {
			return nil, fmt.Errorf("insufficient balance, needed %v, balance %v", outtotal, total)
		}
	}
	return utxos, nil
}

//GetLeaves return leaves hashes.
func (w *trWallet) GetLeaves() ([]tx.Hash, error) {
	return GetLeaves(w.conf)
}

//GetTicketout returns a tx hash including ticket output for the wallet.
func (w *trWallet) GetTicketout() (tx.Hash, *address.Address, error) {
	for adrname := range wallet.AddressPublic {
		hs, err := imesh.GetHisoty2(&w.conf.DBConfig, adrname, true)
		if err != nil {
			return nil, nil, err
		}
		for _, h := range hs {
			if h.Type != tx.TypeTicketout {
				continue
			}
			tr, err := imesh.GetTxInfo(w.conf.DB, h.Hash)
			if err != nil {
				return nil, nil, err
			}
			if !tr.IsAccepted() {
				continue
			}
			adr, err := wallet.GetAddress(&w.conf.DBConfig, adrname, pwd)
			return h.Hash, adr.Address, err
		}
	}
	return nil, nil, errors.New("Ticket is not found")
}

//NewChangeAddress returns a new address for change.
func (w *trWallet) NewChangeAddress() (*address.Address, error) {
	return wallet.NewAddress(&w.conf.DBConfig, pwd, false)
}

var powmutex sync.Mutex

//Send sends token.
func Send(conf *setting.Setting, p *tx.BuildParam) error {
	if conf.CancelPoW != nil {
		return errors.New("PoW is alaredy running")
	}
	mutex.Lock()
	w := &trWallet{
		conf: conf,
	}
	tr, err := tx.Build2(conf.Config, w, p)
	mutex.Unlock()
	if err != nil {
		return err
	}
	if p.PoWType == tx.TypeNormal {
		go func() {
			if err2 := pow(conf, tr, p); err2 != nil {
				log.Println(err2)
				return
			}
			log.Println("finished PoW. hash=", tr.Hash())
		}()
		return nil
	}
	if err = tr.Check(conf.Config, p.PoWType); err != nil {
		log.Println(err)
		return err
	}
	return conf.CallRPC(func(cl setting.RPCIF) error {
		_, err2 := cl.SendRawTX(tr, p.PoWType)
		return err2
	})
	//Don't save tr to db , which should be stored by cron.
}

func pow(conf *setting.Setting, tr *tx.Transaction, p *tx.BuildParam) error {
	log.Println("starting PoW...")
	var ctx context.Context
	ctx, conf.CancelPoW = context.WithCancel(context.Background())
	powmutex.Lock()
	err := tr.PoWContext(ctx)
	defer func() {
		conf.CancelPoW()
		conf.CancelPoW = nil
	}()
	powmutex.Unlock()
	err2 := conf.GUI.Emit("finished_pow", errString(err), nil)
	if err != nil {
		return err
	}
	if err2 != nil {
		return err2
	}
	if err = tr.Check(conf.Config, p.PoWType); err != nil {
		return err
	}
	return conf.CallRPC(func(cl setting.RPCIF) error {
		_, err2 := cl.SendRawTX(tr, p.PoWType)
		return err2
	})
}
