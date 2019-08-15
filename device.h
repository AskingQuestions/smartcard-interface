#ifndef Device_H
#define Device_H

#include <napi.h>

#include <stdlib.h>
#include <stdio.h>
#include <conio.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <io.h>

#include "pcscwrap.h"

class Device : public Napi::ObjectWrap<Device> {
 public:
  static Napi::Object Init(Napi::Env env, Napi::Object exports);
  Device(const Napi::CallbackInfo& info);
  ~Device();

 private:
  static Napi::FunctionReference constructor;

  Napi::Value SendCommand(const Napi::CallbackInfo& info);
  Napi::Value Close(const Napi::CallbackInfo& info);

  double value_;
  sc_context ctx = {0};
  bool closed = false;

};

#endif