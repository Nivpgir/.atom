(function() {
  var SelectListModel;

  module.exports = SelectListModel = (function() {
    function SelectListModel() {}

    SelectListModel.prototype.items = null;

    SelectListModel.prototype.getListOfItems = function() {
      return this.items;
    };

    SelectListModel.prototype.addItem = function(item) {
      if (this.items == null) {
        this.items = [];
      }
      if (!this.existsItem(item)) {
        return this.items.push({
          name: item
        });
      }
    };

    SelectListModel.prototype.getFilterKey = function() {
      return 'name';
    };

    SelectListModel.prototype.existsItem = function(item) {
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

    return SelectListModel;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYXRvbS1rZXlib2FyZC1tYWNyb3MvbGliL3NlbGVjdC1saXN0LW1vZGVsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxlQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtpQ0FDSjs7QUFBQSw4QkFBQSxLQUFBLEdBQU8sSUFBUCxDQUFBOztBQUFBLDhCQUtBLGNBQUEsR0FBZ0IsU0FBQSxHQUFBO2FBQ2QsSUFBQyxDQUFBLE1BRGE7SUFBQSxDQUxoQixDQUFBOztBQUFBLDhCQVFBLE9BQUEsR0FBUyxTQUFDLElBQUQsR0FBQTs7UUFDUCxJQUFDLENBQUEsUUFBUztPQUFWO0FBQ0EsTUFBQSxJQUFBLENBQUEsSUFBUSxDQUFBLFVBQUQsQ0FBWSxJQUFaLENBQVA7ZUFDRSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLElBQU47U0FERixFQURGO09BRk87SUFBQSxDQVJULENBQUE7O0FBQUEsOEJBY0EsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUNaLE9BRFk7SUFBQSxDQWRkLENBQUE7O0FBQUEsOEJBMEJBLFVBQUEsR0FBWSxTQUFDLElBQUQsR0FBQTtBQUNWLFVBQUEsbUJBQUE7QUFBQTtBQUFBLFdBQUEsMkNBQUE7dUJBQUE7QUFDRSxRQUFBLElBQUcsR0FBRyxDQUFDLElBQUosS0FBWSxJQUFmO0FBQ0UsaUJBQU8sSUFBUCxDQURGO1NBREY7QUFBQSxPQUFBO2FBR0EsTUFKVTtJQUFBLENBMUJaLENBQUE7OzJCQUFBOztNQUZGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/C:/Users/MNP/.atom/packages/atom-keyboard-macros/lib/select-list-model.coffee
