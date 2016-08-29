(function() {
  var Log, LogInfoPane, LogPane, TextEditorView, View, fs, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), View = _ref.View, TextEditorView = _ref.TextEditorView;

  fs = null;

  path = null;

  module.exports = {
    name: 'Log File',
    description: 'Write command output to log file',
    "private": false,
    activate: function() {
      fs = require('fs');
      return path = require('path');
    },
    deactivate: function() {
      fs = null;
      return path = null;
    },
    edit: LogPane = (function(_super) {
      __extends(LogPane, _super);

      function LogPane() {
        return LogPane.__super__.constructor.apply(this, arguments);
      }

      LogPane.content = function() {
        return this.div({
          "class": 'panel-body padded'
        }, (function(_this) {
          return function() {
            _this.div({
              "class": 'block'
            }, function() {
              _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'File Path');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'File path (absolute or relative)');
                });
              });
              return _this.subview('file_path', new TextEditorView({
                mini: true,
                placeholderText: 'Default: output.log'
              }));
            });
            return _this.div({
              "class": 'block checkbox'
            }, function() {
              _this.input({
                id: 'all_in_one',
                type: 'checkbox'
              });
              return _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Log output to one file per queue');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Print output of all commands of the queue to this file');
                });
              });
            });
          };
        })(this));
      };

      LogPane.prototype.set = function(command) {
        var _ref1, _ref2, _ref3;
        if ((command != null ? (_ref1 = command.output) != null ? _ref1.file : void 0 : void 0) != null) {
          this.file_path.getModel().setText((_ref2 = command.output.file.path) != null ? _ref2 : '');
          return this.find('#all_in_one').prop('checked', (_ref3 = command.output.file.queue_in_file) != null ? _ref3 : true);
        } else {
          this.file_path.getModel().setText('');
          return this.find('#all_in_one').prop('checked', true);
        }
      };

      LogPane.prototype.get = function(command) {
        var out, _base;
        if ((out = this.file_path.getModel().getText()) === '') {
          out = 'output.log';
        }
        if ((_base = command.output).file == null) {
          _base.file = {};
        }
        command.output.file.path = out;
        command.output.file.queue_in_file = this.find('#all_in_one').prop('checked');
        return null;
      };

      return LogPane;

    })(View),
    info: LogInfoPane = (function() {
      function LogInfoPane(command) {
        var keys, value, values;
        this.element = document.createElement('div');
        this.element.classList.add('module');
        keys = document.createElement('div');
        keys.innerHTML = '<div class="text-padded">Log path:</div>\n<div class="text-padded">Write queue to file:</div>';
        values = document.createElement('div');
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command.output.file.path);
        values.appendChild(value);
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command.output.file.queue_in_file);
        values.appendChild(value);
        this.element.appendChild(keys);
        this.element.appendChild(values);
      }

      return LogInfoPane;

    })(),
    output: Log = (function() {
      function Log() {}

      Log.prototype.newQueue = function(queue) {
        var c, _path, _ref1;
        this.fd = null;
        this.shared_fd = false;
        if ((_ref1 = (c = queue.queue[queue.queue.length - 1]).output.file) != null ? _ref1.queue_in_file : void 0) {
          this.shared_fd = true;
          _path = path.resolve(c.project, c.output.file.path);
          this.fd = null;
          return this.fd = fs.createWriteStream(_path);
        }
      };

      Log.prototype.newCommand = function(command) {
        var _path;
        if (this.shared_fd) {
          return;
        }
        _path = path.resolve(command.project, command.output.file.path);
        this.fd = null;
        return this.fd = fs.createWriteStream(_path);
      };

      Log.prototype.stdout_in = function(_arg) {
        var input;
        input = _arg.input;
        return this.fd.write(input + '\n');
      };

      Log.prototype.stderr_in = function(_arg) {
        var input;
        input = _arg.input;
        return this.fd.write(input + '\n');
      };

      Log.prototype.exitCommand = function() {
        if (!this.shared_fd) {
          return this.fd.end();
        }
      };

      Log.prototype.exitQueue = function() {
        if (this.shared_fd) {
          return this.fd.end();
        }
      };

      return Log;

    })()
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9vdXRwdXQvZmlsZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0RBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQXlCLE9BQUEsQ0FBUSxzQkFBUixDQUF6QixFQUFDLFlBQUEsSUFBRCxFQUFPLHNCQUFBLGNBQVAsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxJQUZMLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sSUFIUCxDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsSUFBQSxFQUFNLFVBQU47QUFBQSxJQUNBLFdBQUEsRUFBYSxrQ0FEYjtBQUFBLElBRUEsU0FBQSxFQUFTLEtBRlQ7QUFBQSxJQUlBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixNQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7YUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsRUFGQztJQUFBLENBSlY7QUFBQSxJQVFBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixNQUFBLEVBQUEsR0FBSyxJQUFMLENBQUE7YUFDQSxJQUFBLEdBQU8sS0FGRztJQUFBLENBUlo7QUFBQSxJQVlBLElBQUEsRUFDUTtBQUVKLGdDQUFBLENBQUE7Ozs7T0FBQTs7QUFBQSxNQUFBLE9BQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2VBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFVBQUEsT0FBQSxFQUFPLG1CQUFQO1NBQUwsRUFBaUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDL0IsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sT0FBUDthQUFMLEVBQXFCLFNBQUEsR0FBQTtBQUNuQixjQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sU0FBQSxHQUFBO0FBQ0wsZ0JBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGtCQUFBLE9BQUEsRUFBTyxlQUFQO2lCQUFMLEVBQTZCLFdBQTdCLENBQUEsQ0FBQTt1QkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUEsR0FBQTt5QkFDSCxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsb0JBQUEsT0FBQSxFQUFPLDBCQUFQO21CQUFOLEVBQXlDLGtDQUF6QyxFQURHO2dCQUFBLENBQUwsRUFGSztjQUFBLENBQVAsQ0FBQSxDQUFBO3FCQUlBLEtBQUMsQ0FBQSxPQUFELENBQVMsV0FBVCxFQUEwQixJQUFBLGNBQUEsQ0FBZTtBQUFBLGdCQUFBLElBQUEsRUFBTSxJQUFOO0FBQUEsZ0JBQVksZUFBQSxFQUFpQixxQkFBN0I7ZUFBZixDQUExQixFQUxtQjtZQUFBLENBQXJCLENBQUEsQ0FBQTttQkFNQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sZ0JBQVA7YUFBTCxFQUE4QixTQUFBLEdBQUE7QUFDNUIsY0FBQSxLQUFDLENBQUEsS0FBRCxDQUFPO0FBQUEsZ0JBQUEsRUFBQSxFQUFJLFlBQUo7QUFBQSxnQkFBa0IsSUFBQSxFQUFNLFVBQXhCO2VBQVAsQ0FBQSxDQUFBO3FCQUNBLEtBQUMsQ0FBQSxLQUFELENBQU8sU0FBQSxHQUFBO0FBQ0wsZ0JBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGtCQUFBLE9BQUEsRUFBTyxlQUFQO2lCQUFMLEVBQTZCLGtDQUE3QixDQUFBLENBQUE7dUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFBLEdBQUE7eUJBQ0gsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLG9CQUFBLE9BQUEsRUFBTywwQkFBUDttQkFBTixFQUF5Qyx3REFBekMsRUFERztnQkFBQSxDQUFMLEVBRks7Y0FBQSxDQUFQLEVBRjRCO1lBQUEsQ0FBOUIsRUFQK0I7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQyxFQURRO01BQUEsQ0FBVixDQUFBOztBQUFBLHdCQWVBLEdBQUEsR0FBSyxTQUFDLE9BQUQsR0FBQTtBQUNILFlBQUEsbUJBQUE7QUFBQSxRQUFBLElBQUcsMkZBQUg7QUFDRSxVQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsUUFBWCxDQUFBLENBQXFCLENBQUMsT0FBdEIsc0RBQXlELEVBQXpELENBQUEsQ0FBQTtpQkFDQSxJQUFDLENBQUEsSUFBRCxDQUFNLGFBQU4sQ0FBb0IsQ0FBQyxJQUFyQixDQUEwQixTQUExQixnRUFBeUUsSUFBekUsRUFGRjtTQUFBLE1BQUE7QUFJRSxVQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsUUFBWCxDQUFBLENBQXFCLENBQUMsT0FBdEIsQ0FBOEIsRUFBOUIsQ0FBQSxDQUFBO2lCQUNBLElBQUMsQ0FBQSxJQUFELENBQU0sYUFBTixDQUFvQixDQUFDLElBQXJCLENBQTBCLFNBQTFCLEVBQXFDLElBQXJDLEVBTEY7U0FERztNQUFBLENBZkwsQ0FBQTs7QUFBQSx3QkF1QkEsR0FBQSxHQUFLLFNBQUMsT0FBRCxHQUFBO0FBQ0gsWUFBQSxVQUFBO0FBQUEsUUFBQSxJQUFzQixDQUFDLEdBQUEsR0FBTSxJQUFDLENBQUEsU0FBUyxDQUFDLFFBQVgsQ0FBQSxDQUFxQixDQUFDLE9BQXRCLENBQUEsQ0FBUCxDQUFBLEtBQTJDLEVBQWpFO0FBQUEsVUFBQSxHQUFBLEdBQU0sWUFBTixDQUFBO1NBQUE7O2VBQ2MsQ0FBQyxPQUFRO1NBRHZCO0FBQUEsUUFFQSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFwQixHQUEyQixHQUYzQixDQUFBO0FBQUEsUUFHQSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFwQixHQUFvQyxJQUFDLENBQUEsSUFBRCxDQUFNLGFBQU4sQ0FBb0IsQ0FBQyxJQUFyQixDQUEwQixTQUExQixDQUhwQyxDQUFBO0FBSUEsZUFBTyxJQUFQLENBTEc7TUFBQSxDQXZCTCxDQUFBOztxQkFBQTs7T0FGb0IsS0FieEI7QUFBQSxJQTZDQSxJQUFBLEVBQ1E7QUFFUyxNQUFBLHFCQUFDLE9BQUQsR0FBQTtBQUNYLFlBQUEsbUJBQUE7QUFBQSxRQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBWCxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixRQUF2QixDQURBLENBQUE7QUFBQSxRQUVBLElBQUEsR0FBTyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUZQLENBQUE7QUFBQSxRQUdBLElBQUksQ0FBQyxTQUFMLEdBQWlCLCtGQUhqQixDQUFBO0FBQUEsUUFPQSxNQUFBLEdBQVMsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FQVCxDQUFBO0FBQUEsUUFRQSxLQUFBLEdBQVEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FSUixDQUFBO0FBQUEsUUFTQSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQWhCLENBQW9CLGFBQXBCLENBVEEsQ0FBQTtBQUFBLFFBVUEsS0FBSyxDQUFDLFNBQU4sR0FBa0IsTUFBQSxDQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQTNCLENBVmxCLENBQUE7QUFBQSxRQVdBLE1BQU0sQ0FBQyxXQUFQLENBQW1CLEtBQW5CLENBWEEsQ0FBQTtBQUFBLFFBWUEsS0FBQSxHQUFRLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBWlIsQ0FBQTtBQUFBLFFBYUEsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFoQixDQUFvQixhQUFwQixDQWJBLENBQUE7QUFBQSxRQWNBLEtBQUssQ0FBQyxTQUFOLEdBQWtCLE1BQUEsQ0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUEzQixDQWRsQixDQUFBO0FBQUEsUUFlQSxNQUFNLENBQUMsV0FBUCxDQUFtQixLQUFuQixDQWZBLENBQUE7QUFBQSxRQWdCQSxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsQ0FBcUIsSUFBckIsQ0FoQkEsQ0FBQTtBQUFBLFFBaUJBLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixNQUFyQixDQWpCQSxDQURXO01BQUEsQ0FBYjs7eUJBQUE7O1FBaERKO0FBQUEsSUFvRUEsTUFBQSxFQUNRO3VCQUNKOztBQUFBLG9CQUFBLFFBQUEsR0FBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLFlBQUEsZUFBQTtBQUFBLFFBQUEsSUFBQyxDQUFBLEVBQUQsR0FBTSxJQUFOLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxTQUFELEdBQWEsS0FEYixDQUFBO0FBRUEsUUFBQSxtRkFBd0QsQ0FBRSxzQkFBMUQ7QUFDRSxVQUFBLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBYixDQUFBO0FBQUEsVUFDQSxLQUFBLEdBQVEsSUFBSSxDQUFDLE9BQUwsQ0FBYSxDQUFDLENBQUMsT0FBZixFQUF3QixDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUF0QyxDQURSLENBQUE7QUFBQSxVQUVBLElBQUMsQ0FBQSxFQUFELEdBQU0sSUFGTixDQUFBO2lCQUdBLElBQUMsQ0FBQSxFQUFELEdBQU0sRUFBRSxDQUFDLGlCQUFILENBQXFCLEtBQXJCLEVBSlI7U0FIUTtNQUFBLENBQVYsQ0FBQTs7QUFBQSxvQkFTQSxVQUFBLEdBQVksU0FBQyxPQUFELEdBQUE7QUFDVixZQUFBLEtBQUE7QUFBQSxRQUFBLElBQVUsSUFBQyxDQUFBLFNBQVg7QUFBQSxnQkFBQSxDQUFBO1NBQUE7QUFBQSxRQUNBLEtBQUEsR0FBUSxJQUFJLENBQUMsT0FBTCxDQUFhLE9BQU8sQ0FBQyxPQUFyQixFQUE4QixPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFsRCxDQURSLENBQUE7QUFBQSxRQUVBLElBQUMsQ0FBQSxFQUFELEdBQU0sSUFGTixDQUFBO2VBR0EsSUFBQyxDQUFBLEVBQUQsR0FBTSxFQUFFLENBQUMsaUJBQUgsQ0FBcUIsS0FBckIsRUFKSTtNQUFBLENBVFosQ0FBQTs7QUFBQSxvQkFlQSxTQUFBLEdBQVcsU0FBQyxJQUFELEdBQUE7QUFDVCxZQUFBLEtBQUE7QUFBQSxRQURXLFFBQUQsS0FBQyxLQUNYLENBQUE7ZUFBQSxJQUFDLENBQUEsRUFBRSxDQUFDLEtBQUosQ0FBVSxLQUFBLEdBQVEsSUFBbEIsRUFEUztNQUFBLENBZlgsQ0FBQTs7QUFBQSxvQkFrQkEsU0FBQSxHQUFXLFNBQUMsSUFBRCxHQUFBO0FBQ1QsWUFBQSxLQUFBO0FBQUEsUUFEVyxRQUFELEtBQUMsS0FDWCxDQUFBO2VBQUEsSUFBQyxDQUFBLEVBQUUsQ0FBQyxLQUFKLENBQVUsS0FBQSxHQUFRLElBQWxCLEVBRFM7TUFBQSxDQWxCWCxDQUFBOztBQUFBLG9CQXFCQSxXQUFBLEdBQWEsU0FBQSxHQUFBO0FBQ1gsUUFBQSxJQUFBLENBQUEsSUFBa0IsQ0FBQSxTQUFsQjtpQkFBQSxJQUFDLENBQUEsRUFBRSxDQUFDLEdBQUosQ0FBQSxFQUFBO1NBRFc7TUFBQSxDQXJCYixDQUFBOztBQUFBLG9CQXdCQSxTQUFBLEdBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxJQUFhLElBQUMsQ0FBQSxTQUFkO2lCQUFBLElBQUMsQ0FBQSxFQUFFLENBQUMsR0FBSixDQUFBLEVBQUE7U0FEUztNQUFBLENBeEJYLENBQUE7O2lCQUFBOztRQXRFSjtHQVBGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/output/file.coffee
