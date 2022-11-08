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

extern void __component_type_object_force_link_executed(void);
void __component_type_object_force_link_executed_public_use_in_this_compilation_unit(void) {
  __component_type_object_force_link_executed();
}
