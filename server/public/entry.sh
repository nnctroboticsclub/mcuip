#!/bin/bash

if [ ! -d node_modules ]; then
  bun install
fi

bun --bun run dev -- --host 0.0.0.0