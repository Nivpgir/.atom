(function() {
  var Command, ShellInfoPane, ShellPane, TextEditorView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Command = null;

  _ref = require('atom-space-pen-views'), TextEditorView = _ref.TextEditorView, View = _ref.View;

  module.exports = {
    name: 'Execute in Shell',
    description: 'Execute command in a shell',
    "private": false,
    edit: ShellPane = (function(_super) {
      __extends(ShellPane, _super);

      function ShellPane() {
        return ShellPane.__super__.constructor.apply(this, arguments);
      }

      ShellPane.content = function() {
        return this.div({
          "class": 'panel-body padded'
        }, (function(_this) {
          return function() {
            return _this.div({
              "class": 'block'
            }, function() {
              _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Shell Command');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Your command will be appended to the shell command');
                });
              });
              return _this.subview('command_name', new TextEditorView({
                mini: true,
                placeholderText: 'Default: bash -c'
              }));
            });
          };
        })(this));
      };

      ShellPane.prototype.set = function(command) {
        var _ref1;
        if ((command != null ? (_ref1 = command.modifier) != null ? _ref1.shell : void 0 : void 0) != null) {
          return this.command_name.getModel().setText(command.modifier.shell.command);
        } else {
          return this.command_name.getModel().setText('');
        }
      };

      ShellPane.prototype.get = function(command) {
        var out, _base;
        if ((out = this.command_name.getModel().getText()) === '') {
          out = 'bash -c';
        }
        if ((_base = command.modifier).shell == null) {
          _base.shell = {};
        }
        command.modifier.shell.command = out;
        return null;
      };

      return ShellPane;

    })(View),
    info: ShellInfoPane = (function() {
      function ShellInfoPane(command) {
        var keys, value, values;
        this.element = document.createElement('div');
        this.element.classList.add('module');
        keys = document.createElement('div');
        keys.innerHTML = '<div class="text-padded">Shell Command:</div>';
        values = document.createElement('div');
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command.modifier.shell.command);
        values.appendChild(value);
        this.element.appendChild(keys);
        this.element.appendChild(values);
      }

      return ShellInfoPane;

    })(),
    activate: function() {
      return Command = require('../provider/command');
    },
    deactivate: function() {
      return Command = null;
    },
    postSplit: function(command) {
      var args;
      args = Command.splitQuotes(command.modifier.shell.command);
      command.args = args.slice(1).concat([command.original]);
      command.command = args[0];
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9tb2RpZmllci9zaGVsbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkRBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQUEsR0FBVSxJQUFWLENBQUE7O0FBQUEsRUFDQSxPQUF5QixPQUFBLENBQVEsc0JBQVIsQ0FBekIsRUFBQyxzQkFBQSxjQUFELEVBQWlCLFlBQUEsSUFEakIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7QUFBQSxJQUFBLElBQUEsRUFBTSxrQkFBTjtBQUFBLElBQ0EsV0FBQSxFQUFhLDRCQURiO0FBQUEsSUFFQSxTQUFBLEVBQVMsS0FGVDtBQUFBLElBSUEsSUFBQSxFQUNRO0FBRUosa0NBQUEsQ0FBQTs7OztPQUFBOztBQUFBLE1BQUEsU0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7ZUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsVUFBQSxPQUFBLEVBQU8sbUJBQVA7U0FBTCxFQUFpQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFDL0IsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLE9BQVA7YUFBTCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsY0FBQSxLQUFDLENBQUEsS0FBRCxDQUFPLFNBQUEsR0FBQTtBQUNMLGdCQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxrQkFBQSxPQUFBLEVBQU8sZUFBUDtpQkFBTCxFQUE2QixlQUE3QixDQUFBLENBQUE7dUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFBLEdBQUE7eUJBQ0gsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLG9CQUFBLE9BQUEsRUFBTywwQkFB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

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/modifier/shell.coffee
