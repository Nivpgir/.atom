(function() {
  var $$, Environment, InfoPane, MainPane, Modifiers, Outputs, StreamInfoPane, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, View = _ref.View;

  Outputs = require('../output/output');

  Modifiers = require('../modifier/modifier');

  Environment = require('../environment/environment');

  MainPane = require('./command-info-main-pane');

  StreamInfoPane = require('./command-info-stream-pane');

  module.exports = InfoPane = (function(_super) {
    __extends(InfoPane, _super);

    function InfoPane() {
      return InfoPane.__super__.constructor.apply(this, arguments);
    }

    InfoPane.content = function() {
      return this.div({
        "class": 'command inset-panel'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'top panel-heading'
          }, function() {
            _this.div({
              id: 'info',
              "class": 'align'
            }, function() {
              _this.div({
                "class": 'icon-triangle-right expander'
              });
              return _this.div({
                id: 'name',
                outlet: 'name'
              });
            });
            return _this.div({
              id: 'options',
              "class": 'align'
            }, function() {
              _this.div({
                "class": 'icon-pencil'
              });
              _this.div({
                "class": 'icon-triangle-up move-up'
              });
              _this.div({
                "class": 'icon-triangle-down move-down'
              });
              return _this.div({
                "class": 'icon-x'
              });
            });
          });
          return _this.div({
            "class": 'info hidden panel-body',
            outlet: 'info'
          });
        };
      })(this));
    };

    InfoPane.prototype.initialize = function(command) {
      this.command = command;
      this.panes = [];
      this.name.text(this.command.name);
      this.info.append(this.buildPane(MainPane, 'General'));
      this.initializeModifierModules();
      this.initializeEnvironmentModule();
      this.initializeHighlightingPanes();
      this.initializeOutputModules();
      return this.addEventHandlers();
    };

    InfoPane.prototype.setCallbacks = function(up, down, edit, remove) {
      this.up = up;
      this.down = down;
      this.edit = edit;
      this.remove = remove;
    };

    InfoPane.prototype.addEventHandlers = function() {
      this.on('click', '.icon-pencil', (function(_this) {
        return function() {
          return _this.edit(_this.command);
        };
      })(this));
      this.on('click', '.move-up', (function(_this) {
        return function() {
          return _this.up(_this.command);
        };
      })(this));
      this.on('click', '.move-down', (function(_this) {
        return function() {
          return _this.down(_this.command);
        };
      })(this));
      this.on('click', '.icon-x', (function(_this) {
        return function() {
          return _this.remove(_this.command);
        };
      })(this));
      return this.on('click', '.expander', function(_arg) {
        var currentTarget;
        currentTarget = _arg.currentTarget;
        if (currentTarget.classList.contains('icon-triangle-right')) {
          currentTarget.classList.remove('icon-triangle-right');
          currentTarget.classList.add('icon-triangle-down');
          return currentTarget.parentNode.parentNode.parentNode.children[1].classList.remove('hidden');
        } else {
          currentTarget.classList.add('icon-triangle-right');
          currentTarget.classList.remove('icon-triangle-down');
          return currentTarget.parentNode.parentNode.parentNode.children[1].classList.add('hidden');
        }
      });
    };

    InfoPane.prototype.buildPane = function(Element, name, config) {
      var bodyclass, element, headerclass;
      headerclass = 'panel-heading';
      bodyclass = 'panel-body padded';
      if (name != null) {
        element = $$(function() {
          return this.div({
            "class": 'inset-panel'
          }, (function(_this) {
            return function() {
              _this.div({
                "class": headerclass
              }, name);
              if (Element != null) {
                return _this.div({
                  "class": bodyclass
                });
              }
            };
          })(this));
        });
      } else {
        element = $$(function() {
          return this.div({
            "class": 'inset-panel'
          }, (function(_this) {
            return function() {
              return _this.div({
                "class": bodyclass
              });
            };
          })(this));
        });
      }
      if (Element != null) {
        this.panes.push(new Element(this.command, config));
        element.find('.panel-body').append(this.panes[this.panes.length - 1].element);
      }
      return this.info.append(element);
    };

    InfoPane.prototype.initializeHighlightingPanes = function() {
      this.initializeStreamModules(this.command.stdout, 'Standard Output');
      return this.initializeStreamModules(this.command.stderr, 'Standard Error');
    };

    InfoPane.prototype.initializeStreamModules = function(stream, name) {
      if (stream.pipeline.length !== 0) {
        return this.buildPane(StreamInfoPane, name, stream);
      }
    };

    InfoPane.prototype.initializeEnvironmentModule = function() {
      var key;
      key = this.command.environment.name;
      if (Environment.activate(key) !== true) {
        return;
      }
      if (Environment.modules[key]["private"]) {
        return;
      }
      return this.buildPane(Environment.modules[key].info, 'Environment: ' + Environment.modules[key].name);
    };

    InfoPane.prototype.initializeOutputModules = function() {
      var key, _i, _len, _ref1, _ref2, _results;
      _ref2 = Object.keys((_ref1 = this.command.output) != null ? _ref1 : {});
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        key = _ref2[_i];
        if (Outputs.activate(key) !== true) {
          continue;
        }
        if (Outputs.modules[key]["private"]) {
          continue;
        }
        _results.push(this.buildPane(Outputs.modules[key].info, 'Output: ' + Outputs.modules[key].name));
      }
      return _results;
    };

    InfoPane.prototype.initializeModifierModules = function() {
      var key, _i, _len, _ref1, _ref2, _results;
      _ref2 = Object.keys((_ref1 = this.command.modifier) != null ? _ref1 : {});
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        key = _ref2[_i];
        if (Modifiers.activate(key) !== true) {
          continue;
        }
        if (Modifiers.modules[key]["private"]) {
          continue;
        }
        _results.push(this.buildPane(Modifiers.modules[key].info, 'Modifier: ' + Modifiers.modules[key].name));
      }
      return _results;
    };

    return InfoPane;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi92aWV3L2NvbW1hbmQtaW5mby1wYW5lLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtRkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBYSxPQUFBLENBQVEsc0JBQVIsQ0FBYixFQUFDLFVBQUEsRUFBRCxFQUFLLFlBQUEsSUFBTCxDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxrQkFBUixDQUZWLENBQUE7O0FBQUEsRUFHQSxTQUFBLEdBQVksT0FBQSxDQUFRLHNCQUFSLENBSFosQ0FBQTs7QUFBQSxFQUlBLFdBQUEsR0FBYyxPQUFBLENBQVEsNEJBQVIsQ0FKZCxDQUFBOztBQUFBLEVBTUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSwwQkFBUixDQU5YLENBQUE7O0FBQUEsRUFPQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSw0QkFBUixDQVBqQixDQUFBOztBQUFBLEVBU0EsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUVKLCtCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHFCQUFQO09BQUwsRUFBbUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNqQyxVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxtQkFBUDtXQUFMLEVBQWlDLFNBQUEsR0FBQTtBQUMvQixZQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLEVBQUEsRUFBSSxNQUFKO0FBQUEsY0FBWSxPQUFBLEVBQU8sT0FBbkI7YUFBTCxFQUFpQyxTQUFBLEdBQUE7QUFDL0Is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

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/view/command-info-pane.coffee
