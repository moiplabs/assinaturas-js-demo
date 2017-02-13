(function() {
  var Address, BASE_URI_ASSINATURAS, BillingInfo, Coupon, Customer, ENV, MoipAssinaturas, Response, Subscription, _JSON, _f;

  _f = function(n) {
    if (n < 10) {
      return "0" + n;
    } else {
      return n;
    }
  };

  Date.prototype._toJSON = function(key) {
    if (isFinite(this.valueOf())) {
      return this.getUTCFullYear() + '-' + _f(this.getUTCMonth() + 1) + '-' + _f(this.getUTCDate()) + 'T' + _f(this.getUTCHours()) + ':' + _f(this.getUTCMinutes()) + ':' + _f(this.getUTCSeconds()) + '.' + _f(this.getUTCMilliseconds()) + 'Z';
    } else {
      return null;
    }
  };

  if (!Date.prototype.toJSON) {
    Date.prototype.toJSON = Date.prototype._toJSON;
  }

  String.prototype._toJSON = Number.prototype._toJSON = Boolean.prototype._toJSON = function(key) {
    return this.valueOf();
  };

  if (!String.prototype.toJSON) {
    String.prototype.toJSON = String.prototype._toJSON;
  }

  if (!Number.prototype.toJSON) {
    Number.prototype.toJSON = Number.prototype._toJSON;
  }

  if (!Boolean.prototype.toJSON) {
    Boolean.prototype.toJSON = Boolean.prototype._toJSON;
  }

  _JSON = (function() {
    function _JSON() {}

    _JSON.prototype.parse = function(text) {
      var array, at, ch, error, escapee, next, number, object, result, string, value, white, word;
      if (!text) {
        return;
      }
      at = null;
      ch = ' ';
      escapee = {
        '"': '"',
        '\\': '\\',
        '/': '/',
        b: '\b',
        f: '\f',
        n: '\n',
        r: '\r',
        t: '\t'
      };
      error = function(message) {
        throw new SyntaxError(message + " at character #" + at + "(" + ch + "); for text: " + text);
      };
      next = function(c) {
        if (c && c !== ch) {
          error("Expected '" + c + "' instead of '" + ch);
        }
        return ch = text.charAt(at++);
      };
      number = function() {
        var _number, string;
        string = '';
        if (ch === '-') {
          string = '-';
          next('-');
        }
        while (ch >= '0' && ch <= '9') {
          string += ch;
          next();
        }
        if (ch === '.') {
          string += '.';
          while (next() && ch >= '0' && ch <= '9') {
            string += ch;
          }
        }
        if (ch === 'e' || ch === 'E') {
          string += ch;
          next();
          if (ch === '-' || ch === '+') {
            string += ch;
            next();
          }
          while (ch >= '0' && ch <= '9') {
            string += ch;
            next();
          }
        }
        _number = +string;
        if (!isFinite(_number)) {
          error('Bad number');
        } else {
          return _number;
        }
      };
      string = function() {
        var _string, hex, i, j, uffff;
        _string = '';
        if (ch === '"') {
          while (next()) {
            if (ch === '"') {
              next();
              return _string;
            } else if (ch === '\\') {
              next();
              if (ch === 'u') {
                uffff = 0;
                for (i = j = 0; j < 4; i = ++j) {
                  hex = parseInt(next(), 16);
                  if (!isFinite(hex)) {
                    break;
                  }
                  uffff *= 16 + hex;
                }
                _string += String.fromCharCode(uffff);
              } else if (typeof escapee[ch] === 'string') {
                _string += escapee[ch];
              } else {
                break;
              }
            } else {
              _string += ch;
            }
          }
        }
        error('Bad string');
      };
      white = function() {
        while (ch && ch <= ' ') {
          next();
        }
      };
      word = function() {
        switch (ch) {
          case 't':
            next('t');
            next('r');
            next('u');
            next('e');
            true;
            break;
          case 'f':
            next('f');
            next('a');
            next('l');
            next('s');
            next('e');
            false;
            break;
          case 'n':
            next('n');
            next('u');
            next('l');
            next('l');
            null;
        }
        error('Unexpected #{ch}');
      };
      array = function() {
        var _array;
        _array = [];
        if (ch === '[') {
          next('[');
          white();
          if (ch === ']') {
            next(']');
            return _array;
          }
          while (ch) {
            _array.push(value());
            white();
            if (ch === ']') {
              next(']');
              return _array;
            }
            next(',');
            white();
          }
        }
        error('Bad array');
      };
      object = function() {
        var _object, key;
        _object = {};
        if (ch === '{') {
          next('{');
          white();
          if (ch === '}') {
            next('}');
            return _object;
          }
          while (ch) {
            key = string();
            white();
            next(':');
            if (Object.hasOwnProperty.call(_object, key)) {
              error("Duplicate key '" + key);
            }
            _object[key] = value();
            white();
            if (ch === '}') {
              next('}');
              return _object;
            }
            next(',');
            white();
          }
        }
        error('Bad object');
      };
      value = function() {
        white();
        switch (ch) {
          case '{':
            return object();
          case '[':
            return array();
          case '"':
            return string();
          case '-':
            return number;
          default:
            if (ch >= '0' && ch <= '9') {
              return number();
            } else {
              return word();
            }
        }
      };
      result = value();
      white();
      if (ch) {
        error('Syntax error');
      }
      return result;
    };

    _JSON.prototype.stringify = function(value, replacer, space) {
      var escapable, gap, i, indent, j, l, max, meta, min, quote, ref, ref1, s, str;
      if (replacer == null) {
        replacer = null;
      }
      if (space == null) {
        space = 0;
      }
      gap = '';
      indent = '';
      escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
      meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
      };
      max = function(a, b) {
        if (a > b) {
          return a;
        } else {
          return b;
        }
      };
      min = function(a, b) {
        if (a < b) {
          return a;
        } else {
          return b;
        }
      };
      if (typeof space === 'number') {
        for (i = j = 0, ref = min(max(space, 0), 10); 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          indent += ' ';
        }
      } else if (typeof space === 'string') {
        for (s = l = 0, ref1 = min(space.length, 10); 0 <= ref1 ? l < ref1 : l > ref1; s = 0 <= ref1 ? ++l : --l) {
          indent += space[s];
        }
      }
      if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
        throw new Error('JSON.stringify');
      }
      quote = function(string) {
        escapable.lastIndex = 0;
        if (escapable.test(string)) {
          return '"' + string.replace(escapable, function(a) {
            var c;
            c = meta[a];
            if (typeof c === 'string') {
              return c;
            } else {
              return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }
          });
        } else {
          return "\"" + string + "\"";
        }
      };
      str = function(key, holder) {
        var _value, k, mind, partial, v;
        mind = gap;
        _value = holder[key];
        if (_value && typeof _value === 'object' && typeof _value._toJSON === 'function') {
          _value = _value._toJSON(key);
        }
        if (typeof replacer === 'function') {
          _value = replacer.call(holder, key, _value);
        }
        switch (typeof _value) {
          case 'string':
            return quote(_value);
          case 'number':
            if (isFinite(_value)) {
              return String(_value);
            } else {
              return 'null';
            }
            break;
          case 'boolean':
          case 'null':
            return String(_value);
          case 'object':
            if (!_value) {
              return 'null';
            }
            gap += indent;
            partial = [];
            if (Object.prototype.toString.apply(_value) === '[object Array]') {
              for (i in _value) {
                partial.push(str(+i, _value) || 'null');
              }
              v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
              gap = mind;
              return v;
            } else {
              if (replacer && typeof replacer === 'object') {
                for (k in replacer) {
                  if (typeof replacer[k] === 'string') {
                    v = str(k, _value);
                    if (v) {
                      partial.push(quote(k) + (gap ? ': ' : ':') + v);
                    }
                  }
                }
              } else {
                for (k in _value) {
                  if (Object.prototype.hasOwnProperty.call(_value, k)) {
                    v = str(k, _value);
                    if (v) {
                      partial.push(quote(k) + (gap ? ': ' : ':') + v);
                    }
                  }
                }
              }
              v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
              gap = mind;
              return v;
            }
        }
      };
      return str('', {
        '': value
      });
    };

    return _JSON;

  })();

  this._JSON = new _JSON();

  if (!this.JSON) {
    this.JSON = this._JSON;
  }

  Customer = (function() {
    function Customer(params) {
      if (params == null) {
        params = {};
      }
      this.fullname = params.fullname || "";
      this.email = params.email || "";
      this.code = params.code || "";
      this.cpf = params.cpf || "";
      this.birthdate_day = params.birthdate_day || "";
      this.birthdate_month = params.birthdate_month || "";
      this.birthdate_year = params.birthdate_year || "";
      this.phone_area_code = params.phone_area_code || "";
      this.phone_number = params.phone_number || "";
      this.billing_info = new BillingInfo(params.billing_info) || new BillingInfo();
      this.address = new Address(params.address) || new Address();
    }

    Customer.prototype.to_json = function() {
      return {
        code: this.code,
        email: this.email,
        fullname: this.fullname,
        cpf: this.cpf,
        phone_area_code: this.phone_area_code,
        phone_number: this.phone_number,
        birthdate_day: this.birthdate_day,
        birthdate_month: this.birthdate_month,
        birthdate_year: this.birthdate_year,
        billing_info: this.billing_info.to_json(),
        address: this.address.to_json()
      };
    };

    return Customer;

  })();

  Subscription = (function() {
    Subscription.is_new_customer = false;

    function Subscription(params) {
      if (params == null) {
        params = {};
      }
      this.customer = params.code || null;
      this.plan_code = params.plan_code || "";
    }

    Subscription.prototype.with_customer = function(customer) {
      this.customer = customer;
      return this;
    };

    Subscription.prototype.with_new_customer = function(customer) {
      this.customer = new Customer(customer) || new Customer();
      this.is_new_customer = true;
      return this;
    };

    Subscription.prototype.with_plan_code = function(plan_code) {
      this.plan_code = plan_code;
      return this;
    };

    Subscription.prototype.with_code = function(code) {
      this.code = code;
      return this;
    };

    Subscription.prototype.with_coupon = function(code) {
      this.coupon = new Coupon(code);
      return this;
    };

    Subscription.prototype.to_json = function() {
      if (this.coupon && this.coupon.code) {
        return {
          code: this.code,
          plan: {
            code: this.plan_code
          },
          customer: this.customer.to_json(),
          coupon: this.coupon.to_json()
        };
      } else {
        return {
          code: this.code,
          plan: {
            code: this.plan_code
          },
          customer: this.customer.to_json()
        };
      }
    };

    return Subscription;

  })();

  BillingInfo = (function() {
    function BillingInfo(params) {
      if (params == null) {
        params = {};
      }
      this.fullname = params.fullname || "";
      this.credit_card_number = params.credit_card_number || "";
      this.expiration_month = params.expiration_month || "";
      this.expiration_year = params.expiration_year || "";
    }

    BillingInfo.prototype.to_json = function() {
      return {
        credit_card: this.credit_card_to_json()
      };
    };

    BillingInfo.prototype.credit_card_to_json = function() {
      return {
        holder_name: this.fullname,
        expiration_month: this.expiration_month,
        expiration_year: this.expiration_year,
        first_six_digits: this._six_first(),
        last_four_digits: this._last_four(),
        number: this.credit_card_number
      };
    };

    BillingInfo.prototype._six_first = function() {
      return this.credit_card_number.substring(0, 5);
    };

    BillingInfo.prototype._last_four = function() {
      return this.credit_card_number.substring(this.credit_card_number.length - 4, this.credit_card_number.length);
    };

    return BillingInfo;

  })();

  Address = (function() {
    function Address(params) {
      if (params == null) {
        params = {};
      }
      this.street = params.street || "";
      this.number = params.number || "";
      this.complement = params.complement || "";
      this.district = params.district || "";
      this.city = params.city || "";
      this.state = params.state || "";
      this.country = params.country || "";
      this.zipcode = params.zipcode || "";
    }

    Address.prototype.to_json = function() {
      return {
        street: this.street,
        number: this.number,
        complement: this.complement,
        district: this.district,
        city: this.city,
        state: this.state,
        country: this.country,
        zipcode: this.zipcode
      };
    };

    return Address;

  })();

  Response = (function() {
    function Response(params) {
      if (params == null) {
        params = {};
      }
      this.errors = params.errors || [];
      this.alerts = params.alerts || [];
      this.code = params.code || "";
      this.message = params.message || "";
      this.amount = params.amount || "";
      this.plan = params.plan || {};
      this.status = params.status || "";
      this.invoice = params.invoice || {};
      this.next_invoice_date = params.next_invoice_date || {};
      this.customer = params.customer || {};
    }

    Response.prototype.has_errors = function() {
      return this.error !== void 0 || this.errors.length > 0;
    };

    Response.prototype.has_alerts = function() {
      return this.alerts !== void 0 || this.alerts.length > 0;
    };

    Response.prototype.add_errors = function(errors) {
      var error, j, len, results;
      results = [];
      for (j = 0, len = errors.length; j < len; j++) {
        error = errors[j];
        results.push(this.errors.push(error));
      }
      return results;
    };

    Response.prototype.add_alerts = function(alerts) {
      var alert, j, len, results;
      results = [];
      for (j = 0, len = alerts.length; j < len; j++) {
        alert = alerts[j];
        results.push(this.alerts.push(alert));
      }
      return results;
    };

    return Response;

  })();

  Coupon = (function() {
    function Coupon(params) {
      if (params == null) {
        params = {};
      }
      if (params) {
        this.code = params;
      }
    }

    Coupon.prototype.to_json = function() {
      if (this.code) {
        return {
          code: this.code
        };
      }
    };

    return Coupon;

  })();

  MoipAssinaturas = (function() {
    MoipAssinaturas.DEBUG_MODE = false;

    function MoipAssinaturas(hash, settings_hash) {
      var base;
      if (settings_hash == null) {
        settings_hash = {};
      }
      this.hash = hash;
      this.settings_hash = settings_hash;
      (base = this.settings_hash).timeout || (base.timeout = 10000);
      this._logDebug("DebugMode=On MoipAssinaturas");
      this.response;
    }

    MoipAssinaturas.prototype.debugMode = function() {
      return this.DEBUG_MODE = true;
    };

    MoipAssinaturas.prototype.subscribe = function(subscription) {
      this.subscription = subscription;
      this._request_subscribe();
      return this;
    };

    MoipAssinaturas.prototype.callback = function(fn) {
      this.fn = fn;
      return this;
    };

    MoipAssinaturas.prototype.request_error = function(fn) {
      this.fn_error = fn;
      return this;
    };

    MoipAssinaturas.prototype._exec_callback = function() {
      return this.fn.call(this, this.response);
    };

    MoipAssinaturas.prototype._exec_error_callback = function(text_status, error_thrown) {
      if (this.fn_error) {
        return this.fn_error.call(this, text_status, error_thrown);
      }
    };

    MoipAssinaturas.prototype._request_subscribe = function() {
      var complement, json;
      json = {
        hash: this.hash,
        json: JSON.stringify(this.subscription.to_json())
      };
      complement = (this.subscription.is_new_customer ? complement = "?new_customer=true" : "?new_customer=false");
      return $.ajax({
        url: BASE_URI_ASSINATURAS + "/v1/subscriptions/jsonp" + complement,
        type: "GET",
        dataType: "jsonp",
        data: json,
        scriptCharset: "utf8",
        success: (function(_this) {
          return function(data, status) {
            return _this.handle_data(data);
          };
        })(this),
        timeout: this.settings_hash.timeout,
        error: (function(_this) {
          return function(x, textStatus, errorThrown) {
            return _this.handle_error(textStatus, errorThrown);
          };
        })(this)
      });
    };

    MoipAssinaturas.prototype.handle_data = function(data) {
      this.response = new Response(data);
      this._exec_callback();
      return this;
    };

    MoipAssinaturas.prototype.handle_error = function(text_status, error_thrown) {
      this._exec_error_callback(text_status, error_thrown);
      return this;
    };

    MoipAssinaturas.prototype.create_customer = function(customer) {
      this._logDebug("create_customer.call -> " + customer.code);
      this._request_customer(customer);
      return this;
    };

    MoipAssinaturas.prototype._request_customer = function(customer) {
      var json;
      this._logDebug("create_customer preparing JSON to send Moip Assinaturas");
      json = {
        hash: this.hash,
        json: JSON.stringify(customer.to_json())
      };
      this._logDebug("create_customer JSON -> " + json.json);
      return $.ajax({
        url: BASE_URI_ASSINATURAS + "/v1/customers/jsonp?new_vault=true",
        type: "GET",
        dataType: "jsonp",
        data: json,
        scriptCharset: "utf8",
        success: (function(_this) {
          return function(data, status) {
            return _this.handle_data(data);
          };
        })(this),
        timeout: this.settings_hash.timeout,
        error: (function(_this) {
          return function(x, textStatus, errorThrown) {
            return _this.handle_error(textStatus, errorThrown);
          };
        })(this)
      });
    };

    MoipAssinaturas.prototype.update_credit_card = function(customer) {
      this._request_update(customer);
      return this;
    };

    MoipAssinaturas.prototype._logDebug = function(msg) {
      if (MoipAssinaturas.DEBUG_MODE) {
        return console.log(msg);
      }
    };

    MoipAssinaturas.prototype._request_update = function(customer) {
      var json;
      json = {
        hash: this.hash,
        json: JSON.stringify(customer.billing_info.to_json())
      };
      return $.ajax({
        url: BASE_URI_ASSINATURAS + "/v1/customers/" + customer.code + "/billing_infos/jsonp",
        type: "GET",
        dataType: "jsonp",
        data: json,
        scriptCharset: "utf8",
        success: (function(_this) {
          return function(data, status) {
            return _this.handle_data(data);
          };
        })(this),
        timeout: this.settings_hash.timeout,
        error: (function(_this) {
          return function(x, textStatus, errorThrown) {
            return _this.handle_error(textStatus, errorThrown);
          };
        })(this)
      });
    };

    return MoipAssinaturas;

  })();

  window.MoipAssinaturas = typeof exports !== "undefined" && exports !== null ? exports : MoipAssinaturas;

  window.Customer = typeof exports !== "undefined" && exports !== null ? exports : Customer;

  window.Subscription = typeof exports !== "undefined" && exports !== null ? exports : Subscription;

  window.BillingInfo = typeof exports !== "undefined" && exports !== null ? exports : BillingInfo;

  window.Address = typeof exports !== "undefined" && exports !== null ? exports : Address;

  window.Response = typeof exports !== "undefined" && exports !== null ? exports : Response;

  window.Coupon = typeof exports !== "undefined" && exports !== null ? exports : Coupon;

  BASE_URI_ASSINATURAS = "https://sandbox.moip.com.br/assinaturas";

  ENV = 'SANDBOX';

}).call(this);
