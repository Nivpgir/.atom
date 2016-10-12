(function() {
  var GrammarUtils, path, _, _base, _base1, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;

  _ = require('underscore');

  path = require('path');

  GrammarUtils = require('../lib/grammar-utils');

  module.exports = {
    '1C (BSL)': {
      'File Based': {
        command: "oscript",
        args: function(context) {
          return ['-encoding=utf-8', context.filepath];
        }
      }
    },
    Ansible: {
      "File Based": {
        command: "ansible-playbook",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    AppleScript: {
      'Selection Based': {
        command: 'osascript',
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'osascript',
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    AutoHotKey: {
      "File Based": {
        command: "AutoHotKey",
        args: function(context) {
          return [context.filepath];
        }
      },
      "Selection Based": {
        command: "AutoHotKey",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      }
    },
    'Babel ES6 JavaScript': {
      "Selection Based": {
        command: "babel-node",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "babel-node",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Batch: {
      "File Based": {
        command: "cmd.exe",
        args: function(context) {
          return ['/q', '/c', context.filepath];
        }
      }
    },
    'Behat Feature': {
      "File Based": {
        command: "behat",
        args: function(context) {
          return [context.filepath];
        }
      },
      "Line Number Based": {
        command: "behat",
        args: function(context) {
          return [context.fileColonLine()];
        }
      }
    },
    BuckleScript: {
      "Selection Based": {
        command: "bsc",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return ['-c', tmpFile];
        }
      },
      "File Based": {
        command: "bsc",
        args: function(context) {
          return ['-c', context.filepath];
        }
      }
    },
    C: {
      "File Based": {
        command: "bash",
        args: function(context) {
          var args;
          args = [];
          if (GrammarUtils.OperatingSystem.isDarwin()) {
            args = ['-c', "xcrun clang -fcolor-diagnostics -Wall -include stdio.h '" + context.filepath + "' -o /tmp/c.out && /tmp/c.out"];
          } else if (GrammarUtils.OperatingSystem.isLinux()) {
            args = ["-c", "cc -Wall -include stdio.h '" + context.filepath + "' -o /tmp/c.out && /tmp/c.out"];
          }
          return args;
        }
      },
      "Selection Based": {
        command: "bash",
        args: function(context) {
          var args, code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".c");
          args = [];
          if (GrammarUtils.OperatingSystem.isDarwin()) {
            args = ['-c', "xcrun clang -fcolor-diagnostics -Wall -include stdio.h '" + tmpFile + "' -o /tmp/c.out && /tmp/c.out"];
          } else if (GrammarUtils.OperatingSystem.isLinux()) {
            args = ["-c", "cc -Wall -include stdio.h '" + tmpFile + "' -o /tmp/c.out && /tmp/c.out"];
          }
          return args;
        }
      }
    },
    'C#': {
      "File Based": {
        command: GrammarUtils.OperatingSystem.isWindows() ? "cmd" : "bash",
        args: function(context) {
          var args, progname;
          progname = context.filename.replace(/\.cs$/, "");
          args = [];
          if (GrammarUtils.OperatingSystem.isWindows()) {
            args = ["/c csc " + context.filepath + " && " + progname + ".exe"];
          } else {
            args = ['-c', "csc " + context.filepath + " && mono " + progname + ".exe"];
          }
          return args;
        }
      },
      "Selection Based": {
        command: GrammarUtils.OperatingSystem.isWindows() ? "cmd" : "bash",
        args: function(context) {
          var args, code, progname, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".cs");
          progname = tmpFile.replace(/\.cs$/, "");
          args = [];
          if (GrammarUtils.OperatingSystem.isWindows()) {
            args = ["/c csc /out:" + progname + ".exe " + tmpFile + " && " + progname + ".exe"];
          } else {
            args = ['-c', "csc /out:" + progname + ".exe " + tmpFile + " && mono " + progname + ".exe"];
          }
          return args;
        }
      }
    },
    'C# Script File': {
      "File Based": {
        command: "scriptcs",
        args: function(context) {
          return ['-script', context.filepath];
        }
      },
      "Selection Based": {
        command: "scriptcs",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".csx");
          return ['-script', tmpFile];
        }
      }
    },
    'C++': GrammarUtils.OperatingSystem.isDarwin() ? {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "xcrun clang++ -fcolor-diagnostics -Wc++11-extensions -Wall -include stdio.h -include iostream '" + context.filepath + "' -o /tmp/cpp.out && /tmp/cpp.out"];
        }
      }
    } : GrammarUtils.OperatingSystem.isLinux() ? {
      "Selection Based": {
        command: "bash",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".cpp");
          return ["-c", "g++ -Wall -include stdio.h -include iostream '" + tmpFile + "' -o /tmp/cpp.out && /tmp/cpp.out"];
        }
      },
      "File Based": {
        command: "bash",
        args: function(context) {
          return ["-c", "g++ -Wall -include stdio.h -include iostream '" + context.filepath + "' -o /tmp/cpp.out && /tmp/cpp.out"];
        }
      }
    } : GrammarUtils.OperatingSystem.isWindows() && GrammarUtils.OperatingSystem.release().split(".").slice(-1 >= '14399') ? {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ["-c", "g++ -Wall -include stdio.h -include iostream '/mnt/" + path.posix.join.apply(path.posix, [].concat([context.filepath.split(path.win32.sep)[0].toLowerCase()], context.filepath.split(path.win32.sep).slice(1))).replace(":", "") + "' -o /tmp/cpp.out && /tmp/cpp.out"];
        }
      }
    } : void 0,
    Clojure: {
      "Selection Based": {
        command: "lein",
        args: function(context) {
          return ['exec', '-e', context.getCode()];
        }
      },
      "File Based": {
        command: "lein",
        args: function(context) {
          return ['exec', context.filepath];
        }
      }
    },
    CoffeeScript: {
      "Selection Based": {
        command: "coffee",
        args: function(context) {
          return GrammarUtils.CScompiler.args.concat([context.getCode()]);
        }
      },
      "File Based": {
        command: "coffee",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "CoffeeScript (Literate)": {
      'Selection Based': {
        command: 'coffee',
        args: function(context) {
          return GrammarUtils.CScompiler.args.concat([context.getCode()]);
        }
      },
      'File Based': {
        command: 'coffee',
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Crystal: {
      "Selection Based": {
        command: "crystal",
        args: function(context) {
          return ['eval', context.getCode()];
        }
      },
      "File Based": {
        command: "crystal",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    D: {
      "Selection Based": {
        command: "rdmd",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.D.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      "File Based": {
        command: "rdmd",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Dart: {
      "Selection Based": {
        command: "dart",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".dart");
          return [tmpFile];
        }
      },
      "File Based": {
        command: "dart",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "Graphviz (DOT)": {
      "Selection Based": {
        command: "dot",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".dot");
          return ['-Tpng', tmpFile, '-o', tmpFile + '.png'];
        }
      },
      "File Based": {
        command: "dot",
        args: function(context) {
          return ['-Tpng', context.filepath, '-o', context.filepath + '.png'];
        }
      }
    },
    DOT: {
      "Selection Based": {
        command: "dot",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".dot");
          return ['-Tpng', tmpFile, '-o', tmpFile + '.png'];
        }
      },
      "File Based": {
        command: "dot",
        args: function(context) {
          return ['-Tpng', context.filepath, '-o', context.filepath + '.png'];
        }
      }
    },
    Elixir: {
      "Selection Based": {
        command: "elixir",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "elixir",
        args: function(context) {
          return ['-r', context.filepath];
        }
      }
    },
    Erlang: {
      "Selection Based": {
        command: "erl",
        args: function(context) {
          return ['-noshell', '-eval', "" + (context.getCode()) + ", init:stop()."];
        }
      }
    },
    'F#': {
      "File Based": {
        command: GrammarUtils.OperatingSystem.isWindows() ? "fsi" : "fsharpi",
        args: function(context) {
          return ['--exec', context.filepath];
        }
      }
    },
    'F*': {
      "File Based": {
        command: "fstar",
        args: function(context) {
          return ['--fsi', context.filepath];
        }
      }
    },
    Forth: {
      "File Based": {
        command: "gforth",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "Fortran - Fixed Form": {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "gfortran '" + context.filepath + "' -ffixed-form -o /tmp/f.out && /tmp/f.out"];
        }
      }
    },
    "Fortran - Free Form": {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "gfortran '" + context.filepath + "' -ffree-form -o /tmp/f90.out && /tmp/f90.out"];
        }
      }
    },
    "Fortran - Modern": {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "gfortran '" + context.filepath + "' -ffree-form -o /tmp/f90.out && /tmp/f90.out"];
        }
      }
    },
    "Fortran - Punchcard": {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "gfortran '" + context.filepath + "' -ffixed-form -o /tmp/f.out && /tmp/f.out"];
        }
      }
    },
    Gherkin: {
      "File Based": {
        command: "cucumber",
        args: function(context) {
          return ['--color', context.filepath];
        }
      },
      "Line Number Based": {
        command: "cucumber",
        args: function(context) {
          return ['--color', context.fileColonLine()];
        }
      }
    },
    gnuplot: {
      "File Based": {
        command: "gnuplot",
        args: function(context) {
          return ['-p', context.filepath];
        },
        workingDirectory: (_ref = atom.workspace.getActivePaneItem()) != null ? (_ref1 = _ref.buffer) != null ? (_ref2 = _ref1.file) != null ? typeof _ref2.getParent === "function" ? typeof (_base = _ref2.getParent()).getPath === "function" ? _base.getPath() : void 0 : void 0 : void 0 : void 0 : void 0
      }
    },
    Go: {
      "File Based": {
        command: "go",
        args: function(context) {
          if (context.filepath.match(/_test.go/)) {
            return ['test', ''];
          } else {
            return ['run', context.filepath];
          }
        },
        workingDirectory: (_ref3 = atom.workspace.getActivePaneItem()) != null ? (_ref4 = _ref3.buffer) != null ? (_ref5 = _ref4.file) != null ? typeof _ref5.getParent === "function" ? typeof (_base1 = _ref5.getParent()).getPath === "function" ? _base1.getPath() : void 0 : void 0 : void 0 : void 0 : void 0
      }
    },
    Groovy: {
      "Selection Based": {
        command: "groovy",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "groovy",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Haskell: {
      "File Based": {
        command: "runhaskell",
        args: function(context) {
          return [context.filepath];
        }
      },
      "Selection Based": {
        command: "ghc",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      }
    },
    Hy: {
      "File Based": {
        command: "hy",
        args: function(context) {
          return [context.filepath];
        }
      },
      "Selection Based": {
        command: "hy",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".hy");
          return [tmpFile];
        }
      }
    },
    IcedCoffeeScript: {
      "Selection Based": {
        command: "iced",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "iced",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    InnoSetup: {
      "File Based": {
        command: "ISCC.exe",
        args: function(context) {
          return ['/Q', context.filepath];
        }
      }
    },
    ioLanguage: {
      "Selection Based": {
        command: "io",
        args: function(context) {
          return [context.getCode()];
        }
      },
      "File Based": {
        command: "io",
        args: function(context) {
          return ['-e', context.filepath];
        }
      }
    },
    Java: {
      "File Based": {
        command: GrammarUtils.OperatingSystem.isWindows() ? "cmd" : "bash",
        args: function(context) {
          var args, className;
          className = context.filename.replace(/\.java$/, "");
          args = [];
          if (GrammarUtils.OperatingSystem.isWindows()) {
            args = ["/c javac -Xlint " + context.filename + " && java " + className];
          } else {
            args = ['-c', "javac -d /tmp '" + context.filepath + "' && java -cp /tmp " + className];
          }
          return args;
        }
      }
    },
    JavaScript: {
      "Selection Based": {
        command: "node",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "node",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "JavaScript for Automation (JXA)": {
      "Selection Based": {
        command: "osascript",
        args: function(context) {
          return ['-l', 'JavaScript', '-e', context.getCode()];
        }
      },
      "File Based": {
        command: "osascript",
        args: function(context) {
          return ['-l', 'JavaScript', context.filepath];
        }
      }
    },
    Jolie: {
      "File Based": {
        command: "jolie",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Julia: {
      "Selection Based": {
        command: "julia",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "julia",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Kotlin: {
      "Selection Based": {
        command: "bash",
        args: function(context) {
          var args, code, jarName, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".kt");
          jarName = tmpFile.replace(/\.kt$/, ".jar");
          args = ['-c', "kotlinc " + tmpFile + " -include-runtime -d " + jarName + " && java -jar " + jarName];
          return args;
        }
      },
      "File Based": {
        command: "bash",
        args: function(context) {
          var args, jarName;
          jarName = context.filename.replace(/\.kt$/, ".jar");
          args = ['-c', "kotlinc " + context.filepath + " -include-runtime -d /tmp/" + jarName + " && java -jar /tmp/" + jarName];
          return args;
        }
      }
    },
    LaTeX: {
      "File Based": {
        command: "latexmk",
        args: function(context) {
          return ['-cd', '-quiet', '-pdf', '-pv', '-shell-escape', context.filepath];
        }
      }
    },
    'LaTeX Beamer': {
      "File Based": {
        command: "latexmk",
        args: function(context) {
          return ['-cd', '-quiet', '-pdf', '-pv', '-shell-escape', context.filepath];
        }
      }
    },
    LilyPond: {
      "File Based": {
        command: "lilypond",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Lisp: {
      "Selection Based": {
        command: "sbcl",
        args: function(context) {
          var args, statements;
          statements = _.flatten(_.map(GrammarUtils.Lisp.splitStatements(context.getCode()), function(statement) {
            return ['--eval', statement];
          }));
          args = _.union(['--noinform', '--disable-debugger', '--non-interactive', '--quit'], statements);
          return args;
        }
      },
      "File Based": {
        command: "sbcl",
        args: function(context) {
          return ['--noinform', '--script', context.filepath];
        }
      }
    },
    'Literate Haskell': {
      "File Based": {
        command: "runhaskell",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    LiveScript: {
      "Selection Based": {
        command: "lsc",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "lsc",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Lua: {
      "Selection Based": {
        command: "lua",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      "File Based": {
        command: "lua",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    'Lua (WoW)': {
      "Selection Based": {
        command: "lua",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      "File Based": {
        command: "lua",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Makefile: {
      "Selection Based": {
        command: "bash",
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: "make",
        args: function(context) {
          return ['-f', context.filepath];
        }
      }
    },
    MagicPython: {
      "Selection Based": {
        command: "python",
        args: function(context) {
          return ['-u', '-c', context.getCode()];
        }
      },
      "File Based": {
        command: "python",
        args: function(context) {
          return ['-u', context.filepath];
        }
      }
    },
    MATLAB: {
      "Selection Based": {
        command: "matlab",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.MATLAB.createTempFileWithCode(code);
          return ['-nodesktop', '-nosplash', '-r', "try, run('" + tmpFile + "');while ~isempty(get(0,'Children')); pause(0.5); end; catch ME; disp(ME.message); exit(1); end; exit(0);"];
        }
      },
      "File Based": {
        command: "matlab",
        args: function(context) {
          return ['-nodesktop', '-nosplash', '-r', "try run('" + context.filepath + "');while ~isempty(get(0,'Children')); pause(0.5); end; catch ME; disp(ME.message); exit(1); end; exit(0);"];
        }
      }
    },
    'MIPS Assembler': {
      "File Based": {
        command: "spim",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    MoonScript: {
      "Selection Based": {
        command: "moon",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "moon",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    'mongoDB (JavaScript)': {
      "Selection Based": {
        command: "mongo",
        args: function(context) {
          return ['--eval', context.getCode()];
        }
      },
      "File Based": {
        command: "mongo",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    NCL: {
      "Selection Based": {
        command: "ncl",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          code = code + "\nexit";
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      "File Based": {
        command: "ncl",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    newLISP: {
      "Selection Based": {
        command: "newlisp",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "newlisp",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Nim: {
      "File Based": {
        command: "bash",
        args: function(context) {
          var file;
          file = GrammarUtils.Nim.findNimProjectFile(context.filepath);
          path = GrammarUtils.Nim.projectDir(context.filepath);
          return ['-c', 'cd "' + path + '" && nim c --hints:off --parallelBuild:1 -r "' + file + '" 2>&1'];
        }
      }
    },
    NSIS: {
      "Selection Based": {
        command: "makensis",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      "File Based": {
        command: "makensis",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    'Objective-C': GrammarUtils.OperatingSystem.isDarwin() ? {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "xcrun clang -fcolor-diagnostics -Wall -include stdio.h -framework Cocoa " + context.filepath + " -o /tmp/objc-c.out && /tmp/objc-c.out"];
        }
      }
    } : void 0,
    'Objective-C++': GrammarUtils.OperatingSystem.isDarwin() ? {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "xcrun clang++ -fcolor-diagnostics -Wc++11-extensions -Wall -include stdio.h -include iostream -framework Cocoa " + context.filepath + " -o /tmp/objc-cpp.out && /tmp/objc-cpp.out"];
        }
      }
    } : void 0,
    OCaml: {
      "File Based": {
        command: "ocaml",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Octave: {
      "Selection Based": {
        command: "octave",
        args: function(context) {
          return ['-p', context.filepath.replace(/[^\/]*$/, ''), '--eval', context.getCode()];
        }
      },
      "File Based": {
        command: "octave",
        args: function(context) {
          return ['-p', context.filepath.replace(/[^\/]*$/, ''), context.filepath];
        }
      }
    },
    Oz: {
      "Selection Based": {
        command: "ozc",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return ['-c', tmpFile];
        }
      },
      "File Based": {
        command: "ozc",
        args: function(context) {
          return ['-c', context.filepath];
        }
      }
    },
    'Pandoc Markdown': {
      "File Based": {
        command: "panzer",
        args: function(context) {
          return [context.filepath, "--output=" + context.filepath + ".pdf"];
        }
      }
    },
    Perl: {
      "Selection Based": {
        command: "perl",
        args: function(context) {
          var code, file;
          code = context.getCode();
          file = GrammarUtils.Perl.createTempFileWithCode(code);
          return [file];
        }
      },
      "File Based": {
        command: "perl",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "Perl 6": {
      "Selection Based": {
        command: "perl6",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "perl6",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "Perl 6 FE": {
      "Selection Based": {
        command: "perl6",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "perl6",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    PHP: {
      "Selection Based": {
        command: "php",
        args: function(context) {
          var code, file;
          code = context.getCode();
          file = GrammarUtils.PHP.createTempFileWithCode(code);
          return [file];
        }
      },
      "File Based": {
        command: "php",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    PowerShell: {
      "Selection Based": {
        command: "powershell",
        args: function(context) {
          return [context.getCode()];
        }
      },
      "File Based": {
        command: "powershell",
        args: function(context) {
          return [context.filepath.replace(/\ /g, "` ")];
        }
      }
    },
    Processing: {
      "File Based": {
        command: GrammarUtils.OperatingSystem.isWindows() ? "cmd" : "bash",
        args: function(context) {
          if (GrammarUtils.OperatingSystem.isWindows()) {
            return ['/c processing-java --sketch=' + context.filepath.replace("\\" + context.filename, "") + ' --run'];
          } else {
            return ['-c', 'processing-java --sketch=' + context.filepath.replace("/" + context.filename, "") + ' --run'];
          }
        }
      }
    },
    Prolog: {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', 'cd \"' + context.filepath.replace(/[^\/]*$/, '') + '\"; swipl -f \"' + context.filepath + '\" -t main --quiet'];
        }
      }
    },
    Python: {
      "Selection Based": {
        command: "python",
        args: function(context) {
          return ['-u', '-c', context.getCode()];
        }
      },
      "File Based": {
        command: "python",
        args: function(context) {
          return ['-u', context.filepath];
        }
      }
    },
    R: {
      "Selection Based": {
        command: "Rscript",
        args: function(context) {
          var code, file;
          code = context.getCode();
          file = GrammarUtils.R.createTempFileWithCode(code);
          return [file];
        }
      },
      "File Based": {
        command: "Rscript",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Racket: {
      "Selection Based": {
        command: "racket",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "racket",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    RANT: {
      "Selection Based": {
        command: "RantConsole.exe",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return ['-file', tmpFile];
        }
      },
      "File Based": {
        command: "RantConsole.exe",
        args: function(context) {
          return ['-file', context.filepath];
        }
      }
    },
    Reason: {
      "File Based": {
        command: GrammarUtils.OperatingSystem.isWindows() ? "cmd" : "bash",
        args: function(context) {
          var args, progname;
          progname = context.filename.replace(/\.re$/, "");
          args = [];
          if (GrammarUtils.OperatingSystem.isWindows()) {
            args = ["/c rebuild " + progname + ".native && " + progname + ".native"];
          } else {
            args = ['-c', "rebuild '" + progname + ".native' && '" + progname + ".native'"];
          }
          return args;
        }
      }
    },
    RSpec: {
      "Selection Based": {
        command: "ruby",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "rspec",
        args: function(context) {
          return ['--tty', '--color', context.filepath];
        }
      },
      "Line Number Based": {
        command: "rspec",
        args: function(context) {
          return ['--tty', '--color', context.fileColonLine()];
        }
      }
    },
    Ruby: {
      "Selection Based": {
        command: "ruby",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "ruby",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    'Ruby on Rails': {
      "Selection Based": {
        command: "rails",
        args: function(context) {
          return ['runner', context.getCode()];
        }
      },
      "File Based": {
        command: "rails",
        args: function(context) {
          return ['runner', context.filepath];
        }
      }
    },
    Rust: {
      "File Based": {
        command: GrammarUtils.OperatingSystem.isWindows() ? "cmd" : "bash",
        args: function(context) {
          var args, progname;
          progname = context.filename.replace(/\.rs$/, "");
          args = [];
          if (GrammarUtils.OperatingSystem.isWindows()) {
            args = ["/c rustc " + context.filepath + " && " + progname + ".exe"];
          } else {
            args = ['-c', "rustc '" + context.filepath + "' -o /tmp/rs.out && /tmp/rs.out"];
          }
          return args;
        }
      }
    },
    Sage: {
      "Selection Based": {
        command: "sage",
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: "sage",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Sass: {
      "File Based": {
        command: "sass",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Scala: {
      "Selection Based": {
        command: "scala",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "scala",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Scheme: {
      "Selection Based": {
        command: "guile",
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: "guile",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    SCSS: {
      "File Based": {
        command: "sass",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "Shell Script": {
      "Selection Based": {
        command: process.env.SHELL,
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: process.env.SHELL,
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "Shell Script (Fish)": {
      "Selection Based": {
        command: "fish",
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: "fish",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "SQL (PostgreSQL)": {
      "Selection Based": {
        command: "psql",
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: "psql",
        args: function(context) {
          return ['-f', context.filepath];
        }
      }
    },
    "Standard ML": {
      "File Based": {
        command: "sml",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Stata: {
      "Selection Based": {
        command: "stata",
        args: function(context) {
          return ['do', context.getCode()];
        }
      },
      "File Based": {
        command: "stata",
        args: function(context) {
          return ['do', context.filepath];
        }
      }
    },
    Swift: {
      "File Based": {
        command: "swift",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Tcl: {
      "Selection Based": {
        command: "tclsh",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      "File Based": {
        command: "tclsh",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    TypeScript: {
      "Selection Based": {
        command: "bash",
        args: function(context) {
          var args, code, jsFile, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".ts");
          jsFile = tmpFile.replace(/\.ts$/, ".js");
          args = ['-c', "tsc --outFile '" + jsFile + "' '" + tmpFile + "' && node '" + jsFile + "'"];
          return args;
        }
      },
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "tsc '" + context.filepath + "' --outFile /tmp/js.out && node /tmp/js.out"];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFycy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFHQTtBQUFBLE1BQUEsNkVBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFlBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLFlBQUEsR0FBZSxPQUFBLENBQVEsc0JBQVIsQ0FGZixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsVUFBQSxFQUNFO0FBQUEsTUFBQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLE9BQUEsRUFBUyxTQUFUO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFELEdBQUE7aUJBQWEsQ0FBQyxpQkFBRCxFQUFvQixPQUFPLENBQUMsUUFBNUIsRUFBYjtRQUFBLENBRE47T0FERjtLQURGO0FBQUEsSUFLQSxPQUFBLEVBQ0U7QUFBQSxNQUFBLFlBQUEsRUFDRTtBQUFBLFFBQUEsT0FBQSxFQUFTLGtCQUFUO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFELEdBQUE7aUJBQWEsQ0FBQyxPQUFPLENBQUMsUUFBVCxFQUFiO1FBQUEsQ0FETjtPQURGO0tBTkY7QUFBQSxJQVVBLFdBQUEsRUFDRTtBQUFBLE1BQUEsaUJBQUEsRUFDRTtBQUFBLFFBQUEsT0FBQSxFQUFTLFdBQVQ7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQsR0FBQTtpQkFBYyxDQUFDLElBQUQsRUFBTyxPQUFPLENBQUMsT0FBUixDQUFBLENBQVAsRUFBZDtRQUFBLENBRE47T0FERjtBQUFBLE1BR0EsWUFBQSxFQUNFO0FBQUEsUUFBQSxPQUFBLEVBQVMsV0FBVDtBQUFBLFFBQ0Es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

//# sourceURL=/C:/Users/MNP/.atom/packages/script/lib/grammars.coffee
