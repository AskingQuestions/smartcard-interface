#include <napi.h>
#include "device.h"

using namespace Napi;

String Method(const CallbackInfo& info) {
	Env env = info.Env();
	return String::New(env, "world");
}

Object Init(Env env, Object exports) {
	return Device::Init(env, exports);
}

NODE_API_MODULE(hello, Init)