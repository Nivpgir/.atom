(function() {
  var BufferedProcess, ClangFlags, ClangProvider, CompositeDisposable, Disposable, File, LocationSelectList, Selection, defaultPrecompiled, existsSync, path, spawn, util, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable, BufferedProcess = _ref.BufferedProcess, Selection = _ref.Selection, File = _ref.File;

  util = require('./util');

  spawn = require('child_process').spawn;

  path = require('path');

  existsSync = require('fs').existsSync;

  ClangFlags = require('clang-flags');

  LocationSelectList = require('./location-select-view.coffee');

  ClangProvider = null;

  defaultPrecompiled = require('./defaultPrecompiled');

  module.exports = {
    config: {
      clangCommand: {
        type: 'string',
        "default": 'clang'
      },
      includePaths: {
        type: 'array',
        "default": ['.'],
        items: {
          type: 'string'
        }
      },
      pchFilePrefix: {
        type: 'string',
        "default": '.stdafx'
      },
      ignoreClangErrors: {
        type: 'boolean',
        "default": true
      },
      includeDocumentation: {
        type: 'boolean',
        "default": true
      },
      includeNonDoxygenCommentsAsDocumentation: {
        type: 'boolean',
        "default": false
      },
      "std c++": {
        type: 'string',
        "default": "c++11"
      },
      "std c": {
        type: 'string',
        "default": "c99"
      },
      "preCompiledHeaders c++": {
        type: 'array',
        "default": defaultPrecompiled.cpp,
        item: {
          type: 'string'
        }
      },
      "preCompiledHeaders c": {
        type: 'array',
        "default": defaultPrecompiled.c,
        items: {
          type: 'string'
        }
      },
      "preCompiledHeaders objective-c": {
        type: 'array',
        "default": defaultPrecompiled.objc,
        items: {
          type: 'string'
        }
      },
      "preCompiledHeaders objective-c++": {
        type: 'array',
        "default": defaultPrecompiled.objcpp,
        items: {
          type: 'string'
        }
      }
    },
    deactivationDisposables: null,
    activate: function(state) {
      this.deactivationDisposables = new CompositeDisposable;
      this.deactivationDisposables.add(atom.commands.add('atom-text-editor:not([mini])', {
        'autocomplete-clang:emit-pch': (function(_this) {
          return function() {
            return _this.emitPch(atom.workspace.getActiveTextEditor());
          };
        })(this)
      }));
      return this.deactivationDisposables.add(atom.commands.add('atom-text-editor:not([mini])', {
        'autocomplete-clang:go-declaration': (function(_this) {
          return function(e) {
            return _this.goDeclaration(atom.workspace.getActiveTextEditor(), e);
          };
        })(this)
      }));
    },
    goDeclaration: function(editor, e) {
      var args, command, lang, options, term;
      lang = util.getFirstCursorSourceScopeLang(editor);
      if (!lang) {
        e.abortKeyBinding();
        return;
      }
      command = atom.config.get("autocomplete-clang.clangCommand");
      editor.selectWordsContainingCursors();
      term = editor.getSelectedText();
      args = this.buildGoDeclarationCommandArgs(editor, lang, term);
      options = {
        cwd: path.dirname(editor.getPath()),
        input: editor.getText()
      };
      return new Promise((function(_this) {
        return function(resolve) {
          var allOutput, bufferedProcess, exit, stderr, stdout;
          allOutput = [];
          stdout = function(output) {
            return allOutput.push(output);
          };
          stderr = function(output) {
            return console.log(output);
          };
          exit = function(code) {
            return resolve(_this.handleGoDeclarationResult(editor, {
              output: allOutput.join("\n"),
              term: term
            }, code));
          };
          bufferedProcess = new BufferedProcess({
            command: command,
            args: args,
            options: options,
            stdout: stdout,
            stderr: stderr,
            exit: exit
          });
          bufferedProcess.process.stdin.setEncoding = 'utf-8';
          bufferedProcess.process.stdin.write(editor.getText());
          return bufferedProcess.process.stdin.end();
        };
      })(this));
    },
    emitPch: function(editor) {
      var args, clang_command, emit_process, h, headers, headersInput, lang;
      lang = util.getFirstCursorSourceScopeLang(editor);
      if (!lang) {
        alert("autocomplete-clang:emit-pch\nError: Incompatible Language");
        return;
      }
      clang_command = atom.config.get("autocomplete-clang.clangCommand");
      args = this.buildEmitPchCommandArgs(editor, lang);
      emit_process = spawn(clang_command, args);
      emit_process.on("exit", (function(_this) {
        return function(code) {
          return _this.handleEmitPchResult(code);
        };
      })(this));
      emit_process.stdout.on('data', function(data) {
        return console.log("out:\n" + data.toString());
      });
      emit_process.stderr.on('data', function(data) {
        return console.log("err:\n" + data.toString());
      });
      headers = atom.config.get("autocomplete-clang.preCompiledHeaders " + lang);
      headersInput = ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = headers.length; _i < _len; _i++) {
          h = headers[_i];
          _results.push("#include <" + h + ">");
        }
        return _results;
      })()).join("\n");
      emit_process.stdin.write(headersInput);
      return emit_process.stdin.end();
    },
    buildGoDeclarationCommandArgs: function(editor, language, term) {
      var args, clangflags, currentDir, error, i, pchFile, pchFilePrefix, pchPath, std, _i, _len, _ref1;
      std = atom.config.get("autocomplete-clang.std " + language);
      currentDir = path.dirname(editor.getPath());
      pchFilePrefix = atom.config.get("autocomplete-clang.pchFilePrefix");
      pchFile = [pchFilePrefix, language, "pch"].join('.');
      pchPath = path.join(currentDir, pchFile);
      args = ["-fsyntax-only"];
      args.push("-x" + language);
      if (std) {
        args.push("-std=" + std);
      }
      args.push("-Xclang", "-ast-dump");
      args.push("-Xclang", "-ast-dump-filter");
      args.push("-Xclang", "" + term);
      if (existsSync(pchPath)) {
        args.push("-include-pch", pchPath);
      }
      _ref1 = atom.config.get("autocomplete-clang.includePaths");
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        i = _ref1[_i];
        args.push("-I" + i);
      }
      args.push("-I" + currentDir);
      try {
        clangflags = ClangFlags.getClangFlags(editor.getPath());
        if (clangflags) {
          args = args.concat(clangflags);
        }
      } catch (_error) {
        error = _error;
        console.log(error);
      }
      args.push("-");
      return args;
    },
    buildEmitPchCommandArgs: function(editor, lang) {
      var args, dir, file, i, include_paths, pch, pch_file_prefix, std;
      dir = path.dirname(editor.getPath());
      pch_file_prefix = atom.config.get("autocomplete-clang.pchFilePrefix");
      file = [pch_file_prefix, lang, "pch"].join('.');
      pch = path.join(dir, file);
      std = atom.config.get("autocomplete-clang.std " + lang);
      args = ["-x" + lang + "-header", "-Xclang", '-emit-pch', '-o', pch];
      if (std) {
        args = args.concat(["-std=" + std]);
      }
      include_paths = atom.config.get("autocomplete-clang.includePaths");
      args = args.concat((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = include_paths.length; _i < _len; _i++) {
          i = include_paths[_i];
          _results.push("-I" + i);
        }
        return _results;
      })());
      args = args.concat(["-"]);
      return args;
    },
    handleGoDeclarationResult: function(editor, result, returnCode) {
      var list, places;
      if (returnCode === !0) {
        if (!atom.config.get("autocomplete-clang.ignoreClangErrors")) {
          return;
        }
      }
      places = this.parseAstDump(result['output'], result['term']);
      if (places.length === 1) {
        return this.goToLocation(editor, places.pop());
      } else if (places.length > 1) {
        list = new LocationSelectList(editor, this.goToLocation);
        return list.setItems(places);
      }
    },
    goToLocation: function(editor, _arg) {
      var col, f, file, line;
      file = _arg[0], line = _arg[1], col = _arg[2];
      if (file === '<stdin>') {
        return editor.setCursorBufferPosition([line - 1, col - 1]);
      }
      if (file.startsWith(".")) {
        file = path.join(editor.getDirectoryPath(), file);
      }
      f = new File(file);
      return f.exists().then(function(result) {
        if (result) {
          return atom.workspace.open(file, {
            initialLine: line - 1,
            initialColumn: col - 1
          });
        }
      });
    },
    parseAstDump: function(aststring, term) {
      var candidate, candidates, col, declRangeStr, declTerms, file, line, lines, match, places, posStr, positions, _, _i, _len, _ref1, _ref2;
      candidates = aststring.split('\n\n');
      places = [];
      for (_i = 0, _len = candidates.length; _i < _len; _i++) {
        candidate = candidates[_i];
        match = candidate.match(RegExp("^Dumping\\s(?:[A-Za-z_]*::)*?" + term + ":"));
        if (match !== null) {
          lines = candidate.split('\n');
          if (lines.length < 2) {
            continue;
          }
          declTerms = lines[1].split(' ');
          _ = declTerms[0], _ = declTerms[1], declRangeStr = declTerms[2], _ = declTerms[3], posStr = declTerms[4];
          if (declRangeStr === "prev") {
            _ = declTerms[0], _ = declTerms[1], _ = declTerms[2], _ = declTerms[3], declRangeStr = declTerms[4], _ = declTerms[5], posStr = declTerms[6];
          }
          _ref1 = declRangeStr.slice(1, -1).split(':'), file = _ref1[0], line = _ref1[1], col = _ref1[2];
          positions = posStr.match(/(line|col):([0-9]+)(?::([0-9]+))?/);
          if (positions) {
            if (positions[1] === 'line') {
              _ref2 = [positions[2], positions[3]], line = _ref2[0], col = _ref2[1];
            } else {
              col = positions[2];
            }
          }
          places.push([file, Number(line), Number(col)]);
        }
      }
      return places;
    },
    handleEmitPchResult: function(code) {
      if (!code) {
        alert("Emiting precompiled header has successfully finished");
        return;
      }
      return alert(("Emiting precompiled header exit with " + code + "\n") + "See console for detailed error message");
    },
    deactivate: function() {
      this.deactivationDisposables.dispose();
      return console.log("autocomplete-clang deactivated");
    },
    provide: function() {
      if (ClangProvider == null) {
        ClangProvider = require('./clang-provider');
      }
      return new ClangProvider();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1jbGFuZy9saWIvYXV0b2NvbXBsZXRlLWNsYW5nLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5S0FBQTs7QUFBQSxFQUFBLE9BQWtFLE9BQUEsQ0FBUSxNQUFSLENBQWxFLEVBQUMsMkJBQUEsbUJBQUQsRUFBcUIsa0JBQUEsVUFBckIsRUFBZ0MsdUJBQUEsZUFBaEMsRUFBZ0QsaUJBQUEsU0FBaEQsRUFBMEQsWUFBQSxJQUExRCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVDLFFBQVMsT0FBQSxDQUFRLGVBQVIsRUFBVCxLQUZELENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUMsYUFBYyxPQUFBLENBQVEsSUFBUixFQUFkLFVBSkQsQ0FBQTs7QUFBQSxFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsYUFBUixDQUxiLENBQUE7O0FBQUEsRUFPQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsK0JBQVIsQ0FQckIsQ0FBQTs7QUFBQSxFQVNBLGFBQUEsR0FBZ0IsSUFUaEIsQ0FBQTs7QUFBQSxFQVVBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSxzQkFBUixDQVZyQixDQUFBOztBQUFBLEVBWUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsT0FEVDtPQURGO0FBQUEsTUFHQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsQ0FBQyxHQUFELENB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

//# sourceURL=/home/niv/.atom/packages/autocomplete-clang/lib/autocomplete-clang.coffee
