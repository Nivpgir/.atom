(function() {
  var Disposable;

  Disposable = require('atom').Disposable;

  module.exports = {
    profiles: {
      gcc_clang: require('./gcc_clang'),
      apm_test: require('./apm_test'),
      java: require('./javac'),
      python: require('./python'),
      modelsim: require('./modelsim')
    },
    versions: {
      gcc_clang: 1,
      apm_test: 1,
      java: 1,
      python: 1,
      modelsim: 1
    },
    addProfile: function(key, profile, version) {
      if (version == null) {
        version = 1;
      }
      if ((this.profiles[key] != null) && !this.isCoreName(key)) {
        return;
      }
      this.profiles[key] = profile;
      this.versions[key] = version;
      return new Disposable((function(_this) {
        return function() {
          return _this.removeProfile(key);
        };
      })(this));
    },
    removeProfile: function(key) {
      delete this.profiles[key];
      return delete this.versions[key];
    },
    reset: function() {
      var k, _i, _len, _ref;
      _ref = Object.keys(this.profiles);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        k = _ref[_i];
        this.removeProfile(k);
      }
      this.profiles.gcc_clang = require('./gcc_clang');
      this.profiles.apm_test = require('./apm_test');
      this.profiles.java = require('./javac');
      this.profiles.python = require('./python');
      this.profiles.modelsim = require('./modelsim');
      this.versions.gcc_clang = 1;
      this.versions.apm_test = 1;
      this.versions.java = 1;
      this.versions.python = 1;
      return this.versions.modelsim = 1;
    },
    isCoreName: function(key) {
      return key === 'gcc_clang' || key === 'apm_test' || key === 'java' || key === 'python' || key === 'modelsim';
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9wcm9maWxlcy9wcm9maWxlcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsVUFBQTs7QUFBQSxFQUFDLGFBQWMsT0FBQSxDQUFRLE1BQVIsRUFBZCxVQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQ0U7QUFBQSxNQUFBLFNBQUEsRUFBVyxPQUFBLENBQVEsYUFBUixDQUFYO0FBQUEsTUFDQSxRQUFBLEVBQVUsT0FBQSxDQUFRLFlBQVIsQ0FEVjtBQUFBLE1BRUEsSUFBQSxFQUFNLE9BQUEsQ0FBUSxTQUFSLENBRk47QUFBQSxNQUdBLE1BQUEsRUFBUSxPQUFBLENBQVEsVUFBUixDQUhSO0FBQUEsTUFJQSxRQUFBLEVBQVUsT0FBQSxDQUFRLFlBQVIsQ0FKVjtLQURGO0FBQUEsSUFPQSxRQUFBLEVBQ0U7QUFBQSxNQUFBLFNBQUEsRUFBVyxDQUFYO0FBQUEsTUFDQSxRQUFBLEVBQVUsQ0FEVjtBQUFBLE1BRUEsSUFBQSxFQUFNLENBRk47QUFBQSxNQUdBLE1BQUEsRUFBUSxDQUhSO0FBQUEsTUFJQSxRQUFBLEVBQVUsQ0FKVjtLQVJGO0FBQUEsSUFjQSxVQUFBLEVBQVksU0FBQyxHQUFELEVBQU0sT0FBTixFQUFlLE9BQWYsR0FBQTs7UUFBZSxVQUFVO09BQ25DO0FBQUEsTUFBQSxJQUFVLDRCQUFBLElBQW9CLENBQUEsSUFBSyxDQUFBLFVBQUQsQ0FBWSxHQUFaLENBQWxDO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxRQUFTLENBQUEsR0FBQSxDQUFWLEdBQWlCLE9BRGpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxRQUFTLENBQUEsR0FBQSxDQUFWLEdBQWlCLE9BRmpCLENBQUE7YUFHSSxJQUFBLFVBQUEsQ0FBVyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNiLEtBQUMsQ0FBQSxhQUFELENBQWUsR0FBZixFQURhO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWCxFQUpNO0lBQUEsQ0FkWjtBQUFBLElBc0JBLGFBQUEsRUFBZSxTQUFDLEdBQUQsR0FBQTtBQUNiLE1BQUEsTUFBQSxDQUFBLElBQVEsQ0FBQSxRQUFTLENBQUEsR0FBQSxDQUFqQixDQUFBO2FBQ0EsTUFBQSxDQUFBLElBQVEsQ0FBQSxRQUFTLENBQUEsR0FBQSxFQUZKO0lBQUEsQ0F0QmY7QUFBQSxJQTBCQSxLQUFBLEVBQU8sU0FBQSxHQUFBO0FBQ0wsVUFBQSxpQkFBQTtBQUFBO0FBQUEsV0FBQSwyQ0FBQTtxQkFBQTtBQUNFLFFBQUEsSUFBQyxDQUFBLGFBQUQsQ0FBZSxDQUFmLENBQUEsQ0FERjtBQUFBLE9BQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxRQUFRLENBQUMsU0FBVixHQUFzQixPQUFBLENBQVEsYUFBUixDQUZ0QixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsUUFBUSxDQUFDLFFBQVYsR0FBcUIsT0FBQSxDQUFRLFlBQVIsQ0FIckIsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLEdBQWlCLE9BQUEsQ0FBUSxTQUFSLENBSmpCLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxRQUFRLENBQUMsTUFBVixHQUFtQixPQUFBLENBQVEsVUFBUixDQUxuQixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsUUFBUSxDQUFDLFFBQVYsR0FBcUIsT0FBQSxDQUFRLFlBQVIsQ0FOckIsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxTQUFWLEdBQXNCLENBUHRCLENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxRQUFRLENBQUMsUUFBVixHQUFxQixDQVJyQixDQUFBO0FBQUEsTUFTQSxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsR0FBaUIsQ0FUakIsQ0FBQTtBQUFBLE1BVUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLEdBQW1CLENBVm5CLENBQUE7YUFXQSxJQUFDLENBQUEsUUFBUSxDQUFDLFFBQVYsR0FBcUIsRUFaaEI7SUFBQSxDQTFCUDtBQUFBLElBd0NBLFVBQUEsRUFBWSxTQUFDLEdBQUQsR0FBQTthQUNWLEdBQUEsS0FBUSxXQUFSLElBQUEsR0FBQSxLQUFxQixVQUFyQixJQUFBLEdBQUEsS0FBaUMsTUFBakMsSUFBQSxHQUFBLEtBQXlDLFFBQXpDLElBQUEsR0FBQSxLQUFtRCxXQUR6QztJQUFBLENBeENaO0dBSEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/profiles/profiles.coffee
