(function() {
  var EnvInfoPane, EnvPane, TextEditorView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), TextEditorView = _ref.TextEditorView, View = _ref.View;

  module.exports = {
    name: 'Environment Variables',
    description: 'Add/Change environment variables. Each line has the format "VARIABLE=VALUE". One variable per line',
    "private": false,
    edit: EnvPane = (function(_super) {
      __extends(EnvPane, _super);

      function EnvPane() {
        return EnvPane.__super__.constructor.apply(this, arguments);
      }

      EnvPane.content = function() {
        return this.div({
          "class": 'panel-body padded'
        }, (function(_this) {
          return function() {
            return _this.subview('env', new TextEditorView());
          };
        })(this));
      };

      EnvPane.prototype.set = function(command) {
        var key, _i, _len, _ref1, _ref2, _results;
        if ((command != null ? command.modifier.env : void 0) != null) {
          _ref2 = Object.keys((_ref1 = command.modifier.env) != null ? _ref1 : {});
          _results = [];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            key = _ref2[_i];
            _results.push(this.env.getModel().insertText("" + key + "=" + command.modifier.env[key] + "\n"));
          }
          return _results;
        } else {
          return this.env.getModel().setText('');
        }
      };

      EnvPane.prototype.get = function(command) {
        var key, l, value, _i, _len, _ref1;
        command.modifier.env = {};
        _ref1 = this.env.getModel().getText().split('\n');
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          l = _ref1[_i];
          if (l.trim() === '') {
            continue;
          }
          key = l.split('=')[0];
          if (key.length === 0) {
            return 'No variable name found';
          }
          value = l.substr(key.length + 1);
          command.modifier.env[key] = value;
        }
        return null;
      };

      return EnvPane;

    })(View),
    info: EnvInfoPane = (function() {
      function EnvInfoPane(command) {
        var key, keys, value, values, _i, _key, _len, _ref1;
        this.element = document.createElement('div');
        this.element.classList.add('module');
        keys = document.createElement('div');
        values = document.createElement('div');
        _ref1 = Object.keys(command.modifier.env);
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          key = _ref1[_i];
          _key = document.createElement('div');
          _key.classList.add('text-padded');
          _key.innerText = "" + key + " = ";
          value = document.createElement('div');
          value.classList.add('text-padded');
          value.innerText = command.modifier.env[key];
          keys.appendChild(_key);
          values.appendChild(value);
        }
        this.element.appendChild(keys);
        this.element.appendChild(values);
      }

      return EnvInfoPane;

    })(),
    preSplit: function(command) {
      var k, _i, _len, _ref1;
      command.env = {};
      _ref1 = Object.keys(command.modifier.env);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        k = _ref1[_i];
        command.env[k] = command.modifier.env[k];
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9tb2RpZmllci9lbnYuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUF5QixPQUFBLENBQVEsc0JBQVIsQ0FBekIsRUFBQyxzQkFBQSxjQUFELEVBQWlCLFlBQUEsSUFBakIsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7QUFBQSxJQUFBLElBQUEsRUFBTSx1QkFBTjtBQUFBLElBQ0EsV0FBQSxFQUFhLG9HQURiO0FBQUEsSUFFQSxTQUFBLEVBQVMsS0FGVDtBQUFBLElBSUEsSUFBQSxFQUNRO0FBRUosZ0NBQUEsQ0FBQTs7OztPQUFBOztBQUFBLE1BQUEsT0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7ZUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsVUFBQSxPQUFBLEVBQU8sbUJBQVA7U0FBTCxFQUFpQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFDL0IsS0FBQyxDQUFBLE9BQUQsQ0FBUyxLQUFULEVBQW9CLElBQUEsY0FBQSxDQUFBLENBQXBCLEVBRCtCO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakMsRUFEUTtNQUFBLENBQVYsQ0FBQTs7QUFBQSx3QkFJQSxHQUFBLEdBQUssU0FBQyxPQUFELEdBQUE7QUFDSCxZQUFBLHFDQUFBO0FBQUEsUUFBQSxJQUFHLHlEQUFIO0FBQ0U7QUFBQTtlQUFBLDRDQUFBOzRCQUFBO0FBQ0UsMEJBQUEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLFVBQWhCLENBQTJCLEVBQUEsR0FBRyxHQUFILEdBQU8sR0FBUCxHQUFVLE9BQU8sQ0FBQyxR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

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/modifier/env.coffee
