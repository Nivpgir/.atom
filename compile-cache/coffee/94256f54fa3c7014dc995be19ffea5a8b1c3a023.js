(function() {
  var Output;

  Output = require('../lib/pipeline/output-stream');

  module.exports = {
    profile: function(name, command, stream, strings, expectations, files) {
      return describe(command[stream].pipeline[0].config.profile, function() {
        var output;
        output = null;
        beforeEach(function() {
          output = new Output(command, command[stream]);
          expect(output).toBeDefined();
          return expect(output.wholepipeline.pipeline.length).toBe(1);
        });
        it('has a name', function() {
          return expect(output.wholepipeline.pipeline[0].profile.constructor.profile_name).toBe(name);
        });
        it('has scopes', function() {
          return expect(output.wholepipeline.pipeline[0].profile.scopes).toBeDefined();
        });
        it('has a `in` function', function() {
          return expect(output.wholepipeline.pipeline[0].profile["in"]).toBeDefined();
        });
        it('has a `files` function', function() {
          return expect(output.wholepipeline.pipeline[0].profile.files).toBeDefined();
        });
        describe('on ::in', function() {
          var matches;
          matches = [];
          beforeEach(function() {
            var string, _i, _len, _results;
            spyOn(output.wholepipeline, 'absolutePath').andCallFake(function(path) {
              return path;
            });
            spyOn(output.wholepipeline.pipeline[0].profile.output, 'lint').andCallFake(function(match) {
              if ((match != null) && (match.file != null) && (match.row != null) && (match.type != null) && (match.message != null)) {
                return matches.push({
                  file: match.file,
                  row: match.row,
                  col: match.col,
                  type: match.type,
                  highlighting: match.highlighting,
                  message: match.message,
                  trace: match.trace
                });
              }
            });
            _results = [];
            for (_i = 0, _len = strings.length; _i < _len; _i++) {
              string = strings[_i];
              _results.push(output["in"](string + '\n'));
            }
            return _results;
          });
          return it('correctly sets warnings and errors', function() {
            var expectation, index, key, match, _i, _len, _results;
            expect(matches.length).toBe(expectations.length);
            _results = [];
            for (index = _i = 0, _len = matches.length; _i < _len; index = ++_i) {
              match = matches[index];
              expectation = expectations[index];
              _results.push((function() {
                var _j, _len1, _ref, _results1;
                _ref = Object.keys(expectation);
                _results1 = [];
                for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                  key = _ref[_j];
                  _results1.push(expect(("Line[" + index + "]." + key + ": ") + match[key]).toEqual(("Line[" + index + "]." + key + ": ") + expectation[key]));
                }
                return _results1;
              })());
            }
            return _results;
          });
        });
        if (files == null) {
          return;
        }
        return describe('on ::files', function() {
          var matches;
          matches = [];
          beforeEach(function() {
            var string, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = strings.length; _i < _len; _i++) {
              string = strings[_i];
              _results.push(matches.push(output.wholepipeline.pipeline[0].profile.files(string)));
            }
            return _results;
          });
          return it('correctly returns file descriptors', function() {
            var expectation, index0, index1, item, key, match, _i, _len, _results;
            expect(matches.length).toBe(files.length);
            _results = [];
            for (index0 = _i = 0, _len = matches.length; _i < _len; index0 = ++_i) {
              match = matches[index0];
              expectation = files[index0];
              _results.push((function() {
                var _j, _len1, _results1;
                _results1 = [];
                for (index1 = _j = 0, _len1 = expectation.length; _j < _len1; index1 = ++_j) {
                  item = expectation[index1];
                  _results1.push((function() {
                    var _k, _len2, _ref, _results2;
                    _ref = Object.keys(item);
                    _results2 = [];
                    for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
                      key = _ref[_k];
                      _results2.push(expect(("Line[" + index0 + "][" + index1 + "]." + key + ": ") + match[index1][key]).toBe(("Line[" + index0 + "][" + index1 + "]." + key + ": ") + item[key]));
                    }
                    return _results2;
                  })());
                }
                return _results1;
              })());
            }
            return _results;
          });
        });
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL3NwZWMvaGVscGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxNQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSwrQkFBUixDQUFULENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxPQUFBLEVBQVMsU0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixNQUFoQixFQUF3QixPQUF4QixFQUFpQyxZQUFqQyxFQUErQyxLQUEvQyxHQUFBO2FBQ1AsUUFBQSxDQUFTLE9BQVEsQ0FBQSxNQUFBLENBQU8sQ0FBQyxRQUFTLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBTSxDQUFDLE9BQTVDLEVBQXFELFNBQUEsR0FBQTtBQUNuRCxZQUFBLE1BQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxJQUFULENBQUE7QUFBQSxRQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLE1BQUEsR0FBYSxJQUFBLE1BQUEsQ0FBTyxPQUFQLEVBQWdCLE9BQVEsQ0FBQSxNQUFBLENBQXhCLENBQWIsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLE1BQVAsQ0FBYyxDQUFDLFdBQWYsQ0FBQSxDQURBLENBQUE7aUJBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLE1BQXJDLENBQTRDLENBQUMsSUFBN0MsQ0FBa0QsQ0FBbEQsRUFIUztRQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsUUFPQSxFQUFBLENBQUcsWUFBSCxFQUFpQixTQUFBLEdBQUE7aUJBQ2YsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUyxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsWUFBNUQsQ0FBeUUs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

//# sourceURL=/home/niv/.atom/packages/build-tools/spec/helper.coffee
