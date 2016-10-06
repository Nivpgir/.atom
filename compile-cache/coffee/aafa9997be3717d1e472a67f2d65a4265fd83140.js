(function() {
  var BuildToolsProjectExternal, Command, Project, TextEditorView, View, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Command = null;

  path = null;

  _ref = require('atom-space-pen-views'), View = _ref.View, TextEditorView = _ref.TextEditorView;

  Project = null;

  module.exports = {
    name: 'Link to configuration file',
    singular: 'External Command',
    activate: function(command, project) {
      Command = command;
      Project = project;
      return path = require('path');
    },
    deactivate: function() {
      Command = null;
      Project = null;
      return path = null;
    },
    model: BuildToolsProjectExternal = (function() {
      function BuildToolsProjectExternal(_arg, config, _save) {
        var file;
        this.projectPath = _arg[0];
        this.config = config;
        this._save = _save != null ? _save : null;
        if (this._save != null) {
          return;
        }
        file = path.resolve(this.projectPath, this.config.file);
        if (!this.config.overwrite) {
          this.projectPath = path.dirname(file);
        }
        try {
          this.project = new Project(this.projectPath, file);
        } catch (_error) {
          this.project = null;
        }
      }

      BuildToolsProjectExternal.prototype.save = function() {
        return this._save();
      };

      BuildToolsProjectExternal.prototype.destroy = function() {
        var _ref1;
        this.projectPath = null;
        this.config = null;
        this._save = null;
        if (this._save != null) {
          return;
        }
        if ((_ref1 = this.project) != null) {
          _ref1.destroy();
        }
        return this.project = null;
      };

      BuildToolsProjectExternal.prototype.getCommandByIndex = function(id) {
        return new Promise((function(_this) {
          return function(resolve, reject) {
            if (_this.project == null) {
              throw new Error("Could not load project file " + _this.config.file);
            }
            return _this.project.getCommandByIndex(id).then(resolve, reject);
          };
        })(this));
      };

      BuildToolsProjectExternal.prototype.getCommandCount = function() {
        return new Promise((function(_this) {
          return function(resolve, reject) {
            if (_this.project == null) {
              throw new Error("Could not load project file " + _this.config.file);
            }
            return _this.project.getCommandNameObjects().then((function(arr) {
              return resolve(arr.length);
            }), reject);
          };
        })(this));
      };

      BuildToolsProjectExternal.prototype.getCommandNames = function() {
        return new Promise((function(_this) {
          return function(resolve, reject) {
            if (_this.project == null) {
              throw new Error("Could not load project file " + _this.config.file);
            }
            return _this.project.getCommandNameObjects().then((function(commands) {
              var command;
              return resolve((function() {
                var _i, _len, _results;
                _results = [];
                for (_i = 0, _len = commands.length; _i < _len; _i++) {
                  command = commands[_i];
                  _results.push(command.name);
                }
                return _results;
              })());
            }), reject);
          };
        })(this));
      };

      return BuildToolsProjectExternal;

    })(),
    view: BuildToolsProjectExternal = (function(_super) {
      __extends(BuildToolsProjectExternal, _super);

      function BuildToolsProjectExternal() {
        return BuildToolsProjectExternal.__super__.constructor.apply(this, arguments);
      }

      BuildToolsProjectExternal.content = function() {
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
                  "class": 'inline-block panel-text icon icon-file-symlink-file'
                });
                return _this.span({
                  id: 'apply',
                  "class": 'inline-block btn btn-xs icon icon-check'
                }, 'Apply');
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
              _this.div({
                "class": 'block'
              }, function() {
                _this.label(function() {
                  _this.div({
                    "class": 'settings-name'
                  }, 'File Location');
                  return _this.div(function() {
                    return _this.span({
                      "class": 'inline-block text-subtle'
                    }, 'Path to .build-tools.cson file');
                  });
                });
                return _this.subview('path', new TextEditorView({
                  mini: true
                }));
              });
              return _this.div({
                "class": 'block input-label align'
              }, function() {
                _this.input({
                  "class": 'input-checkbox',
                  id: 'overwrite_wd',
                  type: 'checkbox'
                });
                return _this.label(function() {
                  _this.div({
                    "class": 'settings-name'
                  }, 'Overwrite working directory');
                  return _this.div(function() {
                    _this.span({
                      "class": 'inline-block text-subtle'
                    }, 'Execute command relative to ');
                    _this.span({
                      "class": 'inline-block text-highlight'
                    }, 'this');
                    return _this.span({
                      "class": 'inline-block text-subtle'
                    }, ' config file instead of the external one');
                  });
                });
              });
            });
          };
        })(this));
      };

      BuildToolsProjectExternal.prototype.initialize = function(project) {
        var _ref1;
        this.project = project;
        this.path.getModel().setText((_ref1 = this.project.config.file) != null ? _ref1 : '');
        return this.find('#overwrite_wd').prop('checked', this.project.config.overwrite);
      };

      BuildToolsProjectExternal.prototype.destroy = function() {
        return this.project = null;
      };

      BuildToolsProjectExternal.prototype.attached = function() {
        return this.on('click', '#apply', (function(_this) {
          return function() {
            var p, _ref1;
            if ((p = _this.path.getModel().getText()) !== '') {
              _this.project.config.file = p;
              _this.project.config.overwrite = _this.find('#overwrite_wd').prop('checked');
              return _this.project.save();
            } else {
              return (_ref1 = atom.notifications) != null ? _ref1.addError('Path must not be empty') : void 0;
            }
          };
        })(this));
      };

      return BuildToolsProjectExternal;

    })(View)
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9wcm92aWRlci9idWlsZC10b29scy1leHRlcm5hbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkVBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQUEsR0FBVSxJQUFWLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sSUFEUCxDQUFBOztBQUFBLEVBRUEsT0FBeUIsT0FBQSxDQUFRLHNCQUFSLENBQXpCLEVBQUMsWUFBQSxJQUFELEVBQU8sc0JBQUEsY0FGUCxDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLElBSFYsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7QUFBQSxJQUFBLElBQUEsRUFBTSw0QkFBTjtBQUFBLElBQ0EsUUFBQSxFQUFVLGtCQURWO0FBQUEsSUFHQSxRQUFBLEVBQVUsU0FBQyxPQUFELEVBQVUsT0FBVixHQUFBO0FBQ1IsTUFBQSxPQUFBLEdBQVUsT0FBVixDQUFBO0FBQUEsTUFDQSxPQUFBLEdBQVUsT0FEVixDQUFBO2FBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLEVBSEM7SUFBQSxDQUhWO0FBQUEsSUFRQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxPQUFBLEdBQVUsSUFBVixDQUFBO0FBQUEsTUFDQSxPQUFBLEdBQVUsSUFEVixDQUFBO2FBRUEsSUFBQSxHQUFPLEtBSEc7SUFBQSxDQVJaO0FBQUEsSUFhQSxLQUFBLEVBQ1E7QUFFUyxNQUFBLG1DQUFDLElBQUQsRUFBa0IsTUFBbEIsRUFBMkIsS0FBM0IsR0FBQTtBQUNYLFlBQUEsSUFBQTtBQUFBLFFBRGEsSUFBQyxDQUFBLGNBQUYsT0FDWixDQUFBO0FBQUEsUUFENEIsSUFBQyxDQUFBLFNBQUEsTUFD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

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/provider/build-tools-external.coffee
