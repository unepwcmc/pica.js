(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        //Allow using this built library as an AMD module
        //in another project. That other project will only
        //see this AMD call, not the internal modules in
        //the closure below.
        define(factory);
    } else {
        //Browser globals case. Just assign the
        //result to a property on the global.
        root.pica = factory();
    }
}(this, function () {
    //almond, and your modules will be inlined here
/**
 * almond 0.2.5 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (typeof callback === 'function') {

            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        if (config.deps) {
            req(config.deps, config.callback);
        }
        return req;
    };

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("almond", function(){});

(function() {
  define('lib/pica_event',[], function() {
    var PicaEvents;

    return PicaEvents = (function() {
      function PicaEvents() {}

      PicaEvents.prototype.on = function(event, callback) {
        var _base;

        this.events || (this.events = {});
        (_base = this.events)[event] || (_base[event] = []);
        return this.events[event].push(callback);
      };

      PicaEvents.prototype.off = function(event, callback) {
        var eventCallback, index, _i, _len, _ref, _results;

        if (this.events == null) {
          return;
        }
        if (event != null) {
          if (this.events[event] != null) {
            if (callback != null) {
              _ref = this.events[event];
              _results = [];
              for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
                eventCallback = _ref[index];
                if (eventCallback === callback) {
                  this.events[event].splice(index, 1);
                  _results.push(index -= 1);
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

      PicaEvents.prototype.trigger = function(event, args) {
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

      return PicaEvents;

    })();
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('lib/pica_model',["lib/pica_event"], function(PicaEvents) {
    var PicaModel, _ref;

    return PicaModel = (function(_super) {
      __extends(PicaModel, _super);

      function PicaModel() {
        this.destroy = __bind(this.destroy, this);
        this.fetch = __bind(this.fetch, this);
        this.save = __bind(this.save, this);        _ref = PicaModel.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      PicaModel.prototype.throwIfNoApp = function() {
        if (this.app == null) {
          throw new Error("Cannot create a PicaModel without specifying a PicaApplication");
        }
      };

      PicaModel.prototype.url = function() {};

      PicaModel.prototype.get = function(attribute) {
        var _ref1;

        if ((_ref1 = this.attributes) == null) {
          this.attributes = {};
        }
        return this.attributes[attribute];
      };

      PicaModel.prototype.set = function(attribute, value) {
        var _ref1;

        if ((_ref1 = this.attributes) == null) {
          this.attributes = {};
        }
        this.attributes[attribute] = value;
        return this.trigger('change');
      };

      PicaModel.prototype.sync = function(options) {
        var data, errorCallback, successCallback,
          _this = this;

        if (options == null) {
          options = {};
        }
        successCallback = options.success || function() {};
        options.success = function(data, textStatus, jqXHR) {
          if (data.id != null) {
            _this.parse(data);
            _this.trigger('sync', _this);
          }
          _this.app.notifySyncFinished();
          return successCallback(_this, textStatus, jqXHR);
        };
        errorCallback = options.error || function() {};
        options.error = function(data, textStatus, jqXHR) {
          _this.app.notifySyncFinished();
          return errorCallback(_this, textStatus, jqXHR);
        };
        if (options.type === 'post' || options.type === 'put') {
          data = this.attributes;
          if (options.type === 'post') {
            data = JSON.stringify(data);
          }
        }
        if (options.type === 'delete') {
          data = null;
        }
        this.app.notifySyncStarted();
        return $.ajax($.extend(options, {
          contentType: "application/json",
          dataType: "json",
          data: data
        }));
      };

      PicaModel.prototype.parse = function(data) {
        var attr, val, _results;

        _results = [];
        for (attr in data) {
          val = data[attr];
          _results.push(this.set(attr, val));
        }
        return _results;
      };

      PicaModel.prototype.save = function(options) {
        var sync,
          _this = this;

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
        sync = this.sync(options);
        sync.done(function() {
          return console.log("saving " + _this.constructor.name + " " + (_this.get('id')));
        });
        return sync;
      };

      PicaModel.prototype.fetch = function(options) {
        if (options == null) {
          options = {};
        }
        options.url = this.url().read != null ? this.url().read : this.url();
        console.log("fetching " + this.constructor.name + " " + (this.get('id')));
        return this.sync(options);
      };

      PicaModel.prototype.destroy = function(options) {
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

      return PicaModel;

    })(PicaEvents);
  });

}).call(this);

(function() {
  define('views/new_polygon_view',[], function() {
    var PicaViewsNewPolygonView;

    return PicaViewsNewPolygonView = (function() {
      function PicaViewsNewPolygonView(options) {
        var _this = this;

        this.options = options;
        if (this.options.callbacks != null) {
          this.successCallback = this.options.callbacks.success;
          this.errorCallback = this.options.callbacks.error;
        }
        this.polygon = this.options.polygon;
        this.polygonDraw = new L.Polygon.Draw(this.options.map, {});
        this.polygonDraw.enable();
        this.options.map.on('draw:poly-created', function(e) {
          var mapPolygon;

          mapPolygon = e.poly;
          return _this.createPolygon(mapPolygon);
        });
      }

      PicaViewsNewPolygonView.prototype.createPolygon = function(mapPolygon) {
        var _this = this;

        this.polygon.setGeomFromPoints(mapPolygon.getLatLngs());
        return this.polygon.save({
          success: function() {
            _this.close();
            if (_this.successCallback != null) {
              return _this.successCallback();
            }
          },
          error: function(xhr, textStatus, errorThrown) {
            _this.close();
            if (_this.errorCallback != null) {
              return _this.errorCallback.apply(_this, arguments);
            }
          }
        });
      };

      PicaViewsNewPolygonView.prototype.close = function() {
        this.polygonDraw.disable();
        return this.options.map.off('draw:poly-created');
      };

      return PicaViewsNewPolygonView;

    })();
  });

}).call(this);

(function() {
  define('views/new_circle_view',[], function() {
    var PicaViewsNewCircleView;

    return PicaViewsNewCircleView = (function() {
      function PicaViewsNewCircleView(options) {
        var _this = this;

        this.options = options;
        if (this.options.callbacks != null) {
          this.successCallback = this.options.callbacks.success;
          this.errorCallback = this.options.callbacks.error;
        }
        this.polygon = this.options.polygon;
        this.polygon.set('geometry', {
          type: 'Circle'
        });
        this.polygonDraw = new L.Circle.Draw(this.options.map, {});
        this.polygonDraw.enable();
        this.options.map.on('draw:circle-created', function(e) {
          return _this.createPolygon(e.circ);
        });
      }

      PicaViewsNewCircleView.prototype.createPolygon = function(mapCircle) {
        var _this = this;

        this.polygon.setGeomFromCircle(mapCircle.getLatLng(), mapCircle.getRadius());
        return this.polygon.save({
          success: function() {
            _this.close();
            if (_this.successCallback != null) {
              return _this.successCallback();
            }
          },
          error: function(xhr, textStatus, errorThrown) {
            _this.close();
            if (_this.errorCallback != null) {
              return _this.errorCallback.apply(_this, arguments);
            }
          }
        });
      };

      PicaViewsNewCircleView.prototype.close = function() {
        this.polygonDraw.disable();
        return this.options.map.off('draw:circle-created');
      };

      return PicaViewsNewCircleView;

    })();
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('views/upload_file_view',["lib/pica_event"], function(PicaEvents) {
    var PicaViewsUploadFileView;

    return PicaViewsUploadFileView = (function(_super) {
      __extends(PicaViewsUploadFileView, _super);

      function PicaViewsUploadFileView(options) {
        this.options = options;
        this.onUploadComplete = __bind(this.onUploadComplete, this);
        this.render = __bind(this.render, this);
        if (options.callbacks != null) {
          this.successCallback = this.options.callbacks.success;
          this.errorCallback = this.options.callbacks.error;
        }
        this.area = this.options.area;
        this.el = document.createElement("div");
        this.area.getAreaId({
          success: this.render
        });
      }

      PicaViewsUploadFileView.prototype.render = function() {
        var formFrame;

        formFrame = document.createElement('iframe');
        formFrame.src = "" + this.options.magpieUrl + "/areas_of_interest/" + (this.area.get('id')) + "/polygons/new_upload_form/";
        formFrame.className = "pica-upload-form";
        this.el.appendChild(formFrame);
        return window.addEventListener("message", this.onUploadComplete, false);
      };

      PicaViewsUploadFileView.prototype.onUploadComplete = function(event) {
        if (event.origin === this.options.magpieUrl && (event.data.polygonImportStatus != null)) {
          if (event.data.polygonImportStatus === 'Successful import' && (this.successCallback != null)) {
            this.successCallback(event.data.polygonImportStatus, event.data.importMessages);
          } else if (this.errorCallback != null) {
            this.errorCallback(event.data.polygonImportStatus, event.data.importMessages);
          }
          return this.close();
        }
      };

      PicaViewsUploadFileView.prototype.close = function() {
        window.removeEventListener("message", this.onUploadComplete);
        return $(this.el).remove();
      };

      return PicaViewsUploadFileView;

    })(PicaEvents);
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('views/show_area_polygons_view',["lib/pica_event"], function(PicaEvents) {
    var PicaViewsShowAreaPolygonsView;

    return PicaViewsShowAreaPolygonsView = (function(_super) {
      __extends(PicaViewsShowAreaPolygonsView, _super);

      function PicaViewsShowAreaPolygonsView(options) {
        this.options = options;
        this.triggerPolyClick = __bind(this.triggerPolyClick, this);
        this.addPolygon = __bind(this.addPolygon, this);
        this.render = __bind(this.render, this);
        this.area = this.options.area;
        this.polysObserved = [];
        this.mapPolygons = [];
        this.area.on('sync', this.render);
        this.area.on('addedPolygon', this.addPolygon);
        this.render();
      }

      PicaViewsShowAreaPolygonsView.prototype.render = function() {
        var mapPolygon, newObject, polygon, _i, _len, _ref, _results,
          _this = this;

        this.removeAllPolygonsAndBindings();
        _ref = this.area.polygons;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          polygon = _ref[_i];
          if (!polygon.isComplete()) {
            continue;
          }
          newObject = function(theConstructor, args) {
            var Wrapper;

            Wrapper = function(args) {
              return theConstructor.apply(this, args);
            };
            Wrapper.prototype = theConstructor.prototype;
            return new Wrapper(args);
          };
          mapPolygon = newObject(L[polygon.get('geometry').type], polygon.asLeafletArguments()).addTo(this.options.map);
          polygon.on('delete', (function() {
            var thatMapPolygon;

            thatMapPolygon = mapPolygon;
            return function() {
              return _this.removeMapPolygonAndBindings(thatMapPolygon);
            };
          })());
          mapPolygon.on('click', (function() {
            var thatMapPolygon, thatPolygon;

            thatPolygon = polygon;
            thatMapPolygon = mapPolygon;
            return function(event) {
              return _this.triggerPolyClick(thatPolygon, event, thatMapPolygon);
            };
          })());
          _results.push(this.mapPolygons.push(mapPolygon));
        }
        return _results;
      };

      PicaViewsShowAreaPolygonsView.prototype.addPolygon = function(polygon) {
        polygon.on('change', this.render);
        return this.polysObserved.push(polygon);
      };

      PicaViewsShowAreaPolygonsView.prototype.close = function() {
        var polygon, _i, _len, _ref, _results;

        this.removeAllPolygonsAndBindings();
        this.area.off('sync', this.render);
        this.area.off('addedPolygon', this.addPolygon);
        _ref = this.polysObserved;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          polygon = _ref[_i];
          _results.push(polygon.off('change', this.render));
        }
        return _results;
      };

      PicaViewsShowAreaPolygonsView.prototype.removeAllPolygonsAndBindings = function() {
        var mapPolygon, _results;

        _results = [];
        while (mapPolygon = this.mapPolygons.shift()) {
          _results.push(this.removeMapPolygonAndBindings(mapPolygon));
        }
        return _results;
      };

      PicaViewsShowAreaPolygonsView.prototype.removeMapPolygonAndBindings = function(mapPolygon) {
        mapPolygon.off('click', this.triggerPolyClicked);
        return this.options.map.removeLayer(mapPolygon);
      };

      PicaViewsShowAreaPolygonsView.prototype.triggerPolyClick = function(polygon, event, mapPolygon) {
        return this.trigger('polygonClick', [polygon, event, mapPolygon]);
      };

      return PicaViewsShowAreaPolygonsView;

    })(PicaEvents);
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('models/polygon',["lib/pica_model"], function(PicaModel) {
    var PicaModelsPolygon;

    return PicaModelsPolygon = (function(_super) {
      __extends(PicaModelsPolygon, _super);

      function PicaModelsPolygon(app, options) {
        var _base;

        this.app = app;
        if (options == null) {
          options = {};
        }
        this.save = __bind(this.save, this);
        this.throwIfNoApp();
        this.attributes = options.attributes != null ? options.attributes : {};
        (_base = this.attributes)['geometry'] || (_base['geometry'] = {
          type: 'Polygon'
        });
      }

      PicaModelsPolygon.prototype.isComplete = function() {
        return this.get('geometry').coordinates != null;
      };

      PicaModelsPolygon.prototype.setGeomFromPoints = function(points) {
        var point;

        points = (function() {
          var _i, _len, _results;

          _results = [];
          for (_i = 0, _len = points.length; _i < _len; _i++) {
            point = points[_i];
            _results.push([point.lng, point.lat]);
          }
          return _results;
        })();
        points.push(points[0]);
        return this.set('geometry', {
          type: 'Polygon',
          coordinates: [points]
        });
      };

      PicaModelsPolygon.prototype.setGeomFromCircle = function(latLng, radius) {
        return this.set('geometry', {
          type: 'Circle',
          coordinates: [latLng.lng, latLng.lat],
          radius: radius
        });
      };

      PicaModelsPolygon.prototype.asLeafletArguments = function() {
        var args, latLngs, point, _i, _len, _ref;

        args = [];
        if (this.get('geometry').type === 'Polygon') {
          latLngs = [];
          if (this.isComplete()) {
            _ref = this.get('geometry').coordinates[0];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              point = _ref[_i];
              latLngs.push(new L.LatLng(point[1], point[0]));
            }
          }
          args.push(latLngs);
        } else {
          if (this.isComplete()) {
            point = this.get('geometry').coordinates;
            args = [new L.LatLng(point[1], point[0]), this.get('geometry').radius];
          } else {
            args = [[], 0];
          }
        }
        return args;
      };

      PicaModelsPolygon.prototype.url = function() {
        var url;

        url = this.app.config.magpieUrl;
        return {
          read: "" + url + "/polygons/" + (this.get('id')) + ".json",
          create: "" + url + "/areas_of_interest/" + (this.get('area_id')) + "/polygons.json"
        };
      };

      PicaModelsPolygon.prototype.save = function(options) {
        var _this = this;

        options || (options = {});
        if (this.get('area_id') != null) {
          return PicaModelsPolygon.__super__.save.call(this, options);
        } else {
          return this.trigger('requestAreaId', {
            success: function(area, textStatus, jqXHR) {
              _this.set('area_id', area.get('id'));
              if (_this.get('area_id')) {
                return _this.save(options);
              } else {
                if (options.error != null) {
                  return options.error(_this, {
                    error: "Unable to get area id, so cannot save polygon"
                  }, jqXHR);
                }
              }
            },
            error: function(jqXHR, textStatus, errorThrown) {
              console.log("Unable to save polygon:");
              console.log(arguments);
              console.log(jqXHR.status);
              console.log(jqXHR.statusText);
              console.log(jqXHR.responseText);
              if (options.error != null) {
                return options.error(jqXHR, textStatus, {
                  error: "Unable to obtain areaId, cannot save polygon",
                  parentError: errorThrown
                });
              }
            }
          });
        }
      };

      return PicaModelsPolygon;

    })(PicaModel);
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('models/area',["lib/pica_model", "views/new_polygon_view", "views/new_circle_view", "views/upload_file_view", "views/show_area_polygons_view", "models/polygon"], function(PicaModel, PicaViewsNewPolygonView, PicaViewsNewCircleView, PicaViewsUploadFileView, PicaViewsShowAreaPolygonsView, PicaModelsPolygon) {
    var PicaModelsArea;

    return PicaModelsArea = (function(_super) {
      __extends(PicaModelsArea, _super);

      function PicaModelsArea(app) {
        this.app = app;
        this.save = __bind(this.save, this);
        this.getAreaId = __bind(this.getAreaId, this);
        this.throwIfNoApp();
        this.polygons = [];
        this.set('name', 'My Lovely Area');
      }

      PicaModelsArea.prototype.setName = function(name) {
        return this.set('name', name);
      };

      PicaModelsArea.prototype.addPolygon = function(polygon) {
        var _this = this;

        polygon.on('requestAreaId', this.getAreaId);
        polygon.on('sync', function() {
          return _this.fetch();
        });
        polygon.on('delete', function() {
          return _this.fetch();
        });
        this.polygons.push(polygon);
        return this.trigger('addedPolygon', polygon);
      };

      PicaModelsArea.prototype.getAreaId = function(options) {
        if (this.get('id') != null) {
          return options.success(this);
        } else {
          return this.save(options);
        }
      };

      PicaModelsArea.prototype.drawNewPolygonView = function(callbacks) {
        this.createPolygon();
        return new PicaViewsNewPolygonView({
          callbacks: callbacks,
          polygon: this.currentPolygon,
          map: this.app.config.map
        });
      };

      PicaModelsArea.prototype.drawNewCircleView = function(callbacks) {
        this.createPolygon();
        return new PicaViewsNewCircleView({
          callbacks: callbacks,
          polygon: this.currentPolygon,
          map: this.app.config.map
        });
      };

      PicaModelsArea.prototype.createPolygon = function() {
        this.currentPolygon = new PicaModelsPolygon(this.app);
        return this.addPolygon(this.currentPolygon);
      };

      PicaModelsArea.prototype.newUploadFileView = function(callbacks) {
        return new PicaViewsUploadFileView({
          callbacks: callbacks,
          area: this,
          magpieUrl: this.app.config.magpieUrl
        });
      };

      PicaModelsArea.prototype.newShowAreaPolygonsView = function() {
        return new PicaViewsShowAreaPolygonsView({
          area: this,
          map: this.app.config.map
        });
      };

      PicaModelsArea.prototype.url = function() {
        var url;

        url = this.app.config.magpieUrl;
        return {
          create: "" + url + "/workspaces/" + (this.get('workspace_id')) + "/areas_of_interest.json",
          read: "" + url + "/areas_of_interest/" + (this.get('id')) + ".json"
        };
      };

      PicaModelsArea.prototype.parse = function(data) {
        var index, polygon, polygonAttributes, unPersistedPolygons, _i, _j, _len, _len1, _ref, _ref1;

        if (data.polygons != null) {
          this.polygons = [];
          _ref = data.polygons;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            polygonAttributes = _ref[_i];
            polygon = new PicaModelsPolygon(this.app, {
              attributes: polygonAttributes
            });
            this.addPolygon(polygon);
          }
          delete data.polygons;
        } else {
          unPersistedPolygons = [];
          _ref1 = this.polygons;
          for (index = _j = 0, _len1 = _ref1.length; _j < _len1; index = ++_j) {
            polygon = _ref1[index];
            if (polygon.get('id') == null) {
              unPersistedPolygons.push(polygon);
            }
          }
          this.polygons = unPersistedPolygons;
        }
        return PicaModelsArea.__super__.parse.apply(this, arguments);
      };

      PicaModelsArea.prototype.save = function(options) {
        var _this = this;

        options || (options = {});
        if (this.get('workspace_id') != null) {
          return PicaModelsArea.__super__.save.call(this, options);
        } else {
          return this.trigger('requestWorkspaceId', {
            success: function(workspace, textStatus, jqXHR) {
              _this.set('workspace_id', workspace.get('id'));
              if (_this.get('workspace_id')) {
                return _this.save(options);
              } else {
                return options.error(_this, {
                  error: "Could not save workspace, so cannot save area"
                }, jqXHR);
              }
            },
            error: function(jqXHR, textStatus, errorThrown) {
              console.log("Unable to save area:");
              console.log(arguments);
              console.log(jqXHR.status);
              console.log(jqXHR.statusText);
              console.log(jqXHR.responseText);
              if (options.error != null) {
                return options.error(jqXHR, textStatus, {
                  error: "Unable to obtain workspaceId, cannot save area",
                  parentError: errorThrown
                });
              }
            }
          });
        }
      };

      return PicaModelsArea;

    })(PicaModel);
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('models/workspace',["lib/pica_model", "models/area"], function(PicaModel, PicaModelsArea) {
    var PicaModelsWorkspace;

    return PicaModelsWorkspace = (function(_super) {
      __extends(PicaModelsWorkspace, _super);

      function PicaModelsWorkspace(app, options) {
        this.app = app;
        this.save = __bind(this.save, this);
        this.throwIfNoApp();
        this.attributes = {};
        this.areas = [];
        this.currentArea = new PicaModelsArea(this.app);
        this.addArea(this.currentArea);
      }

      PicaModelsWorkspace.prototype.url = function() {
        return "" + this.app.config.magpieUrl + "/workspaces.json";
      };

      PicaModelsWorkspace.prototype.addArea = function(area) {
        var _this = this;

        area.on('requestWorkspaceId', function(options) {
          if (_this.get('id') != null) {
            return options.success(_this);
          } else {
            return _this.save(options);
          }
        });
        return this.areas.push(area);
      };

      PicaModelsWorkspace.prototype.removeArea = function(theArea) {
        var area, id;

        id = this.areas.indexOf(theArea);
        area = this.areas.splice(id, 1)[0];
        if (area.get('id') != null) {
          return area.destroy();
        }
      };

      PicaModelsWorkspace.prototype.setCurrentArea = function(theArea) {
        var area, _i, _len, _ref, _results;

        _ref = this.areas;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          area = _ref[_i];
          if (area === theArea) {
            _results.push(this.currentArea = area);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      PicaModelsWorkspace.prototype.setCurrentAreaById = function(areaId) {
        var area, _i, _len, _ref, _results;

        _ref = this.areas;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          area = _ref[_i];
          if (area.get('id') === areaId) {
            _results.push(this.currentArea = area);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      PicaModelsWorkspace.prototype.save = function(options) {
        return PicaModelsWorkspace.__super__.save.call(this, options);
      };

      return PicaModelsWorkspace;

    })(PicaModel);
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define('views/show_layers_view',[], function() {
    var ShowLayersView;

    return ShowLayersView = (function() {
      function ShowLayersView(options) {
        this.removeTileLayers = __bind(this.removeTileLayers, this);
        this.render = __bind(this.render, this);        this.app = options.app;
        this.app.on('sync', this.render);
        this.tileLayers = {};
        this.layerControl = false;
      }

      ShowLayersView.prototype.render = function() {
        var layer, tileLayer, _i, _len, _ref;

        this.removeTileLayers();
        this.removeLayerControl();
        _ref = this.app.layers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          layer = _ref[_i];
          tileLayer = L.tileLayer(layer.tile_url);
          this.tileLayers[layer.display_name] = tileLayer;
          if (!this.app.config.delegateLayerControl) {
            tileLayer.addTo(this.app.config.map);
          }
        }
        if (this.app.config.delegateLayerControl) {
          return this.layerControl = this.renderLayerControl(this.app.config.map);
        }
      };

      ShowLayersView.prototype.renderLayerControl = function(map) {
        var extraOverlays, layers;

        extraOverlays = this.app.config.extraOverlays || {};
        layers = $.extend(this.tileLayers, extraOverlays);
        this.showFirstOverlay(layers, map);
        return L.control.layers({}, layers).addTo(map);
      };

      ShowLayersView.prototype.showFirstOverlay = function(layers, map) {
        var layer, name;

        for (name in layers) {
          layer = layers[name];
          layer.addTo(map);
          return;
        }
      };

      ShowLayersView.prototype.removeTileLayers = function() {
        var name, tileLayer, _ref, _results;

        _ref = this.tileLayers;
        _results = [];
        for (name in _ref) {
          tileLayer = _ref[name];
          _results.push(this.app.map.removeLayer(tileLayer));
        }
        return _results;
      };

      ShowLayersView.prototype.removeLayerControl = function() {
        if (this.layerControl) {
          return this.layerControl.removeFrom(this.app.map);
        }
      };

      ShowLayersView.prototype.close = function() {
        this.removeTileLayers();
        this.removeLayerControl();
        return this.app.off('sync', this.render);
      };

      return ShowLayersView;

    })();
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('pica_application',["lib/pica_event", "lib/pica_model", "models/workspace", "views/show_layers_view"], function(PicaEvents, PicaModel, PicaModelsWorkspace, ShowLayersView) {
    var PicaApplication;

    return PicaApplication = (function(_super) {
      __extends(PicaApplication, _super);

      function PicaApplication(config) {
        this.config = config;
        this.parse = __bind(this.parse, this);
        $.support.cors = true;
        $.ajaxSetup({
          headers: {
            'X-Magpie-ProjectId': this.config.projectId
          }
        });
        this.layers = [];
        this.fetch();
        if (this.config.delegateLayerControl) {
          this.showTileLayers();
        }
      }

      PicaApplication.prototype.newWorkspace = function() {
        return this.currentWorkspace = new PicaModelsWorkspace(this);
      };

      PicaApplication.prototype.showTileLayers = function() {
        return new ShowLayersView({
          app: this
        });
      };

      PicaApplication.prototype.fetch = function() {
        return $.ajax({
          url: "" + this.config.magpieUrl + "/projects/" + this.config.projectId + ".json",
          type: 'get',
          success: this.parse
        });
      };

      PicaApplication.prototype.parse = function(data) {
        var attr, val;

        for (attr in data) {
          val = data[attr];
          this[attr] = val;
        }
        return this.trigger('sync');
      };

      PicaApplication.prototype.notifySyncStarted = function() {
        this.syncsInProgress || (this.syncsInProgress = 0);
        this.syncsInProgress = this.syncsInProgress + 1;
        if (this.syncsInProgress === 1) {
          return this.trigger('syncStarted');
        }
      };

      PicaApplication.prototype.notifySyncFinished = function() {
        this.syncsInProgress || (this.syncsInProgress = 0);
        this.syncsInProgress = this.syncsInProgress - 1;
        if (this.syncsInProgress === 0) {
          return this.trigger('syncFinished');
        }
      };

      return PicaApplication;

    })(PicaEvents);
  });

}).call(this);

(function() {
  define('pica',["lib/pica_event", "models/area", "pica_application"], function(PicaEvents, PicaModelsArea, PicaApplication) {
    var pica;

    pica = {};
    pica.PicaModelsArea = PicaModelsArea;
    pica.PicaApplication = PicaApplication;
    return pica;
  });

}).call(this);
    //The modules for your project will be inlined above
    //this snippet. Ask almond to synchronously require the
    //module value for 'main' here and return it as the
    //value to use for the public API for the built file.
    return require('pica');
}));