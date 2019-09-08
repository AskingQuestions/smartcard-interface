#include "device.h"

Napi::FunctionReference Device::constructor;

Napi::Object Device::Init(Napi::Env env, Napi::Object exports) {
  Napi::HandleScope scope(env);

  Napi::Function func = DefineClass(env, "Device", {
    InstanceMethod("sendCommand", &Device::SendCommand),
    InstanceMethod("getResponse", &Device::GetResponse),
    InstanceMethod("close", &Device::Close)
  });

  constructor = Napi::Persistent(func);
  constructor.SuppressDestruct();

  exports.Set("Device", func);
  return exports;
}

Device::Device(const Napi::CallbackInfo& info) : Napi::ObjectWrap<Device>(info)  {
  Napi::Env env = info.Env();
  Napi::HandleScope scope(env);

  int length = info.Length();

  Napi::String value = info[0].As<Napi::String>();
  std::string str = value.Utf8Value();
  const char* chr = str.c_str();

  long rc = sc_init(&(this->ctx), (char*) chr); 
  if (rc == SC_OK) {
    // Success
  }else{
    Napi::TypeError::New(env, rc_symb(rc)).ThrowAsJavaScriptException();
  }
}

Device::~Device() {
  if (!this->closed)
    sc_finish(&(this->ctx));
}

Napi::Value Device::Close(const Napi::CallbackInfo& info) {
  if (!this->closed) {
    sc_finish(&(this->ctx));
    this->closed = true;

    return Napi::Boolean::New(info.Env(), true);
  }

  return Napi::Boolean::New(info.Env(), false);
}

Napi::Value Device::SendCommand(const Napi::CallbackInfo& info) {
  Napi::Buffer<char> input = info[0].As<Napi::Buffer<char>>();

  long rc = sc_rawsend(&(this->ctx), input.Data(), static_cast<unsigned char>(input.Length()));

  if (rc != SC_OK) {
    Napi::TypeError::New(info.Env(), rc_symb(rc)).ThrowAsJavaScriptException();
  }

  short outputLength = sizeof(this->ctx.sw);

  Napi::Buffer<char> bf = Napi::Buffer<char>::New(info.Env(), outputLength);

  char* raw = bf.Data();

  for (int i = 0; i < outputLength; i++) {
    raw[i] = this->ctx.sw[i];
  }

  return bf;
}

Napi::Value Device::GetResponse(const Napi::CallbackInfo& info) {
  short outputLength = this->ctx.sw[1];
  this->ctx.lCLA = 0;

  long rc = sc_getresponse(&(this->ctx));

  if (rc != SC_OK) {
    Napi::TypeError::New(info.Env(), rc_symb(rc)).ThrowAsJavaScriptException();
  }

  Napi::Buffer<char> bf = Napi::Buffer<char>::New(info.Env(), outputLength);

  char* raw = bf.Data();

  for (int i = 0; i < outputLength; i++) {
    raw[i] = this->ctx.sw[i];
  }

  return bf;
}