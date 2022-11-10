#!/usr/bin/env bash

set -euo pipefail

WIT_BINDGEN="${WIT_BINDGEN:-$HOME/src/bytecodealliance/wit-bindgen/target/release/wit-bindgen}"

cd "$(dirname "${BASH_SOURCE[0]}")"

"$WIT_BINDGEN" guest c \
  --import executed.wit \
  --out-dir . \
  --name executed
