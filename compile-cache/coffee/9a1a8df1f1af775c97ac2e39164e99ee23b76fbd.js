(function() {
  var debounce, defer, sample;

  debounce = require("lodash.debounce");

  defer = require("lodash.defer");

  sample = require("lodash.sample");

  module.exports = {
    currentStreak: 0,
    reached: false,
    reset: function() {
      var _ref, _ref1;
      return (_ref = this.container) != null ? (_ref1 = _ref.parentNode) != null ? _ref1.removeChild(this.container) : void 0 : void 0;
    },
    destroy: function() {
      var reached, _ref, _ref1, _ref2;
      this.reset();
      this.container = null;
      if ((_ref = this.debouncedEndStreak) != null) {
        _ref.cancel();
      }
      this.debouncedEndStreak = null;
      if ((_ref1 = this.streakTimeoutObserver) != null) {
        _ref1.dispose();
      }
      if ((_ref2 = this.opacityObserver) != null) {
        _ref2.dispose();
      }
      this.currentStreak = 0;
      return reached = false;
    },
    createElement: function(name, parent) {
      this.element = document.createElement("div");
      this.element.classList.add(name);
      if (parent) {
        parent.appendChild(this.element);
      }
      return this.element;
    },
    setup: function(editorElement) {
      var leftTimeout, _ref, _ref1, _ref2;
      if (!this.container) {
        this.container = this.createElement("streak-container");
        this.title = this.createElement("title", this.container);
        this.title.textContent = "Combo";
        this.counter = this.createElement("counter", this.container);
        this.bar = this.createElement("bar", this.container);
        this.exclamations = this.createElement("exclamations", this.container);
        if ((_ref = this.streakTimeoutObserver) != null) {
          _ref.dispose();
        }
        this.streakTimeoutObserver = atom.config.observe('activate-power-mode.comboMode.streakTimeout', (function(_this) {
          return function(value) {
            var _ref1;
            _this.streakTimeout = value * 1000;
            _this.endStreak();
            if ((_ref1 = _this.debouncedEndStreak) != null) {
              _ref1.cancel();
            }
            return _this.debouncedEndStreak = debounce(_this.endStreak.bind(_this), _this.streakTimeout);
          };
        })(this));
        if ((_ref1 = this.opacityObserver) != null) {
          _ref1.dispose();
        }
        this.opacityObserver = atom.config.observe('activate-power-mode.comboMode.opacity', (function(_this) {
          return function(value) {
            var _ref2;
            return (_ref2 = _this.container) != null ? _ref2.style.opacity = value : void 0;
          };
        })(this));
      }
      this.exclamations.innerHTML = '';
      ((_ref2 = editorElement.shadowRoot) != null ? _ref2 : editorElement).querySelector(".scroll-view").appendChild(this.container);
      if (this.currentStreak) {
        leftTimeout = this.streakTimeout - (performance.now() - this.lastStreak);
        this.refreshStreakBar(leftTimeout);
      }
      return this.renderStreak();
    },
    increaseStreak: function() {
      this.lastStreak = performance.now();
      this.debouncedEndStreak();
      this.currentStreak++;
      if (this.currentStreak > 0 && this.currentStreak % this.getConfig("exclamationEvery") === 0) {
        this.showExclamation();
      }
      if (this.currentStreak >= this.getConfig("activationThreshold") && !this.reached) {
        this.reached = true;
        this.container.classList.add("reached");
      }
      this.refreshStreakBar();
      return this.renderStreak();
    },
    endStreak: function() {
      this.currentStreak = 0;
      this.reached = false;
      this.container.classList.remove("reached");
      return this.renderStreak();
    },
    renderStreak: function() {
      this.counter.textContent = this.currentStreak;
      this.counter.classList.remove("bump");
      return defer((function(_this) {
        return function() {
          return _this.counter.classList.add("bump");
        };
      })(this));
    },
    refreshStreakBar: function(leftTimeout) {
      var scale;
      if (leftTimeout == null) {
        leftTimeout = this.streakTimeout;
      }
      scale = leftTimeout / this.streakTimeout;
      this.bar.style.transition = "none";
      this.bar.style.transform = "scaleX(" + scale + ")";
      return setTimeout((function(_this) {
        return function() {
          _this.bar.style.transform = "";
          return _this.bar.style.transition = "transform " + leftTimeout + "ms linear";
        };
      })(this), 100);
    },
    showExclamation: function() {
      var exclamation;
      exclamation = document.createElement("span");
      exclamation.classList.add("exclamation");
      exclamation.textContent = sample(this.getConfig("exclamationTexts"));
      this.exclamations.insertBefore(exclamation, this.exclamations.childNodes[0]);
      return setTimeout((function(_this) {
        return function() {
          if (_this.exclamations.firstChild) {
            return _this.exclamations.removeChild(exclamation);
          }
        };
      })(this), 3000);
    },
    hasReached: function() {
      return this.reached;
    },
    getConfig: function(config) {
      return atom.config.get("activate-power-mode.comboMode." + config);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvY29tYm8tbW9kZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUJBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGlCQUFSLENBQVgsQ0FBQTs7QUFBQSxFQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsY0FBUixDQURSLENBQUE7O0FBQUEsRUFFQSxNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVIsQ0FGVCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsYUFBQSxFQUFlLENBQWY7QUFBQSxJQUNBLE9BQUEsRUFBUyxLQURUO0FBQUEsSUFHQSxLQUFBLEVBQU8sU0FBQSxHQUFBO0FBQ0wsVUFBQSxXQUFBO3dGQUFzQixDQUFFLFdBQXhCLENBQW9DLElBQUMsQ0FBQSxTQUFyQyxvQkFESztJQUFBLENBSFA7QUFBQSxJQU1BLE9BQUEsRUFBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLDJCQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsS0FBRCxDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQURiLENBQUE7O1lBRW1CLENBQUUsTUFBckIsQ0FBQTtPQUZBO0FBQUEsTUFHQSxJQUFDLENBQUEsa0JBQUQsR0FBc0IsSUFIdEIsQ0FBQTs7YUFJc0IsQ0FBRSxPQUF4QixDQUFBO09BSkE7O2FBS2dCLENBQUUsT0FBbEIsQ0FBQTtPQUxBO0FBQUEsTUFNQSxJQUFDLENBQUEsYUFBRCxHQUFpQixDQU5qQixDQUFBO2FBT0EsT0FBQSxHQUFVLE1BUkg7SUFBQSxDQU5UO0FBQUEsSUFnQkEsYUFBQSxFQUFlLFNBQUMsSUFBRCxFQUFPLE1BQVAsR0FBQTtB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

//# sourceURL=/C:/Users/MNP/.atom/packages/activate-power-mode/lib/combo-mode.coffee
