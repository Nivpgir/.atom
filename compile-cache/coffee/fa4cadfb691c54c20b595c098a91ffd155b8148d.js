(function() {
  var Emitter, Modifiers, OutputPipeline, XRegExp, fs, path,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  XRegExp = require('xregexp').XRegExp;

  Modifiers = require('../stream-modifiers/modifiers');

  Emitter = require('atom').Emitter;

  fs = require('fs-plus');

  path = require('path');

  module.exports = OutputPipeline = (function() {
    function OutputPipeline(settings, stream) {
      var c, config, name, _i, _len, _ref, _ref1, _ref2;
      this.settings = settings;
      this.stream = stream;
      this.lint = __bind(this.lint, this);
      this.pushLinterMessage = __bind(this.pushLinterMessage, this);
      this.print = __bind(this.print, this);
      this.replacePrevious = __bind(this.replacePrevious, this);
      this.createMessage = __bind(this.createMessage, this);
      this.absolutePath = __bind(this.absolutePath, this);
      this.setType = __bind(this.setType, this);
      this.subscribers = new Emitter;
      this.pipeline = [];
      _ref = this.stream.pipeline;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], name = _ref1.name, config = _ref1.config;
        if ((c = Modifiers.modules[name]) != null) {
          if (c.modifier.prototype.modify != null) {
            Modifiers.activate(name);
            this.pipeline.push(new c.modifier(config, this.settings, this));
          }
        } else {
          if ((_ref2 = atom.notifications) != null) {
            _ref2.addError("Could not find stream modifier: " + name);
          }
        }
      }
      this.perm = {
        cwd: '.'
      };
    }

    OutputPipeline.prototype.destroy = function() {
      var mod, _i, _len, _ref;
      _ref = this.pipeline;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mod = _ref[_i];
        if (typeof mod.destroy === "function") {
          mod.destroy();
        }
      }
      this.pipeline = null;
      this.subscribers.dispose();
      return this.subscribers = null;
    };

    OutputPipeline.prototype.subscribeToCommands = function(object, callback, command) {
      return this.subscribers.on(command, function(o) {
        return object[callback](o);
      });
    };

    OutputPipeline.prototype.getFiles = function(match) {
      var existing, exists, filenames, fp, mod, _i, _j, _k, _len, _len1, _len2, _match, _ref, _ref1;
      filenames = [];
      _ref = this.pipeline;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mod = _ref[_i];
        if (mod.getFiles == null) {
          continue;
        }
        _ref1 = mod.getFiles({
          temp: match,
          perm: this.perm
        });
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          _match = _ref1[_j];
          if (_match.file) {
            exists = false;
            for (_k = 0, _len2 = filenames.length; _k < _len2; _k++) {
              existing = filenames[_k];
              if (_match.start === existing.start) {
                exists = true;
              }
            }
            if (exists) {
              break;
            }
            if ((fp = this.absolutePath(_match.file)) != null) {
              _match.file = fp;
              filenames.push(_match);
            }
          }
        }
      }
      return filenames;
    };

    OutputPipeline.prototype.finishLine = function(td, input) {
      var files;
      if (td.input !== input || (files = this.getFiles(td)).length !== 0) {
        this.print(td, files);
      } else if (td.type != null) {
        this.setType(td);
      }
      if (td.file != null) {
        return this.lint(td);
      }
    };

    OutputPipeline.prototype["in"] = function(_input) {
      var mod, td, _i, _len, _ref;
      td = {
        input: _input
      };
      _ref = this.pipeline;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mod = _ref[_i];
        if (mod.modify({
          temp: td,
          perm: this.perm
        }) !== null) {
          return;
        }
      }
      return this.finishLine(td, _input);
    };

    OutputPipeline.prototype.setType = function(match) {
      var _ref;
      return this.subscribers.emit('setType', (_ref = match.highlighting) != null ? _ref : match.type);
    };

    OutputPipeline.prototype.absolutePath = function(relpath) {
      var fp;
      if (fs.existsSync(fp = path.resolve(this.settings.project, this.settings.wd, this.perm.cwd, relpath))) {
        return fp;
      }
    };

    OutputPipeline.prototype.createMessage = function(match) {
      var col, row;
      row = 1;
      col = 10000;
      row = parseInt(match.row);
      if (match.col != null) {
        col = parseInt(match.col);
      }
      return {
        type: match.type,
        text: match.message,
        filePath: this.absolutePath(match.file),
        range: [[row - 1, 0], [row - 1, match.col != null ? col - 1 : 9999]]
      };
    };

    OutputPipeline.prototype.replacePrevious = function(new_lines) {
      var items, line, _i, _len;
      items = [];
      for (_i = 0, _len = new_lines.length; _i < _len; _i++) {
        line = new_lines[_i];
        items.push({
          input: line,
          files: this.getFiles(line)
        });
      }
      return this.subscribers.emit('replacePrevious', items);
    };

    OutputPipeline.prototype.print = function(match, _files) {
      if (_files == null) {
        _files = this.getFiles(match);
      }
      return this.subscribers.emit('print', {
        input: match,
        files: _files
      });
    };

    OutputPipeline.prototype.pushLinterMessage = function(message) {
      return this.subscribers.emit('linter', message);
    };

    OutputPipeline.prototype.createExtensionString = function(scopes, default_extensions) {
      var extension, extensions, extensions_raw, _i, _len;
      extensions_raw = [];
      extensions = [];
      scopes.forEach(function(scope) {
        var grammar;
        if ((grammar = atom.grammars.grammarForScopeName(scope)) != null) {
          return extensions_raw = extensions_raw.concat(grammar.fileTypes);
        }
      });
      if (extensions_raw.length === 0) {
        extensions_raw = default_extensions;
      }
      extensions_raw = extensions_raw.sort().reverse();
      for (_i = 0, _len = extensions_raw.length; _i < _len; _i++) {
        extension = extensions_raw[_i];
        extensions.push(extension.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&'));
      }
      return '(' + extensions.join('|') + ')';
    };

    OutputPipeline.prototype.createRegex = function(content, extensions) {
      content = content.replace(/\(\?extensions\)/g, extensions);
      return new XRegExp(content, 'xni');
    };

    OutputPipeline.prototype.lint = function(match) {
      var col, row;
      if ((match != null) && (match.file != null) && (match.row != null) && (match.type != null) && (match.message != null)) {
        row = 1;
        col = 10000;
        row = parseInt(match.row);
        if (match.col != null) {
          col = parseInt(match.col);
        }
        return this.pushLinterMessage({
          type: match.type,
          text: match.message,
          filePath: this.absolutePath(match.file),
          range: [[row - 1, 0], [row - 1, col - 1]],
          trace: match.trace
        });
      }
    };

    return OutputPipeline;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9waXBlbGluZS9vdXRwdXQtcGlwZWxpbmUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFEQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFNBQVIsQ0FBa0IsQ0FBQyxPQUE3QixDQUFBOztBQUFBLEVBQ0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSwrQkFBUixDQURaLENBQUE7O0FBQUEsRUFHQyxVQUFXLE9BQUEsQ0FBUSxNQUFSLEVBQVgsT0FIRCxDQUFBOztBQUFBLEVBS0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBTEwsQ0FBQTs7QUFBQSxFQU1BLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQU5QLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBRVMsSUFBQSx3QkFBRSxRQUFGLEVBQWEsTUFBYixHQUFBO0FBQ1gsVUFBQSw2Q0FBQTtBQUFBLE1BRFksSUFBQyxDQUFBLFdBQUEsUUFDYixDQUFBO0FBQUEsTUFEdUIsSUFBQyxDQUFBLFNBQUEsTUFDeEIsQ0FBQTtBQUFBLHlDQUFBLENBQUE7QUFBQSxtRUFBQSxDQUFBO0FBQUEsMkNBQUEsQ0FBQTtBQUFBLCtEQUFBLENBQUE7QUFBQSwyREFBQSxDQUFBO0FBQUEseURBQUEsQ0FBQTtBQUFBLCtDQUFBLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxXQUFELEdBQWUsR0FBQSxDQUFBLE9BQWYsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxFQURaLENBQUE7QUFFQTtBQUFBLFdBQUEsMkNBQUEsR0FBQTtBQUNFLDBCQURHLGFBQUEsTUFBTSxlQUFBLE1BQ1QsQ0FBQTtBQUFBLFFBQUEsSUFB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

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/pipeline/output-pipeline.coffee
