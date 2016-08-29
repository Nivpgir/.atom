(function() {
  var Command, CommandWorker, _command;

  CommandWorker = require('../lib/pipeline/command-worker');

  Command = require('../lib/provider/command');

  _command = {
    name: '',
    command: '',
    wd: '.',
    stdout: {
      highlighting: 'nh'
    },
    stderr: {
      highlighting: 'ha'
    },
    version: 1
  };

  describe('Command Worker', function() {
    var command, output, promise, worker;
    worker = null;
    output = null;
    command = null;
    promise = null;
    beforeEach(function() {
      command = new Command(_command);
      output = {
        newQueue: jasmine.createSpy('newQueue'),
        newCommand: jasmine.createSpy('newCommand'),
        exitCommand: jasmine.createSpy('exitCommand'),
        exitQueue: jasmine.createSpy('exitQueue'),
        stdout_in: jasmine.createSpy('stdout_in'),
        stdout_setType: jasmine.createSpy('stdout_setType'),
        stderr_in: jasmine.createSpy('stderr_in'),
        stderr_setType: jasmine.createSpy('stderr_setType'),
        stderr_print: jasmine.createSpy('stderr_setType'),
        stderr_linter: jasmine.createSpy('stderr_linter'),
        error: jasmine.createSpy('error')
      };
      command.project = atom.project.getPaths()[0];
      worker = new CommandWorker(command, [output]);
      return promise = worker.run();
    });
    afterEach(function() {
      return worker.destroy();
    });
    it('calls newCommand of all outputs', function() {
      return expect(output.newCommand).toHaveBeenCalledWith(command);
    });
    describe('on input', function() {
      beforeEach(function() {
        return worker.manager.stdout["in"]('Hello World\n');
      });
      return it('calls stdout.in of all outputs', function() {
        return expect(output.stdout_in).toHaveBeenCalledWith({
          input: 'Hello World',
          files: []
        });
      });
    });
    describe('on error', function() {
      beforeEach(function() {
        return worker.environment.process.error('Test Error');
      });
      it('calls error of all outputs', function() {
        return expect(output.error).toHaveBeenCalledWith('Test Error');
      });
      return it('does not call exitCommand', function() {
        return expect(output.exitCommand).not.toHaveBeenCalled();
      });
    });
    describe('on finish', function() {
      beforeEach(function() {
        worker.environment.process.exit(0);
        return waitsForPromise(function() {
          return promise;
        });
      });
      it('calls exitCommand of all outputs', function() {
        return promise.then(function() {
          return expect(output.exitCommand).toHaveBeenCalledWith(0);
        });
      });
      return it('calls the finish callback', function() {
        return promise.then(function(finish) {
          return expect(finish).toBe(0);
        });
      });
    });
    return describe('on stop', function() {
      beforeEach(function() {
        worker.kill();
        return waitsForPromise(function() {
          return promise;
        });
      });
      it('does not call exitCommand', function() {
        return expect(output.exitCommand).toHaveBeenCalledWith(null);
      });
      return it('calls the finish callback', function() {
        return promise.then(function(finish) {
          return expect(finish).toBe(null);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL3NwZWMvY29tbWFuZC13b3JrZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0NBQUE7O0FBQUEsRUFBQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxnQ0FBUixDQUFoQixDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSx5QkFBUixDQURWLENBQUE7O0FBQUEsRUFHQSxRQUFBLEdBQ0U7QUFBQSxJQUFBLElBQUEsRUFBTSxFQUFOO0FBQUEsSUFDQSxPQUFBLEVBQVMsRUFEVDtBQUFBLElBRUEsRUFBQSxFQUFJLEdBRko7QUFBQSxJQUdBLE1BQUEsRUFDRTtBQUFBLE1BQUEsWUFBQSxFQUFjLElBQWQ7S0FKRjtBQUFBLElBS0EsTUFBQSxFQUNFO0FBQUEsTUFBQSxZQUFBLEVBQWMsSUFBZDtLQU5GO0FBQUEsSUFPQSxPQUFBLEVBQVMsQ0FQVDtHQUpGLENBQUE7O0FBQUEsRUFhQSxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQSxHQUFBO0FBQ3pCLFFBQUEsZ0NBQUE7QUFBQSxJQUFBLE1BQUEsR0FBUyxJQUFULENBQUE7QUFBQSxJQUNBLE1BQUEsR0FBUyxJQURULENBQUE7QUFBQSxJQUVBLE9BQUEsR0FBVSxJQUZWLENBQUE7QUFBQSxJQUdBLE9BQUEsR0FBVSxJQUhWLENBQUE7QUFBQSxJQUtBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLE9BQUEsR0FBYyxJQUFBLE9BQUEsQ0FBUSxRQUFSLENBQWQsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxHQUNFO0FBQUEsUUFBQSxRQUFBLEVBQVUsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsVUFBbEIsQ0FBVjtBQUFBLFFBQ0EsVUFBQSxFQUFZLE9BQU8sQ0FBQyxTQUFSLENBQWtCLFlB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

//# sourceURL=/home/niv/.atom/packages/build-tools/spec/command-worker-spec.coffee
