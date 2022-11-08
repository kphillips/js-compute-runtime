#ifndef __BINDINGS_EXECUTED_H
#define __BINDINGS_EXECUTED_H
#ifdef __cplusplus
extern "C" {
#endif

#include <stdlib.h>
#include <stdint.h>
#include <stdbool.h>

typedef uint8_t executed_fastly_status_t;

#define EXECUTED_FASTLY_STATUS_OK 0
#define EXECUTED_FASTLY_STATUS_ERROR 1

// Imported Functions from `executed`

__attribute__((import_module("executed"), import_name("fastly-abi-init")))
int32_t __wasm_import_executed_fastly_abi_init(int64_t);
executed_fastly_status_t executed_fastly_abi_init(uint64_t abi_version);

#ifdef __cplusplus
}
#endif
#endif
