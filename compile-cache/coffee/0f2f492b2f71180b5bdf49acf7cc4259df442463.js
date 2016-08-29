(function() {
  var BuildToolsPane, BuildToolsProject, CSON, Command, CommandInfoPane, CompositeDisposable, Emitter, View, fs, notify, path,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fs = null;

  path = null;

  Emitter = null;

  Command = null;

  CommandInfoPane = null;

  CSON = null;

  CompositeDisposable = null;

  View = require('atom-space-pen-views').View;

  notify = function(message) {
    var _ref;
    if ((_ref = atom.notifications) != null) {
      _ref.addError(message);
    }
    return console.log('build-tools: ' + message);
  };

  module.exports = {
    name: 'Custom Commands',
    singular: 'Custom Command',
    activate: function(command) {
      var _ref;
      fs = require('fs');
      path = require('path');
      _ref = require('atom'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;
      Command = command;
      CommandInfoPane = require('../view/command-info-pane');
      return CSON = require('season');
    },
    deactivate: function() {
      fs = null;
      path = null;
      Emitter = null;
      Command = null;
      CommandInfoPane = null;
      return CSON = null;
    },
    model: BuildToolsProject = (function() {
      function BuildToolsProject(_arg, config, _save) {
        var command, project, _i, _len, _ref;
        project = _arg[0], this.sourceFile = _arg[1];
        this.config = config;
        this._save = _save;
        this.path = project;
        if (this._save != null) {
          this.emitter = new Emitter;
        }
        this.commands = [];
        if (this.config.commands != null) {
          _ref = this.config.commands;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            command = _ref[_i];
            command.project = this.path;
            command.source = this.sourceFile;
            this.commands.push(new Command(command));
          }
        }
        this.config.commands = this.commands;
      }

      BuildToolsProject.prototype.save = function() {
        return this._save();
      };

      BuildToolsProject.prototype.destroy = function() {
        if (this._save != null) {
          this.emitter.dispose();
        }
        this._save = null;
        this.commands = [];
        this.config = null;
        this.sourceFile = null;
        return this.path = null;
      };

      BuildToolsProject.prototype.getCommandByIndex = function(id) {
        return this.commands[id];
      };

      BuildToolsProject.prototype.getCommandCount = function() {
        return this.commands.length;
      };

      BuildToolsProject.prototype.getCommandNames = function() {
        var c, _i, _len, _ref, _results;
        _ref = this.commands;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          _results.push(c.name);
        }
        return _results;
      };

      BuildToolsProject.prototype.getCommands = function() {
        return this.commands;
      };

      BuildToolsProject.prototype.addCommand = function(item) {
        if (this.getCommandIndex(item.name) === -1) {
          item['project'] = this.path;
          item['source'] = this.sourceFile;
          this.commands.push(new Command(item));
          this.emitter.emit('change');
          return true;
        } else {
          notify("Command \"" + item.name + "\" already exists");
          return false;
        }
      };

      BuildToolsProject.prototype.removeCommand = function(name) {
        var i;
        if ((i = this.getCommandIndex(name)) !== -1) {
          this.commands.splice(i, 1)[0];
          this.emitter.emit('change');
          return true;
        } else {
          notify("Command \"" + name + "\" not found");
          return false;
        }
      };

      BuildToolsProject.prototype.replaceCommand = function(oldname, item) {
        var i;
        if ((i = this.getCommandIndex(oldname)) !== -1) {
          item['project'] = this.path;
          item['source'] = this.sourceFile;
          this.commands.splice(i, 1, item);
          this.emitter.emit('change');
          return true;
        } else {
          notify("Command \"" + oldname + "\" not found");
          return false;
        }
      };

      BuildToolsProject.prototype.moveCommand = function(name, offset) {
        var i;
        if ((i = this.getCommandIndex(name)) !== -1) {
          this.commands.splice(i + offset, 0, this.commands.splice(i, 1)[0]);
          this.emitter.emit('change');
          return true;
        } else {
          notify("Command \"" + name + "\" not found");
          return false;
        }
      };

      BuildToolsProject.prototype.hasCommand = function(name) {
        return this.getCommandIndex(name !== -1);
      };

      BuildToolsProject.prototype.getCommandIndex = function(name) {
        var cmd, index, _i, _len, _ref;
        _ref = this.commands;
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          cmd = _ref[index];
          if (cmd.name === name) {
            return index;
          }
        }
        return -1;
      };

      BuildToolsProject.prototype.onChange = function(callback) {
        return this.emitter.on('change', callback);
      };

      return BuildToolsProject;

    })(),
    view: BuildToolsPane = (function(_super) {
      __extends(BuildToolsPane, _super);

      function BuildToolsPane() {
        this.accept = __bind(this.accept, this);
        return BuildToolsPane.__super__.constructor.apply(this, arguments);
      }

      BuildToolsPane.content = function() {
        return this.div({
          "class": 'inset-panel'
        }, (function(_this) {
          return function() {
            _this.div({
              "class": 'top panel-heading'
            }, function() {
              _this.div(function() {
                _this.span({
                  id: 'provider-name',
                  "class": 'inline-block panel-text icon icon-code'
                });
                return _this.span({
                  id: 'add-command-button',
                  "class": 'inline-block btn btn-xs icon icon-plus'
                }, 'Add command');
              });
              return _this.div({
                "class": 'config-buttons align'
              }, function() {
                _this.div({
                  "class": 'icon-triangle-up'
                });
                _this.div({
                  "class": 'icon-triangle-down'
                });
                return _this.div({
                  "class": 'icon-x'
                });
              });
            });
            return _this.div({
              "class": 'panel-body padded'
            }, function() {
              return _this.div({
                "class": 'command-list',
                outlet: 'command_list'
              });
            });
          };
        })(this));
      };

      BuildToolsPane.prototype.initialize = function(project) {
        this.project = project;
        return this.disposable = this.project.onChange((function(_this) {
          return function() {
            _this.project.save();
            _this.command_list.html('');
            return _this.addCommands();
          };
        })(this));
      };

      BuildToolsPane.prototype.setCallbacks = function(hidePanes, showPane) {
        this.hidePanes = hidePanes;
        this.showPane = showPane;
      };

      BuildToolsPane.prototype.destroy = function() {
        var _ref;
        this.disposable.dispose();
        this.project = null;
        this.hidePanes = null;
        this.showPane = null;
        if ((_ref = this.commandPane) != null) {
          _ref.destroy();
        }
        return this.commandPane = null;
      };

      BuildToolsPane.prototype.accept = function(c) {
        return this.project.addCommand(c);
      };

      BuildToolsPane.prototype.attached = function() {
        this.on('click', '#add-command-button', (function(_this) {
          return function(e) {
            var _ref;
            if ((_ref = _this.commandPane) != null) {
              _ref.destroy();
            }
            _this.commandPane = atom.views.getView(new Command);
            _this.commandPane.setSource(_this.project.sourceFile);
            _this.commandPane.setCallbacks(_this.accept, _this.hidePanes);
            return _this.showPane(_this.commandPane);
          };
        })(this));
        return this.addCommands();
      };

      BuildToolsPane.prototype.detached = function() {
        return this.off('click', '#add-command-button');
      };

      BuildToolsPane.prototype.addCommands = function() {
        var command, down, edit, pane, remove, up, _i, _len, _ref, _results;
        this.command_list.html('');
        _ref = this.project.getCommands();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          command = _ref[_i];
          pane = new CommandInfoPane(command);
          up = (function(_this) {
            return function(command) {
              return _this.project.moveCommand(command.name, -1);
            };
          })(this);
          down = (function(_this) {
            return function(command) {
              return _this.project.moveCommand(command.name, 1);
            };
          })(this);
          edit = (function(_this) {
            return function(command) {
              var c;
              c = new Command(command);
              c.oldname = c.name;
              c.project = _this.project.projectPath;
              _this.commandPane = atom.views.getView(c);
              _this.commandPane.sourceFile = _this.project.sourceFile;
              _this.commandPane.setCallbacks(function(_command, oldname) {
                return _this.project.replaceCommand(oldname, _command);
              }, _this.hidePanes);
              return _this.showPane(_this.commandPane);
            };
          })(this);
          remove = (function(_this) {
            return function(command) {
              return _this.project.removeCommand(command.name);
            };
          })(this);
          pane.setCallbacks(up, down, edit, remove);
          _results.push(this.command_list.append(pane));
        }
        return _results;
      };

      return BuildToolsPane;

    })(View)
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9wcm92aWRlci9idWlsZC10b29scy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUhBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssSUFBTCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLElBRFAsQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxJQUZWLENBQUE7O0FBQUEsRUFHQSxPQUFBLEdBQVUsSUFIVixDQUFBOztBQUFBLEVBSUEsZUFBQSxHQUFrQixJQUpsQixDQUFBOztBQUFBLEVBS0EsSUFBQSxHQUFPLElBTFAsQ0FBQTs7QUFBQSxFQU1BLG1CQUFBLEdBQXNCLElBTnRCLENBQUE7O0FBQUEsRUFPQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBUEQsQ0FBQTs7QUFBQSxFQVNBLE1BQUEsR0FBUyxTQUFDLE9BQUQsR0FBQTtBQUNQLFFBQUEsSUFBQTs7VUFBa0IsQ0FBRSxRQUFwQixDQUE2QixPQUE3QjtLQUFBO1dBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxlQUFBLEdBQWtCLE9BQTlCLEVBRk87RUFBQSxDQVRULENBQUE7O0FBQUEsRUFhQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxJQUFBLEVBQU0saUJBQU47QUFBQSxJQUNBLFFBQUEsRUFBVSxnQkFEVjtBQUFBLElBR0EsUUFBQSxFQUFVLFNBQUMsT0FBRCxHQUFBO0FBQ1IsVUFBQSxJQUFBO0FBQUEsTUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBO0FBQUEsTUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBO0FBQUEsTUFFQSxPQUFpQyxPQUFBLENBQVEsTUFBUixDQUFqQyxFQUFDLGVBQUEsT0FB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

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/provider/build-tools.coffee
