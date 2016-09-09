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
              "class": 'block input-label align'
            }, function() {
              _this.input({
                "class": 'input-checkbox',
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9vdXRwdXQvZmlsZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0RBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQXlCLE9BQUEsQ0FBUSxzQkFBUixDQUF6QixFQUFDLFlBQUEsSUFBRCxFQUFPLHNCQUFBLGNBQVAsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxJQUZMLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sSUFIUCxDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsSUFBQSxFQUFNLFVBQU47QUFBQSxJQUNBLFdBQUEsRUFBYSxrQ0FEYjtBQUFBLElBRUEsU0FBQSxFQUFTLEtBRlQ7QUFBQSxJQUlBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixNQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7YUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsRUFGQztJQUFBLENBSlY7QUFBQSxJQVFBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixNQUFBLEVBQUEsR0FBSyxJQUFMLENBQUE7YUFDQSxJQUFBLEdBQU8sS0FGRztJQUFBLENBUlo7QUFBQSxJQVlBLElBQUEsRUFDUTtBQUVKLGdDQUFBLENBQUE7Ozs7T0FBQTs7QUFBQSxNQUFBLE9BQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2VBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFVBQUEsT0FBQSxFQUFPLG1CQUFQO1NBQUwsRUFBaUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDL0IsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sT0FBUDthQUFMLEVB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

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/output/file.coffee
