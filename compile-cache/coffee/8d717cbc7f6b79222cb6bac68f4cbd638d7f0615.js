(function() {
  var CommandMode, DispatchCommand, FindAndReplaceMode, InputTextCommand, Recorder, TextMode, _ref;

  _ref = require('./macro-command'), InputTextCommand = _ref.InputTextCommand, DispatchCommand = _ref.DispatchCommand;

  CommandMode = 0;

  TextMode = 1;

  FindAndReplaceMode = 2;

  module.exports = Recorder = (function() {
    Recorder.prototype.sequence = null;

    Recorder.prototype.currentMode = null;

    Recorder.prototype.keySeq = null;

    function Recorder() {
      var editor;
      editor = atom.workspace.getActiveTextEditor();
      this.editorElement = atom.views.getView(editor);
      this.keySeq = [];
    }

    Recorder.prototype.isTextEvent = function(e) {
      var keybind, stroke;
      stroke = atom.keymaps.keystrokeForKeyboardEvent(e);
      keybind = atom.keymaps.findKeyBindings({
        keystrokes: stroke,
        target: this.editorElement
      });
      return (keybind.length === 0 && (!e.altKey) && (!e.ctrlKey) && (!e.metaKey)) || stroke === 'tab';
    };

    Recorder.prototype.start = function() {
      return this.sequence = [];
    };

    Recorder.prototype.stop = function() {
      var e;
      if (this.keySeq.length > 0) {
        e = this.keySeq[0];
        if (this.isTextEvent(e)) {
          this.sequence.push(new InputTextCommand(this.keySeq));
        } else {
          this.pushDispatchCommand(this.keySeq);
        }
      }
      this.keySeq = [];
      return this.currentMode = null;
    };

    Recorder.prototype.getSequence = function() {
      return this.sequence;
    };

    Recorder.prototype.add = function(e) {
      var _ref1, _ref2, _ref3;
      if ((_ref1 = e.keyIdentifier) != null ? _ref1.match(/Control|Shift|Alt|Meta|Cmd/) : void 0) {
        return;
      }
      if (this.isTextEvent(e)) {
        if (this.currentMode && this.currentMode === TextMode) {
          return this.keySeq.push(e);
        } else {
          if (this.keySeq.length > 0) {
            this.keySeq.push(e);
            return _ref2 = this.pushDispatchCommand(this.keySeq), this.keySeq = _ref2[0], this.currentMode = _ref2[1], _ref2;
          } else {
            this.keySeq = [e];
            return this.currentMode = TextMode;
          }
        }
      } else {
        if (this.currentMode === TextMode && this.keySeq.length > 0) {
          this.sequence.push(new InputTextCommand(this.keySeq));
          this.keySeq = [];
        }
        this.currentMode = CommandMode;
        this.keySeq.push(e);
        return _ref3 = this.pushDispatchCommand(this.keySeq), this.keySeq = _ref3[0], this.currentMode = _ref3[1], _ref3;
      }
    };

    Recorder.prototype.push = function(cmd) {
      if (this.currentMode === TextMode && this.keySeq.length > 0) {
        this.sequence.push(new InputTextCommand(this.keySeq));
      } else if (this.currentMode === CommandMode && this.keySeq.length > 0) {
        this.pushDispatchCommand(this.keySeq);
      }
      this.keySeq = [];
      this.sequence.push(cmd);
      return this.currentMode = FindAndReplaceMode;
    };

    Recorder.prototype.pushDispatchCommand = function(seq) {
      var bind, command_name, e, keybind, keystrokes, stroke, _i, _len;
      keystrokes = '';
      for (_i = 0, _len = seq.length; _i < _len; _i++) {
        e = seq[_i];
        stroke = atom.keymaps.keystrokeForKeyboardEvent(e);
        if (keystrokes.length > 0) {
          keystrokes = keystrokes + ' ' + stroke;
        } else {
          keystrokes = stroke;
        }
        keybind = atom.keymaps.findKeyBindings({
          keystrokes: keystrokes,
          target: this.editorElement
        });
        if (keybind.length === 0) {
          continue;
        } else {
          command_name = keybind.command;
          if (!command_name) {
            bind = keybind[0];
            command_name = bind.command;
          }
          if (command_name.indexOf('atom-keyboard-macros') !== 0) {
            this.sequence.push(new DispatchCommand(command_name));
          }
          return [[], TextMode];
        }
      }
      return [seq, CommandMode];
    };

    return Recorder;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYXRvbS1rZXlib2FyZC1tYWNyb3MvbGliL3JlY29yZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0RkFBQTs7QUFBQSxFQUFBLE9BQXNDLE9BQUEsQ0FBUSxpQkFBUixDQUF0QyxFQUFDLHdCQUFBLGdCQUFELEVBQW1CLHVCQUFBLGVBQW5CLENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsQ0FGZCxDQUFBOztBQUFBLEVBR0EsUUFBQSxHQUFXLENBSFgsQ0FBQTs7QUFBQSxFQUlBLGtCQUFBLEdBQXFCLENBSnJCLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osdUJBQUEsUUFBQSxHQUFVLElBQVYsQ0FBQTs7QUFBQSx1QkFDQSxXQUFBLEdBQWEsSUFEYixDQUFBOztBQUFBLHVCQUVBLE1BQUEsR0FBUSxJQUZSLENBQUE7O0FBSWEsSUFBQSxrQkFBQSxHQUFBO0FBQ1gsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CLENBRGpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxNQUFELEdBQVUsRUFGVixDQURXO0lBQUEsQ0FKYjs7QUFBQSx1QkFTQSxXQUFBLEdBQWEsU0FBQyxDQUFELEdBQUE7QUFDWCxVQUFBLGVBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsT0FBTyxDQUFDLHlCQUFiLENBQXVDLENBQXZDLENBQVQsQ0FBQTtBQUFBLE1BQ0EsT0FBQSxHQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBYixD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

//# sourceURL=/C:/Users/MNP/.atom/packages/atom-keyboard-macros/lib/recorder.coffee
