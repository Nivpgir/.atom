(function() {
  var Modifier, Profiles, TestProfile, XRegExp, testProfileV1, testProfileV2;

  Modifier = require('../lib/stream-modifiers/profile');

  Profiles = require('../lib/profiles/profiles');

  XRegExp = require('xregexp').XRegExp;

  testProfileV1 = TestProfile = (function() {
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

  testProfileV2 = TestProfile = (function() {
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

    TestProfile.prototype["in"] = function(temp, perm) {
      var m;
      if ((m = this.regex.xexec(temp.input)) != null) {
        m.type = 'error';
        this.output.print(m);
        this.output.lint(m);
        return 1;
      }
      return null;
    };

    return TestProfile;

  })();

  describe('Stream Modifier - Highlighting Profile', function() {
    var config, disp1, disp2, mod, output;
    mod = null;
    config = {
      profile: 'test'
    };
    disp1 = null;
    disp2 = null;
    output = null;
    beforeEach(function() {
      output = {
        absolutePath: jasmine.createSpy('absolutePath').andCallFake(function(p) {
          return p;
        }),
        createMessage: jasmine.createSpy('createMessage'),
        replacePrevious: jasmine.createSpy('replacePrevious'),
        print: jasmine.createSpy('print'),
        pushLinterMessage: jasmine.createSpy('pushLinterMessage'),
        createExtensionString: jasmine.createSpy('createExtensionString').andCallFake(function() {
          return '(txt)';
        }),
        createRegex: jasmine.createSpy('createRegex').andCallFake(function(c, s) {
          return new XRegExp(c.replace(/\(\?extensions\)/g, s), 'xni');
        }),
        lint: jasmine.createSpy('lint')
      };
      disp1 = Profiles.addProfile('test1', testProfileV1, 1);
      return disp2 = Profiles.addProfile('test2', testProfileV2, 2);
    });
    afterEach(function() {
      disp2.dispose();
      return disp1.dispose();
    });
    return describe('On constructor', function() {
      beforeEach(function() {
        return mod = new Modifier.modifier({
          profile: 'test1'
        }, null, output);
      });
      return it('has set up the correct modify function', function() {
        return expect(mod.modify).toBe(mod.modify1);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL3NwZWMvc3RyZWFtLW1vZGlmaWVyLXByb2ZpbGUtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0VBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGlDQUFSLENBQVgsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsMEJBQVIsQ0FEWCxDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBQWtCLENBQUMsT0FGN0IsQ0FBQTs7QUFBQSxFQUlBLGFBQUEsR0FDUTtBQUNKLElBQUEsV0FBQyxDQUFBLFlBQUQsR0FBZSxNQUFmLENBQUE7O0FBQUEsMEJBRUEsTUFBQSxHQUFRLENBQUMsWUFBRCxDQUZSLENBQUE7O0FBQUEsMEJBSUEsa0JBQUEsR0FBb0IsQ0FBQyxLQUFELENBSnBCLENBQUE7O0FBQUEsMEJBTUEsWUFBQSxHQUFjLHVFQU5kLENBQUE7O0FBQUEsMEJBVUEsV0FBQSxHQUFhLGtEQVZiLENBQUE7O0FBY2EsSUFBQSxxQkFBRSxNQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsTUFBTSxDQUFDLHFCQUFSLENBQThCLElBQUMsQ0FBQSxNQUEvQixFQUF1QyxJQUFDLENBQUEsa0JBQXhDLENBQWQsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsQ0FBb0IsSUFBQyxDQUFBLFlBQXJCLEVBQW1DLElBQUMsQ0FBQSxVQUFwQyxDQURULENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBQyxDQUFBLE1BQU0s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

//# sourceURL=/home/niv/.atom/packages/build-tools/spec/stream-modifier-profile-spec.coffee
