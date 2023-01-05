/******/ (function () {
  // webpackBootstrap
  /******/ 'use strict';
  var __webpack_exports__ = {}; // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true,
      });
    } else {
      obj[key] = value;
    }

    return obj;
  } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly &&
        (symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })),
        keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2
        ? ownKeys(Object(source), !0).forEach(function (key) {
            _defineProperty(target, key, source[key]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(
            target,
            Object.getOwnPropertyDescriptors(source)
          )
        : ownKeys(Object(source)).forEach(function (key) {
            Object.defineProperty(
              target,
              key,
              Object.getOwnPropertyDescriptor(source, key)
            );
          });
    }

    return target;
  } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
  function _setPrototypeOf(o, p) {
    _setPrototypeOf =
      Object.setPrototypeOf ||
      function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };

    return _setPrototypeOf(o, p);
  } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/inherits.js
  function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
      throw new TypeError('Super expression must either be null or a function');
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true,
      },
    });
    Object.defineProperty(subClass, 'prototype', {
      writable: false,
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf
      ? Object.getPrototypeOf
      : function _getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
        };
    return _getPrototypeOf(o);
  } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js
  function _isNativeReflectConstruct() {
    if (typeof Reflect === 'undefined' || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === 'function') return true;

    try {
      Boolean.prototype.valueOf.call(
        Reflect.construct(Boolean, [], function () {})
      );
      return true;
    } catch (e) {
      return false;
    }
  } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
  function _typeof(obj) {
    '@babel/helpers - typeof';

    return (
      (_typeof =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
          ? function (obj) {
              return typeof obj;
            }
          : function (obj) {
              return obj &&
                'function' == typeof Symbol &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? 'symbol'
                : typeof obj;
            }),
      _typeof(obj)
    );
  } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError(
        "this hasn't been initialised - super() hasn't been called"
      );
    }

    return self;
  } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js
  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError(
        'Derived constructors may only return object or undefined'
      );
    }

    return _assertThisInitialized(self);
  } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/createSuper.js
  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
        result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, 'prototype', {
      writable: false,
    });
    return Constructor;
  } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  } // CONCATENATED MODULE: ./src/connector/service/chrome/content.ts
  var ExtensionConnector = /*#__PURE__*/ _createClass(
    function ExtensionConnector() {
      /* empty */ var _this = this;
      _classCallCheck(this, ExtensionConnector);
      this.resolver = { currentId: 1, requests: new Map() };
      this.processEventType = '';
      this.setup = function () {
        window.addEventListener('message', _this.eventHandler);
      };
      this.rpcCall = function (func, params) {
        return new Promise(function (resolve, reject) {
          var msg = {
            type: _this.processEventType,
            direction: 'request',
            requestId: ''.concat(_this.resolver.currentId),
            function: func,
            payload: params,
          };
          console.log('new message to send: ', msg);
          window.postMessage(msg);
          _this.resolver.requests.set(''.concat(_this.resolver.currentId), {
            resolve: resolve,
            reject: reject,
          });
          _this.resolver.currentId++;
        });
      };
      this.eventHandler = function (event) {
        if (
          event.data.type === _this.processEventType &&
          event.data.direction === 'response'
        ) {
          var promise = _this.resolver.requests.get(event.data.requestId);
          console.log(event, promise);
          if (promise !== undefined) {
            _this.resolver.requests.delete(event.data.requestId);
            var ret = event.data;
            if (ret.isSuccess) {
              _this.processEvent(ret, promise.resolve);
            } else {
              promise.reject(ret);
            }
          }
        }
      };
      this.processEvent = function (data, callback) {
        callback(data);
      };
    }
  );
  var MinotaurConnector = /*#__PURE__*/ (function (_ExtensionConnector) {
    _inherits(MinotaurConnector, _ExtensionConnector);
    var _super = _createSuper(MinotaurConnector);
    function MinotaurConnector() {
      var _this2;
      _classCallCheck(this, MinotaurConnector);
      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key];
      }
      _this2 = _super.call.apply(_super, [this].concat(args));
      _this2.processEventType = 'auth';
      _this2.connect = function (url) {
        return new Promise(function (resolve, reject) {
          _this2
            .rpcCall('connect', { server: url })
            .then(function (res) {
              return resolve(true);
            })
            .catch(function () {
              return reject();
            });
        });
      };
      _this2.is_connected = function () {
        return new Promise(function (resolve, reject) {
          _this2
            .rpcCall('is_connected')
            .then(function (res) {
              return resolve(res.payload);
            })
            .catch(function () {
              return reject();
            });
        });
      };
      _this2.processEvent = function (data, callback) {
        if (data.isSuccess) {
          window.ergo = MinotaurApi.getInstance();
          callback(data);
        }
      };
      return _this2;
    }
    return _createClass(MinotaurConnector);
  })(ExtensionConnector);
  MinotaurConnector.instance = void 0;
  MinotaurConnector.getInstance = function () {
    if (!MinotaurConnector.instance) {
      MinotaurConnector.instance = new MinotaurConnector();
      MinotaurConnector.instance.setup();
    }
    return MinotaurConnector.instance;
  };
  var MinotaurApi = /*#__PURE__*/ (function (_ExtensionConnector2) {
    _inherits(MinotaurApi, _ExtensionConnector2);
    var _super2 = _createSuper(MinotaurApi);
    function MinotaurApi() {
      var _this3;
      _classCallCheck(this, MinotaurApi);
      for (
        var _len2 = arguments.length, args = new Array(_len2), _key2 = 0;
        _key2 < _len2;
        _key2++
      ) {
        args[_key2] = arguments[_key2];
      }
      _this3 = _super2.call.apply(_super2, [this].concat(args));
      _this3.processEventType = 'call';
      _this3.get_used_addresses = function (paginate) {
        return new Promise(function (resolve, reject) {
          _this3
            .rpcCall('address', { type: 'used', page: paginate })
            .then(function (res) {
              var data = res;
              resolve(data.payload);
            })
            .catch(function (err) {
              return reject(err);
            });
        });
      };
      _this3.get_unused_addresses = function (paginate) {
        return new Promise(function (resolve, reject) {
          _this3
            .rpcCall('address', { type: 'unused', page: paginate })
            .then(function (res) {
              var data = res;
              resolve(data.payload);
            })
            .catch(function (err) {
              return reject(err);
            });
        });
      };
      _this3.get_change_address = function () {
        return new Promise(function (resolve, reject) {
          _this3
            .rpcCall('address', { type: 'change' })
            .then(function (res) {
              console.log('res is ', res);
              var data = res;
              var addresses = data.payload;
              if (addresses.length > 0) {
                resolve(addresses[0]);
              } else {
                reject();
              }
            })
            .catch(function (err) {
              return reject(err);
            });
        });
      };
      _this3.get_balance = function () {
        var token_id =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : 'ERG';
        for (
          var _len3 = arguments.length,
            token_ids = new Array(_len3 > 1 ? _len3 - 1 : 0),
            _key3 = 1;
          _key3 < _len3;
          _key3++
        ) {
          token_ids[_key3 - 1] = arguments[_key3];
        }
        return new Promise(function (resolve, reject) {
          _this3
            .rpcCall('balance', { tokens: [token_id].concat(token_ids) })
            .then(function (res) {
              console.log(res);
              var data = res.payload;
              var output = {};
              if (token_ids.length) {
                output[token_id] = BigInt(data[token_id]);
                token_ids.forEach(function (token) {
                  var tokenIdOrErg = token ? token : 'ERG';
                  output[tokenIdOrErg] = BigInt(data[tokenIdOrErg]);
                });
                resolve(output);
              } else {
                resolve(BigInt(data[token_id ? token_id : 'ERG']));
              }
            })
            .catch(function () {
              return reject();
            });
        });
      };
      _this3.get_utxos = function (amount) {
        var token_id =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : 'ERG';
        var paginate = arguments.length > 2 ? arguments[2] : undefined;
        return new Promise(function (resolve, reject) {
          _this3
            .rpcCall('boxes', {
              amount: amount,
              token_id: token_id,
              paginate: paginate,
            })
            .then(function (res) {
              var data = res.payload;
              resolve(data);
            })
            .catch(function () {
              return reject();
            });
        });
      };
      _this3.sign_tx = function (tx) {
        return new Promise(function (resolve, reject) {
          _this3
            .rpcCall('sign', { utx: tx })
            .then(function (res) {
              var data = res.payload;
              var response = data.error ? data.error : data.stx;
              resolve(response);
            })
            .catch(function () {
              return reject();
            });
        });
      };
      _this3.submit_tx = function (tx) {
        return new Promise(function (resolve, reject) {
          _this3
            .rpcCall('submit', { utx: tx })
            .then(function (res) {
              var data = res.payload;
              var response = data.error ? data.error : data.TxId;
              resolve(response);
            })
            .catch(function () {
              return reject();
            });
        });
      };
      return _this3;
    }
    return _createClass(MinotaurApi);
  })(ExtensionConnector); // sign_tx_input = (tx, index) => {
  //     return this._rpcCall("signTxInput", [tx, index]);
  // }
  // sign_data = (addr, message) => {
  //     return this._rpcCall("signData", [addr, message]);
  // }
  // _rpcCall = (func: string, params?: any) => {
  //     return new Promise((resolve, reject) => {
  //         window.postMessage({
  //             type: "rpc/connector-request",
  //             requestId: this.resolver.currentId,
  //             function: func,
  //             params
  //         });
  //         this.resolver.requests.set(this.resolver.currentId, {resolve: resolve, reject: reject});
  //         this.resolver.currentId++;
  //     });
  // }
  //
  //     eventHandler = (event) => {
  //         if (event.data.type === "rpc/connector-response") {
  //             console.debug(JSON.stringify(event.data));
  //             const promise = this.resolver.requests.get(event.data.requestId);
  //             if (promise !== undefined) {
  //                 this.resolver.requests.delete(event.data.requestId);
  //                 const ret = event.data.return;
  //                 if (ret.isSuccess) {
  //                     promise.resolve(ret.data);
  //                 } else {
  //                     promise.reject(ret.data);
  //                 }
  //             }
  //         }
  //     };
  //
  // }
  MinotaurApi.instance = void 0;
  MinotaurApi.getInstance = function () {
    if (!MinotaurApi.instance) {
      MinotaurApi.instance = new MinotaurApi();
      MinotaurApi.instance.setup();
    }
    return MinotaurApi.instance;
  };
  var setupErgo = function setupErgo() {
    if (window.ergoConnector !== undefined) {
      window.ergoConnector = _objectSpread2(
        _objectSpread2({}, window.ergoConnector),
        {},
        { minotaur: Object.freeze(MinotaurConnector.getInstance()) }
      );
    } else {
      window.ergoConnector = {
        minotaur: Object.freeze(MinotaurConnector.getInstance()),
      };
    }
    var warnDeprecated = function warnDeprecated(func) {
      console.warn(
        "[Deprecated] In order to avoid conflicts with another wallets, this method will be disabled and replaced by '" +
          func +
          "' soon."
      );
    };
    if (!window.ergo_request_read_access && !window.ergo_check_read_access) {
      window.ergo_request_read_access = function () {
        warnDeprecated('ergoConnector.minotaur.connect()');
        return MinotaurConnector.getInstance()
          .connect()
          .then(function (res) {
            return null;
          });
      };
      window.ergo_check_read_access = function () {
        warnDeprecated('ergoConnector.minotaur.isConnected()');
        return MinotaurConnector.getInstance()
          .is_connected()
          .then(function (res) {
            return null;
          });
      };
    }
  };
  setupErgo(); // export default setupErgo;

  /******/
})();
//# sourceMappingURL=content.js.map
