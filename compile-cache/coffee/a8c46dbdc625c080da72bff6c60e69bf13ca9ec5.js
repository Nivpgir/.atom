(function() {
  var $, $$, ProfileEditPane, ProfileInfoPane, ProfileModifier, Profiles, TextEditorView, View, XRegExp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  Profiles = require('../profiles/profiles');

  XRegExp = require('xregexp').XRegExp;

  module.exports = {
    name: 'Highlighting Profile',
    info: ProfileInfoPane = (function() {
      function ProfileInfoPane(command, config) {
        var key, value, _ref1;
        this.element = document.createElement('div');
        this.element.classList.add('module');
        key = document.createElement('div');
        key.classList.add('text-padded');
        key.innerText = 'Profile:';
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = (_ref1 = Profiles.profiles[config.profile]) != null ? _ref1.profile_name : void 0;
        this.element.appendChild(key);
        this.element.appendChild(value);
      }

      return ProfileInfoPane;

    })(),
    edit: ProfileEditPane = (function(_super) {
      __extends(ProfileEditPane, _super);

      function ProfileEditPane() {
        return ProfileEditPane.__super__.constructor.apply(this, arguments);
      }

      ProfileEditPane.content = function() {
        return this.div({
          "class": 'panel-body padded'
        }, (function(_this) {
          return function() {
            return _this.div({
              "class": 'block'
            }, function() {
              _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Profile');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Select Highlighting Profile');
                });
              });
              return _this.select({
                "class": 'form-control',
                outlet: 'profile'
              });
            });
          };
        })(this));
      };

      ProfileEditPane.prototype.set = function(command, config) {
        this.populateProfiles();
        if (config != null) {
          return this.selectProfile(config.profile);
        }
      };

      ProfileEditPane.prototype.get = function(command, stream) {
        command[stream].pipeline.push({
          name: 'profile',
          config: {
            profile: this.profile.children()[this.profile[0].selectedIndex].attributes.getNamedItem('value').nodeValue
          }
        });
        return null;
      };

      ProfileEditPane.prototype.populateProfiles = function() {
        var createitem, gcc_index, id, key, _i, _len, _ref1;
        createitem = function(key, profile) {
          return $$(function() {
            return this.option({
              value: key
            }, profile);
          });
        };
        this.profile.empty();
        gcc_index = 0;
        _ref1 = Object.keys(Profiles.profiles);
        for (id = _i = 0, _len = _ref1.length; _i < _len; id = ++_i) {
          key = _ref1[id];
          this.profile.append(createitem(key, Profiles.profiles[key].profile_name));
          if (key === 'gcc_clang') {
            gcc_index = id;
          }
        }
        return this.profile[0].selectedIndex = gcc_index;
      };

      ProfileEditPane.prototype.selectProfile = function(profile) {
        var id, option, _i, _len, _ref1, _results;
        _ref1 = this.profile.children();
        _results = [];
        for (id = _i = 0, _len = _ref1.length; _i < _len; id = ++_i) {
          option = _ref1[id];
          if (option.attributes.getNamedItem('value').nodeValue === profile) {
            this.profile[0].selectedIndex = id;
            break;
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      return ProfileEditPane;

    })(View),
    modifier: ProfileModifier = (function() {
      function ProfileModifier(config, command, output) {
        var _base, _base1, _name, _ref1;
        this.config = config;
        this.command = command;
        this.output = output;
        this.profile = typeof (_base = Profiles.profiles)[_name = this.config.profile] === "function" ? new _base[_name](this.output) : void 0;
        if (this.profile == null) {
          if ((_ref1 = atom.notifications) != null) {
            _ref1.addError("Could not find highlighting profile: " + this.config.profile);
          }
          return;
        }
        if (typeof (_base1 = this.profile).clear === "function") {
          _base1.clear();
        }
        this.modify = this['modify' + Profiles.versions[this.config.profile]];
      }

      ProfileModifier.prototype.modify = function() {
        return null;
      };

      ProfileModifier.prototype.modify1 = function(_arg) {
        var temp;
        temp = _arg.temp;
        this.profile["in"](temp.input);
        return 1;
      };

      ProfileModifier.prototype.modify2 = function(_arg) {
        var perm, temp;
        temp = _arg.temp, perm = _arg.perm;
        return this.profile["in"](temp, perm);
      };

      ProfileModifier.prototype.getFiles = function(_arg) {
        var perm, temp;
        temp = _arg.temp, perm = _arg.perm;
        if (this.profile != null) {
          return this.profile.files(temp.input);
        } else {
          return [];
        }
      };

      return ProfileModifier;

    })()
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9zdHJlYW0tbW9kaWZpZXJzL3Byb2ZpbGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVHQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFnQyxPQUFBLENBQVEsc0JBQVIsQ0FBaEMsRUFBQyxTQUFBLENBQUQsRUFBSSxVQUFBLEVBQUosRUFBUSxzQkFBQSxjQUFSLEVBQXdCLFlBQUEsSUFBeEIsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsc0JBQVIsQ0FEWCxDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBQWtCLENBQUMsT0FGN0IsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7QUFBQSxJQUFBLElBQUEsRUFBTSxzQkFBTjtBQUFBLElBRUEsSUFBQSxFQUNRO0FBQ1MsTUFBQSx5QkFBQyxPQUFELEVBQVUsTUFBVixHQUFBO0FBQ1gsWUFBQSxpQkFBQTtBQUFBLFFBQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFYLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLFFBQXZCLENBREEsQ0FBQTtBQUFBLFFBRUEsR0FBQSxHQUFNLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBRk4sQ0FBQTtBQUFBLFFBR0EsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFkLENBQWtCLGFBQWxCLENBSEEsQ0FBQTtBQUFBLFFBSUEsR0FBRyxDQUFDLFNBQUosR0FBZ0IsVUFKaEIsQ0FBQTtBQUFBLFFBS0EsS0FBQSxHQUFRLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBTFIsQ0FB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

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/stream-modifiers/profile.coffee
