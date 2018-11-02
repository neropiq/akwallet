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
)

//Run starts GUI backend.
func Run(gui *gogui.GUI, dest string) error {
	box := packr.NewBox("./asset")
	if dest == "" {
		http.Handle("/", http.FileServer(box))
	}
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
