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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYXRvbWljLWVtYWNzL2xpYi9lbWFjcy1lZGl0b3IuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtDQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBQWQsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQURYLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBSFIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixRQUFBLDRCQUFBOztBQUFBLElBQUEsV0FBQyxDQUFBLEtBQUEsQ0FBRCxHQUFNLFNBQUMsTUFBRCxHQUFBOzJDQUNKLE1BQU0sQ0FBQyxlQUFQLE1BQU0sQ0FBQyxlQUFvQixJQUFBLFdBQUEsQ0FBWSxNQUFaLEVBRHZCO0lBQUEsQ0FBTixDQUFBOztBQUdhLElBQUEscUJBQUUsTUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixDQUEwQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3RDLGNBQUEsT0FBQTtBQUFBLFVBQUEsT0FBQSxHQUFVLEtBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFBLENBQVYsQ0FBQTtBQUNBLFVBQUEsSUFBRyxPQUFPLENBQUMsTUFBUixLQUFrQixDQUFyQjttQkFDRSxXQUFXLENBQUMsS0FBRCxDQUFYLENBQWdCLE9BQVEsQ0FBQSxDQUFBLENB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

//# sourceURL=/C:/Users/MNP/.atom/packages/atomic-emacs/lib/emacs-editor.coffee
