(function() {
  var CompositeDisposable, _,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('underscore-plus');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    subscriptions: null,
    config: {
      allBundledPackages: {
        order: 1,
        type: 'boolean',
        "default": false
      },
      bundledPackages: {
        order: 2,
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        }
      },
      exceptBundledPackages: {
        order: 3,
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        }
      },
      allCommunityPackages: {
        order: 11,
        type: 'boolean',
        "default": false
      },
      communityPackages: {
        order: 12,
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        }
      },
      exceptCommunityPackages: {
        order: 13,
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        }
      },
      prefixKeys: {
        order: 21,
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        }
      }
    },
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.disabledPackages = new Set;
      this.disabledKeyBindings = new Set;
      this.debug = atom.inDevMode() && !atom.inSpecMode();
      this.debouncedReload = _.debounce(((function(_this) {
        return function() {
          return _this.reload();
        };
      })(this)), 1000);
      this.subscriptions.add(atom.config.onDidChange('disable-keybindings', this.debouncedReload));
      this.subscriptions.add(atom.packages.onDidActivateInitialPackages((function(_this) {
        return function() {
          return _this.init();
        };
      })(this)));
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'disable-keybindings:reload': (function(_this) {
          return function() {
            return _this.reload();
          };
        })(this),
        'disable-keybindings:reset': (function(_this) {
          return function() {
            return _this.reset();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.subscriptions.dispose();
      return this.reset();
    },
    init: function() {
      this.reload();
      return this.subscriptions.add(atom.packages.onDidLoadPackage((function(_this) {
        return function(pack) {
          return _this.onLoadedPackage(pack);
        };
      })(this)));
    },
    onLoadedPackage: function(pack) {
      var activateResources;
      if (pack.settingsActivated) {
        return this.debouncedReload();
      }
      activateResources = pack.activateResources;
      return pack.activateResources = (function(_this) {
        return function() {
          activateResources.call(pack);
          pack.activateResources = activateResources;
          if (_this.debug) {
            console.log('activateResources', pack);
          }
          return _this.debouncedReload();
        };
      })(this);
    },
    reload: function() {
      var binding, oldKeyBindings, _i, _len, _ref;
      this.reset();
      this.disablePackageKeymaps();
      oldKeyBindings = atom.keymaps.keyBindings.slice();
      this.removeKeymapsByPrefixKey(atom.config.get('disable-keybindings.prefixKeys'));
      _ref = _.difference(oldKeyBindings, atom.keymaps.keyBindings);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        binding = _ref[_i];
        if (this.debug) {
          console.log('disable keyBinding', binding);
        }
        this.disabledKeyBindings.add(binding);
      }
    },
    reset: function() {
      this.disabledPackages.forEach((function(_this) {
        return function(pack) {
          pack.activateKeymaps();
          if (_this.debug) {
            return console.log("enable package keymaps: " + pack.name);
          }
        };
      })(this));
      this.disabledPackages.clear();
      this.disabledKeyBindings.forEach((function(_this) {
        return function(binding) {
          if (__indexOf.call(atom.keymaps.keyBindings, binding) < 0) {
            if (_this.debug) {
              console.log('enable keyBinding', binding);
            }
            return atom.keymaps.keyBindings.push(binding);
          }
        };
      })(this));
      return this.disabledKeyBindings.clear();
    },
    disablePackageKeymaps: function() {
      return atom.packages.getLoadedPackages().forEach((function(_this) {
        return function(pack) {
          if (!_this.isDisablePackage(pack.name)) {
            return;
          }
          pack.deactivateKeymaps();
          _this.disabledPackages.add(pack);
          if (_this.debug) {
            return console.log("disable package keymaps: " + pack.name);
          }
        };
      })(this));
    },
    isDisablePackage: function(name) {
      if (atom.packages.isBundledPackage(name)) {
        if (__indexOf.call(atom.config.get('disable-keybindings.exceptBundledPackages'), name) >= 0) {
          return false;
        }
        if (atom.config.get('disable-keybindings.allBundledPackages')) {
          return true;
        }
        return __indexOf.call(atom.config.get('disable-keybindings.bundledPackages'), name) >= 0;
      } else {
        if (__indexOf.call(atom.config.get('disable-keybindings.exceptCommunityPackages'), name) >= 0) {
          return false;
        }
        if (atom.config.get('disable-keybindings.allCommunityPackages')) {
          return true;
        }
        return __indexOf.call(atom.config.get('disable-keybindings.communityPackages'), name) >= 0;
      }
    },
    removeKeymapsByPrefixKey: function(prefixKey) {
      var k, keystrokesWithSpace, _i, _len;
      if (Array.isArray(prefixKey)) {
        for (_i = 0, _len = prefixKey.length; _i < _len; _i++) {
          k = prefixKey[_i];
          this.removeKeymapsByPrefixKey(k);
        }
        return;
      }
      keystrokesWithSpace = prefixKey + ' ';
      return atom.keymaps.keyBindings = atom.keymaps.keyBindings.filter(function(binding) {
        return binding.keystrokes.indexOf(keystrokesWithSpace) !== 0;
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2Rpc2FibGUta2V5YmluZGluZ3MvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNCQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsYUFBQSxFQUFlLElBQWY7QUFBQSxJQUVBLE1BQUEsRUFDRTtBQUFBLE1BQUEsa0JBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLENBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsS0FGVDtPQURGO0FBQUEsTUFLQSxlQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxDQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sT0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEVBRlQ7QUFBQSxRQUdBLEtBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLFFBQU47U0FKRjtPQU5GO0FBQUEsTUFZQSxxQkFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sQ0FBUDtBQUFBLFFBQ0EsSUFBQSxFQUFNLE9BRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxFQUZUO0FBQUEsUUFHQSxLQUFBLEVBQ0U7QUFBQSxVQUFBLElBQUEsRUFBTSxRQUFOO1NBSkY7T0FiRjtBQUFBLE1BbUJBLG9CQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxFQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEtBRlQ7T0FwQkY7QUFBQSxNQXdC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

//# sourceURL=/C:/Users/nivp/.atom/packages/disable-keybindings/lib/main.coffee
