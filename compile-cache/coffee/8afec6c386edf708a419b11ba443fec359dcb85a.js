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
              "class": 'block checkbox'
            }, function() {
              _this.input({
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
              "class": 'block checkbox'
            }, function() {
              _this.input({
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9vdXRwdXQvYnVmZmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpREFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQVUsRUFGVixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsSUFBQSxFQUFNLGFBQU47QUFBQSxJQUNBLFdBQUEsRUFBYSwrQ0FEYjtBQUFBLElBRUEsU0FBQSxFQUFTLEtBRlQ7QUFBQSxJQUlBLFFBQUEsRUFBVSxTQUFBLEdBQUE7YUFDUixPQUFBLEdBQVUsR0FERjtJQUFBLENBSlY7QUFBQSxJQU9BLFVBQUEsRUFBWSxTQUFBLEdBQUE7YUFDVixPQUFBLEdBQVUsR0FEQTtJQUFBLENBUFo7QUFBQSxJQVVBLElBQUEsRUFDUTtBQUVKLG1DQUFBLENBQUE7Ozs7T0FBQTs7QUFBQSxNQUFBLFVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2VBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFVBQUEsT0FBQSxFQUFPLG1CQUFQO1NBQUwsRUFBaUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDL0IsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sZ0JBQVA7YUFBTCxFQUE4QixTQUFBLEdBQUE7QUFDNUIsY0FBQSxLQUFDLENBQUEsS0FBRCxDQUFPO0FBQUEsZ0JBQUEsRUFBQSxFQUFJLGdCQUFKO0FBQUEsZ0JBQXNCLElBQUEsRUFBTSxVQUE1QjtlQUFQLENBQUEsQ0FBQTtxQkFDQSxLQUFDLENBQUEsS0FBRCxDQUFPLFNBQUEs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

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/output/buffer.coffee
