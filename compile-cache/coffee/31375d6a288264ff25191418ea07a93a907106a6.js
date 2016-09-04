(function() {
  var CommandModifier, CommandWorker, Emitter, Outputs, QueueWorker;

  CommandWorker = require('./command-worker');

  CommandModifier = require('./command-modifier');

  Outputs = require('../output/output');

  Emitter = require('atom').Emitter;

  module.exports = QueueWorker = (function() {
    function QueueWorker(queue) {
      var command, key, _base, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      this.queue = queue;
      this.outputs = {};
      _ref = this.queue.queue;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        command = _ref[_i];
        _ref1 = Object.keys(command.output);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          key = _ref1[_j];
          if (Outputs.activate(key) !== true) {
            continue;
          }
          if (!this.outputs[key]) {
            this.outputs[key] = new Outputs.modules[key].output;
          }
        }
      }
      _ref2 = Object.keys(this.outputs);
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        key = _ref2[_k];
        if (typeof (_base = this.outputs[key]).newQueue === "function") {
          _base.newQueue(this.queue);
        }
      }
      this.emitter = new Emitter;
      this.finished = false;
    }

    QueueWorker.prototype.destroy = function() {
      this.emitter.dispose();
      this.queue = null;
      return this.outputs = null;
    };

    QueueWorker.prototype.run = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this._run(resolve, reject);
        };
      })(this));
    };

    QueueWorker.prototype._run = function(resolve, reject) {
      var c, modifier;
      if (this.finished) {
        throw new Error('Worker already finished');
      }
      if ((c = this.queue.queue.splice(0, 1)[0]) == null) {
        this.finishedQueue(0);
        return resolve(0);
      }
      modifier = new CommandModifier(c);
      return modifier.run().then(((function(_this) {
        return function() {
          var key, outputs;
          outputs = (function() {
            var _i, _len, _ref, _results;
            _ref = Object.keys(c.output);
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              key = _ref[_i];
              if (this.outputs[key] != null) {
                _results.push(this.outputs[key]);
              }
            }
            return _results;
          }).call(_this);
          _this.currentWorker = new CommandWorker(c, outputs);
          return _this.currentWorker.run().then((function(status) {
            _this.finishedCommand(status);
            if (status.exitcode === 0) {
              return _this._run(resolve, reject);
            } else {
              return resolve(status);
            }
          }), function(e) {
            _this.errorCommand(e);
            return resolve({
              exitcode: -1,
              status: null
            });
          });
        };
      })(this)), reject);
    };

    QueueWorker.prototype.stop = function() {
      if (this.finished) {
        return;
      }
      if (this.currentWorker == null) {
        return this.finished = true;
      }
      return this.currentWorker.kill().then((function(_this) {
        return function() {
          return _this.finishedQueue(-2);
        };
      })(this));
    };

    QueueWorker.prototype.finishedQueue = function(code) {
      var key, _base, _i, _len, _ref;
      this.finished = true;
      _ref = Object.keys(this.outputs);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (typeof (_base = this.outputs[key]).exitQueue === "function") {
          _base.exitQueue(code);
        }
      }
      this.emitter.emit('finishedQueue', code);
      return this.destroy();
    };

    QueueWorker.prototype.hasFinished = function() {
      return this.finished;
    };

    QueueWorker.prototype.finishedCommand = function(status) {
      this.currentWorker.destroy();
      this.emitter.emit('finishedCommand', status);
      if (status.exitcode !== null && status.exitcode !== 0) {
        if (status.exitcode >= 128) {
          return;
        }
        return this.finishedQueue(status.exitcode);
      }
    };

    QueueWorker.prototype.errorCommand = function(error) {
      this.emitter.emit('errorCommand', error);
      return this.finishedQueue(-1);
    };

    QueueWorker.prototype.onFinishedQueue = function(callback) {
      return this.emitter.on('finishedQueue', callback);
    };

    QueueWorker.prototype.onFinishedCommand = function(callback) {
      return this.emitter.on('finishedCommand', callback);
    };

    QueueWorker.prototype.onError = function(callback) {
      return this.emitter.on('errorCommand', callback);
    };

    return QueueWorker;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9waXBlbGluZS9xdWV1ZS13b3JrZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZEQUFBOztBQUFBLEVBQUEsYUFBQSxHQUFnQixPQUFBLENBQVEsa0JBQVIsQ0FBaEIsQ0FBQTs7QUFBQSxFQUNBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLG9CQUFSLENBRGxCLENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGtCQUFSLENBRlYsQ0FBQTs7QUFBQSxFQUdDLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQUhELENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBRVMsSUFBQSxxQkFBRSxLQUFGLEdBQUE7QUFDWCxVQUFBLHVFQUFBO0FBQUEsTUFEWSxJQUFDLENBQUEsUUFBQSxLQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsRUFBWCxDQUFBO0FBRUE7QUFBQSxXQUFBLDJDQUFBOzJCQUFBO0FBQ0U7QUFBQSxhQUFBLDhDQUFBOzBCQUFBO0FBQ0UsVUFBQSxJQUFnQixPQUFPLENBQUMsUUFBUixDQUFpQixHQUFqQixDQUFBLEtBQXlCLElBQXpDO0FBQUEscUJBQUE7V0FBQTtBQUNBLFVBQUEsSUFBbUQsQ0FBQSxJQUFLLENBQUEsT0FBUSxDQUFBLEdBQUEsQ0FBaEU7QUFBQSxZQUFBLElBQUMsQ0FBQSxPQUFRLENBQUEsR0FBQSxDQUFULEdBQWdCLEdBQUEsQ0FBQSxPQUFXLENBQUMsT0FBUSxDQUFBLEdBQUEsQ0FBSSxDQUFDLE1BQXpDLENBQUE7V0FGRjtBQUFBLFNBREY7QUFBQSxPQUZBO0FBT0E7QUFBQSxXQUFBLDhDQUFBO3dCQUFBOztlQUNlLENBQUMsU0FB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

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/pipeline/queue-worker.coffee
