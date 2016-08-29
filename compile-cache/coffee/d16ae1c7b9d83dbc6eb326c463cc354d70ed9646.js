(function() {
  module.exports = {
    activate: function() {
      return this.workers = {};
    },
    deactivate: function() {
      var j, k, _i, _j, _len, _len1, _ref, _ref1, _ref2;
      _ref = Object.keys(this.workers);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        k = _ref[_i];
        _ref1 = Object.keys(this.workers[k]);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          j = _ref1[_j];
          if ((_ref2 = this.workers[k][j]) != null) {
            _ref2.stop();
          }
        }
      }
      return this.workers = {};
    },
    getWorker: function(command) {
      var worker, _base, _name;
      if ((_base = this.workers)[_name = command.project] == null) {
        _base[_name] = {};
      }
      if ((worker = this.workers[command.project][command.name]) != null) {
        return worker;
      }
      return this.createWorker(command);
    },
    createWorker: function(command) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return command.getQueue().run().then((function(worker) {
            _this.workers[command.project][command.name] = worker;
            worker.onFinishedQueue(function() {
              return _this.removeWorker(command);
            });
            return resolve(worker);
          }), reject);
        };
      })(this));
    },
    removeWorker: function(command) {
      var _base, _name, _ref;
      if ((_base = this.workers)[_name = command.project] == null) {
        _base[_name] = {};
      }
      if ((_ref = this.workers[command.project][command.name]) != null) {
        _ref.stop();
      }
      return this.workers[command.project][command.name] = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9wcm92aWRlci93b3JrZXItbWFuYWdlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FESDtJQUFBLENBQVY7QUFBQSxJQUdBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixVQUFBLDZDQUFBO0FBQUE7QUFBQSxXQUFBLDJDQUFBO3FCQUFBO0FBQ0U7QUFBQSxhQUFBLDhDQUFBO3dCQUFBOztpQkFDZ0IsQ0FBRSxJQUFoQixDQUFBO1dBREY7QUFBQSxTQURGO0FBQUEsT0FBQTthQUdBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FKRDtJQUFBLENBSFo7QUFBQSxJQVNBLFNBQUEsRUFBVyxTQUFDLE9BQUQsR0FBQTtBQUNULFVBQUEsb0JBQUE7O3VCQUE2QjtPQUE3QjtBQUNBLE1BQUEsSUFBaUIsOERBQWpCO0FBQUEsZUFBTyxNQUFQLENBQUE7T0FEQTthQUVBLElBQUMsQ0FBQSxZQUFELENBQWMsT0FBZCxFQUhTO0lBQUEsQ0FUWDtBQUFBLElBY0EsWUFBQSxFQUFjLFNBQUMsT0FBRCxHQUFBO2FBQ1IsSUFBQSxPQUFBLENBQVEsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtpQkFDVixPQUFPLENBQUMsUUFBUixDQUFBLENBQWtCLENBQUMsR0FBbkIsQ0FBQSxDQUF3QixDQUFDLElBQXpCLENBQThCLENBQUMsU0FBQyxNQUFELEdBQUE7QUFDN0IsWUFBQSxLQUFDLENBQUEsT0FBUSxDQUFBLE9BQU8sQ0FBQyxPQUFSLENBQWlCLENBQUEsT0FBTyxDQUFDLElBQVIsQ0FBMUIsR0FBMEMsTUFBMUMsQ0FBQTtBQUFBLFlBQ0EsTUFBTSxDQUFDLGVBQVAsQ0FBdUIsU0FBQSxHQUFBO3FCQUFHLEtBQUMsQ0FBQSxZQUFELENBQWMsT0FBZCxFQUFIO1lBQUEsQ0FBdkIsQ0FEQSxDQUFBO21CQUVBLE9BQUEsQ0FBUSxNQUFSLEVBSDZCO1VBQUEsQ0FBRCxDQUE5QixFQUlHLE1BSkgsRUFEVTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVIsRUFEUTtJQUFBLENBZGQ7QUFBQSxJQXVCQSxZQUFBLEVBQWMsU0FBQyxPQUFELEdBQUE7QUFDWixVQUFBLGtCQUFBOzt1QkFBNkI7T0FBN0I7O1lBQ3VDLENBQUUsSUFBekMsQ0FBQTtPQURBO2FBRUEsSUFBQyxDQUFBLE9BQVEsQ0FBQSxPQUFPLENBQUMsT0FBUixDQUFpQixDQUFBLE9BQU8sQ0FBQyxJQUFSLENBQTFCLEdBQTBDLEtBSDlCO0lBQUEsQ0F2QmQ7R0FERixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/provider/worker-manager.coffee
