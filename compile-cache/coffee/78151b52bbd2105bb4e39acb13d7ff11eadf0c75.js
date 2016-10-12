(function() {
  var BOB, CLOSERS, CompositeDisposable, EmacsCursor, KillRing, Mark, OPENERS, escapeRegExp;

  KillRing = require('./kill-ring');

  Mark = require('./mark');

  CompositeDisposable = require('atom').CompositeDisposable;

  OPENERS = {
    '(': ')',
    '[': ']',
    '{': '}',
    '\'': '\'',
    '"': '"',
    '`': '`'
  };

  CLOSERS = {
    ')': '(',
    ']': '[',
    '}': '{',
    '\'': '\'',
    '"': '"',
    '`': '`'
  };

  module.exports = EmacsCursor = (function() {
    EmacsCursor["for"] = function(cursor) {
      return cursor._atomicEmacs != null ? cursor._atomicEmacs : cursor._atomicEmacs = new EmacsCursor(cursor);
    };

    function EmacsCursor(cursor) {
      this.cursor = cursor;
      this.editor = this.cursor.editor;
      this._mark = null;
      this._localKillRing = null;
      this._yankMarker = null;
      this._disposable = this.cursor.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this));
    }

    EmacsCursor.prototype.mark = function() {
      return this._mark != null ? this._mark : this._mark = new Mark(this.cursor);
    };

    EmacsCursor.prototype.killRing = function() {
      if (this.editor.hasMultipleCursors()) {
        return this.getLocalKillRing();
      } else {
        return KillRing.global;
      }
    };

    EmacsCursor.prototype.getLocalKillRing = function() {
      return this._localKillRing != null ? this._localKillRing : this._localKillRing = KillRing.global.fork();
    };

    EmacsCursor.prototype.clearLocalKillRing = function() {
      return this._localKillRing = null;
    };

    EmacsCursor.prototype.destroy = function() {
      var _ref, _ref1;
      this._disposable.dispose();
      this._disposable = null;
      if ((_ref = this._yankMarker) != null) {
        _ref.destroy();
      }
      if ((_ref1 = this._mark) != null) {
        _ref1.destroy();
      }
      return delete this.cursor._atomicEmacs;
    };

    EmacsCursor.prototype.locateBackward = function(regExp) {
      return this._locateBackwardFrom(this.cursor.getBufferPosition(), regExp);
    };

    EmacsCursor.prototype.locateForward = function(regExp) {
      return this._locateForwardFrom(this.cursor.getBufferPosition(), regExp);
    };

    EmacsCursor.prototype.locateWordCharacterBackward = function() {
      return this.locateBackward(this._getWordCharacterRegExp());
    };

    EmacsCursor.prototype.locateWordCharacterForward = function() {
      return this.locateForward(this._getWordCharacterRegExp());
    };

    EmacsCursor.prototype.locateNonWordCharacterBackward = function() {
      return this.locateBackward(this._getNonWordCharacterRegExp());
    };

    EmacsCursor.prototype.locateNonWordCharacterForward = function() {
      return this.locateForward(this._getNonWordCharacterRegExp());
    };

    EmacsCursor.prototype.goToMatchStartBackward = function(regExp) {
      var _ref;
      return this._goTo((_ref = this.locateBackward(regExp)) != null ? _ref.start : void 0);
    };

    EmacsCursor.prototype.goToMatchStartForward = function(regExp) {
      var _ref;
      return this._goTo((_ref = this.locateForward(regExp)) != null ? _ref.start : void 0);
    };

    EmacsCursor.prototype.goToMatchEndBackward = function(regExp) {
      var _ref;
      return this._goTo((_ref = this.locateBackward(regExp)) != null ? _ref.end : void 0);
    };

    EmacsCursor.prototype.goToMatchEndForward = function(regExp) {
      var _ref;
      return this._goTo((_ref = this.locateForward(regExp)) != null ? _ref.end : void 0);
    };

    EmacsCursor.prototype.skipCharactersBackward = function(characters) {
      var regexp;
      regexp = new RegExp("[^" + (escapeRegExp(characters)) + "]");
      return this.skipBackwardUntil(regexp);
    };

    EmacsCursor.prototype.skipCharactersForward = function(characters) {
      var regexp;
      regexp = new RegExp("[^" + (escapeRegExp(characters)) + "]");
      return this.skipForwardUntil(regexp);
    };

    EmacsCursor.prototype.skipWordCharactersBackward = function() {
      return this.skipBackwardUntil(this._getNonWordCharacterRegExp());
    };

    EmacsCursor.prototype.skipWordCharactersForward = function() {
      return this.skipForwardUntil(this._getNonWordCharacterRegExp());
    };

    EmacsCursor.prototype.skipNonWordCharactersBackward = function() {
      return this.skipBackwardUntil(this._getWordCharacterRegExp());
    };

    EmacsCursor.prototype.skipNonWordCharactersForward = function() {
      return this.skipForwardUntil(this._getWordCharacterRegExp());
    };

    EmacsCursor.prototype.skipBackwardUntil = function(regexp) {
      if (!this.goToMatchEndBackward(regexp)) {
        return this._goTo(BOB);
      }
    };

    EmacsCursor.prototype.skipForwardUntil = function(regexp) {
      if (!this.goToMatchStartForward(regexp)) {
        return this._goTo(this.editor.getEofBufferPosition());
      }
    };

    EmacsCursor.prototype.horizontalSpaceRange = function() {
      var end, start;
      this.skipCharactersBackward(' \t');
      start = this.cursor.getBufferPosition();
      this.skipCharactersForward(' \t');
      end = this.cursor.getBufferPosition();
      return [start, end];
    };

    EmacsCursor.prototype.transformWord = function(transformer) {
      var end, range, start, text;
      this.skipNonWordCharactersForward();
      start = this.cursor.getBufferPosition();
      this.skipWordCharactersForward();
      end = this.cursor.getBufferPosition();
      range = [start, end];
      text = this.editor.getTextInBufferRange(range);
      return this.editor.setTextInBufferRange(range, transformer(text));
    };

    EmacsCursor.prototype.backwardKillWord = function(method) {
      return this._killUnit(method, (function(_this) {
        return function() {
          var end, start;
          end = _this.cursor.getBufferPosition();
          _this.skipNonWordCharactersBackward();
          _this.skipWordCharactersBackward();
          start = _this.cursor.getBufferPosition();
          return [start, end];
        };
      })(this));
    };

    EmacsCursor.prototype.killWord = function(method) {
      return this._killUnit(method, (function(_this) {
        return function() {
          var end, start;
          start = _this.cursor.getBufferPosition();
          _this.skipNonWordCharactersForward();
          _this.skipWordCharactersForward();
          end = _this.cursor.getBufferPosition();
          return [start, end];
        };
      })(this));
    };

    EmacsCursor.prototype.killLine = function(method) {
      return this._killUnit(method, (function(_this) {
        return function() {
          var end, line, start;
          start = _this.cursor.getBufferPosition();
          line = _this.editor.lineTextForBufferRow(start.row);
          if (/^\s*$/.test(line.slice(start.column))) {
            end = [start.row + 1, 0];
          } else {
            end = [start.row, line.length];
          }
          return [start, end];
        };
      })(this));
    };

    EmacsCursor.prototype.killRegion = function(method) {
      return this._killUnit(method, (function(_this) {
        return function() {
          var position;
          position = _this.cursor.selection.getBufferRange();
          return [position, position];
        };
      })(this));
    };

    EmacsCursor.prototype._killUnit = function(method, findRange) {
      var killRing, range, text;
      if (method == null) {
        method = 'push';
      }
      if ((this.cursor.selection != null) && !this.cursor.selection.isEmpty()) {
        range = this.cursor.selection.getBufferRange();
        this.cursor.selection.clear();
      } else {
        range = findRange();
      }
      text = this.editor.getTextInBufferRange(range);
      this.editor.setTextInBufferRange(range, '');
      killRing = this.killRing();
      killRing[method](text);
      return killRing.getCurrentEntry();
    };

    EmacsCursor.prototype.yank = function() {
      var killRing, newRange, position, range;
      killRing = this.killRing();
      if (killRing.isEmpty()) {
        return;
      }
      if (this.cursor.selection) {
        range = this.cursor.selection.getBufferRange();
        this.cursor.selection.clear();
      } else {
        position = this.cursor.getBufferPosition();
        range = [position, position];
      }
      newRange = this.editor.setTextInBufferRange(range, killRing.getCurrentEntry());
      this.cursor.setBufferPosition(newRange.end);
      if (this._yankMarker == null) {
        this._yankMarker = this.editor.markBufferPosition(this.cursor.getBufferPosition());
      }
      return this._yankMarker.setBufferRange(newRange);
    };

    EmacsCursor.prototype.rotateYank = function(n) {
      var entry, range;
      if (this._yankMarker === null) {
        return;
      }
      entry = this.killRing().rotate(n);
      if (entry !== null) {
        range = this.editor.setTextInBufferRange(this._yankMarker.getBufferRange(), entry);
        return this._yankMarker.setBufferRange(range);
      }
    };

    EmacsCursor.prototype.yankComplete = function() {
      var _ref;
      if ((_ref = this._yankMarker) != null) {
        _ref.destroy();
      }
      return this._yankMarker = null;
    };

    EmacsCursor.prototype._nextCharacterFrom = function(position) {
      var lineLength;
      lineLength = this.editor.lineTextForBufferRow(position.row).length;
      if (position.column === lineLength) {
        if (position.row === this.editor.getLastBufferRow()) {
          return null;
        } else {
          return this.editor.getTextInBufferRange([position, [position.row + 1, 0]]);
        }
      } else {
        return this.editor.getTextInBufferRange([position, position.translate([0, 1])]);
      }
    };

    EmacsCursor.prototype._previousCharacterFrom = function(position) {
      var column;
      if (position.column === 0) {
        if (position.row === 0) {
          return null;
        } else {
          column = this.editor.lineTextForBufferRow(position.row - 1).length;
          return this.editor.getTextInBufferRange([[position.row - 1, column], position]);
        }
      } else {
        return this.editor.getTextInBufferRange([position.translate([0, -1]), position]);
      }
    };

    EmacsCursor.prototype.nextCharacter = function() {
      return this._nextCharacterFrom(this.cursor.getBufferPosition());
    };

    EmacsCursor.prototype.previousCharacter = function() {
      return this._nextCharacterFrom(this.cursor.getBufferPosition());
    };

    EmacsCursor.prototype.skipSexpForward = function() {
      var point, target;
      point = this.cursor.getBufferPosition();
      target = this._sexpForwardFrom(point);
      return this.cursor.setBufferPosition(target);
    };

    EmacsCursor.prototype.skipSexpBackward = function() {
      var point, target;
      point = this.cursor.getBufferPosition();
      target = this._sexpBackwardFrom(point);
      return this.cursor.setBufferPosition(target);
    };

    EmacsCursor.prototype.markSexp = function() {
      var mark, newTail, range;
      range = this.cursor.getMarker().getBufferRange();
      newTail = this._sexpForwardFrom(range.end);
      mark = this.mark().set(newTail);
      if (!mark.isActive()) {
        return mark.activate();
      }
    };

    EmacsCursor.prototype.transposeChars = function() {
      var column, line, pair, pairRange, previousLine, row, _ref;
      _ref = this.cursor.getBufferPosition(), row = _ref.row, column = _ref.column;
      if (row === 0 && column === 0) {
        return;
      }
      line = this.editor.lineTextForBufferRow(row);
      if (column === 0) {
        previousLine = this.editor.lineTextForBufferRow(row - 1);
        pairRange = [[row - 1, previousLine.length], [row, 1]];
      } else if (column === line.length) {
        pairRange = [[row, column - 2], [row, column]];
      } else {
        pairRange = [[row, column - 1], [row, column + 1]];
      }
      pair = this.editor.getTextInBufferRange(pairRange);
      return this.editor.setTextInBufferRange(pairRange, (pair[1] || '') + pair[0]);
    };

    EmacsCursor.prototype.transposeWords = function() {
      var word1, word1Range, word2, word2Range;
      this.skipNonWordCharactersBackward();
      word1Range = this._wordRange();
      this.skipWordCharactersForward();
      this.skipNonWordCharactersForward();
      if (this.editor.getEofBufferPosition().isEqual(this.cursor.getBufferPosition())) {
        return this.skipNonWordCharactersBackward();
      } else {
        word2Range = this._wordRange();
        word1 = this.editor.getTextInBufferRange(word1Range);
        word2 = this.editor.getTextInBufferRange(word2Range);
        this.editor.setTextInBufferRange(word2Range, word1);
        this.editor.setTextInBufferRange(word1Range, word2);
        return this.cursor.setBufferPosition(word2Range[1]);
      }
    };

    EmacsCursor.prototype.transposeLines = function() {
      var lineRange, row, text;
      row = this.cursor.getBufferRow();
      if (row === 0) {
        this._endLineIfNecessary();
        this.cursor.moveDown();
        row += 1;
      }
      this._endLineIfNecessary();
      lineRange = [[row, 0], [row + 1, 0]];
      text = this.editor.getTextInBufferRange(lineRange);
      this.editor.setTextInBufferRange(lineRange, '');
      return this.editor.setTextInBufferRange([[row - 1, 0], [row - 1, 0]], text);
    };

    EmacsCursor.prototype._wordRange = function() {
      var range, wordEnd, wordStart;
      this.skipWordCharactersBackward();
      range = this.locateNonWordCharacterBackward();
      wordStart = range ? range.end : [0, 0];
      range = this.locateNonWordCharacterForward();
      wordEnd = range ? range.start : this.editor.getEofBufferPosition();
      return [wordStart, wordEnd];
    };

    EmacsCursor.prototype._endLineIfNecessary = function() {
      var length, row;
      row = this.cursor.getBufferPosition().row;
      if (row === this.editor.getLineCount() - 1) {
        length = this.cursor.getCurrentBufferLine().length;
        return this.editor.setTextInBufferRange([[row, length], [row, length]], "\n");
      }
    };

    EmacsCursor.prototype._sexpForwardFrom = function(point) {
      var character, eob, eof, quotes, re, result, stack, _ref, _ref1;
      eob = this.editor.getEofBufferPosition();
      point = ((_ref = this._locateForwardFrom(point, /[\w()[\]{}'"]/i)) != null ? _ref.start : void 0) || eob;
      character = this._nextCharacterFrom(point);
      if (OPENERS.hasOwnProperty(character) || CLOSERS.hasOwnProperty(character)) {
        result = null;
        stack = [];
        quotes = 0;
        eof = this.editor.getEofBufferPosition();
        re = /[^()[\]{}"'`\\]+|\\.|[()[\]{}"'`]/g;
        this.editor.scanInBufferRange(re, [point, eof], (function(_this) {
          return function(hit) {
            var closer;
            if (hit.matchText === stack[stack.length - 1]) {
              stack.pop();
              if (stack.length === 0) {
                result = hit.range.end;
                return hit.stop();
              } else if (/^["'`]$/.test(hit.matchText)) {
                return quotes -= 1;
              }
            } else if ((closer = OPENERS[hit.matchText])) {
              if (!(/^["'`]$/.test(closer) && quotes > 0)) {
                stack.push(closer);
                if (/^["'`]$/.test(closer)) {
                  return quotes += 1;
                }
              }
            } else if (CLOSERS[hit.matchText]) {
              if (stack.length === 0) {
                return hit.stop();
              }
            }
          };
        })(this));
        return result || point;
      } else {
        return ((_ref1 = this._locateForwardFrom(point, /\W/i)) != null ? _ref1.start : void 0) || eob;
      }
    };

    EmacsCursor.prototype._sexpBackwardFrom = function(point) {
      var character, quotes, re, result, stack, _ref, _ref1;
      point = ((_ref = this._locateBackwardFrom(point, /[\w()[\]{}'"]/i)) != null ? _ref.end : void 0) || BOB;
      character = this._previousCharacterFrom(point);
      if (OPENERS.hasOwnProperty(character) || CLOSERS.hasOwnProperty(character)) {
        result = null;
        stack = [];
        quotes = 0;
        re = /[^()[\]{}"'`\\]+|\\.|[()[\]{}"'`]/g;
        this.editor.backwardsScanInBufferRange(re, [BOB, point], (function(_this) {
          return function(hit) {
            var opener;
            if (hit.matchText === stack[stack.length - 1]) {
              stack.pop();
              if (stack.length === 0) {
                result = hit.range.start;
                return hit.stop();
              } else if (/^["'`]$/.test(hit.matchText)) {
                return quotes -= 1;
              }
            } else if ((opener = CLOSERS[hit.matchText])) {
              if (!(/^["'`]$/.test(opener) && quotes > 0)) {
                stack.push(opener);
                if (/^["'`]$/.test(opener)) {
                  return quotes += 1;
                }
              }
            } else if (OPENERS[hit.matchText]) {
              if (stack.length === 0) {
                return hit.stop();
              }
            }
          };
        })(this));
        return result || point;
      } else {
        return ((_ref1 = this._locateBackwardFrom(point, /\W/i)) != null ? _ref1.end : void 0) || BOB;
      }
    };

    EmacsCursor.prototype._locateBackwardFrom = function(point, regExp) {
      var result;
      result = null;
      this.editor.backwardsScanInBufferRange(regExp, [BOB, point], function(hit) {
        return result = hit.range;
      });
      return result;
    };

    EmacsCursor.prototype._locateForwardFrom = function(point, regExp) {
      var eof, result;
      result = null;
      eof = this.editor.getEofBufferPosition();
      this.editor.scanInBufferRange(regExp, [point, eof], function(hit) {
        return result = hit.range;
      });
      return result;
    };

    EmacsCursor.prototype._getWordCharacterRegExp = function() {
      var nonWordCharacters;
      nonWordCharacters = atom.config.get('editor.nonWordCharacters');
      return new RegExp('[^\\s' + escapeRegExp(nonWordCharacters) + ']');
    };

    EmacsCursor.prototype._getNonWordCharacterRegExp = function() {
      var nonWordCharacters;
      nonWordCharacters = atom.config.get('editor.nonWordCharacters');
      return new RegExp('[\\s' + escapeRegExp(nonWordCharacters) + ']');
    };

    EmacsCursor.prototype._goTo = function(point) {
      if (point) {
        this.cursor.setBufferPosition(point);
        return true;
      } else {
        return false;
      }
    };

    return EmacsCursor;

  })();

  escapeRegExp = function(string) {
    if (string) {
      return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    } else {
      return '';
    }
  };

  BOB = {
    row: 0,
    column: 0
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYXRvbWljLWVtYWNzL2xpYi9lbWFjcy1jdXJzb3IuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFGQUFBOztBQUFBLEVBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBQVgsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUixDQURQLENBQUE7O0FBQUEsRUFFQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBRkQsQ0FBQTs7QUFBQSxFQUlBLE9BQUEsR0FBVTtBQUFBLElBQUMsR0FBQSxFQUFLLEdBQU47QUFBQSxJQUFXLEdBQUEsRUFBSyxHQUFoQjtBQUFBLElBQXFCLEdBQUEsRUFBSyxHQUExQjtBQUFBLElBQStCLElBQUEsRUFBTSxJQUFyQztBQUFBLElBQTJDLEdBQUEsRUFBSyxHQUFoRDtBQUFBLElBQXFELEdBQUEsRUFBSyxHQUExRDtHQUpWLENBQUE7O0FBQUEsRUFLQSxPQUFBLEdBQVU7QUFBQSxJQUFDLEdBQUEsRUFBSyxHQUFOO0FBQUEsSUFBVyxHQUFBLEVBQUssR0FBaEI7QUFBQSxJQUFxQixHQUFBLEVBQUssR0FBMUI7QUFBQSxJQUErQixJQUFBLEVBQU0sSUFBckM7QUFBQSxJQUEyQyxHQUFBLEVBQUssR0FBaEQ7QUFBQSxJQUFxRCxHQUFBLEVBQUssR0FBMUQ7R0FMVixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsV0FBQyxDQUFBLEtBQUEsQ0FBRCxHQUFNLFNBQUMsTUFBRCxHQUFBOzJDQUNKLE1BQU0sQ0FBQyxlQUFQLE1BQU0sQ0FBQyxlQUFvQixJQUFBLFdBQUEsQ0FBWSxNQUFaLEVBRHZCO0lBQUEsQ0FBTixDQUFBOztBQUdhLElBQUEscUJBQUUs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

//# sourceURL=/C:/Users/MNP/.atom/packages/atomic-emacs/lib/emacs-cursor.coffee
