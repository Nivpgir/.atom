(function() {
  var CompositeDisposable, EmacsCursor, EmacsEditor, KillRing, Mark, State, afterCommand, beforeCommand, closeOtherPanes, getEditor;

  CompositeDisposable = require('atom').CompositeDisposable;

  EmacsCursor = require('./emacs-cursor');

  EmacsEditor = require('./emacs-editor');

  KillRing = require('./kill-ring');

  Mark = require('./mark');

  State = require('./state');

  beforeCommand = function(event) {
    return State.beforeCommand(event);
  };

  afterCommand = function(event) {
    var emacsCursor, emacsEditor, _i, _len, _ref;
    Mark.deactivatePending();
    if (State.yankComplete()) {
      emacsEditor = getEditor(event);
      _ref = emacsEditor.getEmacsCursors();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        emacsCursor = _ref[_i];
        emacsCursor.yankComplete();
      }
    }
    return State.afterCommand(event);
  };

  getEditor = function(event) {
    var editor, _ref;
    if ((_ref = event.target) != null ? _ref.getModel : void 0) {
      editor = event.target.getModel();
    } else {
      editor = atom.workspace.getActiveTextEditor();
    }
    return EmacsEditor["for"](editor);
  };

  closeOtherPanes = function(event) {
    var activePane, pane, _i, _len, _ref, _results;
    activePane = atom.workspace.getActivePane();
    if (!activePane) {
      return;
    }
    _ref = atom.workspace.getPanes();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      pane = _ref[_i];
      if (pane !== activePane) {
        _results.push(pane.close());
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  module.exports = {
    EmacsCursor: EmacsCursor,
    EmacsEditor: EmacsEditor,
    KillRing: KillRing,
    Mark: Mark,
    State: State,
    activate: function() {
      var _ref, _ref1;
      State.initialize();
      if ((_ref = document.getElementsByTagName('atom-workspace')[0]) != null) {
        if ((_ref1 = _ref.classList) != null) {
          _ref1.add('atomic-emacs');
        }
      }
      this.disposable = new CompositeDisposable;
      this.disposable.add(atom.commands.onWillDispatch(function(event) {
        return beforeCommand(event);
      }));
      this.disposable.add(atom.commands.onDidDispatch(function(event) {
        return afterCommand(event);
      }));
      return this.disposable.add(atom.commands.add('atom-text-editor', {
        "atomic-emacs:backward-char": function(event) {
          return getEditor(event).backwardChar();
        },
        "atomic-emacs:forward-char": function(event) {
          return getEditor(event).forwardChar();
        },
        "atomic-emacs:backward-word": function(event) {
          return getEditor(event).backwardWord();
        },
        "atomic-emacs:forward-word": function(event) {
          return getEditor(event).forwardWord();
        },
        "atomic-emacs:backward-sexp": function(event) {
          return getEditor(event).backwardSexp();
        },
        "atomic-emacs:forward-sexp": function(event) {
          return getEditor(event).forwardSexp();
        },
        "atomic-emacs:previous-line": function(event) {
          return getEditor(event).previousLine();
        },
        "atomic-emacs:next-line": function(event) {
          return getEditor(event).nextLine();
        },
        "atomic-emacs:backward-paragraph": function(event) {
          return getEditor(event).backwardParagraph();
        },
        "atomic-emacs:forward-paragraph": function(event) {
          return getEditor(event).forwardParagraph();
        },
        "atomic-emacs:back-to-indentation": function(event) {
          return getEditor(event).backToIndentation();
        },
        "atomic-emacs:backward-kill-word": function(event) {
          return getEditor(event).backwardKillWord();
        },
        "atomic-emacs:kill-word": function(event) {
          return getEditor(event).killWord();
        },
        "atomic-emacs:kill-line": function(event) {
          return getEditor(event).killLine();
        },
        "atomic-emacs:kill-region": function(event) {
          return getEditor(event).killRegion();
        },
        "atomic-emacs:copy-region-as-kill": function(event) {
          return getEditor(event).copyRegionAsKill();
        },
        "atomic-emacs:append-next-kill": function(event) {
          return State.killed();
        },
        "atomic-emacs:yank": function(event) {
          return getEditor(event).yank();
        },
        "atomic-emacs:yank-pop": function(event) {
          return getEditor(event).yankPop();
        },
        "atomic-emacs:yank-shift": function(event) {
          return getEditor(event).yankShift();
        },
        "atomic-emacs:delete-horizontal-space": function(event) {
          return getEditor(event).deleteHorizontalSpace();
        },
        "atomic-emacs:delete-indentation": function(event) {
          return getEditor(event).deleteIndentation();
        },
        "atomic-emacs:open-line": function(event) {
          return getEditor(event).openLine();
        },
        "atomic-emacs:just-one-space": function(event) {
          return getEditor(event).justOneSpace();
        },
        "atomic-emacs:transpose-chars": function(event) {
          return getEditor(event).transposeChars();
        },
        "atomic-emacs:transpose-lines": function(event) {
          return getEditor(event).transposeLines();
        },
        "atomic-emacs:transpose-words": function(event) {
          return getEditor(event).transposeWords();
        },
        "atomic-emacs:downcase-word-or-region": function(event) {
          return getEditor(event).downcaseWordOrRegion();
        },
        "atomic-emacs:upcase-word-or-region": function(event) {
          return getEditor(event).upcaseWordOrRegion();
        },
        "atomic-emacs:capitalize-word-or-region": function(event) {
          return getEditor(event).capitalizeWordOrRegion();
        },
        "atomic-emacs:set-mark": function(event) {
          return getEditor(event).setMark();
        },
        "atomic-emacs:mark-sexp": function(event) {
          return getEditor(event).markSexp();
        },
        "atomic-emacs:mark-whole-buffer": function(event) {
          return getEditor(event).markWholeBuffer();
        },
        "atomic-emacs:exchange-point-and-mark": function(event) {
          return getEditor(event).exchangePointAndMark();
        },
        "atomic-emacs:recenter-top-bottom": function(event) {
          return getEditor(event).recenterTopBottom();
        },
        "atomic-emacs:scroll-down": function(event) {
          return getEditor(event).scrollDown();
        },
        "atomic-emacs:scroll-up": function(event) {
          return getEditor(event).scrollUp();
        },
        "atomic-emacs:close-other-panes": function(event) {
          return closeOtherPanes(event);
        },
        "core:cancel": function(event) {
          return getEditor(event).keyboardQuit();
        }
      }));
    },
    deactivate: function() {
      var _ref, _ref1, _ref2;
      if ((_ref = document.getElementsByTagName('atom-workspace')[0]) != null) {
        if ((_ref1 = _ref.classList) != null) {
          _ref1.remove('atomic-emacs');
        }
      }
      if ((_ref2 = this.disposable) != null) {
        _ref2.dispose();
      }
      this.disposable = null;
      return KillRing.global.reset();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYXRvbWljLWVtYWNzL2xpYi9hdG9taWMtZW1hY3MuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZIQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBRGQsQ0FBQTs7QUFBQSxFQUVBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FGZCxDQUFBOztBQUFBLEVBR0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBSFgsQ0FBQTs7QUFBQSxFQUlBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUixDQUpQLENBQUE7O0FBQUEsRUFLQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FMUixDQUFBOztBQUFBLEVBT0EsYUFBQSxHQUFnQixTQUFDLEtBQUQsR0FBQTtXQUNkLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQXBCLEVBRGM7RUFBQSxDQVBoQixDQUFBOztBQUFBLEVBVUEsWUFBQSxHQUFlLFNBQUMsS0FBRCxHQUFBO0FBQ2IsUUFBQSx3Q0FBQTtBQUFBLElBQUEsSUFBSSxDQUFDLGlCQUFMLENBQUEsQ0FBQSxDQUFBO0FBRUEsSUFBQSxJQUFHLEtBQUssQ0FBQyxZQUFOLENBQUEsQ0FBSDtBQUNFLE1BQUEsV0FBQSxHQUFjLFNBQUEsQ0FBVSxLQUFWLENBQWQsQ0FBQTtBQUNBO0FBQUEsV0FBQSwyQ0FBQTsrQkFBQTtBQUNFLFFBQUEsV0FBVyxDQUFDLFlBQVosQ0FBQSxDQUFBLENBREY7QUFBQSxPQUZGO0tBRkE7V0FPQSxLQUFLLENBQUMsWUFBTixDQUFtQixLQUFuQixFQVJhO0VBQUEsQ0FWZixDQUFBOztBQUFBLEVBb0JBLFNBQUEsR0FBWSxTQUFDLEtBQUQsR0FBQTtBQUVWLFFBQUEsWUFBQTtBQUFBLElBQUEsd0NBQWUsQ0FBRSxpQkFBakI7QUFDRSxNQUFBLE1BQUEsR0FBUyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQWIsQ0FBQSxDQUFULENBREY7S0FBQSxNQUFBO0FBR0UsTUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FIRjtLQUFBO1dBSUEsV0FBVyxDQUFDLEtBQUQsQ0FBWCxDQUFnQixNQUFoQixFQU5VO0VBQUEsQ0FwQlosQ0FBQTs7QUFBQSxFQTRCQSxlQUFBLEdBQWtCLFNBQUMsS0FBRCxHQUFBO0FBQ2hCLFFBQUEsMENBQUE7QUFBQSxJQUFBLFVBQUEsR0FBYSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUFiLENBQUE7QUFDQSxJQUFBLElBQVUsQ0FBQSxVQUFWO0FBQUEsWUFBQSxDQUFBO0tBREE7QUFFQTtBQUFBO1NBQUEsMkNBQUE7c0JBQUE7QUFDRSxNQUFBLElBQU8sSUFBQSxLQUFRLFVBQWY7c0JBQ0UsSUFBSSxDQUFDLEtBQUwsQ0FBQSxHQURGO09BQUEsTUFBQTs4QkFBQTtPQURGO0FBQUE7b0JBSGdCO0VBQUEsQ0E1QmxCLENBQUE7O0FBQUEsRUFtQ0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsV0FBQSxFQUFhLFdBQWI7QUFBQSxJQUNBLFdBQUEsRUFBYSxXQURiO0FBQUEsSUFFQSxRQUFBLEVBQVUsUUFGVjtBQUFBLElBR0EsSUFBQSxFQUFNLElBSE47QUFBQSxJQUlBLEtBQUEsRUFBTyxLQUpQO0FBQUEsSUFNQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsVUFBQSxXQUFBO0FBQUEsTUFBQSxLQUFLLENBQUMsVUFBTixDQUFBLENBQUEsQ0FBQTs7O2VBQzZELENBQUUsR0FBL0QsQ0FBbUUsY0FBbkU7O09BREE7QUFBQSxNQUVBLElBQUMsQ0FBQSxVQUFELEdBQWMsR0FBQSxDQUFBLG1CQUZkLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxVQUFVLENBQUMsR0FBWixDQUFnQixJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWQsQ0FBNkIsU0FBQyxLQUFELEdBQUE7ZUFBVyxhQUFBLENBQWMsS0FBZCxFQUFYO01BQUEsQ0FBN0IsQ0FBaEIsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsVUFBVSxDQUFDLEdBQVosQ0FBZ0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFkLENBQTRCLFNBQUMsS0FBRCxHQUFBO2VBQVcsWUFBQSxDQUFhLEtBQWIsRUFBWDtNQUFBLENBQTVCLENBQWhCLENBSkEsQ0FBQTthQUtBLElBQUMsQ0FBQSxVQUFVLENBQUMsR0FBWixDQUFnQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBRWQ7QUFBQSxRQUFBLDRCQUFBLEVBQThCLFNBQUMsS0FBRCxHQUFBO2lCQUFXLFNBQUEsQ0FBVSxLQUFWLENBQWdCLENBQUMsWUFBakIsQ0FBQSxFQUFYO1FBQUEsQ0FBOUI7QUFBQSxRQUNBLDJCQUFBLEVBQTZCLFNBQUMsS0FBRCxHQUFBO2lCQUFXLFNBQUEsQ0FBVSxLQUFWLENBQWdCLENBQUMsV0FBakIsQ0FBQSxFQUFYO1FBQUEsQ0FEN0I7QUFBQSxRQUVBLDRCQUFBLEVBQThCLFNBQUMsS0FBRCxHQUFBO2lCQUFXLFNBQUEsQ0FBVSxLQUFWLENBQWdCLENBQUMsWUFBakIsQ0FBQSxFQUFYO1FBQUEsQ0FGOUI7QUFBQSxRQUdBLDJCQUFBLEVBQTZCLFNBQUMsS0FBRCxHQUFBO2lCQUFXLFNBQUEsQ0FBVSxLQUFWLENBQWdCLENBQUMsV0FBakIsQ0FBQSxFQUFYO1FBQUEsQ0FIN0I7QUFBQSxRQUlBLDRCQUFBLEVBQThCLFNBQUMsS0FBRCxHQUFBO2lCQUFXLFNBQUEsQ0FBVSxLQUFWLENBQWdCLENBQUMsWUFBakIsQ0FBQSxFQUFYO1FBQUEsQ0FKOUI7QUFBQSxRQUtBLDJCQUFBLEVBQTZCLFNBQUMsS0FBRCxHQUFBO2lCQUFXLFNBQUEsQ0FBVSxLQUFWLENBQWdCLENBQUMsV0FBakIsQ0FBQSxFQUFYO1FBQUEsQ0FMN0I7QUFBQSxRQU1BLDRCQUFBLEVBQThCLFNBQUMsS0FBRCxHQUFBO2lCQUFXLFNBQUEsQ0FBVSxLQUFWLENBQWdCLENBQUMsWUFBakIsQ0FBQSxFQUFYO1FBQUEsQ0FOOUI7QUFBQSxRQU9BLHdCQUFBLEVBQTBCLFNBQUMsS0FBRCxHQUFBO2lCQUFXLFNBQUEsQ0FBVSxLQUFWLENBQWdCLENBQUMsUUFBakIsQ0FBQSxFQUFYO1FBQUEsQ0FQMUI7QUFBQSxRQVFBLGlDQUFBLEVBQW1DLFNBQUMsS0FBRCxHQUFBO2lCQUFXLFNBQUEsQ0FBVSxLQUFWLENBQWdCLENBQUMsaUJBQWpCLENBQUEsRUFBWDtRQUFBLENBUm5DO0FBQUEsUUFTQSxnQ0FBQSxFQUFrQyxTQUFDLEtBQUQsR0FBQTtpQkFBVyxTQUFBLENBQVUsS0FBVixDQUFnQixDQUFDLGdCQUFqQixDQUFBLEVBQVg7UUFBQSxDQVRsQztBQUFBLFFBVUEsa0NBQUEsRUFBb0MsU0FBQyxLQUFELEdBQUE7aUJBQVcsU0FBQSxDQUFVLEtBQVYsQ0FBZ0IsQ0FBQyxpQkFBakIsQ0FBQSxFQUFYO1FBQUEsQ0FWcEM7QUFBQSxRQWFBLGlDQUFBLEVBQW1DLFNBQUMsS0FBRCxHQUFBO2lCQUFXLFNBQUEsQ0FBVSxLQUFWLENBQWdCLENBQUMsZ0JBQWpCLENBQUEsRUFBWDtRQUFBLENBYm5DO0FBQUEsUUFjQSx3QkFBQSxFQUEwQixTQUFDLEtBQUQsR0FBQTtpQkFBVyxTQUFBLENBQVUsS0FBVixDQUFnQixDQUFDLFFBQWpCLENBQUEsRUFBWDtRQUFBLENBZDFCO0FBQUEsUUFlQSx3QkFBQSxFQUEwQixTQUFDLEtBQUQsR0FBQTtpQkFBVyxTQUFBLENBQVUsS0FBVixDQUFnQixDQUFDLFFBQWpCLENBQUEsRUFBWDtRQUFBLENBZjFCO0FBQUEsUUFnQkEsMEJBQUEsRUFBNEIsU0FBQyxLQUFELEdBQUE7aUJBQVcsU0FBQSxDQUFVLEtBQVYsQ0FBZ0IsQ0FBQyxVQUFqQixDQUFBLEVBQVg7UUFBQSxDQWhCNUI7QUFBQSxRQWlCQSxrQ0FBQSxFQUFvQyxTQUFDLEtBQUQsR0FBQTtpQkFBVyxTQUFBLENBQVUsS0FBVixDQUFnQixDQUFDLGdCQUFqQixDQUFBLEVBQVg7UUFBQSxDQWpCcEM7QUFBQSxRQWtCQSwrQkFBQSxFQUFpQyxTQUFDLEtBQUQsR0FBQTtpQkFBVyxLQUFLLENBQUMsTUFBTixDQUFBLEVBQVg7UUFBQSxDQWxCakM7QUFBQSxRQW1CQSxtQkFBQSxFQUFxQixTQUFDLEtBQUQsR0FBQTtpQkFBVyxTQUFBLENBQVUsS0FBVixDQUFnQixDQUFDLElBQWpCLENBQUEsRUFBWDtRQUFBLENBbkJyQjtBQUFBLFFBb0JBLHVCQUFBLEVBQXlCLFNBQUMsS0FBRCxHQUFBO2lCQUFXLFNBQUEsQ0FBVSxLQUFWLENBQWdCLENBQUMsT0FBakIsQ0FBQSxFQUFYO1FBQUEsQ0FwQnpCO0FBQUEsUUFxQkEseUJBQUEsRUFBMkIsU0FBQyxLQUFELEdBQUE7aUJBQVcsU0FBQSxDQUFVLEtBQVYsQ0FBZ0IsQ0FBQyxTQUFqQixDQUFBLEVBQVg7UUFBQSxDQXJCM0I7QUFBQSxRQXdCQSxzQ0FBQSxFQUF3QyxTQUFDLEtBQUQsR0FBQTtpQkFBVyxTQUFBLENBQVUsS0FBVixDQUFnQixDQUFDLHFCQUFqQixDQUFBLEVBQVg7UUFBQSxDQXhCeEM7QUFBQSxRQXlCQSxpQ0FBQSxFQUFtQyxTQUFDLEtBQUQsR0FBQTtpQkFBVyxTQUFBLENBQVUsS0FBVixDQUFnQixDQUFDLGlCQUFqQixDQUFBLEVBQVg7UUFBQSxDQXpCbkM7QUFBQSxRQTBCQSx3QkFBQSxFQUEwQixTQUFDLEtBQUQsR0FBQTtpQkFBVyxTQUFBLENBQVUsS0FBVixDQUFnQixDQUFDLFFBQWpCLENBQUEsRUFBWDtRQUFBLENBMUIxQjtBQUFBLFFBMkJBLDZCQUFBLEVBQStCLFNBQUMsS0FBRCxHQUFBO2lCQUFXLFNBQUEsQ0FBVSxLQUFWLENBQWdCLENBQUMsWUFBakIsQ0FBQSxFQUFYO1FBQUEsQ0EzQi9CO0FBQUEsUUE0QkEsOEJBQUEsRUFBZ0MsU0FBQyxLQUFELEdBQUE7aUJBQVcsU0FBQSxDQUFVLEtBQVYsQ0FBZ0IsQ0FBQyxjQUFqQixDQUFBLEVBQVg7UUFBQSxDQTVCaEM7QUFBQSxRQTZCQSw4QkFBQSxFQUFnQyxTQUFDLEtBQUQsR0FBQTtpQkFBVyxTQUFBLENBQVUsS0FBVixDQUFnQixDQUFDLGNBQWpCLENBQUEsRUFBWDtRQUFBLENBN0JoQztBQUFBLFFBOEJBLDhCQUFBLEVBQWdDLFNBQUMsS0FBRCxHQUFBO2lCQUFXLFNBQUEsQ0FBVSxLQUFWLENBQWdCLENBQUMsY0FBakIsQ0FBQSxFQUFYO1FBQUEsQ0E5QmhDO0FBQUEsUUErQkEsc0NBQUEsRUFBd0MsU0FBQyxLQUFELEdBQUE7aUJBQVcsU0FBQSxDQUFVLEtBQVYsQ0FBZ0IsQ0FBQyxvQkFBakIsQ0FBQSxFQUFYO1FBQUEsQ0EvQnhDO0FBQUEsUUFnQ0Esb0NBQUEsRUFBc0MsU0FBQyxLQUFELEdBQUE7aUJBQVcsU0FBQSxDQUFVLEtBQVYsQ0FBZ0IsQ0FBQyxrQkFBakIsQ0FBQSxFQUFYO1FBQUEsQ0FoQ3RDO0FBQUEsUUFpQ0Esd0NBQUEsRUFBMEMsU0FBQyxLQUFELEdBQUE7aUJBQVcsU0FBQSxDQUFVLEtBQVYsQ0FBZ0IsQ0FBQyxzQkFBakIsQ0FBQSxFQUFYO1FBQUEsQ0FqQzFDO0FBQUEsUUFvQ0EsdUJBQUEsRUFBeUIsU0FBQyxLQUFELEdBQUE7aUJBQVcsU0FBQSxDQUFVLEtBQVYsQ0FBZ0IsQ0FBQyxPQUFqQixDQUFBLEVBQVg7UUFBQSxDQXBDekI7QUFBQSxRQXFDQSx3QkFBQSxFQUEwQixTQUFDLEtBQUQsR0FBQTtpQkFBVyxTQUFBLENBQVUsS0FBVixDQUFnQixDQUFDLFFBQWpCLENBQUEsRUFBWDtRQUFBLENBckMxQjtBQUFBLFFBc0NBLGdDQUFBLEVBQWtDLFNBQUMsS0FBRCxHQUFBO2lCQUFXLFNBQUEsQ0FBVSxLQUFWLENBQWdCLENBQUMsZUFBakIsQ0FBQSxFQUFYO1FBQUEsQ0F0Q2xDO0FBQUEsUUF1Q0Esc0NBQUEsRUFBd0MsU0FBQyxLQUFELEdBQUE7aUJBQVcsU0FBQSxDQUFVLEtBQVYsQ0FBZ0IsQ0FBQyxvQkFBakIsQ0FBQSxFQUFYO1FBQUEsQ0F2Q3hDO0FBQUEsUUEwQ0Esa0NBQUEsRUFBb0MsU0FBQyxLQUFELEdBQUE7aUJBQVcsU0FBQSxDQUFVLEtBQVYsQ0FBZ0IsQ0FBQyxpQkFBakIsQ0FBQSxFQUFYO1FBQUEsQ0ExQ3BDO0FBQUEsUUEyQ0EsMEJBQUEsRUFBNEIsU0FBQyxLQUFELEdBQUE7aUJBQVcsU0FBQSxDQUFVLEtBQVYsQ0FBZ0IsQ0FBQyxVQUFqQixDQUFBLEVBQVg7UUFBQSxDQTNDNUI7QUFBQSxRQTRDQSx3QkFBQSxFQUEwQixTQUFDLEtBQUQsR0FBQTtpQkFBVyxTQUFBLENBQVUsS0FBVixDQUFnQixDQUFDLFFBQWpCLENBQUEsRUFBWDtRQUFBLENBNUMxQjtBQUFBLFFBK0NBLGdDQUFBLEVBQWtDLFNBQUMsS0FBRCxHQUFBO2lCQUFXLGVBQUEsQ0FBZ0IsS0FBaEIsRUFBWDtRQUFBLENBL0NsQztBQUFBLFFBZ0RBLGFBQUEsRUFBZSxTQUFDLEtBQUQsR0FBQTtpQkFBVyxTQUFBLENBQVUsS0FBVixDQUFnQixDQUFDLFlBQWpCLENBQUEsRUFBWDtRQUFBLENBaERmO09BRmMsQ0FBaEIsRUFOUTtJQUFBLENBTlY7QUFBQSxJQWdFQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxrQkFBQTs7O2VBQTZELENBQUUsTUFBL0QsQ0FBc0UsY0FBdEU7O09BQUE7O2FBQ1csQ0FBRSxPQUFiLENBQUE7T0FEQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUZkLENBQUE7YUFHQSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQWhCLENBQUEsRUFKVTtJQUFBLENBaEVaO0dBcENGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/C:/Users/MNP/.atom/packages/atomic-emacs/lib/atomic-emacs.coffee
