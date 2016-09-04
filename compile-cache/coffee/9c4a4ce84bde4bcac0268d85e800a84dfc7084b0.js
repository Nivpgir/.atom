(function() {
  var APMTest;

  module.exports = APMTest = (function() {
    APMTest.profile_name = 'apm test';

    APMTest.prototype.scopes = ['source.coffee', 'source.js'];

    APMTest.prototype.default_extensions = ['js', 'htc', '_js', 'es', 'es6', 'jsm', 'pjs', 'xsjs', 'xsjslib', 'coffee', 'Cakefile', 'coffee.erb', 'cson', '_coffee'];

    APMTest.prototype.error_string_file = '^ \n [\\s]+ #Indentation \n (?<message> .+) #Message \n \\.?\\s\\( #File \n (?<file> [\\S]+\\.(?extensions)): #File \n ((?<row> [\\d]+)(:(?<col> [\\d]+))?)? #Row and column \n \\) \n $';

    APMTest.prototype.error_string_nofile = '^ \n [\\s]+ #Indentation \n (?<message> .+) #Message \n $';

    APMTest.prototype.at_string = '^ \n [\\s]+ #Indentation \n at\\s #At \n (?<message> .*\\s)? #Reference \n \\(? #File begin \n (?<file> [\\S]+\\.(?extensions)): #File \n (?<row> [\\d]+)(:(?<col> [\\d]+))? #Row and column \n \\)? #File end \n $';

    APMTest.prototype.file_string = '(\\(|\")?(?<file> [\\S]+\\.(?extensions)): #File \n ((?<row> [\\d]+)(:(?<col> [\\d]+))?)? #Row and column \n';

    function APMTest(output) {
      this.output = output;
      this.extensions = this.output.createExtensionString(this.scopes, this.default_extensions);
      this.regex_at = this.output.createRegex(this.at_string, this.extensions);
      this.regex_error_file = this.output.createRegex(this.error_string_file, this.extensions);
      this.regex_error_nofile = this.output.createRegex(this.error_string_nofile, this.extensions);
      this.regex_file = this.output.createRegex(this.file_string, this.extensions);
    }

    APMTest.prototype.files = function(line) {
      var m, out, start;
      start = 0;
      out = [];
      while ((m = this.regex_file.xexec(line.substr(start))) != null) {
        start += m.index;
        start += (line[start] === '(' || line[start] === '"' ? 1 : 0);
        m.start = start;
        m.end = start + m.file.length + (m.row != null ? m.row.length + 1 : 0) + (m.col != null ? m.col.length : -1);
        start = m.end + 1;
        out.push(m);
      }
      return out;
    };

    APMTest.prototype["in"] = function(line) {
      var m, n;
      if ((m = this.regex_at.xexec(line)) != null) {
        if (this.lastMatch != null) {
          if (this.firstAt && (this.lastMatch.file == null)) {
            m.type = 'error';
            m.message = this.lastMatch.message;
            m.trace = [];
            this.lastMatch = m;
          } else {
            m.type = 'trace';
            m.highlighting = 'error';
            if ((m.message == null) || m.message.trim() !== '') {
              m.message = 'Referenced';
            }
            this.lastMatch.trace.push(this.output.createMessage(m));
            m.message = this.lastMatch.message;
            this.output.lint(m);
          }
          this.output.print(m);
          return this.firstAt = false;
        } else {
          return this.output.print(m);
        }
      } else if ((m = this.regex_error_nofile.xexec(line)) != null) {
        this.output.lint(this.lastMatch);
        if ((n = this.regex_error_file.xexec(line, this.regex_error_file)) != null) {
          m = n;
        }
        m.type = 'error';
        this.lastMatch = m;
        this.firstAt = true;
        this.output.print(m);
        return this.output.lint(m);
      } else {
        this.output.lint(this.lastMatch);
        this.firstAt = true;
        this.lastMatch = null;
        return this.output.print({
          input: line,
          type: 'error'
        });
      }
    };

    APMTest.prototype.clear = function() {
      this.lastMatch = null;
      return this.firstAt = true;
    };

    return APMTest;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9wcm9maWxlcy9hcG1fdGVzdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsT0FBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDSixJQUFBLE9BQUMsQ0FBQSxZQUFELEdBQWUsVUFBZixDQUFBOztBQUFBLHNCQUVBLE1BQUEsR0FBUSxDQUFDLGVBQUQsRUFBa0IsV0FBbEIsQ0FGUixDQUFBOztBQUFBLHNCQUlBLGtCQUFBLEdBQW9CLENBQUMsSUFBRCxFQUFPLEtBQVAsRUFBYyxLQUFkLEVBQXFCLElBQXJCLEVBQTJCLEtBQTNCLEVBQWtDLEtBQWxDLEVBQXlDLEtBQXpDLEVBQWdELE1BQWhELEVBQXdELFNBQXhELEVBQW1FLFFBQW5FLEVBQTZFLFVBQTdFLEVBQXlGLFlBQXpGLEVBQXVHLE1BQXZHLEVBQStHLFNBQS9HLENBSnBCLENBQUE7O0FBQUEsc0JBTUEsaUJBQUEsR0FBbUIsMExBTm5CLENBQUE7O0FBQUEsc0JBZUEsbUJBQUEsR0FBcUIsMkRBZnJCLENBQUE7O0FBQUEsc0JBb0JBLFNBQUEsR0FBVyxxTkFwQlgsQ0FBQTs7QUFBQSxzQkE4QkEsV0FBQSxHQUFhLDhHQTlCYixDQUFBOztBQW1DYSxJQUFBLGlCQUFFLE1BQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUMsQ0FBQSxNQUFNLENBQUMscUJBQVIsQ0FBOEIsSUFBQyxDQUFBLE1BQS9CLEVBQXVDLElBQUMsQ0FBQSxrQkFBeEMsQ0FBZCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixD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

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/profiles/apm_test.coffee
