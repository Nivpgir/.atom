(function() {
  var $, CompositeDisposable, ConfigPane, Project, Providers, ScrollView, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, ScrollView = _ref.ScrollView;

  CompositeDisposable = require('atom').CompositeDisposable;

  Providers = require('../provider/provider');

  Project = require('../provider/project');

  module.exports = ConfigPane = (function(_super) {
    __extends(ConfigPane, _super);

    function ConfigPane() {
      this.reload = __bind(this.reload, this);
      return ConfigPane.__super__.constructor.apply(this, arguments);
    }

    ConfigPane.content = function() {
      return this.div({
        id: 'config'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'panel-heading'
          }, function() {
            _this.span({
              "class": 'inline-block panel-text icon icon-database'
            }, 'Providers');
            _this.span({
              id: 'add-provider',
              "class": 'inline-block btn btn-sm icon icon-plus'
            }, 'Add provider');
            return _this.span({
              id: 'migrate-global',
              "class": 'inline-block btn btn-sm icon icon-globe hidden'
            }, 'Migrate old commands');
          });
          return _this.div({
            "class": 'panel-body padded',
            outlet: 'provider_list'
          });
        };
      })(this));
    };

    ConfigPane.prototype.initialize = function(projectPath, filePath) {
      this.projectPath = projectPath;
      this.filePath = filePath;
      this.model = new Project(this.projectPath, this.filePath, true);
      return ConfigPane.__super__.initialize.apply(this, arguments);
    };

    ConfigPane.prototype.destroy = function() {
      this.model.destroy();
      this.model = null;
      this.projectPath = null;
      this.filePath = null;
      this.hidePanes = null;
      return this.showPane = null;
    };

    ConfigPane.prototype.attached = function() {
      var context, key, name, _i, _len, _ref1;
      this.disposables = new CompositeDisposable;
      context = [];
      _ref1 = Object.keys(Providers.modules);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        key = _ref1[_i];
        name = Providers.modules[key].name;
        this.disposables.add(atom.commands.add(this[0], ("build-tools:add-" + name).replace(/\ /g, '-'), ((function(_this) {
          return function(k) {
            return function() {
              return _this.model.addProvider(k);
            };
          };
        })(this))(key)));
        context.push({
          label: "Add " + name,
          command: ("build-tools:add-" + name).replace(/\ /g, '-')
        });
      }
      this.disposables.add(atom.contextMenu.add({
        '#add-provider': context
      }));
      this.on('click', '#add-provider', function(event) {
        return atom.contextMenu.showForEvent(event);
      });
      this.on('click', '#migrate-global', this.model.migrateGlobal);
      this.model.hasGlobal((function(_this) {
        return function() {
          return _this.find('#migrate-global').removeClass('hidden');
        };
      })(this));
      this.disposables.add(this.model.onSave(this.reload));
      return this.reload();
    };

    ConfigPane.prototype.detached = function() {
      this.disposables.dispose();
      this.provider_list.html('');
      return this.find('#migrate-global').addClass('hidden');
    };

    ConfigPane.prototype.setCallbacks = function(hidePanes, showPane) {
      this.hidePanes = hidePanes;
      this.showPane = showPane;
    };

    ConfigPane.prototype.reload = function() {
      var index, provider, _base, _i, _len, _ref1, _results;
      this.provider_list.html('');
      _ref1 = this.model.providers;
      _results = [];
      for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
        provider = _ref1[index];
        this.provider_list.append(this.buildPane(Providers.modules[provider.key].name, provider.view.element, index));
        _results.push(typeof (_base = provider.view).setCallbacks === "function" ? _base.setCallbacks(this.hidePanes, this.showPane) : void 0);
      }
      return _results;
    };

    ConfigPane.prototype.buildPane = function(name, element, id) {
      var item;
      item = $(element);
      item.find('#provider-name').text(name);
      item.on('click', '.config-buttons .icon-triangle-up', (function(_this) {
        return function() {
          return _this.model.moveProviderUp(id);
        };
      })(this));
      item.on('click', '.config-buttons .icon-triangle-down', (function(_this) {
        return function() {
          return _this.model.moveProviderDown(id);
        };
      })(this));
      item.on('click', '.config-buttons .icon-x', (function(_this) {
        return function() {
          return _this.model.removeProvider(id);
        };
      })(this));
      return element;
    };

    return ConfigPane;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi92aWV3L2NvbmZpZy1wYW5lLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3RUFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLE9BQWtCLE9BQUEsQ0FBUSxzQkFBUixDQUFsQixFQUFDLFNBQUEsQ0FBRCxFQUFJLGtCQUFBLFVBQUosQ0FBQTs7QUFBQSxFQUNDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFERCxDQUFBOztBQUFBLEVBRUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxzQkFBUixDQUZaLENBQUE7O0FBQUEsRUFHQSxPQUFBLEdBQVUsT0FBQSxDQUFRLHFCQUFSLENBSFYsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDSixpQ0FBQSxDQUFBOzs7OztLQUFBOztBQUFBLElBQUEsVUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxFQUFBLEVBQUksUUFBSjtPQUFMLEVBQW1CLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDakIsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sZUFBUDtXQUFMLEVBQTZCLFNBQUEsR0FBQTtBQUMzQixZQUFBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxjQUFBLE9BQUEsRUFBTyw0Q0FBUDthQUFOLEVBQTJELFdBQTNELENBQUEsQ0FBQTtBQUFBLFlBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGNBQUEsRUFBQSxFQUFJLGNBQUo7QUFBQSxjQUFvQixPQUFBLEVBQU8sd0NBQTNCO2FBQU4sRUFBMkUsY0FBM0UsQ0FEQSxDQUFBO21CQUVBLEtBQUMs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

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/view/config-pane.coffee
