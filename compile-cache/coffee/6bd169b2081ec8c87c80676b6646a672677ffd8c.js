(function() {
  var Modifiers, OutputPipelineRaw;

  Modifiers = require('../stream-modifiers/modifiers');

  module.exports = OutputPipelineRaw = (function() {
    function OutputPipelineRaw(settings, stream) {
      var c, config, name, _i, _len, _ref, _ref1, _ref2;
      this.settings = settings;
      this.stream = stream;
      this.pipeline = [];
      _ref = this.stream.pipeline;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], name = _ref1.name, config = _ref1.config;
        if ((c = Modifiers.modules[name]) != null) {
          if (c.modifier.prototype.modify_raw != null) {
            Modifiers.activate(name);
            this.pipeline.push(new c.modifier(config, this.settings));
          }
        } else {
          if ((_ref2 = atom.notifications) != null) {
            _ref2.addError("Could not find raw stream modifier: " + name);
          }
        }
      }
    }

    OutputPipelineRaw.prototype.destroy = function() {
      var mod, _i, _len, _ref;
      _ref = this.pipeline;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mod = _ref[_i];
        if (typeof mod.destroy === "function") {
          mod.destroy();
        }
      }
      return this.pipeline = null;
    };

    OutputPipelineRaw.prototype["in"] = function(_input) {
      var mod, _i, _len, _ref;
      _ref = this.pipeline;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mod = _ref[_i];
        _input = mod.modify_raw(_input);
      }
      return _input;
    };

    return OutputPipelineRaw;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9waXBlbGluZS9vdXRwdXQtcGlwZWxpbmUtcmF3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0QkFBQTs7QUFBQSxFQUFBLFNBQUEsR0FBWSxPQUFBLENBQVEsK0JBQVIsQ0FBWixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUVTLElBQUEsMkJBQUUsUUFBRixFQUFhLE1BQWIsR0FBQTtBQUNYLFVBQUEsNkNBQUE7QUFBQSxNQURZLElBQUMsQ0FBQSxXQUFBLFFBQ2IsQ0FBQTtBQUFBLE1BRHVCLElBQUMsQ0FBQSxTQUFBLE1BQ3hCLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxRQUFELEdBQVksRUFBWixDQUFBO0FBQ0E7QUFBQSxXQUFBLDJDQUFBLEdBQUE7QUFDRSwwQkFERyxhQUFBLE1BQU0sZUFBQSxNQUNULENBQUE7QUFBQSxRQUFBLElBQUcscUNBQUg7QUFDRSxVQUFBLElBQUcsdUNBQUg7QUFDRSxZQUFBLFNBQVMsQ0FBQyxRQUFWLENBQW1CLElBQW5CLENBQUEsQ0FBQTtBQUFBLFlBQ0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQW1CLElBQUEsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxNQUFYLEVBQW1CLElBQUMsQ0FBQSxRQUFwQixDQUFuQixDQURBLENBREY7V0FERjtTQUFBLE1BQUE7O2lCQUtvQixDQUFFLFFBQXBCLENBQThCLHNDQUFBLEdBQXNDLElBQXBFO1dBTEY7U0FERjtBQUFBLE9BRlc7SUFBQSxDQUFiOztBQUFBLGdDQVVBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLG1CQUFBO0FBQUE7QUFBQSxXQUFBLDJDQUFBO3VCQUFBOztVQUFBLEdBQUcsQ0FBQztTQUFKO0FBQUEsT0FBQTthQUNBLElBQUMsQ0FBQSxRQUFELEdBQVksS0FGTDtJQUFBLENBVlQsQ0FBQTs7QUFBQSxnQ0FjQSxLQUFBLEdBQUksU0FBQyxNQUFELEdBQUE7QUFDRixVQUFBLG1CQUFBO0FBQUE7QUFBQSxXQUFBLDJDQUFBO3VCQUFBO0FBQ0UsUUFBQSxNQUFBLEdBQVMsR0FBRyxDQUFDLFVBQUosQ0FBZSxNQUFmLENBQVQsQ0FERjtBQUFBLE9BQUE7QUFFQSxhQUFPLE1BQVAsQ0FIRTtJQUFBLENBZEosQ0FBQTs7NkJBQUE7O01BTEosQ0FBQTtBQUFBIgp9

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/pipeline/output-pipeline-raw.coffee
