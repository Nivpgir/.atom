(function() {
  var $, $$, Command, DepInfoPane, DependencyPane, Input, Project, View, path, resolveDependencies, resolveDependency, resolveQueue, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, View = _ref.View;

  path = require('path');

  Command = null;

  Project = null;

  Input = null;

  resolveQueue = function(queue, q, projects, resolve, reject) {
    var c;
    if ((c = queue.splice(0, 1)[0]) == null) {
      return resolve(q);
    }
    return resolveDependencies(c, [], projects).then((function(new_q) {
      return resolveQueue(queue, q.concat(new_q.reverse()), projects, resolve, reject);
    }), reject);
  };

  resolveDependencies = function(command, q, projects) {
    return new Promise(function(resolve, reject) {
      var _name;
      q.push(command);
      if (command.modifier.dependency == null) {
        return resolve(q);
      }
      if (command.source == null) {
        throw new Error('No source parameter');
      }
      if (projects[_name = command.project] == null) {
        projects[_name] = {};
      }
      if (projects[command.project][command.source] == null) {
        projects[command.project][command.source] = new Project(command.project, command.source);
      }
      return resolveDependency(command.modifier.dependency, q, projects, projects[command.project][command.source], resolve, reject);
    });
  };

  resolveDependency = function(_arg, q, projects, project, resolve, reject) {
    var abort, k, list;
    list = _arg.list, abort = _arg.abort;
    if ((k = list.pop()) == null) {
      return resolve(q);
    }
    return project.getCommandById(k[0], k[1]).then((function(command) {
      if (command.name !== k[2]) {
        return reject(new Error("Command names " + command.name + " and " + k[0] + ":" + k[1] + ":" + k[2] + " do not match"));
      }
      return resolveDependencies(command, q, projects).then((function() {
        return resolveDependency({
          list: list,
          abort: abort
        }, q, projects, project, resolve, reject);
      }), reject);
    }), function(e) {
      if (abort) {
        return reject(e);
      }
      return resolveDependency({
        list: list,
        abort: abort
      }, q, projects, project, resolve, reject);
    });
  };

  module.exports = {
    name: 'Dependencies',
    description: 'Execute other commands before this one.',
    "private": false,
    activate: function(command, project, input) {
      Command = command;
      Project = project;
      return Input = input;
    },
    edit: DependencyPane = (function(_super) {
      __extends(DependencyPane, _super);

      function DependencyPane() {
        return DependencyPane.__super__.constructor.apply(this, arguments);
      }

      DependencyPane.content = function() {
        return this.div({
          "class": 'panel-body padded'
        }, (function(_this) {
          return function() {
            _this.div({
              "class": 'dependency-list'
            }, function() {
              _this.div({
                "class": 'active-dependencies',
                outlet: 'deps'
              });
              _this.div({
                "class": 'dependency-select-list hidden',
                outlet: 'select'
              });
              return _this.div({
                "class": 'config-icons'
              }, function() {
                _this.div({
                  id: 'add',
                  "class": 'icon-plus'
                });
                return _this.div({
                  id: 'cancel',
                  "class": 'icon-x hidden'
                });
              });
            });
            return _this.div({
              "class": 'block input-label align'
            }, function() {
              _this.input({
                "class": 'input-checkbox',
                id: 'abort',
                type: 'checkbox'
              });
              return _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Abort when command not found');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Cancel the operation if a command could not be resolved');
                });
              });
            });
          };
        })(this));
      };

      DependencyPane.prototype.set = function(command, source) {
        var dep, _i, _len, _ref1;
        this.find('#add').on('click', (function(_this) {
          return function() {
            var project, _ref1;
            try {
              project = new Project(path.dirname(source), source);
              return project.getCommandNameObjects().then((function(commands) {
                var id, item, name, pid, _i, _len, _ref1;
                _this.select.empty();
                for (_i = 0, _len = commands.length; _i < _len; _i++) {
                  _ref1 = commands[_i], pid = _ref1.pid, id = _ref1.id, name = _ref1.name;
                  item = $$(function() {
                    return this.div({
                      "class": 'dependency',
                      pid: pid,
                      id: id,
                      name: name
                    }, (function(_this) {
                      return function() {
                        return _this.div("" + pid + ":" + id + ":" + name);
                      };
                    })(this));
                  });
                  item.on('click', function(_arg) {
                    var currentTarget;
                    currentTarget = _arg.currentTarget;
                    pid = currentTarget.attributes.getNamedItem('pid').value;
                    id = currentTarget.attributes.getNamedItem('id').value;
                    name = currentTarget.attributes.getNamedItem('name').value;
                    _this.add([pid, id, name]);
                    return _this.cancel();
                  });
                  _this.select.append(item);
                }
                _this.deps.addClass('hidden');
                _this.select.removeClass('hidden');
                _this.find('#add').addClass('hidden');
                return _this.find('#cancel').removeClass('hidden');
              }), function(e) {
                var _ref1;
                return (_ref1 = atom.notifications) != null ? _ref1.addError(e) : void 0;
              });
            } catch (_error) {
              return (_ref1 = atom.notifications) != null ? _ref1.addError("Could not read from config file " + source) : void 0;
            }
          };
        })(this));
        this.find('#cancel').on('click', (function(_this) {
          return function() {
            return _this.cancel();
          };
        })(this));
        this.deps.empty();
        if ((command != null ? command.modifier.dependency : void 0) != null) {
          _ref1 = command.modifier.dependency.list;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            dep = _ref1[_i];
            this.deps.append(this.generateItem(dep));
          }
          return this.find('#abort').prop('checked', command.modifier.dependency.abort);
        } else {
          return this.find('#abort').prop('checked', true);
        }
      };

      DependencyPane.prototype.get = function(command) {
        var child, id, name, pid, _i, _len, _ref1;
        command.modifier.dependency = {};
        command.modifier.dependency.list = [];
        command.modifier.dependency.abort = this.find('#abort').prop('checked');
        _ref1 = this.deps.children();
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          child = _ref1[_i];
          pid = child.attributes.getNamedItem('pid').value;
          id = child.attributes.getNamedItem('id').value;
          name = child.attributes.getNamedItem('name').value;
          command.modifier.dependency.list.push([pid, id, name]);
        }
        return null;
      };

      DependencyPane.prototype.add = function(item) {
        return this.deps.append(this.generateItem(item));
      };

      DependencyPane.prototype.cancel = function() {
        this.deps.removeClass('hidden');
        this.select.addClass('hidden');
        this.find('#add').removeClass('hidden');
        return this.find('#cancel').addClass('hidden');
      };

      DependencyPane.prototype.generateItem = function(_arg) {
        var id, item, name, pid;
        pid = _arg[0], id = _arg[1], name = _arg[2];
        item = $$(function() {
          return this.div({
            "class": 'dependency',
            pid: pid,
            id: id,
            name: name
          }, (function(_this) {
            return function() {
              _this.div("" + pid + ":" + id + ":" + name);
              return _this.div({
                "class": 'actions'
              }, function() {
                _this.div({
                  "class": 'icon-triangle-up'
                });
                _this.div({
                  "class": 'icon-triangle-down'
                });
                return _this.div({
                  "class": 'icon-x'
                });
              });
            };
          })(this));
        });
        item.on('click', '.icon-triangle-down', function(_arg1) {
          var currentTarget, i;
          currentTarget = _arg1.currentTarget;
          i = $(currentTarget.parentNode.parentNode);
          return i.next().after(i);
        });
        item.on('click', '.icon-triangle-up', function(_arg1) {
          var currentTarget, i;
          currentTarget = _arg1.currentTarget;
          i = $(currentTarget.parentNode.parentNode);
          return i.prev().before(i);
        });
        item.on('click', '.icon-x', function(_arg1) {
          var currentTarget;
          currentTarget = _arg1.currentTarget;
          return $(currentTarget.parentNode.parentNode).remove();
        });
        return item;
      };

      return DependencyPane;

    })(View),
    info: DepInfoPane = (function() {
      function DepInfoPane(command) {
        var id, keys, name, pid, value, values, _i, _key, _len, _ref1, _ref2;
        this.element = document.createElement('div');
        this.element.classList.add('module');
        keys = document.createElement('div');
        values = document.createElement('div');
        _ref1 = command.modifier.dependency.list;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          _ref2 = _ref1[_i], pid = _ref2[0], id = _ref2[1], name = _ref2[2];
          _key = document.createElement('div');
          _key.classList.add('text-padded');
          _key.innerText = "Dependency " + pid + ":" + id + ":";
          value = document.createElement('div');
          value.classList.add('text-padded');
          value.innerText = name;
          keys.appendChild(_key);
          values.appendChild(value);
        }
        _key = document.createElement('div');
        _key.classList.add('text-padded');
        _key.innerText = 'Abort on resolve error:';
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command.modifier.dependency.abort);
        keys.appendChild(_key);
        values.appendChild(value);
        this.element.appendChild(keys);
        this.element.appendChild(values);
      }

      return DepInfoPane;

    })(),
    "in": function(queue) {
      return new Promise(function(resolve, reject) {
        var projects;
        projects = {};
        return new Promise(function(resolve, reject) {
          return resolveQueue(queue.queue, [], projects, resolve, reject);
        }).then((function(q) {
          var key, key2, _i, _j, _len, _len1, _ref1, _ref2;
          queue.queue = q;
          _ref1 = Object.keys(projects);
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            key = _ref1[_i];
            _ref2 = Object.keys(projects[key]);
            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
              key2 = _ref2[_j];
              projects[key][key2].destroy();
            }
          }
          return resolve();
        }), function(e) {
          var key, key2, _i, _j, _len, _len1, _ref1, _ref2;
          _ref1 = Object.keys(projects);
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            key = _ref1[_i];
            _ref2 = Object.keys(projects[key]);
            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
              key2 = _ref2[_j];
              projects[key][key2].destroy();
            }
          }
          return reject(e);
        });
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9tb2RpZmllci9kZXBlbmRlbmN5LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtSUFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBZ0IsT0FBQSxDQUFRLHNCQUFSLENBQWhCLEVBQUMsU0FBQSxDQUFELEVBQUksVUFBQSxFQUFKLEVBQVEsWUFBQSxJQUFSLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLElBSFYsQ0FBQTs7QUFBQSxFQUlBLE9BQUEsR0FBVSxJQUpWLENBQUE7O0FBQUEsRUFLQSxLQUFBLEdBQVEsSUFMUixDQUFBOztBQUFBLEVBT0EsWUFBQSxHQUFlLFNBQUMsS0FBRCxFQUFRLENBQVIsRUFBVyxRQUFYLEVBQXFCLE9BQXJCLEVBQThCLE1BQTlCLEdBQUE7QUFDYixRQUFBLENBQUE7QUFBQSxJQUFBLElBQXlCLG1DQUF6QjtBQUFBLGFBQU8sT0FBQSxDQUFRLENBQVIsQ0FBUCxDQUFBO0tBQUE7V0FDQSxtQkFBQSxDQUFvQixDQUFwQixFQUF1QixFQUF2QixFQUEyQixRQUEzQixDQUFvQyxDQUFDLElBQXJDLENBQTBDLENBQUMsU0FBQyxLQUFELEdBQUE7YUFBVyxZQUFBLENBQWEsS0FBYixFQUFvQixDQUFDLENBQUMsTUFBRixDQUFTLEtBQUssQ0FBQyxPQUFOLENBQUEsQ0FBVCxDQUFwQixFQUErQyxRQUEvQyxFQUF5RCxPQUF6RCxFQUFrRSxNQUFsRSxFQUFYO0lBQUEsQ0FBRCxDQUExQyxFQUFrSSxNQUFsSSxFQUZhO0VBQUEsQ0FQZixDQUFBOztBQUFBLEVBV0EsbUJBQUEsR0FBc0IsU0FBQyxPQUFELEVBQVUs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

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/modifier/dependency.coffee
