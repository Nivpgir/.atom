(function() {
  var Command, Disposable, Input, Project, path;

  Disposable = require('atom').Disposable;

  path = require('path');

  Command = null;

  Project = null;

  Input = null;

  module.exports = {
    modules: {
      shell: require('./shell'),
      wildcards: require('./wildcards'),
      save_all: require('./save_all'),
      env: require('./env'),
      dependency: require('./dependency')
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
      this.modules.shell = require('./shell');
      this.modules.wildcards = require('./wildcards');
      this.modules.save_all = require('./save_all');
      this.modules.env = require('./env');
      this.modules.dependency = require('./dependency');
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
      return key === 'shell' || key === 'wildcards' || key === 'save_all' || key === 'env' || key === 'dependency';
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9tb2RpZmllci9tb2RpZmllci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUNBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxJQUhWLENBQUE7O0FBQUEsRUFJQSxPQUFBLEdBQVUsSUFKVixDQUFBOztBQUFBLEVBS0EsS0FBQSxHQUFRLElBTFIsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE9BQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLE9BQUEsQ0FBUSxTQUFSLENBQVA7QUFBQSxNQUNBLFNBQUEsRUFBVyxPQUFBLENBQVEsYUFBUixDQURYO0FBQUEsTUFFQSxRQUFBLEVBQVUsT0FBQSxDQUFRLFlBQVIsQ0FGVjtBQUFBLE1BR0EsR0FBQSxFQUFLLE9BQUEsQ0FBUSxPQUFSLENBSEw7QUFBQSxNQUlBLFVBQUEsRUFBWSxPQUFBLENBQVEsY0FBUixDQUpaO0tBREY7QUFBQSxJQU9BLFNBQUEsRUFBVyxTQUFDLEdBQUQsRUFBTSxHQUFOLEdBQUE7QUFDVCxNQUFBLElBQVUsMkJBQUEsSUFBbUIsQ0FBQSxJQUFLLENBQUEsVUFBRCxDQUFZLEdBQVosQ0FBakM7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQVEsQ0FBQSxHQUFBLENBQVQsR0FBZ0IsR0FEaEIsQ0FBQTthQUVJLElBQUEsVUFBQSxDQUFXLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDYixVQUFBLEtB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

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/modifier/modifier.coffee
