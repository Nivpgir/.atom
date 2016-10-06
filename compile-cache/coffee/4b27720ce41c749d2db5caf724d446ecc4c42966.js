(function() {
  var CompositeDisposable, PaneInfoView;

  PaneInfoView = require('./pane-info-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    subscriptions: null,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add = atom.workspace.observePanes((function(_this) {
        return function(pane) {
          var paneInfo;
          pane.paneInfo = paneInfo = new PaneInfoView(state);
          atom.views.getView(pane).appendChild(paneInfo.getElement());
          return pane.onDidDestroy(function() {
            pane.paneInfo.destroy();
            pane.paneInfo = null;
            return _this.updatePanes();
          });
        };
      })(this));
      return this.subscriptions.add = atom.workspace.observeActivePaneItem((function(_this) {
        return function() {
          return _this.updatePanes();
        };
      })(this));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    updatePanes: function() {
      return atom.workspace.getPanes().forEach(function(pane) {
        var _ref;
        return (_ref = pane.paneInfo) != null ? _ref.update(pane) : void 0;
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL3BhbmUtaW5mby9saWIvcGFuZS1pbmZvLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpQ0FBQTs7QUFBQSxFQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVIsQ0FBZixDQUFBOztBQUFBLEVBQ0Msc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQURELENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxhQUFBLEVBQWUsSUFBZjtBQUFBLElBRUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixHQUFxQixJQUFJLENBQUMsU0FBUyxDQUFDLFlBQWYsQ0FBNEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxHQUFBO0FBQy9DLGNBQUEsUUFBQTtBQUFBLFVBQUEsSUFBSSxDQUFDLFFBQUwsR0FBZ0IsUUFBQSxHQUFlLElBQUEsWUFBQSxDQUFhLEtBQWIsQ0FBL0IsQ0FBQTtBQUFBLFVBQ0EsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQW5CLENBQXdCLENBQUMsV0FBekIsQ0FBcUMsUUFBUSxDQUFDLFVBQVQsQ0FBQSxDQUFyQyxDQURBLENBQUE7aUJBRUEsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsU0FBQSxHQUFBO0FBQ2hCLFlBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFkLENBQUEsQ0FBQSxDQUFBO0FBQUEsWUFDQSxJQUFJLENBQUMsUUFBTCxHQUFnQixJQURoQixDQUFBO21CQUVBLEtBQUMsQ0FBQSxXQUFELENBQUEsRUFIZ0I7VUFBQSxDQUFsQixFQUgrQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVCLENBRnJCLENBQUE7YUFVQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsR0FBcUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBZixDQUFxQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUN4RCxLQUFDLENBQUEsV0FBRCxDQUFBLEVBRHdEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckMsRUFYYjtJQUFBLENBRlY7QUFBQSxJQWdCQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsRUFEVTtJQUFBLENBaEJaO0FBQUEsSUFtQkEsV0FBQSxFQUFhLFNBQUEsR0FBQTthQUNYLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBZixDQUFBLENBQXlCLENBQUMsT0FBMUIsQ0FBa0MsU0FBQyxJQUFELEdBQUE7QUFDaEMsWUFBQSxJQUFBO29EQUFhLENBQUUsTUFBZixDQUFzQixJQUF0QixXQURnQztNQUFBLENBQWxDLEVBRFc7SUFBQSxDQW5CYjtHQUpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/C:/Users/nivp/.atom/packages/pane-info/lib/pane-info.coffee
