(function() {
  var Command, Shell;

  Shell = require('../lib/modifier/shell');

  Command = require('../lib/provider/command');

  describe('Command Modifier - Shell', function() {
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
      command.getSpawnInfo();
      return Shell.postSplit(command);
    });
    return it('returns valid data', function() {
      expect(command.command).toBe('bash');
      return expect(command.args).toEqual(['-c', 'echo Hello World']);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL3NwZWMvbW9kaWZpZXItc2hlbGwtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsY0FBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsdUJBQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSx5QkFBUixDQURWLENBQUE7O0FBQUEsRUFHQSxRQUFBLENBQVMsMEJBQVQsRUFBcUMsU0FBQSxHQUFBO0FBQ25DLFFBQUEsT0FBQTtBQUFBLElBQUEsT0FBQSxHQUFVLElBQVYsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsT0FBQSxHQUFjLElBQUEsT0FBQSxDQUFRO0FBQUEsUUFDcEIsT0FBQSxFQUFTLHVEQURXO0FBQUEsUUFFcEIsSUFBQSxFQUFNLE1BRmM7QUFBQSxRQUdwQixPQUFBLEVBQVMsa0JBSFc7QUFBQSxRQUlwQixFQUFBLEVBQUksR0FKZ0I7QUFBQSxRQUtwQixHQUFBLEVBQUssRUFMZTtBQUFBLFFBTXBCLFFBQUEsRUFDRTtBQUFBLFVBQUEsS0FBQSxFQUNFO0FBQUEsWUFBQSxPQUFBLEVBQVMsU0FBVDtXQURGO1NBUGtCO0FBQUEsUUFTcEIsTUFBQSxFQUNFO0FBQUEsVUFBQSxZQUFBLEVBQWMsSUFBZDtTQVZrQjtBQUFBLFFBV3BCLE1BQUEsRUFDRTtBQUFBLFVBQUEsWUFBQSxFQUFjLElBQWQ7U0Faa0I7QUFBQSxRQWFwQixNQUFBLEVBQ0U7QUFBQSxVQUFBLE9BQUEsRUFDRTtBQUFBLFlBQUEsYUFBQSxFQUFlLEtBQWY7V0FERjtTQWRrQjtBQUFBLFFBZ0JwQixPQUFBLEVBQVMsQ0FoQlc7T0FBUixDQUFkLENBQUE7QUFBQSxNQWtCQSxPQUFPLENBQUMsWUFBUixDQUFBLENBbEJBLENBQUE7YUFtQkEsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsT0FBaEIsRUFwQlM7SUFBQSxDQUFYLENBRkEsQ0FBQTtXQXdCQSxFQUFBLENBQUcsb0JBQUgsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLE1BQUEsTUFBQSxDQUFPLE9BQU8sQ0FBQyxPQUFmLENBQXVCLENBQUMsSUFBeEIsQ0FBNkIsTUFBN0IsQ0FBQSxDQUFBO2FBQ0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxJQUFmLENBQW9CLENBQUMsT0FBckIsQ0FBNkIsQ0FBQyxJQUFELEVBQU8sa0JBQVAsQ0FBN0IsRUFGdUI7SUFBQSxDQUF6QixFQXpCbUM7RUFBQSxDQUFyQyxDQUhBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/niv/.atom/packages/build-tools/spec/modifier-shell-spec.coffee
