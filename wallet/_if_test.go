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
	"errors"

	crpc "github.com/AidosKuneen/aklib/rpc"
	"github.com/AidosKuneen/aklib/tx"
)

type gui struct {
}

func (g *gui) On(n string, f interface{}) {
}
func (g *gui) Emit(name string, dat interface{}, f interface{}) error {
	return nil
}

type rpcif struct {
	testnet byte
	txs     map[string]*tx.Transaction
	asked   map[string]int
	sent    *tx.Transaction
	status  *crpc.TxStatus
	minable *tx.Transaction
}

func newrpc() *rpcif {
	return &rpcif{
		txs:   make(map[string]*tx.Transaction),
		asked: make(map[string]int),
	}
}

func (r *rpcif) GetLastHistory(adr string) ([]*crpc.InoutHash, error) {
	return nil, nil
}

func (r *rpcif) GetTxsStatus(txid ...string) ([]*crpc.TxStatus, error) {
	res := make([]*crpc.TxStatus, len(txid))
	for i := range res {
		res[i] = r.status
	}
	return res, nil
}

func (r *rpcif) GetNodeinfo() (*crpc.NodeInfo, error) {
	return &crpc.NodeInfo{
		Testnet: r.testnet,
	}, nil
}

func (r *rpcif) GetLeaves() ([]string, error) {
	return []string{"0", "1"}, nil
}

func (r *rpcif) SendRawTX(tr *tx.Transaction, typ tx.Type) (string, error) {
	r.sent = tr
	return "", nil
}

func (r *rpcif) GetRawTx(txid string) (*tx.Transaction, error) {
	tx, ok := r.txs[txid]
	if !ok {
		return nil, errors.New("not found")
	}
	if r.asked[txid]++; r.asked[txid] > 1 {
		return nil, errors.New("asked twice")
	}
	return tx, nil
}

func (r *rpcif) GetMinableTicketTx() (*tx.Transaction, error) {
	if r.minable == nil {
		return nil, errors.New("not found")
	}
	return r.minable, nil
}

func (r *rpcif) GetMinableFeeTx(fee float64) (*tx.Transaction, error) {
	if r.minable == nil {
		return nil, errors.New("not found")
	}
	return r.minable, nil
}
