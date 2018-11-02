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

package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"
	_ "net/http/pprof"
	"os"
	"os/user"
	"path/filepath"
	"runtime"
	"time"

	"github.com/AidosKuneen/aklib/updater"
	"github.com/AidosKuneen/akwallet/gui"
	"github.com/AidosKuneen/akwallet/setting"
	"github.com/AidosKuneen/akwallet/wallet"
	"github.com/AidosKuneen/gogui"
	"github.com/natefinch/lumberjack"
)

func main() {
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
	usr, err2 := user.Current()
	if err2 != nil {
		fmt.Println(err2)
		os.Exit(1)
	}
	defaultpath := filepath.Join(usr.HomeDir, ".akwallet")
	var verbose, update, debug bool
	var rootdir string
	var net int
	flag.BoolVar(&verbose, "verbose", false, "outputs logs to stdout.")
	flag.BoolVar(&update, "update", false, "check for update")
	flag.StringVar(&rootdir, "dbpath", defaultpath, "db path")
	flag.BoolVar(&debug, "debug", false, "debug to monitor performance")
	flag.IntVar(&net, "net", 0, "network to use. 0=mainnet 1=testnet")
	flag.Parse()

	if net != 0 && net != 1 && net != 2 {
		fmt.Println("net must be 0(mainnet) or 1(testnet)")
	}

	if update {
		if err := updater.Update("AidosKuneen/akwallet", setting.Version); err != nil {
			log.Fatal(err)
		}
		return
	}
	ctx, cancel := context.WithCancel(context.Background())

	if debug {
		//for pprof
		srv := &http.Server{Addr: "127.0.0.1:6061"}
		go func() {
			runtime.SetBlockProfileRate(1)
			log.Println(srv.ListenAndServe())
		}()
		go func() {
			ctx2, cancel2 := context.WithCancel(ctx)
			defer cancel2()
			<-ctx2.Done()
			if err := srv.Shutdown(ctx2); err != nil {
				log.Print(err)
			}
		}()
	}

	setting, err2 := setting.Load(rootdir, net)
	if err2 != nil {
		fmt.Println(err2)
		os.Exit(1)
	}
	if !verbose {
		l := &lumberjack.Logger{
			Filename:   filepath.Join(setting.BaseDir(), "akwallet.log"),
			MaxSize:    10, // megabytes
			MaxBackups: 10,
			MaxAge:     30 * 3, //days
		}
		log.SetOutput(l)
	}

	wallet.Start(ctx, setting)
	guis := gogui.New()
	setting.GUI = guis
	wallet.SetupEvents(setting, guis)
	ctx, cancel2 := context.WithCancel(context.Background())
	setting.CancelMiner = cancel2
	wallet.RunMiner(ctx, setting)
	if err := gui.Run(guis, ""); err != nil {
		log.Println(err)
		fmt.Println(err)
		os.Exit(1)
	}
	gui.Wait(guis)
	time.Sleep(3 * time.Second)
	cancel2()
	cancel()
	time.Sleep(3 * time.Second)
	if err := setting.DB.Close(); err != nil {
		log.Println(err)
	}
	log.Println("akwallet was stopped")
}
