(function() {
  var $, TabView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  module.exports = TabView = (function(_super) {
    __extends(TabView, _super);

    function TabView() {
      return TabView.__super__.constructor.apply(this, arguments);
    }

    TabView.content = function() {
      return this.div({
        "class": 'output'
      });
    };

    TabView.prototype.printLine = function(line) {
      this.append(line);
      if (!this.hasClass('hidden')) {
        this.parent().scrollTop(this[0].scrollHeight);
      }
      return this[0].children[this[0].children.length - 1];
    };

    TabView.prototype.scroll = function() {
      if (!this.hasClass('hidden')) {
        return this.parent().scrollTop(this[0].scrollHeight);
      }
    };

    TabView.prototype.clear = function() {
      return this.empty();
    };

    TabView.prototype.finishConsole = function(opener) {
      this.find('.filelink').off('click');
      return this.find('.filelink').on('click', function() {
        var e, linecol, lineno;
        e = $(this);
        lineno = parseInt(e.attr('row'));
        linecol = parseInt(e.attr('col'));
        if (e.attr('name') !== '') {
          if (opener != null) {
            return opener(e);
          }
          return atom.workspace.open(e.attr('name'), {
            initialLine: lineno - 1,
            initialColumn: linecol - 1
          });
        }
      });
    };

    return TabView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9jb25zb2xlL3RhYi12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBWSxPQUFBLENBQVEsc0JBQVIsQ0FBWixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFBSixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNKLDhCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLE9BQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLFFBQVA7T0FBTCxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLHNCQUdBLFNBQUEsR0FBVyxTQUFDLElBQUQsR0FBQTtBQUNULE1BQUEsSUFBQyxDQUFBLE1BQUQsQ0FBUSxJQUFSLENBQUEsQ0FBQTtBQUNBLE1BQUEsSUFBQSxDQUFBLElBQStDLENBQUEsUUFBRCxDQUFVLFFBQVYsQ0FBOUM7QUFBQSxRQUFBLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBUyxDQUFDLFNBQVYsQ0FBb0IsSUFBRSxDQUFBLENBQUEsQ0FBRSxDQUFDLFlBQXpCLENBQUEsQ0FBQTtPQURBO0FBRUEsYUFBTyxJQUFFLENBQUEsQ0FBQSxDQUFFLENBQUMsUUFBUyxDQUFBLElBQUUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxRQUFRLENBQUMsTUFBZCxHQUF1QixDQUF2QixDQUFyQixDQUhTO0lBQUEsQ0FIWCxDQUFBOztBQUFBLHNCQVFBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixNQUFBLElBQUEsQ0FBQSxJQUErQyxDQUFBLFFBQUQsQ0FBVSxRQUFWLENBQTlDO2VBQUEsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFTLENBQUMsU0FBVixDQUFvQixJQUFFLENBQUEsQ0FBQSxDQUFFLENBQUMsWUFBekIsRUFBQTtPQURNO0lBQUEsQ0FSUixDQUFBOztBQUFBLHNCQVdBLEtBQUEsR0FBTyxTQUFBLEdBQUE7YUFDTCxJQUFDLENBQUEsS0FBRCxDQUFBLEVBREs7SUFBQSxDQVhQLENBQUE7O0FBQUEsc0JBY0EsYUFBQSxHQUFlLFNBQUMsTUFBRCxHQUFBO0FBQ2IsTUFBQSxJQUFDLENBQUEsSUFBRCxDQUFNLFdBQU4sQ0FBa0IsQ0FBQyxHQUFuQixDQUF1QixPQUF2QixDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsSUFBRCxDQUFNLFdBQU4sQ0FBa0IsQ0FBQyxFQUFuQixDQUFzQixPQUF0QixFQUErQixTQUFBLEdBQUE7QUFDN0IsWUFBQSxrQkFBQTtBQUFBLFFBQUEsQ0FBQSxHQUFJLENBQUEsQ0FBRSxJQUFGLENBQUosQ0FBQTtBQUFBLFFBQ0EsTUFBQSxHQUFTLFFBQUEsQ0FBUyxDQUFDLENBQUMsSUFBRixDQUFPLEtBQVAsQ0FBVCxDQURULENBQUE7QUFBQSxRQUVBLE9BQUEsR0FBVSxRQUFBLENBQVMsQ0FBQyxDQUFDLElBQUYsQ0FBTyxLQUFQLENBQVQsQ0FGVixDQUFBO0FBR0EsUUFBQSxJQUFHLENBQUMsQ0FBQyxJQUFGLENBQU8sTUFBUCxDQUFBLEtBQW9CLEVBQXZCO0FBQ0UsVUFBQSxJQUFvQixjQUFwQjtBQUFBLG1CQUFPLE1BQUEsQ0FBTyxDQUFQLENBQVAsQ0FBQTtXQUFBO2lCQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixDQUFDLENBQUMsSUFBRixDQUFPLE1BQVAsQ0FBcEIsRUFDRTtBQUFBLFlBQUEsV0FBQSxFQUFhLE1BQUEsR0FBUyxDQUF0QjtBQUFBLFlBQ0EsYUFBQSxFQUFlLE9BQUEsR0FBVSxDQUR6QjtXQURGLEVBRkY7U0FKNkI7TUFBQSxDQUEvQixFQUZhO0lBQUEsQ0FkZixDQUFBOzttQkFBQTs7S0FEb0IsS0FIeEIsQ0FBQTtBQUFBIgp9

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/console/tab-view.coffee
