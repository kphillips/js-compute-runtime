#!/usr/bin/env bash

set -euo pipefail

WIT_BINDGEN="${WIT_BINDGEN:-$HOME/src/bytecodealliance/wit-bindgen/target/release/wit-bindgen}"

"$WIT_BINDGEN" guest c \
  --import executed.wit \
  --out-dir . \
  --name executed

mv executed.c executed.cpp
