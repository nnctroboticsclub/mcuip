#!/bin/bash

set -ex

cd $(dirname $0)

bun install
bun --bun run dev -- --host 0.0.0.0