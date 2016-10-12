(function() {
  var FilenameSelectListModel, SelectListModel, fs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fs = require('fs');

  SelectListModel = require('./select-list-model');

  module.exports = FilenameSelectListModel = (function(_super) {
    __extends(FilenameSelectListModel, _super);

    function FilenameSelectListModel(macro_dirname) {
      this.macro_dirname = macro_dirname;
    }

    FilenameSelectListModel.prototype.getListOfItems = function() {
      var exists, filename, _i, _len, _ref;
      exists = fs.existsSync(this.macro_dirname);
      if (!exists) {
        return [];
      }
      this.items = [];
      _ref = fs.readdirSync(this.macro_dirname);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        filename = _ref[_i];
        this.items.push({
          name: filename
        });
      }
      return this.items;
    };

    return FilenameSelectListModel;

  })(SelectListModel);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYXRvbS1rZXlib2FyZC1tYWNyb3MvbGliL2ZpbGVuYW1lLXNlbGVjdC1saXN0LW1vZGVsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0Q0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSLENBRGxCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osOENBQUEsQ0FBQTs7QUFBYSxJQUFBLGlDQUFFLGFBQUYsR0FBQTtBQUFrQixNQUFqQixJQUFDLENBQUEsZ0JBQUEsYUFBZ0IsQ0FBbEI7SUFBQSxDQUFiOztBQUFBLHNDQUVBLGNBQUEsR0FBZ0IsU0FBQSxHQUFBO0FBQ2QsVUFBQSxnQ0FBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLEVBQUUsQ0FBQyxVQUFILENBQWMsSUFBQyxDQUFBLGFBQWYsQ0FBVCxDQUFBO0FBQ0EsTUFBQSxJQUFBLENBQUEsTUFBQTtBQUNFLGVBQU8sRUFBUCxDQURGO09BREE7QUFBQSxNQUlBLElBQUMsQ0FBQSxLQUFELEdBQVMsRUFKVCxDQUFBO0FBS0E7QUFBQSxXQUFBLDJDQUFBOzRCQUFBO0FBQ0UsUUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLFFBQU47U0FERixDQUFBLENBREY7QUFBQSxPQUxBO2FBU0EsSUFBQyxDQUFBLE1BVmE7SUFBQSxDQUZoQixDQUFBOzttQ0FBQTs7S0FEb0MsZ0JBSnRDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/C:/Users/MNP/.atom/packages/atom-keyboard-macros/lib/filename-select-list-model.coffee
