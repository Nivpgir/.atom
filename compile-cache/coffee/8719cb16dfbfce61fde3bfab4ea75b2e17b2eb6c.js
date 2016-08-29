(function() {
  var Command, CommandEditPane, CompositeDisposable, EnvironmentModules, Input, LinterList, ModifierModules, OutputModules, ProfileModules, Project, ProviderModules, SettingsView, StreamModifierModules, path, _ref;

  Input = require('./provider/input');

  Command = require('./provider/command');

  Project = require('./provider/project');

  LinterList = null;

  _ref = [], ProfileModules = _ref[0], OutputModules = _ref[1], ModifierModules = _ref[2], ProviderModules = _ref[3], StreamModifierModules = _ref[4], EnvironmentModules = _ref[5];

  CompositeDisposable = require('atom').CompositeDisposable;

  CommandEditPane = null;

  SettingsView = null;

  path = null;

  module.exports = {
    subscriptions: null,
    activate: function(state) {
      Input.activate();
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'build-tools:third-command': function() {
          return Input.key(2);
        },
        'build-tools:second-command': function() {
          return Input.key(1);
        },
        'build-tools:first-command': function() {
          return Input.key(0);
        },
        'build-tools:third-command-ask': function() {
          return Input.keyAsk(2);
        },
        'build-tools:second-command-ask': function() {
          return Input.keyAsk(1);
        },
        'build-tools:first-command-ask': function() {
          return Input.keyAsk(0);
        },
        'build-tools:commands': function() {
          return Input.selection();
        },
        'core:cancel': function() {
          return Input.cancel();
        }
      }));
      this.subscriptions.add(atom.views.addViewProvider(Command, function(command) {
        command.oldname = command.name;
        if (CommandEditPane == null) {
          CommandEditPane = require('./view/command-edit-pane');
        }
        return new CommandEditPane(command);
      }));
      return this.subscriptions.add(atom.workspace.addOpener(function(uritoopen) {
        if (uritoopen.endsWith('.build-tools.cson')) {
          if (path == null) {
            path = require('path');
          }
          if (SettingsView == null) {
            SettingsView = require('./view/settings-view');
          }
          return new SettingsView(path.dirname(uritoopen), uritoopen);
        }
      }));
    },
    deactivate: function() {
      this.subscriptions.dispose();
      (ModifierModules != null ? ModifierModules : require('./modifier/modifier')).reset();
      (ProviderModules != null ? ProviderModules : require('./provider/provider')).reset();
      (StreamModifierModules != null ? StreamModifierModules : require('./stream-modifiers/modifiers')).reset();
      (OutputModules != null ? OutputModules : require('./output/output')).reset();
      (EnvironmentModules != null ? EnvironmentModules : require('./environment/environment')).reset();
      Input.deactivate();
      ModifierModules = null;
      ProviderModules = null;
      StreamModifierModules = null;
      EnvironmentModules = null;
      OutputModules = null;
      CommandEditPane = null;
      return SettingsView = null;
    },
    provideLinter: function() {
      return {
        name: 'build-tools',
        grammarScopes: ['*'],
        scope: 'project',
        lintOnFly: false,
        lint: function() {
          if (LinterList == null) {
            LinterList = require('./linter-list');
          }
          return LinterList.messages;
        }
      };
    },
    provideInput: function() {
      if (ModifierModules == null) {
        ModifierModules = require('./modifier/modifier');
      }
      if (ProfileModules == null) {
        ProfileModules = require('./profiles/profiles');
      }
      if (ProviderModules == null) {
        ProviderModules = require('./provider/provider');
      }
      if (StreamModifierModules == null) {
        StreamModifierModules = require('./stream-modifiers/modifiers');
      }
      if (EnvironmentModules == null) {
        EnvironmentModules = require('./environment/environment');
      }
      if (OutputModules == null) {
        OutputModules = require('./output/output');
      }
      return {
        Input: Input,
        ModifierModules: ModifierModules,
        ProfileModules: ProfileModules,
        ProviderModules: ProviderModules,
        StreamModifierModules: StreamModifierModules,
        OutputModules: OutputModules,
        EnvironmentModules: EnvironmentModules
      };
    },
    provideConsole: function() {
      (OutputModules != null ? OutputModules : OutputModules = require('./output/output')).activate('console');
      return OutputModules.modules.console.provideConsole();
    },
    consumeModifierModule: function(_arg) {
      var key, mod;
      key = _arg.key, mod = _arg.mod;
      if (ModifierModules == null) {
        ModifierModules = require('./modifier/modifier');
      }
      return ModifierModules.addModule(key, mod);
    },
    consumeProfileModuleV1: function(_arg) {
      var key, profile;
      key = _arg.key, profile = _arg.profile;
      if (ProfileModules == null) {
        ProfileModules = require('./profiles/profiles');
      }
      return ProfileModules.addProfile(key, profile);
    },
    consumeProfileModuleV2: function(_arg) {
      var key, profile;
      key = _arg.key, profile = _arg.profile;
      if (ProfileModules == null) {
        ProfileModules = require('./profiles/profiles');
      }
      return ProfileModules.addProfile(key, profile, 2);
    },
    consumeProfileModuleV3: function(profiles) {
      var disp, key, profile;
      if (ProfileModules == null) {
        ProfileModules = require('./profiles/profiles');
      }
      disp = new CompositeDisposable;
      for (key in profiles) {
        profile = profiles[key];
        disp.add(ProfileModules.addProfile(key, profile, 2));
      }
      return disp;
    },
    consumeProviderModule: function(_arg) {
      var key, mod;
      key = _arg.key, mod = _arg.mod;
      if (ProviderModules == null) {
        ProviderModules = require('./provider/provider');
      }
      return ProviderModules.addModule(key, mod);
    },
    consumeEnvironmentModule: function(_arg) {
      var key, mod;
      key = _arg.key, mod = _arg.mod;
      if (EnvironmentModules == null) {
        EnvironmentModules = require('./environment/environment');
      }
      return EnvironmentModules.addModule(key, mod);
    },
    consumeStreamModifier: function(_arg) {
      var key, mod;
      key = _arg.key, mod = _arg.mod;
      if (StreamModifierModules == null) {
        StreamModifierModules = require('./stream-modifiers/modifiers');
      }
      return StreamModifierModules.addModule(key, mod);
    },
    consumeOutputModule: function(_arg) {
      var key, mod;
      key = _arg.key, mod = _arg.mod;
      if (OutputModules == null) {
        OutputModules = require('./output/output');
      }
      return OutputModules.addModule(key, mod);
    },
    config: {
      CloseOnSuccess: {
        title: 'Close console on success',
        description: 'Value is used in command settings. 0 to hide console on success, >0 to hide console after x seconds',
        type: 'integer',
        "default": 3
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrTUFBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsa0JBQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxvQkFBUixDQURWLENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQVUsT0FBQSxDQUFRLG9CQUFSLENBRlYsQ0FBQTs7QUFBQSxFQUlBLFVBQUEsR0FBYSxJQUpiLENBQUE7O0FBQUEsRUFLQSxPQUErRyxFQUEvRyxFQUFDLHdCQUFELEVBQWlCLHVCQUFqQixFQUFnQyx5QkFBaEMsRUFBaUQseUJBQWpELEVBQWtFLCtCQUFsRSxFQUF5Riw0QkFMekYsQ0FBQTs7QUFBQSxFQU9DLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFQRCxDQUFBOztBQUFBLEVBU0EsZUFBQSxHQUFrQixJQVRsQixDQUFBOztBQUFBLEVBVUEsWUFBQSxHQUFlLElBVmYsQ0FBQTs7QUFBQSxFQVlBLElBQUEsR0FBTyxJQVpQLENBQUE7O0FBQUEsRUFjQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxhQUFBLEVBQWUsSUFBZjtBQUFBLElBRUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxLQUFLLENBQUMsUUFBTixDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQURqQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNqQjtBQUFBLFFBQUEsMkJBQUEsRUFBNkIsU0FBQSxH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

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/main.coffee
