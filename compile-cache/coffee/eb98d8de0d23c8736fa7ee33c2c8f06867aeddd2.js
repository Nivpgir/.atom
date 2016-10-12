(function() {
  var BufferedProcess, Emitter, Runner, fs, path, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ref = require('atom'), Emitter = _ref.Emitter, BufferedProcess = _ref.BufferedProcess;

  fs = require('fs');

  path = require('path');

  module.exports = Runner = (function() {
    Runner.prototype.bufferedProcess = null;

    function Runner(scriptOptions, emitter) {
      this.scriptOptions = scriptOptions;
      this.emitter = emitter != null ? emitter : new Emitter;
      this.createOnErrorFunc = __bind(this.createOnErrorFunc, this);
      this.onExit = __bind(this.onExit, this);
      this.stderrFunc = __bind(this.stderrFunc, this);
      this.stdoutFunc = __bind(this.stdoutFunc, this);
    }

    Runner.prototype.run = function(command, extraArgs, codeContext, inputString) {
      var args, exit, options, stderr, stdout;
      if (inputString == null) {
        inputString = null;
      }
      this.startTime = new Date();
      args = this.args(codeContext, extraArgs);
      options = this.options();
      stdout = this.stdoutFunc;
      stderr = this.stderrFunc;
      exit = this.onExit;
      this.bufferedProcess = new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
      if (inputString) {
        this.bufferedProcess.process.stdin.write(inputString);
        this.bufferedProcess.process.stdin.end();
      }
      return this.bufferedProcess.onWillThrowError(this.createOnErrorFunc(command));
    };

    Runner.prototype.stdoutFunc = function(output) {
      return this.emitter.emit('did-write-to-stdout', {
        message: output
      });
    };

    Runner.prototype.onDidWriteToStdout = function(callback) {
      return this.emitter.on('did-write-to-stdout', callback);
    };

    Runner.prototype.stderrFunc = function(output) {
      return this.emitter.emit('did-write-to-stderr', {
        message: output
      });
    };

    Runner.prototype.onDidWriteToStderr = function(callback) {
      return this.emitter.on('did-write-to-stderr', callback);
    };

    Runner.prototype.destroy = function() {
      return this.emitter.dispose();
    };

    Runner.prototype.getCwd = function() {
      var cwd, paths, workingDirectoryProvided;
      cwd = this.scriptOptions.workingDirectory;
      workingDirectoryProvided = (cwd != null) && cwd !== '';
      paths = atom.project.getPaths();
      if (!workingDirectoryProvided && (paths != null ? paths.length : void 0) > 0) {
        try {
          cwd = fs.statSync(paths[0]).isDirectory() ? paths[0] : path.join(paths[0], '..');
        } catch (_error) {}
      }
      return cwd;
    };

    Runner.prototype.stop = function() {
      if (this.bufferedProcess != null) {
        this.bufferedProcess.kill();
        return this.bufferedProcess = null;
      }
    };

    Runner.prototype.onExit = function(returnCode) {
      var executionTime;
      this.bufferedProcess = null;
      if ((atom.config.get('script.enableExecTime')) === true && this.startTime) {
        executionTime = (new Date().getTime() - this.startTime.getTime()) / 1000;
      }
      return this.emitter.emit('did-exit', {
        executionTime: executionTime,
        returnCode: returnCode
      });
    };

    Runner.prototype.onDidExit = function(callback) {
      return this.emitter.on('did-exit', callback);
    };

    Runner.prototype.createOnErrorFunc = function(command) {
      return (function(_this) {
        return function(nodeError) {
          _this.bufferedProcess = null;
          _this.emitter.emit('did-not-run', {
            command: command
          });
          return nodeError.handle();
        };
      })(this);
    };

    Runner.prototype.onDidNotRun = function(callback) {
      return this.emitter.on('did-not-run', callback);
    };

    Runner.prototype.options = function() {
      return {
        cwd: this.getCwd(),
        env: this.scriptOptions.mergedEnv(process.env)
      };
    };

    Runner.prototype.fillVarsInArg = function(arg, codeContext, project_path) {
      if (codeContext.filepath != null) {
        arg = arg.replace(/{FILE_ACTIVE}/g, codeContext.filepath);
        arg = arg.replace(/{FILE_ACTIVE_PATH}/g, path.join(codeContext.filepath, '..'));
      }
      if (codeContext.filename != null) {
        arg = arg.replace(/{FILE_ACTIVE_NAME}/g, codeContext.filename);
        arg = arg.replace(/{FILE_ACTIVE_NAME_BASE}/g, path.basename(codeContext.filename, path.extname(codeContext.filename)));
      }
      if (project_path != null) {
        arg = arg.replace(/{PROJECT_PATH}/g, project_path);
      }
      return arg;
    };

    Runner.prototype.args = function(codeContext, extraArgs) {
      var arg, args, paths, project_path;
      args = (this.scriptOptions.cmdArgs.concat(extraArgs)).concat(this.scriptOptions.scriptArgs);
      project_path = '';
      paths = atom.project.getPaths();
      if (paths.length > 0) {
        fs.stat(paths[0], function(err, stats) {
          if (!err) {
            return project_path = stats.isDirectory() ? paths[0] : path.join(paths[0], '..');
          }
        });
      }
      args = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = args.length; _i < _len; _i++) {
          arg = args[_i];
          _results.push(this.fillVarsInArg(arg, codeContext, project_path));
        }
        return _results;
      }).call(this);
      if ((this.scriptOptions.cmd == null) || this.scriptOptions.cmd === '') {
        args = codeContext.shebangCommandArgs().concat(args);
      }
      return args;
    };

    return Runner;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ydW5uZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdEQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxPQUE2QixPQUFBLENBQVEsTUFBUixDQUE3QixFQUFDLGVBQUEsT0FBRCxFQUFVLHVCQUFBLGVBQVYsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHFCQUFBLGVBQUEsR0FBaUIsSUFBakIsQ0FBQTs7QUFNYSxJQUFBLGdCQUFFLGFBQUYsRUFBa0IsT0FBbEIsR0FBQTtBQUEwQyxNQUF6QyxJQUFDLENBQUEsZ0JBQUEsYUFBd0MsQ0FBQTtBQUFBLE1BQXpCLElBQUMsQ0FBQSw0QkFBQSxVQUFVLEdBQUEsQ0FBQSxPQUFjLENBQUE7QUFBQSxtRUFBQSxDQUFBO0FBQUEsNkNBQUEsQ0FBQTtBQUFBLHFEQUFBLENBQUE7QUFBQSxxREFBQSxDQUExQztJQUFBLENBTmI7O0FBQUEscUJBUUEsR0FBQSxHQUFLLFNBQUMsT0FBRCxFQUFVLFNBQVYsRUFBcUIsV0FBckIsRUFBa0MsV0FBbEMsR0FBQTtBQUNILFVBQUEsbUNBQUE7O1FBRHFDLGNBQWM7T0FDbkQ7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFELEdBQWlCLElBQUEsSUFBQSxDQUFBLENBQWpCLENBQUE7QUFBQSxNQUVBLElBQUEsR0FBTyxJQUFDLENBQUEsSUFBRCxDQUFNLFdBQU4sRUFBbUIsU0FBbkIsQ0FGUCxDQUFBO0FBQUEsTUFHQSxPQUFBLEdBQVUsSUFBQyxDQUFBLE9BQUQs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

//# sourceURL=/C:/Users/MNP/.atom/packages/script/lib/runner.coffee
