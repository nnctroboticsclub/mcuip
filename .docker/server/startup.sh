#!/bin/bash
set -ex

cd /mnt/app

python3 -m uvicorn server:app --host "" --port 8080 --reload