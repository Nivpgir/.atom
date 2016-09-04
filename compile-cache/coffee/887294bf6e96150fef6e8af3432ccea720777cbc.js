(function() {
  var Console, CustomTab, Emitter, Tab;

  Tab = require('./tab');

  CustomTab = require('./custom-tab');

  Emitter = require('atom').Emitter;

  module.exports = Console = (function() {
    function Console() {
      this.tabs = {};
      this.emitter = new Emitter;
      this.activeTab = null;
    }

    Console.prototype.destroy = function() {
      var k, k2, _i, _j, _len, _len1, _ref, _ref1;
      this.emitter.dispose();
      _ref = Object.keys(this.tabs);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        k = _ref[_i];
        _ref1 = Object.keys(this.tabs[k]);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          k2 = _ref1[_j];
          this.removeTab(this.tabs[k][k2]);
        }
      }
      this.tabs = {};
      return this.emitter = null;
    };

    Console.prototype.getTab = function(command) {
      var tab, _ref;
      if ((tab = (_ref = this.tabs[command.project]) != null ? _ref[command.name] : void 0) != null) {
        return tab;
      }
      return this.createTab(command);
    };

    Console.prototype.getCustomTab = function(name) {
      var tab, _ref;
      if ((tab = (_ref = this.tabs['custom']) != null ? _ref[name] : void 0) != null) {
        return tab;
      }
      return this.createCustomTab(name);
    };

    Console.prototype.createTab = function(command) {
      var tab, _base, _name;
      if ((_base = this.tabs)[_name = command.project] == null) {
        _base[_name] = {};
      }
      tab = this.tabs[command.project][command.name] = new Tab(command);
      tab.onClose((function(_this) {
        return function() {
          return _this.removeTab(tab);
        };
      })(this));
      tab.focus = (function(_this) {
        return function() {
          return _this.focusTab(tab);
        };
      })(this);
      tab.console = this;
      this.emitter.emit('add', tab);
      return tab;
    };

    Console.prototype.createCustomTab = function(name) {
      var tab, _base;
      if ((_base = this.tabs)['custom'] == null) {
        _base['custom'] = {};
      }
      tab = this.tabs.custom[name] = new CustomTab(name);
      tab.onClose((function(_this) {
        return function() {
          return _this.removeTab(tab);
        };
      })(this));
      tab.focus = (function(_this) {
        return function() {
          return _this.focusTab(tab);
        };
      })(this);
      tab.console = this;
      this.emitter.emit('add', tab);
      return tab;
    };

    Console.prototype.removeTab = function(tab) {
      this.emitter.emit('remove', tab);
      if (tab === this.activeTab) {
        this.activeTab = null;
      }
      if (tab.command != null) {
        delete this.tabs[tab.command.project][tab.command.name];
      } else {
        delete this.tabs.custom[tab.name];
      }
      return tab.destroy();
    };

    Console.prototype.focusTab = function(tab) {
      this.activeTab = tab;
      return this.emitter.emit('focus', tab);
    };

    Console.prototype.onFocusTab = function(callback) {
      return this.emitter.on('focus', callback);
    };

    Console.prototype.onCreateTab = function(callback) {
      return this.emitter.on('add', callback);
    };

    Console.prototype.onRemoveTab = function(callback) {
      return this.emitter.on('remove', callback);
    };

    return Console;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9jb25zb2xlL2NvbnNvbGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdDQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxPQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQURaLENBQUE7O0FBQUEsRUFHQyxVQUFXLE9BQUEsQ0FBUSxNQUFSLEVBQVgsT0FIRCxDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNTLElBQUEsaUJBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxFQUFSLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BRFgsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUZiLENBRFc7SUFBQSxDQUFiOztBQUFBLHNCQUtBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLHVDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLE9BQVQsQ0FBQSxDQUFBLENBQUE7QUFDQTtBQUFBLFdBQUEsMkNBQUE7cUJBQUE7QUFDRTtBQUFBLGFBQUEsOENBQUE7eUJBQUE7QUFDRSxVQUFBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBQyxDQUFBLElBQUssQ0FBQSxDQUFBLENBQUcsQ0FBQSxFQUFBLENBQXBCLENBQUEsQ0FERjtBQUFBLFNBREY7QUFBQSxPQURBO0FBQUEsTUFJQSxJQUFDLENBQUEsSUFBRCxHQUFRLEVBSlIsQ0FBQTthQUtBLElBQUMsQ0FBQSxPQUFELEdBQVcsS0FOSjtJQUFBLENBTFQsQ0FBQTs7QUFBQSxzQkFhQSxNQUFBLEdBQVEs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

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/console/console.coffee
