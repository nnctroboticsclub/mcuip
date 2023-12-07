#!/bin/bash

set -ex

cd $(dirname $0)

bun install
bun run src/index.ts