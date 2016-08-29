(function() {
  var BufferedProcess, CPEditPane, CPInfoPane, ChildProcess, View, fs, pstree, translate,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BufferedProcess = require('atom').BufferedProcess;

  View = require('atom-space-pen-views').View;

  fs = require('fs');

  pstree = null;

  translate = {
    'none': 'Disable all output streams',
    'no-stdout': 'Disable stdout',
    'no-stderr': 'Disable stderr',
    'stderr-in-stdout': 'Redirect stderr in stdout',
    'stdout-in-stderr': 'Redirect stdout in stderr',
    'both': 'Display all output streams'
  };

  module.exports = {
    name: 'Child Process',
    info: CPInfoPane = (function() {
      function CPInfoPane(command) {
        var key, value;
        this.element = document.createElement('div');
        this.element.classList.add('module');
        key = document.createElement('div');
        key.classList.add('text-padded');
        key.innerText = 'Output Streams:';
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = translate[command.environment.config.stdoe];
        this.element.appendChild(key);
        this.element.appendChild(value);
      }

      return CPInfoPane;

    })(),
    edit: CPEditPane = (function(_super) {
      __extends(CPEditPane, _super);

      function CPEditPane() {
        return CPEditPane.__super__.constructor.apply(this, arguments);
      }

      CPEditPane.content = function() {
        return this.div({
          "class": 'panel-body'
        }, (function(_this) {
          return function() {
            return _this.div({
              "class": 'block'
            }, function() {
              _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Output Streams');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Configure standard output/error stream');
                });
              });
              return _this.select({
                "class": 'form-control',
                outlet: 'streams'
              }, function() {
                _this.option({
                  value: 'none'
                }, 'Disable all streams');
                _this.option({
                  value: 'no-stdout'
                }, 'No stdout');
                _this.option({
                  value: 'no-stderr'
                }, 'No stderr');
                _this.option({
                  value: 'stderr-in-stdout'
                }, 'Redirect stderr in stdout');
                _this.option({
                  value: 'stdout-in-stderr'
                }, 'Redirect stdout in stderr');
                return _this.option({
                  value: 'both'
                }, 'Display all streams');
              });
            });
          };
        })(this));
      };

      CPEditPane.prototype.set = function(command, sourceFile) {
        var id, option, _i, _len, _ref, _results;
        if ((command != null ? command.environment.name : void 0) === 'child_process') {
          _ref = this.streams.children();
          _results = [];
          for (id = _i = 0, _len = _ref.length; _i < _len; id = ++_i) {
            option = _ref[id];
            if (option.attributes.getNamedItem('value').nodeValue === command.environment.config.stdoe) {
              this.streams[0].selectedIndex = id;
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        } else {
          return this.streams[0].selectedIndex = 5;
        }
      };

      CPEditPane.prototype.get = function(command) {
        var value;
        value = this.streams.children()[this.streams[0].selectedIndex].attributes.getNamedItem('value').nodeValue;
        command.environment = {
          name: 'child_process',
          config: {
            stdoe: value
          }
        };
        return null;
      };

      return CPEditPane;

    })(View),
    mod: ChildProcess = (function() {
      function ChildProcess(command, manager, config) {
        this.command = command;
        this.config = config;
        this.killed = false;
        if (atom.inSpecMode()) {
          this.promise = new Promise((function(_this) {
            return function(resolve, reject) {
              _this.resolve = resolve;
              _this.reject = reject;
              return _this.process = {
                exit: function(exitcode) {
                  if (_this.killed) {
                    return _this.resolve(exitcode);
                  }
                  _this.killed = true;
                  manager.finish(exitcode);
                  return _this.resolve(exitcode);
                },
                error: function(error) {
                  manager.error(error);
                  return _this.reject(error);
                },
                kill: function() {
                  _this.killed = true;
                  manager.finish(null);
                  return _this.resolve(null);
                }
              };
            };
          })(this));
          this.sigterm = function() {
            return this.process.kill();
          };
        } else {
          this.promise = new Promise((function(_this) {
            return function(resolve, reject) {
              var cwd;
              _this.resolve = resolve;
              _this.reject = reject;
              cwd = _this.command.getWD();
              return fs.exists(cwd, function(exists) {
                var error;
                if (exists) {
                  return _this.spawn(manager, cwd);
                }
                error = new Error("Working Directory " + cwd + " does not exist");
                _this.killed = true;
                manager.error(error);
                return _this.reject(error);
              });
            };
          })(this));
        }
        this.promise.then((function(_this) {
          return function() {
            return _this.destroy();
          };
        })(this), (function(_this) {
          return function() {
            return _this.destroy();
          };
        })(this));
      }

      ChildProcess.prototype.spawn = function(manager, cwd) {
        var args, command, env, setupStream, _ref, _ref1, _ref2;
        _ref = this.command, command = _ref.command, args = _ref.args, env = _ref.env;
        this.process = new BufferedProcess({
          command: command,
          args: args,
          options: {
            cwd: cwd,
            env: env
          }
        });
        this.process.process.on('close', (function(_this) {
          return function(exitcode, signal) {
            if (_this.killed) {
              return;
            }
            _this.killed = true;
            manager.finish({
              exitcode: exitcode,
              signal: signal
            });
            return _this.resolve({
              exitcode: exitcode,
              signal: signal
            });
          };
        })(this));
        if (this.config.stdoe !== 'none') {
          if ((_ref1 = this.process.process.stdout) != null) {
            _ref1.setEncoding('utf8');
          }
          if ((_ref2 = this.process.process.stderr) != null) {
            _ref2.setEncoding('utf8');
          }
          setupStream = function(stream, into) {
            return stream.on('data', (function(_this) {
              return function(data) {
                if (_this.process == null) {
                  return;
                }
                if (_this.killed) {
                  return;
                }
                return into["in"](data);
              };
            })(this));
          };
          if (this.config.stdoe === 'stderr-in-stdout') {
            setupStream(this.process.process.stdout, manager.stdout);
            setupStream(this.process.process.stderr, manager.stdout);
          } else if (this.config.stdoe === 'stdout-in-stderr') {
            setupStream(this.process.process.stdout, manager.stderr);
            setupStream(this.process.process.stderr, manager.stderr);
          } else if (this.config.stdoe === 'no-stdout') {
            setupStream(this.process.process.stderr, manager.stderr);
          } else if (this.config.stdoe === 'no-stderr') {
            setupStream(this.process.process.stdout, manager.stdout);
          } else if (this.config.stdoe === 'both') {
            setupStream(this.process.process.stdout, manager.stdout);
            setupStream(this.process.process.stderr, manager.stderr);
          }
        }
        manager.setInput(this.process.process.stdin);
        return this.process.onWillThrowError((function(_this) {
          return function(_arg) {
            var error, handle;
            error = _arg.error, handle = _arg.handle;
            _this.killed = true;
            manager.error(error);
            handle();
            return _this.reject(error);
          };
        })(this));
      };

      ChildProcess.prototype.getPromise = function() {
        return this.promise;
      };

      ChildProcess.prototype.isKilled = function() {
        return this.killed;
      };

      ChildProcess.prototype.sigterm = function() {
        return this.sendSignal('SIGINT');
      };

      ChildProcess.prototype.sigkill = function() {
        return this.sendSignal('SIGKILL');
      };

      ChildProcess.prototype.sendSignal = function(signal) {
        var _ref;
        if (process.platform === 'win32') {
          return (_ref = this.process) != null ? _ref.kill(signal) : void 0;
        } else {
          return (pstree != null ? pstree : pstree = require('ps-tree'))(this.process.process.pid, (function(_this) {
            return function(e, c) {
              var child, _i, _len;
              if (e != null) {
                return;
              }
              for (_i = 0, _len = c.length; _i < _len; _i++) {
                child = c[_i];
                try {
                  process.kill(child.PID, signal);
                } catch (_error) {
                  e = _error;
                  console.log(e);
                }
              }
              try {
                _this.process.process.kill(signal);
                return _this.process.killed = true;
              } catch (_error) {
                e = _error;
                return console.log(e);
              }
            };
          })(this));
        }
      };

      ChildProcess.prototype.destroy = function() {
        this.killed = true;
        this.promise = null;
        this.process = null;
        this.reject = function(e) {
          return console.log("Received reject for finished process: " + (JSON.stringify(e)));
        };
        return this.resolve = function(e) {
          return console.log("Received resolve for finished process: " + (JSON.stringify(e)));
        };
      };

      return ChildProcess;

    })()
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9lbnZpcm9ubWVudC9jaGlsZC1wcm9jZXNzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrRkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsa0JBQW1CLE9BQUEsQ0FBUSxNQUFSLEVBQW5CLGVBQUQsQ0FBQTs7QUFBQSxFQUVDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFGRCxDQUFBOztBQUFBLEVBSUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBSkwsQ0FBQTs7QUFBQSxFQU1BLE1BQUEsR0FBUyxJQU5ULENBQUE7O0FBQUEsRUFRQSxTQUFBLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFBUSw0QkFBUjtBQUFBLElBQ0EsV0FBQSxFQUFhLGdCQURiO0FBQUEsSUFFQSxXQUFBLEVBQWEsZ0JBRmI7QUFBQSxJQUdBLGtCQUFBLEVBQW9CLDJCQUhwQjtBQUFBLElBSUEsa0JBQUEsRUFBb0IsMkJBSnBCO0FBQUEsSUFLQSxNQUFBLEVBQVEsNEJBTFI7R0FURixDQUFBOztBQUFBLEVBZ0JBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLElBQUEsRUFBTSxlQUFOO0FBQUEsSUFFQSxJQUFBLEVBQ1E7QUFDUyxNQUFBLG9CQUFDLE9BQUQsR0FBQTtBQUNYLFlBQUEsVUFBQTtBQUFBLFFBQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFYLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLFFBQXZCLENBREEsQ0FBQTtBQUFBLFFBRUEsR0FBQSxHQUFNLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBRk4sQ0FBQTtBQUFBLFFBR0Es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

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/environment/child-process.coffee
