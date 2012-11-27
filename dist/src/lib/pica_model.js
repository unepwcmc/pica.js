var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Pica.Model = (function(_super) {

  __extends(Model, _super);

  function Model() {
    this["delete"] = __bind(this["delete"], this);

    this.fetch = __bind(this.fetch, this);

    this.save = __bind(this.save, this);
    return Model.__super__.constructor.apply(this, arguments);
  }

  Model.prototype.url = function() {};

  Model.prototype.get = function(attribute) {
    var _ref;
    if ((_ref = this.attributes) == null) {
      this.attributes = {};
    }
    return this.attributes[attribute];
  };

  Model.prototype.set = function(attribute, value) {
    var _ref;
    if ((_ref = this.attributes) == null) {
      this.attributes = {};
    }
    return this.attributes[attribute] = value;
  };

  Model.prototype.sync = function(options) {
    var callback, data, dataType,
      _this = this;
    if (options == null) {
      options = {};
    }
    callback = options.success || function() {};
    options.success = function(data, textStatus, jqXHR) {
      if (data.id != null) {
        _this.parse(data);
        _this.trigger('sync', _this);
      }
      return callback(_this, textStatus, jqXHR);
    };
    dataType = "json";
    data = this.attributes;
    if (options.type === 'post') {
      data = JSON.stringify(data);
    }
    if (options.type === 'delete') {
      data = null;
      dataType = "text";
    }
    return $.ajax($.extend(options, {
      dataType: dataType,
      contentType: "application/json",
      data: data
    }));
  };

  Model.prototype.parse = function(data) {
    var attr, val, _results;
    _results = [];
    for (attr in data) {
      val = data[attr];
      _results.push(this.set(attr, val));
    }
    return _results;
  };

  Model.prototype.save = function(options) {
    if (options == null) {
      options = {};
    }
    if (this.get('id') != null) {
      options.url = this.url().read != null ? this.url().read : this.url();
      options.type = 'put';
    } else {
      options.url = this.url().create != null ? this.url().create : this.url();
      options.type = 'post';
    }
    console.log("saving " + this.constructor.name + " " + (this.get('id')));
    return this.sync(options);
  };

  Model.prototype.fetch = function(options) {
    if (options == null) {
      options = {};
    }
    options.url = this.url().read != null ? this.url().read : this.url();
    console.log("fetching " + this.constructor.name + " " + (this.get('id')));
    return this.sync(options);
  };

  Model.prototype["delete"] = function(options) {
    var originalCallback,
      _this = this;
    if (options == null) {
      options = {};
    }
    options.url = this.url().read != null ? this.url().read : this.url();
    options.type = 'delete';
    originalCallback = options.success;
    options.success = function() {
      _this.trigger('delete');
      console.log("deleted " + _this.constructor.name + " " + (_this.get('id')));
      if (originalCallback) {
        originalCallback();
      }
      return _this.off();
    };
    return this.sync(options);
  };

  return Model;

})(Pica.Events);
