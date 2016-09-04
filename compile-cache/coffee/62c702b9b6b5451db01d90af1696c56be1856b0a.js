(function() {
  var $, $$, CSON, RegexEditPane, RegexInfoPane, RegexModifier, TextEditorView, View, XRegExp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  XRegExp = null;

  CSON = null;

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  module.exports = {
    name: 'Regular Expression',
    activate: function() {
      XRegExp = require('xregexp').XRegExp;
      return CSON = require('season');
    },
    deactivate: function() {
      XRegExp = null;
      return CSON = null;
    },
    info: RegexInfoPane = (function() {
      function RegexInfoPane(command, config) {
        var key, keys, value, values;
        this.element = document.createElement('div');
        this.element.classList.add('module');
        keys = document.createElement('div');
        values = document.createElement('div');
        key = document.createElement('div');
        key.classList.add('text-padded');
        key.innerText = 'Regular Expression:';
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = config.regex;
        keys.appendChild(key);
        values.appendChild(value);
        key = document.createElement('div');
        key.classList.add('text-padded');
        key.innerText = 'Default Values:';
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = config.defaults;
        keys.appendChild(key);
        values.appendChild(value);
        this.element.appendChild(keys);
        this.element.appendChild(values);
      }

      return RegexInfoPane;

    })(),
    edit: RegexEditPane = (function(_super) {
      __extends(RegexEditPane, _super);

      function RegexEditPane() {
        return RegexEditPane.__super__.constructor.apply(this, arguments);
      }

      RegexEditPane.content = function() {
        return this.div({
          "class": 'panel-body padded'
        }, (function(_this) {
          return function() {
            _this.div({
              "class": 'block'
            }, function() {
              _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Regular Expression');
                return _this.div(function() {
                  _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Enter XRegExp string. The XRegExp object will use ');
                  _this.span({
                    "class": 'inline-block highlight'
                  }, 'xni');
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, ' flags. Refer to the internet (including this package\'s wiki) for details.');
                });
              });
              return _this.subview('regex', new TextEditorView({
                mini: true
              }));
            });
            return _this.div({
              "class": 'block'
            }, function() {
              _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Hardcoded values');
                return _this.div(function() {
                  _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Enter CSON string with default properties. To highlight an error you need at least a ');
                  _this.span({
                    "class": 'inline-block highlight'
                  }, 'type');
                  _this.span({
                    "class": 'inline-block text-subtle'
                  }, ' field. Linter messages require at least ');
                  _this.span({
                    "class": 'inline-block highlight'
                  }, 'type');
                  _this.span({
                    "class": 'inline-block text-subtle'
                  }, ', ');
                  _this.span({
                    "class": 'inline-block highlight'
                  }, 'file');
                  _this.span({
                    "class": 'inline-block text-subtle'
                  }, ', ');
                  _this.span({
                    "class": 'inline-block highlight'
                  }, 'row');
                  _this.span({
                    "class": 'inline-block text-subtle'
                  }, ' and ');
                  _this.span({
                    "class": 'inline-block highlight'
                  }, 'message');
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, ' fields.');
                });
              });
              return _this.subview('default', new TextEditorView({
                mini: true
              }));
            });
          };
        })(this));
      };

      RegexEditPane.prototype.set = function(command, config) {
        if (command != null) {
          this.regex.getModel().setText(config.regex);
          return this["default"].getModel().setText(config.defaults);
        } else {
          this.regex.getModel().setText('');
          return this["default"].getModel().setText('');
        }
      };

      RegexEditPane.prototype.get = function(command, stream) {
        if (this.regex.getModel().getText() === '') {
          return 'Regular expression must not be empty';
        }
        command[stream].pipeline.push({
          name: 'regex',
          config: {
            regex: this.regex.getModel().getText(),
            defaults: this["default"].getModel().getText()
          }
        });
        return null;
      };

      return RegexEditPane;

    })(View),
    modifier: RegexModifier = (function() {
      function RegexModifier(config, command, output) {
        this.config = config;
        this.command = command;
        this.output = output;
        this.regex = new XRegExp(this.config.regex, 'xni');
        this["default"] = {};
        if ((this.config.defaults != null) && this.config.defaults !== '') {
          this["default"] = CSON.parse(this.config.defaults);
        }
      }

      RegexModifier.prototype.modify = function(_arg) {
        var k, m, match, perm, temp, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3;
        temp = _arg.temp, perm = _arg.perm;
        if ((m = this.regex.xexec(temp.input)) != null) {
          match = {};
          _ref1 = Object.keys(this["default"]);
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            k = _ref1[_i];
            match[k] = this["default"][k];
          }
          _ref2 = Object.keys(m);
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            k = _ref2[_j];
            if (m[k] != null) {
              match[k] = m[k];
            }
          }
          _ref3 = Object.keys(match);
          for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
            k = _ref3[_k];
            temp[k] = perm[k] = match[k];
          }
        }
        return null;
      };

      RegexModifier.prototype.getFiles = function(_arg) {
        var end, file, perm, start, temp;
        temp = _arg.temp, perm = _arg.perm;
        if (temp.file == null) {
          return [];
        }
        start = temp.input.indexOf(temp.file);
        end = start + temp.file.length - 1;
        file = this.output.absolutePath(temp.file);
        if (file == null) {
          return [];
        }
        return [
          {
            file: file,
            start: start,
            end: end,
            row: temp.row,
            col: temp.col
          }
        ];
      };

      return RegexModifier;

    })()
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9zdHJlYW0tbW9kaWZpZXJzL3JlZ2V4LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2RkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBQSxHQUFVLElBQVYsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxJQURQLENBQUE7O0FBQUEsRUFFQSxPQUFnQyxPQUFBLENBQVEsc0JBQVIsQ0FBaEMsRUFBQyxTQUFBLENBQUQsRUFBSSxVQUFBLEVBQUosRUFBUSxzQkFBQSxjQUFSLEVBQXdCLFlBQUEsSUFGeEIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7QUFBQSxJQUFBLElBQUEsRUFBTSxvQkFBTjtBQUFBLElBRUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBQWtCLENBQUMsT0FBN0IsQ0FBQTthQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUixFQUZDO0lBQUEsQ0FGVjtBQUFBLElBTUEsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsT0FBQSxHQUFVLElBQVYsQ0FBQTthQUNBLElBQUEsR0FBTyxLQUZHO0lBQUEsQ0FOWjtBQUFBLElBVUEsSUFBQSxFQUNRO0FBQ1MsTUFBQSx1QkFBQyxPQUFELEVBQVUsTUFBVixHQUFBO0FBQ1gsWUFBQSx3QkFBQTtBQUFBLFFBQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFYLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLFFBQXZCLENBREEsQ0FBQTtBQUFBLFFBRUEsSUFBQSxHQUFPLFFB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

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/stream-modifiers/regex.coffee
