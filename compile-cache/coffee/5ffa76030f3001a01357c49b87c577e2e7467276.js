(function() {
  var OutputInterface, OutputStream;

  OutputStream = require('./output-stream');

  module.exports = OutputInterface = (function() {
    function OutputInterface(outputs, stdin, stdout, stderr) {
      var output, _i, _len, _ref;
      this.outputs = outputs;
      this.stdin = stdin;
      this.stdout = stdout;
      this.stderr = stderr;
      _ref = this.outputs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        output = _ref[_i];
        this.stdout.subscribeToCommands(output, 'stdout_new', 'new');
        this.stdout.subscribeToCommands(output, 'stdout_raw', 'raw');
        this.stdout.subscribeToCommands(output, 'stdout_in', 'input');
        this.stderr.subscribeToCommands(output, 'stderr_new', 'new');
        this.stderr.subscribeToCommands(output, 'stderr_raw', 'raw');
        this.stderr.subscribeToCommands(output, 'stderr_in', 'input');
        this.stdout.subscribeToCommands(output, 'stdout_setType', 'setType');
        this.stdout.subscribeToCommands(output, 'stdout_replacePrevious', 'replacePrevious');
        this.stdout.subscribeToCommands(output, 'stdout_print', 'print');
        this.stdout.subscribeToCommands(output, 'stdout_linter', 'linter');
        this.stderr.subscribeToCommands(output, 'stderr_setType', 'setType');
        this.stderr.subscribeToCommands(output, 'stderr_replacePrevious', 'replacePrevious');
        this.stderr.subscribeToCommands(output, 'stderr_print', 'print');
        this.stderr.subscribeToCommands(output, 'stderr_linter', 'linter');
      }
    }

    OutputInterface.prototype.initialize = function(command) {
      var output, _i, _len, _ref, _results;
      _ref = this.outputs;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        output = _ref[_i];
        if (typeof output.newCommand === "function") {
          output.newCommand(command);
        }
        if (typeof output.setInput === "function") {
          output.setInput(this.stdin);
        }
        if (output.onInput != null) {
          _results.push(this.stdin.onWrite(output.onInput));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    OutputInterface.prototype.finish = function(status) {
      var output, _i, _len, _ref, _results;
      this.stdout.flush();
      this.stderr.flush();
      _ref = this.outputs;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        output = _ref[_i];
        _results.push(typeof output.exitCommand === "function" ? output.exitCommand(status) : void 0);
      }
      return _results;
    };

    OutputInterface.prototype.error = function(error) {
      var output, _i, _len, _ref, _results;
      _ref = this.outputs;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        output = _ref[_i];
        _results.push(typeof output.error === "function" ? output.error(error) : void 0);
      }
      return _results;
    };

    return OutputInterface;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9waXBlbGluZS9vdXRwdXQtaW50ZXJmYWNlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2QkFBQTs7QUFBQSxFQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FBZixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUVTLElBQUEseUJBQUUsT0FBRixFQUFZLEtBQVosRUFBb0IsTUFBcEIsRUFBNkIsTUFBN0IsR0FBQTtBQUNYLFVBQUEsc0JBQUE7QUFBQSxNQURZLElBQUMsQ0FBQSxVQUFBLE9BQ2IsQ0FBQTtBQUFBLE1BRHNCLElBQUMsQ0FBQSxRQUFBLEtBQ3ZCLENBQUE7QUFBQSxNQUQ4QixJQUFDLENBQUEsU0FBQSxNQUMvQixDQUFBO0FBQUEsTUFEdUMsSUFBQyxDQUFBLFNBQUEsTUFDeEMsQ0FBQTtBQUFBO0FBQUEsV0FBQSwyQ0FBQTswQkFBQTtBQUNFLFFBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxtQkFBUixDQUE0QixNQUE1QixFQUFvQyxZQUFwQyxFQUFrRCxLQUFsRCxDQUFBLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsbUJBQVIsQ0FBNEIsTUFBNUIsRUFBb0MsWUFBcEMsRUFBa0QsS0FBbEQsQ0FEQSxDQUFBO0FBQUEsUUFFQSxJQUFDLENBQUEsTUFBTSxDQUFDLG1CQUFSLENBQTRCLE1BQTVCLEVBQW9DLFdBQXBDLEVBQWlELE9BQWpELENBRkEsQ0FBQTtBQUFBLFFBSUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxtQkFBUixDQUE0QixNQUE1QixFQUFvQyxZQUFwQyxFQUFrRCxLQUFsRCxDQUpBLENBQUE7QUFBQSxRQUtBLElBQUMsQ0FBQSxNQUFNLENBQUMsbUJBQVIsQ0FBNEIsTUFBNUIsRUFBb0MsWUFBcEMsRUFBa0QsS0FBbEQsQ0FMQSxDQUFBO0FBQUEsUUFNQSxJQUFDLENBQUEsTUFBTSxDQUFDLG1CQUFSLENBQTRCLE1BQTVCLEVBQW9DLFdBQXBDLEVBQWlELE9BQWpELENBTkEsQ0FBQTtBQUFBLFFBUUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxtQkFBUixDQUE0QixNQUE1QixFQUFvQyxnQkFBcEMsRUFBc0QsU0FBdEQsQ0FSQSxDQUFBO0FBQUEsUUFTQSxJQUFDLENBQUEsTUFBTSxDQUFDLG1CQUFSLENBQTRCLE1BQTVCLEVBQW9DLHdCQUFwQyxFQUE4RCxpQkFBOUQsQ0FUQSxDQUFBO0FBQUEsUUFVQSxJQUFDLENBQUEsTUFBTSxDQUFDLG1CQUFSLENBQTRCLE1BQTVCLEVBQW9DLGNBQXBDLEVBQW9ELE9BQXBELENBVkEsQ0FBQTtBQUFBLFFBV0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxtQkFBUixDQUE0QixNQUE1QixFQUFvQyxlQUFwQyxFQUFxRCxRQUFyRCxDQVhBLENBQUE7QUFBQSxRQWFBLElBQUMsQ0FBQSxNQUFNLENBQUMsbUJBQVIsQ0FBNEIsTUFBNUIsRUFBb0MsZ0JBQXBDLEVBQXNELFNBQXRELENBYkEsQ0FBQTtBQUFBLFFBY0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxtQkFBUixDQUE0QixNQUE1QixFQUFvQyx3QkFBcEMsRUFBOEQsaUJBQTlELENBZEEsQ0FBQTtBQUFBLFFBZUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxtQkFBUixDQUE0QixNQUE1QixFQUFvQyxjQUFwQyxFQUFvRCxPQUFwRCxDQWZBLENBQUE7QUFBQSxRQWdCQSxJQUFDLENBQUEsTUFBTSxDQUFDLG1CQUFSLENBQTRCLE1BQTVCLEVBQW9DLGVBQXBDLEVBQXFELFFBQXJELENBaEJBLENBREY7QUFBQSxPQURXO0lBQUEsQ0FBYjs7QUFBQSw4QkFvQkEsVUFBQSxHQUFZLFNBQUMsT0FBRCxHQUFBO0FBQ1YsVUFBQSxnQ0FBQTtBQUFBO0FBQUE7V0FBQSwyQ0FBQTswQkFBQTs7VUFDRSxNQUFNLENBQUMsV0FBWTtTQUFuQjs7VUFDQSxNQUFNLENBQUMsU0FBVSxJQUFDLENBQUE7U0FEbEI7QUFFQSxRQUFBLElBQWlDLHNCQUFqQzt3QkFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsQ0FBZSxNQUFNLENBQUMsT0FBdEIsR0FBQTtTQUFBLE1BQUE7Z0NBQUE7U0FIRjtBQUFBO3NCQURVO0lBQUEsQ0FwQlosQ0FBQTs7QUFBQSw4QkEwQkEsTUFBQSxHQUFRLFNBQUMsTUFBRCxHQUFBO0FBQ04sVUFBQSxnQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsQ0FBQSxDQURBLENBQUE7QUFFQTtBQUFBO1dBQUEsMkNBQUE7MEJBQUE7QUFDRSxpRUFBQSxNQUFNLENBQUMsWUFBYSxpQkFBcEIsQ0FERjtBQUFBO3NCQUhNO0lBQUEsQ0ExQlIsQ0FBQTs7QUFBQSw4QkFnQ0EsS0FBQSxHQUFPLFNBQUMsS0FBRCxHQUFBO0FBQ0wsVUFBQSxnQ0FBQTtBQUFBO0FBQUE7V0FBQSwyQ0FBQTswQkFBQTtBQUNFLDJEQUFBLE1BQU0sQ0FBQyxNQUFPLGdCQUFkLENBREY7QUFBQTtzQkFESztJQUFBLENBaENQLENBQUE7OzJCQUFBOztNQUxKLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/pipeline/output-interface.coffee
