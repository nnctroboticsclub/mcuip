#!/bin/bash

if [ -z "$AGENT_PROJ" ]; then
    printf "AGENT_PROJ variable is not set. Please set AGENT_PROJ variable.\e[m\n"
    exit 1
fi

xtensa-esp32-elf-gdb $AGENT_PROJ/build/*.elf \
  -ex 'target remote agent-emulator:1234' \
  -ex 'monitor system_reset' \
  -ex 'tb app_main' -ex 'c'

