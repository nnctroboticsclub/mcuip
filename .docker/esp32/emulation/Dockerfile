FROM ubuntu:22.04

#* Timezone

ENV TZ=Asia/Tokyo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

#* Qemu
RUN apt update && \
  apt install -y \
  build-essential \
  wget \
  git \
  python3-pip \
  python3-venv \
  ninja-build \
  pkg-config \
  libglib2.0-dev \
  libpixman-1-dev \
  flex \
  bison \
  libgcrypt20-dev && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /tmp
RUN git clone https://github.com/espressif/qemu qemu --depth 1


WORKDIR /tmp/qemu
RUN \
  python3 -m venv .venv && \
  python3 -m pip install sphinx

RUN \
  ./configure --target-list=xtensa-softmmu \
  --enable-gcrypt \
  --enable-debug --enable-sanitizers \
  --disable-strip --disable-user \
  --disable-capstone --disable-vnc \
  --disable-sdl --disable-gtk

WORKDIR /tmp/qemu/build
RUN ninja -j8 install

WORKDIR /tmp
RUN rm -drf qemu

WORKDIR /
RUN \
  apt update && \
  apt install iproute2 -y && \
  rm -rf /var/lib/apt/lists/*
ADD entrypoint.sh /tmp/entrypoint.sh
ENTRYPOINT [ "/tmp/entrypoint.sh" ]