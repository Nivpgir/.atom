(function() {
  var CommandModifier, CommandWorker, Modifiers;

  Modifiers = require('../modifier/modifier');

  CommandWorker = require('./command-worker');

  module.exports = CommandModifier = (function() {
    function CommandModifier(command) {
      var _ref;
      this.command = command;
      this.keys = Object.keys((_ref = command.modifier) != null ? _ref : {});
      this.preSplitKeys = this.keys.filter(function(key) {
        var _ref1;
        return ((_ref1 = Modifiers.modules[key]) != null ? _ref1.preSplit : void 0) != null;
      });
      this.postSplitKeys = this.keys.filter(function(key) {
        var _ref1;
        return ((_ref1 = Modifiers.modules[key]) != null ? _ref1.postSplit : void 0) != null;
      });
      this.preSplitKeys.reverse();
      this.postSplitKeys.reverse();
    }

    CommandModifier.prototype.run = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.runPreSplit().then((function() {
            _this.command.getSpawnInfo();
            return _this.runPostSplit().then(resolve, reject);
          }), reject);
        };
      })(this));
    };

    CommandModifier.prototype.runPreSplit = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this._runPreSplit(resolve, reject);
        };
      })(this));
    };

    CommandModifier.prototype._runPreSplit = function(resolve, reject) {
      var k, ret;
      if ((k = this.preSplitKeys.pop()) == null) {
        return resolve();
      }
      if (Modifiers.activate(k) !== true) {
        return this._runPreSplit(resolve, reject);
      }
      ret = Modifiers.modules[k].preSplit(this.command);
      if (ret instanceof Promise) {
        return ret.then(((function(_this) {
          return function() {
            return _this._runPreSplit(resolve, reject);
          };
        })(this)), reject);
      } else {
        if (ret != null) {
          reject(new Error('Error in "' + k + '" module: ' + ret));
        }
        return this._runPreSplit(resolve, reject);
      }
    };

    CommandModifier.prototype.runPostSplit = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this._runPostSplit(resolve, reject);
        };
      })(this));
    };

    CommandModifier.prototype._runPostSplit = function(resolve, reject) {
      var k, ret;
      if ((k = this.postSplitKeys.pop()) == null) {
        return resolve();
      }
      if (Modifiers.activate(k) !== true) {
        return this._runPostSplit(resolve, reject);
      }
      ret = Modifiers.modules[k].postSplit(this.command);
      if (ret instanceof Promise) {
        return ret.then(((function(_this) {
          return function() {
            return _this._runPostSplit(resolve, reject);
          };
        })(this)), reject);
      } else {
        if (ret != null) {
          reject(new Error('Error in "' + k + '" module: ' + ret));
        }
        return this._runPostSplit(resolve, reject);
      }
    };

    return CommandModifier;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9waXBlbGluZS9jb21tYW5kLW1vZGlmaWVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5Q0FBQTs7QUFBQSxFQUFBLFNBQUEsR0FBWSxPQUFBLENBQVEsc0JBQVIsQ0FBWixDQUFBOztBQUFBLEVBQ0EsYUFBQSxHQUFnQixPQUFBLENBQVEsa0JBQVIsQ0FEaEIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDUyxJQUFBLHlCQUFFLE9BQUYsR0FBQTtBQUNYLFVBQUEsSUFBQTtBQUFBLE1BRFksSUFBQyxDQUFBLFVBQUEsT0FDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLE1BQU0sQ0FBQyxJQUFQLDRDQUErQixFQUEvQixDQUFSLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxZQUFELEdBQWdCLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixDQUFhLFNBQUMsR0FBRCxHQUFBO0FBQzNCLFlBQUEsS0FBQTtlQUFBLDZFQUQyQjtNQUFBLENBQWIsQ0FEaEIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFOLENBQWEsU0FBQyxHQUFELEdBQUE7QUFDNUIsWUFBQSxLQUFBO2VBQUEsOEVBRDRCO01BQUEsQ0FBYixDQUhqQixDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsWUFBWSxDQUFDLE9BQWQsQ0FBQSxDQUxBLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLENBTkEsQ0FEVztJQUFBLENBQWI7O0FBQUEsOEJBU0EsR0FBQSxHQUFLLFNBQUEsR0FBQTthQUNDLElBQUEsT0FBQSxDQUFRLENBQUEsU0FBQSxLQUFB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

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/pipeline/command-modifier.coffee
