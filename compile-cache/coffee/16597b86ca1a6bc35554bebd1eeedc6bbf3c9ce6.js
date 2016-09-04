(function() {
  var AskView, Command, ProjectConfig, Queue, SelectionView, WorkerManager, askview, fs, getFirstConfig, getProjectConfig, path, selectionview, _getFirstConfig;

  path = require('path');

  fs = require('fs');

  ProjectConfig = require('./project');

  Command = require('./command');

  Queue = require('../pipeline/queue');

  WorkerManager = require('./worker-manager');

  SelectionView = null;

  selectionview = null;

  AskView = null;

  askview = null;

  getFirstConfig = function(folder) {
    return new Promise(function(resolve, reject) {
      return _getFirstConfig(folder, resolve, reject);
    });
  };

  _getFirstConfig = function(folder, resolve, reject) {
    var file;
    return fs.exists((file = path.join(folder, '.build-tools.cson')), function(exists) {
      var p;
      if (exists) {
        return resolve({
          folderPath: folder,
          filePath: file
        });
      }
      p = path.resolve(folder, '..');
      if (p !== folder) {
        return _getFirstConfig(path.resolve(folder, '..'), resolve, reject);
      }
      return reject();
    });
  };

  getProjectConfig = function(folder, file) {
    return new ProjectConfig(folder, file);
  };

  module.exports = {
    activate: function() {
      return WorkerManager.activate();
    },
    deactivate: function() {
      WorkerManager.deactivate();
      SelectionView = null;
      selectionview = null;
      AskView = null;
      return askview = null;
    },
    key: function(id) {
      var p, _ref;
      if ((p = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0) == null) {
        return;
      }
      return getFirstConfig(path.resolve(path.dirname(p))).then(((function(_this) {
        return function(_arg) {
          var c, filePath, folderPath;
          folderPath = _arg.folderPath, filePath = _arg.filePath;
          return (c = getProjectConfig(folderPath, filePath)).getCommandByIndex(id).then((function(command) {
            _this.run(command);
            return c.destroy();
          }), function(error) {
            var _ref1;
            return (_ref1 = atom.notifications) != null ? _ref1.addError(error.message) : void 0;
          });
        };
      })(this)), function() {});
    },
    keyAsk: function(id) {
      var p, _ref;
      if ((p = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0) == null) {
        return;
      }
      return getFirstConfig(path.resolve(path.dirname(p))).then(((function(_this) {
        return function(_arg) {
          var config, filePath, folderPath;
          folderPath = _arg.folderPath, filePath = _arg.filePath;
          return (config = getProjectConfig(folderPath, filePath)).getCommandByIndex(id).then((function(command) {
            if (AskView == null) {
              AskView = require('../view/ask-view');
            }
            return askview = new AskView(command.command, function(c) {
              var rc;
              rc = new Command(command);
              rc.command = c;
              _this.run(rc);
              return config.destroy();
            });
          }), function(error) {
            var _ref1;
            return (_ref1 = atom.notifications) != null ? _ref1.addError(error.message) : void 0;
          });
        };
      })(this)), function() {});
    },
    selection: function() {
      var p, _ref;
      if ((p = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0) == null) {
        return;
      }
      if (SelectionView == null) {
        SelectionView = require('../view/selection-view');
      }
      selectionview = new SelectionView;
      selectionview.setLoading('Loading project configuration');
      return getFirstConfig(path.resolve(path.dirname(p))).then(((function(_this) {
        return function(_arg) {
          var error, filePath, folderPath, project;
          folderPath = _arg.folderPath, filePath = _arg.filePath;
          selectionview.setLoading('Loading command list');
          project = getProjectConfig(folderPath, filePath);
          error = function(e) {
            selectionview.setError(e.message);
            return project.destroy();
          };
          return project.getCommandNameObjects().then((function(commands) {
            selectionview.setItems(commands);
            return selectionview.callback = function(_arg1) {
              var id, pid;
              id = _arg1.id, pid = _arg1.pid;
              return project.getCommandById(pid, id).then((function(command) {
                _this.run(command);
                return project.destroy();
              }), error);
            };
          }), error);
        };
      })(this)), function() {
        return selectionview.setError('Could not load project configuration');
      });
    },
    run: function(command) {
      var error;
      WorkerManager.removeWorker(command);
      error = function(e) {
        var _ref;
        return (_ref = atom.notifications) != null ? _ref.addError(e.message) : void 0;
      };
      return WorkerManager.createWorker(command).then((function(worker) {
        return worker.run().then(void 0, error);
      }), error);
    },
    inputCommand: function(command) {
      return new Command(command).getQueue();
    },
    inputQueue: function(commands) {
      var command, _commands, _i, _len;
      _commands = [];
      for (_i = 0, _len = commands.length; _i < _len; _i++) {
        command = commands[_i];
        _commands.push(new Command(command));
      }
      return new Queue(_commands);
    },
    cancel: function() {
      return WorkerManager.deactivate();
    },
    getFirstConfig: getFirstConfig
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9wcm92aWRlci9pbnB1dC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUpBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLFdBQVIsQ0FGaEIsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQUhWLENBQUE7O0FBQUEsRUFJQSxLQUFBLEdBQVEsT0FBQSxDQUFRLG1CQUFSLENBSlIsQ0FBQTs7QUFBQSxFQU1BLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBTmhCLENBQUE7O0FBQUEsRUFRQSxhQUFBLEdBQWdCLElBUmhCLENBQUE7O0FBQUEsRUFTQSxhQUFBLEdBQWdCLElBVGhCLENBQUE7O0FBQUEsRUFXQSxPQUFBLEdBQVUsSUFYVixDQUFBOztBQUFBLEVBWUEsT0FBQSxHQUFVLElBWlYsQ0FBQTs7QUFBQSxFQWNBLGNBQUEsR0FBaUIsU0FBQyxNQUFELEdBQUE7V0FDWCxJQUFBLE9BQUEsQ0FBUSxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7YUFDVixlQUFBLENBQWdCLE1BQWhCLEVBQXdCLE9BQXhCLEVBQWtDLE1BQWxDLEVBRFU7SUFBQSxDQUFSLEVBRFc7RUFBQSxDQWRqQixDQUFBOztBQUFBLEVBbUJBLGVBQUEsR0FBa0IsU0FBQyxNQUFELEVBQVMsT0FBVCxFQUFrQixNQUFsQixHQUFBO0FBQ2hCLFFBQUEsSUFBQTtXQUFBLEVBQUUsQ0FBQyxNQUFILENBQVUsQ0FBQyxJQUFBLEdBQU8sSUFBSSxD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

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/provider/input.coffee
