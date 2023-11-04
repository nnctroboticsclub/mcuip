#!/bin/bash

if [ ! -d node_modules ]; then
  bun install
fi

bun run src/index.ts