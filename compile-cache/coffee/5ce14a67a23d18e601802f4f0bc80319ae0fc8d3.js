(function() {
  var Python;

  module.exports = Python = (function() {
    Python.profile_name = 'Python';

    Python.prototype.scopes = ['source.python'];

    Python.prototype.default_extensions = ['cpy', 'gyp', 'gypi', 'kv', 'py', 'pyw', 'rpy', 'SConscript', 'SConstruct', 'Sconstruct', 'sconstruct', 'Snakefile', 'tac', 'wsgi'];

    Python.prototype.file_string = 'File\\ "(?<file> [\\S]+\\.(?extensions))", \\ #File \n line\\ (?<row> [\\d]+) #Row \n';

    Python.prototype.message_begin = /^Traceback \(most recent call last\):$/;

    Python.prototype.trace = /^[\s]+(.+)$/;

    function Python(output) {
      this.output = output;
      this.extensions = this.output.createExtensionString(this.scopes, this.default_extensions);
      this.regex_file = this.output.createRegex(this.file_string, this.extensions);
    }

    Python.prototype.files = function(line) {
      var m, out, start;
      start = 0;
      out = [];
      while ((m = this.regex_file.xexec(line.substr(start))) != null) {
        start += m.index;
        m.start = start;
        m.end = start + m.file.length + m.row.length + 13;
        start = m.end + 1;
        m.col = '0';
        out.push(m);
      }
      return out;
    };

    Python.prototype["in"] = function(line) {
      var index, last, m, trace, _i, _len, _ref;
      if ((m = this.regex_file.xexec(line)) != null) {
        m.type = 'trace';
        this.prebuffer.push(m);
        this.traceback = true;
        return this.output.print({
          input: line,
          type: 'error'
        });
      } else if (this.traceback && ((m = this.trace.exec(line)) != null)) {
        last = this.prebuffer[this.prebuffer.length - 1];
        if (last == null) {
          this.output.print({
            input: line
          });
          return;
        }
        if (last.message == null) {
          last.message = m[1];
        }
        return this.output.print({
          input: line,
          type: 'error'
        });
      } else if ((m = this.message_begin.exec(line)) != null) {
        this.traceback = true;
        return this.output.print({
          input: line,
          type: 'error'
        });
      } else if (this.traceback && line !== '') {
        this.traceback = false;
        last = this.prebuffer[this.prebuffer.length - 1];
        if (last == null) {
          this.output.print({
            input: line
          });
          return;
        }
        last.trace = [];
        _ref = this.prebuffer.reverse();
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          trace = _ref[index];
          last.trace.push(this.output.createMessage(trace));
          trace.message = line.trim();
          if (index !== 0) {
            this.output.lint(trace);
          }
        }
        this.prebuffer = [];
        last.type = 'error';
        last.message = line.trim();
        this.output.lint(last);
        return this.output.print({
          input: line,
          type: 'error'
        });
      } else {
        return this.output.print({
          input: line
        });
      }
    };

    Python.prototype.clear = function() {
      this.prebuffer = [];
      return this.traceback = false;
    };

    return Python;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9wcm9maWxlcy9weXRob24uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLE1BQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBQ0osSUFBQSxNQUFDLENBQUEsWUFBRCxHQUFlLFFBQWYsQ0FBQTs7QUFBQSxxQkFFQSxNQUFBLEdBQVEsQ0FBQyxlQUFELENBRlIsQ0FBQTs7QUFBQSxxQkFJQSxrQkFBQSxHQUFvQixDQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWUsTUFBZixFQUF1QixJQUF2QixFQUE2QixJQUE3QixFQUFtQyxLQUFuQyxFQUEwQyxLQUExQyxFQUFpRCxZQUFqRCxFQUErRCxZQUEvRCxFQUE2RSxZQUE3RSxFQUEyRixZQUEzRixFQUF5RyxXQUF6RyxFQUFzSCxLQUF0SCxFQUE2SCxNQUE3SCxDQUpwQixDQUFBOztBQUFBLHFCQU1BLFdBQUEsR0FBYSx1RkFOYixDQUFBOztBQUFBLHFCQVdBLGFBQUEsR0FBZSx3Q0FYZixDQUFBOztBQUFBLHFCQWFBLEtBQUEsR0FBTyxhQWJQLENBQUE7O0FBZWEsSUFBQSxnQkFBRSxNQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsTUFBTSxDQUFDLHFCQUFSLENBQThCLElBQUMsQ0FBQSxNQUEvQixFQUF1QyxJQUFDLENBQUEsa0JBQXhDLENBQWQsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsQ0FBb0IsSUFBQyxDQUFBLFdBQXJCLEVBQWtDLElBQUMsQ0FBQSxVQUFuQyxDQURkLENBRFc7SUFBQSxDQWZiOztBQUFBLHFC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

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/profiles/python.coffee
