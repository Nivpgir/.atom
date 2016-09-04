(function() {
  var Emitter, OutputStream, Pipeline, RawPipeline;

  Emitter = require('atom').Emitter;

  Pipeline = require('./output-pipeline');

  RawPipeline = require('./output-pipeline-raw');

  module.exports = OutputStream = (function() {
    function OutputStream(settings, stream) {
      this.settings = settings;
      this.stream = stream;
      this.subscribers = new Emitter;
      this.buffer = '';
      this.flushed = false;
      this.wholepipeline = new Pipeline(this.settings, this.stream);
      this.rawpipeline = new RawPipeline(this.settings, this.stream);
    }

    OutputStream.prototype.destroy = function() {
      this.subscribers.dispose();
      this.subscribers = null;
      this.wholepipeline.destroy();
      this.rawpipeline.destroy();
      this.wholepipeline = null;
      this.rawpipeline = null;
      return this.buffer = '';
    };

    OutputStream.prototype.subscribeToCommands = function(object, callback, command) {
      if (object == null) {
        return;
      }
      if (object[callback] == null) {
        return;
      }
      if (command === 'new' || command === 'raw' || command === 'input') {
        return this.subscribers.on(command, function(o) {
          return object[callback](o);
        });
      } else {
        return this.wholepipeline.subscribeToCommands(object, callback, command);
      }
    };

    OutputStream.prototype.flush = function() {
      this.flushed = true;
      if (this.buffer === '') {
        return;
      }
      this.subscribers.emit('input', {
        input: this.buffer,
        files: this.wholepipeline.getFiles({
          input: this.buffer
        })
      });
      this.wholepipeline["in"](this.rawpipeline["in"](this.buffer));
      return this.buffer = '';
    };

    OutputStream.prototype["in"] = function(data) {
      var d, index, line, lines, _i, _len;
      if (this.flushed) {
        return;
      }
      data = this.rawpipeline["in"](data);
      if (data === '') {
        return;
      }
      this.buffer += data;
      lines = this.buffer.split('\n');
      for (index = _i = 0, _len = lines.length; _i < _len; index = ++_i) {
        line = lines[index];
        if (line === '' && index === lines.length - 1) {
          break;
        }
        if (index !== 0) {
          this.subscribers.emit('new');
          if (line !== '') {
            this.subscribers.emit('raw', line);
          }
          if (index !== lines.length - 1) {
            this.subscribers.emit('input', {
              input: line,
              files: this.wholepipeline.getFiles({
                input: line
              })
            });
            this.wholepipeline["in"](line);
          }
        } else {
          if (line === (d = data.split('\n')[0])) {
            this.subscribers.emit('new');
          }
          this.subscribers.emit('raw', d);
          if (lines.length !== 1) {
            this.subscribers.emit('input', {
              input: line,
              files: this.wholepipeline.getFiles({
                input: line
              })
            });
            this.wholepipeline["in"](line);
          }
        }
      }
      return this.buffer = lines.pop();
    };

    return OutputStream;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9waXBlbGluZS9vdXRwdXQtc3RyZWFtLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0Q0FBQTs7QUFBQSxFQUFDLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQUFELENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLG1CQUFSLENBRlgsQ0FBQTs7QUFBQSxFQUdBLFdBQUEsR0FBYyxPQUFBLENBQVEsdUJBQVIsQ0FIZCxDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUVTLElBQUEsc0JBQUUsUUFBRixFQUFhLE1BQWIsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFdBQUEsUUFDYixDQUFBO0FBQUEsTUFEdUIsSUFBQyxDQUFBLFNBQUEsTUFDeEIsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxHQUFBLENBQUEsT0FBZixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVLEVBRFYsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxLQUZYLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxhQUFELEdBQXFCLElBQUEsUUFBQSxDQUFTLElBQUMsQ0FBQSxRQUFWLEVBQW9CLElBQUMsQ0FBQSxNQUFyQixDQUhyQixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsV0FBRCxHQUFtQixJQUFBLFdBQUEsQ0FBWSxJQUFDLENBQUEsUUFBYixFQUF1QixJQUFDLENBQUEsTUFBeEIsQ0FKbkIsQ0FEVztJQUFBLENBQWI7O0FBQUEsMkJBT0EsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUEsQ0FBQSxDQUFB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

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/pipeline/output-stream.coffee
