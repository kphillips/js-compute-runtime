#include "executed.h"


__attribute__((weak, export_name("cabi_realloc")))
void *cabi_realloc(void *ptr, size_t orig_size, size_t org_align, size_t new_size) {
  void *ret = realloc(ptr, new_size);
  if (!ret) abort();
  return ret;
}

// Component Adapters

executed_fastly_status_t executed_fastly_abi_init(uint64_t abi_version) {
  int32_t ret = __wasm_import_executed_fastly_abi_init((int64_t) (abi_version));
  return ret;
}

executed_fastly_status_t executed_fastly_http_req_new(uint32_t *ret) {
  __attribute__((aligned(4)))
  uint8_t ret_area[8];
  int32_t ptr = (int32_t) &ret_area;
  __wasm_import_executed_fastly_http_req_new(ptr);
  executed_result_u32_fastly_status_t result;
  switch ((int32_t) (*((uint8_t*) (ptr + 0)))) {
    case 0: {
      result.is_err = false;
      
      result.val.ok = (uint32_t) (*((int32_t*) (ptr + 4)));
      break;
    }
    case 1: {
      result.is_err = true;
      
      result.val.err = (int32_t) (*((uint8_t*) (ptr + 4)));
      break;
    }
  }*ret = result.val.ok;
  return result.is_err ? result.val.err : -1;
}

extern void __component_type_object_force_link_executed(void);
void __component_type_object_force_link_executed_public_use_in_this_compilation_unit(void) {
  __component_type_object_force_link_executed();
}
