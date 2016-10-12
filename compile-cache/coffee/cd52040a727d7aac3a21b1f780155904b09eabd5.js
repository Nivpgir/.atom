(function() {
  var AtomKeyboardMacros, AtomKeyboardMacrosView, BaseSelectListView, CompositeDisposable, DispatchCommand, FilenameSelectListModel, FindAndReplace, MacroCommand, MacroNameSelectListModel, OneLineInputView, PluginCommand, Recorder, RepeatCountView, characterForKeyboardEvent, fs, isAtomModifier, keydownEvent, keystrokeForKeyboardEvent, normalizeKeystrokes, _ref, _ref1;

  AtomKeyboardMacrosView = require('./atom-keyboard-macros-view');

  RepeatCountView = require('./repeat-count-view');

  OneLineInputView = require('./one-line-input-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('./helpers'), normalizeKeystrokes = _ref.normalizeKeystrokes, keystrokeForKeyboardEvent = _ref.keystrokeForKeyboardEvent, isAtomModifier = _ref.isAtomModifier, keydownEvent = _ref.keydownEvent, characterForKeyboardEvent = _ref.characterForKeyboardEvent;

  Recorder = require('./recorder');

  _ref1 = require('./macro-command'), MacroCommand = _ref1.MacroCommand, DispatchCommand = _ref1.DispatchCommand, PluginCommand = _ref1.PluginCommand;

  fs = require('fs');

  FindAndReplace = require('./find-and-replace');

  BaseSelectListView = require('./base-select-list-view');

  MacroNameSelectListModel = require('./macro-name-select-list-model');

  FilenameSelectListModel = require('./filename-select-list-model');

  module.exports = AtomKeyboardMacros = {
    atomKeyboardMacrosView: null,
    messagePanel: null,
    repeatCountView: null,
    repeatCountPanel: null,
    oneLineInputView: null,
    saveFilenameInputView: null,
    subscriptions: null,
    keyCaptured: false,
    eventListener: null,
    escapeListener: null,
    escapeKeyPressed: false,
    macroCommands: null,
    runningName_last_kbd_macro: false,
    runningExecute_named_macro: false,
    quick_save_dirname: null,
    quick_save_filename: null,
    macro_dirname: null,
    baseSelectListView: null,
    macronames_select_list_model: null,
    filename_select_list_model: null,
    find: null,
    PluginCommand: PluginCommand,
    activate: function(state) {
      this.quick_save_dirname = atom.packages.resolvePackagePath('atom-keyboard-macros') + '/__quick/';
      this.quick_save_filename = this.quick_save_dirname + 'macros.atmkm';
      this.macro_dirname = atom.packages.resolvePackagePath('atom-keyboard-macros') + '/macros/';
      this.atomKeyboardMacrosView = new AtomKeyboardMacrosView(state.atomKeyboardMacrosViewState);
      this.messagePanel = atom.workspace.addBottomPanel({
        item: this.atomKeyboardMacrosView.getElement(),
        visible: false
      });
      this.repeatCountView = new RepeatCountView(state.repeatCountViewState);
      this.repeatCountPanel = atom.workspace.addModalPanel({
        item: this.repeatCountView.getElement(),
        visible: false
      });
      this.oneLineInputView = new OneLineInputView(state.oneLineInputViewState);
      this.saveFilenameInputView = new OneLineInputView(state.saveFilenameInputViewState, 'Save filename');
      this.macronames_select_list_model = new MacroNameSelectListModel();
      this.macroNamesSelectListView = new BaseSelectListView(state.macroNamesSelectListViewState, this.macronames_select_list_model);
      this.filename_select_list_model = new FilenameSelectListModel(this.macro_dirname);
      this.baseSelectListView = new BaseSelectListView(state.baseSelectListViewState, this.filename_select_list_model);
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-keyboard-macros:start_kbd_macro': (function(_this) {
          return function() {
            return _this.start_kbd_macro();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-keyboard-macros:end_kbd_macro': (function(_this) {
          return function() {
            return _this.end_kbd_macro();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-keyboard-macros:call_last_kbd_macro': (function(_this) {
          return function() {
            return _this.call_last_kbd_macro();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-keyboard-macros:repeat_last_kbd_macro': (function(_this) {
          return function() {
            return _this.repeat_last_kbd_macro();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-keyboard-macros:execute_macro_to_bottom': (function(_this) {
          return function() {
            return _this.execute_macro_to_bottom();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-keyboard-macros:execute_macro_from_top_to_bottom': (function(_this) {
          return function() {
            return _this.execute_macro_from_top_to_bottom();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-keyboard-macros:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-keyboard-macros:name_last_kbd_macro': (function(_this) {
          return function() {
            return _this.name_last_kbd_macro();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-keyboard-macros:execute_named_macro': (function(_this) {
          return function() {
            return _this.execute_named_macro();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-keyboard-macros:quick_save': (function(_this) {
          return function() {
            return _this.quick_save();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-keyboard-macros:quick_load': (function(_this) {
          return function() {
            return _this.quick_load();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-keyboard-macros:save': (function(_this) {
          return function() {
            return _this.save();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-keyboard-macros:load': (function(_this) {
          return function() {
            return _this.load();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-keyboard-macros:all_macros_to_new_text_editor': (function(_this) {
          return function() {
            return _this.all_macros_to_new_text_editor();
          };
        })(this)
      }));
      this.eventListener = this.keyboardEventHandler.bind(this);
      this.escapeListener = this.onEscapeKey.bind(this);
      this.keyCaptured = false;
      this.recorder = new Recorder();
      this.find = new FindAndReplace();
      return this.find.activate();
    },
    deactivate: function() {
      this.find.deactivate();
      this.saveFilenameInputView.destroy();
      this.oneLineInputView.destroy();
      this.repeatCountPanel.destroy();
      this.repeatCountView.destroy();
      this.messagePanel.destroy();
      this.subscriptions.dispose();
      this.atomKeyboardMacrosView.destroy();
      window.removeEventListener('keydown', this.escapeListener, true);
      return window.removeEventListener('keydown', this.eventListener, true);
    },
    serialize: function() {
      return {
        atomKeyboardMacrosViewState: this.atomKeyboardMacrosView.serialize(),
        repeatCountViewState: this.repeatCountView.serialize()
      };
    },
    toggle: function() {
      if (this.messagePanel.isVisible()) {
        return this.messagePanel.hide();
      } else {
        return this.messagePanel.show();
      }
    },
    setText: function(text) {
      this.atomKeyboardMacrosView.setText(text);
      return this.messagePanel.show();
    },
    keyboardEventHandler: function(e) {
      var _ref2, _ref3;
      if (((_ref2 = e.target) != null ? (_ref3 = _ref2.className) != null ? _ref3.indexOf('editor mini') : void 0 : void 0) >= 0) {
        return;
      }
      return this.recorder.add(e);
    },
    start_kbd_macro: function() {
      var workspaceElement;
      this.setText('start recording keyboard macros...');
      if (this.keyCaptured) {
        atom.beep();
        return;
      }
      this.recorder.start();
      this.keyCaptured = true;
      window.addEventListener('keydown', this.eventListener, true);
      this.find.startRecording(this.recorder);
      workspaceElement = atom.views.getView(atom.workspace);
      return workspaceElement.focus();
    },
    end_kbd_macro: function() {
      window.removeEventListener('keydown', this.eventListener, true);
      this.keyCaptured = false;
      this.setText('end recording keyboard macros.');
      this.recorder.stop();
      this.macroCommands = this.recorder.getSequence();
      return this.find.stopRecording();
    },
    execute_macro_once: function() {
      return this.execute_macro_commands(this.macroCommands);
    },
    execute_macro_commands: function(cmds) {
      var cmd, workspaceElement, _i, _len, _results;
      workspaceElement = atom.views.getView(atom.workspace);
      workspaceElement.focus();
      _results = [];
      for (_i = 0, _len = cmds.length; _i < _len; _i++) {
        cmd = cmds[_i];
        _results.push(cmd.execute());
      }
      return _results;
    },
    table: {},
    addNamedMacroTable: function(name, commands) {
      var prevCommand, self;
      self = this;
      this.table[name] = commands;
      this.macronames_select_list_model.addItem(name);
      prevCommand = atom.commands.selectorBasedListenersByCommandName['atom-keyboard-macros.user:' + name];
      if (prevCommand) {
        atom.commands.selectorBasedListenersByCommandName['atom-keyboard-macros.user:' + name] = null;
      }
      return atom.commands.add('atom-workspace', 'atom-keyboard-macros.user:' + name, function() {
        return self.execute_macro_commands(commands);
      });
    },
    macro_to_string: function(cmds) {
      var cmd, result, tabs, _i, _len;
      result = '';
      tabs = '    ';
      MacroCommand.resetForToString();
      for (_i = 0, _len = cmds.length; _i < _len; _i++) {
        cmd = cmds[_i];
        result += cmd.toString(tabs);
      }
      return result;
    },
    allMacrosToString: function() {
      var cmds, name, str, _ref2;
      str = '\n';
      _ref2 = this.table;
      for (name in _ref2) {
        cmds = _ref2[name];
        str += '  ' + name + ': ->\n';
        str += this.macro_to_string(cmds) + '\n';
      }
      return str;
    },
    all_macros_to_new_text_editor: function() {
      var promiss, self;
      self = this;
      promiss = atom.workspace.open();
      return promiss.then(function(editor) {
        return editor.insertText(self.allMacrosToString());
      });
    },
    ask_filename: function(callback) {
      this.baseSelectListView.setCallback(function(e) {
        return callback(e);
      });
      return this.baseSelectListView.show();
    },
    ask_save_filename: function(callback) {
      this.saveFilenameInputView.setCallback(function(e) {
        return callback(e);
      });
      return this.saveFilenameInputView.show();
    },
    save: function() {
      var _self;
      _self = this;
      return fs.exists(this.macro_dirname, function(exists) {
        if (!exists) {
          fs.mkdirSync(_self.macro_dirname);
        }
        return _self.ask_save_filename(function(name) {
          var editor, fullpath;
          fullpath = _self.macro_dirname + name;
          _self.save_as(fullpath);
          editor = atom.workspace.getActiveTextEditor();
          return atom.views.getView(editor).focus();
        });
      });
    },
    save_as: function(filename) {
      var cmd, cmds, name, self, str, _i, _j, _len, _len1, _ref2, _ref3;
      str = '';
      str += '>\n';
      _ref2 = this.macroCommands;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        cmd = _ref2[_i];
        str += cmd.toSaveString();
      }
      _ref3 = this.table;
      for (name in _ref3) {
        cmds = _ref3[name];
        str += '>' + name + '\n';
        for (_j = 0, _len1 = cmds.length; _j < _len1; _j++) {
          cmd = cmds[_j];
          str += cmd.toSaveString();
        }
      }
      self = this;
      return fs.writeFile(filename, str, function(err) {
        if (err) {
          return console.error(err);
        }
      });
    },
    quick_save: function() {
      var ___self;
      ___self = this;
      return fs.exists(this.quick_save_dirname, function(exists) {
        if (!exists) {
          fs.mkdirSync(___self.quick_save_dirname);
        }
        return ___self.save_as(___self.quick_save_filename);
      });
    },
    load: function() {
      var _self;
      _self = this;
      return this.ask_filename(function(name) {
        var editor, fullpath;
        fullpath = _self.macro_dirname + name;
        _self.load_with_name(fullpath);
        editor = atom.workspace.getActiveTextEditor();
        return atom.views.getView(editor).focus();
      });
    },
    load_with_name: function(name) {
      var self;
      self = this;
      return fs.readFile(name, 'utf8', function(err, text) {
        var cmds, macros, _results;
        if (err) {
          return console.error(err);
        } else {
          macros = MacroCommand.loadStringAsMacroCommands(text, self.find);
          _results = [];
          for (name in macros) {
            cmds = macros[name];
            if (name.length === 0) {
              _results.push(self.macroCommands = cmds);
            } else {
              _results.push(self.addNamedMacroTable(name, cmds));
            }
          }
          return _results;
        }
      });
    },
    quick_load: function() {
      return this.load_with_name(this.quick_save_filename);
    },
    name_last_kbd_macro: function() {
      var self;
      this.runningName_last_kbd_macro = true;
      this.oneLineInputView.show();
      self = this;
      return this.oneLineInputView.setCallback(function(text) {
        var editor;
        self.name_last_kbd_macro_with_string(text);
        editor = atom.workspace.getActiveTextEditor();
        return atom.views.getView(editor).focus();
      });
    },
    name_last_kbd_macro_with_string: function(name) {
      if (this.keyCaptured) {
        atom.beep();
        return;
      }
      if (this.macroCommands && this.macroCommands.length > 0) {
        return this.addNamedMacroTable(name, this.macroCommands);
      } else {
        return atom.beep();
      }
    },
    execute_named_macro: function() {
      var self;
      this.runningExecute_named_macro = true;
      this.macroNamesSelectListView.show();
      self = this;
      return this.macroNamesSelectListView.setCallback(function(text) {
        return self.execute_named_macro_with_string(text);
      });
    },
    execute_named_macro_with_string: function(name) {
      var cmd, editor;
      if (this.keyCaptured) {
        atom.beep();
        return;
      }
      cmd = 'atom-keyboard-macros.user:' + name;
      editor = atom.workspace.getActiveTextEditor();
      return atom.commands.dispatch(atom.views.getView(editor), cmd);
    },
    call_last_kbd_macro: function() {
      if (this.keyCaptured) {
        atom.beep();
        return;
      }
      if (!this.macroCommands || this.macroCommands.length === 0) {
        this.setText('no keyboard macros.');
        return;
      }
      this.setText('execute keyboard macros.');
      this.execute_macro_once();
      return this.setText('macro executed');
    },
    repeat_last_kbd_macro: function() {
      var self;
      if (this.keyCaptured) {
        atom.beep();
        return;
      }
      if (!this.macroCommands || this.macroCommands.length === 0) {
        this.setText('no keyboard macros.');
        return;
      }
      this.repeatCountPanel.show();
      this.repeatCountView.focus();
      window.addEventListener('keydown', this.escapeListener, true);
      self = this;
      return this.repeatCountView.setCallback(function(count) {
        return self.onGetRepeatCount(count);
      });
    },
    onEscapeKey: function(e) {
      var keystroke;
      keystroke = atom.keymaps.keystrokeForKeyboardEvent(e);
      if (keystroke === 'escape') {
        this.escapeKeyPressed = true;
        this.repeatCountPanel.hide();
        this.oneLineInputView.hide();
        return window.removeEventListener('keydown', this.escapeListener, true);
      }
    },
    onGetRepeatCount: function(count) {
      var i, _i;
      this.repeatCountPanel.hide();
      for (i = _i = 1; 1 <= count ? _i <= count : _i >= count; i = 1 <= count ? ++_i : --_i) {
        this.setText("execute keyboard macro " + i);
        this.execute_macro_once();
      }
      return this.setText("executed macro " + count + " times");
    },
    execute_macro_to_bottom: function() {
      this.setText("execute keyboard macro to bottom of the buffer.");
      this.util_execute_macro_to_bottom();
      return this.setText("executed keyboard macro to bottom of the buffer.");
    },
    execute_macro_from_top_to_bottom: function() {
      var editor;
      this.setText("execute keyboard macro from top to bottom of the buffer.");
      editor = atom.workspace.getActiveTextEditor();
      if (editor) {
        editor.moveToTop();
      }
      this.util_execute_macro_to_bottom();
      return this.setText("executed keyboard macro from top to bottom of the buffer.");
    },
    util_execute_macro_to_bottom: function() {
      var editor;
      editor = atom.workspace.getActiveTextEditor();
      if (editor) {
        window.addEventListener('keydown', this.escapeListener, true);
        this.escaescapeKeyPressed = false;
        while (editor.getLastCursor().getBufferRow() < editor.getLastBufferRow()) {
          if (this.escapeKeyPressed) {
            break;
          }
          this.execute_macro_once();
        }
        return window.removeEventListener('keydown', this.escapeListener, true);
      }
    },
    push_plugin_command: function(plugin_obj) {
      var cmd;
      cmd = new PluginCommand(plugin_obj.fn, plugin_obj.options);
      return this.recorder.push(cmd);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYXRvbS1rZXlib2FyZC1tYWNyb3MvbGliL2F0b20ta2V5Ym9hcmQtbWFjcm9zLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyV0FBQTs7QUFBQSxFQUFBLHNCQUFBLEdBQXlCLE9BQUEsQ0FBUSw2QkFBUixDQUF6QixDQUFBOztBQUFBLEVBQ0EsZUFBQSxHQUFrQixPQUFBLENBQVEscUJBQVIsQ0FEbEIsQ0FBQTs7QUFBQSxFQUVBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSx1QkFBUixDQUZuQixDQUFBOztBQUFBLEVBR0Msc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUhELENBQUE7O0FBQUEsRUFJQSxPQUE0RyxPQUFBLENBQVEsV0FBUixDQUE1RyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGlDQUFBLHlCQUF0QixFQUFpRCxzQkFBQSxjQUFqRCxFQUFpRSxvQkFBQSxZQUFqRSxFQUErRSxpQ0FBQSx5QkFKL0UsQ0FBQTs7QUFBQSxFQUtBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQUxYLENBQUE7O0FBQUEsRUFNQSxRQUFpRCxPQUFBLENBQVEsaUJBQVIsQ0FBakQsRUFBQyxxQkFBQSxZQUFELEVBQWUsd0JBQUEsZUFBZixFQUFnQyxzQkFBQSxhQU5oQyxDQUFBOztBQUFBLEVBT0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBUEwsQ0FBQTs7QUFBQSxFQVFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSLENBUmpCLENBQUE7O0FBQUEsRUFTQSxrQkFBQSxHQUFxQixPQUFBLENBQVEseUJBQVIsQ0FUckIsQ0FBQTs7QUFBQSxFQVVBLHdCQUFBLEdBQTJCLE9BQUEsQ0FBUSxnQ0FBUixDQVYzQixDQUFBOztBQUFBLEVBV0EsdUJB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

//# sourceURL=/C:/Users/MNP/.atom/packages/atom-keyboard-macros/lib/atom-keyboard-macros.coffee
