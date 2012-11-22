
Pica.Events = (function() {

  function Events() {}

  Events.prototype.on = function(event, callback) {
    var _base;
    this.events || (this.events = {});
    (_base = this.events)[event] || (_base[event] = []);
    return this.events[event].push(callback);
  };

  Events.prototype.off = function(event, callback) {
    var eventCallback, index, _i, _len, _ref, _results;
    if (this.events == null) {
      return;
    }
    if (event != null) {
      if (this.events[event] != null) {
        if (callback != null) {
          _ref = this.events[event];
          _results = [];
          for (eventCallback = _i = 0, _len = _ref.length; _i < _len; eventCallback = ++_i) {
            index = _ref[eventCallback];
            if (eventCallback === callback) {
              _results.push(delete this.events[event][index]);
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        } else {
          return delete this.events[event];
        }
      }
    } else {
      return this.events = [];
    }
  };

  Events.prototype.trigger = function(event, args) {
    var callback, _i, _len, _ref, _results;
    if ((this.events != null) && (this.events[event] != null)) {
      _ref = this.events[event];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        _results.push(callback.apply(this, [].concat(args)));
      }
      return _results;
    }
  };

  return Events;

})();
