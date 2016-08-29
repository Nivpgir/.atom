(function() {
  var $, $$, Environment, HighlightingPane, StreamPane, TextEditorView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  StreamPane = require('./command-edit-stream-pane');

  Environment = require('../environment/environment');

  module.exports = HighlightingPane = (function(_super) {
    __extends(HighlightingPane, _super);

    function HighlightingPane() {
      return HighlightingPane.__super__.constructor.apply(this, arguments);
    }

    HighlightingPane.content = function() {
      return this.div({
        "class": 'panel-body'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'padded'
          }, function() {
            _this.div({
              "class": 'block'
            }, function() {
              _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Environment');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Configure Environment');
                });
              });
              return _this.select({
                "class": 'form-control',
                outlet: 'environment'
              });
            });
            return _this.div({
              outlet: 'env'
            });
          });
          _this.div({
            "class": 'stream',
            outlet: 'stdout'
          });
          return _this.div({
            "class": 'stream',
            outlet: 'stderr'
          });
        };
      })(this));
    };

    HighlightingPane.prototype.attached = function() {
      this._stdout = new StreamPane;
      this._stderr = new StreamPane;
      this.stdout.append(this._stdout);
      this.stderr.append(this._stderr);
      this.command = null;
      this.sourceFile = null;
      this.envPane = null;
      this.populateEnvironment();
      return this.environment.on('change', this.setEnvPane.bind(this), function(_arg) {
        var currentTarget, data, value;
        data = _arg.data, currentTarget = _arg.currentTarget;
        value = currentTarget.children[currentTarget.selectedIndex].getAttribute('value');
        return data(value);
      });
    };

    HighlightingPane.prototype.detached = function() {
      this.environment.off('change');
      this._stdout.remove();
      this._stderr.remove();
      this._stdout = null;
      this._stderr = null;
      this.command = null;
      this.sourceFile = null;
      this.envPane = null;
      this.stdout.empty();
      return this.stderr.empty();
    };

    HighlightingPane.prototype.set = function(command, sourceFile) {
      this.command = command;
      this.sourceFile = sourceFile;
      this._stdout.set(this.command, 'stdout', this.sourceFile);
      this._stderr.set(this.command, 'stderr', this.sourceFile);
      if (this.command != null) {
        return this.setEnvironment(this.command.environment.name);
      } else {
        return this.setEnvironment('child_process');
      }
    };

    HighlightingPane.prototype.populateEnvironment = function() {
      var createItem, id, key, _i, _len, _ref1;
      createItem = function(key, environment) {
        return $$(function() {
          return this.option({
            value: key
          }, environment);
        });
      };
      this.environment.empty();
      _ref1 = Object.keys(Environment.modules);
      for (id = _i = 0, _len = _ref1.length; _i < _len; id = ++_i) {
        key = _ref1[id];
        this.environment.append(createItem(key, Environment.modules[key].name));
      }
      return this.environment[0].selectedIndex = 0;
    };

    HighlightingPane.prototype.setEnvironment = function(name) {
      var id, option, _i, _len, _ref1;
      _ref1 = this.environment.children();
      for (id = _i = 0, _len = _ref1.length; _i < _len; id = ++_i) {
        option = _ref1[id];
        if (option.attributes.getNamedItem('value').nodeValue === name) {
          this.environment[0].selectedIndex = id;
          break;
        }
      }
      return this.setEnvPane(name);
    };

    HighlightingPane.prototype.setEnvPane = function(value) {
      var Edit, edit;
      this.env.empty();
      if (!Environment.activate(value)) {
        atom.notifications.addError('Could not find environment module ' + value);
        return;
      }
      Edit = Environment.modules[value].edit;
      if (Edit != null) {
        edit = new Edit;
        if (edit.element != null) {
          this.env.append(edit.element);
        }
        edit.set(this.command);
        return this.envPane = edit;
      } else {
        return atom.notifications.addError('Environment module has no edit pane ' + value);
      }
    };

    HighlightingPane.prototype.get = function(command) {
      this.envPane.get(command);
      this._stdout.get(command, 'stdout');
      return this._stderr.get(command, 'stderr');
    };

    return HighlightingPane;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi92aWV3L2NvbW1hbmQtZWRpdC1oaWdobGlnaHRpbmctcGFuZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNEVBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQWdDLE9BQUEsQ0FBUSxzQkFBUixDQUFoQyxFQUFDLFNBQUEsQ0FBRCxFQUFJLFVBQUEsRUFBSixFQUFRLHNCQUFBLGNBQVIsRUFBd0IsWUFBQSxJQUF4QixDQUFBOztBQUFBLEVBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSw0QkFBUixDQURiLENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsT0FBQSxDQUFRLDRCQUFSLENBRmQsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFFSix1Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxnQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sWUFBUDtPQUFMLEVBQTBCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDeEIsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sUUFBUDtXQUFMLEVBQXNCLFNBQUEsR0FBQTtBQUNwQixZQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxPQUFQO2FBQUwsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLGNBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxTQUFBLEdBQUE7QUFDTCxnQkFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsa0JBQUEsT0FBQSxFQUFPLGVBQVA7aUJBQUwsRUFBNkIsYUFBN0IsQ0FBQSxDQUFBO3VC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

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/view/command-edit-highlighting-pane.coffee
