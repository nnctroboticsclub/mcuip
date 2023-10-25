#!/bin/bash

set -e


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
printf "\x1b[32m[Entrypoint|INFO]\x1b[33m Starting Program...\e[m\n"
exec "$@"