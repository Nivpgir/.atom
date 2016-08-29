(function() {
  var CompositeDisposable, ConfigPane, SettingsView, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  CompositeDisposable = require('atom').CompositeDisposable;

  ConfigPane = require('./config-pane');

  module.exports = SettingsView = (function(_super) {
    __extends(SettingsView, _super);

    function SettingsView() {
      this.showPane = __bind(this.showPane, this);
      this.hidePanes = __bind(this.hidePanes, this);
      return SettingsView.__super__.constructor.apply(this, arguments);
    }

    SettingsView.content = function() {
      return this.div({
        "class": 'build-settings pane-item',
        tabindex: -1
      });
    };

    SettingsView.prototype.initialize = function(projectPath, filePath) {
      this.projectPath = projectPath;
      this.filePath = filePath;
    };

    SettingsView.prototype.getUri = function() {
      return this.filePath;
    };

    SettingsView.prototype.getTitle = function() {
      return 'Build Config: ' + this.projectPath;
    };

    SettingsView.prototype.getIconName = function() {
      return 'tools';
    };

    SettingsView.prototype.attached = function() {
      this.configPane = new ConfigPane(this.projectPath, this.filePath);
      this.model = this.configPane.model;
      this.configPane.setCallbacks(this.hidePanes, this.showPane);
      this.html('');
      return this.append(this.configPane);
    };

    SettingsView.prototype.detached = function() {
      this.html('');
      this.configPane.destroy();
      this.configPane = null;
      return this.model = null;
    };

    SettingsView.prototype.hidePanes = function() {
      this.html('');
      return this.append(this.configPane);
    };

    SettingsView.prototype.showPane = function(pane) {
      this.html('');
      return this.append(pane);
    };

    return SettingsView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi92aWV3L3NldHRpbmdzLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1EQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFDQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBREQsQ0FBQTs7QUFBQSxFQUVBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUZiLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBQ0osbUNBQUEsQ0FBQTs7Ozs7O0tBQUE7O0FBQUEsSUFBQSxZQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTywwQkFBUDtBQUFBLFFBQW1DLFFBQUEsRUFBVSxDQUFBLENBQTdDO09BQUwsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSwyQkFHQSxVQUFBLEdBQVksU0FBRSxXQUFGLEVBQWdCLFFBQWhCLEdBQUE7QUFBMkIsTUFBMUIsSUFBQyxDQUFBLGNBQUEsV0FBeUIsQ0FBQTtBQUFBLE1BQVosSUFBQyxDQUFBLFdBQUEsUUFBVyxDQUEzQjtJQUFBLENBSFosQ0FBQTs7QUFBQSwyQkFLQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sSUFBQyxDQUFBLFNBREs7SUFBQSxDQUxSLENBQUE7O0FBQUEsMkJBUUEsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUNSLGdCQUFBLEdBQW1CLElBQUMsQ0FBQSxZQURaO0lBQUEsQ0FSVixDQUFBOztBQUFBLDJCQVdBLFdBQUEsR0FBYSxTQUFBLEdBQUE7YUFDWCxRQURXO0lBQUEsQ0FYYixDQUFBOztBQUFBLDJCQWNBLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxVQUFELEdBQWtCLElBQUEsVUFBQSxDQUFXLElBQUMsQ0FBQSxXQUFaLEVBQXlCLElBQUMsQ0FBQSxRQUExQixDQUFsQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxVQUFVLENBQUMsS0FEckIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxZQUFaLENBQXlCLElBQUMsQ0FBQSxTQUExQixFQUFxQyxJQUFDLENBQUEsUUFBdEMsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsSUFBRCxDQUFNLEVBQU4sQ0FIQSxDQUFBO2FBSUEsSUFBQyxDQUFBLE1BQUQsQ0FBUSxJQUFDLENBQUEsVUFBVCxFQUxRO0lBQUEsQ0FkVixDQUFBOztBQUFBLDJCQXFCQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsSUFBRCxDQUFNLEVBQU4sQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFGZCxDQUFBO2FBR0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxLQUpEO0lBQUEsQ0FyQlYsQ0FBQTs7QUFBQSwyQkEyQkEsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBQyxDQUFBLElBQUQsQ0FBTSxFQUFOLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxNQUFELENBQVEsSUFBQyxDQUFBLFVBQVQsRUFGUztJQUFBLENBM0JYLENBQUE7O0FBQUEsMkJBK0JBLFFBQUEsR0FBVSxTQUFDLElBQUQsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLElBQUQsQ0FBTSxFQUFOLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxNQUFELENBQVEsSUFBUixFQUZRO0lBQUEsQ0EvQlYsQ0FBQTs7d0JBQUE7O0tBRHlCLEtBTDdCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/view/settings-view.coffee
