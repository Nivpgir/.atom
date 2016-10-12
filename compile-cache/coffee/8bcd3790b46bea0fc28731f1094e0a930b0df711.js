(function() {
  var random;

  random = require("lodash.random");

  module.exports = {
    init: function() {
      this.resetParticles();
      return this.animationFrame = requestAnimationFrame(this.drawParticles.bind(this));
    },
    resetCanvas: function() {
      this.editor = null;
      this.editorElement = null;
      return cancelAnimationFrame(this.animationFrame);
    },
    resetParticles: function() {
      this.particlePointer = 0;
      return this.particles = [];
    },
    destroy: function() {
      var _ref;
      this.resetCanvas();
      this.resetParticles();
      if ((_ref = this.canvas) != null) {
        _ref.parentNode.removeChild(this.canvas);
      }
      return this.canvas = null;
    },
    setupCanvas: function(editor, editorElement) {
      var _ref;
      if (!this.canvas) {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.classList.add("power-mode-canvas");
      }
      ((_ref = editorElement.shadowRoot) != null ? _ref : editorElement).appendChild(this.canvas);
      this.canvas.style.display = "block";
      this.editorElement = editorElement;
      this.editor = editor;
      return this.init();
    },
    hsvToRgb: function(h, s, v) {
      var c, h2, h3, m, x;
      c = v * s;
      h2 = (360.0 * h) / 60.0;
      h3 = Math.abs((h2 % 2) - 1.0);
      x = c * (1.0 - h3);
      m = v - c;
      if ((0 <= h2 && h2 < 1)) {
        return [c + m, x + m, m];
      }
      if ((1 <= h2 && h2 < 2)) {
        return [x + m, c + m, m];
      }
      if ((2 <= h2 && h2 < 3)) {
        return [m, c + m, x + m];
      }
      if ((3 <= h2 && h2 < 4)) {
        return [m, x + m, c + m];
      }
      if ((4 <= h2 && h2 < 5)) {
        return [x + m, m, c + m];
      }
      if ((5 <= h2 && h2 < 6)) {
        return [c + m, m, x + m];
      }
    },
    spawnParticles: function(screenPosition) {
      var b, c, color, colorType, cursorOffset, g, golden_ratio_conjugate, left, numParticles, r, rgb, seed, top, _ref, _results, _results1;
      cursorOffset = this.calculateCursorOffset();
      _ref = this.editorElement.pixelPositionForScreenPosition(screenPosition), left = _ref.left, top = _ref.top;
      left += cursorOffset.left - this.editorElement.getScrollLeft();
      top += cursorOffset.top - this.editorElement.getScrollTop();
      numParticles = random(this.getConfig("spawnCount.min"), this.getConfig("spawnCount.max"));
      colorType = this.getConfig("colours.type");
      if (colorType === "random") {
        seed = Math.random();
        golden_ratio_conjugate = 0.618033988749895;
        _results = [];
        while (numParticles--) {
          seed += golden_ratio_conjugate;
          seed = seed - (Math.floor(seed / 1));
          rgb = this.hsvToRgb(seed, 1, 1);
          r = Math.floor((rgb[0] * 255) / 1);
          g = Math.floor((rgb[1] * 255) / 1);
          b = Math.floor((rgb[2] * 255) / 1);
          color = "rgb(" + r + "," + g + "," + b + ")";
          this.particles[this.particlePointer] = this.createParticle(left, top, color);
          _results.push(this.particlePointer = (this.particlePointer + 1) % this.getConfig("totalCount.max"));
        }
        return _results;
      } else {
        if (colorType === "fixed") {
          c = this.getConfig("colours.fixed");
          color = "rgb(" + c.red + "," + c.green + "," + c.blue + ")";
        } else {
          color = this.getColorAtPosition([screenPosition.row, screenPosition.column - 1]);
        }
        _results1 = [];
        while (numParticles--) {
          this.particles[this.particlePointer] = this.createParticle(left, top, color);
          _results1.push(this.particlePointer = (this.particlePointer + 1) % this.getConfig("totalCount.max"));
        }
        return _results1;
      }
    },
    getColorAtPosition: function(screenPosition) {
      var bufferPosition, el, error, scope, _ref;
      bufferPosition = this.editor.bufferPositionForScreenPosition(screenPosition);
      scope = this.editor.scopeDescriptorForBufferPosition(bufferPosition);
      try {
        el = ((_ref = this.editorElement.shadowRoot) != null ? _ref : this.editorElement).querySelector(scope.toString());
      } catch (_error) {
        error = _error;
        "rgb(255, 255, 255)";
      }
      if (el) {
        return getComputedStyle(el).color;
      } else {
        return "rgb(255, 255, 255)";
      }
    },
    calculateCursorOffset: function() {
      var editorRect, scrollViewRect, _ref;
      editorRect = this.editorElement.getBoundingClientRect();
      scrollViewRect = ((_ref = this.editorElement.shadowRoot) != null ? _ref : this.editorElement).querySelector(".scroll-view").getBoundingClientRect();
      return {
        top: scrollViewRect.top - editorRect.top + this.editor.getLineHeightInPixels() / 2,
        left: scrollViewRect.left - editorRect.left
      };
    },
    createParticle: function(x, y, color) {
      return {
        x: x,
        y: y,
        alpha: 1,
        color: color,
        velocity: {
          x: -1 + Math.random() * 2,
          y: -3.5 + Math.random() * 2
        }
      };
    },
    drawParticles: function() {
      var gco, particle, size, _i, _len, _ref;
      if (this.editor) {
        this.animationFrame = requestAnimationFrame(this.drawParticles.bind(this));
      }
      if (!(this.canvas && this.editorElement)) {
        return;
      }
      this.canvas.width = this.editorElement.offsetWidth;
      this.canvas.height = this.editorElement.offsetHeight;
      gco = this.context.globalCompositeOperation;
      this.context.globalCompositeOperation = "lighter";
      _ref = this.particles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        particle = _ref[_i];
        if (particle.alpha <= 0.1) {
          continue;
        }
        particle.velocity.y += 0.075;
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        particle.alpha *= 0.96;
        this.context.fillStyle = "rgba(" + particle.color.slice(4, -1) + ", " + particle.alpha + ")";
        size = random(this.getConfig("size.min"), this.getConfig("size.max"), true);
        this.context.fillRect(Math.round(particle.x - size / 2), Math.round(particle.y - size / 2), size, size);
      }
      return this.context.globalCompositeOperation = gco;
    },
    getConfig: function(config) {
      return atom.config.get("activate-power-mode.particles." + config);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvcG93ZXItY2FudmFzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxNQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxlQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLElBQUEsRUFBTSxTQUFBLEdBQUE7QUFDSixNQUFBLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FBQSxDQUFBO2FBRUEsSUFBQyxDQUFBLGNBQUQsR0FBa0IscUJBQUEsQ0FBc0IsSUFBQyxDQUFBLGFBQWEsQ0FBQyxJQUFmLENBQW9CLElBQXBCLENBQXRCLEVBSGQ7SUFBQSxDQUFOO0FBQUEsSUFLQSxXQUFBLEVBQWEsU0FBQSxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQVYsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFEakIsQ0FBQTthQUVBLG9CQUFBLENBQXFCLElBQUMsQ0FBQSxjQUF0QixFQUhXO0lBQUEsQ0FMYjtBQUFBLElBVUEsY0FBQSxFQUFnQixTQUFBLEdBQUE7QUFDZCxNQUFBLElBQUMsQ0FBQSxlQUFELEdBQW1CLENBQW5CLENBQUE7YUFDQSxJQUFDLENBQUEsU0FBRCxHQUFhLEdBRkM7SUFBQSxDQVZoQjtBQUFBLElBY0EsT0FBQSxFQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FEQSxDQUFBOztZQUVPLENBQUUsVUFBVSxDQUFDLFdBQXBCLENBQWdDLElBQUMsQ0FBQSxNQUFqQztP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

//# sourceURL=/C:/Users/MNP/.atom/packages/activate-power-mode/lib/power-canvas.coffee
