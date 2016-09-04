(function() {
  var Modifiers, Queue, QueueWorker;

  Modifiers = require('../modifier/modifier');

  QueueWorker = require('./queue-worker');

  module.exports = Queue = (function() {
    function Queue(origin) {
      var _ref;
      if (origin.length != null) {
        this.queue = {
          queue: origin
        };
      } else {
        this.queue = {
          queue: [origin]
        };
      }
      this.keys = Object.keys((_ref = this.queue.queue[0].modifier) != null ? _ref : {}).filter(function(k) {
        var _ref;
        return ((_ref = Modifiers.modules[k]) != null ? _ref["in"] : void 0) != null;
      });
      this.keys.reverse();
    }

    Queue.prototype.run = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this._run(resolve, reject);
        };
      })(this));
    };

    Queue.prototype._run = function(resolve, reject) {
      var k, ret;
      if ((k = this.keys.pop()) == null) {
        return resolve(new QueueWorker(this.queue));
      }
      if (Modifiers.activate(k) !== true) {
        return this._run(resolve, reject);
      }
      ret = Modifiers.modules[k]["in"](this.queue);
      if (ret instanceof Promise) {
        return ret.then(((function(_this) {
          return function() {
            return _this._run(resolve, reject);
          };
        })(this)), function(e) {
          return reject(new Error('Error in "' + k + '" module: ' + e.message));
        });
      } else {
        if (ret != null) {
          reject(new Error('Error in "' + k + '" module: ' + ret));
        }
        return this._run(resolve, reject);
      }
    };

    return Queue;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9waXBlbGluZS9xdWV1ZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkJBQUE7O0FBQUEsRUFBQSxTQUFBLEdBQVksT0FBQSxDQUFRLHNCQUFSLENBQVosQ0FBQTs7QUFBQSxFQUNBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FEZCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNTLElBQUEsZUFBQyxNQUFELEdBQUE7QUFDWCxVQUFBLElBQUE7QUFBQSxNQUFBLElBQUcscUJBQUg7QUFDRSxRQUFBLElBQUMsQ0FBQSxLQUFELEdBQVM7QUFBQSxVQUFBLEtBQUEsRUFBTyxNQUFQO1NBQVQsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLElBQUMsQ0FBQSxLQUFELEdBQVM7QUFBQSxVQUFBLEtBQUEsRUFBTyxDQUFDLE1BQUQsQ0FBUDtTQUFULENBSEY7T0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLElBQUQsR0FBUSxNQUFNLENBQUMsSUFBUCx3REFBdUMsRUFBdkMsQ0FBMEMsQ0FBQyxNQUEzQyxDQUFrRCxTQUFDLENBQUQsR0FBQTtBQUN4RCxZQUFBLElBQUE7ZUFBQSxzRUFEd0Q7TUFBQSxDQUFsRCxDQUpSLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBLENBTkEsQ0FEVztJQUFBLENBQWI7O0FBQUEsb0JBU0EsR0FBQSxHQUFLLFNBQUEsR0FBQTthQUNDLElBQUEsT0FBQSxDQUFRLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7aUJBQ1YsS0FBQyxDQUFBLElBQUQsQ0FBTSxPQUFOLEVBQWUsTUFBZixFQURVO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBUixFQUREO0lBQUEsQ0FUTCxDQUFBOztBQUFBLG9CQWNBLElBQUEsR0FBTSxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFDSixVQUFBLE1BQUE7QUFBQSxNQUFBLElBQStDLDZCQUEvQztBQUFBLGVBQU8sT0FBQSxDQUFZLElBQUEsV0FBQSxDQUFZLElBQUMsQ0FBQSxLQUFiLENBQVosQ0FBUCxDQUFBO09BQUE7QUFDQSxNQUFBLElBQW9DLFNBQVMsQ0FBQyxRQUFWLENBQW1CLENBQW5CLENBQUEsS0FBeUIsSUFBN0Q7QUFBQSxlQUFPLElBQUMsQ0FBQSxJQUFELENBQU0sT0FBTixFQUFlLE1BQWYsQ0FBUCxDQUFBO09BREE7QUFBQSxNQUVBLEdBQUEsR0FBTSxTQUFTLENBQUMsT0FBUSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBQUQsQ0FBcEIsQ0FBd0IsSUFBQyxDQUFBLEtBQXpCLENBRk4sQ0FBQTtBQUdBLE1BQUEsSUFBRyxHQUFBLFlBQWUsT0FBbEI7ZUFDRSxHQUFHLENBQUMsSUFBSixDQUFTLENBQUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLElBQUQsQ0FBTSxPQUFOLEVBQWUsTUFBZixFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBRCxDQUFULEVBQXFDLFNBQUMsQ0FBRCxHQUFBO2lCQUFPLE1BQUEsQ0FBVyxJQUFBLEtBQUEsQ0FBTSxZQUFBLEdBQWUsQ0FBZixHQUFtQixZQUFuQixHQUFrQyxDQUFDLENBQUMsT0FBMUMsQ0FBWCxFQUFQO1FBQUEsQ0FBckMsRUFERjtPQUFBLE1BQUE7QUFHRSxRQUFBLElBQTRELFdBQTVEO0FBQUEsVUFBQSxNQUFBLENBQVcsSUFBQSxLQUFBLENBQU0sWUFBQSxHQUFlLENBQWYsR0FBbUIsWUFBbkIsR0FBa0MsR0FBeEMsQ0FBWCxDQUFBLENBQUE7U0FBQTtlQUNBLElBQUMsQ0FBQSxJQUFELENBQU0sT0FBTixFQUFlLE1BQWYsRUFKRjtPQUpJO0lBQUEsQ0FkTixDQUFBOztpQkFBQTs7TUFMSixDQUFBO0FBQUEiCn0=

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/pipeline/queue.coffee
