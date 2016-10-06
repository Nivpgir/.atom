(function() {
  var CompositeDisposable, Mark, Point, State, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Point = _ref.Point;

  State = require('./state');

  Mark = (function() {
    Mark.deactivatable = [];

    Mark.deactivatePending = function() {
      var mark, _i, _len, _ref1;
      _ref1 = this.deactivatable;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        mark = _ref1[_i];
        mark.deactivate();
      }
      return this.deactivatable.length = 0;
    };

    function Mark(cursor) {
      this.cursor = cursor;
      this.editor = cursor.editor;
      this.marker = this.editor.markBufferPosition(cursor.getBufferPosition());
      this.active = false;
      this.updating = false;
    }

    Mark.prototype.destroy = function() {
      if (this.active) {
        this.deactivate();
      }
      return this.marker.destroy();
    };

    Mark.prototype.set = function(point) {
      if (point == null) {
        point = this.cursor.getBufferPosition();
      }
      this.deactivate();
      this.marker.setHeadBufferPosition(point);
      this._updateSelection();
      return this;
    };

    Mark.prototype.getBufferPosition = function() {
      return this.marker.getHeadBufferPosition();
    };

    Mark.prototype.activate = function() {
      if (!this.active) {
        this.activeSubscriptions = new CompositeDisposable;
        this.activeSubscriptions.add(this.cursor.onDidChangePosition((function(_this) {
          return function(event) {
            return _this._updateSelection(event);
          };
        })(this)));
        this.activeSubscriptions.add(atom.commands.onDidDispatch((function(_this) {
          return function(event) {
            return _this._updateSelection(event);
          };
        })(this)));
        this.activeSubscriptions.add(this.editor.getBuffer().onDidChange((function(_this) {
          return function(event) {
            if (!(_this._isIndent(event) || _this._isOutdent(event))) {
              if (State.isDuringCommand) {
                return Mark.deactivatable.push(_this);
              } else {
                return _this.deactivate();
              }
            }
          };
        })(this)));
        return this.active = true;
      }
    };

    Mark.prototype.deactivate = function() {
      if (this.active) {
        this.activeSubscriptions.dispose();
        this.active = false;
      }
      return this.cursor.clearSelection();
    };

    Mark.prototype.isActive = function() {
      return this.active;
    };

    Mark.prototype.exchange = function() {
      var position;
      position = this.marker.getHeadBufferPosition();
      this.set().activate();
      return this.cursor.setBufferPosition(position);
    };

    Mark.prototype._updateSelection = function(event) {
      var head, tail;
      if (!this.updating) {
        this.updating = true;
        try {
          head = this.cursor.getBufferPosition();
          tail = this.marker.getHeadBufferPosition();
          return this.setSelectionRange(head, tail);
        } finally {
          this.updating = false;
        }
      }
    };

    Mark.prototype.getSelectionRange = function() {
      return this.cursor.selection.getBufferRange();
    };

    Mark.prototype.setSelectionRange = function(head, tail) {
      var reversed;
      reversed = Point.min(head, tail) === head;
      return this.cursor.selection.setBufferRange([head, tail], {
        reversed: reversed
      });
    };

    Mark.prototype._isIndent = function(event) {
      return this._isIndentOutdent(event.newRange, event.newText);
    };

    Mark.prototype._isOutdent = function(event) {
      return this._isIndentOutdent(event.oldRange, event.oldText);
    };

    Mark.prototype._isIndentOutdent = function(range, text) {
      var diff, tabLength;
      tabLength = this.editor.getTabLength();
      diff = range.end.column - range.start.column;
      if (diff === this.editor.getTabLength() && range.start.row === range.end.row && this._checkTextForSpaces(text, tabLength)) {
        return true;
      }
    };

    Mark.prototype._checkTextForSpaces = function(text, tabSize) {
      var ch, _i, _len;
      if (!(text && text.length === tabSize)) {
        return false;
      }
      for (_i = 0, _len = text.length; _i < _len; _i++) {
        ch = text[_i];
        if (ch !== " ") {
          return false;
        }
      }
      return true;
    };

    return Mark;

  })();

  module.exports = Mark;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2F0b21pYy1lbWFjcy9saWIvbWFyay5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkNBQUE7O0FBQUEsRUFBQSxPQUErQixPQUFBLENBQVEsTUFBUixDQUEvQixFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGFBQUEsS0FBdEIsQ0FBQTs7QUFBQSxFQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUixDQURSLENBQUE7O0FBQUEsRUFjTTtBQUNKLElBQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsRUFBakIsQ0FBQTs7QUFBQSxJQUVBLElBQUMsQ0FBQSxpQkFBRCxHQUFvQixTQUFBLEdBQUE7QUFDbEIsVUFBQSxxQkFBQTtBQUFBO0FBQUEsV0FBQSw0Q0FBQTt5QkFBQTtBQUNFLFFBQUEsSUFBSSxDQUFDLFVBQUwsQ0FBQSxDQUFBLENBREY7QUFBQSxPQUFBO2FBRUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxNQUFmLEdBQXdCLEVBSE47SUFBQSxDQUZwQixDQUFBOztBQU9hLElBQUEsY0FBQyxNQUFELEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsTUFBVixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVLE1BQU0sQ0FBQyxNQURqQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxNQUFNLENBQUMsa0JBQVIsQ0FBMkIsTUFBTSxDQUFDLGlCQUFQLENBQUEsQ0FBM0IsQ0FGVixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsTUFBRCxHQUFVLEtBSFYsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUpaLENBRFc7SUFBQSxDQVBiOztBQUFBLG1CQWNBLE9BQUEsR0FBUyxTQUFBLEdB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

//# sourceURL=/C:/Users/nivp/.atom/packages/atomic-emacs/lib/mark.coffee
