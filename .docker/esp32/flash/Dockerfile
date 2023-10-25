FROM ubuntu:22.04

RUN apt update && \
  apt-get install -y python3 python3-pip make && \
  rm -rf /var/lib/apt/lists/*

RUN python3 -m pip install esptool=="4.6.2"

WORKDIR /root
ADD Makefile /root/Makefile