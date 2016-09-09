(function() {
  var $, $$, AnsiParser, CompositeDisposable, Console, ConsoleInfoPane, ConsolePane, View, buildHTML, consolemodel, consolepanel, consoleview, timeout, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, View = _ref.View;

  Console = null;

  consolemodel = null;

  consoleview = null;

  consolepanel = null;

  timeout = null;

  CompositeDisposable = null;

  AnsiParser = null;

  buildHTML = function(message, status, filenames) {
    return $$(function() {
      if (status == null) {
        status = '';
      }
      if (status === 'note') {
        status = 'info';
      }
      return this.div({
        "class": "text-" + status
      }, (function(_this) {
        return function() {
          var col, end, file, prev, row, start, _i, _len, _ref1;
          if ((filenames != null) && filenames.length !== 0) {
            prev = -1;
            for (_i = 0, _len = filenames.length; _i < _len; _i++) {
              _ref1 = filenames[_i], file = _ref1.file, row = _ref1.row, col = _ref1.col, start = _ref1.start, end = _ref1.end;
              _this.span(message.substr(prev + 1, start - (prev + 1)));
              _this.span({
                "class": "filelink highlight-" + status,
                name: file,
                row: row,
                col: col
              }, message.substr(start, end - start + 1));
              prev = end;
            }
            if (prev !== message.length - 1) {
              return _this.span(message.substr(prev + 1));
            }
          } else {
            return _this.span(message === '' ? ' ' : message);
          }
        };
      })(this));
    });
  };

  module.exports = {
    activate: function() {
      var ConsoleView;
      Console = require('../console/console');
      ConsoleView = require('../console/console-element');
      consolemodel = new Console;
      consoleview = new ConsoleView(consolemodel);
      consolepanel = atom.workspace.addBottomPanel({
        item: consoleview,
        visible: false
      });
      consoleview.show = function() {
        return consolepanel.show();
      };
      consoleview.hide = function() {
        return consolepanel.hide();
      };
      CompositeDisposable = require('atom').CompositeDisposable;
      AnsiParser = require('./ansi-parser');
      this.disposables = new CompositeDisposable;
      this.disposables.add(atom.commands.add('atom-workspace', {
        'build-tools:toggle': function() {
          if (consolepanel.isVisible()) {
            return consolepanel.hide();
          } else {
            return consolepanel.show();
          }
        }
      }));
      return this.disposables.add(atom.keymaps.add('build-tools:console', {
        'atom-workspace': {
          'ctrl-l ctrl-s': 'build-tools:toggle'
        }
      }));
    },
    deactivate: function() {
      var ConsoleView;
      consolepanel.destroy();
      consolemodel.destroy();
      this.disposables.dispose();
      this.disposables = null;
      consolepanel = null;
      consoleview = null;
      consolemodel = null;
      ConsoleView = null;
      return Console = null;
    },
    provideConsole: function() {
      return consolemodel;
    },
    name: 'Console',
    description: 'Display command output in console pane',
    "private": false,
    edit: ConsolePane = (function(_super) {
      __extends(ConsolePane, _super);

      function ConsolePane() {
        return ConsolePane.__super__.constructor.apply(this, arguments);
      }

      ConsolePane.content = function() {
        return this.div({
          "class": 'panel-body padded'
        }, (function(_this) {
          return function() {
            _this.div({
              "class": 'block input-label align'
            }, function() {
              _this.input({
                "class": 'input-checkbox',
                id: 'close_success',
                type: 'checkbox'
              });
              return _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Close on success');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Close console on success. Uses config value in package settings if enabled');
                });
              });
            });
            _this.div({
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
                }, 'Execute Queue in one tab');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Print output of all commands of the queue in one tab');
                });
              });
            });
            _this.div({
              "class": 'block input-label align'
            }, function() {
              _this.input({
                "class": 'input-checkbox',
                id: 'colors',
                type: 'checkbox'
              });
              return _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Use ANSI Color Codes');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Highlight console output using ANSI Color Codes');
                });
              });
            });
            return _this.div({
              "class": 'block input-label align'
            }, function() {
              _this.input({
                "class": 'input-checkbox',
                id: 'stdin',
                type: 'checkbox'
              });
              return _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Allow user input');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Allow user to interact with the spawned process');
                });
              });
            });
          };
        })(this));
      };

      ConsolePane.prototype.set = function(command) {
        var _ref1, _ref2, _ref3, _ref4;
        if ((command != null ? (_ref1 = command.output) != null ? _ref1.console : void 0 : void 0) != null) {
          this.find('#close_success').prop('checked', command.output.console.close_success);
          this.find('#all_in_one').prop('checked', (_ref2 = command.output.console.queue_in_buffer) != null ? _ref2 : true);
          this.find('#colors').prop('checked', (_ref3 = command.output.console.colors) != null ? _ref3 : false);
          return this.find('#stdin').prop('checked', (_ref4 = command.output.console.stdin) != null ? _ref4 : false);
        } else {
          this.find('#close_success').prop('checked', atom.config.get('build-tools.CloseOnSuccess') === -1 ? false : true);
          this.find('#all_in_one').prop('checked', true);
          this.find('#colors').prop('checked', false);
          return this.find('#stdin').prop('checked', false);
        }
      };

      ConsolePane.prototype.get = function(command) {
        var _base;
        if ((_base = command.output).console == null) {
          _base.console = {};
        }
        command.output.console.close_success = this.find('#close_success').prop('checked');
        command.output.console.queue_in_buffer = this.find('#all_in_one').prop('checked');
        command.output.console.colors = this.find('#colors').prop('checked');
        command.output.console.stdin = this.find('#stdin').prop('checked');
        return null;
      };

      return ConsolePane;

    })(View),
    info: ConsoleInfoPane = (function() {
      function ConsoleInfoPane(command) {
        var keys, value, values;
        this.element = document.createElement('div');
        this.element.classList.add('module');
        keys = document.createElement('div');
        keys.innerHTML = '<div class="text-padded">Close on success:</div>\n<div class="text-padded">Execute queue in one tab:</div>\n<div class="text-padded">ANSI Colors:</div>\n<div class="text-padded">User Input:</div>';
        values = document.createElement('div');
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command.output.console.close_success);
        values.appendChild(value);
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command.output.console.queue_in_buffer);
        values.appendChild(value);
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command.output.console.colors);
        values.appendChild(value);
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command.output.console.stdin);
        values.appendChild(value);
        this.element.appendChild(keys);
        this.element.appendChild(values);
      }

      return ConsoleInfoPane;

    })(),
    output: Console = (function() {
      function Console() {}

      Console.prototype.newQueue = function(queue) {
        var _ref1;
        this.queue_in_buffer = (_ref1 = queue.queue[queue.queue.length - 1].output.console) != null ? _ref1.queue_in_buffer : void 0;
        if (this.queue_in_buffer) {
          this.tab = consolemodel.getTab(queue.queue[queue.queue.length - 1]);
          this.tab.clear();
          return clearTimeout(timeout);
        }
      };

      Console.prototype.newCommand = function(command) {
        this.command = command;
        if (!this.queue_in_buffer) {
          this.tab = consolemodel.getTab(this.command);
          this.tab.clear();
          clearTimeout(timeout);
        }
        this.tab.setRunning();
        this.tab.focus();
        this.stdout_lines = [];
        return this.stderr_lines = [];
      };

      Console.prototype.setInput = function(input) {
        if (this.command.output.console.stdin) {
          this.tab.setInput(input.write);
          consoleview.input_container.removeClass('hidden');
          return consoleview.input.focus();
        } else {
          return consoleview.input_container.addClass('hidden');
        }
      };

      Console.prototype.stdout_new = function() {
        var last;
        if (this.tab.destroyed) {
          return;
        }
        if (this.command.output.console.colors && ((last = this.stdout_lines[this.stdout_lines.length - 1]) != null)) {
          if (last.innerText === '') {
            last.innerText = ' ';
            AnsiParser.copyAttributes(this.stdout_lines, this.stdout_lines.length - 1);
          }
        }
        return this.stdout_lines.push(this.tab.newLine());
      };

      Console.prototype.stdout_raw = function(input) {
        if (this.tab.destroyed) {
          return;
        }
        if (this.command.output.console.colors) {
          AnsiParser.parseAnsi(input, this.stdout_lines, this.stdout_lines.length - 1);
        } else {
          this.stdout_lines[this.stdout_lines.length - 1].innerText += input;
        }
        return this.tab.scroll();
      };

      Console.prototype.stdout_in = function(_arg) {
        var input;
        input = _arg.input;
        if (this.tab.destroyed) {
          return;
        }
        if (input === '') {
          return this.stdout_lines[this.stdout_lines.length - 1].innerText = ' ';
        }
      };

      Console.prototype.stdout_setType = function(status) {
        var last;
        if (this.tab.destroyed) {
          return;
        }
        last = this.stdout_lines[this.stdout_lines.length - 1];
        if (last == null) {
          return;
        }
        if (status == null) {
          status = '';
        }
        if (status === 'note') {
          status = 'info';
        }
        return $(last).prop('class', "bold text-" + status);
      };

      Console.prototype.stdout_print = function(_arg) {
        var element, files, input, _new, _ref1;
        input = _arg.input, files = _arg.files;
        if (this.tab.destroyed) {
          return;
        }
        if (this.stdout_lines[this.stdout_lines.length - 1] == null) {
          return;
        }
        _new = buildHTML(input.input, (_ref1 = input.highlighting) != null ? _ref1 : input.type, files);
        element = $(this.stdout_lines[this.stdout_lines.length - 1]);
        element.prop('class', _new.prop('class'));
        return element.html(_new.html());
      };

      Console.prototype.stdout_replacePrevious = function(lines) {
        var element, files, index, input, _i, _len, _new, _ref1, _ref2, _results;
        if (this.tab.destroyed) {
          return;
        }
        if (this.stdout_lines[this.stdout_lines.length - lines.length - 1] == null) {
          return;
        }
        _results = [];
        for (index = _i = 0, _len = lines.length; _i < _len; index = ++_i) {
          _ref1 = lines[index], input = _ref1.input, files = _ref1.files;
          _new = buildHTML(input.input, (_ref2 = input.highlighting) != null ? _ref2 : input.type, files);
          element = $(this.stdout_lines[this.stdout_lines.length - lines.length + index - 1]);
          element.prop('class', _new.prop('class'));
          _results.push(element.html(_new.html()));
        }
        return _results;
      };

      Console.prototype.stderr_new = function() {
        var last;
        if (this.tab.destroyed) {
          return;
        }
        if (this.command.output.console.colors && ((last = this.stderr_lines[this.stderr_lines.length - 1]) != null)) {
          if (last.innerText === '') {
            last.innerText = ' ';
            AnsiParser.copyAttributes(this.stderr_lines, this.stderr_lines.length - 1);
          }
        }
        return this.stderr_lines.push(this.tab.newLine());
      };

      Console.prototype.stderr_raw = function(input) {
        if (this.tab.destroyed) {
          return;
        }
        if (this.command.output.console.colors) {
          AnsiParser.parseAnsi(input, this.stderr_lines, this.stderr_lines.length - 1);
        } else {
          this.stderr_lines[this.stderr_lines.length - 1].innerText += input;
        }
        return this.tab.scroll();
      };

      Console.prototype.stderr_in = function(_arg) {
        var input;
        input = _arg.input;
        if (this.tab.destroyed) {
          return;
        }
        if (input === '') {
          return this.stderr_lines[this.stderr_lines.length - 1].innerText = ' ';
        }
      };

      Console.prototype.stderr_setType = function(status) {
        var last;
        if (this.tab.destroyed) {
          return;
        }
        last = this.stderr_lines[this.stderr_lines.length - 1];
        if (last == null) {
          return;
        }
        if (status == null) {
          status = '';
        }
        if (status === 'note') {
          status = 'info';
        }
        return $(last).prop('class', "bold text-" + status);
      };

      Console.prototype.stderr_print = function(_arg) {
        var element, files, input, _new, _ref1;
        input = _arg.input, files = _arg.files;
        if (this.tab.destroyed) {
          return;
        }
        if (this.stderr_lines[this.stderr_lines.length - 1] == null) {
          return;
        }
        _new = buildHTML(input.input, (_ref1 = input.highlighting) != null ? _ref1 : input.type, files);
        element = $(this.stderr_lines[this.stderr_lines.length - 1]);
        element.prop('class', _new.prop('class'));
        return element.html(_new.html());
      };

      Console.prototype.stderr_replacePrevious = function(lines) {
        var element, files, index, input, _i, _len, _new, _ref1, _ref2, _results;
        if (this.tab.destroyed) {
          return;
        }
        if (this.stderr_lines[this.stderr_lines.length - lines.length - 1] == null) {
          return;
        }
        _results = [];
        for (index = _i = 0, _len = lines.length; _i < _len; index = ++_i) {
          _ref1 = lines[index], input = _ref1.input, files = _ref1.files;
          _new = buildHTML(input.input, (_ref2 = input.highlighting) != null ? _ref2 : input.type, files);
          element = $(this.stderr_lines[this.stderr_lines.length - lines.length + index - 1]);
          element.prop('class', _new.prop('class'));
          _results.push(element.html(_new.html()));
        }
        return _results;
      };

      Console.prototype.error = function(message) {
        this.tab.setError(message);
        return this.tab.finishConsole();
      };

      Console.prototype.exitCommand = function(status) {
        this.tab.setFinished(status);
        if (this.queue_in_buffer) {
          return;
        }
        return this.finish(status);
      };

      Console.prototype.exitQueue = function(code) {
        if (code === -2) {
          this.tab.setCancelled();
          this.tab.finishConsole();
          if (this.tab.hasFocus()) {
            consoleview.hideInput();
          }
          return;
        }
        if (!this.queue_in_buffer) {
          return;
        }
        return this.finish(code);
      };

      Console.prototype.finish = function(status) {
        var t;
        this.tab.finishConsole();
        if (this.tab.hasFocus()) {
          consoleview.hideInput();
        }
        if (this.command.output['console'].close_success && status === 0) {
          t = atom.config.get('build-tools.CloseOnSuccess');
          if (t < 1) {
            consolepanel.hide();
            this.tab = null;
            return this.command = null;
          } else {
            clearTimeout(timeout);
            return timeout = setTimeout((function(_this) {
              return function() {
                if (_this.tab.hasFocus()) {
                  consolepanel.hide();
                }
                timeout = null;
                _this.tab = null;
                return _this.command = null;
              };
            })(this), t * 1000);
          }
        }
      };

      return Console;

    })()
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9vdXRwdXQvY29uc29sZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0pBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQWdCLE9BQUEsQ0FBUSxzQkFBUixDQUFoQixFQUFDLFNBQUEsQ0FBRCxFQUFJLFVBQUEsRUFBSixFQUFRLFlBQUEsSUFBUixDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLElBRlYsQ0FBQTs7QUFBQSxFQUdBLFlBQUEsR0FBZSxJQUhmLENBQUE7O0FBQUEsRUFJQSxXQUFBLEdBQWMsSUFKZCxDQUFBOztBQUFBLEVBS0EsWUFBQSxHQUFlLElBTGYsQ0FBQTs7QUFBQSxFQU9BLE9BQUEsR0FBVSxJQVBWLENBQUE7O0FBQUEsRUFTQSxtQkFBQSxHQUFzQixJQVR0QixDQUFBOztBQUFBLEVBV0EsVUFBQSxHQUFhLElBWGIsQ0FBQTs7QUFBQSxFQWFBLFNBQUEsR0FBWSxTQUFDLE9BQUQsRUFBVSxNQUFWLEVBQWtCLFNBQWxCLEdBQUE7V0FDVixFQUFBLENBQUcsU0FBQSxHQUFBO0FBQ0QsTUFBQSxJQUFtQixjQUFuQjtBQUFBLFFBQUEsTUFBQSxHQUFTLEVBQVQsQ0FBQTtPQUFBO0FBQ0EsTUFBQSxJQUFtQixNQUFBLEtBQVUsTUFBN0I7QUFBQSxRQUFBLE1BQUEsR0FBUyxNQUFULENBQUE7T0FEQTthQUVBLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBUSxPQUFBLEdBQU8sTUFBZjtPQUFMLEVBQThCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDNUIsY0FBQSxpREFBQTtBQUFBLFVBQUEsSUFBRyxtQkFBQSxJQUFlLFNBQVMsQ0FBQyxNQUFWLEtBQXNCLENBQXhDO0FBQ0Us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

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/output/console.coffee
