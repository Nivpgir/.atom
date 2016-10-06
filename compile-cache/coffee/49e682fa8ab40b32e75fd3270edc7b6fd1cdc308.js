(function() {
  var EmacsCursor, EmacsEditor, KillRing, Mark, State,
    __slice = [].slice;

  EmacsCursor = require('./emacs-cursor');

  KillRing = require('./kill-ring');

  Mark = require('./mark');

  State = require('./state');

  module.exports = EmacsEditor = (function() {
    var capitalize, downcase, upcase;

    EmacsEditor["for"] = function(editor) {
      return editor._atomicEmacs != null ? editor._atomicEmacs : editor._atomicEmacs = new EmacsEditor(editor);
    };

    function EmacsEditor(editor) {
      this.editor = editor;
      this.disposable = this.editor.onDidRemoveCursor((function(_this) {
        return function() {
          var cursors;
          cursors = _this.editor.getCursors();
          if (cursors.length === 1) {
            return EmacsCursor["for"](cursors[0]).clearLocalKillRing();
          }
        };
      })(this));
    }

    EmacsEditor.prototype.destroy = function() {
      return this.disposable.dispose();
    };

    EmacsEditor.prototype.getEmacsCursors = function() {
      var c, _i, _len, _ref, _results;
      _ref = this.editor.getCursors();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        _results.push(EmacsCursor["for"](c));
      }
      return _results;
    };

    EmacsEditor.prototype.moveEmacsCursors = function(callback) {
      return this.editor.moveCursors(function(cursor) {
        if (cursor.destroyed === true) {
          return;
        }
        return callback(EmacsCursor["for"](cursor), cursor);
      });
    };


    /*
    Section: Navigation
     */

    EmacsEditor.prototype.backwardChar = function() {
      return this.editor.moveCursors(function(cursor) {
        return cursor.moveLeft();
      });
    };

    EmacsEditor.prototype.forwardChar = function() {
      return this.editor.moveCursors(function(cursor) {
        return cursor.moveRight();
      });
    };

    EmacsEditor.prototype.backwardWord = function() {
      return this.moveEmacsCursors(function(emacsCursor) {
        emacsCursor.skipNonWordCharactersBackward();
        return emacsCursor.skipWordCharactersBackward();
      });
    };

    EmacsEditor.prototype.forwardWord = function() {
      return this.moveEmacsCursors(function(emacsCursor) {
        emacsCursor.skipNonWordCharactersForward();
        return emacsCursor.skipWordCharactersForward();
      });
    };

    EmacsEditor.prototype.backwardSexp = function() {
      return this.moveEmacsCursors(function(emacsCursor) {
        return emacsCursor.skipSexpBackward();
      });
    };

    EmacsEditor.prototype.forwardSexp = function() {
      return this.moveEmacsCursors(function(emacsCursor) {
        return emacsCursor.skipSexpForward();
      });
    };

    EmacsEditor.prototype.previousLine = function() {
      return this.editor.moveCursors(function(cursor) {
        return cursor.moveUp();
      });
    };

    EmacsEditor.prototype.nextLine = function() {
      return this.editor.moveCursors(function(cursor) {
        return cursor.moveDown();
      });
    };

    EmacsEditor.prototype.backwardParagraph = function() {
      return this.moveEmacsCursors(function(emacsCursor, cursor) {
        var position;
        position = cursor.getBufferPosition();
        if (position.row !== 0) {
          cursor.setBufferPosition([position.row - 1, 0]);
        }
        return emacsCursor.goToMatchStartBackward(/^\s*$/) || cursor.moveToTop();
      });
    };

    EmacsEditor.prototype.forwardParagraph = function() {
      var lastRow;
      lastRow = this.editor.getLastBufferRow();
      return this.moveEmacsCursors(function(emacsCursor, cursor) {
        var position;
        position = cursor.getBufferPosition();
        if (position.row !== lastRow) {
          cursor.setBufferPosition([position.row + 1, 0]);
        }
        return emacsCursor.goToMatchStartForward(/^\s*$/) || cursor.moveToBottom();
      });
    };

    EmacsEditor.prototype.backToIndentation = function() {
      return this.editor.moveCursors((function(_this) {
        return function(cursor) {
          var line, position, targetColumn;
          position = cursor.getBufferPosition();
          line = _this.editor.lineTextForBufferRow(position.row);
          targetColumn = line.search(/\S/);
          if (targetColumn === -1) {
            targetColumn = line.length;
          }
          if (position.column !== targetColumn) {
            return cursor.setBufferPosition([position.row, targetColumn]);
          }
        };
      })(this));
    };


    /*
    Section: Killing & Yanking
     */

    EmacsEditor.prototype.backwardKillWord = function() {
      var kills, method;
      kills = [];
      method = State.killing ? 'prepend' : 'push';
      this.editor.transact((function(_this) {
        return function() {
          return _this.moveEmacsCursors(function(emacsCursor, cursor) {
            return kills.push(emacsCursor.backwardKillWord(method));
          });
        };
      })(this));
      atom.clipboard.write(kills.join("\n"));
      return State.killed();
    };

    EmacsEditor.prototype.killWord = function() {
      var kills, method;
      kills = [];
      method = State.killing ? 'append' : 'push';
      this.editor.transact((function(_this) {
        return function() {
          return _this.moveEmacsCursors(function(emacsCursor) {
            return kills.push(emacsCursor.killWord(method));
          });
        };
      })(this));
      atom.clipboard.write(kills.join("\n"));
      return State.killed();
    };

    EmacsEditor.prototype.killLine = function() {
      var kills, method;
      kills = [];
      method = State.killing ? 'append' : 'push';
      this.editor.transact((function(_this) {
        return function() {
          return _this.moveEmacsCursors(function(emacsCursor) {
            return kills.push(emacsCursor.killLine(method));
          });
        };
      })(this));
      atom.clipboard.write(kills.join("\n"));
      return State.killed();
    };

    EmacsEditor.prototype.killRegion = function() {
      var kills, method;
      kills = [];
      method = State.killing ? 'append' : 'push';
      this.editor.transact((function(_this) {
        return function() {
          return _this.moveEmacsCursors(function(emacsCursor) {
            return kills.push(emacsCursor.killRegion(method));
          });
        };
      })(this));
      atom.clipboard.write(kills.join("\n"));
      return State.killed();
    };

    EmacsEditor.prototype.copyRegionAsKill = function() {
      var kills, method;
      kills = [];
      method = State.killing ? 'append' : 'push';
      this.editor.transact((function(_this) {
        return function() {
          var emacsCursor, selection, _i, _len, _ref, _results;
          _ref = _this.editor.getSelections();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            selection = _ref[_i];
            emacsCursor = EmacsCursor["for"](selection.cursor);
            emacsCursor.killRing()[method](selection.getText());
            kills.push(emacsCursor.killRing().getCurrentEntry());
            _results.push(emacsCursor.mark().deactivate());
          }
          return _results;
        };
      })(this));
      return atom.clipboard.write(kills.join("\n"));
    };

    EmacsEditor.prototype.yank = function() {
      this.editor.transact((function(_this) {
        return function() {
          var emacsCursor, _i, _len, _ref, _results;
          _ref = _this.getEmacsCursors();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            emacsCursor = _ref[_i];
            _results.push(emacsCursor.yank());
          }
          return _results;
        };
      })(this));
      return State.yanked();
    };

    EmacsEditor.prototype.yankPop = function() {
      if (!State.yanking) {
        return;
      }
      this.editor.transact((function(_this) {
        return function() {
          var emacsCursor, _i, _len, _ref, _results;
          _ref = _this.getEmacsCursors();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            emacsCursor = _ref[_i];
            _results.push(emacsCursor.rotateYank(-1));
          }
          return _results;
        };
      })(this));
      return State.yanked();
    };

    EmacsEditor.prototype.yankShift = function() {
      if (!State.yanking) {
        return;
      }
      this.editor.transact((function(_this) {
        return function() {
          var emacsCursor, _i, _len, _ref, _results;
          _ref = _this.getEmacsCursors();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            emacsCursor = _ref[_i];
            _results.push(emacsCursor.rotateYank(1));
          }
          return _results;
        };
      })(this));
      return State.yanked();
    };


    /*
    Section: Editing
     */

    EmacsEditor.prototype.deleteHorizontalSpace = function() {
      return this.editor.transact((function(_this) {
        return function() {
          return _this.moveEmacsCursors(function(emacsCursor) {
            var range;
            range = emacsCursor.horizontalSpaceRange();
            return _this.editor.setTextInBufferRange(range, '');
          });
        };
      })(this));
    };

    EmacsEditor.prototype.deleteIndentation = function() {
      if (!this.editor) {
        return;
      }
      return this.editor.transact((function(_this) {
        return function() {
          _this.editor.moveUp();
          return _this.editor.joinLines();
        };
      })(this));
    };

    EmacsEditor.prototype.openLine = function() {
      return this.editor.transact((function(_this) {
        return function() {
          _this.editor.insertText("\n");
          return _this.editor.moveLeft();
        };
      })(this));
    };

    EmacsEditor.prototype.justOneSpace = function() {
      return this.editor.transact((function(_this) {
        return function() {
          var emacsCursor, range, _i, _len, _ref, _results;
          _ref = _this.getEmacsCursors();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            emacsCursor = _ref[_i];
            range = emacsCursor.horizontalSpaceRange();
            _results.push(_this.editor.setTextInBufferRange(range, ' '));
          }
          return _results;
        };
      })(this));
    };

    EmacsEditor.prototype.transposeChars = function() {
      return this.editor.transact((function(_this) {
        return function() {
          return _this.moveEmacsCursors(function(emacsCursor) {
            return emacsCursor.transposeChars();
          });
        };
      })(this));
    };

    EmacsEditor.prototype.transposeWords = function() {
      return this.editor.transact((function(_this) {
        return function() {
          return _this.moveEmacsCursors(function(emacsCursor) {
            return emacsCursor.transposeWords();
          });
        };
      })(this));
    };

    EmacsEditor.prototype.transposeLines = function() {
      return this.editor.transact((function(_this) {
        return function() {
          return _this.moveEmacsCursors(function(emacsCursor) {
            return emacsCursor.transposeLines();
          });
        };
      })(this));
    };

    downcase = function(s) {
      return s.toLowerCase();
    };

    upcase = function(s) {
      return s.toUpperCase();
    };

    capitalize = function(s) {
      return s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase();
    };

    EmacsEditor.prototype.downcaseWordOrRegion = function() {
      return this._transformWordOrRegion(downcase);
    };

    EmacsEditor.prototype.upcaseWordOrRegion = function() {
      return this._transformWordOrRegion(upcase);
    };

    EmacsEditor.prototype.capitalizeWordOrRegion = function() {
      return this._transformWordOrRegion(capitalize, {
        wordAtATime: true
      });
    };

    EmacsEditor.prototype._transformWordOrRegion = function(transformWord, _arg) {
      var wordAtATime;
      wordAtATime = (_arg != null ? _arg : {}).wordAtATime;
      return this.editor.transact((function(_this) {
        return function() {
          var cursor, _i, _len, _ref;
          if (_this.editor.getSelections().filter(function(s) {
            return !s.isEmpty();
          }).length > 0) {
            return _this.editor.mutateSelectedText(function(selection) {
              var range;
              range = selection.getBufferRange();
              if (wordAtATime) {
                return _this.editor.scanInBufferRange(/\w+/g, range, function(hit) {
                  return hit.replace(transformWord(hit.matchText));
                });
              } else {
                return _this.editor.setTextInBufferRange(range, transformWord(selection.getText()));
              }
            });
          } else {
            _ref = _this.editor.getCursors();
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              cursor = _ref[_i];
              cursor.emitter.__track = true;
            }
            return _this.moveEmacsCursors(function(emacsCursor) {
              return emacsCursor.transformWord(transformWord);
            });
          }
        };
      })(this));
    };


    /*
    Section: Marking & Selecting
     */

    EmacsEditor.prototype.setMark = function() {
      var emacsCursor, _i, _len, _ref, _results;
      _ref = this.getEmacsCursors();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        emacsCursor = _ref[_i];
        _results.push(emacsCursor.mark().set().activate());
      }
      return _results;
    };

    EmacsEditor.prototype.markSexp = function() {
      return this.moveEmacsCursors(function(emacsCursor) {
        return emacsCursor.markSexp();
      });
    };

    EmacsEditor.prototype.markWholeBuffer = function() {
      var c, emacsCursor, first, rest, _i, _len, _ref;
      _ref = this.editor.getCursors(), first = _ref[0], rest = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
      for (_i = 0, _len = rest.length; _i < _len; _i++) {
        c = rest[_i];
        c.destroy();
      }
      emacsCursor = EmacsCursor["for"](first);
      first.moveToBottom();
      emacsCursor.mark().set().activate();
      return first.moveToTop();
    };

    EmacsEditor.prototype.exchangePointAndMark = function() {
      return this.moveEmacsCursors(function(emacsCursor) {
        return emacsCursor.mark().exchange();
      });
    };


    /*
    Section: UI
     */

    EmacsEditor.prototype.recenterTopBottom = function() {
      var c, editorElement, maxOffset, maxRow, minOffset, minRow;
      if (!this.editor) {
        return;
      }
      editorElement = atom.views.getView(this.editor);
      minRow = Math.min.apply(Math, (function() {
        var _i, _len, _ref, _results;
        _ref = this.editor.getCursors();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          _results.push(c.getBufferRow());
        }
        return _results;
      }).call(this));
      maxRow = Math.max.apply(Math, (function() {
        var _i, _len, _ref, _results;
        _ref = this.editor.getCursors();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          _results.push(c.getBufferRow());
        }
        return _results;
      }).call(this));
      minOffset = editorElement.pixelPositionForBufferPosition([minRow, 0]);
      maxOffset = editorElement.pixelPositionForBufferPosition([maxRow, 0]);
      switch (State.recenters) {
        case 0:
          this.editor.setScrollTop((minOffset.top + maxOffset.top - this.editor.getHeight()) / 2);
          break;
        case 1:
          this.editor.setScrollTop(minOffset.top - 2 * this.editor.getLineHeightInPixels());
          break;
        case 2:
          this.editor.setScrollTop(maxOffset.top + 3 * this.editor.getLineHeightInPixels() - this.editor.getHeight());
      }
      return State.recentered();
    };

    EmacsEditor.prototype.scrollUp = function() {
      var currentRow, firstRow, lastRow, rowCount, visibleRowRange;
      if ((visibleRowRange = this.editor.getVisibleRowRange())) {
        firstRow = visibleRowRange[0], lastRow = visibleRowRange[1];
        currentRow = this.editor.cursors[0].getBufferRow();
        rowCount = (lastRow - firstRow) - 2;
        return this.editor.moveDown(rowCount);
      }
    };

    EmacsEditor.prototype.scrollDown = function() {
      var currentRow, firstRow, lastRow, rowCount, visibleRowRange;
      if ((visibleRowRange = this.editor.getVisibleRowRange())) {
        firstRow = visibleRowRange[0], lastRow = visibleRowRange[1];
        currentRow = this.editor.cursors[0].getBufferRow();
        rowCount = (lastRow - firstRow) - 2;
        return this.editor.moveUp(rowCount);
      }
    };


    /*
    Section: Other
     */

    EmacsEditor.prototype.keyboardQuit = function() {
      var emacsCursor, _i, _len, _ref, _results;
      _ref = this.getEmacsCursors();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        emacsCursor = _ref[_i];
        _results.push(emacsCursor.mark().deactivate());
      }
      return _results;
    };

    return EmacsEditor;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2F0b21pYy1lbWFjcy9saWIvZW1hY3MtZWRpdG9yLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrQ0FBQTtJQUFBLGtCQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUFkLENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FEWCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUixDQUhSLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osUUFBQSw0QkFBQTs7QUFBQSxJQUFBLFdBQUMsQ0FBQSxLQUFBLENBQUQsR0FBTSxTQUFDLE1BQUQsR0FBQTsyQ0FDSixNQUFNLENBQUMsZUFBUCxNQUFNLENBQUMsZUFBb0IsSUFBQSxXQUFBLENBQVksTUFBWixFQUR2QjtJQUFBLENBQU4sQ0FBQTs7QUFHYSxJQUFBLHFCQUFFLE1BQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUMsQ0FBQSxNQUFNLENBQUMsaUJBQVIsQ0FBMEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUN0QyxjQUFBLE9BQUE7QUFBQSxVQUFBLE9BQUEsR0FBVSxLQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBQSxDQUFWLENBQUE7QUFDQSxVQUFBLElBQUcsT0FBTyxDQUFDLE1BQVIsS0FBa0IsQ0FBckI7bUJBQ0UsV0FBVyxDQUFDLEtBQUQsQ0FBWCxDQUFnQixPQUFRLENBQUEsQ0FBQSxD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

//# sourceURL=/C:/Users/nivp/.atom/packages/atomic-emacs/lib/emacs-editor.coffee
