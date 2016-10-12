(function() {
  var MacroNameSelectListModel, SelectListModel,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SelectListModel = require('./select-list-model');

  module.exports = MacroNameSelectListModel = (function(_super) {
    __extends(MacroNameSelectListModel, _super);

    function MacroNameSelectListModel() {
      return MacroNameSelectListModel.__super__.constructor.apply(this, arguments);
    }

    MacroNameSelectListModel.prototype.existsItem = function(item) {
      var obj, _i, _len, _ref;
      _ref = this.items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obj = _ref[_i];
        if (obj.name === item) {
          return true;
        }
      }
      return false;
    };

    MacroNameSelectListModel.prototype.addItem = function(item) {
      if (this.items == null) {
        this.items = [];
      }
      if (!this.existsItem(item)) {
        return this.items.push({
          name: item
        });
      }
    };

    return MacroNameSelectListModel;

  })(SelectListModel);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYXRvbS1rZXlib2FyZC1tYWNyb3MvbGliL21hY3JvLW5hbWUtc2VsZWN0LWxpc3QtbW9kZWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxxQkFBUixDQUFsQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLCtDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx1Q0FBQSxVQUFBLEdBQVksU0FBQyxJQUFELEdBQUE7QUFDVixVQUFBLG1CQUFBO0FBQUE7QUFBQSxXQUFBLDJDQUFBO3VCQUFBO0FBQ0UsUUFBQSxJQUFHLEdBQUcsQ0FBQyxJQUFKLEtBQVksSUFBZjtBQUNFLGlCQUFPLElBQVAsQ0FERjtTQURGO0FBQUEsT0FBQTthQUdBLE1BSlU7SUFBQSxDQUFaLENBQUE7O0FBQUEsdUNBTUEsT0FBQSxHQUFTLFNBQUMsSUFBRCxHQUFBOztRQUNQLElBQUMsQ0FBQSxRQUFTO09BQVY7QUFDQSxNQUFBLElBQUEsQ0FBQSxJQUFRLENBQUEsVUFBRCxDQUFZLElBQVosQ0FBUDtlQUNFLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUNFO0FBQUEsVUFBQSxJQUFBLEVBQU0sSUFBTjtTQURGLEVBREY7T0FGTztJQUFBLENBTlQsQ0FBQTs7b0NBQUE7O0tBRHFDLGdCQUh2QyxDQUFBO0FBQUEiCn0=

//# sourceURL=/C:/Users/MNP/.atom/packages/atom-keyboard-macros/lib/macro-name-select-list-model.coffee
