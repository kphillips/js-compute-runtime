#ifndef __BINDINGS_EXECUTED_H
#define __BINDINGS_EXECUTED_H

#include <stdlib.h>
#include <stdint.h>
#include <stdbool.h>

typedef uint8_t executed_fastly_status_t;

#define EXECUTED_FASTLY_STATUS_OK 0
#define EXECUTED_FASTLY_STATUS_ERROR 1

typedef struct {
  bool is_err;
  union {
    uint32_t ok;
    executed_fastly_status_t err;
  } val;
} executed_result_u32_fastly_status_t;

// Imported Functions from `executed`

__attribute__((import_module("executed"), import_name("fastly-abi-init")))
int32_t __wasm_import_executed_fastly_abi_init(int64_t);
executed_fastly_status_t executed_fastly_abi_init(uint64_t abi_version);

__attribute__((import_module("executed"), import_name("fastly-http-req-new")))
void __wasm_import_executed_fastly_http_req_new(int32_t);
executed_fastly_status_t executed_fastly_http_req_new(uint32_t *ret);

#endif
