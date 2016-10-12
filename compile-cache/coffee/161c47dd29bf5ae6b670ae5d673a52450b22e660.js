(function() {
  var CompositeDisposable, FindAndReplace, FindNextCommand, FindNextSelectedCommand, FindPreviousCommand, FindPreviousSelectedCommand, ReplaceAllCommand, ReplaceNextCommand, ReplacePreviousCommand, SetSelectionAsFindPatternCommand, characterForKeyboardEvent, keydownEvent, keystrokeForKeyboardEvent, _ref, _ref1;

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('./helpers'), keystrokeForKeyboardEvent = _ref.keystrokeForKeyboardEvent, keydownEvent = _ref.keydownEvent, characterForKeyboardEvent = _ref.characterForKeyboardEvent;

  _ref1 = require('./macro-command'), FindNextCommand = _ref1.FindNextCommand, FindPreviousCommand = _ref1.FindPreviousCommand, FindNextSelectedCommand = _ref1.FindNextSelectedCommand, FindPreviousSelectedCommand = _ref1.FindPreviousSelectedCommand, SetSelectionAsFindPatternCommand = _ref1.SetSelectionAsFindPatternCommand, ReplacePreviousCommand = _ref1.ReplacePreviousCommand, ReplaceNextCommand = _ref1.ReplaceNextCommand, ReplaceAllCommand = _ref1.ReplaceAllCommand;

  module.exports = FindAndReplace = (function() {
    function FindAndReplace() {}

    FindAndReplace.prototype.findView = null;

    FindAndReplace.prototype.findEditor = null;

    FindAndReplace.prototype.replaceEditor = null;

    FindAndReplace.prototype.findNext = null;

    FindAndReplace.prototype.findPrevious = null;

    FindAndReplace.prototype.findNextSelected = null;

    FindAndReplace.prototype.findPreviousSelected = null;

    FindAndReplace.prototype.setSelectionAsFindPattern = null;

    FindAndReplace.prototype.replacePrevious = null;

    FindAndReplace.prototype.replaceNext = null;

    FindAndReplace.prototype.replaceAll = null;

    FindAndReplace.prototype.isRecording = false;

    FindAndReplace.prototype.activate = function() {
      var editorElement, isRecording;
      editorElement = atom.views.getView(atom.workspace.getActiveTextEditor());
      atom.commands.dispatch(editorElement, 'find-and-replace:toggle');
      atom.commands.dispatch(editorElement, 'find-and-replace:toggle');
      isRecording = false;
      return this.getFindAndReplaceMethods();
    };

    FindAndReplace.prototype.deactivate = function() {};

    FindAndReplace.prototype.getFindAndReplaceMethods = function() {
      var item, name, panel, panels, _i, _len, _ref2, _ref3;
      if (this.findNext) {
        return;
      }
      panels = atom.workspace.getBottomPanels();
      for (_i = 0, _len = panels.length; _i < _len; _i++) {
        panel = panels[_i];
        item = panel.item;
        name = item != null ? (_ref2 = item.__proto__) != null ? (_ref3 = _ref2.constructor) != null ? _ref3.name : void 0 : void 0 : void 0;
        if (name === 'FindView') {
          this.findView = item;
          this.findNext = item.findNext;
          this.findPrevious = item.findPrevious;
          this.findNextSelected = item.findNextSelected;
          this.findPreviousSelected = item.findPreviousSelected;
          this.setSelectionAsFindPattern = item.setSelectionAsFindPattern;
          this.replacePrevious = item.replacePrevious;
          this.replaceNext = item.replaceNext;
          this.replaceAll = item.replaceAll;
          this.findEditor = item.findEditor;
          this.replaceEditor = item.replaceEditor;
          this.replaceAllButton = item.replaceAllButton;
          this.replaceNextButton = item.replaceNextButton;
          this.nextButton = item.nextButton;
          this.regexOptionButton = item.regexOptionButton;
          this.caseOptionButton = item.caseOptionButton;
          this.selectionOptionButton = item.selectionOptionButton;
          this.wholeWordOptionButton = item.wholeWordOptionButton;
          if (!(this.findNext && this.findPrevious && this.findNextSelected && this.findPrevious && this.findPreviousSelected && this.setSelectionAsFindPattern && this.replacePrevious && this.replaceNext && this.replaceAll && this.findEditor && this.replaceEditor)) {
            this.findNext = null;
            this.findPrevious = null;
            this.findNextSelected = null;
            this.findPreviousSelected = null;
            this.setSelectionAsFindPattern = null;
            this.replacePrevious = null;
            this.replaceNext = null;
            this.replaceAll = null;
            this.findEditor = null;
            this.replaceEditor = null;
            return;
          }
          break;
        }
      }
    };

    FindAndReplace.prototype.getFindText = function() {
      var _ref2;
      return (_ref2 = this.findEditor) != null ? _ref2.getText() : void 0;
    };

    FindAndReplace.prototype.getReplaceText = function() {
      var _ref2;
      return (_ref2 = this.replaceEditor) != null ? _ref2.getText() : void 0;
    };

    FindAndReplace.prototype.setFindText = function(text) {
      var _ref2;
      return (_ref2 = this.findEditor) != null ? _ref2.setText(text) : void 0;
    };

    FindAndReplace.prototype.setReplaceText = function(text) {
      var _ref2;
      return (_ref2 = this.replaceEditor) != null ? _ref2.setText(text) : void 0;
    };

    FindAndReplace.prototype.startRecording = function(macroSequence) {
      this.macroSequence = macroSequence;
      this.isRecording = true;
      return this.addHooks();
    };

    FindAndReplace.prototype.stopRecording = function() {
      this.removeHooks();
      return this.isRecording = false;
    };

    FindAndReplace.prototype.addHooks = function() {
      var item, self;
      if (!(this.findNext && this.findPrevious && this.findNextSelected && this.findPrevious && this.findPreviousSelected && this.setSelectionAsFindPattern && this.replacePrevious && this.replaceNext && this.replaceAll && this.findEditor && this.replaceEditor)) {
        return;
      }
      item = this.findView;
      item.findNext = this.findNextMonitor;
      item.findPrevious = this.findPreviousMonitor;
      item.findNextSelected = this.findNextSelectedMonitor;
      item.findPreviousSelected = this.findPreviousSelectedMonitor;
      item.setSelectionAsFindPattern = this.setSelectionAsFindPatternMonitor;
      item.replacePrevious = this.replacePreviousMonitor;
      item.replaceNext = this.replaceNextMonitor;
      item.replaceAll = this.replaceAllMonitor;
      self = this;
      this.replaceAllButtonHook = function(e) {
        return self.replaceAllMonitor();
      };
      this.replaceAllButton.on('click.atom-keyboard-macros', this.replaceAllButtonHook);
      this.replaceNextButtonHook = function(e) {
        return self.replaceNextMonitor();
      };
      this.replaceNextButton.on('click.atom-keyboard-macros', this.replaceNextButtonHook);
      this.nextButtonHook = function(e) {
        self.findNext();
        return self.findNextMonitor();
      };
      this.nextButton.on('click.atom-keyboard-macros', this.nextButtonHook);
      return this.findEditor.on('keydown.atom-keyboard-macros', function(key) {
        if (key.keyCode === 13) {
          self.findNext();
          return self.findNextMonitor();
        }
      });
    };

    FindAndReplace.prototype.removeHooks = function() {
      var item, name, panel, panels, _i, _len, _ref2, _ref3;
      panels = atom.workspace.getBottomPanels();
      for (_i = 0, _len = panels.length; _i < _len; _i++) {
        panel = panels[_i];
        item = panel.item;
        name = item != null ? (_ref2 = item.__proto__) != null ? (_ref3 = _ref2.constructor) != null ? _ref3.name : void 0 : void 0 : void 0;
        if (name === 'FindView') {
          item.findNext = this.findNext;
          item.findPrevious = this.findPrevious;
          item.findNextSelected = this.findNextSelected;
          item.findPreviousSelected = this.findPreviousSelected;
          item.setSelectionAsFindPattern = this.setSelectionAsFindPattern;
          item.replaceNext = this.replaceNext;
          item.replaceAll = this.replaceAll;
        }
      }
      this.replaceAllButton.off('click.atom-keyboard-macros');
      this.replaceNextButton.off('click.atom-keyboard-macros');
      this.nextButton.off('click.atom-keyboard-macros');
      return this.findEditor.off('keydown.atom-keyboard-macros');
    };

    FindAndReplace.prototype.findNextMonitor = function() {
      var options, _ref2;
      if (!this.isRecording) {
        return;
      }
      options = (_ref2 = this.findView.model) != null ? _ref2.getFindOptions() : void 0;
      return this.macroSequence.push(new FindNextCommand(this, this.getFindText(), options));
    };

    FindAndReplace.prototype.findPreviousMonitor = function() {
      var options, _ref2;
      if (!this.isRecording) {
        if (typeof this.findPrevious === "function") {
          this.findPrevious();
        }
        return;
      }
      options = (_ref2 = this.findView.model) != null ? _ref2.getFindOptions() : void 0;
      return this.macroSequence.push(new FindPreviousCommand(this, this.getFindText(), options));
    };

    FindAndReplace.prototype.findNextSelectedMonitor = function() {
      var options, _ref2;
      if (!this.isRecording) {
        if (typeof this.findNextSelected === "function") {
          this.findNextSelected();
        }
        return;
      }
      options = (_ref2 = this.findView.model) != null ? _ref2.getFindOptions() : void 0;
      return this.macroSequence.push(new FindNextSelectedCommand(this, this.getFindText(), options));
    };

    FindAndReplace.prototype.findPreviousSelectedMonitor = function() {
      var options, _ref2;
      if (!this.isRecording) {
        if (typeof this.findPreviousSelected === "function") {
          this.findPreviousSelected();
        }
        return;
      }
      options = (_ref2 = this.findView.model) != null ? _ref2.getFindOptions() : void 0;
      return this.macroSequence.push(new FindPreviousSelectedCommand(this, this.getFindText(), options));
    };

    FindAndReplace.prototype.setSelectionAsFindPatternMonitor = function() {
      var options, _ref2;
      if (!this.isRecording) {
        if (typeof this.setSelectionAsFindPattern === "function") {
          this.setSelectionAsFindPattern();
        }
        return;
      }
      options = (_ref2 = this.findView.model) != null ? _ref2.getFindOptions() : void 0;
      return this.macroSequence.push(new SetSelectionAsFindPatternCommand(this), options);
    };

    FindAndReplace.prototype.replacePreviousMonitor = function() {
      var options, _ref2;
      if (!this.isRecording) {
        if (typeof this.replacePrevious === "function") {
          this.replacePrevious();
        }
        return;
      }
      options = (_ref2 = this.findView.model) != null ? _ref2.getFindOptions() : void 0;
      return this.macroSequence.push(new ReplacePreviousCommand(this, this.getFindText(), this.getReplaceText(), options));
    };

    FindAndReplace.prototype.replaceNextMonitor = function() {
      var options, _ref2;
      if (!this.isRecording) {
        if (typeof this.replaceNext === "function") {
          this.replaceNext();
        }
        return;
      }
      options = (_ref2 = this.findView.model) != null ? _ref2.getFindOptions() : void 0;
      return this.macroSequence.push(new ReplaceNextCommand(this, this.getFindText(), this.getReplaceText(), options));
    };

    FindAndReplace.prototype.replaceAllMonitor = function() {
      var options, _ref2;
      if (!this.isRecording) {
        if (typeof this.replaceAll === "function") {
          this.replaceAll();
        }
        return;
      }
      options = (_ref2 = this.findView.model) != null ? _ref2.getFindOptions() : void 0;
      return this.macroSequence.push(new ReplaceAllCommand(this, this.getFindText(), this.getReplaceText(), options));
    };

    return FindAndReplace;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYXRvbS1rZXlib2FyZC1tYWNyb3MvbGliL2ZpbmQtYW5kLXJlcGxhY2UuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlUQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxPQUF1RSxPQUFBLENBQVEsV0FBUixDQUF2RSxFQUFDLGlDQUFBLHlCQUFELEVBQTRCLG9CQUFBLFlBQTVCLEVBQTBDLGlDQUFBLHlCQUQxQyxDQUFBOztBQUFBLEVBRUEsUUFBZ00sT0FBQSxDQUFRLGlCQUFSLENBQWhNLEVBQUMsd0JBQUEsZUFBRCxFQUFrQiw0QkFBQSxtQkFBbEIsRUFBdUMsZ0NBQUEsdUJBQXZDLEVBQWdFLG9DQUFBLDJCQUFoRSxFQUE2Rix5Q0FBQSxnQ0FBN0YsRUFBK0gsK0JBQUEsc0JBQS9ILEVBQXVKLDJCQUFBLGtCQUF2SixFQUEySywwQkFBQSxpQkFGM0ssQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007Z0NBQ0o7O0FBQUEsNkJBQUEsUUFBQSxHQUFVLElBQVYsQ0FBQTs7QUFBQSw2QkFDQSxVQUFBLEdBQVksSUFEWixDQUFBOztBQUFBLDZCQUVBLGFBQUEsR0FBZSxJQUZmLENBQUE7O0FBQUEsNkJBSUEsUUFBQSxHQUFVLElBSlYsQ0FBQTs7QUFBQSw2QkFLQSxZQUFBLEdBQWMsSUFMZCxDQUFBOztBQUFBLDZCQU1BLGdCQUFBLEdBQWtCLElBTmxCLENBQUE7O0FBQUEsNkJBT0Esb0JBQUEsR0FBc0IsSUFQdEIsQ0FBQTs7QUFBQSw2QkFRQSx5QkFBQSxHQUEyQixJQVIzQixDQUFBOztBQUFBLDZCQVNBLGVBQUEsR0FBaUIsSUFUakIsQ0FBQTs7QUFBQSw2QkFV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

//# sourceURL=/C:/Users/MNP/.atom/packages/atom-keyboard-macros/lib/find-and-replace.coffee
