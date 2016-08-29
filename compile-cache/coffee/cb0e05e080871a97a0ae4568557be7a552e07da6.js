(function() {
  var Command, Disposable, Input, Project;

  Disposable = require('atom').Disposable;

  Command = null;

  Project = null;

  Input = null;

  module.exports = {
    modules: {
      console: require('./console'),
      linter: require('./linter'),
      buffer: require('./buffer'),
      file: require('./file')
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
      this.modules.console = require('./console');
      this.modules.linter = require('./linter');
      this.modules.buffer = require('./buffer');
      this.modules.file = require('./file');
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
      return key === 'console' || key === 'linter' || key === 'buffer' || key === 'file';
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9vdXRwdXQvb3V0cHV0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQ0FBQTs7QUFBQSxFQUFDLGFBQWMsT0FBQSxDQUFRLE1BQVIsRUFBZCxVQUFELENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQVUsSUFGVixDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLElBSFYsQ0FBQTs7QUFBQSxFQUlBLEtBQUEsR0FBUSxJQUpSLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxPQUFBLEVBQ0U7QUFBQSxNQUFBLE9BQUEsRUFBUyxPQUFBLENBQVEsV0FBUixDQUFUO0FBQUEsTUFDQSxNQUFBLEVBQVEsT0FBQSxDQUFRLFVBQVIsQ0FEUjtBQUFBLE1BRUEsTUFBQSxFQUFRLE9BQUEsQ0FBUSxVQUFSLENBRlI7QUFBQSxNQUdBLElBQUEsRUFBTSxPQUFBLENBQVEsUUFBUixDQUhOO0tBREY7QUFBQSxJQU1BLFNBQUEsRUFBVyxTQUFDLEdBQUQsRUFBTSxHQUFOLEdBQUE7QUFDVCxNQUFBLElBQVUsMkJBQUEsSUFBbUIsQ0FBQSxJQUFLLENBQUEsVUFBRCxDQUFZLEdBQVosQ0FBakM7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQVEsQ0FBQSxHQUFBLENBQVQsR0FBZ0IsR0FEaEIsQ0FBQTthQUVJLElBQUEsVUFBQSxDQUFXLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDYixVQUFBLEtBQUMsQ0FBQSxVQUFELENBQVksR0FBWixDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLFlBQUQsQ0FBYyxHQUFkLEVBRmE7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFB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

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/output/output.coffee
