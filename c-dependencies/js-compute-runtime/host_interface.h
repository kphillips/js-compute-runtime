#ifndef HOST_INTERFACE_H
#define HOST_INTERFACE_H

#include "xqd_remaining.h"
#include "executed/executed.h"

static executed_fastly_status_t fastly_abi_init(uint64_t abi_version);

#ifdef COMPONENT

static inline executed_fastly_status_t fastly_abi_init(uint64_t abi_version) {
    return executed_fastly_abi_init(abi_version);
}

#else

#include "xqd_migrated.h"

static inline int convert_result(executed_fastly_status_t res) {
    switch (res) {
        case 0:
            return EXECUTED_FASTLY_STATUS_OK;

        case 1:
            return EXECUTED_FASTLY_STATUS_ERROR;

        default:
            // generically return 1 when the result doesn't map well
            return 1;
    }
}

static inline executed_fastly_status_t fastly_abi_init(uint64_t abi_version) {
    return convert_result(xqd_init(abi_version));
}

#endif

#endif
