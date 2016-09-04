(function() {
  var Command, Disposable, Input, Project, path;

  Disposable = require('atom').Disposable;

  path = require('path');

  Command = null;

  Project = null;

  Input = null;

  module.exports = {
    modules: {
      bt: require('./build-tools'),
      bte: require('./build-tools-external')
    },
    addModule: function(key, mod) {
      if ((this.modules[key] != null) && !this.isCoreName(key)) {
        return;
      }
      this.modules[key] = mod;
      return new Disposable((function(_this) {
        return function() {
          _this.deactivate(key);
          return _this.removeModule(key);
        };
      })(this));
    },
    removeModule: function(key) {
      return delete this.modules[key];
    },
    reset: function() {
      var k, _i, _len, _ref;
      _ref = Object.keys(this.modules);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        k = _ref[_i];
        this.deactivate(k);
        this.removeModule(k);
      }
      this.modules.bt = require('./build-tools');
      this.modules.bte = require('./build-tools-external');
      Command = null;
      Project = null;
      return Input = null;
    },
    activate: function(key) {
      var mod;
      mod = this.modules[key];
      if (mod == null) {
        return;
      }
      if (mod.active != null) {
        return true;
      }
      if (mod.activate == null) {
        return true;
      }
      if (Command == null) {
        Command = require('./command');
      }
      if (Project == null) {
        Project = require('./project');
      }
      if (Input == null) {
        Input = require('./input');
      }
      mod.activate(Command, Project, Input);
      return mod.active = true;
    },
    deactivate: function(key) {
      var mod;
      mod = this.modules[key];
      if (mod == null) {
        return;
      }
      if (mod.active == null) {
        return true;
      }
      if (mod.deactivate == null) {
        return true;
      }
      mod.deactivate();
      mod.active = null;
      return true;
    },
    isCoreName: function(key) {
      return key === 'bt' || key === 'bte';
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9wcm92aWRlci9wcm92aWRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUNBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxJQUhWLENBQUE7O0FBQUEsRUFJQSxPQUFBLEdBQVUsSUFKVixDQUFBOztBQUFBLEVBS0EsS0FBQSxHQUFRLElBTFIsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE9BQUEsRUFDRTtBQUFBLE1BQUEsRUFBQSxFQUFJLE9BQUEsQ0FBUSxlQUFSLENBQUo7QUFBQSxNQUNBLEdBQUEsRUFBSyxPQUFBLENBQVEsd0JBQVIsQ0FETDtLQURGO0FBQUEsSUFJQSxTQUFBLEVBQVcsU0FBQyxHQUFELEVBQU0sR0FBTixHQUFBO0FBQ1QsTUFBQSxJQUFVLDJCQUFBLElBQW1CLENBQUEsSUFBSyxDQUFBLFVBQUQsQ0FBWSxHQUFaLENBQWpDO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFRLENBQUEsR0FBQSxDQUFULEdBQWdCLEdBRGhCLENBQUE7YUFFSSxJQUFBLFVBQUEsQ0FBVyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ2IsVUFBQSxLQUFDLENBQUEsVUFBRCxDQUFZLEdBQVosQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxZQUFELENBQWMsR0FBZCxFQUZhO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWCxFQUhLO0lBQUEsQ0FKWDtBQUFBLElBWUEsWUFBQSxFQUFjLFNBQUMsR0FBRCxHQUFBO2FBQ1osTUFBQSxDQUFBLElBQVEsQ0FBQSxPQUFRLENBQUEsR0FBQSxFQURKO0lBQUEsQ0FaZDtBQUFBLElBZUEsS0FBQSxFQUFPLFNBQUEsR0FBQTtBQUNMLFVBQUEsaUJBQUE7QUFBQTtBQUFBLFdBQUEsMkNBQUE7cUJBQUE7QUFDRSxRQUFBLElBQUMsQ0FBQSxVQUFELENBQVksQ0FBWixDQUFBLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxZQUFELENBQWMsQ0FBZCxDQURBLENBREY7QUFBQSxPQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsR0FBYyxPQUFBLENBQVEsZUFBUixDQUhkLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBVCxHQUFlLE9BQUEsQ0FBUSx3QkFBUixDQUpmLENBQUE7QUFBQSxNQUtBLE9BQUEsR0FBVSxJQUxWLENBQUE7QUFBQSxNQU1BLE9BQUEsR0FBVSxJQU5WLENBQUE7YUFPQSxLQUFBLEdBQVEsS0FSSDtJQUFBLENBZlA7QUFBQSxJQXlCQSxRQUFBLEVBQVUsU0FBQyxHQUFELEdBQUE7QUFDUixVQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxJQUFDLENBQUEsT0FBUSxDQUFBLEdBQUEsQ0FBZixDQUFBO0FBQ0EsTUFBQSxJQUFjLFdBQWQ7QUFBQSxjQUFBLENBQUE7T0FEQTtBQUVBLE1BQUEsSUFBZSxrQkFBZjtBQUFBLGVBQU8sSUFBUCxDQUFBO09BRkE7QUFHQSxNQUFBLElBQW1CLG9CQUFuQjtBQUFBLGVBQU8sSUFBUCxDQUFBO09BSEE7O1FBSUEsVUFBVyxPQUFBLENBQVEsV0FBUjtPQUpYOztRQUtBLFVBQVcsT0FBQSxDQUFRLFdBQVI7T0FMWDs7UUFNQSxRQUFTLE9BQUEsQ0FBUSxTQUFSO09BTlQ7QUFBQSxNQU9BLEdBQUcsQ0FBQyxRQUFKLENBQWEsT0FBYixFQUFzQixPQUF0QixFQUErQixLQUEvQixDQVBBLENBQUE7YUFRQSxHQUFHLENBQUMsTUFBSixHQUFhLEtBVEw7SUFBQSxDQXpCVjtBQUFBLElBb0NBLFVBQUEsRUFBWSxTQUFDLEdBQUQsR0FBQTtBQUNWLFVBQUEsR0FBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLElBQUMsQ0FBQSxPQUFRLENBQUEsR0FBQSxDQUFmLENBQUE7QUFDQSxNQUFBLElBQWMsV0FBZDtBQUFBLGNBQUEsQ0FBQTtPQURBO0FBRUEsTUFBQSxJQUFtQixrQkFBbkI7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQUZBO0FBR0EsTUFBQSxJQUFtQixzQkFBbkI7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQUhBO0FBQUEsTUFJQSxHQUFHLENBQUMsVUFBSixDQUFBLENBSkEsQ0FBQTtBQUFBLE1BS0EsR0FBRyxDQUFDLE1BQUosR0FBYSxJQUxiLENBQUE7QUFNQSxhQUFPLElBQVAsQ0FQVTtJQUFBLENBcENaO0FBQUEsSUE2Q0EsVUFBQSxFQUFZLFNBQUMsR0FBRCxHQUFBO2FBQ1YsR0FBQSxLQUFRLElBQVIsSUFBQSxHQUFBLEtBQWMsTUFESjtJQUFBLENBN0NaO0dBUkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/provider/provider.coffee
