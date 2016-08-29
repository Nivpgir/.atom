(function() {
  var Command, Env;

  Env = require('../lib/modifier/env');

  Command = require('../lib/provider/command');

  describe('Command Modifier - Environment Variables', function() {
    var command;
    command = null;
    beforeEach(function() {
      command = new Command({
        project: '/home/fabian/.atom/packages/build-tools/spec/fixtures',
        name: 'Test',
        command: 'echo Hello World',
        wd: '.',
        env: {},
        modifier: {
          env: {
            TEST1: 'Hello',
            PWD: '/'
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
      command.getSpawnInfo();
      return Env.preSplit(command);
    });
    return it('returns valid data', function() {
      expect(command.env['TEST1']).toBe('Hello');
      return expect(command.env['PWD']).toBe('/');
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL3NwZWMvbW9kaWZpZXItZW52LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFlBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLHFCQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEseUJBQVIsQ0FEVixDQUFBOztBQUFBLEVBR0EsUUFBQSxDQUFTLDBDQUFULEVBQXFELFNBQUEsR0FBQTtBQUNuRCxRQUFBLE9BQUE7QUFBQSxJQUFBLE9BQUEsR0FBVSxJQUFWLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLE9BQUEsR0FBYyxJQUFBLE9BQUEsQ0FBUTtBQUFBLFFBQ3BCLE9BQUEsRUFBUyx1REFEVztBQUFBLFFBRXBCLElBQUEsRUFBTSxNQUZjO0FBQUEsUUFHcEIsT0FBQSxFQUFTLGtCQUhXO0FBQUEsUUFJcEIsRUFBQSxFQUFJLEdBSmdCO0FBQUEsUUFLcEIsR0FBQSxFQUFLLEVBTGU7QUFBQSxRQU1wQixRQUFBLEVBQ0U7QUFBQSxVQUFBLEdBQUEsRUFDRTtBQUFBLFlBQUEsS0FBQSxFQUFPLE9BQVA7QUFBQSxZQUNBLEdBQUEsRUFBSyxHQURMO1dBREY7U0FQa0I7QUFBQSxRQVVwQixNQUFBLEVBQ0U7QUFBQSxVQUFBLFlBQUEsRUFBYyxJQUFkO1NBWGtCO0FBQUEsUUFZcEIsTUFBQSxFQUNFO0FBQUEsVUFBQSxZQUFBLEVBQWMsSUFBZDtTQWJrQjtBQUFBLFFBY3BCLE1BQUEsRUFDRTtBQUFBLFVBQUEsT0FBQSxFQUNFO0FBQUEsWUFBQSxhQUFBLEVBQWUsS0FBZjtXQURGO1NBZmtCO0FBQUEsUUFpQnBCLE9BQUEsRUFBUyxDQWpCVztPQUFSLENBQWQsQ0FBQTtBQUFBLE1BbUJBLE9BQU8sQ0FBQyxZQUFSLENBQUEsQ0FuQkEsQ0FBQTthQW9CQSxHQUFHLENBQUMsUUFBSixDQUFhLE9BQWIsRUFyQlM7SUFBQSxDQUFYLENBRkEsQ0FBQTtXQXlCQSxFQUFBLENBQUcsb0JBQUgsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLE1BQUEsTUFBQSxDQUFPLE9BQU8sQ0FBQyxHQUFJLENBQUEsT0FBQSxDQUFuQixDQUE0QixDQUFDLElBQTdCLENBQWtDLE9BQWxDLENBQUEsQ0FBQTthQUNBLE1BQUEsQ0FBTyxPQUFPLENBQUMsR0FBSSxDQUFBLEtBQUEsQ0FBbkIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxHQUFoQyxFQUZ1QjtJQUFBLENBQXpCLEVBMUJtRDtFQUFBLENBQXJELENBSEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/niv/.atom/packages/build-tools/spec/modifier-env-spec.coffee
