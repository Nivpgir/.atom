(function() {
  var CommandWorker, Environment, InputOutputManager, pty;

  InputOutputManager = require('./io-manager');

  Environment = require('../environment/environment');

  pty = null;

  module.exports = CommandWorker = (function() {
    function CommandWorker(command, outputs) {
      this.command = command;
      this.outputs = outputs;
      this.manager = new InputOutputManager(this.command, this.outputs);
      this.killed = false;
    }

    CommandWorker.prototype.run = function() {
      var mod, _ref, _ref1, _ref2;
      if (!Environment.activate((_ref = this.command.environment) != null ? _ref.name : void 0)) {
        this.manager.error("Could not find environment module " + ((_ref1 = this.command.environment) != null ? _ref1.name : void 0));
        return Promise.reject("Could not find environment module " + ((_ref2 = this.command.environment) != null ? _ref2.name : void 0));
      }
      mod = Environment.modules[this.command.environment.name].mod;
      this.environment = new mod(this.command, this.manager, this.command.environment.config);
      return this.environment.getPromise();
    };

    CommandWorker.prototype.kill = function() {
      if (this.environment === null || this.environment.isKilled()) {
        console.log('Kill on finished process');
        return Promise.resolve();
      }
      return new Promise((function(_this) {
        return function(resolve) {
          _this.environment.getPromise().then(resolve, resolve);
          if (!_this.environment.isKilled()) {
            _this.environment.sigterm();
          }
          return setTimeout(function() {
            if (_this.environment == null) {
              return;
            }
            if (!_this.environment.isKilled()) {
              return _this.environment.sigkill();
            }
          }, 3000);
        };
      })(this));
    };

    CommandWorker.prototype.destroy = function() {
      var _ref;
      if (!(this.environment.isKilled() || atom.inSpecMode())) {
        this.environment.sigkill();
      }
      this.environment.destroy();
      if ((_ref = this.manager) != null) {
        _ref.destroy();
      }
      this.manager = null;
      return this.environment = null;
    };

    return CommandWorker;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9waXBlbGluZS9jb21tYW5kLXdvcmtlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbURBQUE7O0FBQUEsRUFBQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsY0FBUixDQUFyQixDQUFBOztBQUFBLEVBRUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSw0QkFBUixDQUZkLENBQUE7O0FBQUEsRUFJQSxHQUFBLEdBQU0sSUFKTixDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUVTLElBQUEsdUJBQUUsT0FBRixFQUFZLE9BQVosR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFVBQUEsT0FDYixDQUFBO0FBQUEsTUFEc0IsSUFBQyxDQUFBLFVBQUEsT0FDdkIsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBZSxJQUFBLGtCQUFBLENBQW1CLElBQUMsQ0FBQSxPQUFwQixFQUE2QixJQUFDLENBQUEsT0FBOUIsQ0FBZixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVLEtBRFYsQ0FEVztJQUFBLENBQWI7O0FBQUEsNEJBSUEsR0FBQSxHQUFLLFNBQUEsR0FBQTtBQUNILFVBQUEsdUJBQUE7QUFBQSxNQUFBLElBQUEsQ0FBQSxXQUFrQixDQUFDLFFBQVosaURBQXlDLENBQUUsYUFBM0MsQ0FBUDtBQUNFLFFBQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFULENBQWdCLG9DQUFBLEdBQW1DLG1EQUFxQixDQUFFLGFBQXZCLENBQW5ELENBQUEsQ0FBQTtBQUNBLGVBQU8sT0FBTyxDQUFDLE1BQVIsQ0FBZ0Isb0NBQUEsR0FBbUMsbURBQXFCLENBQUUsYUFBdkIsQ0FBbkQsQ0FBUCxDQUZGO09BQUE7QUFBQSxNQUdBLEdBQUEsR0FBTSxXQUFXLENBQUMsT0FBUSxDQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVyxDQUFDLElBQXJCLENBQTBCLENBQUMsR0FIckQsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFdBQUQsR0FBbUIsSUFBQSxHQUFBLENBQUksSUFBQyxDQUFBLE9BQUwsRUFBYyxJQUFDLENBQUEsT0FBZixFQUF3QixJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUE3QyxDQUpuQixDQUFBO0FBS0EsYUFBTyxJQUFDLENBQUEsV0FBVyxDQUFDLFVBQWIsQ0FBQSxDQUFQLENBTkc7SUFBQSxDQUpMLENBQUE7O0FBQUEsNEJBWUEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLE1BQUEsSUFBRyxJQUFDLENBQUEsV0FBRCxLQUFnQixJQUFoQixJQUF3QixJQUFDLENBQUEsV0FBVyxDQUFDLFFBQWIsQ0FBQSxDQUEzQjtBQUNFLFFBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSwwQkFBWixDQUFBLENBQUE7QUFDQSxlQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBUCxDQUZGO09BQUE7YUFHSSxJQUFBLE9BQUEsQ0FBUSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxPQUFELEdBQUE7QUFDVixVQUFBLEtBQUMsQ0FBQSxXQUFXLENBQUMsVUFBYixDQUFBLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsT0FBL0IsRUFBd0MsT0FBeEMsQ0FBQSxDQUFBO0FBQ0EsVUFBQSxJQUFBLENBQUEsS0FBK0IsQ0FBQSxXQUFXLENBQUMsUUFBYixDQUFBLENBQTlCO0FBQUEsWUFBQSxLQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxDQUFBLENBQUE7V0FEQTtpQkFFQSxVQUFBLENBQ0UsU0FBQSxHQUFBO0FBQ0UsWUFBQSxJQUFjLHlCQUFkO0FBQUEsb0JBQUEsQ0FBQTthQUFBO0FBQ0EsWUFBQSxJQUFBLENBQUEsS0FBK0IsQ0FBQSxXQUFXLENBQUMsUUFBYixDQUFBLENBQTlCO3FCQUFBLEtBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBLEVBQUE7YUFGRjtVQUFBLENBREYsRUFJRSxJQUpGLEVBSFU7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFSLEVBSkE7SUFBQSxDQVpOLENBQUE7O0FBQUEsNEJBMEJBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLElBQUE7QUFBQSxNQUFBLElBQUEsQ0FBQSxDQUE4QixJQUFDLENBQUEsV0FBVyxDQUFDLFFBQWIsQ0FBQSxDQUFBLElBQTJCLElBQUksQ0FBQyxVQUFMLENBQUEsQ0FBekQsQ0FBQTtBQUFBLFFBQUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUEsQ0FBQSxDQUFBO09BQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBLENBREEsQ0FBQTs7WUFFUSxDQUFFLE9BQVYsQ0FBQTtPQUZBO0FBQUEsTUFHQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBSFgsQ0FBQTthQUlBLElBQUMsQ0FBQSxXQUFELEdBQWUsS0FMUjtJQUFBLENBMUJULENBQUE7O3lCQUFBOztNQVRKLENBQUE7QUFBQSIKfQ==

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/pipeline/command-worker.coffee
