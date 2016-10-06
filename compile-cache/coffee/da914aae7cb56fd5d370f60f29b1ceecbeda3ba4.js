(function() {
  var fs, getClangFlagsCompDB, getClangFlagsDotClangComplete, getFileContents, path;

  path = require('path');

  fs = require('fs');

  module.exports = {
    getClangFlags: function(fileName) {
      var flags;
      flags = getClangFlagsCompDB(fileName);
      if (flags.length === 0) {
        flags = getClangFlagsDotClangComplete(fileName);
      }
      return flags;
    },
    activate: function(state) {}
  };

  getFileContents = function(startFile, fileName) {
    var contents, error, parentDir, searchDir, searchFilePath, searchFileStats;
    searchDir = path.dirname(startFile);
    while (searchDir) {
      searchFilePath = path.join(searchDir, fileName);
      try {
        searchFileStats = fs.statSync(searchFilePath);
        if (searchFileStats.isFile()) {
          try {
            contents = fs.readFileSync(searchFilePath, 'utf8');
            return [searchDir, contents];
          } catch (_error) {
            error = _error;
            console.log("clang-flags for " + fileName + " couldn't read file " + searchFilePath);
            console.log(error);
          }
          return [null, null];
        }
      } catch (_error) {}
      parentDir = path.dirname(searchDir);
      if (parentDir === searchDir) {
        break;
      }
      searchDir = parentDir;
    }
    return [null, null];
  };

  getClangFlagsCompDB = function(fileName) {
    var allArgs, args, compDB, compDBContents, config, doubleArgs, i, it, nextArg, relativeName, searchDir, singleArgs, _i, _j, _k, _len, _len1, _ref, _ref1;
    _ref = getFileContents(fileName, "compile_commands.json"), searchDir = _ref[0], compDBContents = _ref[1];
    args = [];
    if (compDBContents !== null && compDBContents.length > 0) {
      compDB = JSON.parse(compDBContents);
      for (_i = 0, _len = compDB.length; _i < _len; _i++) {
        config = compDB[_i];
        relativeName = fileName.slice(searchDir.length + 1, +fileName.length + 1 || 9e9);
        if (fileName === config['file'] || relativeName === config['file']) {
          allArgs = config.command.replace(/\s+/g, " ").split(' ');
          singleArgs = [];
          doubleArgs = [];
          for (i = _j = 0, _ref1 = allArgs.length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
            nextArg = allArgs[i + 1];
            if (allArgs[i][0] === '-' && (!nextArg || nextArg[0] === '-')) {
              singleArgs.push(allArgs[i]);
            }
            if (allArgs[i][0] === '-' && nextArg && (nextArg[0] !== '-')) {
              doubleArgs.push(allArgs[i] + " " + nextArg);
            }
          }
          args = singleArgs;
          for (_k = 0, _len1 = doubleArgs.length; _k < _len1; _k++) {
            it = doubleArgs[_k];
            if (it.slice(0, 8) === '-isystem') {
              args.push(it);
            }
          }
          args = args.concat(["-working-directory=" + searchDir]);
          break;
        }
      }
    }
    return args;
  };

  getClangFlagsDotClangComplete = function(fileName) {
    var args, clangCompleteContents, searchDir, _ref;
    _ref = getFileContents(fileName, ".clang_complete"), searchDir = _ref[0], clangCompleteContents = _ref[1];
    args = [];
    if (clangCompleteContents !== null && clangCompleteContents.length > 0) {
      args = clangCompleteContents.trim().split("\n");
      args = args.concat(["-working-directory=" + searchDir]);
    }
    return args;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1jbGFuZy9ub2RlX21vZHVsZXMvY2xhbmctZmxhZ3MvbGliL2NsYW5nLWZsYWdzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSw2RUFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsYUFBQSxFQUFlLFNBQUMsUUFBRCxHQUFBO0FBQ2IsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsbUJBQUEsQ0FBb0IsUUFBcEIsQ0FBUixDQUFBO0FBQ0EsTUFBQSxJQUFHLEtBQUssQ0FBQyxNQUFOLEtBQWdCLENBQW5CO0FBQ0UsUUFBQSxLQUFBLEdBQVEsNkJBQUEsQ0FBOEIsUUFBOUIsQ0FBUixDQURGO09BREE7QUFHQSxhQUFPLEtBQVAsQ0FKYTtJQUFBLENBQWY7QUFBQSxJQUtBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQSxDQUxWO0dBSkYsQ0FBQTs7QUFBQSxFQVdBLGVBQUEsR0FBa0IsU0FBQyxTQUFELEVBQVksUUFBWixHQUFBO0FBQ2hCLFFBQUEsc0VBQUE7QUFBQSxJQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsQ0FBWixDQUFBO0FBQ0EsV0FBTSxTQUFOLEdBQUE7QUFDRSxNQUFBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLFFBQXJCLENBQWpCLENBQUE7QUFDQTtBQUNFLFFBQUEsZUFBQSxHQUFrQixFQUFFLENBQUMsUUFBSCxDQUFZLGNBQVosQ0FBbEIsQ0FBQTtBQUNBLFFBQUEsSUFBRyxlQUFlLENBQUMsTUFBaEIsQ0FBQSxDQUFIO0FBQ0U7QUFDRSxZQUFBLFFBQUEsR0FBVyxFQUFFLENBQUMsWUFBSCxDQUFnQixjQUFoQixFQUFnQyxNQUFoQyxDQUFYLENBQUE7QUFDQSxtQkFBTyxDQUFDLFNBQUQsRUFBWSxRQUFaLENBQVAsQ0FGRjtXQUFBLGNBQUE7QUFJRSxZQURJLGNBQ0osQ0FBQTtBQUFBLFlBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxrQkFBQSxHQUFxQixRQUFyQixHQUFnQyxzQkFBaEMsR0FBeUQsY0FBckUsQ0FBQSxDQUFBO0FBQUEsWUFDQSxPQUFPLENBQUMsR0FBUixDQUFZLEtBQVosQ0FEQSxDQUpGO1dBQUE7QUFNQSxpQkFBTyxDQUFDLElBQUQsRUFBTyxJQUFQLENBQVAsQ0FQRjtTQUZGO09BQUEsa0JBREE7QUFBQSxNQVdBLFNBQUEsR0FBWSxJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsQ0FYWixDQUFBO0FBWUEsTUFBQSxJQUFTLFNBQUEsS0FBYSxTQUF0QjtBQUFBLGNBQUE7T0FaQTtBQUFBLE1BYUEsU0FBQSxHQUFZLFNBYlosQ0FERjtJQUFBLENBREE7QUFnQkEsV0FBTyxDQUFDLElBQUQsRUFBTyxJQUFQLENBQVAsQ0FqQmdCO0VBQUEsQ0FYbEIsQ0FBQTs7QUFBQSxFQThCQSxtQkFBQSxHQUFzQixTQUFDLFFBQUQsR0FBQTtBQUNwQixRQUFBLG9KQUFBO0FBQUEsSUFBQSxPQUE4QixlQUFBLENBQWdCLFFBQWhCLEVBQTBCLHVCQUExQixDQUE5QixFQUFDLG1CQUFELEVBQVksd0JBQVosQ0FBQTtBQUFBLElBQ0EsSUFBQSxHQUFPLEVBRFAsQ0FBQTtBQUVBLElBQUEsSUFBRyxjQUFBLEtBQWtCLElBQWxCLElBQTBCLGNBQWMsQ0FBQyxNQUFmLEdBQXdCLENBQXJEO0FBQ0UsTUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxjQUFYLENBQVQsQ0FBQTtBQUNBLFdBQUEsNkNBQUE7NEJBQUE7QUFFRSxRQUFBLFlBQUEsR0FBZSxRQUFTLHlEQUF4QixDQUFBO0FBQ0EsUUFBQSxJQUFHLFFBQUEsS0FBWSxNQUFPLENBQUEsTUFBQSxDQUFuQixJQUE4QixZQUFBLEtBQWdCLE1BQU8sQ0FBQSxNQUFBLENBQXhEO0FBQ0UsVUFBQSxPQUFBLEdBQVUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFmLENBQXVCLE1BQXZCLEVBQStCLEdBQS9CLENBQW1DLENBQUMsS0FBcEMsQ0FBMEMsR0FBMUMsQ0FBVixDQUFBO0FBQUEsVUFDQSxVQUFBLEdBQWEsRUFEYixDQUFBO0FBQUEsVUFFQSxVQUFBLEdBQWEsRUFGYixDQUFBO0FBR0EsZUFBUyw0R0FBVCxHQUFBO0FBQ0UsWUFBQSxPQUFBLEdBQVUsT0FBUSxDQUFBLENBQUEsR0FBRSxDQUFGLENBQWxCLENBQUE7QUFFQSxZQUFBLElBQThCLE9BQVEsQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQVgsS0FBaUIsR0FBakIsSUFBeUIsQ0FBQyxDQUFBLE9BQUEsSUFBZSxPQUFRLENBQUEsQ0FBQSxDQUFSLEtBQWMsR0FBOUIsQ0FBdkQ7QUFBQSxjQUFBLFVBQVUsQ0FBQyxJQUFYLENBQWdCLE9BQVEsQ0FBQSxDQUFBLENBQXhCLENBQUEsQ0FBQTthQUZBO0FBR0EsWUFBQSxJQUE4QyxPQUFRLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFYLEtBQWlCLEdBQWpCLElBQXlCLE9BQXpCLElBQXFDLENBQUMsT0FBUSxDQUFBLENBQUEsQ0FBUixLQUFjLEdBQWYsQ0FBbkY7QUFBQSxjQUFBLFVBQVUsQ0FBQyxJQUFYLENBQWdCLE9BQVEsQ0FBQSxDQUFBLENBQVIsR0FBYSxHQUFiLEdBQW1CLE9BQW5DLENBQUEsQ0FBQTthQUpGO0FBQUEsV0FIQTtBQUFBLFVBUUEsSUFBQSxHQUFPLFVBUlAsQ0FBQTtBQVNBLGVBQUEsbURBQUE7Z0NBQUE7Z0JBQXVDLEVBQUcsWUFBSCxLQUFZO0FBQW5ELGNBQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxFQUFWLENBQUE7YUFBQTtBQUFBLFdBVEE7QUFBQSxVQVVBLElBQUEsR0FBTyxJQUFJLENBQUMsTUFBTCxDQUFZLENBQUUscUJBQUEsR0FBcUIsU0FBdkIsQ0FBWixDQVZQLENBQUE7QUFXQSxnQkFaRjtTQUhGO0FBQUEsT0FGRjtLQUZBO0FBb0JBLFdBQU8sSUFBUCxDQXJCb0I7RUFBQSxDQTlCdEIsQ0FBQTs7QUFBQSxFQXFEQSw2QkFBQSxHQUFnQyxTQUFDLFFBQUQsR0FBQTtBQUM5QixRQUFBLDRDQUFBO0FBQUEsSUFBQSxPQUFxQyxlQUFBLENBQWdCLFFBQWhCLEVBQTBCLGlCQUExQixDQUFyQyxFQUFDLG1CQUFELEVBQVksK0JBQVosQ0FBQTtBQUFBLElBQ0EsSUFBQSxHQUFPLEVBRFAsQ0FBQTtBQUVBLElBQUEsSUFBRyxxQkFBQSxLQUF5QixJQUF6QixJQUFpQyxxQkFBcUIsQ0FBQyxNQUF0QixHQUErQixDQUFuRTtBQUNFLE1BQUEsSUFBQSxHQUFPLHFCQUFxQixDQUFDLElBQXRCLENBQUEsQ0FBNEIsQ0FBQyxLQUE3QixDQUFtQyxJQUFuQyxDQUFQLENBQUE7QUFBQSxNQUNBLElBQUEsR0FBTyxJQUFJLENBQUMsTUFBTCxDQUFZLENBQUUscUJBQUEsR0FBcUIsU0FBdkIsQ0FBWixDQURQLENBREY7S0FGQTtBQUtBLFdBQU8sSUFBUCxDQU44QjtFQUFBLENBckRoQyxDQUFBO0FBQUEiCn0=

//# sourceURL=/C:/Users/nivp/.atom/packages/autocomplete-clang/node_modules/clang-flags/lib/clang-flags.coffee
