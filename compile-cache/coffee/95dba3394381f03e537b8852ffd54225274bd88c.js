(function() {
  var Project, path;

  Project = require('../lib/provider/project');

  path = require('path');

  describe('Project Configuration', function() {
    var file, folder, instance;
    instance = null;
    folder = null;
    file = null;
    beforeEach(function() {
      folder = atom.project.getPaths()[0];
      file = path.join(folder, '.build-tools.cson');
      instance = new Project(folder, file);
      return spyOn(instance, 'save');
    });
    afterEach(function() {
      return instance.destroy();
    });
    describe('on ::getCommandByIndex with a valid id', function() {
      var command;
      command = null;
      beforeEach(function() {
        var p;
        p = instance.getCommandByIndex(0);
        p.then(function(c) {
          return command = c;
        });
        return waitsForPromise(function() {
          return p;
        });
      });
      return it('returns the correct command', function() {
        return expect(command.name).toBe('Test');
      });
    });
    describe('on ::getCommandById on the second provider', function() {
      var command;
      command = null;
      beforeEach(function() {
        var p;
        p = instance.getCommandById(1, 1);
        p.then(function(c) {
          return command = c;
        });
        return waitsForPromise(function() {
          return p;
        });
      });
      return it('returns the correct command', function() {
        return expect(command.name).toBe('Bar 2');
      });
    });
    describe('on ::getCommandNameObjects', function() {
      var commands;
      commands = null;
      beforeEach(function() {
        var p;
        p = instance.getCommandNameObjects();
        p.then(function(cs) {
          return commands = cs;
        });
        return waitsForPromise(function() {
          return p;
        });
      });
      return it('returns the correct commands', function() {
        var c;
        return expect((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = commands.length; _i < _len; _i++) {
            c = commands[_i];
            _results.push(c.name);
          }
          return _results;
        })()).toEqual(['Test', 'Bar', 'Bar 2', 'Bar', 'Bar 2']);
      });
    });
    describe('on ::addProvider', function() {
      beforeEach(function() {
        return instance.addProvider('bt');
      });
      it('adds the provider', function() {
        return expect(instance.providers[3].key).toBe('bt');
      });
      return it('calls save', function() {
        return expect(instance.save).toHaveBeenCalled();
      });
    });
    describe('on ::removeProvider', function() {
      beforeEach(function() {
        return instance.removeProvider(2);
      });
      it('adds the provider', function() {
        return expect(instance.providers[2]).toBeUndefined();
      });
      return it('calls save', function() {
        return expect(instance.save).toHaveBeenCalled();
      });
    });
    describe('on ::moveProviderUp', function() {
      beforeEach(function() {
        return instance.moveProviderUp(1);
      });
      it('moves the provider', function() {
        expect(instance.providers[0].key).toBe('bte');
        return expect(instance.providers[1].key).toBe('bt');
      });
      return it('calls save', function() {
        return expect(instance.save).toHaveBeenCalled();
      });
    });
    return describe('on ::moveProviderDown', function() {
      beforeEach(function() {
        return instance.moveProviderDown(0);
      });
      it('moves the provider', function() {
        expect(instance.providers[0].key).toBe('bte');
        return expect(instance.providers[1].key).toBe('bt');
      });
      return it('calls save', function() {
        return expect(instance.save).toHaveBeenCalled();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL3NwZWMvcHJvamVjdC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxhQUFBOztBQUFBLEVBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSx5QkFBUixDQUFWLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsUUFBQSxDQUFTLHVCQUFULEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxRQUFBLHNCQUFBO0FBQUEsSUFBQSxRQUFBLEdBQVcsSUFBWCxDQUFBO0FBQUEsSUFDQSxNQUFBLEdBQVMsSUFEVCxDQUFBO0FBQUEsSUFFQSxJQUFBLEdBQU8sSUFGUCxDQUFBO0FBQUEsSUFJQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWpDLENBQUE7QUFBQSxNQUNBLElBQUEsR0FBTyxJQUFJLENBQUMsSUFBTCxDQUFVLE1BQVYsRUFBa0IsbUJBQWxCLENBRFAsQ0FBQTtBQUFBLE1BRUEsUUFBQSxHQUFlLElBQUEsT0FBQSxDQUFRLE1BQVIsRUFBZ0IsSUFBaEIsQ0FGZixDQUFBO2FBR0EsS0FBQSxDQUFNLFFBQU4sRUFBZ0IsTUFBaEIsRUFKUztJQUFBLENBQVgsQ0FKQSxDQUFBO0FBQUEsSUFVQSxTQUFBLENBQVUsU0FBQSxHQUFBO2FBQ1IsUUFBUSxDQUFDLE9BQVQsQ0FBQSxFQURRO0lBQUEsQ0FBVixDQVZBLENBQUE7QUFBQSxJQWFBLFFBQUEsQ0FBUyx3Q0FBVCxFQUFtRCxTQUFBLEdBQUE7QUFDakQsVUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsSUFBVixDQUFBO0FBQUEs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

//# sourceURL=/home/niv/.atom/packages/build-tools/spec/project-spec.coffee
