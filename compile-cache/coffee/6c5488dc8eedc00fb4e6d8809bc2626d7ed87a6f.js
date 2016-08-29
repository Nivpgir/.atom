(function() {
  var Command, Wildcards, path;

  Wildcards = require('../lib/modifier/wildcards');

  Command = require('../lib/provider/command');

  path = require('path');

  describe('Command Modifier - Wildcards', function() {
    var command;
    command = null;
    beforeEach(function() {
      command = new Command({
        project: atom.project.getPaths()[0],
        name: 'Test',
        command: 'echo %f',
        wd: '.',
        env: {},
        modifier: {
          wildcards: {}
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
      jasmine.attachToDOM(atom.views.getView(atom.workspace));
      waitsForPromise(function() {
        return atom.workspace.open(path.join(atom.project.getPaths()[0], 'test.vhd'));
      });
      Wildcards.activate();
      return waitsForPromise(function() {
        return Wildcards.preSplit(command);
      });
    });
    return it('returns valid data', function() {
      return expect(command.command).toBe('echo test.vhd');
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL3NwZWMvbW9kaWZpZXItd2lsZGNhcmRzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdCQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSwyQkFBUixDQUFaLENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLHlCQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsOEJBQVQsRUFBeUMsU0FBQSxHQUFBO0FBQ3ZDLFFBQUEsT0FBQTtBQUFBLElBQUEsT0FBQSxHQUFVLElBQVYsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsT0FBQSxHQUFjLElBQUEsT0FBQSxDQUFRO0FBQUEsUUFDcEIsT0FBQSxFQUFTLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQURiO0FBQUEsUUFFcEIsSUFBQSxFQUFNLE1BRmM7QUFBQSxRQUdwQixPQUFBLEVBQVMsU0FIVztBQUFBLFFBSXBCLEVBQUEsRUFBSSxHQUpnQjtBQUFBLFFBS3BCLEdBQUEsRUFBSyxFQUxlO0FBQUEsUUFNcEIsUUFBQSxFQUNFO0FBQUEsVUFBQSxTQUFBLEVBQVcsRUFBWDtTQVBrQjtBQUFBLFFBUXBCLE1BQUEsRUFDRTtBQUFBLFVBQUEsWUFBQSxFQUFjLElBQWQ7U0FUa0I7QUFBQSxRQVVwQixNQUFBLEVBQ0U7QUFBQSxVQUFBLFlBQUEsRUFBYyxJQUFkO1NBWGtCO0FBQUEsUUFZcEIsTUFBQSxFQUNFO0FBQUEsVUFBQSxPQUFBLEVBQ0U7QUFBQSxZQUFBLGFBQUEsRUFBZSxLQUFmO1dBREY7U0Fia0I7QUFBQSxRQWVwQixPQUFBLEVBQVMsQ0FmVztPQUFSLENBQWQsQ0FBQTtBQUFBLE1BaUJBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBcEIsQ0FqQkEsQ0FBQTtBQUFBLE1Ba0JBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLFVBQXRDLENBQXBCLEVBQUg7TUFBQSxDQUFoQixDQWxCQSxDQUFBO0FBQUEsTUFtQkEsU0FBUyxDQUFDLFFBQVYsQ0FBQSxDQW5CQSxDQUFBO2FBb0JBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsU0FBUyxDQUFDLFFBQVYsQ0FBbUIsT0FBbkIsRUFBSDtNQUFBLENBQWhCLEVBckJTO0lBQUEsQ0FBWCxDQUZBLENBQUE7V0F5QkEsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUEsR0FBQTthQUN2QixNQUFBLENBQU8sT0FBTyxDQUFDLE9BQWYsQ0FBdUIsQ0FBQyxJQUF4QixDQUE2QixlQUE3QixFQUR1QjtJQUFBLENBQXpCLEVBMUJ1QztFQUFBLENBQXpDLENBSkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/niv/.atom/packages/build-tools/spec/modifier-wildcards-spec.coffee
