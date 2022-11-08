#ifndef XQD_MIGRATED_H
#define XQD_MIGRATED_H

#include "xqd_remaining.h"

// Module fastly_abi
WASM_IMPORT("fastly_abi", "init")
int xqd_init(uint64_t abi_version);

#endif
