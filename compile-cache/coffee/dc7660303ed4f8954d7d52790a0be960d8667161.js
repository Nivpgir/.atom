(function() {
  var LocationSelectList, SelectListView, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SelectListView = require('atom-space-pen-views').SelectListView;

  path = require('path');

  module.exports = LocationSelectList = (function(_super) {
    __extends(LocationSelectList, _super);

    function LocationSelectList() {
      return LocationSelectList.__super__.constructor.apply(this, arguments);
    }

    LocationSelectList.prototype.initialize = function(editor, callback) {
      LocationSelectList.__super__.initialize.apply(this, arguments);
      this.addClass('overlay from-top');
      this.editor = editor;
      this.callback = callback;
      this.storeFocusedElement();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.focusFilterEditor();
    };

    LocationSelectList.prototype.viewForItem = function(item) {
      var f;
      if (item[0] === '<stdin>') {
        return "<li class=\"event\">" + item[1] + ":" + item[2] + "</li>";
      } else {
        f = path.join(item[0]);
        return "<li class=\"event\">" + f + "  " + item[1] + ":" + item[2] + "</li>";
      }
    };

    LocationSelectList.prototype.hide = function() {
      var _ref;
      return (_ref = this.panel) != null ? _ref.hide() : void 0;
    };

    LocationSelectList.prototype.show = function() {
      this.storeFocusedElement();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.focusFilterEditor();
    };

    LocationSelectList.prototype.toggle = function() {
      var _ref;
      if ((_ref = this.panel) != null ? _ref.isVisible() : void 0) {
        return this.cancel();
      } else {
        return this.show();
      }
    };

    LocationSelectList.prototype.confirmed = function(item) {
      this.cancel();
      return this.callback(this.editor, item);
    };

    LocationSelectList.prototype.cancelled = function() {
      return this.hide();
    };

    return LocationSelectList;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1jbGFuZy9saWIvbG9jYXRpb24tc2VsZWN0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxpQkFBa0IsT0FBQSxDQUFRLHNCQUFSLEVBQWxCLGNBQUQsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0oseUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLGlDQUFBLFVBQUEsR0FBWSxTQUFDLE1BQUQsRUFBUyxRQUFULEdBQUE7QUFDVixNQUFBLG9EQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLGtCQUFWLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxNQUZWLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxRQUFELEdBQVksUUFIWixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsbUJBQUQsQ0FBQSxDQUpBLENBQUE7O1FBS0EsSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO0FBQUEsVUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE3QjtPQUxWO0FBQUEsTUFNQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQSxDQU5BLENBQUE7YUFPQSxJQUFDLENBQUEsaUJBQUQsQ0FBQSxFQVJVO0lBQUEsQ0FBWixDQUFBOztBQUFBLGlDQVVBLFdBQUEsR0FBYSxTQUFDLElBQUQsR0FBQTtBQUNYLFVBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBRyxJQUFLLENBQUEsQ0FBQSxDQUFMLEtBQVcsU0FBZDtlQUNHLHNCQUFBLEdBQXNCLElBQUssQ0FBQSxDQUFBLENBQTNCLEdBQThCLEdBQTlCLEdBQWlDLElBQUssQ0FBQSxDQUFBLENBQXRDLEdBQXlDLFFBRDVDO09BQUEsTUFBQTtBQUdFLFFBQUEsQ0FBQSxHQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSyxDQUFBLENBQUEsQ0FBZixDQUFKLENBQUE7ZUFDQyxzQkFBQSxHQUFzQixDQUF0QixHQUF3QixJQUF4QixHQUE0QixJQUFLLENBQUEsQ0FBQSxDQUFqQyxHQUFvQyxHQUFwQyxHQUF1QyxJQUFLLENBQUEsQ0FBQSxDQUE1QyxHQUErQyxRQUpsRDtPQURXO0lBQUEsQ0FWYixDQUFBOztBQUFBLGlDQWlCQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQUcsVUFBQSxJQUFBOytDQUFNLENBQUUsSUFBUixDQUFBLFdBQUg7SUFBQSxDQWpCTixDQUFBOztBQUFBLGlDQW1CQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osTUFBQSxJQUFDLENBQUEsbUJBQUQsQ0FBQSxDQUFBLENBQUE7O1FBQ0EsSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO0FBQUEsVUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE3QjtPQURWO0FBQUEsTUFFQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQSxDQUZBLENBQUE7YUFHQSxJQUFDLENBQUEsaUJBQUQsQ0FBQSxFQUpJO0lBQUEsQ0FuQk4sQ0FBQTs7QUFBQSxpQ0F5QkEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFVBQUEsSUFBQTtBQUFBLE1BQUEsc0NBQVMsQ0FBRSxTQUFSLENBQUEsVUFBSDtlQUNFLElBQUMsQ0FBQSxNQUFELENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsSUFBRCxDQUFBLEVBSEY7T0FETTtJQUFBLENBekJSLENBQUE7O0FBQUEsaUNBK0JBLFNBQUEsR0FBVyxTQUFDLElBQUQsR0FBQTtBQUNULE1BQUEsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLElBQUMsQ0FBQSxNQUFYLEVBQW1CLElBQW5CLEVBRlM7SUFBQSxDQS9CWCxDQUFBOztBQUFBLGlDQW1DQSxTQUFBLEdBQVcsU0FBQSxHQUFBO2FBQ1QsSUFBQyxDQUFBLElBQUQsQ0FBQSxFQURTO0lBQUEsQ0FuQ1gsQ0FBQTs7OEJBQUE7O0tBRCtCLGVBSmpDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/niv/.atom/packages/autocomplete-clang/lib/location-select-view.coffee
