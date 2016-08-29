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
              "class": 'block checkbox'
            }, function() {
              _this.input({
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
              "class": 'block checkbox'
            }, function() {
              _this.input({
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9vdXRwdXQvbGludGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5REFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxnQkFBUixDQUFMLENBQUE7O0FBQUEsRUFFQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBRkQsQ0FBQTs7QUFBQSxFQUlBLFdBQUEsR0FBYyxFQUpkLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLElBQ0EsV0FBQSxFQUFhLHNDQURiO0FBQUEsSUFFQSxTQUFBLEVBQVMsS0FGVDtBQUFBLElBSUEsSUFBQSxFQUNRO0FBQ0osbUNBQUEsQ0FBQTs7OztPQUFBOztBQUFBLE1BQUEsVUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7ZUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsVUFBQSxPQUFBLEVBQU8sbUJBQVA7U0FBTCxFQUFpQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUMvQixZQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxnQkFBUDthQUFMLEVBQThCLFNBQUEsR0FBQTtBQUM1QixjQUFBLEtBQUMsQ0FBQSxLQUFELENBQU87QUFBQSxnQkFBQSxFQUFBLEVBQUksVUFBSjtBQUFBLGdCQUFnQixJQUFBLEVBQU0sVUFBdEI7ZUFBUCxDQUFBLENBQUE7cUJBQ0EsS0FBQyxDQUFBLEtBQUQsQ0FBTyxTQUFBLEdBQUE7QUFDTCxnQkFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsa0JBQUEsT0FBQSxFQUFPLGVBQVA7aUJBQUwsRUFBNkIsZUFBN0IsQ0FBQSxDQUFBO3VCQUNBLEtBQUMsQ0FBQSxHQUFELENBQUssU0FBQSxHQUFBO3lCQUNILEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxvQkFBQSxPQUFBLEVBQU8sMEJBQVA7bUJBQU4sRUFBeUMsb0NBQXpDLEVBREc7Z0JBQUEsQ0FBTCxFQUZLO2NBQUEsQ0FBUCxFQUY0QjtZQUFBLENBQTlCLENBQUEsQ0FBQTttQkFNQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sZ0JBQVA7YUFBTCxFQUE4QixTQUFBLEdBQUE7QUFDNUIsY0FBQSxLQUFDLENBQUEsS0FBRCxDQUFPO0FBQUEsZ0JBQUEsRUFBQSxFQUFJLFdBQUo7QUFBQSxnQkFBaUIsSUFBQSxFQUFNLFVBQXZCO2VBQVAsQ0FBQSxDQUFBO3FCQUNBLEtBQUMsQ0FBQSxLQUFELENBQU8sU0FBQSxHQUFBO0FBQ0wsZ0JBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGtCQUFBLE9BQUEsRUFBTyxlQUFQO2lCQUFMLEVBQTZCLHFCQUE3QixDQUFBLENBQUE7dUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFBLEdBQUE7eUJBQ0gsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLG9CQUFBLE9BQUEsRUFBTywwQkFBUDttQkFBTixFQUF5QywyRkFBekMsRUFERztnQkFBQSxDQUFMLEVBRks7Y0FBQSxDQUFQLEVBRjRCO1lBQUEsQ0FBOUIsRUFQK0I7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQyxFQURRO01BQUEsQ0FBVixDQUFBOztBQUFBLDJCQWVBLEdBQUEsR0FBSyxTQUFDLE9BQUQsR0FBQTtBQUNILFlBQUEsSUFBQTtBQUFBLFFBQUEsSUFBRywwREFBSDtBQUNFLFVBQUEsSUFBQyxDQUFBLElBQUQsQ0FBTSxXQUFOLENBQWtCLENBQUMsSUFBbkIsQ0FBd0IsU0FBeEIsRUFBbUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBekQsQ0FBQSxDQUFBO2lCQUNBLElBQUMsQ0FBQSxJQUFELENBQU0sWUFBTixDQUFtQixDQUFDLElBQXBCLENBQXlCLFNBQXpCLDREQUFzRSxLQUF0RSxFQUZGO1NBQUEsTUFBQTtBQUlFLFVBQUEsSUFBQyxDQUFBLElBQUQsQ0FBTSxXQUFOLENBQWtCLENBQUMsSUFBbkIsQ0FBd0IsU0FBeEIsRUFBbUMsS0FBbkMsQ0FBQSxDQUFBO2lCQUNBLElBQUMsQ0FBQSxJQUFELENBQU0sWUFBTixDQUFtQixDQUFDLElBQXBCLENBQXlCLFNBQXpCLEVBQW9DLEtBQXBDLEVBTEY7U0FERztNQUFBLENBZkwsQ0FBQTs7QUFBQSwyQkF1QkEsR0FBQSxHQUFLLFNBQUMsT0FBRCxHQUFBO0FBQ0gsWUFBQSxLQUFBOztlQUFjLENBQUMsU0FBVTtTQUF6QjtBQUFBLFFBQ0EsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBdEIsR0FBaUMsSUFBQyxDQUFBLElBQUQsQ0FBTSxXQUFOLENBQWtCLENBQUMsSUFBbkIsQ0FBd0IsU0FBeEIsQ0FEakMsQ0FBQTtBQUFBLFFBRUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBdEIsR0FBa0MsSUFBQyxDQUFBLElBQUQsQ0FBTSxZQUFOLENBQW1CLENBQUMsSUFBcEIsQ0FBeUIsU0FBekIsQ0FGbEMsQ0FBQTtBQUdBLGVBQU8sSUFBUCxDQUpHO01BQUEsQ0F2QkwsQ0FBQTs7d0JBQUE7O09BRHVCLEtBTDNCO0FBQUEsSUFtQ0EsSUFBQSxFQUNRO0FBRVMsTUFBQSx3QkFBQyxPQUFELEdBQUE7QUFDWCxZQUFBLG1CQUFBO0FBQUEsUUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQVgsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsUUFBdkIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxJQUFBLEdBQU8sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FGUCxDQUFBO0FBQUEsUUFHQSxJQUFJLENBQUMsU0FBTCxHQUFpQixxR0FIakIsQ0FBQTtBQUFBLFFBT0EsTUFBQSxHQUFTLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBUFQsQ0FBQTtBQUFBLFFBUUEsS0FBQSxHQUFRLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBUlIsQ0FBQTtBQUFBLFFBU0EsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFoQixDQUFvQixhQUFwQixDQVRBLENBQUE7QUFBQSxRQVVBLEtBQUssQ0FBQyxTQUFOLEdBQWtCLE1BQUEsQ0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUE3QixDQVZsQixDQUFBO0FBQUEsUUFXQSxNQUFNLENBQUMsV0FBUCxDQUFtQixLQUFuQixDQVhBLENBQUE7QUFBQSxRQVlBLEtBQUEsR0FBUSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQVpSLENBQUE7QUFBQSxRQWFBLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBaEIsQ0FBb0IsYUFBcEIsQ0FiQSxDQUFBO0FBQUEsUUFjQSxLQUFLLENBQUMsU0FBTixHQUFrQixNQUFBLENBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBN0IsQ0FkbEIsQ0FBQTtBQUFBLFFBZUEsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsS0FBbkIsQ0FmQSxDQUFBO0FBQUEsUUFnQkEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxXQUFULENBQXFCLElBQXJCLENBaEJBLENBQUE7QUFBQSxRQWlCQSxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsQ0FBcUIsTUFBckIsQ0FqQkEsQ0FEVztNQUFBLENBQWI7OzRCQUFBOztRQXRDSjtBQUFBLElBMERBLE1BQUEsRUFDUTswQkFFSjs7QUFBQSx1QkFBQSxRQUFBLEdBQVUsU0FBRSxLQUFGLEdBQUE7QUFDUixRQURTLElBQUMsQ0FBQSxRQUFBLEtBQ1YsQ0FBQTtBQUFBLFFBQUEsRUFBRSxDQUFDLFFBQUgsR0FBYyxFQUFkLENBQUE7ZUFDQSxXQUFBLEdBQWMsR0FGTjtNQUFBLENBQVYsQ0FBQTs7QUFBQSx1QkFJQSxVQUFBLEdBQVksU0FBRSxPQUFGLEdBQUE7QUFBWSxRQUFYLElBQUMsQ0FBQSxVQUFBLE9BQVUsQ0FBWjtNQUFBLENBSlosQ0FBQTs7QUFBQSx1QkFNQSxhQUFBLEdBQWUsU0FBQyxPQUFELEdBQUE7QUFDYixRQUFBLElBQW1DLElBQUksQ0FBQyxVQUFMLENBQUEsQ0FBbkM7QUFBQSxpQkFBTyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQVosQ0FBaUIsT0FBakIsQ0FBUCxDQUFBO1NBQUE7QUFDQSxRQUFBLElBQVUsaUVBQVY7QUFBQSxnQkFBQSxDQUFBO1NBREE7QUFBQSxRQUVBLFdBQVksQ0FBQSxPQUFPLENBQUMsUUFBUixHQUFtQixHQUFuQixHQUF5QixPQUFPLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBMUMsQ0FBWixHQUE0RCxJQUY1RCxDQUFBO0FBR0EsUUFBQSxJQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUExQjtBQUNFLFVBQUEsT0FBTyxDQUFDLEtBQVIsR0FBZ0IsSUFBaEIsQ0FERjtTQUhBO0FBQUEsUUFLQSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQVosQ0FBaUIsT0FBakIsQ0FMQSxDQUFBO0FBTUEsUUFBQSxJQUFnQixJQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBdkM7aUJBQUEsU0FBQSxDQUFVLENBQVYsRUFBQTtTQVBhO01BQUEsQ0FOZixDQUFBOztBQUFBLHVCQWVBLGFBQUEsR0FBZSxTQUFDLE9BQUQsR0FBQTtBQUNiLFFBQUEsSUFBbUMsSUFBSSxDQUFDLFVBQUwsQ0FBQSxDQUFuQztBQUFBLGlCQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBWixDQUFpQixPQUFqQixDQUFQLENBQUE7U0FBQTtBQUNBLFFBQUEsSUFBVSxpRUFBVjtBQUFBLGdCQUFBLENBQUE7U0FEQTtBQUFBLFFBRUEsV0FBWSxDQUFBLE9BQU8sQ0FBQyxRQUFSLEdBQW1CLEdBQW5CLEdBQXlCLE9BQU8sQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUExQyxDQUFaLEdBQTRELElBRjVELENBQUE7QUFHQSxRQUFBLElBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQTFCO0FBQ0UsVUFBQSxPQUFPLENBQUMsS0FBUixHQUFnQixJQUFoQixDQURGO1NBSEE7QUFBQSxRQUtBLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBWixDQUFpQixPQUFqQixDQUxBLENBQUE7QUFNQSxRQUFBLElBQWdCLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUF2QztpQkFBQSxTQUFBLENBQVUsQ0FBVixFQUFBO1NBUGE7TUFBQSxDQWZmLENBQUE7O0FBQUEsdUJBd0JBLFNBQUEsR0FBVyxTQUFDLElBQUQsR0FBQTtlQUNULElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQXZCLEVBQTJELGFBQTNELEVBRFM7TUFBQSxDQXhCWCxDQUFBOztvQkFBQTs7UUE3REo7R0FSRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/output/linter.coffee
