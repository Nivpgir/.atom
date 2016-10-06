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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2F0b21pYy1lbWFjcy9saWIvZW1hY3MtY3Vyc29yLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxRkFBQTs7QUFBQSxFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUFYLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUZELENBQUE7O0FBQUEsRUFJQSxPQUFBLEdBQVU7QUFBQSxJQUFDLEdBQUEsRUFBSyxHQUFOO0FBQUEsSUFBVyxHQUFBLEVBQUssR0FBaEI7QUFBQSxJQUFxQixHQUFBLEVBQUssR0FBMUI7QUFBQSxJQUErQixJQUFBLEVBQU0sSUFBckM7QUFBQSxJQUEyQyxHQUFBLEVBQUssR0FBaEQ7QUFBQSxJQUFxRCxHQUFBLEVBQUssR0FBMUQ7R0FKVixDQUFBOztBQUFBLEVBS0EsT0FBQSxHQUFVO0FBQUEsSUFBQyxHQUFBLEVBQUssR0FBTjtBQUFBLElBQVcsR0FBQSxFQUFLLEdBQWhCO0FBQUEsSUFBcUIsR0FBQSxFQUFLLEdBQTFCO0FBQUEsSUFBK0IsSUFBQSxFQUFNLElBQXJDO0FBQUEsSUFBMkMsR0FBQSxFQUFLLEdBQWhEO0FBQUEsSUFBcUQsR0FBQSxFQUFLLEdBQTFEO0dBTFYsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixJQUFBLFdBQUMsQ0FBQSxLQUFBLENBQUQsR0FBTSxTQUFDLE1BQUQsR0FBQTsyQ0FDSixNQUFNLENBQUMsZUFBUCxNQUFNLENBQUMsZUFBb0IsSUFBQSxXQUFBLENBQVksTUFBWixFQUR2QjtJQUFBLENBQU4sQ0FBQTs7QUFHYSxJQUFBLHFCQUFF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

//# sourceURL=/C:/Users/nivp/.atom/packages/atomic-emacs/lib/emacs-cursor.coffee
