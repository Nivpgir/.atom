(function() {
  var ActivatePowerMode, CompositeDisposable, configSchema, powerEditor;

  CompositeDisposable = require("atom").CompositeDisposable;

  configSchema = require("./config-schema");

  powerEditor = require("./power-editor");

  module.exports = ActivatePowerMode = {
    config: configSchema,
    subscriptions: null,
    active: false,
    powerEditor: powerEditor,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add("atom-workspace", {
        "activate-power-mode:toggle": (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        "activate-power-mode:enable": (function(_this) {
          return function() {
            return _this.enable();
          };
        })(this),
        "activate-power-mode:disable": (function(_this) {
          return function() {
            return _this.disable();
          };
        })(this)
      }));
      if (this.getConfig("autoToggle")) {
        return this.toggle();
      }
    },
    deactivate: function() {
      var _ref;
      if ((_ref = this.subscriptions) != null) {
        _ref.dispose();
      }
      this.active = false;
      return this.powerEditor.disable();
    },
    getConfig: function(config) {
      return atom.config.get("activate-power-mode." + config);
    },
    toggle: function() {
      if (this.active) {
        return this.disable();
      } else {
        return this.enable();
      }
    },
    enable: function() {
      this.active = true;
      return this.powerEditor.enable();
    },
    disable: function() {
      this.active = false;
      return this.powerEditor.disable();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvYWN0aXZhdGUtcG93ZXItbW9kZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUVBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FGZixDQUFBOztBQUFBLEVBR0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUhkLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUFpQixpQkFBQSxHQUNmO0FBQUEsSUFBQSxNQUFBLEVBQVEsWUFBUjtBQUFBLElBQ0EsYUFBQSxFQUFlLElBRGY7QUFBQSxJQUVBLE1BQUEsRUFBUSxLQUZSO0FBQUEsSUFHQSxXQUFBLEVBQWEsV0FIYjtBQUFBLElBS0EsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2pCO0FBQUEsUUFBQSw0QkFBQSxFQUErQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQjtBQUFBLFFBQ0EsNEJBQUEsRUFBK0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEL0I7QUFBQSxRQUVBLDZCQUFBLEVBQStCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxPQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRi9CO09BRGlCLENBQW5CLENBRkEsQ0FBQTtBQU9BLE1BQUEsSUFBRyxJQUFDLENBQUEsU0FBRCxDQUFXLFlBQVgsQ0FBSDtlQUNFLElBQUMsQ0FBQSxNQUFELENBQUEsRUFERjtPQVJRO0lBQUEsQ0FMVjtBQUFBLElBZ0JBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixVQUFBLElBQUE7O1lBQWMsQ0FBRSxPQUFoQixDQUFBO09BQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFELEdBQVUsS0FEVixDQUFBO2FBRUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUEsRUFIVTtJQUFBLENBaEJaO0FBQUEsSUFxQkEsU0FBQSxFQUFXLFNBQUMsTUFBRCxHQUFBO2FBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWlCLHNCQUFBLEdBQXNCLE1BQXZDLEVBRFM7SUFBQSxDQXJCWDtBQUFBLElBd0JBLE1BQUEsRUFBUSxTQUFBLEdBQUE7QUFDTixNQUFBLElBQUcsSUFBQyxDQUFBLE1BQUo7ZUFBZ0IsSUFBQyxDQUFBLE9BQUQsQ0FBQSxFQUFoQjtPQUFBLE1BQUE7ZUFBZ0MsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQUFoQztPQURNO0lBQUEsQ0F4QlI7QUFBQSxJQTJCQSxNQUFBLEVBQVEsU0FBQSxHQUFBO0FBQ04sTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQVYsQ0FBQTthQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBYixDQUFBLEVBRk07SUFBQSxDQTNCUjtBQUFBLElBK0JBLE9BQUEsRUFBUyxTQUFBLEdBQUE7QUFDUCxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsS0FBVixDQUFBO2FBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUEsRUFGTztJQUFBLENBL0JUO0dBTkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/C:/Users/MNP/.atom/packages/activate-power-mode/lib/activate-power-mode.coffee
