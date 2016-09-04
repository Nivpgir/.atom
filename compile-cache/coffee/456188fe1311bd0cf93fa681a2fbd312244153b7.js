(function() {
  var CSON, Emitter, ProjectConfig, Providers, path,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CSON = require('season');

  Providers = require('./provider');

  Emitter = require('atom').Emitter;

  path = require('path');

  module.exports = ProjectConfig = (function() {
    function ProjectConfig(projectPath, filePath, viewed) {
      var commands, data, l, p, provider, providers, save, _i, _len;
      this.projectPath = projectPath;
      this.filePath = filePath;
      this.viewed = viewed != null ? viewed : false;
      this.migrateGlobal = __bind(this.migrateGlobal, this);
      this.save = __bind(this.save, this);
      if (this.viewed) {
        this.emitter = new Emitter;
      }
      this.providers = [];
      data = CSON.readFileSync(this.filePath);
      if (data !== null) {
        providers = data.providers;
        commands = data.commands;
      } else {
        providers = [];
      }
      save = false;
      if ((commands != null) && (providers == null)) {
        save = true;
        providers = [];
        this.migrateLocal(commands, providers);
      }
      if (providers == null) {
        return;
      }
      for (_i = 0, _len = providers.length; _i < _len; _i++) {
        p = providers[_i];
        if (Providers.activate(p.key) !== true) {
          continue;
        }
        l = this.providers.push({
          key: p.key,
          config: p.config,
          model: Providers.modules[p.key].model,
          "interface": new Providers.modules[p.key].model([this.projectPath, this.filePath], p.config, this.viewed ? this.save : void 0)
        });
        if (!this.viewed) {
          continue;
        }
        if (Providers.modules[p.key].view == null) {
          continue;
        }
        provider = this.providers[l - 1];
        provider.view = new Providers.modules[p.key].view(provider["interface"]);
      }
      if (save) {
        this.save();
      }
      null;
    }

    ProjectConfig.prototype.destroy = function() {
      var provider, _base, _i, _len, _ref, _ref1, _ref2;
      if ((_ref = this.emitter) != null) {
        _ref.dispose();
      }
      _ref1 = this.providers;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        provider = _ref1[_i];
        if ((_ref2 = provider.view) != null) {
          if (typeof _ref2.destroy === "function") {
            _ref2.destroy();
          }
        }
        if (typeof (_base = provider["interface"]).destroy === "function") {
          _base.destroy();
        }
      }
      this.providers = null;
      return this.global_data = null;
    };

    ProjectConfig.prototype.onSave = function(callback) {
      return this.emitter.on('save', callback);
    };

    ProjectConfig.prototype.getCommandById = function(pid, id) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var c, _ref, _ref1;
          if ((c = (_ref = _this.providers[pid]) != null ? (_ref1 = _ref["interface"]) != null ? _ref1.getCommandByIndex(id) : void 0 : void 0) instanceof Promise) {
            return c.then((function(command) {
              return resolve(command);
            }), reject);
          } else if (c != null) {
            return resolve(c);
          } else {
            throw new Error("Could not get Command #" + id + " from " + pid);
          }
        };
      })(this));
    };

    ProjectConfig.prototype.getCommandByIndex = function(id) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          _this._providers = _this.providers.slice().reverse();
          _this.f = 0;
          return _this._getCommandByIndex(id, resolve, reject);
        };
      })(this));
    };

    ProjectConfig.prototype.getCommandNameObjects = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          _this._providers = _this.providers.slice().reverse();
          _this._return = [];
          return _this._getCommandNameObjects(resolve, reject);
        };
      })(this));
    };

    ProjectConfig.prototype.addProvider = function(key) {
      var l;
      if (Providers.activate(key) !== true) {
        return false;
      }
      l = this.providers.push({
        key: key,
        config: {},
        model: Providers.modules[key].model
      });
      this.providers[l - 1]["interface"] = new Providers.modules[key].model([this.projectPath, this.filePath], this.providers[l - 1].config, this.save);
      if (this.viewed && (Providers.modules[key].view != null)) {
        this.providers[l - 1].view = new Providers.modules[key].view(this.providers[l - 1]["interface"]);
      }
      this.save();
      return true;
    };

    ProjectConfig.prototype.removeProvider = function(index) {
      if (!(this.providers.length > index)) {
        return false;
      }
      this.providers.splice(index, 1)[0];
      this.save();
      return true;
    };

    ProjectConfig.prototype.moveProviderUp = function(index) {
      if ((index === 0) || (index >= this.providers.length)) {
        return false;
      }
      this.providers.splice(index - 1, 0, this.providers.splice(index, 1)[0]);
      this.save();
      return true;
    };

    ProjectConfig.prototype.moveProviderDown = function(index) {
      if (index >= this.providers.length - 1) {
        return false;
      }
      this.providers.splice(index, 0, this.providers.splice(index + 1, 1)[0]);
      this.save();
      return true;
    };

    ProjectConfig.prototype._getCommandByIndex = function(id, resolve, reject) {
      var c, p, _ref, _ref1;
      if ((p = this._providers.pop()) == null) {
        return reject(new Error("Command #" + (id + 1) + " not found"));
      }
      if ((c = (_ref = p["interface"]) != null ? _ref.getCommandByIndex(id - this.f) : void 0) instanceof Promise) {
        return c.then(resolve, (function(_this) {
          return function() {
            var _ref1;
            if ((c = (_ref1 = p["interface"]) != null ? _ref1.getCommandCount() : void 0) instanceof Promise) {
              return c.then((function(count) {
                _this.f = _this.f + count;
                return _this._getCommandByIndex(id, resolve, reject);
              }), reject);
            } else {
              _this.f = _this.f + (c != null ? c : 0);
              return _this._getCommandByIndex(id, resolve, reject);
            }
          };
        })(this));
      } else if (c != null) {
        return resolve(c);
      } else {
        if ((c = (_ref1 = p["interface"]) != null ? _ref1.getCommandCount() : void 0) instanceof Promise) {
          return c.then(((function(_this) {
            return function(count) {
              _this.f = _this.f + count;
              return _this._getCommandByIndex(id, resolve, reject);
            };
          })(this)), reject);
        } else {
          this.f = this.f + (c != null ? c : 0);
          return this._getCommandByIndex(id, resolve, reject);
        }
      }
    };

    ProjectConfig.prototype._getCommandNameObjects = function(resolve, reject) {
      var c, command, i, p, _ref;
      if ((p = this._providers.pop()) == null) {
        return resolve(this._return);
      }
      if ((c = (_ref = p["interface"]) != null ? _ref.getCommandNames() : void 0) instanceof Promise) {
        c.then(((function(_this) {
          return function(commands) {
            var command, i, _commands;
            _commands = (function() {
              var _i, _len, _results;
              _results = [];
              for (i = _i = 0, _len = commands.length; _i < _len; i = ++_i) {
                command = commands[i];
                _results.push({
                  name: command,
                  singular: Providers.modules[p.key].singular,
                  origin: p.key,
                  id: i,
                  pid: this.providers.length - this._providers.length - 1
                });
              }
              return _results;
            }).call(_this);
            _this._return = _this._return.concat(_commands);
            return _this._getCommandNameObjects(resolve, reject);
          };
        })(this)), reject);
        return;
      } else if (c != null) {
        this._return = this._return.concat((function() {
          var _i, _len, _results;
          _results = [];
          for (i = _i = 0, _len = c.length; _i < _len; i = ++_i) {
            command = c[i];
            _results.push({
              name: command,
              singular: Providers.modules[p.key].singular,
              origin: p.key,
              id: i,
              pid: this.providers.length - this._providers.length - 1
            });
          }
          return _results;
        }).call(this));
      }
      return this._getCommandNameObjects(resolve, reject);
    };

    ProjectConfig.prototype.save = function() {
      var provider, providers, _i, _len, _ref;
      providers = [];
      _ref = this.providers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        provider = _ref[_i];
        providers.push({
          key: provider.key,
          config: provider.config
        });
      }
      CSON.writeFileSync(this.filePath, {
        providers: providers
      });
      return this.emitter.emit('save');
    };

    ProjectConfig.migrateCommand = function(c) {
      var command, key, _i, _len, _ref;
      command = {};
      _ref = ['project', 'name', 'command', 'wd'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        command[key] = c[key];
      }
      if (c.version == null) {
        c.version = 1;
        if (c.stdout.highlighting === 'hc') {
          c.stdout.profile = 'gcc_clang';
        }
        if (c.stderr.highlighting === 'hc') {
          c.stderr.profile = 'gcc_clang';
        }
      }
      if (c.version === 1) {
        c.version = 2;
        c.save_all = true;
        c.close_success = false;
      }
      command.modifier = {};
      if (c.save_all) {
        command.modifier.save_all = {};
      }
      if (c.shell) {
        command.modifier.shell = {
          command: 'bash -c'
        };
      }
      if (c.wildcards) {
        command.modifier.wildcards = {};
      }
      command.stdout = c.stdout;
      command.stderr = c.stderr;
      command.output = {};
      command.output.console = {};
      command.output.console.close_success = c.close_success;
      command.output.console.queue_in_buffer = true;
      if ((c.stderr.profile != null) || (c.stdout.profile != null)) {
        command.output.linter = {
          no_trace: false
        };
      }
      command.version = 1;
      return command;
    };

    ProjectConfig.prototype.migrateLocal = function(commands, providers) {
      var command, _i, _len, _ref;
      providers.push({
        key: 'bt',
        config: {
          commands: []
        }
      });
      for (_i = 0, _len = commands.length; _i < _len; _i++) {
        command = commands[_i];
        providers[0].config.commands.push(ProjectConfig.migrateCommand(command));
      }
      return (_ref = atom.notifications) != null ? _ref.addWarning("Imported " + commands.length + " local command(s)") : void 0;
    };

    ProjectConfig.prototype.migrateGlobal = function() {
      var command, provider, _i, _len, _ref, _results;
      this.addProvider('bt');
      provider = this.providers[this.providers.length - 1]["interface"];
      _ref = this.global_data[this.projectPath].commands;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        command = _ref[_i];
        _results.push(provider.addCommand(ProjectConfig.migrateCommand(command)));
      }
      return _results;
    };

    ProjectConfig.prototype.hasGlobal = function(callback) {
      return CSON.readFile(path.join(path.dirname(atom.config.getUserConfigPath()), 'build-tools-cpp.projects'), (function(_this) {
        return function(err, global_data) {
          _this.global_data = global_data;
          if (err != null) {
            return;
          }
          if (_this.global_data[_this.projectPath] != null) {
            return callback();
          }
        };
      })(this));
    };

    return ProjectConfig;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9wcm92aWRlci9wcm9qZWN0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2Q0FBQTtJQUFBLGtGQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLFNBQUEsR0FBWSxPQUFBLENBQVEsWUFBUixDQURaLENBQUE7O0FBQUEsRUFHQyxVQUFXLE9BQUEsQ0FBUSxNQUFSLEVBQVgsT0FIRCxDQUFBOztBQUFBLEVBS0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBTFAsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFFUyxJQUFBLHVCQUFFLFdBQUYsRUFBZ0IsUUFBaEIsRUFBMkIsTUFBM0IsR0FBQTtBQUNYLFVBQUEseURBQUE7QUFBQSxNQURZLElBQUMsQ0FBQSxjQUFBLFdBQ2IsQ0FBQTtBQUFBLE1BRDBCLElBQUMsQ0FBQSxXQUFBLFFBQzNCLENBQUE7QUFBQSxNQURxQyxJQUFDLENBQUEsMEJBQUEsU0FBUyxLQUMvQyxDQUFBO0FBQUEsMkRBQUEsQ0FBQTtBQUFBLHlDQUFBLENBQUE7QUFBQSxNQUFBLElBQTBCLElBQUMsQ0FBQSxNQUEzQjtBQUFBLFFBQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FBWCxDQUFBO09BQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxTQUFELEdBQWEsRUFEYixDQUFBO0FBQUEsTUFFQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFlBQUwsQ0FBa0IsSUFBQyxDQUFBLFFBQW5CLENBRlAsQ0FBQTtBQUdBLE1BQUEsSUFBRyxJQUFBLEtBQVUsSUFBYjtBQUNFLFFBQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxT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

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/provider/project.coffee
