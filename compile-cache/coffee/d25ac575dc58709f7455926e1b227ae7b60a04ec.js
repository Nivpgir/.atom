(function() {
  var AtomKeyboardMacrosView, CompositeDisposable, DispatchCommand, FRBaseCommand, FindNextCommand, FindNextSelectedCommand, FindPreviousCommand, FindPreviousSelectedCommand, InputTextCommand, KeydownCommand, MacroCommand, PluginCommand, ReplaceAllCommand, ReplaceNextCommand, ReplacePreviousCommand, SetSelectionAsFindPatternCommand, charCodeFromKeyIdentifier, characterForKeyboardEvent, keydownEvent, keystrokeForKeyboardEvent, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AtomKeyboardMacrosView = require('./atom-keyboard-macros-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('./helpers'), keystrokeForKeyboardEvent = _ref.keystrokeForKeyboardEvent, keydownEvent = _ref.keydownEvent, characterForKeyboardEvent = _ref.characterForKeyboardEvent, charCodeFromKeyIdentifier = _ref.charCodeFromKeyIdentifier;

  MacroCommand = (function() {
    function MacroCommand() {}

    MacroCommand.viewInitialized = false;

    MacroCommand.findViewInitialized = false;

    MacroCommand.resetForToString = function() {
      return MacroCommand.viewInitialized = false;
    };

    MacroCommand.prototype.execute = function() {};

    MacroCommand.prototype.toString = function() {};

    MacroCommand.prototype.toSaveString = function() {};

    MacroCommand.loadStringAsMacroCommands = function(text, findAndReplace) {
      var caseSensitive, cmd, cmdName, cmds, editText, event, events, i, inCurrentSelection, index, items, line, lines, method, name, options, opts, packageName, replaceText, result, s, targetPackage, useRegex, wholeWord, _i, _ref1, _ref2;
      result = {};
      lines = text.split('\n');
      index = 0;
      while (index < lines.length) {
        line = lines[index++];
        if (line.length === 0) {
          continue;
        }
        if (line[0] !== '>') {
          console.error('illegal format when loading macro commands.');
          return null;
        }
        if (line.length === 1) {
          name = '';
        } else {
          name = line.substring(1);
        }
        cmds = [];
        while ((index < lines.length) && (lines[index][0] === '*')) {
          line = lines[index++];
          if (line[0] !== '*' || line.length < 2) {
            console.error('illegal format when loading macro commands.');
            return null;
          }
          switch (line[1]) {
            case 'I':
              while ((index < lines.length) && (lines[index][0] === ':')) {
                line = lines[index++];
                if (line.length < 2) {
                  continue;
                }
                events = [];
                for (i = _i = 1, _ref1 = line.length - 1; 1 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 1 <= _ref1 ? ++_i : --_i) {
                  event = MacroCommand.keydownEventFromString(line[i]);
                  events.push(event);
                }
                cmds.push(new InputTextCommand(events));
              }
              break;
            case 'D':
              line = lines[index++];
              if (line[0] !== ':' || line.length < 2) {
                console.error('illegal format when loading macro commands.');
                return null;
              }
              cmd = new DispatchCommand('');
              cmd.command_name = line.substring(1);
              cmds.push(cmd);
              break;
            case 'K':
              while ((index < lines.length) && (lines[index][0] === ':')) {
                line = lines[index++];
                s = line.substring(1);
                event = MacroCommand.keydownEventFromString(s);
                cmds.push(new KeydownCommand(event));
              }
              break;
            case 'P':
              items = line.split(':', 4);
              packageName = items[1];
              method = items[2];
              if (items.length === 4) {
                options = items[3];
              }
              targetPackage = atom.packages.getActivePackage(packageName);
              cmd = targetPackage != null ? (_ref2 = targetPackage.mainModule) != null ? typeof _ref2[method] === "function" ? _ref2[method](options) : void 0 : void 0 : void 0;
              if (cmd) {
                cmds.push(cmd);
              }
              break;
            case ':':
              cmdName = line.substring(2);
              switch (cmdName) {
                case 'RPLALL':
                  line = lines[index++];
                  editText = line.substring(3);
                  line = lines[index++];
                  replaceText = line.substring(3);
                  line = lines[index++].substring(3);
                  opts = line.split(',');
                  useRegex = opts[0].indexOf('true') >= 0;
                  caseSensitive = opts[1].indexOf('true') >= 0;
                  inCurrentSelection = opts[2].indexOf('true') >= 0;
                  wholeWord = opts[3].indexOf('true') >= 0;
                  cmds.push(new ReplaceAllCommand(findAndReplace, editText, replaceText, {
                    useRegex: useRegex,
                    caseSensitive: caseSensitive,
                    inCurrentSelection: inCurrentSelection,
                    wholeWord: wholeWord
                  }));
                  break;
                case 'RPLNXT':
                  line = lines[index++];
                  editText = line.substring(3);
                  line = lines[index++];
                  replaceText = line.substring(3);
                  line = lines[index++].substring(3);
                  opts = line.split(',');
                  useRegex = opts[0].indexOf('true') >= 0;
                  caseSensitive = opts[1].indexOf('true') >= 0;
                  inCurrentSelection = opts[2].indexOf('true') >= 0;
                  wholeWord = opts[3].indexOf('true') >= 0;
                  cmds.push(new ReplaceNextCommand(findAndReplace, editText, replaceText, {
                    useRegex: useRegex,
                    caseSensitive: caseSensitive,
                    inCurrentSelection: inCurrentSelection,
                    wholeWord: wholeWord
                  }));
                  break;
                case 'RPLPRV':
                  line = lines[index++];
                  editText = line.substring(3);
                  line = lines[index++];
                  replaceText = line.substring(3);
                  line = lines[index++].substring(3);
                  opts = line.split(',');
                  useRegex = opts[0].indexOf('true') >= 0;
                  caseSensitive = opts[1].indexOf('true') >= 0;
                  inCurrentSelection = opts[2].indexOf('true') >= 0;
                  wholeWord = opts[3].indexOf('true') >= 0;
                  cmds.push(new ReplacePreviousCommand(findAndReplace, editText, replaceText, {
                    useRegex: useRegex,
                    caseSensitive: caseSensitive,
                    inCurrentSelection: inCurrentSelection,
                    wholeWord: wholeWord
                  }));
                  break;
                case 'SETPTN':
                  line = lines[index++].substring(3);
                  opts = line.split(',');
                  useRegex = opts[0].indexOf('true') >= 0;
                  caseSensitive = opts[1].indexOf('true') >= 0;
                  inCurrentSelection = opts[2].indexOf('true') >= 0;
                  wholeWord = opts[3].indexOf('true') >= 0;
                  cmds.push(new SetSelectionAsFindPatternCommand(findAndReplace, {
                    useRegex: useRegex,
                    caseSensitive: caseSensitive,
                    inCurrentSelection: inCurrentSelection,
                    wholeWord: wholeWord
                  }));
                  break;
                case 'FNDPRVSEL':
                  line = lines[index++];
                  editText = line.substring(3);
                  line = lines[index++].substring(3);
                  opts = line.split(',');
                  useRegex = opts[0].indexOf('true') >= 0;
                  caseSensitive = opts[1].indexOf('true') >= 0;
                  inCurrentSelection = opts[2].indexOf('true') >= 0;
                  wholeWord = opts[3].indexOf('true') >= 0;
                  cmds.push(new FindPreviousSelectedCommand(findAndReplace, editText, {
                    useRegex: useRegex,
                    caseSensitive: caseSensitive,
                    inCurrentSelection: inCurrentSelection,
                    wholeWord: wholeWord
                  }));
                  break;
                case 'FNDNXTSEL':
                  line = lines[index++];
                  editText = line.substring(3);
                  line = lines[index++].substring(3);
                  opts = line.split(',');
                  useRegex = opts[0].indexOf('true') >= 0;
                  caseSensitive = opts[1].indexOf('true') >= 0;
                  inCurrentSelection = opts[2].indexOf('true') >= 0;
                  wholeWord = opts[3].indexOf('true') >= 0;
                  cmds.push(new FindNextSelectedCommand(findAndReplace, editText, {
                    useRegex: useRegex,
                    caseSensitive: caseSensitive,
                    inCurrentSelection: inCurrentSelection,
                    wholeWord: wholeWord
                  }));
                  break;
                case 'FNDPRV':
                  line = lines[index++];
                  editText = line.substring(3);
                  line = lines[index++].substring(3);
                  opts = line.split(',');
                  useRegex = opts[0].indexOf('true') >= 0;
                  caseSensitive = opts[1].indexOf('true') >= 0;
                  inCurrentSelection = opts[2].indexOf('true') >= 0;
                  wholeWord = opts[3].indexOf('true') >= 0;
                  cmds.push(new FindPreviousCommand(findAndReplace, editText, {
                    useRegex: useRegex,
                    caseSensitive: caseSensitive,
                    inCurrentSelection: inCurrentSelection,
                    wholeWord: wholeWord
                  }));
                  break;
                case 'FNDPRV':
                  line = lines[index++];
                  editText = line.substring(3);
                  line = lines[index++].substring(3);
                  opts = line.split(',');
                  useRegex = opts[0].indexOf('true') >= 0;
                  caseSensitive = opts[1].indexOf('true') >= 0;
                  inCurrentSelection = opts[2].indexOf('true') >= 0;
                  wholeWord = opts[3].indexOf('true') >= 0;
                  cmds.push(new FindNextCommand(findAndReplace, editText, {
                    useRegex: useRegex,
                    caseSensitive: caseSensitive,
                    inCurrentSelection: inCurrentSelection,
                    wholeWord: wholeWord
                  }));
              }
              break;
            default:
              console.error('illegal format loading macro commands.');
              return null;
          }
        }
        result[name] = cmds;
      }
      return result;
    };

    MacroCommand.keydownEventFromString = function(keystroke) {
      var event, hasAlt, hasCmd, hasCtrl, hasShift, key, s;
      hasCtrl = keystroke.indexOf('ctrl-') > -1;
      hasAlt = keystroke.indexOf('alt-') > -1;
      hasShift = keystroke.indexOf('shift-') > -1;
      hasCmd = keystroke.indexOf('cmd-') > -1;
      s = keystroke.replace('ctrl-', '');
      s = s.replace('alt-', '');
      s = s.replace('shift-', '');
      key = s.replace('cmd-', '');
      event = keydownEvent(key, {
        ctrl: hasCtrl,
        alt: hasAlt,
        shift: hasShift,
        cmd: hasCmd
      });
      return event;
    };

    MacroCommand.findViewInitialize = function() {
      result += tabs + "editorElement = atom.views.getView(atom.workspace.getActiveTextEditor())\n";
      result += tabs + "atom.commands.dispatch(editorElement, 'find-and-replace:toggle') # wake up if not active\n";
      result += tabs + "atom.commands.dispatch(editorElement, 'find-and-replace:toggle') # hide\n";
      result += tabs + "panels = atom.workspace.getBottomPanels()\n";
      result += tabs + "for panel in panels\n";
      result += tabs + "  item = panel.item\n";
      result += tabs + "  name = item?.__proto__?.constructor?.name\n";
      result += tabs + "  if name == 'FindView'\n";
      result += tabs + "    @findNext = item.findNext\n";
      result += tabs + "    @findPrevious = item.findPrevious\n";
      result += tabs + "    @findNextSelected = item.findNextSelected\n";
      result += tabs + "    @findPreviousSelected = item.findPreviousSelected\n";
      result += tabs + "    @setSelectionAsFindPattern = item.setSelectionAsFindPattern\n";
      result += tabs + "    @replacePrevious = item.replacePrevious\n";
      result += tabs + "    @replaceNext = item.replaceNext\n";
      result += tabs + "    @replaceAll = item.replaceAll\n";
      result += tabs + "    @findEditor = item.findEditor\n";
      result += tabs + "    @replaceEditor = item.replaceEditor\n";
      result += tabs + "    @replaceAllButton = item.replaceAllButton\n";
      result += tabs + "    @replaceNextButton = item.replaceNextButton\n";
      result += tabs + "    @nextButton = item.nextButton\n";
      result += tabs + "    @regexOptionButton = item.regexOptionButton\n";
      result += tabs + "    @caseOptionButton = item.caseOptionButton\n";
      result += tabs + "    @selectionOptionButton = item.selectionOptionButton\n";
      result += tabs + "    @wholeWordOptionButton = item.wholeWordOptionButton\n";
      return MacroCommand.findViewInitialized = true;
    };

    return MacroCommand;

  })();

  InputTextCommand = (function(_super) {
    __extends(InputTextCommand, _super);

    function InputTextCommand(events) {
      this.events = events;
    }

    InputTextCommand.prototype.execute = function() {
      var character, e, _i, _len, _ref1, _results;
      _ref1 = this.events;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        e = _ref1[_i];
        if (e.keyIdentifier === 'U+20' || e.keyCode === 0x20) {
          _results.push(atom.workspace.getActiveTextEditor().insertText(' '));
        } else if (e.keyIdentifier === 'U+9' || e.keyCode === 0x09) {
          _results.push(atom.workspace.getActiveTextEditor().insertText('\t'));
        } else {
          if (character = characterForKeyboardEvent(e, this.dvorakQwertyWorkaroundEnabled)) {
            _results.push(atom.workspace.getActiveTextEditor().insertText(character));
          } else {
            _results.push(void 0);
          }
        }
      }
      return _results;
    };

    InputTextCommand.prototype.toString = function(tabs) {
      var e, result, s, _i, _len, _ref1;
      result = '';
      _ref1 = this.events;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        e = _ref1[_i];
        s = atom.keymaps.keystrokeForKeyboardEvent(e);
        result += tabs + 'atom.keymaps.simulateTextInput(\'' + s + '\')\n';
      }
      return result;
    };

    InputTextCommand.prototype.toSaveString = function() {
      var character, e, result, s, _i, _len, _ref1;
      result = '*I\n';
      _ref1 = this.events;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        e = _ref1[_i];
        character = characterForKeyboardEvent(e);
        switch (e.keyCode) {
          case 0x20:
            character = ' ';
            break;
          case 0x09:
            character = '\t';
        }
        s = ':' + character + '\n';
        result += s;
      }
      return result;
    };

    return InputTextCommand;

  })(MacroCommand);

  DispatchCommand = (function() {
    function DispatchCommand(command_name) {
      this.command_name = command_name;
    }


    /*
    constructor: (keystroke) ->
      editor = atom.workspace.getActiveTextEditor()
      view = atom.views.getView(editor)
      bindings = atom.keymaps.findKeyBindings({keystrokes: keystroke, target: view})
      if bindings.length == 0
        @command_name = ''
        return
      else
        @command_name = bindings.command
        if !@command_name
           *console.log('bindings', bindings)
          bind = bindings[0]
          @command_name = bind.command
     */

    DispatchCommand.prototype.execute = function() {
      var editor, view;
      editor = atom.workspace.getActiveTextEditor();
      if (editor) {
        view = atom.views.getView(editor);
        return atom.commands.dispatch(view, this.command_name);
      }
    };

    DispatchCommand.prototype.toString = function(tabs) {
      var result;
      result = '';
      if (!MacroCommand.viewInitialized) {
        result += tabs + 'editor = atom.workspace.getActiveTextEditor()\n';
        result += tabs + 'view = atom.views.getView(editor)\n';
        MacroCommand.viewInitialized = true;
      }
      result += tabs + 'atom.commands.dispatch(view, "' + this.command_name + '")\n';
      return result;
    };

    DispatchCommand.prototype.toSaveString = function() {
      return '*D\n:' + this.command_name + '\n';
    };

    return DispatchCommand;

  })();

  KeydownCommand = (function(_super) {
    __extends(KeydownCommand, _super);

    function KeydownCommand(events) {
      this.events = events;
    }

    KeydownCommand.prototype.execute = function() {
      var e, _i, _len, _ref1, _results;
      _ref1 = this.events;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        e = _ref1[_i];
        _results.push(atom.keymaps.handleKeyboardEvent(e));
      }
      return _results;
    };

    KeydownCommand.prototype.toString = function(tabs) {
      var e, result, _i, _len, _ref1;
      result = '';
      if (!MacroCommand.viewInitialized) {
        result += tabs + 'editor = atom.workspace.getActiveTextEditor()\n';
        result += tabs + 'view = atom.views.getView(editor)\n';
        MacroCommand.viewInitialized = true;
      }
      _ref1 = this.events;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        e = _ref1[_i];
        result += tabs + "event = document.createEvent('KeyboardEvent')\n";
        result += tabs + "bubbles = true\n";
        result += tabs + "cancelable = true\n";
        result += tabs + "view = null\n";
        result += tabs + ("alt = " + e.altKey + "\n");
        result += tabs + ("ctrl = " + e.ctrlKey + "\n");
        result += tabs + ("cmd = " + e.metaKey + "\n");
        result += tabs + ("shift = " + e.shiftKey + "\n");
        result += tabs + ("keyCode = " + e.keyCode + "\n");
        result += tabs + ("keyIdentifier = " + e.keyIdentifier + "\n");
        result += tabs + "location ?= KeyboardEvent.DOM_KEY_LOCATION_STANDARD\n";
        result += tabs + "event.initKeyboardEvent('keydown', bubbles, cancelable, view,  keyIdentifier, location, ctrl, alt, shift, cmd)\n";
        result += tabs + "Object.defineProperty(event, 'keyCode', get: -> keyCode)\n";
        result += tabs + "Object.defineProperty(event, 'which', get: -> keyCode)\n";
        result += tabs + "atom.keymaps.handleKeyboardEvent(event)\n";
      }
      return result;
    };

    KeydownCommand.prototype.toSaveString = function() {
      var e, result, _i, _len, _ref1;
      result = '*K\n';
      _ref1 = this.events;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        e = _ref1[_i];
        result += ':' + keystrokeForKeyboardEvent(e) + '\n';
      }
      return result;
    };

    return KeydownCommand;

  })(MacroCommand);

  FRBaseCommand = (function(_super) {
    __extends(FRBaseCommand, _super);

    FRBaseCommand.prototype.useRegex = false;

    FRBaseCommand.prototype.caseSensitive = false;

    FRBaseCommand.prototype.inCurrentSelection = false;

    FRBaseCommand.prototype.wholeWord = false;

    function FRBaseCommand(options) {
      this.useRegex = options.useRegex;
      this.caseSensitive = options.caseSensitive;
      this.inCurrentSelection = options.inCurrentSelection;
      this.wholeWord = options.wholeWord;
    }

    FRBaseCommand.prototype.setOptions = function(findAndReplace) {
      var opts, _ref1, _ref2;
      opts = (_ref1 = findAndReplace.model) != null ? _ref1.getFindOptions() : void 0;
      if (opts != null) {
        opts.useRegex = this.useRegex;
      }
      if (opts != null) {
        opts.caseSensitive = this.caseSensitive;
      }
      if (opts != null) {
        opts.inCurrentSelection = this.inCurrentSelection;
      }
      if (opts != null) {
        opts.wholeWord = this.wholeWord;
      }
      return (_ref2 = findAndReplace.model) != null ? _ref2.setFindOptions(opts != null) : void 0;
    };

    return FRBaseCommand;

  })(MacroCommand);

  FindNextCommand = (function(_super) {
    __extends(FindNextCommand, _super);

    function FindNextCommand(findAndReplace, text, options) {
      this.findAndReplace = findAndReplace;
      this.text = text;
      this.options = options;
      FindNextCommand.__super__.constructor.call(this, this.options);
    }

    FindNextCommand.prototype.execute = function() {
      this.setOptions(this.findAndReplace);
      this.findAndReplace.setFindText(this.text);
      return this.findAndReplace.findNext(this.options);
    };

    FindNextCommand.prototype.toString = function(tabs) {
      var result;
      result = '';
      if (!MacroCommand.findViewInitialized) {
        result += MacroCommand.findViewInitialize();
      }
      result += tabs + '@findEditor?.model?.buffer?.lines[0] = "' + this.findText + '"\n';
      result += tabs + "atom.commands.dispatch(editorElement, 'find-and-replace:find-next')\n";
      return result;
    };

    FindNextCommand.prototype.toSaveString = function() {
      var result;
      result = '*:FNDPRV\n';
      result += ':F:' + this.findText + '\n';
      result += ':O:' + this.useRegex + ',' + this.caseSensitive + ',' + this.inCurrentSelection + ',' + this.wholeWord + '\n';
      return result;
    };

    return FindNextCommand;

  })(FRBaseCommand);

  FindPreviousCommand = (function(_super) {
    __extends(FindPreviousCommand, _super);

    function FindPreviousCommand(findAndReplace, text, options) {
      this.findAndReplace = findAndReplace;
      this.text = text;
      this.options = options;
      FindPreviousCommand.__super__.constructor.call(this, this.options);
    }

    FindPreviousCommand.prototype.execute = function() {
      this.setOptions(this.findAndReplace);
      this.findAndReplace.setText(this.text);
      return this.findAndReplace.findPrevious();
    };

    FindPreviousCommand.prototype.toString = function(tabs) {
      var result;
      result = '';
      if (!MacroCommand.findViewInitialized) {
        result += MacroCommand.findViewInitialize();
      }
      result += tabs + '@findEditor?.model?.buffer?.lines[0] = "' + this.findText + '"\n';
      result += tabs + "atom.commands.dispatch(editorElement, 'find-and-replace:find-previous')\n";
      return result;
    };

    FindPreviousCommand.prototype.toSaveString = function() {
      var result;
      result = '*:FNDPRV\n';
      result += ':F:' + this.findText + '\n';
      result += ':O:' + this.useRegex + ',' + this.caseSensitive + ',' + this.inCurrentSelection + ',' + this.wholeWord + '\n';
      return result;
    };

    return FindPreviousCommand;

  })(FRBaseCommand);

  FindNextSelectedCommand = (function(_super) {
    __extends(FindNextSelectedCommand, _super);

    function FindNextSelectedCommand(findAndReplace, text, options) {
      this.findAndReplace = findAndReplace;
      this.text = text;
      this.options = options;
      FindNextSelectedCommand.__super__.constructor.call(this, this.options);
    }

    FindNextSelectedCommand.prototype.execute = function() {
      this.setOptions(this.findAndReplace);
      this.findAndReplace.setText(this.text);
      return this.findAndReplace.findNextSecected();
    };

    FindNextSelectedCommand.prototype.toString = function(tabs) {
      var result;
      result = '';
      if (!MacroCommand.findViewInitialized) {
        result += MacroCommand.findViewInitialize();
      }
      result += tabs + '@findEditor?.model?.buffer?.lines[0] = "' + this.findText + '"\n';
      result += tabs + "atom.commands.dispatch(editorElement, 'find-and-replace:find-next-selected')\n";
      return result;
    };

    FindNextSelectedCommand.prototype.toSaveString = function() {
      var result;
      result = '*:FNDNXTSEL\n';
      result += ':F:' + this.findText + '\n';
      result += ':O:' + this.useRegex + ',' + this.caseSensitive + ',' + this.inCurrentSelection + ',' + this.wholeWord + '\n';
      return result;
    };

    return FindNextSelectedCommand;

  })(FRBaseCommand);

  FindPreviousSelectedCommand = (function(_super) {
    __extends(FindPreviousSelectedCommand, _super);

    function FindPreviousSelectedCommand(findAndReplace, text, options) {
      this.findAndReplace = findAndReplace;
      this.text = text;
      this.options = options;
      FindPreviousSelectedCommand.__super__.constructor.call(this, this.options);
    }

    FindPreviousSelectedCommand.prototype.execute = function() {
      this.setOptions(this.findAndReplace);
      this.findAndReplace.setFindText(this.text);
      return this.findAndReplace.findPreviousSelected();
    };

    FindPreviousSelectedCommand.prototype.toString = function(tabs) {
      var result;
      result = '';
      if (!MacroCommand.findViewInitialized) {
        result += MacroCommand.findViewInitialize();
      }
      result += tabs + '@findEditor?.model?.buffer?.lines[0] = "' + this.findText + '"\n';
      result += tabs + "atom.commands.dispatch(editorElement, 'find-and-replace:find-previous-selected')\n";
      return result;
    };

    FindPreviousSelectedCommand.prototype.toSaveString = function() {
      var result;
      result = '*:FNDPRVSEL\n';
      result += ':F:' + this.findText + '\n';
      result += ':O:' + this.useRegex + ',' + this.caseSensitive + ',' + this.inCurrentSelection + ',' + this.wholeWord + '\n';
      return result;
    };

    return FindPreviousSelectedCommand;

  })(FRBaseCommand);

  SetSelectionAsFindPatternCommand = (function(_super) {
    __extends(SetSelectionAsFindPatternCommand, _super);

    function SetSelectionAsFindPatternCommand(findAndReplace, options) {
      this.findAndReplace = findAndReplace;
      this.options = options;
      SetSelectionAsFindPatternCommand.__super__.constructor.call(this, this.options);
    }

    SetSelectionAsFindPatternCommand.prototype.execute = function() {
      this.setOptions(this.findAndReplace);
      return this.findAndReplace.setSelectionAsFindPattern();
    };

    SetSelectionAsFindPatternCommand.prototype.toString = function(tabs) {
      var result;
      result = '';
      if (!MacroCommand.findViewInitialized) {
        result += MacroCommand.findViewInitialize();
      }
      result += tabs + "atom.commands.dispatch(editorElement, 'find-and-replace:use-selection-as-find-pattern')\n";
      return result;
    };

    SetSelectionAsFindPatternCommand.prototype.toSaveString = function() {
      var result;
      result = '*:SETPTN\n';
      result += ':O:' + this.useRegex + ',' + this.caseSensitive + ',' + this.inCurrentSelection + ',' + this.wholeWord + '\n';
      return result;
    };

    return SetSelectionAsFindPatternCommand;

  })(FRBaseCommand);

  ReplacePreviousCommand = (function(_super) {
    __extends(ReplacePreviousCommand, _super);

    function ReplacePreviousCommand(findAndReplace, findText, replaceText, options) {
      this.findAndReplace = findAndReplace;
      this.findText = findText;
      this.replaceText = replaceText;
      this.options = options;
      ReplacePreviousCommand.__super__.constructor.call(this, this.options);
    }

    ReplacePreviousCommand.prototype.execute = function() {
      this.setOptions(this.findAndReplace);
      this.findAndReplace.setFindText(this.findText);
      this.findAndReplace.setReplaceText(this.replaceText);
      return this.findAndReplace.replacePrevious();
    };

    ReplacePreviousCommand.prototype.toString = function(tabs) {
      var result;
      result = '';
      if (!MacroCommand.findViewInitialized) {
        result += MacroCommand.findViewInitialize();
      }
      result += tabs + '@findEditor?.model?.buffer?.lines[0] = "' + this.findText + '"\n';
      result += tabs + '@replaceEditor?.model?.buffer?.lines[0] = "' + this.replaceText + '"\n';
      result += tabs + "atom.commands.dispatch(editorElement, 'find-and-replace:replace-previous')\n";
      return result;
    };

    ReplacePreviousCommand.prototype.toSaveString = function() {
      var result;
      result = '*:RPLPRV\n';
      result += ':F:' + this.findText + '\n';
      result += ':R:' + this.replaceText + '\n';
      result += ':O:' + this.useRegex + ',' + this.caseSensitive + ',' + this.inCurrentSelection + ',' + this.wholeWord + '\n';
      return result;
    };

    return ReplacePreviousCommand;

  })(FRBaseCommand);

  ReplaceNextCommand = (function(_super) {
    __extends(ReplaceNextCommand, _super);

    function ReplaceNextCommand(findAndReplace, findText, replaceText, options) {
      this.findAndReplace = findAndReplace;
      this.findText = findText;
      this.replaceText = replaceText;
      this.options = options;
      ReplaceNextCommand.__super__.constructor.call(this, this.options);
    }

    ReplaceNextCommand.prototype.execute = function() {
      this.setOptions(this.findAndReplace);
      this.findAndReplace.setFindText(this.findText);
      this.findAndReplace.setReplaceText(this.replaceText);
      return this.findAndReplace.replaceNext();
    };

    ReplaceNextCommand.prototype.toString = function(tabs) {
      var result;
      result = '';
      if (!MacroCommand.findViewInitialized) {
        result += MacroCommand.findViewInitialize();
      }
      result += tabs + '@findEditor?.model?.buffer?.lines[0] = "' + this.findText + '"\n';
      result += tabs + '@replaceEditor?.model?.buffer?.lines[0] = "' + this.replaceText + '"\n';
      result += tabs + "atom.commands.dispatch(editorElement, 'find-and-replace:replace-next')\n";
      return result;
    };

    ReplaceNextCommand.prototype.toSaveString = function() {
      var result;
      result = '*:RPLNXT\n';
      result += ':F:' + this.findText + '\n';
      result += ':R:' + this.replaceText + '\n';
      result += ':O:' + this.useRegex + ',' + this.caseSensitive + ',' + this.inCurrentSelection + ',' + this.wholeWord + '\n';
      return result;
    };

    return ReplaceNextCommand;

  })(FRBaseCommand);

  ReplaceAllCommand = (function(_super) {
    __extends(ReplaceAllCommand, _super);

    function ReplaceAllCommand(findAndReplace, findText, replaceText, options) {
      this.findAndReplace = findAndReplace;
      this.findText = findText;
      this.replaceText = replaceText;
      this.options = options;
      ReplaceAllCommand.__super__.constructor.call(this, this.options);
    }

    ReplaceAllCommand.prototype.execute = function() {
      this.setOptions(this.findAndReplace);
      this.findAndReplace.setFindText(this.findText);
      this.findAndReplace.setReplaceText(this.replaceText);
      return this.findAndReplace.replaceAll();
    };

    ReplaceAllCommand.prototype.toString = function(tabs) {
      var result;
      result = '';
      if (!MacroCommand.findViewInitialized) {
        result += MacroCommand.findViewInitialize();
      }
      result += tabs + '@findEditor?.model?.buffer?.lines[0] = "' + this.findText + '"\n';
      result += tabs + '@replaceEditor?.model?.buffer?.lines[0] = "' + this.replaceText + '"\n';
      result += tabs + "atom.commands.dispatch(editorElement, 'find-and-replace:replace-all')\n";
      return result;
    };

    ReplaceAllCommand.prototype.toSaveString = function() {
      var result;
      result = '*:RPLALL\n';
      result += ':F:' + this.findText + '\n';
      result += ':R:' + this.replaceText + '\n';
      result += ':O:' + this.useRegex + ',' + this.caseSensitive + ',' + this.inCurrentSelection + ',' + this.wholeWord + '\n';
      return result;
    };

    return ReplaceAllCommand;

  })(FRBaseCommand);

  PluginCommand = (function(_super) {
    __extends(PluginCommand, _super);

    function PluginCommand(plugin, options) {
      this.plugin = plugin;
      this.options = options;
      PluginCommand.__super__.constructor.call(this, this.options);
    }

    PluginCommand.prototype.execute = function() {
      return this.plugin.execute(this.options);
    };

    PluginCommand.prototype.toString = function(tabs) {
      return this.plugin.toString(tabs);
    };

    PluginCommand.prototype.toSaveString = function() {
      return this.plugin.toSaveString(this.options);
    };

    PluginCommand.prototype.instansiateFromSavedString = function(str) {
      return this.plugin.instansiateFromSavedString(str);
    };

    return PluginCommand;

  })(MacroCommand);


  /*
   * Plugin Interface
  class PluginInterface
    execute: (@options) ->
  
    toString: (tabs) ->
  
    toSaveString: ->
  
    instansiateFromSavedString: (str) ->
   */

  module.exports = {
    MacroCommand: MacroCommand,
    InputTextCommand: InputTextCommand,
    KeydownCommand: KeydownCommand,
    DispatchCommand: DispatchCommand,
    FindNextCommand: FindNextCommand,
    FindPreviousCommand: FindPreviousCommand,
    FindNextSelectedCommand: FindNextSelectedCommand,
    FindPreviousSelectedCommand: FindPreviousSelectedCommand,
    SetSelectionAsFindPatternCommand: SetSelectionAsFindPatternCommand,
    ReplacePreviousCommand: ReplacePreviousCommand,
    ReplaceNextCommand: ReplaceNextCommand,
    ReplaceAllCommand: ReplaceAllCommand,
    PluginCommand: PluginCommand
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYXRvbS1rZXlib2FyZC1tYWNyb3MvbGliL21hY3JvLWNvbW1hbmQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRhQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxzQkFBQSxHQUF5QixPQUFBLENBQVEsNkJBQVIsQ0FBekIsQ0FBQTs7QUFBQSxFQUNDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFERCxDQUFBOztBQUFBLEVBRUEsT0FBa0csT0FBQSxDQUFRLFdBQVIsQ0FBbEcsRUFBQyxpQ0FBQSx5QkFBRCxFQUE0QixvQkFBQSxZQUE1QixFQUEwQyxpQ0FBQSx5QkFBMUMsRUFBcUUsaUNBQUEseUJBRnJFLENBQUE7O0FBQUEsRUFJTTs4QkFDSjs7QUFBQSxJQUFBLFlBQUMsQ0FBQSxlQUFELEdBQWtCLEtBQWxCLENBQUE7O0FBQUEsSUFDQSxZQUFDLENBQUEsbUJBQUQsR0FBc0IsS0FEdEIsQ0FBQTs7QUFBQSxJQUdBLFlBQUMsQ0FBQSxnQkFBRCxHQUFtQixTQUFBLEdBQUE7YUFDakIsWUFBWSxDQUFDLGVBQWIsR0FBK0IsTUFEZDtJQUFBLENBSG5CLENBQUE7O0FBQUEsMkJBT0EsT0FBQSxHQUFTLFNBQUEsR0FBQSxDQVBULENBQUE7O0FBQUEsMkJBVUEsUUFBQSxHQUFVLFNBQUEsR0FBQSxDQVZWLENBQUE7O0FBQUEsMkJBYUEsWUFBQSxHQUFjLFNBQUEsR0FBQSxDQWJkLENBQUE7O0FBQUEsSUFlQSxZQUFDLENBQUEseUJBQUQsR0FBNEIsU0FBQyxJQUFELEVBQU8sY0FBUCxHQUFBO0FBQzFCLFVBQUEsb09BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxFQUFULENBQUE7QUFBQSxNQUNBLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBTCxD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

//# sourceURL=/C:/Users/MNP/.atom/packages/atom-keyboard-macros/lib/macro-command.coffee
