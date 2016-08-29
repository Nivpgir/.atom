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
              "class": 'block checkbox'
            }, function() {
              _this.input({
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
              "class": 'block checkbox'
            }, function() {
              _this.input({
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
              "class": 'block checkbox'
            }, function() {
              _this.input({
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
              "class": 'block checkbox'
            }, function() {
              _this.input({
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
