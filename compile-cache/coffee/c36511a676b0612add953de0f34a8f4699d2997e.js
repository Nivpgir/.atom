(function() {
  var PaneInfoView, TextEditor;

  TextEditor = require('atom').TextEditor;

  module.exports = PaneInfoView = (function() {
    function PaneInfoView(pane) {
      this.element = document.createElement('div');
      this.element.classList.add('pane-info');
    }

    PaneInfoView.prototype.destroy = function() {
      return this.element.remove();
    };

    PaneInfoView.prototype.getElement = function() {
      return this.element;
    };

    PaneInfoView.prototype.update = function(pane) {
      var activeItem, p, visiblePanes;
      activeItem = pane.getActiveItem();
      visiblePanes = (function() {
        var _i, _len, _ref, _results;
        _ref = atom.workspace.getPanes();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          p = _ref[_i];
          if (p.paneInfo) {
            _results.push(p);
          }
        }
        return _results;
      })();
      if (visiblePanes.length > 1 && activeItem instanceof TextEditor) {
        this.element.textContent = activeItem != null ? typeof activeItem.getTitle === "function" ? activeItem.getTitle() : void 0 : void 0;
        this.element.hidden = false;
        if (pane.isActive()) {
          return this.element.classList.add('active');
        } else {
          return this.element.classList.remove('active');
        }
      } else {
        return this.element.hidden = true;
      }
    };

    return PaneInfoView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL3BhbmUtaW5mby9saWIvcGFuZS1pbmZvLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdCQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLHNCQUFDLElBQUQsR0FBQTtBQUVYLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLFdBQXZCLENBREEsQ0FGVztJQUFBLENBQWI7O0FBQUEsMkJBS0EsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFBLEVBRE87SUFBQSxDQUxULENBQUE7O0FBQUEsMkJBUUEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxRQURTO0lBQUEsQ0FSWixDQUFBOztBQUFBLDJCQVdBLE1BQUEsR0FBUSxTQUFDLElBQUQsR0FBQTtBQUNOLFVBQUEsMkJBQUE7QUFBQSxNQUFBLFVBQUEsR0FBYSxJQUFJLENBQUMsYUFBTCxDQUFBLENBQWIsQ0FBQTtBQUFBLE1BQ0EsWUFBQTs7QUFBZ0I7QUFBQTthQUFBLDJDQUFBO3VCQUFBO2NBQTBDLENBQUMsQ0FBQztBQUE1QywwQkFBQSxFQUFBO1dBQUE7QUFBQTs7VUFEaEIsQ0FBQTtBQUVBLE1BQUEsSUFBRyxZQUFZLENBQUMsTUFBYixHQUFzQixDQUF0QixJQUE0QixVQUFBLFlBQXNCLFVBQXJEO0FBQ0UsUUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsb0VBQXVCLFVBQVUsQ0FBRSw0QkFBbkMsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULEdBQWtCLEtBRGxCLENBQUE7QUFFQSxRQUFBLElBQUcsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFIO2lCQUNFLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLFFBQXZCLEVBREY7U0FBQSxNQUFBO2lCQUdFLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQW5CLENBQTBCLFFBQTFCLEVBSEY7U0FIRjtPQUFBLE1BQUE7ZUFRRSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsR0FBa0IsS0FScEI7T0FITTtJQUFBLENBWFIsQ0FBQTs7d0JBQUE7O01BSkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/niv/.atom/packages/pane-info/lib/pane-info-view.coffee
