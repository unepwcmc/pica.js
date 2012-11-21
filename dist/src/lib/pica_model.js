var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Pica.Model = (function(_super) {

  __extends(Model, _super);

  function Model() {
    return Model.__super__.constructor.apply(this, arguments);
  }

  Model.prototype.url = function() {};

  Model.prototype.get = function(attribute) {
    return this.attributes[attribute];
  };

  Model.prototype.set = function(attribute, value) {
    return this.attributes[attribute] = value;
  };

  Model.prototype.sync = function(options) {
    var callback,
      _this = this;
    if (options == null) {
      options = {};
    }
    callback = options.success || function() {};
    options.success = function(data, textStatus, jqXHR) {
      var attr, val;
      if (data.id != null) {
        for (attr in data) {
          val = data[attr];
          _this.set(attr, val);
        }
        return callback(_this, textStatus, jqXHR);
      }
    };
    return $.ajax($.extend(options, {
      dataType: 'json',
      data: this.attributes
    }));
  };

  Model.prototype.save = function(options) {
    if (options == null) {
      options = {};
    }
    options.url = this.url().create != null ? this.url().create : this.url();
    options.type = 'post';
    return this.sync(options);
  };

  Model.prototype.fetch = function(options) {
    if (options == null) {
      options = {};
    }
    options.url = this.url().read != null ? this.url().read : this.url();
    return this.sync(options);
  };

  return Model;

})(Pica.Events);
