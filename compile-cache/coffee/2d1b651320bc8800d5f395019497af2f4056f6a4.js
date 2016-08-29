(function() {
  var Module;

  Module = require('../lib/output/buffer');

  describe('Output Module - Buffer', function() {
    var module;
    module = null;
    beforeEach(function() {
      jasmine.attachToDOM(atom.views.getView(atom.workspace));
      Module.activate();
      return module = new Module.output;
    });
    afterEach(function() {
      module = null;
      return Module.deactivate();
    });
    describe('On false/false // false', function() {
      var buffer0, buffer1;
      buffer0 = null;
      buffer1 = null;
      beforeEach(function() {
        module.newQueue({
          queue: [
            {
              project: 'a',
              name: 'a',
              output: {
                buffer: {
                  recycle_buffer: false
                }
              }
            }, {
              project: 'b',
              name: 'a',
              output: {
                buffer: {
                  recycle_buffer: false,
                  queue_in_buffer: false
                }
              }
            }
          ]
        });
        module.newCommand({
          project: 'a',
          name: 'a',
          output: {
            buffer: {
              recycle_buffer: false
            }
          }
        });
        module.stdout_in({
          input: 'Hello World from a'
        });
        waitsFor(function() {
          return module.buffer !== null;
        });
        return runs(function() {
          buffer0 = module.buffer.getText();
          module.newCommand({
            project: 'b',
            name: 'a',
            output: {
              buffer: {
                recycle_buffer: false,
                queue_in_buffer: false
              }
            }
          });
          module.stdout_in({
            input: 'Hello World from b'
          });
          waitsFor(function() {
            return module.buffer !== null;
          });
          return runs(function() {
            return buffer1 = module.buffer.getText();
          });
        });
      });
      it('writes the first command to the first buffer', function() {
        return expect(buffer0).toBe('Hello World from a\n');
      });
      it('writes the second command to the second buffer', function() {
        return expect(buffer1).toBe('Hello World from b\n');
      });
      return describe('On rerun', function() {
        buffer0 = null;
        buffer1 = null;
        beforeEach(function() {
          module.newQueue({
            queue: [
              {
                project: 'a',
                name: 'a',
                output: {
                  buffer: {
                    recycle_buffer: false
                  }
                }
              }, {
                project: 'b',
                name: 'a',
                output: {
                  buffer: {
                    recycle_buffer: false,
                    queue_in_buffer: false
                  }
                }
              }
            ]
          });
          module.newCommand({
            project: 'a',
            name: 'a',
            output: {
              buffer: {
                recycle_buffer: false
              }
            }
          });
          module.stdout_in({
            input: 'Hello World from a'
          });
          waitsFor(function() {
            return module.buffer !== null;
          });
          return runs(function() {
            buffer0 = module.buffer.getText();
            module.newCommand({
              project: 'b',
              name: 'a',
              output: {
                buffer: {
                  recycle_buffer: false,
                  queue_in_buffer: false
                }
              }
            });
            module.stdout_in({
              input: 'Hello World from b'
            });
            waitsFor(function() {
              return module.buffer !== null;
            });
            return runs(function() {
              return buffer1 = module.buffer.getText();
            });
          });
        });
        it('writes the first command to the first buffer', function() {
          return expect(buffer0).toBe('Hello World from a\n');
        });
        return it('writes the second command to the second buffer', function() {
          return expect(buffer1).toBe('Hello World from b\n');
        });
      });
    });
    describe('On false/false // true', function() {
      var buffer0, buffer1;
      buffer0 = null;
      buffer1 = null;
      beforeEach(function() {
        module.newQueue({
          queue: [
            {
              project: 'a',
              name: 'a',
              output: {
                buffer: {
                  recycle_buffer: true
                }
              }
            }, {
              project: 'b',
              name: 'a',
              output: {
                buffer: {
                  recycle_buffer: false,
                  queue_in_buffer: false
                }
              }
            }
          ]
        });
        module.newCommand({
          project: 'a',
          name: 'a',
          output: {
            buffer: {
              recycle_buffer: true
            }
          }
        });
        module.stdout_in({
          input: 'Hello World from a'
        });
        waitsFor(function() {
          return module.buffer != null;
        });
        return runs(function() {
          buffer0 = module.buffer.getText();
          module.newCommand({
            project: 'b',
            name: 'a',
            output: {
              buffer: {
                recycle_buffer: false,
                queue_in_buffer: false
              }
            }
          });
          module.stdout_in({
            input: 'Hello World from b'
          });
          waitsFor(function() {
            return module.buffer != null;
          });
          return runs(function() {
            return buffer1 = module.buffer.getText();
          });
        });
      });
      it('writes the first command to the first buffer', function() {
        return expect(buffer0).toBe('Hello World from a\n');
      });
      it('writes the second command to the second buffer', function() {
        return expect(buffer1).toBe('Hello World from b\n');
      });
      it('saves one buffer for re-cycling', function() {
        expect(Module.getBuffers()['a']['a'].getText()).toBe('Hello World from a\n');
        return expect(Module.getBuffers()['b']).toBeUndefined();
      });
      return describe('On rerun', function() {
        buffer0 = null;
        buffer1 = null;
        beforeEach(function() {
          module.newQueue({
            queue: [
              {
                project: 'a',
                name: 'a',
                output: {
                  buffer: {
                    recycle_buffer: true
                  }
                }
              }, {
                project: 'b',
                name: 'a',
                output: {
                  buffer: {
                    recycle_buffer: false,
                    queue_in_buffer: false
                  }
                }
              }
            ]
          });
          module.newCommand({
            project: 'a',
            name: 'a',
            output: {
              buffer: {
                recycle_buffer: true
              }
            }
          });
          module.stdout_in({
            input: 'Hello World from a'
          });
          waitsFor(function() {
            return module.buffer != null;
          });
          return runs(function() {
            buffer0 = module.buffer;
            module.newCommand({
              project: 'b',
              name: 'a',
              output: {
                buffer: {
                  recycle_buffer: false,
                  queue_in_buffer: false
                }
              }
            });
            module.stdout_in({
              input: 'Hello World from b'
            });
            waitsFor(function() {
              return module.buffer != null;
            });
            return runs(function() {
              return buffer1 = module.buffer;
            });
          });
        });
        it('writes the first command to the first buffer', function() {
          return expect(buffer0.getText()).toBe('Hello World from a\n');
        });
        it('writes the second command to the second buffer', function() {
          return expect(buffer1.getText()).toBe('Hello World from b\n');
        });
        return it('uses the recycled buffer', function() {
          expect(Module.getBuffers()['a']['a'].getText()).toBe('Hello World from a\n');
          expect(Module.getBuffers()['b']).toBeUndefined();
          return expect(Module.getBuffers()['a']['a']).toBe(buffer0);
        });
      });
    });
    return describe('On true/true // true', function() {
      var buffer0, buffer1;
      buffer0 = null;
      buffer1 = null;
      beforeEach(function() {
        module.newQueue({
          queue: [
            {
              project: 'a',
              name: 'a',
              output: {
                buffer: {
                  recycle_buffer: true
                }
              }
            }, {
              project: 'b',
              name: 'a',
              output: {
                buffer: {
                  recycle_buffer: true,
                  queue_in_buffer: true
                }
              }
            }
          ]
        });
        module.newCommand({
          project: 'a',
          name: 'a',
          output: {
            buffer: {
              recycle_buffer: true
            }
          }
        });
        module.stdout_in({
          input: 'Hello World from a'
        });
        waitsFor(function() {
          return module.buffer != null;
        });
        return runs(function() {
          buffer0 = module.buffer;
          module.newCommand({
            project: 'b',
            name: 'a',
            output: {
              buffer: {
                recycle_buffer: true,
                queue_in_buffer: true
              }
            }
          });
          module.stdout_in({
            input: 'Hello World from b'
          });
          waitsFor(function() {
            return module.buffer != null;
          });
          return runs(function() {
            return buffer1 = module.buffer;
          });
        });
      });
      it('writes the first command to the first buffer', function() {
        return expect(buffer0.getText()).toBe('Hello World from a\nHello World from b\n');
      });
      it('writes the second command to the first buffer', function() {
        return expect(buffer1.getText()).toBe('Hello World from a\nHello World from b\n');
      });
      it('saves one buffer for re-cycling', function() {
        expect(Module.getBuffers()['b']['a'].getText()).toBe('Hello World from a\nHello World from b\n');
        expect(Module.getBuffers()['a']).toBeUndefined();
        return expect(buffer0).toBe(buffer1);
      });
      return describe('On rerun', function() {
        buffer0 = null;
        buffer1 = null;
        beforeEach(function() {
          module.newQueue({
            queue: [
              {
                project: 'a',
                name: 'a',
                output: {
                  buffer: {
                    recycle_buffer: true
                  }
                }
              }, {
                project: 'b',
                name: 'a',
                output: {
                  buffer: {
                    recycle_buffer: true,
                    queue_in_buffer: true
                  }
                }
              }
            ]
          });
          module.newCommand({
            project: 'a',
            name: 'a',
            output: {
              buffer: {
                recycle_buffer: true
              }
            }
          });
          module.stdout_in({
            input: 'Hello World from a'
          });
          waitsFor(function() {
            return module.buffer != null;
          });
          return runs(function() {
            buffer0 = module.buffer;
            module.newCommand({
              project: 'b',
              name: 'a',
              output: {
                buffer: {
                  recycle_buffer: true,
                  queue_in_buffer: true
                }
              }
            });
            module.stdout_in({
              input: 'Hello World from b'
            });
            waitsFor(function() {
              return module.buffer != null;
            });
            return runs(function() {
              return buffer1 = module.buffer;
            });
          });
        });
        it('writes the first command to the first buffer', function() {
          return expect(buffer0.getText()).toBe('Hello World from a\nHello World from b\n');
        });
        it('writes the second command to the first buffer', function() {
          return expect(buffer1.getText()).toBe('Hello World from a\nHello World from b\n');
        });
        return it('uses the shared buffer', function() {
          expect(Module.getBuffers()['b']['a'].getText()).toBe('Hello World from a\nHello World from b\n');
          expect(Module.getBuffers()['a']).toBeUndefined();
          expect(Module.getBuffers()['b']['a']).toBe(buffer0);
          return expect(buffer0).toBe(buffer1);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL3NwZWMvb3V0cHV0LWJ1ZmZlci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxNQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxzQkFBUixDQUFULENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsd0JBQVQsRUFBbUMsU0FBQSxHQUFBO0FBQ2pDLFFBQUEsTUFBQTtBQUFBLElBQUEsTUFBQSxHQUFTLElBQVQsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFwQixDQUFBLENBQUE7QUFBQSxNQUNBLE1BQU0sQ0FBQyxRQUFQLENBQUEsQ0FEQSxDQUFBO2FBRUEsTUFBQSxHQUFTLEdBQUEsQ0FBQSxNQUFVLENBQUMsT0FIWDtJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFPQSxTQUFBLENBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxNQUFBLEdBQVMsSUFBVCxDQUFBO2FBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBQSxFQUZRO0lBQUEsQ0FBVixDQVBBLENBQUE7QUFBQSxJQVdBLFFBQUEsQ0FBUyx5QkFBVCxFQUFvQyxTQUFBLEdBQUE7QUFDbEMsVUFBQSxnQkFBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLElBQVYsQ0FBQTtBQUFBLE1BQ0EsT0FBQSxHQUFVLElBRFYsQ0FBQTtBQUFBLE1BR0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsTUFBTSxDQUFDLFFBQVAsQ0FBZ0I7QUFBQSxVQUFBLEtBQUEsRUFBTztZQUNyQjtBQUFBLGNBQUMsT0FBQSxFQUFTLEdBQVY7QUFB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

//# sourceURL=/home/niv/.atom/packages/build-tools/spec/output-buffer-spec.coffee
