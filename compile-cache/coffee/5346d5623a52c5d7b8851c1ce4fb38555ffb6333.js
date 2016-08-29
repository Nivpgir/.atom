(function() {
  var Command, Queue, path;

  path = require('path');

  Queue = require('../pipeline/queue');

  module.exports = Command = (function() {
    function Command(_arg) {
      var _ref;
      _ref = _arg != null ? _arg : {}, this.project = _ref.project, this.source = _ref.source, this.name = _ref.name, this.command = _ref.command, this.wd = _ref.wd, this.env = _ref.env, this.modifier = _ref.modifier, this.environment = _ref.environment, this.stdout = _ref.stdout, this.stderr = _ref.stderr, this.output = _ref.output, this.version = _ref.version;
      if (this.env == null) {
        this.env = {};
      }
      if (this.wd == null) {
        this.wd = '.';
      }
      if (this.modifier == null) {
        this.modifier = {};
      }
      if (this.output == null) {
        this.output = {};
      }
      if (this.stdout == null) {
        this.stdout = {
          highlighting: 'nh'
        };
      }
      if (this.stderr == null) {
        this.stderr = {
          highlighting: 'nh'
        };
      }
      if (this.version == null) {
        this.version = 1;
      }
      if (this.version === 1) {
        this.migrateToV2();
      }
    }

    Command.prototype.getSpawnInfo = function() {
      var args;
      this.original = this.command;
      args = Command.splitQuotes(this.command);
      this.command = args[0];
      this.args = args.slice(1);
      return this.mergeEnvironment(process.env);
    };

    Command.prototype.getWD = function() {
      return path.resolve(this.project, this.wd);
    };

    Command.prototype.mergeEnvironment = function(env) {
      var key, _i, _len, _ref, _results;
      _ref = Object.keys(env);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (!this.env[key]) {
          _results.push(this.env[key] = env[key]);
        }
      }
      return _results;
    };

    Command.splitQuotes = function(cmd_string) {
      var a, args, cmd_list, getQuoteIndex, i, instring, qi, _i, _len;
      args = [];
      cmd_list = cmd_string.split(' ');
      instring = false;
      getQuoteIndex = function(line) {
        var c;
        if ((c = line.indexOf('"')) !== -1) {
          return {
            index: c,
            character: '"'
          };
        }
        if ((c = line.indexOf("'")) !== -1) {
          return {
            index: c,
            character: "'"
          };
        }
      };
      while (cmd_list.length !== 0) {
        if (!instring) {
          args.push(cmd_list[0]);
        } else {
          args[args.length - 1] += ' ' + cmd_list[0];
        }
        qi = getQuoteIndex(cmd_list[0]);
        if ((qi = getQuoteIndex(cmd_list[0])) != null) {
          if (instring) {
            instring = false;
          } else {
            if (cmd_list[0].substr(qi.index + 1).indexOf(qi.character) === -1) {
              instring = true;
            }
          }
        }
        cmd_list.shift();
      }
      for (i = _i = 0, _len = args.length; _i < _len; i = ++_i) {
        a = args[i];
        if (/[\"\']/.test(a[0]) && /[\"\']/.test(a[a.length - 1])) {
          args[i] = a.slice(1, -1);
        }
      }
      return args;
    };

    Command.prototype.migrateToV2 = function() {
      if (this.stdout.pty === true) {
        this.environment = {
          name: 'ptyw',
          config: {
            rows: this.stdout.pty_rows,
            cols: this.stdout.pty_cols
          }
        };
        delete this.stdout.pty;
        delete this.stdout.pty_rows;
        delete this.stdout.pty_cols;
      } else {
        this.environment = {
          name: 'child_process',
          config: {
            stdoe: 'both'
          }
        };
      }
      this.migrateStreamV2(this.stdout);
      this.migrateStreamV2(this.stderr);
      return this.version = 2;
    };

    Command.prototype.migrateStreamV2 = function(str) {
      if (str.pipeline != null) {
        return;
      }
      str.pipeline = [];
      if (str.highlighting === 'nh') {
        if (str.ansi_option === 'remove') {
          str.pipeline.push({
            name: 'remansi'
          });
        }
      } else if (str.highlighting === 'ha') {
        str.pipeline.push({
          name: 'all'
        });
      } else if (str.highlighting === 'hc') {
        str.pipeline.push({
          name: 'profile',
          config: {
            profile: str.profile
          }
        });
      } else if (str.highlighting === 'hr') {
        str.pipeline.push({
          name: 'regex',
          config: {
            regex: str.regex,
            defaults: str.defaults
          }
        });
      } else if (str.highlighting === 'ht') {
        str.pipeline.push({
          name: 'regex',
          config: {
            regex: '(?<type> error|warning):'
          }
        });
      }
      delete str.highlighting;
      delete str.profile;
      delete str.ansi_option;
      delete str.regex;
      return delete str.defaults;
    };

    Command.prototype.getQueue = function() {
      return new Queue(this);
    };

    return Command;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9wcm92aWRlci9jb21tYW5kLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvQkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxLQUFBLEdBQVEsT0FBQSxDQUFRLG1CQUFSLENBRFIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDUyxJQUFBLGlCQUFDLElBQUQsR0FBQTtBQUNYLFVBQUEsSUFBQTtBQUFBLDRCQURZLE9BQWdILElBQS9HLElBQUMsQ0FBQSxlQUFBLFNBQVMsSUFBQyxDQUFBLGNBQUEsUUFBUSxJQUFDLENBQUEsWUFBQSxNQUFNLElBQUMsQ0FBQSxlQUFBLFNBQVMsSUFBQyxDQUFBLFVBQUEsSUFBSSxJQUFDLENBQUEsV0FBQSxLQUFLLElBQUMsQ0FBQSxnQkFBQSxVQUFVLElBQUMsQ0FBQSxtQkFBQSxhQUFhLElBQUMsQ0FBQSxjQUFBLFFBQVEsSUFBQyxDQUFBLGNBQUEsUUFBUSxJQUFDLENBQUEsY0FBQSxRQUFRLElBQUMsQ0FBQSxlQUFBLE9BQ2pILENBQUE7O1FBQUEsSUFBQyxDQUFBLE1BQU87T0FBUjs7UUFDQSxJQUFDLENBQUEsS0FBTTtPQURQOztRQUVBLElBQUMsQ0FBQSxXQUFZO09BRmI7O1FBR0EsSUFBQyxDQUFBLFNBQVU7T0FIWDs7UUFJQSxJQUFDLENBQUEsU0FBVTtBQUFBLFVBQUEsWUFBQSxFQUFjLElBQWQ7O09BSlg7O1FBS0EsSUFBQyxDQUFBLFNBQVU7QUFBQSxVQUFBLFlBQUEsRUFBYyxJQUFkOztPQUxYOztRQU1BLElBQUMsQ0FBQSxVQUFXO09BTlo7QUFPQSxNQUFBLElBQWtCLElBQUMsQ0FBQSxPQUFELEtBQVks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

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/provider/command.coffee
