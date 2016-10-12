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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYXRvbWljLWVtYWNzL2xpYi9tYXJrLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2Q0FBQTs7QUFBQSxFQUFBLE9BQStCLE9BQUEsQ0FBUSxNQUFSLENBQS9CLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0IsYUFBQSxLQUF0QixDQUFBOztBQUFBLEVBQ0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBRFIsQ0FBQTs7QUFBQSxFQWNNO0FBQ0osSUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixFQUFqQixDQUFBOztBQUFBLElBRUEsSUFBQyxDQUFBLGlCQUFELEdBQW9CLFNBQUEsR0FBQTtBQUNsQixVQUFBLHFCQUFBO0FBQUE7QUFBQSxXQUFBLDRDQUFBO3lCQUFBO0FBQ0UsUUFBQSxJQUFJLENBQUMsVUFBTCxDQUFBLENBQUEsQ0FERjtBQUFBLE9BQUE7YUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLE1BQWYsR0FBd0IsRUFITjtJQUFBLENBRnBCLENBQUE7O0FBT2EsSUFBQSxjQUFDLE1BQUQsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxNQUFWLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFELEdBQVUsTUFBTSxDQUFDLE1BRGpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxrQkFBUixDQUEyQixNQUFNLENBQUMsaUJBQVAsQ0FBQSxDQUEzQixDQUZWLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxNQUFELEdBQVUsS0FIVixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsUUFBRCxHQUFZLEtBSlosQ0FEVztJQUFBLENBUGI7O0FBQUEsbUJBY0EsT0FBQSxHQUFTLFNBQUEsR0FB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

//# sourceURL=/C:/Users/MNP/.atom/packages/atomic-emacs/lib/mark.coffee
