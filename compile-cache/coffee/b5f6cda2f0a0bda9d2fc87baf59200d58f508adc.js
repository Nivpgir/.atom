(function() {
  var InputStream, OutputInterface, OutputManager, OutputStream, Outputs;

  InputStream = require('./input-stream');

  OutputStream = require('./output-stream');

  OutputInterface = require('./output-interface');

  Outputs = require('../output/output');

  module.exports = OutputManager = (function() {
    function OutputManager(command, outputs) {
      this.command = command;
      this.outputs = outputs;
      this.stdin = new InputStream;
      this.stdout = new OutputStream(this.command, this.command.stdout);
      this.stderr = new OutputStream(this.command, this.command.stderr);
      this.stdin.onWrite((function(_this) {
        return function(text) {
          if (!_this.stdin.isPTY()) {
            return _this.stdout["in"](text);
          }
        };
      })(this));
      this["interface"] = new OutputInterface(this.outputs, this.stdin, this.stdout, this.stderr);
      this["interface"].initialize(this.command);
    }

    OutputManager.prototype.setInput = function(input) {
      return this.stdin.setInput(input);
    };

    OutputManager.prototype.destroy = function() {
      this.stdin.destroy();
      this.stdout.destroy();
      return this.stderr.destroy();
    };

    OutputManager.prototype.finish = function(status) {
      return this["interface"].finish(status);
    };

    OutputManager.prototype.error = function(error) {
      return this["interface"].error(error);
    };

    return OutputManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9waXBlbGluZS9pby1tYW5hZ2VyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrRUFBQTs7QUFBQSxFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FBZCxDQUFBOztBQUFBLEVBQ0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQURmLENBQUE7O0FBQUEsRUFFQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUixDQUZsQixDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxrQkFBUixDQUhWLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBRVMsSUFBQSx1QkFBRSxPQUFGLEVBQVksT0FBWixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsVUFBQSxPQUNiLENBQUE7QUFBQSxNQURzQixJQUFDLENBQUEsVUFBQSxPQUN2QixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLEdBQUEsQ0FBQSxXQUFULENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxZQUFBLENBQWEsSUFBQyxDQUFBLE9BQWQsRUFBdUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFoQyxDQURkLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxZQUFBLENBQWEsSUFBQyxDQUFBLE9BQWQsRUFBdUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFoQyxDQUZkLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxDQUFlLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtBQUNiLFVBQUEsSUFBQSxDQUFBLEtBQXdCLENBQUEsS0FBSyxDQUFDLEtBQVAsQ0FBQSxDQUF2QjttQkFBQSxLQUFDLENBQUEsTUFBTSxDQUFDLElBQUQsQ0FBUCxDQUFXLElBQVgsRUFBQTtXQURhO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZixDQUpBLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxXQUFBLENBQUQsR0FBaUIsSUFBQSxlQUFBLENBQWdCLElBQUMsQ0FBQSxPQUFqQixFQUEwQixJQUFDLENBQUEsS0FBM0IsRUFBa0MsSUFBQyxDQUFBLE1BQW5DLEVBQTJDLElBQUMsQ0FBQSxNQUE1QyxDQVBqQixDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsV0FBQSxDQUFTLENBQUMsVUFBWCxDQUFzQixJQUFDLENBQUEsT0FBdkIsQ0FSQSxDQURXO0lBQUEsQ0FBYjs7QUFBQSw0QkFXQSxRQUFBLEdBQVUsU0FBQyxLQUFELEdBQUE7YUFDUixJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVAsQ0FBZ0IsS0FBaEIsRUFEUTtJQUFBLENBWFYsQ0FBQTs7QUFBQSw0QkFjQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBLEVBSE87SUFBQSxDQWRULENBQUE7O0FBQUEsNEJBbUJBLE1BQUEsR0FBUSxTQUFDLE1BQUQsR0FBQTthQUNOLElBQUMsQ0FBQSxXQUFBLENBQVMsQ0FBQyxNQUFYLENBQWtCLE1BQWxCLEVBRE07SUFBQSxDQW5CUixDQUFBOztBQUFBLDRCQXNCQSxLQUFBLEdBQU8sU0FBQyxLQUFELEdBQUE7YUFDTCxJQUFDLENBQUEsV0FBQSxDQUFTLENBQUMsS0FBWCxDQUFpQixLQUFqQixFQURLO0lBQUEsQ0F0QlAsQ0FBQTs7eUJBQUE7O01BUkosQ0FBQTtBQUFBIgp9

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/pipeline/io-manager.coffee
