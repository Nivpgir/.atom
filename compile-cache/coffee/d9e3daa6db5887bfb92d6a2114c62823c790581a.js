(function() {
  var Command, CommandModifier, Modifiers;

  CommandModifier = require('../lib/pipeline/command-modifier');

  Modifiers = require('../lib/modifier/modifier');

  Command = require('../lib/provider/command');

  describe('Command Modifier', function() {
    var command, modifier, module;
    command = null;
    module = null;
    modifier = null;
    beforeEach(function() {
      var out;
      command = new Command({
        project: '/home/fabian/.atom/packages/build-tools/spec/fixtures',
        name: 'Test',
        command: 'echo Hello World',
        wd: '.',
        env: {},
        modifier: {
          test: {
            t: 1
          },
          shell: {
            command: 'bash -c'
          }
        },
        stdout: {
          highlighting: 'nh'
        },
        stderr: {
          highlighting: 'nh'
        },
        output: {
          console: {
            close_success: false
          }
        },
        version: 1
      });
      out = {
        preSplit: function(command) {
          command.command += '!';
        }
      };
      module = Modifiers.addModule('test', out);
      return modifier = new CommandModifier(command);
    });
    afterEach(function() {
      return module.dispose();
    });
    it('has the correct keys', function() {
      expect(modifier.keys).toEqual(['test', 'shell']);
      expect(modifier.preSplitKeys).toEqual(['test']);
      return expect(modifier.postSplitKeys).toEqual(['shell']);
    });
    return describe('On ::run', function() {
      beforeEach(function() {
        return waitsForPromise(function() {
          return modifier.run();
        });
      });
      return it('returns the new command with splitted args', function() {
        expect(command.command).toBe('bash');
        return expect(command.args).toEqual(['-c', 'echo Hello World!']);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL3NwZWMvY29tbWFuZC1tb2RpZmllci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQ0FBQTs7QUFBQSxFQUFBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLGtDQUFSLENBQWxCLENBQUE7O0FBQUEsRUFDQSxTQUFBLEdBQVksT0FBQSxDQUFRLDBCQUFSLENBRFosQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxPQUFBLENBQVEseUJBQVIsQ0FGVixDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixRQUFBLHlCQUFBO0FBQUEsSUFBQSxPQUFBLEdBQVUsSUFBVixDQUFBO0FBQUEsSUFDQSxNQUFBLEdBQVMsSUFEVCxDQUFBO0FBQUEsSUFFQSxRQUFBLEdBQVcsSUFGWCxDQUFBO0FBQUEsSUFJQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxHQUFBO0FBQUEsTUFBQSxPQUFBLEdBQWMsSUFBQSxPQUFBLENBQVE7QUFBQSxRQUNwQixPQUFBLEVBQVMsdURBRFc7QUFBQSxRQUVwQixJQUFBLEVBQU0sTUFGYztBQUFBLFFBR3BCLE9BQUEsRUFBUyxrQkFIVztBQUFBLFFBSXBCLEVBQUEsRUFBSSxHQUpnQjtBQUFBLFFBS3BCLEdBQUEsRUFBSyxFQUxlO0FBQUEsUUFNcEIsUUFBQSxFQUNFO0FBQUEsVUFBQSxJQUFBLEVBQU07QUFBQSxZQUNKLENBQUEsRUFBRyxDQURDO1dBQU47QUFBQSxVQUdBLEtBQUEsRUFDRTtBQUFBLFlBQUEsT0FBQSxFQUFTLFNBQVQ7V0FKRjtTQVBrQjtBQUFBLFFBWXBCLE1BQUEsRUFDRTtBQUFBLFVBQUEsWUFBQSxFQUFjLElBQWQ7U0Fia0I7QUFBQSxRQWNwQixNQUFBLEVBQ0U7QUFBQSxVQUFBLFlBQUEsRUFBYyxJQUFkO1NBZmtCO0FBQUEsUUFnQnBCLE1BQUEsRUFDRTtBQUFBLFVBQUEsT0FBQSxFQUNFO0FBQUEsWUFBQSxhQUFBLEVBQWUsS0FBZjtXQURGO1NBakJrQjtBQUFBLFFBbUJwQixPQUFBLEVBQVMsQ0FuQlc7T0FBUixDQUFkLENBQUE7QUFBQSxNQXFCQSxHQUFBLEdBQU07QUFBQSxRQUNKLFFBQUEsRUFBVSxTQUFDLE9BQUQsR0FBQTtBQUNSLFVBQUEsT0FBTyxDQUFDLE9BQVIsSUFBbUIsR0FBbkIsQ0FEUTtRQUFBLENBRE47T0FyQk4sQ0FBQTtBQUFBLE1BMEJBLE1BQUEsR0FBUyxTQUFTLENBQUMsU0FBVixDQUFvQixNQUFwQixFQUE0QixHQUE1QixDQTFCVCxDQUFBO2FBMkJBLFFBQUEsR0FBZSxJQUFBLGVBQUEsQ0FBZ0IsT0FBaEIsRUE1Qk47SUFBQSxDQUFYLENBSkEsQ0FBQTtBQUFBLElBa0NBLFNBQUEsQ0FBVSxTQUFBLEdBQUE7YUFDUixNQUFNLENBQUMsT0FBUCxDQUFBLEVBRFE7SUFBQSxDQUFWLENBbENBLENBQUE7QUFBQSxJQXFDQSxFQUFBLENBQUcsc0JBQUgsRUFBMkIsU0FBQSxHQUFBO0FBQ3pCLE1BQUEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxJQUFoQixDQUFxQixDQUFDLE9BQXRCLENBQThCLENBQUMsTUFBRCxFQUFTLE9BQVQsQ0FBOUIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxNQUFBLENBQU8sUUFBUSxDQUFDLFlBQWhCLENBQTZCLENBQUMsT0FBOUIsQ0FBc0MsQ0FBQyxNQUFELENBQXRDLENBREEsQ0FBQTthQUVBLE1BQUEsQ0FBTyxRQUFRLENBQUMsYUFBaEIsQ0FBOEIsQ0FBQyxPQUEvQixDQUF1QyxDQUFDLE9BQUQsQ0FBdkMsRUFIeUI7SUFBQSxDQUEzQixDQXJDQSxDQUFBO1dBMENBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtBQUVuQixNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFDVCxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFBRyxRQUFRLENBQUMsR0FBVCxDQUFBLEVBQUg7UUFBQSxDQUFoQixFQURTO01BQUEsQ0FBWCxDQUFBLENBQUE7YUFHQSxFQUFBLENBQUcsNENBQUgsRUFBaUQsU0FBQSxHQUFBO0FBQy9DLFFBQUEsTUFBQSxDQUFPLE9BQU8sQ0FBQyxPQUFmLENBQXVCLENBQUMsSUFBeEIsQ0FBNkIsTUFBN0IsQ0FBQSxDQUFBO2VBQ0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxJQUFmLENBQW9CLENBQUMsT0FBckIsQ0FBNkIsQ0FBQyxJQUFELEVBQU8sbUJBQVAsQ0FBN0IsRUFGK0M7TUFBQSxDQUFqRCxFQUxtQjtJQUFBLENBQXJCLEVBM0MyQjtFQUFBLENBQTdCLENBSkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/niv/.atom/packages/build-tools/spec/command-modifier-spec.coffee
