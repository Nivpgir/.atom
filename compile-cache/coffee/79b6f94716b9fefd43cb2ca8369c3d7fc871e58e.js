(function() {
  var Modifiers, Outputs, Profiles, Providers, TestPane, TestProfile, TestProvider, TestProviderView, main, testModifier, testOutput, testProfile, testProvider;

  Profiles = require('../lib/profiles/profiles');

  Outputs = require('../lib/output/output');

  Providers = require('../lib/provider/provider');

  Modifiers = require('../lib/modifier/modifier');

  main = require('../lib/main');

  testProfile = TestProfile = (function() {
    TestProfile.profile_name = 'Test';

    TestProfile.prototype.scopes = ['text.plain'];

    TestProfile.prototype.default_extensions = ['txt'];

    TestProfile.prototype.regex_string = '^(?<file> [\\S]+\\.(?extensions)):(?<row> [\\d]+):[ ](?<message> .+)$';

    TestProfile.prototype.file_string = '(?<file> [\\S]+\\.(?extensions)):(?<row> [\\d]+)';

    function TestProfile(output) {
      this.output = output;
      this.extensions = this.output.createExtensionString(this.scopes, this.default_extensions);
      this.regex = this.output.createRegex(this.regex_string, this.extensions);
      this.regex_file = this.output.createRegex(this.file_string, this.extensions);
    }

    TestProfile.prototype.files = function(line) {
      var m, out, start;
      start = 0;
      out = [];
      while ((m = this.regex_file.xexec(line.substr(start))) != null) {
        start += m.index;
        m.start = start;
        m.end = start + m.file.length + m.row.length;
        m.col = '0';
        start = m.end + 1;
        out.push(m);
      }
      return out;
    };

    TestProfile.prototype["in"] = function(line) {
      var m;
      if ((m = this.regex.xexec(line)) != null) {
        m.type = 'error';
        this.output.print(m);
        return this.output.lint(m);
      }
    };

    return TestProfile;

  })();

  testModifier = {
    name: 'Test modifier',
    preSplit: function(command) {}
  };

  testProvider = {
    name: 'Test commands',
    model: TestProvider = (function() {
      function TestProvider() {}

      return TestProvider;

    })(),
    view: TestProviderView = (function() {
      function TestProviderView() {}

      return TestProviderView;

    })()
  };

  testOutput = {
    name: 'Test Output',
    description: 'Test Output',
    "private": false,
    edit: TestPane = (function() {
      function TestPane() {}

      TestPane.prototype.set = function(command) {};

      TestPane.prototype.get = function(command) {};

      return TestPane;

    })()
  };

  describe('Linter Service', function() {
    return it('has all necessary properties', function() {
      var provider;
      provider = main.provideLinter();
      expect(provider.grammarScopes).toBeDefined();
      expect(provider.scope).toBeDefined();
      expect(provider.lintOnFly).toBeDefined();
      return expect(provider.lint).toBeDefined();
    });
  });

  describe('Input Service', function() {
    return it('has all necessary properties', function() {
      var obj;
      obj = main.provideInput();
      expect(obj.Input).toBe(require('../lib/provider/input'));
      expect(obj.ProviderModules).toBe(Providers);
      expect(obj.ProfileModules).toBe(Profiles);
      expect(obj.OutputModules).toBe(Outputs);
      return expect(obj.ModifierModules).toBe(Modifiers);
    });
  });

  describe('Profile Service', function() {
    var disp;
    disp = [][0];
    beforeEach(function() {
      return disp = main.consumeProfileModuleV1({
        key: 'test',
        profile: testProfile
      });
    });
    afterEach(function() {
      Profiles.reset();
      return disp = null;
    });
    it('returns a disposable', function() {
      var Disposable;
      Disposable = require('atom').Disposable;
      return expect(disp instanceof Disposable).toBeTruthy();
    });
    it('adds the profile with all necessary properties', function() {
      expect(Profiles.profiles['test']).toBeDefined();
      expect(Profiles.profiles['test'].profile_name).toBe('Test');
      return expect(Profiles.profiles['test'].prototype.scopes).toEqual(['text.plain']);
    });
    return describe('when disposing the profile disposable', function() {
      return it('removes the profile', function() {
        disp.dispose();
        return expect(Profiles.profiles['test']).toBeUndefined();
      });
    });
  });

  describe('Output Service', function() {
    var disp;
    disp = [][0];
    beforeEach(function() {
      testOutput.activate = jasmine.createSpy('activate');
      testOutput.deactivate = jasmine.createSpy('deactivate');
      return disp = main.consumeOutputModule({
        key: 'test',
        mod: testOutput
      });
    });
    afterEach(function() {
      Outputs.reset();
      return disp = null;
    });
    it('returns a disposable', function() {
      var Disposable;
      Disposable = require('atom').Disposable;
      return expect(disp instanceof Disposable).toBeTruthy();
    });
    it('adds the module with all necessary properties', function() {
      expect(Outputs.modules['test']).toBeDefined();
      return expect(Outputs.modules['test'].name).toBe('Test Output');
    });
    describe('when activating the module', function() {
      beforeEach(function() {
        return Outputs.activate('test');
      });
      it('calls activate', function() {
        return expect(testOutput.activate).toHaveBeenCalled();
      });
      it('sets the active flag', function() {
        return expect(testOutput.active).toBe(true);
      });
      return describe('when deactivating the module', function() {
        beforeEach(function() {
          return Outputs.deactivate('test');
        });
        it('calls deactivate', function() {
          return expect(testOutput.deactivate).toHaveBeenCalled();
        });
        return it('unsets the active flag', function() {
          return expect(testOutput.active).toBe(null);
        });
      });
    });
    return describe('when disposing the module disposable', function() {
      beforeEach(function() {
        testOutput.active = true;
        return disp.dispose();
      });
      it('removes the module', function() {
        return expect(Outputs.modules['test']).toBeUndefined();
      });
      return it('calls deactivate', function() {
        return expect(testOutput.deactivate).toHaveBeenCalled();
      });
    });
  });

  describe('Modifier Service', function() {
    var disp;
    disp = [][0];
    beforeEach(function() {
      testModifier.activate = jasmine.createSpy('activate');
      testModifier.deactivate = jasmine.createSpy('deactivate');
      return disp = main.consumeModifierModule({
        key: 'test',
        mod: testModifier
      });
    });
    afterEach(function() {
      Modifiers.reset();
      return disp = null;
    });
    it('returns a disposable', function() {
      var Disposable;
      Disposable = require('atom').Disposable;
      return expect(disp instanceof Disposable).toBeTruthy();
    });
    it('adds the module with all necessary properties', function() {
      expect(Modifiers.modules['test']).toBeDefined();
      return expect(Modifiers.modules['test'].name).toBe('Test modifier');
    });
    describe('when activating the module', function() {
      beforeEach(function() {
        return Modifiers.activate('test');
      });
      it('calls activate', function() {
        return expect(testModifier.activate).toHaveBeenCalled();
      });
      it('sets the active flag', function() {
        return expect(testModifier.active).toBe(true);
      });
      return describe('when deactivating the module', function() {
        beforeEach(function() {
          return Modifiers.deactivate('test');
        });
        it('calls deactivate', function() {
          return expect(testModifier.deactivate).toHaveBeenCalled();
        });
        return it('unsets the active flag', function() {
          return expect(testModifier.active).toBe(null);
        });
      });
    });
    return describe('when disposing the module disposable', function() {
      beforeEach(function() {
        testModifier.active = true;
        return disp.dispose();
      });
      it('removes the module', function() {
        return expect(Modifiers.modules['test']).toBeUndefined();
      });
      return it('calls deactivate', function() {
        return expect(testModifier.deactivate).toHaveBeenCalled();
      });
    });
  });

  describe('Provider Service', function() {
    var disp;
    disp = [][0];
    beforeEach(function() {
      testProvider.activate = jasmine.createSpy('activate');
      testProvider.deactivate = jasmine.createSpy('deactivate');
      return disp = main.consumeProviderModule({
        key: 'test',
        mod: testProvider
      });
    });
    afterEach(function() {
      Providers.reset();
      return disp = null;
    });
    it('returns a disposable', function() {
      var Disposable;
      Disposable = require('atom').Disposable;
      return expect(disp instanceof Disposable).toBeTruthy();
    });
    it('adds the module with all necessary properties', function() {
      expect(Providers.modules['test']).toBeDefined();
      return expect(Providers.modules['test'].name).toBe('Test commands');
    });
    describe('when activating the module', function() {
      beforeEach(function() {
        return Providers.activate('test');
      });
      it('calls activate', function() {
        return expect(testProvider.activate).toHaveBeenCalled();
      });
      it('sets the active flag', function() {
        return expect(testProvider.active).toBe(true);
      });
      return describe('when deactivating the module', function() {
        beforeEach(function() {
          return Providers.deactivate('test');
        });
        it('calls deactivate', function() {
          return expect(testProvider.deactivate).toHaveBeenCalled();
        });
        return it('unsets the active flag', function() {
          return expect(testProvider.active).toBe(null);
        });
      });
    });
    return describe('when disposing the module disposable', function() {
      beforeEach(function() {
        testProvider.active = true;
        return disp.dispose();
      });
      it('removes the module', function() {
        return expect(Providers.modules['test']).toBeUndefined();
      });
      return it('calls deactivate', function() {
        return expect(testProvider.deactivate).toHaveBeenCalled();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL3NwZWMvc2VydmljZS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5SkFBQTs7QUFBQSxFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsMEJBQVIsQ0FBWCxDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxzQkFBUixDQURWLENBQUE7O0FBQUEsRUFFQSxTQUFBLEdBQVksT0FBQSxDQUFRLDBCQUFSLENBRlosQ0FBQTs7QUFBQSxFQUdBLFNBQUEsR0FBWSxPQUFBLENBQVEsMEJBQVIsQ0FIWixDQUFBOztBQUFBLEVBSUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxhQUFSLENBSlAsQ0FBQTs7QUFBQSxFQU1BLFdBQUEsR0FDUTtBQUNKLElBQUEsV0FBQyxDQUFBLFlBQUQsR0FBZSxNQUFmLENBQUE7O0FBQUEsMEJBRUEsTUFBQSxHQUFRLENBQUMsWUFBRCxDQUZSLENBQUE7O0FBQUEsMEJBSUEsa0JBQUEsR0FBb0IsQ0FBQyxLQUFELENBSnBCLENBQUE7O0FBQUEsMEJBTUEsWUFBQSxHQUFjLHVFQU5kLENBQUE7O0FBQUEsMEJBVUEsV0FBQSxHQUFhLGtEQVZiLENBQUE7O0FBY2EsSUFBQSxxQkFBRSxNQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsTUFBTSxDQUFDLHFCQUFSLENBQThCLElBQUMsQ0FBQSxNQUEvQixFQUF1QyxJQUFDLENBQUEsa0JBQXhDLENBQWQsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsQ0FBb0IsSUFBQyxDQUFBLFlBQXJCLEVBQW1DLElBQUMs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

//# sourceURL=/home/niv/.atom/packages/build-tools/spec/service-spec.coffee
