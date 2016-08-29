(function() {
  var $$, Modifiers, StreamInfoPane, buildPane;

  Modifiers = require('../stream-modifiers/modifiers');

  $$ = require('atom-space-pen-views').$$;

  buildPane = function(Element, name, command, config) {
    var el, element;
    if (name != null) {
      element = $$(function() {
        return this.div({
          "class": 'inset-panel'
        }, (function(_this) {
          return function() {
            _this.div({
              "class": 'panel-heading'
            }, name);
            if (Element != null) {
              return _this.div({
                "class": 'panel-body padded'
              });
            }
          };
        })(this));
      });
    } else {
      element = $$(function() {
        return this.div({
          "class": 'inset-panel'
        }, (function(_this) {
          return function() {
            return _this.div({
              "class": 'panel-body padded'
            });
          };
        })(this));
      });
    }
    if (Element != null) {
      el = new Element(command, config);
      element.find('.panel-body').append(el.element);
    }
    return element[0];
  };

  module.exports = StreamInfoPane = (function() {
    function StreamInfoPane(command, data) {
      var config, keys, mod, name, values, _i, _len, _ref, _ref1;
      this.element = document.createElement('div');
      keys = document.createElement('div');
      values = document.createElement('div');
      _ref = data.pipeline;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], name = _ref1.name, config = _ref1.config;
        if (!Modifiers.activate(name)) {
          continue;
        }
        if (Modifiers.modules[name]["private"]) {
          continue;
        }
        mod = Modifiers.modules[name];
        this.element.appendChild(buildPane(mod.info, mod.name, command, config));
      }
      this.element.appendChild(keys);
      this.element.appendChild(values);
    }

    return StreamInfoPane;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi92aWV3L2NvbW1hbmQtaW5mby1zdHJlYW0tcGFuZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0NBQUE7O0FBQUEsRUFBQSxTQUFBLEdBQVksT0FBQSxDQUFRLCtCQUFSLENBQVosQ0FBQTs7QUFBQSxFQUVDLEtBQU0sT0FBQSxDQUFRLHNCQUFSLEVBQU4sRUFGRCxDQUFBOztBQUFBLEVBSUEsU0FBQSxHQUFZLFNBQUMsT0FBRCxFQUFVLElBQVYsRUFBZ0IsT0FBaEIsRUFBeUIsTUFBekIsR0FBQTtBQUNWLFFBQUEsV0FBQTtBQUFBLElBQUEsSUFBRyxZQUFIO0FBQ0UsTUFBQSxPQUFBLEdBQVUsRUFBQSxDQUFHLFNBQUEsR0FBQTtlQUNYLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxVQUFBLE9BQUEsRUFBTyxhQUFQO1NBQUwsRUFBMkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDekIsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sZUFBUDthQUFMLEVBQTZCLElBQTdCLENBQUEsQ0FBQTtBQUNBLFlBQUEsSUFBRyxlQUFIO3FCQUNFLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxnQkFBQSxPQUFBLEVBQU8sbUJBQVA7ZUFBTCxFQURGO2FBRnlCO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0IsRUFEVztNQUFBLENBQUgsQ0FBVixDQURGO0tBQUEsTUFBQTtBQU9FLE1BQUEsT0FBQSxHQUFVLEVBQUEsQ0FBRyxTQUFBLEdBQUE7ZUFDWCxJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsVUFBQSxPQUFBLEVBQU8sYUFBUDtTQUFMLEVBQTJCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUN6QixLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sbUJBQVA7YUFBTCxFQUR5QjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNCLEVBRFc7TUFBQSxDQUFILENBQVYsQ0FQRjtLQUFBO0FBVUEsSUFBQSxJQUFHLGVBQUg7QUFDRSxNQUFBLEVBQUEsR0FBUyxJQUFBLE9BQUEsQ0FBUSxPQUFSLEVBQWlCLE1BQWpCLENBQVQsQ0FBQTtBQUFBLE1BQ0EsT0FBTyxDQUFDLElBQVIsQ0FBYSxhQUFiLENBQTJCLENBQUMsTUFBNUIsQ0FBbUMsRUFBRSxDQUFDLE9BQXRDLENBREEsQ0FERjtLQVZBO1dBYUEsT0FBUSxDQUFBLENBQUEsRUFkRTtFQUFBLENBSlosQ0FBQTs7QUFBQSxFQW9CQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBQ1MsSUFBQSx3QkFBQyxPQUFELEVBQVUsSUFBVixHQUFBO0FBQ1gsVUFBQSxzREFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFYLENBQUE7QUFBQSxNQUNBLElBQUEsR0FBTyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQURQLENBQUE7QUFBQSxNQUVBLE1BQUEsR0FBUyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUZULENBQUE7QUFHQTtBQUFBLFdBQUEsMkNBQUEsR0FBQTtBQUNFLDBCQURHLGFBQUEsTUFBTSxlQUFBLE1BQ1QsQ0FBQTtBQUFBLFFBQUEsSUFBQSxDQUFBLFNBQXlCLENBQUMsUUFBVixDQUFtQixJQUFuQixDQUFoQjtBQUFBLG1CQUFBO1NBQUE7QUFDQSxRQUFBLElBQVksU0FBUyxDQUFDLE9BQVEsQ0FBQSxJQUFBLENBQUssQ0FBQyxTQUFELENBQW5DO0FBQUEsbUJBQUE7U0FEQTtBQUFBLFFBRUEsR0FBQSxHQUFNLFNBQVMsQ0FBQyxPQUFRLENBQUEsSUFBQSxDQUZ4QixDQUFBO0FBQUEsUUFHQSxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsQ0FBcUIsU0FBQSxDQUFVLEdBQUcsQ0FBQyxJQUFkLEVBQW9CLEdBQUcsQ0FBQyxJQUF4QixFQUE4QixPQUE5QixFQUF1QyxNQUF2QyxDQUFyQixDQUhBLENBREY7QUFBQSxPQUhBO0FBQUEsTUFRQSxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsQ0FBcUIsSUFBckIsQ0FSQSxDQUFBO0FBQUEsTUFTQSxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsQ0FBcUIsTUFBckIsQ0FUQSxDQURXO0lBQUEsQ0FBYjs7MEJBQUE7O01BdEJKLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/view/command-info-stream-pane.coffee
