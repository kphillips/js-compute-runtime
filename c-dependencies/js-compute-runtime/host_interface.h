#ifndef HOST_INTERFACE_H
#define HOST_INTERFACE_H

#include "xqd_remaining.h"
#include "executed.h"

static executed_fastly_status_t fastly_abi_init(uint64_t abi_version);

#ifdef COMPONENT

static inline executed_fastly_status_t fastly_abi_init(uint64_t abi_version) {
    return executed_fastly_abi_init(abi_version);
}

static inline executed_fastly_status_t fastly_http_req_new(uint32_t *ret) {
    return executed_fastly_http_req_new(ret);
}

#else

#include "xqd_migrated.h"

static inline int convert_result(int res) {
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

static inline executed_fastly_status_t fastly_http_req_new(uint32_t *ret) {
    RequestHandle request_handle = {INVALID_HANDLE};
    int res = convert_result(xqd_req_new(&request_handle));
    *ret = request_handle.handle;
    return res;
}

#endif

#endif
