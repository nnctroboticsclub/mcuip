#!/bin/bash

set -e

if [ -z "$APP" ]; then
    printf "\x1b[32m[Entrypoint|INFO]\x1b[1;31m APP variable is not set. Please set APP variable.\e[m\n"
    exit 1
fi

if [ -z "$EMU_ROOT" ]; then
    printf "\x1b[32m[Entrypoint|INFO]\x1b[1;31m EMU_ROOT variable is not set. Please set EMU_ROOT variable.\e[m\n"
    exit 1
fi

mkdir -p $EMU_ROOT/bin 2> /dev/null || true

. /opt/esp/entrypoint.sh


printf "\x1b[32m[Entrypoint|INFO]\x1b[1;33m Initializing network...\e[m\n"
printf "\x1b[32m[Entrypoint|INFO]\x1b[33m Making bridge...\e[m\n"
ip link add br0 type bridge
mkdir /dev/net
mknod /dev/net/tun c 10 200
chmod 666 /dev/net/tun
ip tuntap add dev tap0 mode tap
ip link set tap0 master br0
ip link set eth0 master br0
ip link set tap0 up
ip link set br0 up
printf "\x1b[32m[Entrypoint|INFO]\x1b[33m Making bridge... [OK]\e[m\n"

printf "\x1b[32m[Entrypoint|INFO]\x1b[33m Building...\e[m\n"
cd $APP
idf.py build

printf "\x1b[32m[Entrypoint|INFO]\x1b[33m Making image\e[m\n"
make -f /tmp/Makefile -C $APP
printf "\x1b[32m[Entrypoint|INFO]\x1b[33m Making image [OK]\e[m\n"

printf "\x1b[32m[Entrypoint|INFO]\x1b[33m Starting emulator...\e[m\n"
QEMU_XTENSA_CORE_REGS_ONLY=1 qemu-system-xtensa
  -machine esp32
  -nographic
  -gdb tcp:0.0.0.0:1234 -S
  -drive file=$EMU_ROOT/bin/flash.bin,if=mtd,format=raw
  -drive file=$EMU_ROOT/bin/efuse.bin,if=none,format=raw,id=efuse
  -global driver=nvram.esp32.efuse,property=drive,value=efuse
  -global driver=esp32.gpio,property=strap_mode,value=0x0f
  -serial tcp::5555,server,nowait