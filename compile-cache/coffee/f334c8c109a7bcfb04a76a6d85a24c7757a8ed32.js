(function() {
  var AllSaver, Ansi, AnsiEnd, AnsiStart, RemoveANSIModifier;

  Ansi = /\x1b\[(\d[ABCDEFGJKST]|\d;\d[Hf]|[45]i|6n|[su]|\?25[lh]|[0-9;]*m)/g;

  AnsiStart = /^\x1b\[(\d[ABCDEFGJKST]|\d;\d[Hf]|[45]i|6n|[su]|\?25[lh]|[0-9;]*m)/;

  AnsiEnd = /\x1b\[?(\d?|\d?;?\d?|[45]?|6?|\??2?5?|[0-9;]*)$/;

  module.exports = {
    name: 'Remove ANSI Codes',
    edit: AllSaver = (function() {
      function AllSaver() {}

      AllSaver.prototype.get = function(command, stream) {
        command[stream].pipeline.push({
          name: 'remansi'
        });
        return null;
      };

      return AllSaver;

    })(),
    modifier: RemoveANSIModifier = (function() {
      function RemoveANSIModifier() {
        this.endsWithAnsi = null;
      }

      RemoveANSIModifier.prototype.destroy = function() {
        return this.endsWithAnsi = null;
      };

      RemoveANSIModifier.prototype.modify_raw = function(input) {
        var m, _part;
        input = input.replace(Ansi, '');
        if (this.endsWithAnsi != null) {
          _part = this.endsWithAnsi + input;
          if (AnsiStart.test(_part)) {
            input = _part.replace(Ansi, '');
            this.endsWithAnsi = null;
          } else {
            this.endsWithAnsi = _part;
            input = '';
          }
        }
        if ((m = AnsiEnd.exec(input)) != null) {
          this.endsWithAnsi = input.substr(m.index);
          input = input.substr(0, m.index);
        }
        return input;
      };

      return RemoveANSIModifier;

    })()
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9zdHJlYW0tbW9kaWZpZXJzL3JlbWFuc2kuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNEQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLG9FQUFQLENBQUE7O0FBQUEsRUFDQSxTQUFBLEdBQVksb0VBRFosQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxpREFGVixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsSUFBQSxFQUFNLG1CQUFOO0FBQUEsSUFFQSxJQUFBLEVBQ1E7NEJBQ0o7O0FBQUEseUJBQUEsR0FBQSxHQUFLLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNILFFBQUEsT0FBUSxDQUFBLE1BQUEsQ0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUF6QixDQUE4QjtBQUFBLFVBQUEsSUFBQSxFQUFNLFNBQU47U0FBOUIsQ0FBQSxDQUFBO0FBQ0EsZUFBTyxJQUFQLENBRkc7TUFBQSxDQUFMLENBQUE7O3NCQUFBOztRQUpKO0FBQUEsSUFRQSxRQUFBLEVBQ1E7QUFFUyxNQUFBLDRCQUFBLEdBQUE7QUFDWCxRQUFBLElBQUMsQ0FBQSxZQUFELEdBQWdCLElBQWhCLENBRFc7TUFBQSxDQUFiOztBQUFBLG1DQUdBLE9BQUEsR0FBUyxTQUFBLEdBQUE7ZUFDUCxJQUFDLENBQUEsWUFBRCxHQUFnQixLQURUO01BQUEsQ0FIVCxDQUFBOztBQUFBLG1DQU1BLFVBQUEsR0FBWSxTQUFDLEtBQUQsR0FBQTtBQUNWLFlBQUEsUUFBQTtBQUFBLFFBQUEsS0FBQSxHQUFRLEtBQUssQ0FBQyxPQUFOLENBQWMsSUFBZCxFQUFvQixFQUFwQixDQUFSLENBQUE7QUFDQSxRQUFBLElBQUcseUJBQUg7QUFDRSxVQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsWUFBRCxHQUFnQixLQUF4QixDQUFBO0FBQ0EsVUFBQSxJQUFHLFNBQVMsQ0FBQyxJQUFWLENBQWUsS0FBZixDQUFIO0FBQ0UsWUFBQSxLQUFBLEdBQVEsS0FBSyxDQUFDLE9BQU4sQ0FBYyxJQUFkLEVBQW9CLEVBQXBCLENBQVIsQ0FBQTtBQUFBLFlBQ0EsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFEaEIsQ0FERjtXQUFBLE1BQUE7QUFJRSxZQUFBLElBQUMsQ0FBQSxZQUFELEdBQWdCLEtBQWhCLENBQUE7QUFBQSxZQUNBLEtBQUEsR0FBUSxFQURSLENBSkY7V0FGRjtTQURBO0FBU0EsUUFBQSxJQUFHLGlDQUFIO0FBQ0UsVUFBQSxJQUFDLENBQUEsWUFBRCxHQUFnQixLQUFLLENBQUMsTUFBTixDQUFhLENBQUMsQ0FBQyxLQUFmLENBQWhCLENBQUE7QUFBQSxVQUNBLEtBQUEsR0FBUSxLQUFLLENBQUMsTUFBTixDQUFhLENBQWIsRUFBZ0IsQ0FBQyxDQUFDLEtBQWxCLENBRFIsQ0FERjtTQVRBO0FBWUEsZUFBTyxLQUFQLENBYlU7TUFBQSxDQU5aLENBQUE7O2dDQUFBOztRQVhKO0dBTkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/stream-modifiers/remansi.coffee
