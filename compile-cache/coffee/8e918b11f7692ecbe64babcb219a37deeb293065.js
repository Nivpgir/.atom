(function() {
  var $, $$, CompositeDisposable, Modifiers, StreamPane, TextEditorView, View, nice, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  CompositeDisposable = require('atom').CompositeDisposable;

  Modifiers = require('../stream-modifiers/modifiers');

  nice = {
    stdout: 'Standard Output Stream (stdout)',
    stderr: 'Standard Error Stream (stderr)'
  };

  module.exports = StreamPane = (function(_super) {
    __extends(StreamPane, _super);

    function StreamPane() {
      return StreamPane.__super__.constructor.apply(this, arguments);
    }

    StreamPane.content = function() {
      return this.div({
        "class": 'stream-modifier panel-body'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'block'
          }, function() {
            _this.div({
              "class": 'panel-heading'
            }, function() {
              _this.span({
                "class": 'inline-block panel-text icon icon-plug',
                outlet: 'heading'
              });
              return _this.span({
                id: 'add-modifier',
                "class": 'inline-block btn btn-sm icon icon-plus'
              }, 'Add Modifier');
            });
            return _this.div({
              "class": 'panel-body padded',
              outlet: 'panes_view'
            });
          });
        };
      })(this));
    };

    StreamPane.prototype.attached = function() {
      this.disposables = new CompositeDisposable;
      return this.panes = [];
    };

    StreamPane.prototype.detached = function() {
      var item, _i, _len, _ref1, _ref2;
      this.removeEventHandlers();
      _ref1 = this.panes;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        item = _ref1[_i];
        if ((_ref2 = item.view) != null) {
          if (typeof _ref2.destroy === "function") {
            _ref2.destroy();
          }
        }
      }
      this.panes = null;
      return this.panes_view.empty();
    };

    StreamPane.prototype.set = function(command, stream, sourceFile) {
      this.command = command;
      this.stream = stream;
      this.sourceFile = sourceFile;
      this.heading.text(nice[this.stream]);
      this.loadAddCommands(stream);
      if (this.command != null) {
        this.loadModifierModules(this.command[stream].pipeline);
      }
      return this.addEventHandlers();
    };

    StreamPane.prototype.get = function(command, stream) {
      var e, view, _i, _len, _ref1;
      _ref1 = this.panes;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        view = _ref1[_i].view;
        if ((e = view.get(command, stream)) != null) {
          return e;
        }
      }
      return null;
    };

    StreamPane.prototype.loadAddCommands = function(stream) {
      var context, contextMenu, key, name, _i, _len, _ref1;
      this.addClass(stream);
      context = [];
      _ref1 = Object.keys(Modifiers.modules).sort();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        key = _ref1[_i];
        name = Modifiers.modules[key].name;
        this.disposables.add(atom.commands.add(this[0], "build-tools:add-" + key, ((function(_this) {
          return function(k) {
            return function() {
              return _this.addModifier(k);
            };
          };
        })(this))(key)));
        context.push({
          label: name,
          command: "build-tools:add-" + key
        });
      }
      contextMenu = {};
      contextMenu["." + stream + " #add-modifier"] = context;
      return this.disposables.add(atom.contextMenu.add(contextMenu));
    };

    StreamPane.prototype.loadModifierModules = function(pipeline) {
      var config, name, _i, _len, _ref1, _results;
      _results = [];
      for (_i = 0, _len = pipeline.length; _i < _len; _i++) {
        _ref1 = pipeline[_i], name = _ref1.name, config = _ref1.config;
        _results.push(this.addModifier(name, config));
      }
      return _results;
    };

    StreamPane.prototype.addModifier = function(name, config) {
      var mod, view;
      if (Modifiers.activate(name) !== true) {
        return;
      }
      mod = Modifiers.modules[name];
      if (mod["private"]) {
        return;
      }
      view = this.buildPane(new mod.edit, mod.name, 'icon-eye', name, mod.description, config).view;
      return this.initializePane(view, config);
    };

    StreamPane.prototype.initializePane = function(view, config) {
      return view != null ? typeof view.set === "function" ? view.set(this.command, config, this.stream, this.sourceFile) : void 0 : void 0;
    };

    StreamPane.prototype.buildPane = function(view, name, icon, key, desc, config) {
      var item;
      if (desc == null) {
        desc = '';
      }
      item = $$(function() {
        return this.div({
          "class": 'inset-panel'
        }, (function(_this) {
          return function() {
            return _this.div({
              "class": 'panel-heading top module'
            }, function() {
              _this.div({
                "class": 'align'
              }, function() {
                _this.div({
                  "class": "settings-name icon " + icon
                }, name);
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, desc);
                });
              });
              return _this.div({
                "class": 'align'
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
          };
        })(this));
      });
      if (view.element != null) {
        item.append(view.element);
      }
      item.on('click', '.panel-heading .align .icon-triangle-up', (function(_this) {
        return function(event) {
          var index, pane, _i, _len, _ref1, _results;
          _ref1 = _this.panes;
          _results = [];
          for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
            pane = _ref1[index];
            if (pane.key === key) {
              _this.moveModifierUp(index);
              event.stopPropagation();
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
      })(this));
      item.on('click', '.panel-heading .align .icon-triangle-down', (function(_this) {
        return function(event) {
          var index, pane, _i, _len, _ref1, _results;
          _ref1 = _this.panes;
          _results = [];
          for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
            pane = _ref1[index];
            if (pane.key === key) {
              _this.moveModifierDown(index);
              event.stopPropagation();
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
      })(this));
      item.on('click', '.panel-heading .align .icon-x', (function(_this) {
        return function(event) {
          var index, pane, _i, _len, _ref1, _results;
          _ref1 = _this.panes;
          _results = [];
          for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
            pane = _ref1[index];
            if (pane.key === key) {
              _this.removeModifier(index);
              event.stopPropagation();
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
      })(this));
      this.panes_view.append(item);
      this.panes.push({
        pane: item,
        view: view,
        key: key,
        config: config
      });
      return {
        pane: item,
        view: view,
        config: config
      };
    };

    StreamPane.prototype.moveModifierUp = function(index) {
      var e;
      if ((index === 0) || (index > Object.keys(Modifiers.modules).length)) {
        return false;
      }
      e = this.panes.splice(index, 1)[0];
      this.panes.splice(index - 1, 0, e);
      return $(this.panes_view.children()[index - 1]).before(e.pane);
    };

    StreamPane.prototype.moveModifierDown = function(index) {
      var e;
      if (index >= Object.keys(Modifiers.modules).length) {
        return false;
      }
      e = this.panes.splice(index + 1, 1)[0];
      this.panes.splice(index, 0, e);
      return $(this.panes_view.children()[index]).before(e.pane);
    };

    StreamPane.prototype.removeModifier = function(index) {
      var pane;
      if (index > this.panes.length) {
        return false;
      }
      pane = this.panes.splice(index, 1)[0].pane;
      return pane.remove();
    };

    StreamPane.prototype.addEventHandlers = function() {
      return this.on('click', '#add-modifier', function(event) {
        return atom.contextMenu.showForEvent(event);
      });
    };

    StreamPane.prototype.removeEventHandlers = function() {
      this.off('click', '#add-modifier');
      return this.disposables.dispose();
    };

    return StreamPane;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi92aWV3L2NvbW1hbmQtZWRpdC1zdHJlYW0tcGFuZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUZBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQWdDLE9BQUEsQ0FBUSxzQkFBUixDQUFoQyxFQUFDLFNBQUEsQ0FBRCxFQUFJLFVBQUEsRUFBSixFQUFRLHNCQUFBLGNBQVIsRUFBd0IsWUFBQSxJQUF4QixDQUFBOztBQUFBLEVBRUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUZELENBQUE7O0FBQUEsRUFJQSxTQUFBLEdBQVksT0FBQSxDQUFRLCtCQUFSLENBSlosQ0FBQTs7QUFBQSxFQU1BLElBQUEsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUFRLGlDQUFSO0FBQUEsSUFDQSxNQUFBLEVBQVEsZ0NBRFI7R0FQRixDQUFBOztBQUFBLEVBVUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUVKLGlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLDRCQUFQO09BQUwsRUFBMEMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDeEMsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLE9BQVA7V0FBTCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sZUFBUDthQUFMLEVBQTZCLFNBQUEsR0FBQTtBQUMzQixjQUFBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxnQkFBQSxPQUFBLEVBQU8s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

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/view/command-edit-stream-pane.coffee
