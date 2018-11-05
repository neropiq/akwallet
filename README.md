[![Build Status](https://travis-ci.org/AidosKuneen/akwallet.svg?branch=master)](https://travis-ci.org/AidosKuneen/akwallet)
[![GoDoc](https://godoc.org/github.com/AidosKuneen/akwallet?status.svg)](https://godoc.org/github.com/AidosKuneen/akwallet)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/AidosKuneen/akwallet/master/LICENSE)
[![Coverage Status](https://coveralls.io/repos/github/AidosKuneen/akwallet/badge.svg?branch=master)](https://coveralls.io/github/AidosKuneen/akwallet?branch=master)
[![GolangCI](https://golangci.com/badges/github.com/AidosKuneen/akwallet.svg)](https://golangci.com/r/github.com/AidosKuneen/akwallet) 

Aidos Wallet (AKWallet)
=====

## Overview

This is the wallet for Aidos Kuneen step2.

UNDER CONSTRUCTION. DON'T TOUCH ME.

## Requirements

* git
* go 1.9+
* yarn

are required to compile.


## Install

    $ git clone github.com/AidosKuneen/akwallet
    $ cd frontend
    $ yarn install
    $ yarn build
    $ cd ..
    $ go generate ./...
    $ cd cmd/akwallet
    $ go build
    $ ./akwallet


## Demo

[![Alt text for your video](https://img.youtube.com/vi/_a2SzlU4uCU/0.jpg)](http://www.youtube.com/watch?v=_a2SzlU4uCU)

## Dependencies and Licenses

This software includes the work that is distributed in the Apache License 2.0.

```
github.com/AidosKuneen/aklib                              MIT License
github.com/AidosKuneen/aknode                             MIT License
github.com/AidosKuneen/akwallet                           MIT License
github.com/AidosKuneen/bliss/bit                          MIT License
github.com/AidosKuneen/consensus                          MIT License
github.com/AidosKuneen/cuckoo                             MIT License
github.com/AidosKuneen/gadk                               MIT License
github.com/AidosKuneen/gogui/browser                      MIT License
github.com/AidosKuneen/numcpu                             MIT License
github.com/AndreasBriese/bbloom                            MIT License, Public Domain
github.com/blang/semver                                   MIT License
github.com/dgraph-io/badger                               Apache License 2.0 
github.com/dgryski/go-farm                                MIT License 
github.com/gobuffalo/envy                                 MIT License
github.com/gobuffalo/packd                                MIT License
github.com/gobuffalo/packr                                MIT License
github.com/golang/protobuf/proto                          BSD 3-clause "New" or "Revised" License (96%)
github.com/google/go-github/github                        BSD 3-clause "New" or "Revised" License (96%)
github.com/google/go-querystring/query                    BSD 3-clause "New" or "Revised" License (96%)
github.com/gorilla/websocket                              BSD 2-clause "Simplified" License (98%)
github.com/inconshreveable/go-update                      Apache License 2.0
github.com/inconshreveable/go-update/internal/binarydist  MIT License 
github.com/inconshreveable/go-update/internal/osext       BSD 3-clause "New" or "Revised" License (96%)
github.com/joho/godotenv                                  MIT License
github.com/markbates/oncer                                MIT License
github.com/natefinch/lumberjack                           MIT License
github.com/pkg/errors                                     BSD 2-clause "Simplified" License
github.com/rhysd/go-github-selfupdate/selfupdate          MIT License
github.com/tcnksm/go-gitconfig                            MIT License
github.com/ulikunitz/xz                                   BSD 3-clause "New" or "Revised" License (96%)
github.com/vmihailenco/msgpack/codes                      BSD 2-clause "Simplified" License
golang.org/x/crypto                                       BSD 3-clause "New" or "Revised" License (96%)
golang.org/x/net                                          BSD 3-clause "New" or "Revised" License (96%)
golang.org/x/oauth2/internal                              BSD 3-clause "New" or "Revised" License (96%)
golang.org/x/sys                                          BSD 3-clause "New" or "Revised" License (96%)
Golang Standard Library                       BSD 3-clause License
```