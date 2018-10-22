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
	"errors"
	"log"
	"math"
	"sort"
	"time"

	"github.com/AidosKuneen/aklib/address"
	crpc "github.com/AidosKuneen/aklib/rpc"
	"github.com/AidosKuneen/aklib/tx"
	"github.com/AidosKuneen/aknode/imesh"
	"github.com/AidosKuneen/aknode/walletImpl"
	"github.com/AidosKuneen/akwallet/setting"
)

//Start initialize and starts cron jobs.
func Start(ctx context.Context, s *setting.Setting) {
	go func() {
		ctx2, cancel2 := context.WithCancel(ctx)
		defer cancel2()
		for {
			select {
			case <-ctx2.Done():
				return
			case <-time.After(3 * time.Second):
				_, err := searchLastAddress(s, true)
				if err != nil {
					log.Println(err)
				}
				updatedAdr2, err := searchLastAddress(s, false)
				if err != nil {
					log.Println(err)
				}
				newtx, err := syncDB(s, true)
				if err != nil {
					log.Println(err)
				}
				//addresses for changes should not be used for receiving from others.
				//so update db only if change addresses were updated by other wallets.
				if updatedAdr2 {
					if _, err = syncDB(s, false); err != nil {
						log.Println(err)
					}
				}
				confirmed, err := checkConfirmed(s)
				if err != nil {
					log.Println(err)
				}
				if err := notify(s, newtx, confirmed); err != nil {
					log.Println(err)
				}
			}
		}
	}()
}

//create addresses which were created by other wallets.
func searchLastAddress(s *setting.Setting, isPublic bool) (bool, error) {
	mutex.Lock()
	defer mutex.Unlock()
	adrmap := wallet.AddressChange
	if isPublic {
		adrmap = wallet.AddressPublic
	}
	last := len(adrmap)
	i := 0
	for i = 0; i*50 < math.MaxInt32; i++ {
		exist, err := isUsed(s, isPublic, uint32(last+i*50))
		if err != nil {
			return false, err
		}
		if !exist {
			break
		}
	}
	if i*50 == math.MaxInt32 {
		return false, errors.New("used too many addresses")
	}
	if i == 0 {
		return false, nil
	}
	j := 0
	for j = 0; j < 50; j++ {
		exist, err := isUsed(s, isPublic, uint32(last+(i-1)*50+j))
		if err != nil {
			return false, err
		}
		if !exist {
			break
		}
	}
	for k := 0; k < (i-1)*50+j; k++ {
		if _, err := wallet.NewAddress(&s.DBConfig, pwd, isPublic); err != nil {
			return false, err
		}
	}
	return true, nil
}

func isUsed(s *setting.Setting, isPublic bool, index uint32) (bool, error) {
	var idx uint32
	if !isPublic {
		idx = 1
	}
	seed := address.HDseed(wallet.EncSeed, idx, index)
	a, err := address.New(s.Config, seed)
	if err != nil {
		return false, err
	}
	var hist []*tx.InoutHash
	err = s.CallRPC(func(cl setting.RPCIF) error {
		var err2 error
		hist, err2 = cl.GetLastHistory(a.Address58(s.Config))
		return err2
	})
	return len(hist) > 0, err
}

func checkConfirmed(s *setting.Setting) (bool, error) {
	mutex.Lock()
	defer mutex.Unlock()
	histdb, err := walletImpl.GetHistory(&s.DBConfig)
	if err != nil {
		return false, err
	}
	var unc []string
	for _, h := range histdb {
		ti, err2 := imesh.GetTxInfo(s.DB, h.Hash)
		log.Println(ti.Hash, ti.StatNo)
		if err2 != nil {
			return false, err2
		}
		if ti.StatNo == imesh.StatusPending {
			unc = append(unc, hex.EncodeToString(ti.Hash))
		}
	}
	if len(unc) == 0 {
		log.Println("no pending txs")
		return false, nil
	}
	var stats []*crpc.TxStatus
	err = s.CallRPC(func(cl setting.RPCIF) error {
		var err2 error
		stats, err2 = cl.GetTxsStatus(unc...)
		return err2
	})
	if err != nil {
		return false, err
	}
	var news []tx.Hash
	for i, stat := range stats {
		if stat.IsConfirmed {
			txid, err := hex.DecodeString(unc[i])
			if err != nil {
				return false, err
			}
			ti, err := imesh.GetTxInfo(s.DB, txid)
			if err != nil {
				return false, err
			}
			ti.StatNo = toStatNo(stat)
			ti.IsRejected = stat.IsRejected
			if err := ti.Put(s.DB); err != nil {
				return false, err
			}
			if stat.IsAccepted() {
				news = append(news, txid)
			}
		}
	}
	return len(news) > 0, nil
}

func toStatNo(st *crpc.TxStatus) imesh.StatNo {
	var sno imesh.StatNo

	if st.IsConfirmed {
		b, err := hex.DecodeString(st.LedgerID[:])
		if err != nil {
			panic(err)
		}
		copy(sno[:], b)
		return sno
	}
	return imesh.StatusPending
}

func syncDB(s *setting.Setting, isPublic bool) (bool, error) {
	mutex.Lock()
	defer mutex.Unlock()
	adrmap := wallet.AddressChange
	if isPublic {
		adrmap = wallet.AddressPublic
	}
	histdb, err := walletImpl.GetHistory(&s.DBConfig)
	if err != nil {
		return false, err
	}
	log.Println("histdb", histdb)
	var news []*walletImpl.History
	for adr := range adrmap {
		var hist []*tx.InoutHash
		err := s.CallRPC(func(cl setting.RPCIF) error {
			var err2 error
			hist, err2 = cl.GetLastHistory(adr)
			return err2
		})
		if err != nil {
			return false, err
		}
		log.Println("getlasthistory", hist)
	loop:
		for _, h := range hist {
			log.Println(h.Hash, h.Index, h.Type)
			for _, hdb := range histdb {
				if bytes.Equal(hdb.InoutHash.Bytes(), h.Bytes()) {
					continue loop
				}
			}
			var tr *tx.Transaction
			err3 := s.CallRPC(func(cl setting.RPCIF) error {
				var err2 error
				tr, err2 = cl.GetRawTx(h.Hash.String())
				return err2
			})
			if err3 != nil {
				return false, err3
			}
			if err := putTx(s, tr); err != nil {
				return false, err
			}
			log.Println("put", tr.Hash())
			news = append(news, &walletImpl.History{
				Received: time.Now(),
				//Don't be InoutHash:h, h is iterated
				InoutHash: &tx.InoutHash{
					Hash:  h.Hash,
					Type:  h.Type,
					Index: h.Index,
				},
			})
		}
	}
	sort.Slice(news, func(i, j int) bool {
		return news[i].Received.Before(news[j].Received)
	})
	histdb = append(histdb, news...)
	return len(news) > 0, walletImpl.PutHistory(&s.DBConfig, histdb)
}

func notify(s *setting.Setting, newtx, confirmed bool) error {
	if newtx {
		if err := s.GUI.Emit("new_tx", nil, nil); err != nil {
			return nil
		}
	}
	if confirmed {
		if err := s.GUI.Emit("confirmed", nil, nil); err != nil {
			return nil
		}
	}
	return nil
}