(function() {
  var Modelsim;

  module.exports = Modelsim = (function() {
    Modelsim.profile_name = 'Modelsim';

    Modelsim.prototype.scopes = ['source.vhdl', 'source.verilog'];

    Modelsim.prototype.default_extensions = ['vhd', 'vhdl', 'vho', 'v', 'sv', 'vh'];

    Modelsim.prototype.regex_string = '(?<type> Error|Warning):[ ](?<file> [\\S]+\\.(?extensions))\\((?<row> [\\d]+)\\):[ ](?<message> .+)$';

    Modelsim.prototype.file_string = '(?<file> [\\S]+\\.(?extensions))(\\((?<row> [\\d]+)\\))?';

    function Modelsim(output) {
      this.output = output;
      this.extensions = this.output.createExtensionString(this.scopes, this.default_extensions);
      this.regex = this.output.createRegex(this.regex_string, this.extensions);
      this.regex_file = this.output.createRegex(this.file_string, this.extensions);
    }

    Modelsim.prototype.files = function(line) {
      var m, out, start;
      start = 0;
      out = [];
      while ((m = this.regex_file.xexec(line.substr(start))) != null) {
        start += m.index;
        m.start = start;
        m.end = start + m.file.length + (m.row != null ? m.row.length + 1 : -1);
        if (m.row == null) {
          m.row = '0';
        }
        m.col = '0';
        start = m.end + 1;
        out.push(m);
      }
      return out;
    };

    Modelsim.prototype["in"] = function(line) {
      var m;
      if ((m = this.regex.xexec(line)) != null) {
        m.type = m.type.toLowerCase();
        this.output.print(m);
        return this.output.lint(m);
      }
    };

    return Modelsim;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9wcm9maWxlcy9tb2RlbHNpbS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsUUFBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDSixJQUFBLFFBQUMsQ0FBQSxZQUFELEdBQWUsVUFBZixDQUFBOztBQUFBLHVCQUVBLE1BQUEsR0FBUSxDQUFDLGFBQUQsRUFBaUIsZ0JBQWpCLENBRlIsQ0FBQTs7QUFBQSx1QkFJQSxrQkFBQSxHQUFvQixDQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLEtBQWhCLEVBQXVCLEdBQXZCLEVBQTRCLElBQTVCLEVBQWtDLElBQWxDLENBSnBCLENBQUE7O0FBQUEsdUJBTUEsWUFBQSxHQUFjLHNHQU5kLENBQUE7O0FBQUEsdUJBVUEsV0FBQSxHQUFhLDBEQVZiLENBQUE7O0FBY2EsSUFBQSxrQkFBRSxNQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsTUFBTSxDQUFDLHFCQUFSLENBQThCLElBQUMsQ0FBQSxNQUEvQixFQUF1QyxJQUFDLENBQUEsa0JBQXhDLENBQWQsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsQ0FBb0IsSUFBQyxDQUFBLFlBQXJCLEVBQW1DLElBQUMsQ0FBQSxVQUFwQyxDQURULENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLENBQW9CLElBQUMsQ0FBQSxXQUFyQixFQUFrQyxJQUFDLENBQUEsVUFBbkMsQ0FGZCxDQURXO0lBQUEsQ0FkYjs7QUFBQSx1QkFtQkEsS0FBQSxHQUFPLFNBQUMsSUFBRCxHQUFBO0FBQ0wsVUFBQSxhQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsQ0FBUixDQUFBO0FBQUEsTUFDQSxHQUFBLEdBQU0sRUFETixDQUFBO0FBRUEsYUFBTSx1REFBTixHQUFBO0FBQ0UsUUFBQSxLQUFBLElBQVMsQ0FBQyxDQUFDLEtBQVgsQ0FBQTtBQUFBLFFBQ0EsQ0FBQyxDQUFDLEtBQUYsR0FBVSxLQURWLENBQUE7QUFBQSxRQUVBLENBQUMsQ0FBQyxHQUFGLEdBQVEsS0FBQSxHQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBZixHQUF3QixDQUFJLGFBQUgsR0FBZSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU4sR0FBZSxDQUE5QixHQUFxQyxDQUFBLENBQXRDLENBRmhDLENBQUE7QUFHQSxRQUFBLElBQW1CLGFBQW5CO0FBQUEsVUFBQSxDQUFDLENBQUMsR0FBRixHQUFRLEdBQVIsQ0FBQTtTQUhBO0FBQUEsUUFJQSxDQUFDLENBQUMsR0FBRixHQUFRLEdBSlIsQ0FBQTtBQUFBLFFBS0EsS0FBQSxHQUFRLENBQUMsQ0FBQyxHQUFGLEdBQVEsQ0FMaEIsQ0FBQTtBQUFBLFFBTUEsR0FBRyxDQUFDLElBQUosQ0FBUyxDQUFULENBTkEsQ0FERjtNQUFBLENBRkE7YUFVQSxJQVhLO0lBQUEsQ0FuQlAsQ0FBQTs7QUFBQSx1QkFnQ0EsS0FBQSxHQUFJLFNBQUMsSUFBRCxHQUFBO0FBQ0YsVUFBQSxDQUFBO0FBQUEsTUFBQSxJQUFHLG9DQUFIO0FBQ0UsUUFBQSxDQUFDLENBQUMsSUFBRixHQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBUCxDQUFBLENBQVQsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLENBQWMsQ0FBZCxDQURBLENBQUE7ZUFFQSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxDQUFiLEVBSEY7T0FERTtJQUFBLENBaENKLENBQUE7O29CQUFBOztNQUZKLENBQUE7QUFBQSIKfQ==

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/profiles/modelsim.coffee
