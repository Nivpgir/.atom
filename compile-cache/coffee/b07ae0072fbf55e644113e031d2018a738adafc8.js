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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvZGlzYWJsZS1rZXliaW5kaW5ncy9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0JBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0Msc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQURELENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxhQUFBLEVBQWUsSUFBZjtBQUFBLElBRUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxrQkFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sQ0FBUDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxLQUZUO09BREY7QUFBQSxNQUtBLGVBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLENBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxPQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsRUFGVDtBQUFBLFFBR0EsS0FBQSxFQUNFO0FBQUEsVUFBQSxJQUFBLEVBQU0sUUFBTjtTQUpGO09BTkY7QUFBQSxNQVlBLHFCQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxDQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sT0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEVBRlQ7QUFBQSxRQUdBLEtBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLFFBQU47U0FKRjtPQWJGO0FBQUEsTUFtQkEsb0JBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLEVBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsS0FGVDtPQXBCRjtBQUFBLE1Bd0JB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

//# sourceURL=/C:/Users/MNP/.atom/packages/disable-keybindings/lib/main.coffee
