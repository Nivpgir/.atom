(function() {
  var InputOutputManager, command, path;

  InputOutputManager = require('../lib/pipeline/io-manager');

  path = require('path');

  command = {
    name: '',
    command: '',
    wd: '.',
    stdout: {
      pipeline: [
        {
          name: 'all'
        }, {
          name: 'remansi'
        }
      ]
    },
    stderr: {
      pipeline: [
        {
          name: 'profile',
          config: {
            profile: 'modelsim'
          }
        }
      ]
    },
    version: 2
  };

  describe('Output Manager', function() {
    var input, input_cb, manager, output, write_cb;
    manager = null;
    output = null;
    write_cb = null;
    input = null;
    input_cb = null;
    beforeEach(function() {
      output = {
        newCommand: jasmine.createSpy('newCommand'),
        exitCommand: jasmine.createSpy('exitCommand'),
        setInput: jasmine.createSpy('input').andCallFake(function(_input) {
          return input_cb = _input.write;
        }),
        onInput: jasmine.createSpy('oninput'),
        stdout_in: jasmine.createSpy('stdout_in'),
        stdout_setType: jasmine.createSpy('stdout_setType'),
        stdout_print: jasmine.createSpy('stdout_print'),
        stderr_in: jasmine.createSpy('stderr_in'),
        stderr_setType: jasmine.createSpy('stderr_setType'),
        stderr_print: jasmine.createSpy('stderr_setType'),
        stderr_linter: jasmine.createSpy('stderr_linter')
      };
      input = {
        write: jasmine.createSpy('write').andCallFake(write_cb = (function(a, b, cb) {
          return cb();
        })),
        end: jasmine.createSpy('end')
      };
      command.project = atom.project.getPaths()[0];
      manager = new InputOutputManager(command, [output]);
      return manager.setInput(input);
    });
    afterEach(function() {
      return manager.destroy();
    });
    it('initalizes the output module', function() {
      return expect(output.newCommand).toHaveBeenCalledWith(command);
    });
    it('initalizes the input callbacks', function() {
      return expect(output.setInput).toHaveBeenCalled();
    });
    describe('On stdin output', function() {
      beforeEach(function() {
        return input_cb('Test');
      });
      it('calls the input stream\'s write function', function() {
        expect(input.write).toHaveBeenCalled();
        return expect(input.write.mostRecentCall.args[0]).toBe('Test');
      });
      return it('calls the input callback', function() {
        return expect(output.onInput).toHaveBeenCalledWith('Test');
      });
    });
    describe('On stdout input', function() {
      var end_line, mid_line, new_line;
      new_line = null;
      mid_line = null;
      end_line = null;
      beforeEach(function() {
        new_line = jasmine.createSpy('new_line');
        mid_line = jasmine.createSpy('mid_line');
        end_line = jasmine.createSpy('end_line');
        manager.stdout.subscribers.on('new', new_line);
        manager.stdout.subscribers.on('raw', mid_line);
        return manager.stdout.subscribers.on('input', end_line);
      });
      describe('On single line', function() {
        beforeEach(function() {
          return manager.stdout["in"]('This is a single line\n');
        });
        it('calls "new"', function() {
          return expect(new_line.callCount).toBe(1);
        });
        it('calls "raw"', function() {
          return expect(mid_line).toHaveBeenCalledWith('This is a single line');
        });
        return it('calls "input"', function() {
          expect(end_line).toHaveBeenCalled();
          return expect(end_line.mostRecentCall.args[0].input).toBe('This is a single line');
        });
      });
      describe('On multiple lines (2 full, last broken)', function() {
        beforeEach(function() {
          return manager.stdout["in"]('First line\nSecond line\nThird');
        });
        it('calls "new" 3 times', function() {
          return expect(new_line.callCount).toBe(3);
        });
        it('calls "raw" 3 times', function() {
          expect(mid_line.callCount).toBe(3);
          return expect(mid_line.argsForCall).toEqual([['First line'], ['Second line'], ['Third']]);
        });
        it('calls "input" 2 times', function() {
          expect(end_line.callCount).toBe(2);
          expect(end_line.argsForCall[0][0].input).toBe('First line');
          return expect(end_line.argsForCall[1][0].input).toBe('Second line');
        });
        it('resets buffer', function() {
          return expect(manager.stdout.buffer).toBe('Third');
        });
        return describe('On adding to the third line', function() {
          beforeEach(function() {
            return manager.stdout["in"](' line');
          });
          it('does not call "new"', function() {
            return expect(new_line.callCount).toBe(3);
          });
          it('calls "raw"', function() {
            return expect(mid_line.mostRecentCall.args[0]).toBe(' line');
          });
          it('updates buffer', function() {
            return expect(manager.stdout.buffer).toBe('Third line');
          });
          return describe('On finishing the third line', function() {
            beforeEach(function() {
              return manager.stdout["in"]('\n');
            });
            it('calls "new"', function() {
              return expect(new_line.callCount).toBe(3);
            });
            return it('calls "input"', function() {
              expect(end_line.callCount).toBe(3);
              return expect(end_line.mostRecentCall.args[0].input).toBe('Third line');
            });
          });
        });
      });
      return describe('When encountering ANSI-Sequences', function() {
        describe('in one input string', function() {
          beforeEach(function() {
            return manager.stdout["in"]('Hello\x1b[36mWorld\n');
          });
          it('calls "new"', function() {
            return expect(new_line.callCount).toBe(1);
          });
          it('calls "raw" without the escape sequence', function() {
            return expect(mid_line.mostRecentCall.args[0]).toBe('HelloWorld');
          });
          return it('calls "input"', function() {
            return expect(end_line.mostRecentCall.args[0].input).toBe('HelloWorld');
          });
        });
        return describe('in split input', function() {
          beforeEach(function() {
            return manager.stdout["in"]('Hello\x1b[');
          });
          it('calls "new"', function() {
            return expect(new_line).toHaveBeenCalled();
          });
          it('calls "raw"', function() {
            return expect(mid_line.mostRecentCall.args[0]).toBe('Hello');
          });
          return describe('second part', function() {
            beforeEach(function() {
              return manager.stdout["in"]('36');
            });
            it('does not call "new"', function() {
              return expect(new_line.callCount).toBe(1);
            });
            it('does not call "raw"', function() {
              return expect(mid_line.callCount).toBe(1);
            });
            return describe('third part', function() {
              beforeEach(function() {
                return manager.stdout["in"]('mWorld\n');
              });
              it('does not call "new"', function() {
                return expect(new_line.callCount).toBe(1);
              });
              it('calls "raw"', function() {
                return expect(mid_line.mostRecentCall.args[0]).toBe('World');
              });
              return it('calls "input"', function() {
                return expect(end_line.mostRecentCall.args[0].input).toBe('HelloWorld');
              });
            });
          });
        });
      });
    });
    describe('On stderr input', function() {
      var end_line, mid_line, new_line;
      new_line = null;
      mid_line = null;
      end_line = null;
      beforeEach(function() {
        new_line = jasmine.createSpy('new_line');
        mid_line = jasmine.createSpy('mid_line');
        end_line = jasmine.createSpy('end_line');
        manager.stderr.subscribers.on('new', new_line);
        manager.stderr.subscribers.on('raw', mid_line);
        return manager.stderr.subscribers.on('input', end_line);
      });
      describe('On single line', function() {
        beforeEach(function() {
          return manager.stderr["in"]('This is a single line\n');
        });
        it('calls "new"', function() {
          return expect(new_line).toHaveBeenCalled();
        });
        it('calls "raw"', function() {
          return expect(mid_line).toHaveBeenCalledWith('This is a single line');
        });
        return it('calls "input"', function() {
          expect(end_line).toHaveBeenCalled();
          return expect(end_line.mostRecentCall.args[0].input).toBe('This is a single line');
        });
      });
      return describe('On multiple lines (2 full, last broken)', function() {
        beforeEach(function() {
          return manager.stderr["in"]('First line\nSecond line\nThird');
        });
        it('calls "new" 3 times', function() {
          return expect(new_line.callCount).toBe(3);
        });
        it('calls "raw" 3 times', function() {
          expect(mid_line.callCount).toBe(3);
          return expect(mid_line.argsForCall).toEqual([['First line'], ['Second line'], ['Third']]);
        });
        it('calls "input" 2 times', function() {
          expect(end_line.callCount).toBe(2);
          expect(end_line.argsForCall[0][0].input).toBe('First line');
          return expect(end_line.argsForCall[1][0].input).toBe('Second line');
        });
        it('resets buffer', function() {
          return expect(manager.stderr.buffer).toBe('Third');
        });
        return describe('On adding to the third line', function() {
          beforeEach(function() {
            return manager.stderr["in"](' line');
          });
          it('calls "raw"', function() {
            return expect(mid_line.mostRecentCall.args[0]).toBe(' line');
          });
          it('updates buffer', function() {
            return expect(manager.stderr.buffer).toBe('Third line');
          });
          return describe('On finishing the third line', function() {
            beforeEach(function() {
              return manager.stderr["in"]('\n');
            });
            it('calls "new"', function() {
              return expect(new_line.callCount).toBe(3);
            });
            return it('calls "input"', function() {
              expect(end_line.callCount).toBe(3);
              return expect(end_line.mostRecentCall.args[0].input).toBe('Third line');
            });
          });
        });
      });
    });
    describe('On stdout input', function() {
      return it('calls the correct functions', function() {
        manager.stdout["in"]('Hello World\n');
        expect(output.stdout_in).toHaveBeenCalledWith({
          input: 'Hello World',
          files: []
        });
        expect(output.stdout_print).not.toHaveBeenCalled();
        return expect(output.stdout_setType).toHaveBeenCalledWith('warning');
      });
    });
    describe('On stderr input', function() {
      return it('calls the correct functions', function() {
        var match, test;
        input = '** Error: test.vhd(278): VHDL Compiler exiting';
        manager.stderr["in"]("" + input + "\n");
        expect(output.stderr_in.mostRecentCall.args[0].input).toBe(input);
        match = {
          type: 'error',
          message: 'VHDL Compiler exiting',
          file: path.join(atom.project.getPaths()[0], 'test.vhd'),
          row: '278',
          input: input
        };
        test = output.stderr_print.mostRecentCall.args[0].input;
        expect(test.input).toBe(match.input);
        expect(test.type).toBe(match.type);
        test = output.stderr_linter.mostRecentCall.args[0];
        expect(test.text).toBe(match.message);
        expect(test.type).toBe(match.type);
        expect(test.filePath).toBe(match.file);
        return expect(test.range).toEqual([[277, 0], [277, 9999]]);
      });
    });
    return describe('When command has finished', function() {
      beforeEach(function() {
        return manager.finish(0);
      });
      return it('sends the exit code to the module', function() {
        return expect(output.exitCommand).toHaveBeenCalledWith(0);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL3NwZWMvaW8tbWFuYWdlci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpQ0FBQTs7QUFBQSxFQUFBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSw0QkFBUixDQUFyQixDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUlBLE9BQUEsR0FDSTtBQUFBLElBQUEsSUFBQSxFQUFNLEVBQU47QUFBQSxJQUNBLE9BQUEsRUFBUyxFQURUO0FBQUEsSUFFQSxFQUFBLEVBQUksR0FGSjtBQUFBLElBR0EsTUFBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQVU7UUFDUjtBQUFBLFVBQ0UsSUFBQSxFQUFNLEtBRFI7U0FEUSxFQUlSO0FBQUEsVUFDRSxJQUFBLEVBQU0sU0FEUjtTQUpRO09BQVY7S0FKRjtBQUFBLElBWUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQVU7UUFDUjtBQUFBLFVBQ0UsSUFBQSxFQUFNLFNBRFI7QUFBQSxVQUVFLE1BQUEsRUFBUTtBQUFBLFlBQUMsT0FBQSxFQUFTLFVBQVY7V0FGVjtTQURRO09BQVY7S0FiRjtBQUFBLElBbUJBLE9BQUEsRUFBUyxDQW5CVDtHQUxKLENBQUE7O0FBQUEsRUEwQkEsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUEsR0FBQTtBQUN6QixRQUFBLDBDQUFBO0FBQUEsSUFBQSxPQUFBLEdBQVUsSUFBVixDQUFBO0FBQUEsSUFDQSxNQUFBLEdBQVMsSUFEVCxDQUFBO0FBQUEsSUFFQSxRQUFBLEdBQVcsSUFGWCxDQUFBO0FBQUEsSUFHQSxLQUFBLEdBQVEsSUFIUixDQUFBO0FBQUEsSUFJQSxRQUFBLEdBQVcsSUFKWCxDQUFBO0FBQUEsSUFNQSxV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

//# sourceURL=/home/niv/.atom/packages/build-tools/spec/io-manager-spec.coffee
