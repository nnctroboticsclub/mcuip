#!/bin/bash

cd /tmp
git clone https://github.com/espressif/binutils-gdb.git --depth 1 binutils-gdb
cd binutils-gdb

./configure
make -j 8
make -j 12 install

cd /tmp
rm -rf binutils-gdb

rm $0