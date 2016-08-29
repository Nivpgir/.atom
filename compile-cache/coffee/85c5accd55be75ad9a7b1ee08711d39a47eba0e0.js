(function() {
  var Modifiers, Pipeline;

  Pipeline = require('../lib/pipeline/output-pipeline-raw');

  Modifiers = require('../lib/stream-modifiers/modifiers');

  describe('Raw Output Pipeline', function() {
    var dest, disp, mod, pipe;
    pipe = null;
    mod = null;
    disp = null;
    dest = null;
    beforeEach(function() {
      var TestModifier;
      dest = jasmine.createSpy('destroy');
      mod = {
        modifier: TestModifier = (function() {
          function TestModifier(config, settings) {
            this.config = config;
            this.settings = settings;
            this.modify_raw = jasmine.createSpy('modify_raw').andCallFake(function(i) {
              return "" + i + " World!";
            });
            this.destroy = dest;
          }

          TestModifier.prototype.modify_raw = function() {};

          return TestModifier;

        })()
      };
      disp = Modifiers.addModule('test', mod);
      return pipe = new Pipeline({
        b: 1
      }, {
        pipeline: [
          {
            name: 'test',
            config: {
              a: 1
            }
          }
        ]
      });
    });
    afterEach(function() {
      pipe.destroy();
      expect(dest).toHaveBeenCalled();
      return disp.dispose();
    });
    it('creates the pipeline', function() {
      return expect(pipe.pipeline[0].config).toEqual({
        a: 1
      });
    });
    return describe('on input', function() {
      var ret;
      ret = null;
      beforeEach(function() {
        return ret = pipe["in"]('Hello');
      });
      it('calls modify_raw of all modifiers', function() {
        return expect(pipe.pipeline[0].modify_raw).toHaveBeenCalledWith('Hello');
      });
      return it('returns the new value', function() {
        return expect(ret).toBe('Hello World!');
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL3NwZWMvb3V0cHV0LXBpcGVsaW5lLXJhdy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQkFBQTs7QUFBQSxFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEscUNBQVIsQ0FBWCxDQUFBOztBQUFBLEVBQ0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxtQ0FBUixDQURaLENBQUE7O0FBQUEsRUFHQSxRQUFBLENBQVMscUJBQVQsRUFBZ0MsU0FBQSxHQUFBO0FBQzlCLFFBQUEscUJBQUE7QUFBQSxJQUFBLElBQUEsR0FBTyxJQUFQLENBQUE7QUFBQSxJQUNBLEdBQUEsR0FBTSxJQUROLENBQUE7QUFBQSxJQUVBLElBQUEsR0FBTyxJQUZQLENBQUE7QUFBQSxJQUdBLElBQUEsR0FBTyxJQUhQLENBQUE7QUFBQSxJQUtBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLFlBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxPQUFPLENBQUMsU0FBUixDQUFrQixTQUFsQixDQUFQLENBQUE7QUFBQSxNQUNBLEdBQUEsR0FDRTtBQUFBLFFBQUEsUUFBQSxFQUNRO0FBRVMsVUFBQSxzQkFBRSxNQUFGLEVBQVcsUUFBWCxHQUFBO0FBQ1gsWUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxZQURxQixJQUFDLENBQUEsV0FBQSxRQUN0QixDQUFBO0FBQUEsWUFBQSxJQUFDLENBQUEsVUFBRCxHQUFjLE9BQU8sQ0FBQyxTQUFSLENBQWtCLFlBQWxCLENBQStCLENBQUMsV0FBaEMsQ0FBNEMsU0FBQyxDQUFELEdBQUE7cUJBQU8sRUFBQSxHQUFHLENBQUgsR0FBSyxVQUFaO1lBQUEsQ0FBNUMsQ0FBZCxDQUFBO0FBQUEsWUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBRFgsQ0FEVztVQUFBLENBQWI7O0FBQUEsaUNBSUEsVUFBQSxHQUFZLFNBQUEsR0FBQSxDQUpaLENBQUE7OzhCQUFBOztZQUhKO09BRkYsQ0FBQTtBQUFBLE1BV0EsSUFBQSxHQUFPLFNBQVMsQ0FBQyxTQUFWLENBQW9CLE1BQXBCLEVBQTRCLEdBQTVCLENBWFAsQ0FBQTthQVlBLElBQUEsR0FBVyxJQUFBLFFBQUEsQ0FBUztBQUFBLFFBQUMsQ0FBQSxFQUFHLENBQUo7T0FBVCxFQUFpQjtBQUFBLFFBQUEsUUFBQSxFQUFVO1VBQUM7QUFBQSxZQUFDLElBQUEsRUFBTSxNQUFQO0FBQUEsWUFBZSxNQUFBLEVBQVE7QUFBQSxjQUFDLENBQUEsRUFBRyxDQUFKO2FBQXZCO1dBQUQ7U0FBVjtPQUFqQixFQWJGO0lBQUEsQ0FBWCxDQUxBLENBQUE7QUFBQSxJQW9CQSxTQUFBLENBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFJLENBQUMsT0FBTCxDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxDQUFPLElBQVAsQ0FBWSxDQUFDLGdCQUFiLENBQUEsQ0FEQSxDQUFBO2FBRUEsSUFBSSxDQUFDLE9BQUwsQ0FBQSxFQUhRO0lBQUEsQ0FBVixDQXBCQSxDQUFBO0FBQUEsSUF5QkEsRUFBQSxDQUFHLHNCQUFILEVBQTJCLFNBQUEsR0FBQTthQUN6QixNQUFBLENBQU8sSUFBSSxDQUFDLFFBQVMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUF4QixDQUErQixDQUFDLE9BQWhDLENBQXdDO0FBQUEsUUFBQSxDQUFBLEVBQUcsQ0FBSDtPQUF4QyxFQUR5QjtJQUFBLENBQTNCLENBekJBLENBQUE7V0E0QkEsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLFVBQUEsR0FBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLElBQU4sQ0FBQTtBQUFBLE1BRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULEdBQUEsR0FBTSxJQUFJLENBQUMsSUFBRCxDQUFKLENBQVEsT0FBUixFQURHO01BQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxNQUtBLEVBQUEsQ0FBRyxtQ0FBSCxFQUF3QyxTQUFBLEdBQUE7ZUFDdEMsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFTLENBQUEsQ0FBQSxDQUFFLENBQUMsVUFBeEIsQ0FBbUMsQ0FBQyxvQkFBcEMsQ0FBeUQsT0FBekQsRUFEc0M7TUFBQSxDQUF4QyxDQUxBLENBQUE7YUFRQSxFQUFBLENBQUcsdUJBQUgsRUFBNEIsU0FBQSxHQUFBO2VBQzFCLE1BQUEsQ0FBTyxHQUFQLENBQVcsQ0FBQyxJQUFaLENBQWlCLGNBQWpCLEVBRDBCO01BQUEsQ0FBNUIsRUFUbUI7SUFBQSxDQUFyQixFQTdCOEI7RUFBQSxDQUFoQyxDQUhBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/niv/.atom/packages/build-tools/spec/output-pipeline-raw-spec.coffee
