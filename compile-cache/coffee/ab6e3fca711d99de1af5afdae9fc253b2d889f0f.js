(function() {
  var Command, Disposable, Input, Project;

  Disposable = require('atom').Disposable;

  Command = null;

  Project = null;

  Input = null;

  module.exports = {
    modules: {
      child_process: require('./child-process')
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
      this.modules.child_process = require('./child-process');
      Command = null;
      Project = null;
      return Input = null;
    },
    activate: function(key) {
      var mod;
      if (key == null) {
        return false;
      }
      mod = this.modules[key];
      if (mod == null) {
        return false;
      }
      if (mod.active != null) {
        return true;
      }
      if (mod.activate == null) {
        return true;
      }
      if (Command == null) {
        Command = require('../provider/command');
      }
      if (Project == null) {
        Project = require('../provider/project');
      }
      if (Input == null) {
        Input = require('../provider/input');
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
      return key === 'child_process';
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9lbnZpcm9ubWVudC9lbnZpcm9ubWVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUNBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLElBRlYsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxJQUhWLENBQUE7O0FBQUEsRUFJQSxLQUFBLEdBQVEsSUFKUixDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsT0FBQSxFQUNFO0FBQUEsTUFBQSxhQUFBLEVBQWUsT0FBQSxDQUFRLGlCQUFSLENBQWY7S0FERjtBQUFBLElBR0EsU0FBQSxFQUFXLFNBQUMsR0FBRCxFQUFNLEdBQU4sR0FBQTtBQUNULE1BQUEsSUFBVSwyQkFBQSxJQUFtQixDQUFBLElBQUssQ0FBQSxVQUFELENBQVksR0FBWixDQUFqQztBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBUSxDQUFBLEdBQUEsQ0FBVCxHQUFnQixHQURoQixDQUFBO2FBRUksSUFBQSxVQUFBLENBQVcsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNiLFVBQUEsS0FBQyxDQUFBLFVBQUQsQ0FBWSxHQUFaLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsWUFBRCxDQUFjLEdBQWQsRUFGYTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVgsRUFISztJQUFBLENBSFg7QUFBQSxJQVdBLFlBQUEsRUFBYyxTQUFDLEdBQUQsR0FBQTthQUNaLE1BQUEsQ0FBQSxJQUFRLENBQUEsT0FBUSxDQUFBLEdBQUEsRUFESjtJQUFBLENBWGQ7QUFBQSxJQWNBLEtBQUEsRUFBTyxTQUFBLEdBQUE7QUFDTCxVQUFBLGlCQUFBO0FBQUE7QUFBQSxXQUFBLDJDQUFBO3FCQUFBO0FBQ0UsUUFBQSxJQUFDLENBQUEsVUFBRCxDQUFZLENBQVosQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsWUFBRCxDQUFjLENBQWQsQ0FEQSxDQURGO0FBQUEsT0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFULEdBQXlCLE9BQUEsQ0FBUSxpQkFBUixDQUh6QixDQUFBO0FBQUEsTUFJQSxPQUFBLEdBQVUsSUFKVixDQUFBO0FBQUEsTUFLQSxPQUFBLEdBQVUsSUFMVixDQUFBO2FBTUEsS0FBQSxHQUFRLEtBUEg7SUFBQSxDQWRQO0FBQUEsSUF1QkEsUUFBQSxFQUFVLFNBQUMsR0FBRCxHQUFBO0FBQ1IsVUFBQSxHQUFBO0FBQUEsTUFBQSxJQUFvQixXQUFwQjtBQUFBLGVBQU8sS0FBUCxDQUFBO09BQUE7QUFBQSxNQUNBLEdBQUEsR0FBTSxJQUFDLENBQUEsT0FBUSxDQUFBLEdBQUEsQ0FEZixDQUFBO0FBRUEsTUFBQSxJQUFvQixXQUFwQjtBQUFBLGVBQU8sS0FBUCxDQUFBO09BRkE7QUFHQSxNQUFBLElBQWUsa0JBQWY7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQUhBO0FBSUEsTUFBQSxJQUFtQixvQkFBbkI7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQUpBOztRQUtBLFVBQVcsT0FBQSxDQUFRLHFCQUFSO09BTFg7O1FBTUEsVUFBVyxPQUFBLENBQVEscUJBQVI7T0FOWDs7UUFPQSxRQUFTLE9BQUEsQ0FBUSxtQkFBUjtPQVBUO0FBQUEsTUFRQSxHQUFHLENBQUMsUUFBSixDQUFhLE9BQWIsRUFBc0IsT0FBdEIsRUFBK0IsS0FBL0IsQ0FSQSxDQUFBO2FBU0EsR0FBRyxDQUFDLE1BQUosR0FBYSxLQVZMO0lBQUEsQ0F2QlY7QUFBQSxJQW1DQSxVQUFBLEVBQVksU0FBQyxHQUFELEdBQUE7QUFDVixVQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxJQUFDLENBQUEsT0FBUSxDQUFBLEdBQUEsQ0FBZixDQUFBO0FBQ0EsTUFBQSxJQUFjLFdBQWQ7QUFBQSxjQUFBLENBQUE7T0FEQTtBQUVBLE1BQUEsSUFBbUIsa0JBQW5CO0FBQUEsZUFBTyxJQUFQLENBQUE7T0FGQTtBQUdBLE1BQUEsSUFBbUIsc0JBQW5CO0FBQUEsZUFBTyxJQUFQLENBQUE7T0FIQTtBQUFBLE1BSUEsR0FBRyxDQUFDLFVBQUosQ0FBQSxDQUpBLENBQUE7QUFBQSxNQUtBLEdBQUcsQ0FBQyxNQUFKLEdBQWEsSUFMYixDQUFBO0FBTUEsYUFBTyxJQUFQLENBUFU7SUFBQSxDQW5DWjtBQUFBLElBNENBLFVBQUEsRUFBWSxTQUFDLEdBQUQsR0FBQTthQUNWLEdBQUEsS0FBTyxnQkFERztJQUFBLENBNUNaO0dBUEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/environment/environment.coffee
