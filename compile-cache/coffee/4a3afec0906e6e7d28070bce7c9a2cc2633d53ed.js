(function() {
  var WildcardSaver, baseName, error, file, fileWithoutExtension, folder, path;

  path = null;

  baseName = function(project, wd) {
    var filename;
    if (wd == null) {
      wd = '.';
    }
    if ((filename = file(project, wd)) != null) {
      return path.basename(filename);
    }
  };

  fileWithoutExtension = function(project, wd) {
    var filename;
    if (wd == null) {
      wd = '.';
    }
    if ((filename = file(project, wd)) != null) {
      return path.basename(filename, path.extname(filename));
    }
  };

  folder = function(project, wd) {
    var filename;
    if (wd == null) {
      wd = '.';
    }
    if ((filename = file(project, wd)) != null) {
      return path.dirname(filename);
    }
  };

  file = function(project, wd) {
    var _ref;
    if (wd == null) {
      wd = '.';
    }
    try {
      return path.relative(path.resolve(project, wd), (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    } catch (_error) {}
  };

  error = 'Could not get path from active text editor';

  module.exports = {
    name: 'Wildcards',
    description: 'Replace wildcards in command and working directory',
    "private": false,
    edit: WildcardSaver = (function() {
      function WildcardSaver() {}

      WildcardSaver.prototype.get = function(command) {
        command.modifier.wildcards = {};
        return null;
      };

      return WildcardSaver;

    })(),
    activate: function() {
      return path = require('path');
    },
    deactivate: function() {
      return path = null;
    },
    preSplit: function(command) {
      return new Promise(function(resolve, reject) {
        if (/%[fbde]/.test(command.wd)) {
          if (/%f/.test(command.wd)) {
            command.wd = command.wd.replace(/(\\)?(%f)/g, function($0, $1, $2) {
              var _ref;
              if ($1) {
                return $2;
              } else {
                return (function() {
                  if ((_ref = file(command.project, null)) != null) {
                    return _ref;
                  } else {
                    throw new Error(error);
                  }
                })();
              }
            });
          }
          if (/%b/.test(command.wd)) {
            command.wd = command.wd.replace(/(\\)?(%b)/g, function($0, $1, $2) {
              var _ref;
              if ($1) {
                return $2;
              } else {
                return (function() {
                  if ((_ref = baseName(command.project, null)) != null) {
                    return _ref;
                  } else {
                    throw new Error(error);
                  }
                })();
              }
            });
          }
          if (/%d/.test(command.wd)) {
            command.wd = command.wd.replace(/(\\)?(%d)/g, function($0, $1, $2) {
              var _ref;
              if ($1) {
                return $2;
              } else {
                return (function() {
                  if ((_ref = folder(command.project, null)) != null) {
                    return _ref;
                  } else {
                    throw new Error(error);
                  }
                })();
              }
            });
          }
          if (/%e/.test(command.wd)) {
            command.wd = command.wd.replace(/(\\)?(%e)/g, function($0, $1, $2) {
              var _ref;
              if ($1) {
                return $2;
              } else {
                return (function() {
                  if ((_ref = fileWithoutExtension(command.project, null)) != null) {
                    return _ref;
                  } else {
                    throw new Error(error);
                  }
                })();
              }
            });
          }
        }
        if (/%[fbde]/.test(command.command)) {
          if (/%f/.test(command.command)) {
            command.command = command.command.replace(/(\\)?(%f)/g, function($0, $1, $2) {
              var _ref;
              if ($1) {
                return $2;
              } else {
                return (function() {
                  if ((_ref = file(command.project, command.wd)) != null) {
                    return _ref;
                  } else {
                    throw new Error(error);
                  }
                })();
              }
            });
          }
          if (/%b/.test(command.command)) {
            command.command = command.command.replace(/(\\)?(%b)/g, function($0, $1, $2) {
              var _ref;
              if ($1) {
                return $2;
              } else {
                return (function() {
                  if ((_ref = baseName(command.project, command.wd)) != null) {
                    return _ref;
                  } else {
                    throw new Error(error);
                  }
                })();
              }
            });
          }
          if (/%d/.test(command.command)) {
            command.command = command.command.replace(/(\\)?(%d)/g, function($0, $1, $2) {
              var _ref;
              if ($1) {
                return $2;
              } else {
                return (function() {
                  if ((_ref = folder(command.project, command.wd)) != null) {
                    return _ref;
                  } else {
                    throw new Error(error);
                  }
                })();
              }
            });
          }
          if (/%e/.test(command.command)) {
            command.command = command.command.replace(/(\\)?(%e)/g, function($0, $1, $2) {
              var _ref;
              if ($1) {
                return $2;
              } else {
                return (function() {
                  if ((_ref = fileWithoutExtension(command.project, command.wd)) != null) {
                    return _ref;
                  } else {
                    throw new Error(error);
                  }
                })();
              }
            });
          }
        }
        return resolve();
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9tb2RpZmllci93aWxkY2FyZHMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdFQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLElBQVAsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxTQUFDLE9BQUQsRUFBVSxFQUFWLEdBQUE7QUFDVCxRQUFBLFFBQUE7O01BRG1CLEtBQUs7S0FDeEI7QUFBQSxJQUFBLElBQUcsc0NBQUg7YUFDRSxJQUFJLENBQUMsUUFBTCxDQUFjLFFBQWQsRUFERjtLQURTO0VBQUEsQ0FGWCxDQUFBOztBQUFBLEVBTUEsb0JBQUEsR0FBdUIsU0FBQyxPQUFELEVBQVUsRUFBVixHQUFBO0FBQ3JCLFFBQUEsUUFBQTs7TUFEK0IsS0FBSztLQUNwQztBQUFBLElBQUEsSUFBRyxzQ0FBSDthQUNFLElBQUksQ0FBQyxRQUFMLENBQWMsUUFBZCxFQUF3QixJQUFJLENBQUMsT0FBTCxDQUFhLFFBQWIsQ0FBeEIsRUFERjtLQURxQjtFQUFBLENBTnZCLENBQUE7O0FBQUEsRUFVQSxNQUFBLEdBQVMsU0FBQyxPQUFELEVBQVUsRUFBVixHQUFBO0FBQ1AsUUFBQSxRQUFBOztNQURpQixLQUFLO0tBQ3RCO0FBQUEsSUFBQSxJQUFHLHNDQUFIO2FBQ0UsSUFBSSxDQUFDLE9BQUwsQ0FBYSxRQUFiLEVBREY7S0FETztFQUFBLENBVlQsQ0FBQTs7QUFBQSxFQWNBLElBQUEsR0FBTyxTQUFDLE9BQUQsRUFBVSxFQUFWLEdBQUE7QUFDTCxRQUFBLElBQUE7O01BRGUsS0FBSztLQUNwQjtBQUFBO2FBQ0UsSUFBSSxDQUFDLFFBQUwsQ0FBYyxJQUFJLENBQUMsT0FBTCxDQUFhLE9BQWIsRUFBc0IsRUFBdEIsQ0FBZCw4REFB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

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/modifier/wildcards.coffee
