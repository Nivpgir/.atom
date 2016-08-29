(function() {
  var profile;

  profile = require('./helper').profile;

  profile('GCC/Clang', {
    stderr: {
      pipeline: [
        {
          name: 'profile',
          config: {
            profile: 'gcc_clang'
          }
        }
      ]
    }
  }, 'stderr', ['In file included from test/src/def.h:32:0, ', '                 from test/src/gen.h:31, ', '                 from test/src/gen.c:27: ', 'should be traced too', '/usr/include/stdlib.h:483:13: note: expected ‘void *’ but argument is of type ‘const void *’', ' extern void free (void *__ptr) __THROW;', '             ^', 'test/src/gen.c:126:6: error: implicit declaration of function ‘print_element’ [-Wimplicit-function-declaration]', '      print_element(input);', '      ^'], [
    {
      file: 'test/src/def.h',
      row: '32',
      col: '0',
      type: 'trace',
      highlighting: 'note',
      message: 'expected ‘void *’ but argument is of type ‘const void *’'
    }, {
      file: 'test/src/gen.h',
      row: '31',
      col: void 0,
      type: 'trace',
      highlighting: 'note',
      message: 'expected ‘void *’ but argument is of type ‘const void *’'
    }, {
      file: 'test/src/gen.c',
      row: '27',
      col: void 0,
      type: 'trace',
      highlighting: 'note',
      message: 'expected ‘void *’ but argument is of type ‘const void *’'
    }, {
      file: '/usr/include/stdlib.h',
      row: '483',
      col: '13',
      type: 'note',
      message: 'expected ‘void *’ but argument is of type ‘const void *’'
    }, {
      file: 'test/src/gen.c',
      row: '126',
      col: '6',
      type: 'error',
      message: 'implicit declaration of function ‘print_element’ [-Wimplicit-function-declaration]'
    }
  ], [
    [
      {
        file: 'test/src/def.h',
        row: '32',
        col: '0',
        start: 22,
        end: 40
      }
    ], [
      {
        file: 'test/src/gen.h',
        row: '31',
        col: void 0,
        start: 22,
        end: 38
      }
    ], [
      {
        file: 'test/src/gen.c',
        row: '27',
        col: void 0,
        start: 22,
        end: 38
      }
    ], [], [
      {
        file: '/usr/include/stdlib.h',
        row: '483',
        col: '13',
        start: 0,
        end: 27
      }
    ], [], [], [
      {
        file: 'test/src/gen.c',
        row: '126',
        col: '6',
        start: 0,
        end: 19
      }
    ], [], []
  ]);

  profile('apm test', {
    stderr: {
      pipeline: [
        {
          name: 'profile',
          config: {
            profile: 'apm_test'
          }
        }
      ]
    }
  }, 'stderr', ['.................................................FF...............................................', '', 'Profiles', '  apm test', '    on :: in with multi line match', '      it correctly sets warnings', '        Expected undefined to be \'test/src/def.h\'.', '          Error: Expected undefined to be \'test/src/def.h\'.', '          at /home/fabian/.atom/packages/build-tools-cpp/spec/profile-spec.coffee:183:32', '          at [object Object].<anonymous> (/home/fabian/.atom/packages/build-tools-cpp/spec/profile-spec.coffee:340:15)', '          at _fulfilled (/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js:794:54)', '          at self.promiseDispatch.done (/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js:823:30)', '          at Promise.promise.promiseDispatch (/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js:756:13)', '          at /home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js:564:44', '          at flush (/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js:110:17)', '          at process._tickCallback (node.js:357:13)', 'RegExp tests', '  Simple regex', '    it returns the correct match', '      TypeError: Cannot read property \'groups\' of undefined (spec/regex-spec.coffee:16:18)'], [
    {
      type: 'trace',
      message: 'Error: Expected undefined to be \'test/src/def.h\'.',
      file: '/home/fabian/.atom/packages/build-tools-cpp/spec/profile-spec.coffee',
      row: '340',
      col: '15'
    }, {
      type: 'trace',
      message: 'Error: Expected undefined to be \'test/src/def.h\'.',
      file: '/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js',
      row: '794',
      col: '54'
    }, {
      type: 'trace',
      message: 'Error: Expected undefined to be \'test/src/def.h\'.',
      file: '/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js',
      row: '823',
      col: '30'
    }, {
      type: 'trace',
      message: 'Error: Expected undefined to be \'test/src/def.h\'.',
      file: '/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js',
      row: '756',
      col: '13'
    }, {
      type: 'trace',
      message: 'Error: Expected undefined to be \'test/src/def.h\'.',
      file: '/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js',
      row: '564',
      col: '44'
    }, {
      type: 'trace',
      message: 'Error: Expected undefined to be \'test/src/def.h\'.',
      file: '/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js',
      row: '110',
      col: '17'
    }, {
      type: 'trace',
      message: 'Error: Expected undefined to be \'test/src/def.h\'.',
      file: 'node.js',
      row: '357',
      col: '13'
    }, {
      type: 'error',
      message: 'Error: Expected undefined to be \'test/src/def.h\'.',
      file: '/home/fabian/.atom/packages/build-tools-cpp/spec/profile-spec.coffee',
      row: '183',
      col: '32'
    }, {
      type: 'error',
      message: 'TypeError: Cannot read property \'groups\' of undefined',
      file: 'spec/regex-spec.coffee',
      row: '16',
      col: '18'
    }
  ], [
    [], [], [], [], [], [], [], [], [
      {
        file: '/home/fabian/.atom/packages/build-tools-cpp/spec/profile-spec.coffee',
        row: '183',
        col: '32',
        start: 13,
        end: 87
      }
    ], [
      {
        file: '/home/fabian/.atom/packages/build-tools-cpp/spec/profile-spec.coffee',
        row: '340',
        col: '15',
        start: 42,
        end: 116
      }
    ], [
      {
        file: '/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js',
        row: '794',
        col: '54',
        start: 25,
        end: 103
      }
    ], [
      {
        file: '/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js',
        row: '823',
        col: '30',
        start: 40,
        end: 118
      }
    ], [
      {
        file: '/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js',
        row: '756',
        col: '13',
        start: 46,
        end: 124
      }
    ], [
      {
        file: '/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js',
        row: '564',
        col: '44',
        start: 13,
        end: 91
      }
    ], [
      {
        file: '/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js',
        row: '110',
        col: '17',
        start: 20,
        end: 98
      }
    ], [
      {
        file: 'node.js',
        row: '357',
        col: '13',
        start: 36,
        end: 49
      }
    ], [], [], [], [
      {
        file: 'spec/regex-spec.coffee',
        row: '16',
        col: '18',
        start: 61,
        end: 88
      }
    ]
  ]);

  profile('Java', {
    stderr: {
      pipeline: [
        {
          name: 'profile',
          config: {
            profile: 'java'
          }
        }
      ]
    }
  }, 'stderr', ['Buildfile: /home/fabian/Projects/testing/java/build.xml', '', 'compile: ', '    [javac] /home/fabian/Projects/testing/java/build.xml:9: warning: \'includeantruntime\' was not set, defaulting to build.sysclasspath=last; set to false for repeatable builds', '    [javac] Compiling 1 source file to /home/fabian/Projects/testing/java/build/classes', '    [javac] /home/fabian/Projects/testing/java/src/Factorial.java:12: error: incompatible types', '    [javac]     if (fact)', '    [javac]         ^', '    [javac]   required: boolean', '    [javac]   found:    int', '    [javac] /home/fabian/Projects/testing/java/src/Factorial.java:15: error: array required, but int found', '    [javac]       while (fact[1])', '    [javac]                  ^', '    [javac] 2 errors', '', 'BUILD FAILED', '/home/fabian/Projects/testing/java/build.xml: 9: Compile failed; see the compiler error output for details.', '', 'Total time: 0 seconds'], [
    {
      type: 'error',
      message: 'incompatible types',
      file: '/home/fabian/Projects/testing/java/src/Factorial.java',
      row: '12'
    }, {
      type: 'error',
      message: 'array required, but int found',
      file: '/home/fabian/Projects/testing/java/src/Factorial.java',
      row: '15'
    }
  ], [
    [], [], [], [], [], [
      {
        file: '/home/fabian/Projects/testing/java/src/Factorial.java',
        row: '12',
        col: '0',
        start: 12,
        end: 67
      }
    ], [], [], [], [], [
      {
        file: '/home/fabian/Projects/testing/java/src/Factorial.java',
        row: '15',
        col: '0',
        start: 12,
        end: 67
      }
    ], [], [], [], [], [], [], [], []
  ]);

  profile('Python', {
    stderr: {
      pipeline: [
        {
          name: 'profile',
          config: {
            profile: 'python'
          }
        }
      ]
    }
  }, 'stderr', ['Traceback (most recent call last): ', '  File "/home/fabian/Projects/sonata/sonata/info.py", line 208, in on_viewport_resize', '    self.on_artwork_changed(None, self._pixbuf)', '  File "/home/fabian/Projects/sonata/sonata/info.py", line 534, in on_artwork_changed', '    (pix2, w, h) = img.aget_pixbuf_of_size(pixbuf, width)', 'AttributeError: \'module\' object has no attribute \'aget_pixbuf_of_size\'', '  File "./main.py", line 2', '    print "Hello World"', '                      ^', 'SyntaxError: Missing parentheses in call to \'print\''], [
    {
      type: 'trace',
      message: 'AttributeError: \'module\' object has no attribute \'aget_pixbuf_of_size\'',
      file: '/home/fabian/Projects/sonata/sonata/info.py',
      row: '208'
    }, {
      type: 'error',
      message: 'AttributeError: \'module\' object has no attribute \'aget_pixbuf_of_size\'',
      file: '/home/fabian/Projects/sonata/sonata/info.py',
      row: '534',
      trace: [
        {
          type: 'trace',
          text: '(pix2, w, h) = img.aget_pixbuf_of_size(pixbuf, width)',
          filePath: '/home/fabian/Projects/sonata/sonata/info.py',
          range: [[533, 0], [533, 9999]]
        }, {
          type: 'trace',
          text: 'self.on_artwork_changed(None, self._pixbuf)',
          filePath: '/home/fabian/Projects/sonata/sonata/info.py',
          range: [[207, 0], [207, 9999]]
        }
      ]
    }, {
      type: 'error',
      message: 'SyntaxError: Missing parentheses in call to \'print\'',
      file: './main.py',
      row: '2'
    }
  ], [
    [], [
      {
        file: '/home/fabian/Projects/sonata/sonata/info.py',
        row: '208'
      }
    ], [], [
      {
        file: '/home/fabian/Projects/sonata/sonata/info.py',
        row: '534'
      }
    ], [], [], [
      {
        file: './main.py',
        row: '2'
      }
    ], [], [], []
  ]);

  profile('Modelsim', {
    stderr: {
      pipeline: [
        {
          name: 'profile',
          config: {
            profile: 'modelsim'
          }
        }
      ]
    }
  }, 'stderr', ['vcom -work work /home/chris/coding/vhdl_test/test.vhd', 'Model Technology ModelSim SE-64 vcom 10.1g Compiler 2014.08 Aug  8 2014', '-- Loading package STANDARD', '-- Loading package TEXTIO', '-- Loading package std_logic_1164', '-- Loading package NUMERIC_STD', '-- Loading package test_pkg', '-- Compiling entity test', '-- Compiling architecture beh of test', '-- Loading entity test_sub', '** Error: /home/chris/coding/vhdl_test/test.vhd(106): (vcom-1484) Unknown formal identifier "data_in".', '** Error: /home/chris/coding/vhdl_test/test.vhd(278): VHDL Compiler exiting'], [
    {
      type: 'error',
      message: '(vcom-1484) Unknown formal identifier "data_in".',
      file: '/home/chris/coding/vhdl_test/test.vhd',
      row: '106'
    }, {
      type: 'error',
      message: 'VHDL Compiler exiting',
      file: '/home/chris/coding/vhdl_test/test.vhd',
      row: '278'
    }
  ], [
    [
      {
        file: '/home/chris/coding/vhdl_test/test.vhd',
        start: 16,
        end: 52
      }
    ], [], [], [], [], [], [], [], [], [], [
      {
        file: '/home/chris/coding/vhdl_test/test.vhd',
        row: '106',
        start: 10,
        end: 51
      }
    ], [
      {
        file: '/home/chris/coding/vhdl_test/test.vhd',
        row: '278',
        start: 10,
        end: 51
      }
    ]
  ]);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL3NwZWMvcHJvZmlsZS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxPQUFBOztBQUFBLEVBQUMsVUFBVyxPQUFBLENBQVEsVUFBUixFQUFYLE9BQUQsQ0FBQTs7QUFBQSxFQUVBLE9BQUEsQ0FBUSxXQUFSLEVBQXFCO0FBQUEsSUFDbkIsTUFBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQVU7UUFDUjtBQUFBLFVBQ0UsSUFBQSxFQUFNLFNBRFI7QUFBQSxVQUVFLE1BQUEsRUFDRTtBQUFBLFlBQUEsT0FBQSxFQUFTLFdBQVQ7V0FISjtTQURRO09BQVY7S0FGaUI7R0FBckIsRUFTRyxRQVRILEVBVUEsQ0FDRSw2Q0FERixFQUVFLDJDQUZGLEVBR0UsMkNBSEYsRUFJRSxzQkFKRixFQUtFLDhGQUxGLEVBTUUsMENBTkYsRUFPRSxnQkFQRixFQVFFLGlIQVJGLEVBU0UsNkJBVEYsRUFVRSxTQVZGLENBVkEsRUFzQkE7SUFDRTtBQUFBLE1BQUMsSUFBQSxFQUFNLGdCQUFQO0FBQUEsTUFBZ0MsR0FBQSxFQUFLLElBQXJDO0FBQUEsTUFBNEMsR0FBQSxFQUFLLEdBQWpEO0FBQUEsTUFBNEQsSUFBQSxFQUFNLE9BQWxFO0FBQUEsTUFBNkUsWUFBQSxFQUFjLE1BQTNGO0FBQUEsTUFBbUcsT0FBQSxFQUFTLDBEQUE1RztLQURGLEVBRUU7QUFBQSxNQUFDLElBQUEsRUFBTSxnQkFBUDtBQUFBLE1BQWdDLEdBQUEsRUFBSyxJQUFyQztBQUFBLE1BQTRDLEdBQUEsRUFBSyxNQUFqRDtBQUFBLE1BQTRELElBQUEsRUFBTSxPQUFsRTtBQUFBLE1BQTZFLFlBQUEsRUFBYyxNQUEzRjtBQUFBLE1BQW1HLE9BQUEsRUFBUywwREFBNUc7S0FGRixFQUdFO0FBQUEs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

//# sourceURL=/home/niv/.atom/packages/build-tools/spec/profile-spec.coffee
