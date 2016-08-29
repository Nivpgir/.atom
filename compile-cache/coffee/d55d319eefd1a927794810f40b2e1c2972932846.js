(function() {
  var $$, SelectListView, SelectionView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  module.exports = SelectionView = (function(_super) {
    __extends(SelectionView, _super);

    function SelectionView() {
      return SelectionView.__super__.constructor.apply(this, arguments);
    }

    SelectionView.prototype.initialize = function() {
      SelectionView.__super__.initialize.apply(this, arguments);
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.focusFilterEditor();
    };

    SelectionView.prototype.viewForItem = function(item) {
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'command-name'
            }, item.name);
            return _this.div({
              "class": 'text-subtle'
            }, "" + item.singular + " (" + item.origin + ")");
          };
        })(this));
      });
    };

    SelectionView.prototype.confirmed = function(item) {
      this.cancel();
      return this.callback(item);
    };

    SelectionView.prototype.cancel = function() {
      var _ref1;
      SelectionView.__super__.cancel.apply(this, arguments);
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    SelectionView.prototype.getFilterKey = function() {
      return 'name';
    };

    return SelectionView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi92aWV3L3NlbGVjdGlvbi12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1Q0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsVUFBQSxFQUFELEVBQUssc0JBQUEsY0FBTCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNKLG9DQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSw0QkFBQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSwrQ0FBQSxTQUFBLENBQUEsQ0FBQTs7UUFDQSxJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7QUFBQSxVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTdCO09BRFY7QUFBQSxNQUVBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBLENBRkEsQ0FBQTthQUdBLElBQUMsQ0FBQSxpQkFBRCxDQUFBLEVBSlU7SUFBQSxDQUFaLENBQUE7O0FBQUEsNEJBTUEsV0FBQSxHQUFhLFNBQUMsSUFBRCxHQUFBO2FBQ1gsRUFBQSxDQUFHLFNBQUEsR0FBQTtlQUNELElBQUMsQ0FBQSxFQUFELENBQUksQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDRixZQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxjQUFQO2FBQUwsRUFBNEIsSUFBSSxDQUFDLElBQWpDLENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sYUFBUDthQUFMLEVBQTJCLEVBQUEsR0FBRyxJQUFJLENBQUMsUUFBUixHQUFpQixJQUFqQixHQUFxQixJQUFJLENBQUMsTUFBMUIsR0FBaUMsR0FBNUQsRUFGRTtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUosRUFEQztNQUFBLENBQUgsRUFEVztJQUFBLENBTmIsQ0FBQTs7QUFBQSw0QkFZQSxTQUFBLEdBQVcsU0FBQyxJQUFELEdBQUE7QUFDVCxNQUFBLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFWLEVBRlM7SUFBQSxDQVpYLENBQUE7O0FBQUEsNEJBZ0JBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixVQUFBLEtBQUE7QUFBQSxNQUFBLDJDQUFBLFNBQUEsQ0FBQSxDQUFBO2lEQUNNLENBQUUsSUFBUixDQUFBLFdBRk07SUFBQSxDQWhCUixDQUFBOztBQUFBLDRCQW9CQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQ1osT0FEWTtJQUFBLENBcEJkLENBQUE7O3lCQUFBOztLQUQwQixlQUg5QixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/view/selection-view.coffee
