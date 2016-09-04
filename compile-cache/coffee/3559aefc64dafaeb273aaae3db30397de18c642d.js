(function() {
  var GCCClang;

  module.exports = GCCClang = (function() {
    GCCClang.profile_name = 'GCC/Clang';

    GCCClang.prototype.scopes = ['source.c++', 'source.cpp', 'source.c', 'source.arduino', 'source.ino'];

    GCCClang.prototype.default_extensions = ['cc', 'cpp', 'cp', 'cxx', 'c++', 'cu', 'cuh', 'h', 'hh', 'hpp', 'hxx', 'h++', 'inl', 'ipp', 'tcc', 'tpp', 'c', 'h', 'ino', 'pde'];

    GCCClang.prototype.regex_string = '(?<file> [\\S]+\\.(?extensions)): #File \n ((?<row> [\\d]+)(:(?<col> [\\d]+))?)? #Row and column \n :\\s(fatal \\s)? (?<type> error|warning|note): \n [\\s]* (?<message> [\\S\\s]+) #Type and Message \n';

    GCCClang.prototype.regex_end = /^[\^\s~]+$/;

    GCCClang.prototype.file_string = '(?<file> [\\S]+\\.(?extensions)): #File \n ((?<row> [\\d]+)(:(?<col> [\\d]+))?)? #Row and column \n';

    function GCCClang(output) {
      this.output = output;
      this.extensions = this.output.createExtensionString(this.scopes, this.default_extensions);
      this.regex = this.output.createRegex(this.regex_string, this.extensions);
      this.regex_file = this.output.createRegex(this.file_string, this.extensions);
    }

    GCCClang.prototype.files = function(line) {
      var m, out, start;
      start = 0;
      out = [];
      while ((m = this.regex_file.xexec(line.substr(start))) != null) {
        start += m.index;
        m.start = start;
        m.end = start + m.file.length + (m.row != null ? m.row.length + 1 : 0) + (m.col != null ? m.col.length : -1);
        start = m.end + 1;
        out.push(m);
      }
      return out;
    };

    GCCClang.prototype["in"] = function(line) {
      var m, out, _i, _len, _ref;
      if ((m = this.regex.xexec(line)) != null) {
        this.status = m.type;
        out = [];
        m.trace = [];
        _ref = this.prebuffer;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          line = _ref[_i];
          line.type = 'trace';
          line.highlighting = this.status;
          line.message = m.message;
          out.push(line);
          this.output.lint(line);
          line.message = 'Referenced';
          if ((line != null) && (line.file != null) && (line.row != null) && (line.type != null) && (line.message != null)) {
            m.trace.push(this.output.createMessage(line));
          }
        }
        this.output.replacePrevious(out);
        this.prebuffer = [];
        this.output.print(m);
        return this.output.lint(m);
      } else if (this.regex_end.test(line)) {
        this.output.print({
          input: line,
          type: this.status
        });
        return this.status = null;
      } else if (this.status != null) {
        return this.output.print({
          input: line,
          type: this.status
        });
      } else {
        if ((m = this.regex_file.xexec(line)) != null) {
          this.prebuffer.push(m);
        } else {
          this.prebuffer.push({
            input: line
          });
        }
        return this.output.print({
          input: line
        });
      }
    };

    GCCClang.prototype.clear = function() {
      this.status = null;
      return this.prebuffer = [];
    };

    return GCCClang;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9wcm9maWxlcy9nY2NfY2xhbmcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBQ0osSUFBQSxRQUFDLENBQUEsWUFBRCxHQUFlLFdBQWYsQ0FBQTs7QUFBQSx1QkFFQSxNQUFBLEdBQVEsQ0FBQyxZQUFELEVBQWUsWUFBZixFQUE2QixVQUE3QixFQUF5QyxnQkFBekMsRUFBMkQsWUFBM0QsQ0FGUixDQUFBOztBQUFBLHVCQUlBLGtCQUFBLEdBQW9CLENBQUMsSUFBRCxFQUFPLEtBQVAsRUFBYyxJQUFkLEVBQW9CLEtBQXBCLEVBQTJCLEtBQTNCLEVBQWtDLElBQWxDLEVBQXdDLEtBQXhDLEVBQStDLEdBQS9DLEVBQW9ELElBQXBELEVBQTBELEtBQTFELEVBQWlFLEtBQWpFLEVBQXdFLEtBQXhFLEVBQStFLEtBQS9FLEVBQXNGLEtBQXRGLEVBQTZGLEtBQTdGLEVBQW9HLEtBQXBHLEVBQTJHLEdBQTNHLEVBQWdILEdBQWhILEVBQXFILEtBQXJILEVBQTRILEtBQTVILENBSnBCLENBQUE7O0FBQUEsdUJBTUEsWUFBQSxHQUFjLDBNQU5kLENBQUE7O0FBQUEsdUJBYUEsU0FBQSxHQUFXLFlBYlgsQ0FBQTs7QUFBQSx1QkFlQSxXQUFBLEdBQWEscUdBZmIsQ0FBQTs7QUFvQmEsSUFBQSxrQkFBRSxNQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsTUFBTSxDQUFDLHFCQUFSLENBQThCLElBQUMsQ0FBQSxNQUEvQixFQUF1QyxJQUFDLENBQUEsa0JBQXhDLENB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

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/profiles/gcc_clang.coffee
