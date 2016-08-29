(function() {
  var TabItem, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  module.exports = TabItem = (function(_super) {
    __extends(TabItem, _super);

    function TabItem() {
      return TabItem.__super__.constructor.apply(this, arguments);
    }

    TabItem.content = function() {
      return this.li({
        "class": 'command-item'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'clicker'
          }, function() {
            _this.div({
              "class": 'icon',
              outlet: 'icon'
            });
            return _this.div({
              "class": 'name',
              outlet: 'name'
            });
          });
          return _this.div({
            "class": 'close icon icon-x'
          });
        };
      })(this));
    };

    TabItem.prototype.initialize = function(project, name, close) {
      this.attr('project', project);
      this.attr('name', name);
      return this.find('.close').on('click', close);
    };

    TabItem.prototype.setHeader = function(text) {
      return this.name.text(text);
    };

    TabItem.prototype.setIcon = function(icon) {
      return this.icon[0].className = "icon icon-" + icon;
    };

    return TabItem;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9jb25zb2xlL3RhYi1pdGVtLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxhQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDSiw4QkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxPQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxRQUFBLE9BQUEsRUFBTyxjQUFQO09BQUosRUFBMkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUN6QixVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxTQUFQO1dBQUwsRUFBdUIsU0FBQSxHQUFBO0FBQ3JCLFlBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLE1BQVA7QUFBQSxjQUFlLE1BQUEsRUFBUSxNQUF2QjthQUFMLENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sTUFBUDtBQUFBLGNBQWUsTUFBQSxFQUFRLE1BQXZCO2FBQUwsRUFGcUI7VUFBQSxDQUF2QixDQUFBLENBQUE7aUJBR0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLG1CQUFQO1dBQUwsRUFKeUI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQixFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLHNCQU9BLFVBQUEsR0FBWSxTQUFDLE9BQUQsRUFBVSxJQUFWLEVBQWdCLEtBQWhCLEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxJQUFELENBQU0sU0FBTixFQUFpQixPQUFqQixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxJQUFELENBQU0sTUFBTixFQUFjLElBQWQsQ0FEQSxDQUFBO2FBRUEsSUFBQyxDQUFBLElBQUQsQ0FBTSxRQUFOLENBQWUsQ0FBQyxFQUFoQixDQUFtQixPQUFuQixFQUE0QixLQUE1QixFQUhVO0lBQUEsQ0FQWixDQUFBOztBQUFBLHNCQVlBLFNBQUEsR0FBVyxTQUFDLElBQUQsR0FBQTthQUNULElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLElBQVgsRUFEUztJQUFBLENBWlgsQ0FBQTs7QUFBQSxzQkFlQSxPQUFBLEdBQVMsU0FBQyxJQUFELEdBQUE7YUFDUCxJQUFDLENBQUEsSUFBSyxDQUFBLENBQUEsQ0FBRSxDQUFDLFNBQVQsR0FBc0IsWUFBQSxHQUFZLEtBRDNCO0lBQUEsQ0FmVCxDQUFBOzttQkFBQTs7S0FEb0IsS0FIeEIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/console/tab-item.coffee
