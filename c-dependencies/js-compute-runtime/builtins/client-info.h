#ifndef BUILTIN_CLIENT_INFO_H
#define BUILTIN_CLIENT_INFO_H

#include "builtin.h"

namespace builtins {

class ClientInfo final : public BuiltinNoConstructor<ClientInfo> {
  static bool address_get(JSContext *cx, unsigned argc, JS::Value *vp);
  static bool geo_get(JSContext *cx, unsigned argc, JS::Value *vp);

public:
  static constexpr const char *class_name = "FetchEvent";

  enum class Slots {
    Address,
    GeoInfo,
    Count,
  };

  static const JSFunctionSpec methods[];
  static const JSPropertySpec properties[];
  static const JSPropertySpec static_properties[];
  static const JSFunctionSpec static_methods[];

  static JSObject *create(JSContext *cx);
};

} // namespace builtins

#endif
