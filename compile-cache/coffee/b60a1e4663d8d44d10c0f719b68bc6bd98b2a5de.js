(function() {
  var random;

  random = require("lodash.random");

  module.exports = {
    shake: function(editorElement) {
      var max, min, x, y;
      min = this.getConfig("minIntensity");
      max = this.getConfig("maxIntensity");
      x = this.shakeIntensity(min, max);
      y = this.shakeIntensity(min, max);
      editorElement.style.top = "" + y + "px";
      editorElement.style.left = "" + x + "px";
      return setTimeout(function() {
        editorElement.style.top = "";
        return editorElement.style.left = "";
      }, 75);
    },
    shakeIntensity: function(min, max) {
      var direction;
      direction = Math.random() > 0.5 ? -1 : 1;
      return random(min, max, true) * direction;
    },
    getConfig: function(config) {
      return atom.config.get("activate-power-mode.screenShake." + config);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvc2NyZWVuLXNoYWtlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxNQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxlQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLEtBQUEsRUFBTyxTQUFDLGFBQUQsR0FBQTtBQUNMLFVBQUEsY0FBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLElBQUMsQ0FBQSxTQUFELENBQVcsY0FBWCxDQUFOLENBQUE7QUFBQSxNQUNBLEdBQUEsR0FBTSxJQUFDLENBQUEsU0FBRCxDQUFXLGNBQVgsQ0FETixDQUFBO0FBQUEsTUFHQSxDQUFBLEdBQUksSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsQ0FISixDQUFBO0FBQUEsTUFJQSxDQUFBLEdBQUksSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsQ0FKSixDQUFBO0FBQUEsTUFNQSxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQXBCLEdBQTBCLEVBQUEsR0FBRyxDQUFILEdBQUssSUFOL0IsQ0FBQTtBQUFBLE1BT0EsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFwQixHQUEyQixFQUFBLEdBQUcsQ0FBSCxHQUFLLElBUGhDLENBQUE7YUFTQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQXBCLEdBQTBCLEVBQTFCLENBQUE7ZUFDQSxhQUFhLENBQUMsS0FBSyxDQUFDLElBQXBCLEdBQTJCLEdBRmxCO01BQUEsQ0FBWCxFQUdFLEVBSEYsRUFWSztJQUFBLENBQVA7QUFBQSxJQWVBLGNBQUEsRUFBZ0IsU0FBQyxHQUFELEVBQU0sR0FBTixHQUFBO0FBQ2QsVUFBQSxTQUFBO0FBQUEsTUFBQSxTQUFBLEdBQWUsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLEdBQWdCLEdBQW5CLEdBQTRCLENBQUEsQ0FBNUIsR0FBb0MsQ0FBaEQsQ0FBQTthQUNBLE1BQUEsQ0FBTyxHQUFQLEVBQVksR0FBWixFQUFpQixJQUFqQixDQUFBLEdBQXlCLFVBRlg7SUFBQSxDQWZoQjtBQUFBLElBbUJBLFNBQUEsRUFBVyxTQUFDLE1BQUQsR0FBQTthQUNULElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFpQixrQ0FBQSxHQUFrQyxNQUFuRCxFQURTO0lBQUEsQ0FuQlg7R0FIRixDQUFBO0FBQUEiCn0=

//# sourceURL=/C:/Users/MNP/.atom/packages/activate-power-mode/lib/screen-shake.coffee
