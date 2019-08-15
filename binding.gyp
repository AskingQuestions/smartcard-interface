{
  "targets": [
    {
      "target_name": "addon",
      "sources": [  ],
      "include_dirs": ["<!@(node -p \"require('node-addon-api').include\")"],
      "dependencies": ["<!(node -p \"require('node-addon-api').gyp\")"],
      "defines": [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
      'conditions': [
        [
          'OS == "win"',
          {
            'sources': [
              "binding.cc", "device.cc", "PCSCWRAP.c"
            ]
          }
        ]
      ]
    }
  ]
}