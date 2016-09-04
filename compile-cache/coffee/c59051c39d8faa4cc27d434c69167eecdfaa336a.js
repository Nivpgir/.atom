(function() {
  var Command, Disposable, Input, Project;

  Disposable = require('atom').Disposable;

  Command = null;

  Project = null;

  Input = null;

  module.exports = {
    modules: {
      all: require('./all'),
      regex: require('./regex'),
      profile: require('./profile'),
      remansi: require('./remansi')
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
      this.modules.all = require('./all');
      this.modules.regex = require('./regex');
      this.modules.profile = require('./profile');
      this.modules.remansi = require('./remansi');
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
      return key === 'all' || key === 'regex' || key === 'profile' || key === 'remansi';
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9zdHJlYW0tbW9kaWZpZXJzL21vZGlmaWVycy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUNBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLElBRlYsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxJQUhWLENBQUE7O0FBQUEsRUFJQSxLQUFBLEdBQVEsSUFKUixDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsT0FBQSxFQUNFO0FBQUEsTUFBQSxHQUFBLEVBQUssT0FBQSxDQUFRLE9BQVIsQ0FBTDtBQUFBLE1BQ0EsS0FBQSxFQUFPLE9BQUEsQ0FBUSxTQUFSLENBRFA7QUFBQSxNQUVBLE9BQUEsRUFBUyxPQUFBLENBQVEsV0FBUixDQUZUO0FBQUEsTUFHQSxPQUFBLEVBQVMsT0FBQSxDQUFRLFdBQVIsQ0FIVDtLQURGO0FBQUEsSUFNQSxTQUFBLEVBQVcsU0FBQyxHQUFELEVBQU0sR0FBTixHQUFBO0FBQ1QsTUFBQSxJQUFVLDJCQUFBLElBQW1CLENBQUEsSUFBSyxDQUFBLFVBQUQsQ0FBWSxHQUFaLENBQWpDO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFRLENBQUEsR0FBQSxDQUFULEdBQWdCLEdBRGhCLENBQUE7YUFFSSxJQUFBLFVBQUEsQ0FBVyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ2IsVUFBQSxLQUFDLENBQUEsVUFBRCxDQUFZLEdBQVosQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxZQUFELENBQWMsR0FBZCxFQUZhO1FBQUEsRUFB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

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/stream-modifiers/modifiers.coffee
