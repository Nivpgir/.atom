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
      includeSystemHeadersDocumentation: {
        type: 'boolean',
        "default": false,
        description: "**WARNING**: if there are any PCHs compiled without this option, you will have to delete them and generate them again"
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
      if (atom.config.get("autocomplete-clang.includeDocumentation")) {
        args.push("-Xclang", "-code-completion-brief-comments");
        if (atom.config.get("autocomplete-clang.includeNonDoxygenCommentsAsDocumentation")) {
          args.push("-fparse-all-comments");
        }
        if (atom.config.get("autocomplete-clang.includeSystemHeadersDocumentation")) {
          args.push("-fretain-comments-from-system-headers");
        }
      }
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1jbGFuZy9saWIvYXV0b2NvbXBsZXRlLWNsYW5nLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5S0FBQTs7QUFBQSxFQUFBLE9BQWtFLE9BQUEsQ0FBUSxNQUFSLENBQWxFLEVBQUMsMkJBQUEsbUJBQUQsRUFBcUIsa0JBQUEsVUFBckIsRUFBZ0MsdUJBQUEsZUFBaEMsRUFBZ0QsaUJBQUEsU0FBaEQsRUFBMEQsWUFBQSxJQUExRCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVDLFFBQVMsT0FBQSxDQUFRLGVBQVIsRUFBVCxLQUZELENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUMsYUFBYyxPQUFBLENBQVEsSUFBUixFQUFkLFVBSkQsQ0FBQTs7QUFBQSxFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsYUFBUixDQUxiLENBQUE7O0FBQUEsRUFPQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsK0JBQVIsQ0FQckIsQ0FBQTs7QUFBQSxFQVNBLGFBQUEsR0FBZ0IsSUFUaEIsQ0FBQTs7QUFBQSxFQVVBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSxzQkFBUixDQVZyQixDQUFBOztBQUFBLEVBWUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsT0FEVDtPQURGO0FBQUEsTUFHQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMs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

//# sourceURL=/C:/Users/nivp/.atom/packages/autocomplete-clang/lib/autocomplete-clang.coffee
