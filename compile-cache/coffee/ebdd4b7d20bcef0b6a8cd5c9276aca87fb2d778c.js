(function() {
  var comboMode, playAudio, powerCanvas, screenShake, throttle,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  throttle = require("lodash.throttle");

  screenShake = require("./screen-shake");

  playAudio = require("./play-audio");

  powerCanvas = require("./power-canvas");

  comboMode = require("./combo-mode");

  module.exports = {
    screenShake: screenShake,
    playAudio: playAudio,
    powerCanvas: powerCanvas,
    comboMode: comboMode,
    enable: function() {
      this.throttledShake = throttle(this.screenShake.shake.bind(this.screenShake), 100, {
        trailing: false
      });
      this.throttledPlayAudio = throttle(this.playAudio.play.bind(this.playAudio), 100, {
        trailing: false
      });
      this.activeItemSubscription = atom.workspace.onDidStopChangingActivePaneItem((function(_this) {
        return function() {
          return _this.subscribeToActiveTextEditor();
        };
      })(this));
      this.comboModeEnabledSubscription = atom.config.observe('activate-power-mode.comboMode.enabled', (function(_this) {
        return function(value) {
          _this.isComboMode = value;
          if (_this.isComboMode && _this.editorElement) {
            return _this.comboMode.setup(_this.editorElement);
          } else {
            return _this.comboMode.destroy();
          }
        };
      })(this));
      return this.subscribeToActiveTextEditor();
    },
    disable: function() {
      var _ref, _ref1, _ref2, _ref3;
      if ((_ref = this.activeItemSubscription) != null) {
        _ref.dispose();
      }
      if ((_ref1 = this.editorChangeSubscription) != null) {
        _ref1.dispose();
      }
      if ((_ref2 = this.comboModeEnabledSubscription) != null) {
        _ref2.dispose();
      }
      if ((_ref3 = this.editorAddCursor) != null) {
        _ref3.dispose();
      }
      this.powerCanvas.destroy();
      this.comboMode.destroy();
      return this.isComboMode = false;
    },
    subscribeToActiveTextEditor: function() {
      this.powerCanvas.resetCanvas();
      if (this.isComboMode) {
        this.comboMode.reset();
      }
      return this.prepareEditor();
    },
    prepareEditor: function() {
      var _ref, _ref1, _ref2, _ref3;
      if ((_ref = this.editorChangeSubscription) != null) {
        _ref.dispose();
      }
      if ((_ref1 = this.editorAddCursor) != null) {
        _ref1.dispose();
      }
      this.editor = atom.workspace.getActiveTextEditor();
      if (!this.editor) {
        return;
      }
      if (_ref2 = (_ref3 = this.editor.getPath()) != null ? _ref3.split('.').pop() : void 0, __indexOf.call(this.getConfig("excludedFileTypes.excluded"), _ref2) >= 0) {
        return;
      }
      this.editorElement = atom.views.getView(this.editor);
      this.powerCanvas.setupCanvas(this.editor, this.editorElement);
      if (this.isComboMode) {
        this.comboMode.setup(this.editorElement);
      }
      this.editorChangeSubscription = this.editor.getBuffer().onDidChange(this.onChange.bind(this));
      return this.editorAddCursor = this.editor.observeCursors(this.handleCursor.bind(this));
    },
    handleCursor: function(cursor) {
      return cursor.throttleSpawnParticles = throttle(this.powerCanvas.spawnParticles.bind(this.powerCanvas), 25, {
        trailing: false
      });
    },
    onChange: function(e) {
      var cursor, range, screenPosition, spawnParticles;
      spawnParticles = true;
      if (e.newText) {
        spawnParticles = e.newText !== "\n";
        range = e.newRange.end;
      } else {
        range = e.newRange.start;
      }
      screenPosition = this.editor.screenPositionForBufferPosition(range);
      cursor = this.editor.getCursorAtScreenPosition(screenPosition);
      if (!cursor) {
        return;
      }
      if (this.isComboMode) {
        this.comboMode.increaseStreak();
        if (!this.comboMode.hasReached()) {
          return;
        }
      }
      if (spawnParticles && this.getConfig("particles.enabled")) {
        cursor.throttleSpawnParticles(screenPosition);
      }
      if (this.getConfig("screenShake.enabled")) {
        this.throttledShake(this.editorElement);
      }
      if (this.getConfig("playAudio.enabled")) {
        return this.throttledPlayAudio();
      }
    },
    getConfig: function(config) {
      return atom.config.get("activate-power-mode." + config);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvcG93ZXItZWRpdG9yLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3REFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxpQkFBUixDQUFYLENBQUE7O0FBQUEsRUFDQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBRGQsQ0FBQTs7QUFBQSxFQUVBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQUZaLENBQUE7O0FBQUEsRUFHQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBSGQsQ0FBQTs7QUFBQSxFQUlBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQUpaLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxXQUFBLEVBQWEsV0FBYjtBQUFBLElBQ0EsU0FBQSxFQUFXLFNBRFg7QUFBQSxJQUVBLFdBQUEsRUFBYSxXQUZiO0FBQUEsSUFHQSxTQUFBLEVBQVcsU0FIWDtBQUFBLElBS0EsTUFBQSxFQUFRLFNBQUEsR0FBQTtBQUNOLE1BQUEsSUFBQyxDQUFBLGNBQUQsR0FBa0IsUUFBQSxDQUFTLElBQUMsQ0FBQSxXQUFXLENBQUMsS0FBSyxDQUFDLElBQW5CLENBQXdCLElBQUMsQ0FBQSxXQUF6QixDQUFULEVBQWdELEdBQWhELEVBQXFEO0FBQUEsUUFBQSxRQUFBLEVBQVUsS0FBVjtPQUFyRCxDQUFsQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsa0JBQUQsR0FBc0IsUUFBQSxDQUFTLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQWhCLENBQXFCLElBQUMsQ0FBQSxTQUF0QixDQUFULEVBQTJDLEdBQTNDLEVBQWdE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

//# sourceURL=/C:/Users/MNP/.atom/packages/activate-power-mode/lib/power-editor.coffee
