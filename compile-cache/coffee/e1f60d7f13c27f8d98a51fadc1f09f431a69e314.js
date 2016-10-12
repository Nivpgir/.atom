(function() {
  var BufferedProcess, ClangFlags, ClangProvider, CompositeDisposable, LanguageUtil, Point, Range, existsSync, path, _ref;

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range, BufferedProcess = _ref.BufferedProcess, CompositeDisposable = _ref.CompositeDisposable;

  path = require('path');

  existsSync = require('fs').existsSync;

  ClangFlags = require('clang-flags');

  module.exports = ClangProvider = (function() {
    function ClangProvider() {}

    ClangProvider.prototype.selector = '.source.cpp, .source.c, .source.objc, .source.objcpp';

    ClangProvider.prototype.inclusionPriority = 1;

    ClangProvider.prototype.scopeSource = {
      'source.cpp': 'c++',
      'source.c': 'c',
      'source.objc': 'objective-c',
      'source.objcpp': 'objective-c++'
    };

    ClangProvider.prototype.getSuggestions = function(_arg) {
      var bufferPosition, editor, language, lastSymbol, line, minimumWordLength, prefix, regex, scopeDescriptor, symbolPosition, _ref1;
      editor = _arg.editor, scopeDescriptor = _arg.scopeDescriptor, bufferPosition = _arg.bufferPosition;
      language = LanguageUtil.getSourceScopeLang(this.scopeSource, scopeDescriptor.getScopesArray());
      prefix = LanguageUtil.prefixAtPosition(editor, bufferPosition);
      _ref1 = LanguageUtil.nearestSymbolPosition(editor, bufferPosition), symbolPosition = _ref1[0], lastSymbol = _ref1[1];
      minimumWordLength = atom.config.get('autocomplete-plus.minimumWordLength');
      if ((minimumWordLength != null) && prefix.length < minimumWordLength) {
        regex = /(?:\.|->|::)\s*\w*$/;
        line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
        if (!regex.test(line)) {
          return;
        }
      }
      if (language != null) {
        return this.codeCompletionAt(editor, symbolPosition.row, symbolPosition.column, language, prefix);
      }
    };

    ClangProvider.prototype.codeCompletionAt = function(editor, row, column, language, prefix) {
      var args, command, options;
      command = atom.config.get("autocomplete-clang.clangCommand");
      args = this.buildClangArgs(editor, row, column, language);
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
            return resolve(_this.handleCompletionResult(allOutput.join('\n'), code, prefix));
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
    };

    ClangProvider.prototype.convertCompletionLine = function(line, prefix) {
      var argumentsRe, basicInfo, basicInfoRe, comment, commentRe, completion, completionAndComment, constMemFuncRe, content, contentRe, index, infoTagsRe, isConstMemFunc, match, optionalArgumentsStart, returnType, returnTypeRe, suggestion, _ref1, _ref2, _ref3;
      contentRe = /^COMPLETION: (.*)/;
      _ref1 = line.match(contentRe), line = _ref1[0], content = _ref1[1];
      basicInfoRe = /^(.*?) : (.*)/;
      match = content.match(basicInfoRe);
      if (match == null) {
        return {
          text: content
        };
      }
      content = match[0], basicInfo = match[1], completionAndComment = match[2];
      commentRe = /(?: : (.*))?$/;
      _ref2 = completionAndComment.split(commentRe), completion = _ref2[0], comment = _ref2[1];
      returnTypeRe = /^\[#(.*?)#\]/;
      returnType = (_ref3 = completion.match(returnTypeRe)) != null ? _ref3[1] : void 0;
      constMemFuncRe = /\[# const#\]$/;
      isConstMemFunc = constMemFuncRe.test(completion);
      infoTagsRe = /\[#(.*?)#\]/g;
      completion = completion.replace(infoTagsRe, '');
      argumentsRe = /<#(.*?)#>/g;
      optionalArgumentsStart = completion.indexOf('{#');
      completion = completion.replace(/\{#/g, '');
      completion = completion.replace(/#\}/g, '');
      index = 0;
      completion = completion.replace(argumentsRe, function(match, arg, offset) {
        index++;
        if (optionalArgumentsStart > 0 && offset > optionalArgumentsStart) {
          return "${" + index + ":optional " + arg + "}";
        } else {
          return "${" + index + ":" + arg + "}";
        }
      });
      suggestion = {};
      if (returnType != null) {
        suggestion.leftLabel = returnType;
      }
      if (index > 0) {
        suggestion.snippet = completion;
      } else {
        suggestion.text = completion;
      }
      if (isConstMemFunc) {
        suggestion.displayText = completion + ' const';
      }
      if (comment != null) {
        suggestion.description = comment;
      }
      suggestion.replacementPrefix = prefix;
      return suggestion;
    };

    ClangProvider.prototype.handleCompletionResult = function(result, returnCode, prefix) {
      var completionsRe, line, outputLines;
      if (returnCode === !0) {
        if (!atom.config.get("autocomplete-clang.ignoreClangErrors")) {
          return;
        }
      }
      completionsRe = new RegExp("^COMPLETION: (" + prefix + ".*)$", "mg");
      outputLines = result.match(completionsRe);
      if (outputLines != null) {
        return (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = outputLines.length; _i < _len; _i++) {
            line = outputLines[_i];
            _results.push(this.convertCompletionLine(line, prefix));
          }
          return _results;
        }).call(this);
      } else {
        return [];
      }
    };

    ClangProvider.prototype.buildClangArgs = function(editor, row, column, language) {
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
      args.push("-Xclang", "-code-completion-macros");
      args.push("-Xclang", "-code-completion-at=-:" + (row + 1) + ":" + (column + 1));
      if (existsSync(pchPath)) {
        args.push("-include-pch", pchPath);
      }
      _ref1 = atom.config.get("autocomplete-clang.includePaths");
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        i = _ref1[_i];
        args.push("-I" + i);
      }
      args.push("-I" + currentDir);
      if (atom.config.get("autocomplete-clang.includeDocumentation")) {
        args.push("-Xclang", "-code-completion-brief-comments");
        if (atom.config.get("autocomplete-clang.includeNonDoxygenCommentsAsDocumentation")) {
          args.push("-fparse-all-comments");
        }
        if (atom.config.get("autocomplete-clang.includeSystemHeadersDocumentation")) {
          args.push("-fretain-comments-from-system-headers");
        }
      }
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
    };

    return ClangProvider;

  })();

  LanguageUtil = {
    getSourceScopeLang: function(scopeSource, scopesArray) {
      var scope, _i, _len;
      for (_i = 0, _len = scopesArray.length; _i < _len; _i++) {
        scope = scopesArray[_i];
        if (scope in scopeSource) {
          return scopeSource[scope];
        }
      }
      return null;
    },
    prefixAtPosition: function(editor, bufferPosition) {
      var line, regex, _ref1;
      regex = /\w+$/;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      return ((_ref1 = line.match(regex)) != null ? _ref1[0] : void 0) || '';
    },
    nearestSymbolPosition: function(editor, bufferPosition) {
      var line, matches, regex, symbol, symbolColumn;
      regex = /(\W+)\w*$/;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      matches = line.match(regex);
      if (matches) {
        symbol = matches[1];
        symbolColumn = matches[0].indexOf(symbol) + symbol.length + (line.length - matches[0].length);
        return [new Point(bufferPosition.row, symbolColumn), symbol.slice(-1)];
      } else {
        return [bufferPosition, ''];
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWNsYW5nL2xpYi9jbGFuZy1wcm92aWRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFJQTtBQUFBLE1BQUEsbUhBQUE7O0FBQUEsRUFBQSxPQUF1RCxPQUFBLENBQVEsTUFBUixDQUF2RCxFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FBUixFQUFlLHVCQUFBLGVBQWYsRUFBZ0MsMkJBQUEsbUJBQWhDLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUMsYUFBYyxPQUFBLENBQVEsSUFBUixFQUFkLFVBRkQsQ0FBQTs7QUFBQSxFQUdBLFVBQUEsR0FBYSxPQUFBLENBQVEsYUFBUixDQUhiLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNOytCQUNKOztBQUFBLDRCQUFBLFFBQUEsR0FBVSxzREFBVixDQUFBOztBQUFBLDRCQUNBLGlCQUFBLEdBQW1CLENBRG5CLENBQUE7O0FBQUEsNEJBR0EsV0FBQSxHQUNFO0FBQUEsTUFBQSxZQUFBLEVBQWMsS0FBZDtBQUFBLE1BQ0EsVUFBQSxFQUFZLEdBRFo7QUFBQSxNQUVBLGFBQUEsRUFBZSxhQUZmO0FBQUEsTUFHQSxlQUFBLEVBQWlCLGVBSGpCO0tBSkYsQ0FBQTs7QUFBQSw0QkFTQSxjQUFBLEdBQWdCLFNBQUMsSUFBRCxHQUFBO0FBQ2QsVUFBQSw0SEFBQTtBQUFBLE1BRGdCLGNBQUEsUUFBUSx1QkFBQSxpQkFBaUIsc0JBQUEsY0FDekMsQ0FBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLFlBQVksQ0FBQyxrQkFBYixDQUFnQyxJQUFDLENBQUEsV0FBakMsRUFBOEMsZUFBZSxDQUFDLGNBQWhCLENBQUEsQ0FBOUMsQ0FBWCxDQUFB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

//# sourceURL=/C:/Users/MNP/.atom/packages/autocomplete-clang/lib/clang-provider.coffee
