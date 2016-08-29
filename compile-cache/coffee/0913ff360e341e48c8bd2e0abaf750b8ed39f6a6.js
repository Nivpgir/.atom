(function() {
  var $$, OverrideView, SelectListView, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  path = require('path');

  module.exports = OverrideView = (function(_super) {
    __extends(OverrideView, _super);

    function OverrideView() {
      return OverrideView.__super__.constructor.apply(this, arguments);
    }

    OverrideView.prototype.initialize = function(matches) {
      OverrideView.__super__.initialize.apply(this, arguments);
      this.storeFocusedElement();
      this.addClass('symbols-view');
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.setLoading('Looking for methods');
      this.focusFilterEditor();
      this.indent = 0;
      return this.bufferPosition = null;
    };

    OverrideView.prototype.destroy = function() {
      this.cancel();
      return this.panel.destroy();
    };

    OverrideView.prototype.viewForItem = function(_arg) {
      var column, fileName, line, moduleName, name, params, parent, relativePath, _, _ref1;
      parent = _arg.parent, name = _arg.name, params = _arg.params, moduleName = _arg.moduleName, fileName = _arg.fileName, line = _arg.line, column = _arg.column;
      if (!line) {
        return $$(function() {
          return this.li({
            "class": 'two-lines'
          }, (function(_this) {
            return function() {
              _this.div("" + parent + "." + name, {
                "class": 'primary-line'
              });
              return _this.div('builtin', {
                "class": 'secondary-line'
              });
            };
          })(this));
        });
      } else {
        _ref1 = atom.project.relativizePath(fileName), _ = _ref1[0], relativePath = _ref1[1];
        return $$(function() {
          return this.li({
            "class": 'two-lines'
          }, (function(_this) {
            return function() {
              _this.div("" + parent + "." + name, {
                "class": 'primary-line'
              });
              return _this.div("" + relativePath + ", line " + line, {
                "class": 'secondary-line'
              });
            };
          })(this));
        });
      }
    };

    OverrideView.prototype.getFilterKey = function() {
      return 'name';
    };

    OverrideView.prototype.getEmptyMessage = function(itemCount) {
      if (itemCount === 0) {
        return 'No methods found';
      } else {
        return OverrideView.__super__.getEmptyMessage.apply(this, arguments);
      }
    };

    OverrideView.prototype.confirmed = function(_arg) {
      var column, editor, instance, line, line1, line2, name, params, parent, superCall, tabLength, tabText, userIndent;
      parent = _arg.parent, instance = _arg.instance, name = _arg.name, params = _arg.params, line = _arg.line, column = _arg.column;
      this.cancelPosition = null;
      this.cancel();
      editor = atom.workspace.getActiveTextEditor();
      tabLength = editor.getTabLength();
      line1 = "def " + name + "(" + (['self'].concat(params).join(', ')) + "):";
      superCall = "super(" + instance + ", self)." + name + "(" + (params.join(', ')) + ")";
      if (name === '__init__') {
        line2 = "" + superCall;
      } else {
        line2 = "return " + superCall;
      }
      if (this.indent < 1) {
        tabText = editor.getTabText();
        editor.insertText("" + tabText + line1);
        editor.insertNewlineBelow();
        return editor.setTextInBufferRange([[this.bufferPosition.row + 1, 0], [this.bufferPosition.row + 1, tabLength * 2]], "" + tabText + tabText + line2);
      } else {
        userIndent = editor.getTextInRange([[this.bufferPosition.row, 0], [this.bufferPosition.row, this.bufferPosition.column]]);
        editor.insertText("" + line1);
        editor.insertNewlineBelow();
        return editor.setTextInBufferRange([[this.bufferPosition.row + 1, 0], [this.bufferPosition.row + 1, tabLength * 2]], "" + userIndent + userIndent + line2);
      }
    };

    OverrideView.prototype.cancelled = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    return OverrideView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1weXRob24vbGliL292ZXJyaWRlLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUF1QixPQUFBLENBQVEsc0JBQVIsQ0FBdkIsRUFBQyxVQUFBLEVBQUQsRUFBSyxzQkFBQSxjQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLG1DQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSwyQkFBQSxVQUFBLEdBQVksU0FBQyxPQUFELEdBQUE7QUFDVixNQUFBLDhDQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsbUJBQUQsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxRQUFELENBQVUsY0FBVixDQUZBLENBQUE7O1FBR0EsSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO0FBQUEsVUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE3QjtPQUhWO0FBQUEsTUFJQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQSxDQUpBLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxVQUFELENBQVkscUJBQVosQ0FMQSxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsaUJBQUQsQ0FBQSxDQU5BLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FQVixDQUFBO2FBUUEsSUFBQyxDQUFBLGNBQUQsR0FBa0IsS0FUUjtJQUFBLENBQVosQ0FBQTs7QUFBQSwyQkFXQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFDLENB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

//# sourceURL=/home/niv/.atom/packages/autocomplete-python/lib/override-view.coffee
