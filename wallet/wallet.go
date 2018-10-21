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
	"sync"

	"github.com/AidosKuneen/aknode/imesh"

	"github.com/AidosKuneen/aknode/walletImpl"
	"github.com/AidosKuneen/akwallet/setting"
)

var mutex sync.RWMutex

var wallet *walletImpl.Wallet
var pwd []byte

//Load initialize wallet struct.
func Load(s *setting.Setting, pwdd []byte, priv string) error {
	pwd = pwdd
	var err error
	wallet, err = walletImpl.Load(&s.DBConfig, pwd, priv)
	return err
}

//New creates a new wallet.
func New(s *setting.Setting, pwdd []byte, priv string) error {
	pwd = pwdd
	var err error
	wallet, err = walletImpl.NewFromPriv(&s.DBConfig, pwd, priv)
	return err
}

//assuming a tr is for sending or receiving, i.e there is no same public  addresses
//in both of inputs and outputs.
func allAmount(s *setting.Setting, tr *imesh.TxInfo) (int64, error) {
	var bal int64
	for _, in := range tr.Body.Inputs {
		out, err := PreviousOutput(s, in)
		if err != nil {
			return 0, err
		}
		if wallet.FindAddress(out.Address.String()) {
			bal -= int64(out.Value)
		}
	}
	for _, out := range tr.Body.Outputs {
		if wallet.FindAddress(out.Address.String()) {
			bal += int64(out.Value)
		}
	}
	return bal, nil
}
