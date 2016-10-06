(function() {
  var Buffer, BufferInfoPane, BufferPane, View, buffers,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  buffers = {};

  module.exports = {
    name: 'Text Buffer',
    description: 'Display command output in unnamed text buffer',
    "private": false,
    activate: function() {
      return buffers = {};
    },
    deactivate: function() {
      return buffers = {};
    },
    edit: BufferPane = (function(_super) {
      __extends(BufferPane, _super);

      function BufferPane() {
        return BufferPane.__super__.constructor.apply(this, arguments);
      }

      BufferPane.content = function() {
        return this.div({
          "class": 'panel-body padded'
        }, (function(_this) {
          return function() {
            _this.div({
              "class": 'block input-label align'
            }, function() {
              _this.input({
                "class": 'input-checkbox',
                id: 'recycle_buffer',
                type: 'checkbox'
              });
              return _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Recycle editor tab');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Re-use the same buffer');
                });
              });
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
                }, 'Execute Queue in one buffer');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Print output of all commands of the queue in one buffer');
                });
              });
            });
          };
        })(this));
      };

      BufferPane.prototype.set = function(command) {
        var _ref, _ref1;
        if ((command != null ? (_ref = command.output) != null ? _ref.buffer : void 0 : void 0) != null) {
          this.find('#recycle_buffer').prop('checked', command.output.buffer.recycle_buffer);
          return this.find('#all_in_one').prop('checked', (_ref1 = command.output.buffer.queue_in_buffer) != null ? _ref1 : true);
        } else {
          this.find('#recycle_buffer').prop('checked', true);
          return this.find('#all_in_one').prop('checked', true);
        }
      };

      BufferPane.prototype.get = function(command) {
        var _base;
        if ((_base = command.output).buffer == null) {
          _base.buffer = {};
        }
        command.output.buffer.recycle_buffer = this.find('#recycle_buffer').prop('checked');
        command.output.buffer.queue_in_buffer = this.find('#all_in_one').prop('checked');
        return null;
      };

      return BufferPane;

    })(View),
    info: BufferInfoPane = (function() {
      function BufferInfoPane(command) {
        var keys, value, values;
        this.element = document.createElement('div');
        this.element.classList.add('module');
        keys = document.createElement('div');
        keys.innerHTML = '<div class="text-padded">Recycle Buffer:</div>\n<div class="text-padded">Execute queue in one buffer:</div>';
        values = document.createElement('div');
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command.output.buffer.recycle_buffer);
        values.appendChild(value);
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command.output.buffer.queue_in_buffer);
        values.appendChild(value);
        this.element.appendChild(keys);
        this.element.appendChild(values);
      }

      return BufferInfoPane;

    })(),
    output: Buffer = (function() {
      function Buffer() {}

      Buffer.prototype.newQueue = function(queue) {
        var command, _name, _ref;
        this.buffer = null;
        this.p = null;
        this.queue_in_buffer = (_ref = queue.queue[queue.queue.length - 1].output.buffer) != null ? _ref.queue_in_buffer : void 0;
        if (this.queue_in_buffer) {
          if ((command = queue.queue[queue.queue.length - 1]).output.buffer.recycle_buffer) {
            if (buffers[_name = command.project] == null) {
              buffers[_name] = {};
            }
            if ((this.buffer = buffers[command.project][command.name]) != null) {
              return this.buffer.setText('');
            } else {
              return (this.p = atom.workspace.open(null)).then((function(_this) {
                return function(buffer) {
                  _this.buffer = buffer;
                  buffers[command.project][command.name] = _this.buffer;
                  _this.buffer.onDidDestroy(function() {
                    var _ref1;
                    _this.buffer = null;
                    return (_ref1 = buffers[command.project]) != null ? _ref1[command.name] = null : void 0;
                  });
                  return _this.p = null;
                };
              })(this));
            }
          } else {
            return (this.p = atom.workspace.open(null)).then((function(_this) {
              return function(buffer) {
                _this.buffer = buffer;
                _this.p = null;
                return _this.buffer.onDidDestroy(function() {
                  return _this.buffer = null;
                });
              };
            })(this));
          }
        }
      };

      Buffer.prototype.newCommand = function(command) {
        var _name;
        if (this.queue_in_buffer) {
          return;
        }
        this.buffer = null;
        if (command.output.buffer.recycle_buffer) {
          if (buffers[_name = command.project] == null) {
            buffers[_name] = {};
          }
          if ((this.buffer = buffers[command.project][command.name]) != null) {
            return this.buffer.setText('');
          } else {
            return (this.p = atom.workspace.open(null)).then((function(_this) {
              return function(buffer) {
                _this.buffer = buffer;
                buffers[command.project][command.name] = _this.buffer;
                _this.buffer.onDidDestroy(function() {
                  var _ref;
                  _this.buffer = null;
                  return (_ref = buffers[command.project]) != null ? _ref[command.name] = null : void 0;
                });
                return _this.p = null;
              };
            })(this));
          }
        } else {
          return (this.p = atom.workspace.open(null)).then((function(_this) {
            return function(buffer) {
              _this.buffer = buffer;
              _this.p = null;
              return _this.buffer.onDidDestroy(function() {
                return _this.buffer = null;
              });
            };
          })(this));
        }
      };

      Buffer.prototype.stdout_in = function(_arg) {
        var input, _ref;
        input = _arg.input;
        if (this.p != null) {
          return this.p.then((function(_this) {
            return function(buffer) {
              var _ref;
              _this.buffer = buffer;
              _this.p = null;
              return (_ref = _this.buffer) != null ? _ref.insertText(input + '\n') : void 0;
            };
          })(this));
        } else {
          return (_ref = this.buffer) != null ? _ref.insertText(input + '\n') : void 0;
        }
      };

      Buffer.prototype.stderr_in = function(_arg) {
        var input, _ref;
        input = _arg.input;
        if (this.p != null) {
          return this.p.then((function(_this) {
            return function(buffer) {
              var _ref;
              _this.buffer = buffer;
              _this.p = null;
              return (_ref = _this.buffer) != null ? _ref.insertText(input + '\n') : void 0;
            };
          })(this));
        } else {
          return (_ref = this.buffer) != null ? _ref.insertText(input + '\n') : void 0;
        }
      };

      return Buffer;

    })(),
    getBuffers: function() {
      return buffers;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9vdXRwdXQvYnVmZmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpREFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQVUsRUFGVixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsSUFBQSxFQUFNLGFBQU47QUFBQSxJQUNBLFdBQUEsRUFBYSwrQ0FEYjtBQUFBLElBRUEsU0FBQSxFQUFTLEtBRlQ7QUFBQSxJQUlBLFFBQUEsRUFBVSxTQUFBLEdBQUE7YUFDUixPQUFBLEdBQVUsR0FERjtJQUFBLENBSlY7QUFBQSxJQU9BLFVBQUEsRUFBWSxTQUFBLEdBQUE7YUFDVixPQUFBLEdBQVUsR0FEQTtJQUFBLENBUFo7QUFBQSxJQVVBLElBQUEsRUFDUTtBQUVKLG1DQUFBLENBQUE7Ozs7T0FBQTs7QUFBQSxNQUFBLFVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2VBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFVBQUEsT0FBQSxFQUFPLG1CQUFQO1NBQUwsRUFBaUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDL0IsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8seUJBQVA7YUFBTCxFQUF1QyxTQUFBLEdBQUE7QUFDckMsY0FBQSxLQUFDLENBQUEsS0FBRCxDQUFPO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLGdCQUFQO0FBQUEsZ0JBQXlCLEVBQUEsRUFBSSxnQkFBN0I7QUFBQSxnQkFBK0MsSUFBQSxFQUFNLFVBQXJEO2VBQVAs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

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/output/buffer.coffee
