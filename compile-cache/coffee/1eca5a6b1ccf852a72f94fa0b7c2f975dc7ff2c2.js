(function() {
  var Linter, LinterInfoPane, LinterPane, View, coordinates, ll,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ll = require('../linter-list');

  View = require('atom-space-pen-views').View;

  coordinates = {};

  module.exports = {
    name: 'Linter',
    description: 'Highlight errors in-line with Linter',
    "private": false,
    edit: LinterPane = (function(_super) {
      __extends(LinterPane, _super);

      function LinterPane() {
        return LinterPane.__super__.constructor.apply(this, arguments);
      }

      LinterPane.content = function() {
        return this.div({
          "class": 'panel-body padded'
        }, (function(_this) {
          return function() {
            _this.div({
              "class": 'block input-label align'
            }, function() {
              _this.input({
                "class": 'input-checkbox',
                id: 'no_trace',
                type: 'checkbox'
              });
              return _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Disable Trace');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Do not send stack traces to Linter');
                });
              });
            });
            return _this.div({
              "class": 'block input-label align'
            }, function() {
              _this.input({
                "class": 'input-checkbox',
                id: 'immediate',
                type: 'checkbox'
              });
              return _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Trigger immediately');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Display linter messages immediately (Only useful for larger builds / debugging processes)');
                });
              });
            });
          };
        })(this));
      };

      LinterPane.prototype.set = function(command) {
        var _ref;
        if ((command != null ? command.output.linter : void 0) != null) {
          this.find('#no_trace').prop('checked', command.output.linter.no_trace);
          return this.find('#immediate').prop('checked', (_ref = command.output.linter.immediate) != null ? _ref : false);
        } else {
          this.find('#no_trace').prop('checked', false);
          return this.find('#immediate').prop('checked', false);
        }
      };

      LinterPane.prototype.get = function(command) {
        var _base;
        if ((_base = command.output).linter == null) {
          _base.linter = {};
        }
        command.output.linter.no_trace = this.find('#no_trace').prop('checked');
        command.output.linter.immediate = this.find('#immediate').prop('checked');
        return null;
      };

      return LinterPane;

    })(View),
    info: LinterInfoPane = (function() {
      function LinterInfoPane(command) {
        var keys, value, values;
        this.element = document.createElement('div');
        this.element.classList.add('module');
        keys = document.createElement('div');
        keys.innerHTML = '<div class="text-padded">Disable stack traces:</div>\n<div class="text-padded">Fast messages:</div>';
        values = document.createElement('div');
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command.output.linter.no_trace);
        values.appendChild(value);
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command.output.linter.immediate);
        values.appendChild(value);
        this.element.appendChild(keys);
        this.element.appendChild(values);
      }

      return LinterInfoPane;

    })(),
    output: Linter = (function() {
      function Linter() {}

      Linter.prototype.newQueue = function(queue) {
        this.queue = queue;
        ll.messages = [];
        return coordinates = {};
      };

      Linter.prototype.newCommand = function(command) {
        this.command = command;
      };

      Linter.prototype.stdout_linter = function(message) {
        if (atom.inSpecMode()) {
          return ll.messages.push(message);
        }
        if (coordinates[message.filePath + ':' + message.range[0][0]] != null) {
          return;
        }
        coordinates[message.filePath + ':' + message.range[0][0]] = true;
        if (this.command.output.linter.no_trace) {
          message.trace = null;
        }
        ll.messages.push(message);
        if (this.command.output.linter.immediate) {
          return exitQueue(0);
        }
      };

      Linter.prototype.stderr_linter = function(message) {
        if (atom.inSpecMode()) {
          return ll.messages.push(message);
        }
        if (coordinates[message.filePath + ':' + message.range[0][0]] != null) {
          return;
        }
        coordinates[message.filePath + ':' + message.range[0][0]] = true;
        if (this.command.output.linter.no_trace) {
          message.trace = null;
        }
        ll.messages.push(message);
        if (this.command.output.linter.immediate) {
          return exitQueue(0);
        }
      };

      Linter.prototype.exitQueue = function(code) {
        return atom.commands.dispatch(atom.views.getView(atom.workspace), 'linter:lint');
      };

      return Linter;

    })()
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9vdXRwdXQvbGludGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5REFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxnQkFBUixDQUFMLENBQUE7O0FBQUEsRUFFQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBRkQsQ0FBQTs7QUFBQSxFQUlBLFdBQUEsR0FBYyxFQUpkLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLElBQ0EsV0FBQSxFQUFhLHNDQURiO0FBQUEsSUFFQSxTQUFBLEVBQVMsS0FGVDtBQUFBLElBSUEsSUFBQSxFQUNRO0FBQ0osbUNBQUEsQ0FBQTs7OztPQUFBOztBQUFBLE1BQUEsVUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7ZUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsVUFBQSxPQUFBLEVBQU8sbUJBQVA7U0FBTCxFQUFpQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUMvQixZQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyx5QkFBUDthQUFMLEVBQXVDLFNBQUEsR0FBQTtBQUNyQyxjQUFBLEtBQUMsQ0FBQSxLQUFELENBQU87QUFBQSxnQkFBQSxPQUFBLEVBQU8sZ0JBQVA7QUFBQSxnQkFBeUIsRUFBQSxFQUFJLFVBQTdCO0FBQUEsZ0JBQXlDLElBQUEsRUFBTSxVQUEvQztlQUFQLENBQUEsQ0FBQTtxQkFDQSxLQUFDLENBQUEsS0FBRCxDQUFPLFNBQUEsR0FBQTtBQUNMLGdCQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxrQkFB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

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/output/linter.coffee
