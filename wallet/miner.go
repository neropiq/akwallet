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
	"time"

	"github.com/AidosKuneen/aklib"
	"github.com/AidosKuneen/aklib/address"
	"github.com/AidosKuneen/aklib/tx"
	"github.com/AidosKuneen/akwallet/setting"
)

func getaddress(s *setting.Setting) ([]byte, error) {
	mutex.Lock()
	defer mutex.Unlock()
	for adrstr := range wallet.AddressPublic {
		madr, _, err := address.ParseAddress58(s.Config, adrstr)
		return madr, err
	}
	adr, err := wallet.NewAddress(&s.DBConfig, pwd, true)
	if err != nil {
		return nil, err
	}
	return adr.Address(s.Config), nil
}

func mine(s *setting.Setting) (tx.Hash, error) {
	madr, err := getaddress(s)
	if err != nil {
		return nil, err
	}
	var tr *tx.Transaction
	err = s.CallRPC(func(cl setting.RPCIF) error {
		var err2 error
		if s.RunFeeMiner {
			tr, err2 = cl.GetMinableFeeTx(s.MinimumFee * aklib.ADK)
			log.Println(tr, err2)
			if err2 != nil {
				return err2
			}
			if err2 = tr.Check(s.Config, tx.TypeRewardFee); err2 != nil {
				return err2
			}
			if uint64(s.MinimumFee*aklib.ADK) > tr.Outputs[len(tr.Outputs)-1].Value {
				return errors.New("fee is low")
			}
			tr.Outputs[len(tr.Outputs)-1].Address = madr
		}
		if s.RunTicketMiner {
			tr, err2 = cl.GetMinableTicketTx()
			if err2 != nil {
				return err2
			}
			if err2 = tr.Check(s.Config, tx.TypeRewardTicket); err2 != nil {
				return err2
			}
			tr.TicketOutput = madr
		}
		return err2
	})
	if err != nil {
		return nil, err
	}

	log.Println(tr, tr.Hash())
	log.Println("mining", hex.EncodeToString(tr.Hash()))
	log.Println(tr)
	if err := tr.PoW(); err != nil {
		return nil, err
	}
	if err := sendtx(s, tr); err != nil {
		return nil, err
	}
	log.Println("succeeded to mine, txid=", tr.Hash())
	s.GUI.Emit("notify", "Succeeded to mine a ticket '"+tr.Hash().String()[:3]+"...'!", func() {})
	return tr.Hash(), nil
}

func issueTicket(ctx context.Context, s *setting.Setting) (tx.Hash, error) {
	madr, err := getaddress(s)
	if err != nil {
		return nil, err
	}
	ls, err := GetLeaves(s)
	if err != nil {
		return nil, err
	}
	tr, err := tx.IssueTicket(ctx, s.Config, madr, ls...)
	if err != nil {
		log.Println(err)
	}
	if err := sendtx(s, tr); err != nil {
		return nil, err
	}
	log.Println("ticket issued,", tr.Hash())
	if err := s.GUI.Emit("notify", "Succeeded to issue a ticket '"+tr.Hash().String()[:3]+"...'!", func() {}); err != nil {
		return nil, err
	}
	return tr.Hash(), nil
}

//RunMiner runs a miner
func RunMiner(ctx context.Context, s *setting.Setting) {
	if s.RunTicketIssuer {
		log.Println("starting ticket issuer")
		ctx2, cancel2 := context.WithCancel(ctx)
		defer cancel2()
		go func() {
			for {
				if _, err := issueTicket(ctx, s); err != nil {
					log.Println(err)
				}
				select {
				case <-ctx2.Done():
					return
				default:
				}
			}
		}()
	}
	if s.RunTicketMiner || s.RunFeeMiner {
		log.Println("starting miner")
		ctx2, cancel2 := context.WithCancel(ctx)
		defer cancel2()
		go func() {
			for {
				if _, err := mine(s); err != nil {
					log.Println(err)
				}
				select {
				case <-ctx2.Done():
					return
				case <-time.After(10 * time.Second):
				}
			}
		}()
	}

}
