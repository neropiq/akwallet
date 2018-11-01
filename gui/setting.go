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

package gui

import (
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/AidosKuneen/gogui"
	"github.com/gobuffalo/packr"
	qrcode "github.com/skip2/go-qrcode"
)

//Run starts GUI backend.
func Run(gui *gogui.GUI, dest string) error {
	box := packr.NewBox("./asset")
	http.Handle("/", http.FileServer(box))
	if err := gui.Start(dest); err != nil {
		return err
	}
	select {
	case <-time.After(10 * time.Second):
		return errors.New("failed to initialize")
	case <-gui.Connected:
		return nil
	}
}

//Wait waits for GUI to be finished.
func Wait(gui *gogui.GUI) {
	if err := <-gui.Finished; err != nil {
		log.Println(err)
	}
}

func handleQRcode(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		return
	}
	if err := r.ParseForm(); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	f := r.Form["code"]
	if len(f) != 1 || f[0] == "" {
		log.Println("invalid code")
		http.Error(w, "invalid code", http.StatusBadRequest)
		return
	}
	code := f[0]
	if len(code) > 100 {
		http.Error(w, "invalid code", http.StatusBadRequest)
		return
	}
	qr, err := qrcode.New(code, qrcode.High)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Fatal(err)
	}
	if err := qr.Write(256, w); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Fatal(err)
	}
}
