#!/bin/bash

cd /tmp
git clone https://github.com/espressif/qemu qemu --depth 1
cd qemu

python3 -m venv .venv
python3 -m pip install sphinx

./configure --target-list=xtensa-softmmu \
  --enable-gcrypt \
  --enable-debug --enable-sanitizers \
  --disable-strip --disable-user \
  --disable-capstone --disable-vnc \
  --disable-sdl --disable-gtk

ninja -C build -j8 install

cd /tmp
rm -drf qemu

rm $0