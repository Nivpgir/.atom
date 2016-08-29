(function() {
  var Java;

  module.exports = Java = (function() {
    Java.profile_name = 'Java';

    Java.prototype.scopes = ['source.java'];

    Java.prototype.default_extensions = ['java', 'bsh'];

    Java.prototype.regex_string = '(?<file> [\\S]+\\.(?extensions)): #File \n (?<row> [\\d]+)? #Row \n :\\s(?<type> error|warning): \n [\\s]* (?<message> [\\S\\s]+) #Type and Message \n';

    Java.prototype.file_string = '(?<file> [\\S]+\\.(?extensions)): #File \n (?<row> [\\d]+)? #Row\n';

    function Java(output) {
      this.output = output;
      this.extensions = this.output.createExtensionString(this.scopes, this.default_extensions);
      this.regex = this.output.createRegex(this.regex_string, this.extensions);
      this.regex_file = this.output.createRegex(this.file_string, this.extensions);
    }

    Java.prototype.files = function(line) {
      var m, out, start;
      start = 0;
      out = [];
      while ((m = this.regex_file.xexec(line.substr(start))) != null) {
        start += m.index;
        m.start = start;
        m.end = start + m.file.length + (m.row != null ? m.row.length : 0);
        if (m.row == null) {
          m.row = '0';
        }
        m.col = '0';
        start = m.end + 1;
        out.push(m);
      }
      return out;
    };

    Java.prototype["in"] = function(line) {
      var m;
      if ((m = this.regex.xexec(line)) != null) {
        this.status = m.type;
        this.laststatus = this.status;
        this.output.print(m);
        return this.output.lint(m);
      } else if (/\s+\^\s*/.test(line)) {
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
      } else if (/required|found|reason|symbol|location/.test(line)) {
        return this.output.print({
          input: line,
          type: this.laststatus
        });
      } else {
        return this.output.print({
          input: line
        });
      }
    };

    Java.prototype.clear = function() {
      this.status = null;
      return this.laststatus = null;
    };

    return Java;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9wcm9maWxlcy9qYXZhYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsSUFBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDSixJQUFBLElBQUMsQ0FBQSxZQUFELEdBQWUsTUFBZixDQUFBOztBQUFBLG1CQUVBLE1BQUEsR0FBUSxDQUFDLGFBQUQsQ0FGUixDQUFBOztBQUFBLG1CQUlBLGtCQUFBLEdBQW9CLENBQUMsTUFBRCxFQUFTLEtBQVQsQ0FKcEIsQ0FBQTs7QUFBQSxtQkFNQSxZQUFBLEdBQWMsd0pBTmQsQ0FBQTs7QUFBQSxtQkFhQSxXQUFBLEdBQWEsb0VBYmIsQ0FBQTs7QUFrQmEsSUFBQSxjQUFFLE1BQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUMsQ0FBQSxNQUFNLENBQUMscUJBQVIsQ0FBOEIsSUFBQyxDQUFBLE1BQS9CLEVBQXVDLElBQUMsQ0FBQSxrQkFBeEMsQ0FBZCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixDQUFvQixJQUFDLENBQUEsWUFBckIsRUFBbUMsSUFBQyxDQUFBLFVBQXBDLENBRFQsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsQ0FBb0IsSUFBQyxDQUFBLFdBQXJCLEVBQWtDLElBQUMsQ0FBQSxVQUFuQyxDQUZkLENBRFc7SUFBQSxDQWxCYjs7QUFBQSxtQkF1QkEsS0FBQSxHQUFPLFNBQUMsSUFBRCxHQUFBO0FBQ0wsVUFBQSxhQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEs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

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/profiles/javac.coffee
