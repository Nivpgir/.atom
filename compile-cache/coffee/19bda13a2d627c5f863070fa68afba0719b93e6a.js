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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWNsYW5nL2xpYi9hdXRvY29tcGxldGUtY2xhbmcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlLQUFBOztBQUFBLEVBQUEsT0FBa0UsT0FBQSxDQUFRLE1BQVIsQ0FBbEUsRUFBQywyQkFBQSxtQkFBRCxFQUFxQixrQkFBQSxVQUFyQixFQUFnQyx1QkFBQSxlQUFoQyxFQUFnRCxpQkFBQSxTQUFoRCxFQUEwRCxZQUFBLElBQTFELENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUMsUUFBUyxPQUFBLENBQVEsZUFBUixFQUFULEtBRkQsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUhQLENBQUE7O0FBQUEsRUFJQyxhQUFjLE9BQUEsQ0FBUSxJQUFSLEVBQWQsVUFKRCxDQUFBOztBQUFBLEVBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxhQUFSLENBTGIsQ0FBQTs7QUFBQSxFQU9BLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSwrQkFBUixDQVByQixDQUFBOztBQUFBLEVBU0EsYUFBQSxHQUFnQixJQVRoQixDQUFBOztBQUFBLEVBVUEsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHNCQUFSLENBVnJCLENBQUE7O0FBQUEsRUFZQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFlBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxPQURUO09BREY7QUFBQSxNQUdBLFlBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxD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

//# sourceURL=/C:/Users/MNP/.atom/packages/autocomplete-clang/lib/autocomplete-clang.coffee
