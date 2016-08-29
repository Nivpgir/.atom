(function() {
  var $, $$, Command, CommandPane, CompositeDisposable, HighlightingPane, MainPane, Modifiers, Outputs, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, View = _ref.View;

  CompositeDisposable = require('atom').CompositeDisposable;

  Modifiers = require('../modifier/modifier');

  Outputs = require('../output/output');

  Command = require('../provider/command');

  MainPane = require('./command-edit-main-pane');

  HighlightingPane = require('./command-edit-highlighting-pane');

  module.exports = CommandPane = (function(_super) {
    __extends(CommandPane, _super);

    function CommandPane() {
      this.cancel = __bind(this.cancel, this);
      this.accept = __bind(this.accept, this);
      return CommandPane.__super__.constructor.apply(this, arguments);
    }

    CommandPane.content = function() {
      return this.div({
        "class": 'commandview'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'buttons'
          }, function() {
            _this.div({
              "class": 'btn btn-sm btn-error icon icon-x inline-block-tight'
            }, 'Cancel');
            return _this.div({
              "class": 'btn btn-sm btn-primary icon icon-check inline-block-tight'
            }, 'Accept');
          });
          return _this.div({
            "class": '_panes',
            outlet: 'panes_view'
          });
        };
      })(this));
    };

    CommandPane.prototype.initialize = function(command) {
      this.command = command;
      return this.blacklist = [];
    };

    CommandPane.prototype.destroy = function() {
      this.blacklist = null;
      this.success_callback = null;
      return this.cancel_callback = null;
    };

    CommandPane.prototype.setCallbacks = function(success_callback, cancel_callback) {
      this.success_callback = success_callback;
      this.cancel_callback = cancel_callback;
    };

    CommandPane.prototype.setBlacklist = function(blacklist) {
      this.blacklist = blacklist;
    };

    CommandPane.prototype.setSource = function(sourceFile) {
      this.sourceFile = sourceFile;
    };

    CommandPane.prototype.detached = function() {
      var item, _i, _len, _ref1, _ref2;
      this.removeEventHandlers();
      _ref1 = this.panes;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        item = _ref1[_i];
        if ((_ref2 = item.view) != null) {
          if (typeof _ref2.destroy === "function") {
            _ref2.destroy();
          }
        }
      }
      this.panes = null;
      return this.panes_view.empty();
    };

    CommandPane.prototype.attached = function() {
      this.panes = [];
      if (__indexOf.call(this.blacklist, 'general') < 0) {
        this.buildPane(new MainPane, 'General', 'icon-gear');
      }
      if (__indexOf.call(this.blacklist, 'modifiers') < 0) {
        this.initializeModifierModules();
      }
      if (__indexOf.call(this.blacklist, 'highlighting') < 0) {
        this.buildPane(new HighlightingPane, 'Highlighting', 'icon-eye');
      }
      if (__indexOf.call(this.blacklist, 'outputs') < 0) {
        this.initializeOutputModules();
      }
      this.addEventHandlers();
      return this.initializePanes();
    };

    CommandPane.prototype.buildPane = function(view, name, icon, key, desc, enabled, moveable) {
      var item;
      if (desc == null) {
        desc = '';
      }
      if (moveable == null) {
        moveable = false;
      }
      item = $$(function() {
        return this.div({
          "class": 'inset-panel'
        }, (function(_this) {
          return function() {
            var c;
            c = 'panel-heading top';
            if (key != null) {
              c += ' module';
            }
            return _this.div({
              "class": c
            }, function() {
              if (key != null) {
                _this.div({
                  "class": 'checkbox align'
                }, function() {
                  _this.input({
                    id: key,
                    type: 'checkbox'
                  });
                  return _this.label(function() {
                    _this.div({
                      "class": "settings-name icon " + icon
                    }, name);
                    return _this.div(function() {
                      return _this.span({
                        "class": 'inline-block text-subtle'
                      }, desc);
                    });
                  });
                });
                if (moveable) {
                  return _this.div({
                    "class": 'align'
                  }, function() {
                    _this.div({
                      "class": 'icon-triangle-up'
                    });
                    return _this.div({
                      "class": 'icon-triangle-down'
                    });
                  });
                }
              } else {
                return _this.span({
                  "class": "settings-name icon " + icon
                }, name);
              }
            });
          };
        })(this));
      });
      if (view.element != null) {
        item.append(view.element);
      }
      if (key != null) {
        item.find('input').prop('checked', enabled);
        if (view.element != null) {
          if (!enabled) {
            view.element.classList.add('hidden');
          }
          item.children()[0].children[0].children[0].onchange = function() {
            var _ref1, _ref2;
            if (this.checked) {
              return (_ref1 = this.parentNode.parentNode.parentNode.children[1]) != null ? _ref1.classList.remove('hidden') : void 0;
            } else {
              return (_ref2 = this.parentNode.parentNode.parentNode.children[1]) != null ? _ref2.classList.add('hidden') : void 0;
            }
          };
        }
        if (moveable) {
          item.on('click', '.panel-heading .align .icon-triangle-up', (function(_this) {
            return function(event) {
              var index, pane, _i, _len, _ref1, _results;
              _ref1 = _this.panes;
              _results = [];
              for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
                pane = _ref1[index];
                if (pane.key === key) {
                  _this.moveModifierUp(index);
                  event.stopPropagation();
                  break;
                } else {
                  _results.push(void 0);
                }
              }
              return _results;
            };
          })(this));
          item.on('click', '.panel-heading .align .icon-triangle-down', (function(_this) {
            return function(event) {
              var index, pane, _i, _len, _ref1, _results;
              _ref1 = _this.panes;
              _results = [];
              for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
                pane = _ref1[index];
                if (pane.key === key) {
                  _this.moveModifierDown(index);
                  event.stopPropagation();
                  break;
                } else {
                  _results.push(void 0);
                }
              }
              return _results;
            };
          })(this));
        }
      }
      this.panes_view.append(item);
      this.panes.push({
        pane: item,
        view: view,
        key: key
      });
      return {
        pane: item,
        view: view
      };
    };

    CommandPane.prototype.initializeModifierModules = function() {
      var key, mod, rest, _i, _j, _len, _len1, _ref1, _ref2, _ref3, _ref4, _ref5, _results;
      this.modifier_count = 0;
      _ref2 = Object.keys((_ref1 = this.command.modifier) != null ? _ref1 : {});
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        key = _ref2[_i];
        if (__indexOf.call(this.blacklist, key) >= 0) {
          continue;
        }
        if (Modifiers.activate(key) !== true) {
          continue;
        }
        mod = Modifiers.modules[key];
        if (mod["private"]) {
          continue;
        }
        this.modifier_count = this.modifier_count + 1;
        this.buildPane(new mod.edit, "Modifier: " + mod.name, 'icon-pencil', key, mod.description, ((_ref3 = this.command.modifier) != null ? _ref3[key] : void 0) != null, true);
      }
      if (Object.keys((_ref4 = this.command.modifier) != null ? _ref4 : {}).length === 0) {
        rest = Object.keys(Modifiers.modules);
      } else {
        rest = Object.keys(Modifiers.modules).filter((function(_this) {
          return function(key) {
            var _ref5;
            return !(__indexOf.call(Object.keys((_ref5 = _this.command.modifier) != null ? _ref5 : {}), key) >= 0);
          };
        })(this));
      }
      _results = [];
      for (_j = 0, _len1 = rest.length; _j < _len1; _j++) {
        key = rest[_j];
        if (__indexOf.call(this.blacklist, key) >= 0) {
          continue;
        }
        if (Modifiers.activate(key) !== true) {
          continue;
        }
        mod = Modifiers.modules[key];
        if (mod["private"]) {
          continue;
        }
        this.modifier_count = this.modifier_count + 1;
        _results.push(this.buildPane(new mod.edit, "Modifier: " + mod.name, 'icon-pencil', key, mod.description, ((_ref5 = this.command.modifier) != null ? _ref5[key] : void 0) != null, true));
      }
      return _results;
    };

    CommandPane.prototype.initializeOutputModules = function() {
      var key, mod, _i, _len, _ref1, _ref2, _results;
      _ref1 = Object.keys(Outputs.modules);
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        key = _ref1[_i];
        if (__indexOf.call(this.blacklist, key) >= 0) {
          continue;
        }
        if (Outputs.activate(key) !== true) {
          continue;
        }
        mod = Outputs.modules[key];
        if (mod["private"]) {
          continue;
        }
        _results.push(this.buildPane(new mod.edit, "Output: " + mod.name, 'icon-terminal', key, mod.description, ((_ref2 = this.command.output) != null ? _ref2[key] : void 0) != null));
      }
      return _results;
    };

    CommandPane.prototype.moveModifierUp = function(index) {
      var e;
      if ((index === 1) || (index > this.modifier_count)) {
        return false;
      }
      e = this.panes.splice(index, 1)[0];
      this.panes.splice(index - 1, 0, e);
      return $(this.panes_view.children()[index - 1]).before(e.pane);
    };

    CommandPane.prototype.moveModifierDown = function(index) {
      var e;
      if (index >= this.modifier_count) {
        return false;
      }
      e = this.panes.splice(index + 1, 1)[0];
      this.panes.splice(index, 0, e);
      return $(this.panes_view.children()[index]).before(e.pane);
    };

    CommandPane.prototype.removeEventHandlers = function() {
      this.off('click', '.checkbox label');
      this.off('click', '.buttons .icon-x');
      this.off('click', '.buttons .icon-check');
      return this.disposables.dispose();
    };

    CommandPane.prototype.addEventHandlers = function() {
      this.on('click', '.checkbox label', function(e) {
        var item, _base;
        item = $(e.currentTarget.parentNode.children[0]);
        item.prop('checked', !item.prop('checked'));
        return typeof (_base = item[0]).onchange === "function" ? _base.onchange() : void 0;
      });
      this.on('click', '.buttons .icon-x', this.cancel);
      this.on('click', '.buttons .icon-check', this.accept);
      this.disposables = new CompositeDisposable;
      return this.disposables.add(atom.commands.add(this.element, {
        'core:confirm': this.accept,
        'core:cancel': this.cancel
      }));
    };

    CommandPane.prototype.initializePanes = function() {
      var command, view, _i, _len, _ref1, _results;
      _ref1 = this.panes;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        view = _ref1[_i].view;
        if (this.command.oldname != null) {
          command = this.command;
        } else {
          command = null;
        }
        _results.push(view != null ? typeof view.set === "function" ? view.set(command, this.sourceFile) : void 0 : void 0);
      }
      return _results;
    };

    CommandPane.prototype.accept = function(event) {
      var c, key, p, pane, ret, view, _i, _len, _ref1, _ref2, _ref3, _ref4;
      c = new Command;
      c.project = this.command.project;
      _ref1 = this.panes;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        _ref2 = _ref1[_i], pane = _ref2.pane, view = _ref2.view, key = _ref2.key;
        if ((p = pane.children()[0].children[0].children[0]) != null) {
          if (p.checked) {
            if ((ret = view.get(c)) != null) {
              if ((_ref3 = atom.notifications) != null) {
                _ref3.addError("Error in '" + key + "' module: " + ret);
              }
              event.stopPropagation();
              return;
            }
          }
        } else {
          if ((ret = view.get(c)) != null) {
            if ((_ref4 = atom.notifications) != null) {
              _ref4.addError(ret);
            }
            event.stopPropagation();
            return;
          }
        }
      }
      this.success_callback(c, this.command.oldname);
      return this.cancel(event);
    };

    CommandPane.prototype.cancel = function(event) {
      if (typeof this.cancel_callback === "function") {
        this.cancel_callback();
      }
      return event.stopPropagation();
    };

    return CommandPane;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi92aWV3L2NvbW1hbmQtZWRpdC1wYW5lLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0R0FBQTtJQUFBOzs7eUpBQUE7O0FBQUEsRUFBQSxPQUFnQixPQUFBLENBQVEsc0JBQVIsQ0FBaEIsRUFBQyxTQUFBLENBQUQsRUFBSSxVQUFBLEVBQUosRUFBUSxZQUFBLElBQVIsQ0FBQTs7QUFBQSxFQUVDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFGRCxDQUFBOztBQUFBLEVBSUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxzQkFBUixDQUpaLENBQUE7O0FBQUEsRUFLQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGtCQUFSLENBTFYsQ0FBQTs7QUFBQSxFQU9BLE9BQUEsR0FBVSxPQUFBLENBQVEscUJBQVIsQ0FQVixDQUFBOztBQUFBLEVBU0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSwwQkFBUixDQVRYLENBQUE7O0FBQUEsRUFVQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsa0NBQVIsQ0FWbkIsQ0FBQTs7QUFBQSxFQVlBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFFSixrQ0FBQSxDQUFBOzs7Ozs7S0FBQTs7QUFBQSxJQUFBLFdBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLGFBQVA7T0FBTCxFQUEyQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3pCLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLFNBQVA7V0FBTCxFQUF1QixTQUFBLEdBQUE7QUFDckIsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8scURBQVA7YUFBTCxFQUFtRSxRQUFuRSxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLDJEQUFQO2FBQUwsRUFBeUUsUUFBekUsRUFGcUI7VUFBQSxDQUF2QixDQUFBLENBQUE7aUJBR0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLFFBQVA7QUFBQSxZQUFpQixNQUFBLEVBQVEsWUFBekI7V0FBTCxFQUp5QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNCLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsMEJBT0EsVUFBQSxHQUFZLFNBQUUsT0FBRixHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsVUFBQSxPQUNaLENBQUE7YUFBQSxJQUFDLENBQUEsU0FBRCxHQUFhLEdBREg7SUFBQSxDQVBaLENBQUE7O0FBQUEsMEJBVUEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFiLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQURwQixDQUFBO2FBRUEsSUFBQyxDQUFBLGVBQUQsR0FBbUIsS0FIWjtJQUFBLENBVlQsQ0FBQTs7QUFBQSwwQkFlQSxZQUFBLEdBQWMsU0FBRSxnQkFBRixFQUFxQixlQUFyQixHQUFBO0FBQXVDLE1BQXRDLElBQUMsQ0FBQSxtQkFBQSxnQkFBcUMsQ0FBQTtBQUFBLE1BQW5CLElBQUMsQ0FBQSxrQkFBQSxlQUFrQixDQUF2QztJQUFBLENBZmQsQ0FBQTs7QUFBQSwwQkFpQkEsWUFBQSxHQUFjLFNBQUUsU0FBRixHQUFBO0FBQWMsTUFBYixJQUFDLENBQUEsWUFBQSxTQUFZLENBQWQ7SUFBQSxDQWpCZCxDQUFBOztBQUFBLDBCQW1CQSxTQUFBLEdBQVcsU0FBRSxVQUFGLEdBQUE7QUFBZSxNQUFkLElBQUMsQ0FBQSxhQUFBLFVBQWEsQ0FBZjtJQUFBLENBbkJYLENBQUE7O0FBQUEsMEJBcUJBLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixVQUFBLDRCQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsbUJBQUQsQ0FBQSxDQUFBLENBQUE7QUFDQTtBQUFBLFdBQUEsNENBQUE7eUJBQUE7OztpQkFDVyxDQUFFOztTQURiO0FBQUEsT0FEQTtBQUFBLE1BR0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUhULENBQUE7YUFJQSxJQUFDLENBQUEsVUFBVSxDQUFDLEtBQVosQ0FBQSxFQUxRO0lBQUEsQ0FyQlYsQ0FBQTs7QUFBQSwwQkE0QkEsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxFQUFULENBQUE7QUFFQSxNQUFBLElBQXdELGVBQWEsSUFBQyxDQUFBLFNBQWQsRUFBQSxTQUFBLEtBQXhEO0FBQUEsUUFBQSxJQUFDLENBQUEsU0FBRCxDQUFXLEdBQUEsQ0FBQSxRQUFYLEVBQXlCLFNBQXpCLEVBQW9DLFdBQXBDLENBQUEsQ0FBQTtPQUZBO0FBR0EsTUFBQSxJQUFvQyxlQUFlLElBQUMsQ0FBQSxTQUFoQixFQUFBLFdBQUEsS0FBcEM7QUFBQSxRQUFBLElBQUMsQ0FBQSx5QkFBRCxDQUFBLENBQUEsQ0FBQTtPQUhBO0FBSUEsTUFBQSxJQUFvRSxlQUFrQixJQUFDLENBQUEsU0FBbkIsRUFBQSxjQUFBLEtBQXBFO0FBQUEsUUFBQSxJQUFDLENBQUEsU0FBRCxDQUFXLEdBQUEsQ0FBQSxnQkFBWCxFQUFpQyxjQUFqQyxFQUFpRCxVQUFqRCxDQUFBLENBQUE7T0FKQTtBQUtBLE1BQUEsSUFBa0MsZUFBYSxJQUFDLENBQUEsU0FBZCxFQUFBLFNBQUEsS0FBbEM7QUFBQSxRQUFBLElBQUMsQ0FBQSx1QkFBRCxDQUFBLENBQUEsQ0FBQTtPQUxBO0FBQUEsTUFPQSxJQUFDLENBQUEsZ0JBQUQsQ0FBQSxDQVBBLENBQUE7YUFRQSxJQUFDLENBQUEsZUFBRCxDQUFBLEVBVFE7SUFBQSxDQTVCVixDQUFBOztBQUFBLDBCQXVDQSxTQUFBLEdBQVcsU0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsR0FBbkIsRUFBd0IsSUFBeEIsRUFBbUMsT0FBbkMsRUFBNEMsUUFBNUMsR0FBQTtBQUNULFVBQUEsSUFBQTs7UUFEaUMsT0FBTztPQUN4Qzs7UUFEcUQsV0FBVztPQUNoRTtBQUFBLE1BQUEsSUFBQSxHQUFPLEVBQUEsQ0FBRyxTQUFBLEdBQUE7ZUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsVUFBQSxPQUFBLEVBQU8sYUFBUDtTQUFMLEVBQTJCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO0FBQ3pCLGdCQUFBLENBQUE7QUFBQSxZQUFBLENBQUEsR0FBSSxtQkFBSixDQUFBO0FBQ0EsWUFBQSxJQUFrQixXQUFsQjtBQUFBLGNBQUEsQ0FBQSxJQUFLLFNBQUwsQ0FBQTthQURBO21CQUVBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxDQUFQO2FBQUwsRUFBZSxTQUFBLEdBQUE7QUFDYixjQUFBLElBQUcsV0FBSDtBQUNFLGdCQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxrQkFBQSxPQUFBLEVBQU8sZ0JBQVA7aUJBQUwsRUFBOEIsU0FBQSxHQUFBO0FBQzVCLGtCQUFBLEtBQUMsQ0FBQSxLQUFELENBQU87QUFBQSxvQkFBQSxFQUFBLEVBQUksR0FBSjtBQUFBLG9CQUFTLElBQUEsRUFBTSxVQUFmO21CQUFQLENBQUEsQ0FBQTt5QkFDQSxLQUFDLENBQUEsS0FBRCxDQUFPLFNBQUEsR0FBQTtBQUNMLG9CQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxzQkFBQSxPQUFBLEVBQVEscUJBQUEsR0FBcUIsSUFBN0I7cUJBQUwsRUFBMEMsSUFBMUMsQ0FBQSxDQUFBOzJCQUNBLEtBQUMsQ0FBQSxHQUFELENBQUssU0FBQSxHQUFBOzZCQUNILEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSx3QkFBQSxPQUFBLEVBQU8sMEJBQVA7dUJBQU4sRUFBeUMsSUFBekMsRUFERztvQkFBQSxDQUFMLEVBRks7a0JBQUEsQ0FBUCxFQUY0QjtnQkFBQSxDQUE5QixDQUFBLENBQUE7QUFNQSxnQkFBQSxJQUFHLFFBQUg7eUJBQ0UsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLG9CQUFBLE9BQUEsRUFBTyxPQUFQO21CQUFMLEVBQXFCLFNBQUEsR0FBQTtBQUNuQixvQkFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsc0JBQUEsT0FBQSxFQUFPLGtCQUFQO3FCQUFMLENBQUEsQ0FBQTsyQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsc0JBQUEsT0FBQSxFQUFPLG9CQUFQO3FCQUFMLEVBRm1CO2tCQUFBLENBQXJCLEVBREY7aUJBUEY7ZUFBQSxNQUFBO3VCQVlFLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxrQkFBQSxPQUFBLEVBQVEscUJBQUEsR0FBcUIsSUFBN0I7aUJBQU4sRUFBMkMsSUFBM0MsRUFaRjtlQURhO1lBQUEsQ0FBZixFQUh5QjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNCLEVBRFE7TUFBQSxDQUFILENBQVAsQ0FBQTtBQWtCQSxNQUFBLElBQTRCLG9CQUE1QjtBQUFBLFFBQUEsSUFBSSxDQUFDLE1BQUwsQ0FBWSxJQUFJLENBQUMsT0FBakIsQ0FBQSxDQUFBO09BbEJBO0FBbUJBLE1BQUEsSUFBRyxXQUFIO0FBQ0UsUUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsQ0FBa0IsQ0FBQyxJQUFuQixDQUF3QixTQUF4QixFQUFtQyxPQUFuQyxDQUFBLENBQUE7QUFDQSxRQUFBLElBQUcsb0JBQUg7QUFDRSxVQUFBLElBQUEsQ0FBQSxPQUFBO0FBQUEsWUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUF2QixDQUEyQixRQUEzQixDQUFBLENBQUE7V0FBQTtBQUFBLFVBQ0EsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFnQixDQUFBLENBQUEsQ0FBRSxDQUFDLFFBQVMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxRQUFTLENBQUEsQ0FBQSxDQUFFLENBQUMsUUFBM0MsR0FBc0QsU0FBQSxHQUFBO0FBQ3BELGdCQUFBLFlBQUE7QUFBQSxZQUFBLElBQUcsSUFBQyxDQUFBLE9BQUo7Z0dBQytDLENBQUUsU0FBUyxDQUFDLE1BQXpELENBQWdFLFFBQWhFLFdBREY7YUFBQSxNQUFBO2dHQUcrQyxDQUFFLFNBQVMsQ0FBQyxHQUF6RCxDQUE2RCxRQUE3RCxXQUhGO2FBRG9EO1VBQUEsQ0FEdEQsQ0FERjtTQURBO0FBUUEsUUFBQSxJQUFHLFFBQUg7QUFDRSxVQUFBLElBQUksQ0FBQyxFQUFMLENBQVEsT0FBUixFQUFpQix5Q0FBakIsRUFBNEQsQ0FBQSxTQUFBLEtBQUEsR0FBQTttQkFBQSxTQUFDLEtBQUQsR0FBQTtBQUMxRCxrQkFBQSxzQ0FBQTtBQUFBO0FBQUE7bUJBQUEsNERBQUE7b0NBQUE7QUFDRSxnQkFBQSxJQUFHLElBQUksQ0FBQyxHQUFMLEtBQVksR0FBZjtBQUNFLGtCQUFBLEtBQUMsQ0FBQSxjQUFELENBQWdCLEtBQWhCLENBQUEsQ0FBQTtBQUFBLGtCQUNBLEtBQUssQ0FBQyxlQUFOLENBQUEsQ0FEQSxDQUFBO0FBRUEsd0JBSEY7aUJBQUEsTUFBQTt3Q0FBQTtpQkFERjtBQUFBOzhCQUQwRDtZQUFBLEVBQUE7VUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVELENBQUEsQ0FBQTtBQUFBLFVBTUEsSUFBSSxDQUFDLEVBQUwsQ0FBUSxPQUFSLEVBQWlCLDJDQUFqQixFQUE4RCxDQUFBLFNBQUEsS0FBQSxHQUFBO21CQUFBLFNBQUMsS0FBRCxHQUFBO0FBQzVELGtCQUFBLHNDQUFBO0FBQUE7QUFBQTttQkFBQSw0REFBQTtvQ0FBQTtBQUNFLGdCQUFBLElBQUcsSUFBSSxDQUFDLEdBQUwsS0FBWSxHQUFmO0FBQ0Usa0JBQUEsS0FBQyxDQUFBLGdCQUFELENBQWtCLEtBQWxCLENBQUEsQ0FBQTtBQUFBLGtCQUNBLEtBQUssQ0FBQyxlQUFOLENBQUEsQ0FEQSxDQUFBO0FBRUEsd0JBSEY7aUJBQUEsTUFBQTt3Q0FBQTtpQkFERjtBQUFBOzhCQUQ0RDtZQUFBLEVBQUE7VUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlELENBTkEsQ0FERjtTQVRGO09BbkJBO0FBQUEsTUF5Q0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxNQUFaLENBQW1CLElBQW5CLENBekNBLENBQUE7QUFBQSxNQTBDQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBWTtBQUFBLFFBQUEsSUFBQSxFQUFNLElBQU47QUFBQSxRQUFZLElBQUEsRUFBTSxJQUFsQjtBQUFBLFFBQXdCLEdBQUEsRUFBSyxHQUE3QjtPQUFaLENBMUNBLENBQUE7QUEyQ0EsYUFBTztBQUFBLFFBQUEsSUFBQSxFQUFNLElBQU47QUFBQSxRQUFZLElBQUEsRUFBTSxJQUFsQjtPQUFQLENBNUNTO0lBQUEsQ0F2Q1gsQ0FBQTs7QUFBQSwwQkFxRkEseUJBQUEsR0FBMkIsU0FBQSxHQUFBO0FBQ3pCLFVBQUEsZ0ZBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxjQUFELEdBQWtCLENBQWxCLENBQUE7QUFDQTtBQUFBLFdBQUEsNENBQUE7d0JBQUE7QUFDRSxRQUFBLElBQVksZUFBTyxJQUFDLENBQUEsU0FBUixFQUFBLEdBQUEsTUFBWjtBQUFBLG1CQUFBO1NBQUE7QUFDQSxRQUFBLElBQWdCLFNBQVMsQ0FBQyxRQUFWLENBQW1CLEdBQW5CLENBQUEsS0FBMkIsSUFBM0M7QUFBQSxtQkFBQTtTQURBO0FBQUEsUUFFQSxHQUFBLEdBQU0sU0FBUyxDQUFDLE9BQVEsQ0FBQSxHQUFBLENBRnhCLENBQUE7QUFHQSxRQUFBLElBQVksR0FBRyxDQUFDLFNBQUQsQ0FBZjtBQUFBLG1CQUFBO1NBSEE7QUFBQSxRQUlBLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUMsQ0FBQSxjQUFELEdBQWtCLENBSnBDLENBQUE7QUFBQSxRQUtBLElBQUMsQ0FBQSxTQUFELENBQVcsR0FBQSxDQUFBLEdBQU8sQ0FBQyxJQUFuQixFQUEwQixZQUFBLEdBQVksR0FBRyxDQUFDLElBQTFDLEVBQWtELGFBQWxELEVBQWlFLEdBQWpFLEVBQXNFLEdBQUcsQ0FBQyxXQUExRSxFQUF1Rix1RUFBdkYsRUFBaUgsSUFBakgsQ0FMQSxDQURGO0FBQUEsT0FEQTtBQVNBLE1BQUEsSUFBRyxNQUFNLENBQUMsSUFBUCxtREFBZ0MsRUFBaEMsQ0FBbUMsQ0FBQyxNQUFwQyxLQUE4QyxDQUFqRDtBQUNFLFFBQUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxJQUFQLENBQVksU0FBUyxDQUFDLE9BQXRCLENBQVAsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLElBQUEsR0FBTyxNQUFNLENBQUMsSUFBUCxDQUFZLFNBQVMsQ0FBQyxPQUF0QixDQUE4QixDQUFDLE1BQS9CLENBQXNDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxHQUFELEdBQUE7QUFDM0MsZ0JBQUEsS0FBQTttQkFBQSxDQUFBLENBQUssZUFBTyxNQUFNLENBQUMsSUFBUCxvREFBZ0MsRUFBaEMsQ0FBUCxFQUFBLEdBQUEsTUFBRCxFQUR1QztVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRDLENBQVAsQ0FIRjtPQVRBO0FBZUE7V0FBQSw2Q0FBQTt1QkFBQTtBQUNFLFFBQUEsSUFBWSxlQUFPLElBQUMsQ0FBQSxTQUFSLEVBQUEsR0FBQSxNQUFaO0FBQUEsbUJBQUE7U0FBQTtBQUNBLFFBQUEsSUFBZ0IsU0FBUyxDQUFDLFFBQVYsQ0FBbUIsR0FBbkIsQ0FBQSxLQUEyQixJQUEzQztBQUFBLG1CQUFBO1NBREE7QUFBQSxRQUVBLEdBQUEsR0FBTSxTQUFTLENBQUMsT0FBUSxDQUFBLEdBQUEsQ0FGeEIsQ0FBQTtBQUdBLFFBQUEsSUFBWSxHQUFHLENBQUMsU0FBRCxDQUFmO0FBQUEsbUJBQUE7U0FIQTtBQUFBLFFBSUEsSUFBQyxDQUFBLGNBQUQsR0FBa0IsSUFBQyxDQUFBLGNBQUQsR0FBa0IsQ0FKcEMsQ0FBQTtBQUFBLHNCQUtBLElBQUMsQ0FBQSxTQUFELENBQVcsR0FBQSxDQUFBLEdBQU8sQ0FBQyxJQUFuQixFQUEwQixZQUFBLEdBQVksR0FBRyxDQUFDLElBQTFDLEVBQWtELGFBQWxELEVBQWlFLEdBQWpFLEVBQXNFLEdBQUcsQ0FBQyxXQUExRSxFQUF1Rix1RUFBdkYsRUFBaUgsSUFBakgsRUFMQSxDQURGO0FBQUE7c0JBaEJ5QjtJQUFBLENBckYzQixDQUFBOztBQUFBLDBCQTZHQSx1QkFBQSxHQUF5QixTQUFBLEdBQUE7QUFDdkIsVUFBQSwwQ0FBQTtBQUFBO0FBQUE7V0FBQSw0Q0FBQTt3QkFBQTtBQUNFLFFBQUEsSUFBWSxlQUFPLElBQUMsQ0FBQSxTQUFSLEVBQUEsR0FBQSxNQUFaO0FBQUEsbUJBQUE7U0FBQTtBQUNBLFFBQUEsSUFBZ0IsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsR0FBakIsQ0FBQSxLQUF5QixJQUF6QztBQUFBLG1CQUFBO1NBREE7QUFBQSxRQUVBLEdBQUEsR0FBTSxPQUFPLENBQUMsT0FBUSxDQUFBLEdBQUEsQ0FGdEIsQ0FBQTtBQUdBLFFBQUEsSUFBWSxHQUFHLENBQUMsU0FBRCxDQUFmO0FBQUEsbUJBQUE7U0FIQTtBQUFBLHNCQUlBLElBQUMsQ0FBQSxTQUFELENBQVcsR0FBQSxDQUFBLEdBQU8sQ0FBQyxJQUFuQixFQUEwQixVQUFBLEdBQVUsR0FBRyxDQUFDLElBQXhDLEVBQWdELGVBQWhELEVBQWlFLEdBQWpFLEVBQXNFLEdBQUcsQ0FBQyxXQUExRSxFQUF1RixxRUFBdkYsRUFKQSxDQURGO0FBQUE7c0JBRHVCO0lBQUEsQ0E3R3pCLENBQUE7O0FBQUEsMEJBcUhBLGNBQUEsR0FBZ0IsU0FBQyxLQUFELEdBQUE7QUFDZCxVQUFBLENBQUE7QUFBQSxNQUFBLElBQWdCLENBQUMsS0FBQSxLQUFTLENBQVYsQ0FBQSxJQUFnQixDQUFDLEtBQUEsR0FBUSxJQUFDLENBQUEsY0FBVixDQUFoQztBQUFBLGVBQU8sS0FBUCxDQUFBO09BQUE7QUFBQSxNQUNBLENBQUEsR0FBSSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBYyxLQUFkLEVBQXFCLENBQXJCLENBQXdCLENBQUEsQ0FBQSxDQUQ1QixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBYyxLQUFBLEdBQVEsQ0FBdEIsRUFBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsQ0FGQSxDQUFBO2FBR0EsQ0FBQSxDQUFFLElBQUMsQ0FBQSxVQUFVLENBQUMsUUFBWixDQUFBLENBQXVCLENBQUEsS0FBQSxHQUFRLENBQVIsQ0FBekIsQ0FBb0MsQ0FBQyxNQUFyQyxDQUE0QyxDQUFDLENBQUMsSUFBOUMsRUFKYztJQUFBLENBckhoQixDQUFBOztBQUFBLDBCQTJIQSxnQkFBQSxHQUFrQixTQUFDLEtBQUQsR0FBQTtBQUNoQixVQUFBLENBQUE7QUFBQSxNQUFBLElBQWlCLEtBQUEsSUFBUyxJQUFDLENBQUEsY0FBM0I7QUFBQSxlQUFPLEtBQVAsQ0FBQTtPQUFBO0FBQUEsTUFDQSxDQUFBLEdBQUksSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLENBQWMsS0FBQSxHQUFRLENBQXRCLEVBQXlCLENBQXpCLENBQTRCLENBQUEsQ0FBQSxDQURoQyxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBYyxLQUFkLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCLENBRkEsQ0FBQTthQUdBLENBQUEsQ0FBRSxJQUFDLENBQUEsVUFBVSxDQUFDLFFBQVosQ0FBQSxDQUF1QixDQUFBLEtBQUEsQ0FBekIsQ0FBZ0MsQ0FBQyxNQUFqQyxDQUF3QyxDQUFDLENBQUMsSUFBMUMsRUFKZ0I7SUFBQSxDQTNIbEIsQ0FBQTs7QUFBQSwwQkFpSUEsbUJBQUEsR0FBcUIsU0FBQSxHQUFBO0FBQ25CLE1BQUEsSUFBQyxDQUFBLEdBQUQsQ0FBSyxPQUFMLEVBQWMsaUJBQWQsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsR0FBRCxDQUFLLE9BQUwsRUFBYyxrQkFBZCxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxHQUFELENBQUssT0FBTCxFQUFjLHNCQUFkLENBRkEsQ0FBQTthQUdBLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBLEVBSm1CO0lBQUEsQ0FqSXJCLENBQUE7O0FBQUEsMEJBdUlBLGdCQUFBLEdBQWtCLFNBQUEsR0FBQTtBQUNoQixNQUFBLElBQUMsQ0FBQSxFQUFELENBQUksT0FBSixFQUFhLGlCQUFiLEVBQWdDLFNBQUMsQ0FBRCxHQUFBO0FBQzlCLFlBQUEsV0FBQTtBQUFBLFFBQUEsSUFBQSxHQUFPLENBQUEsQ0FBRSxDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxRQUFTLENBQUEsQ0FBQSxDQUF0QyxDQUFQLENBQUE7QUFBQSxRQUNBLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixDQUFBLElBQVEsQ0FBQyxJQUFMLENBQVUsU0FBVixDQUF6QixDQURBLENBQUE7dUVBRU8sQ0FBQyxvQkFIc0I7TUFBQSxDQUFoQyxDQUFBLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxFQUFELENBQUksT0FBSixFQUFhLGtCQUFiLEVBQWlDLElBQUMsQ0FBQSxNQUFsQyxDQUxBLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxFQUFELENBQUksT0FBSixFQUFhLHNCQUFiLEVBQXFDLElBQUMsQ0FBQSxNQUF0QyxDQU5BLENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxXQUFELEdBQWUsR0FBQSxDQUFBLG1CQVJmLENBQUE7YUFVQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxPQUFuQixFQUNmO0FBQUEsUUFBQSxjQUFBLEVBQWdCLElBQUMsQ0FBQSxNQUFqQjtBQUFBLFFBQ0EsYUFBQSxFQUFlLElBQUMsQ0FBQSxNQURoQjtPQURlLENBQWpCLEVBWGdCO0lBQUEsQ0F2SWxCLENBQUE7O0FBQUEsMEJBc0pBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsVUFBQSx3Q0FBQTtBQUFBO0FBQUE7V0FBQSw0Q0FBQSxHQUFBO0FBQ0UsUUFERyxpQkFBQSxJQUNILENBQUE7QUFBQSxRQUFBLElBQUcsNEJBQUg7QUFDRSxVQUFBLE9BQUEsR0FBVSxJQUFDLENBQUEsT0FBWCxDQURGO1NBQUEsTUFBQTtBQUdFLFVBQUEsT0FBQSxHQUFVLElBQVYsQ0FIRjtTQUFBO0FBQUEsc0VBSUEsSUFBSSxDQUFFLElBQUssU0FBUyxJQUFDLENBQUEsOEJBSnJCLENBREY7QUFBQTtzQkFEZTtJQUFBLENBdEpqQixDQUFBOztBQUFBLDBCQThKQSxNQUFBLEdBQVEsU0FBQyxLQUFELEdBQUE7QUFDTixVQUFBLGdFQUFBO0FBQUEsTUFBQSxDQUFBLEdBQUksR0FBQSxDQUFBLE9BQUosQ0FBQTtBQUFBLE1BQ0EsQ0FBQyxDQUFDLE9BQUYsR0FBWSxJQUFDLENBQUEsT0FBTyxDQUFDLE9BRHJCLENBQUE7QUFFQTtBQUFBLFdBQUEsNENBQUEsR0FBQTtBQUNFLDJCQURHLGFBQUEsTUFBTSxhQUFBLE1BQU0sWUFBQSxHQUNmLENBQUE7QUFBQSxRQUFBLElBQUcsd0RBQUg7QUFDRSxVQUFBLElBQUcsQ0FBQyxDQUFDLE9BQUw7QUFDRSxZQUFBLElBQUcsMkJBQUg7O3FCQUNvQixDQUFFLFFBQXBCLENBQThCLFlBQUEsR0FBWSxHQUFaLEdBQWdCLFlBQWhCLEdBQTRCLEdBQTFEO2VBQUE7QUFBQSxjQUNBLEtBQUssQ0FBQyxlQUFOLENBQUEsQ0FEQSxDQUFBO0FBRUEsb0JBQUEsQ0FIRjthQURGO1dBREY7U0FBQSxNQUFBO0FBT0UsVUFBQSxJQUFHLDJCQUFIOzttQkFDb0IsQ0FBRSxRQUFwQixDQUE2QixHQUE3QjthQUFBO0FBQUEsWUFDQSxLQUFLLENBQUMsZUFBTixDQUFBLENBREEsQ0FBQTtBQUVBLGtCQUFBLENBSEY7V0FQRjtTQURGO0FBQUEsT0FGQTtBQUFBLE1BY0EsSUFBQyxDQUFBLGdCQUFELENBQWtCLENBQWxCLEVBQXFCLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBOUIsQ0FkQSxDQUFBO2FBZUEsSUFBQyxDQUFBLE1BQUQsQ0FBUSxLQUFSLEVBaEJNO0lBQUEsQ0E5SlIsQ0FBQTs7QUFBQSwwQkFnTEEsTUFBQSxHQUFRLFNBQUMsS0FBRCxHQUFBOztRQUNOLElBQUMsQ0FBQTtPQUFEO2FBQ0EsS0FBSyxDQUFDLGVBQU4sQ0FBQSxFQUZNO0lBQUEsQ0FoTFIsQ0FBQTs7dUJBQUE7O0tBRndCLEtBYjVCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/view/command-edit-pane.coffee
