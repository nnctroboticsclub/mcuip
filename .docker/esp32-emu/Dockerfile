FROM espressif/idf:release-v4.4

#* Timezone

ENV TZ=Asia/Tokyo
RUN ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime && echo "$TZ" > /etc/timezone

#* Qemu
RUN apt-get update && \
  apt-get install -y \
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
  libgcrypt20-dev \
  libgmp-dev \
  libncurses-dev \
  texinfo \
  iproute2 && \
  rm -rf /var/lib/apt/lists/*

COPY build-qemu.sh /tmp
RUN /tmp/build-qemu.sh

# COPY build-binutils.sh /tmp
# RUN /tmp/build-binutils.sh

# WORKDIR /tmp
# RUN \
#   apt update && \
#   apt install iproute2 -y && \
#   rm -rf /var/lib/apt/lists/*

COPY Makefile /tmp
COPY entrypoint.sh /tmp/entrypoint.sh
ENTRYPOINT [ "/tmp/entrypoint.sh" ]