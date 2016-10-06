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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2F0b21pYy1lbWFjcy9saWIvYXRvbWljLWVtYWNzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2SEFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQURkLENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBRmQsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUhYLENBQUE7O0FBQUEsRUFJQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FKUCxDQUFBOztBQUFBLEVBS0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBTFIsQ0FBQTs7QUFBQSxFQU9BLGFBQUEsR0FBZ0IsU0FBQyxLQUFELEdBQUE7V0FDZCxLQUFLLENBQUMsYUFBTixDQUFvQixLQUFwQixFQURjO0VBQUEsQ0FQaEIsQ0FBQTs7QUFBQSxFQVVBLFlBQUEsR0FBZSxTQUFDLEtBQUQsR0FBQTtBQUNiLFFBQUEsd0NBQUE7QUFBQSxJQUFBLElBQUksQ0FBQyxpQkFBTCxDQUFBLENBQUEsQ0FBQTtBQUVBLElBQUEsSUFBRyxLQUFLLENBQUMsWUFBTixDQUFBLENBQUg7QUFDRSxNQUFBLFdBQUEsR0FBYyxTQUFBLENBQVUsS0FBVixDQUFkLENBQUE7QUFDQTtBQUFBLFdBQUEsMkNBQUE7K0JBQUE7QUFDRSxRQUFBLFdBQVcsQ0FBQyxZQUFaLENBQUEsQ0FBQSxDQURGO0FBQUEsT0FGRjtLQUZBO1dBT0EsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsS0FBbkIsRUFSYTtFQUFBLENBVmYsQ0FBQTs7QUFBQSxFQW9CQSxT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

//# sourceURL=/C:/Users/nivp/.atom/packages/atomic-emacs/lib/atomic-emacs.coffee
