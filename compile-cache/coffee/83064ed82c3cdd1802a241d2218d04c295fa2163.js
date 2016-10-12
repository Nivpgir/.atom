(function() {
  var path;

  path = require("path");

  module.exports = {
    play: function() {
      var audio, pathtoaudio;
      pathtoaudio = path.join(__dirname, '../audioclips/gun.wav');
      audio = new Audio(pathtoaudio);
      audio.currentTime = 0;
      audio.volume = this.getConfig("volume");
      return audio.play();
    },
    getConfig: function(config) {
      return atom.config.get("activate-power-mode.playAudio." + config);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvcGxheS1hdWRpby5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsSUFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxJQUFBLEVBQU0sU0FBQSxHQUFBO0FBQ0osVUFBQSxrQkFBQTtBQUFBLE1BQUEsV0FBQSxHQUFjLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQix1QkFBckIsQ0FBZCxDQUFBO0FBQUEsTUFDQSxLQUFBLEdBQVksSUFBQSxLQUFBLENBQU0sV0FBTixDQURaLENBQUE7QUFBQSxNQUVBLEtBQUssQ0FBQyxXQUFOLEdBQW9CLENBRnBCLENBQUE7QUFBQSxNQUdBLEtBQUssQ0FBQyxNQUFOLEdBQWUsSUFBQyxDQUFBLFNBQUQsQ0FBVyxRQUFYLENBSGYsQ0FBQTthQUlBLEtBQUssQ0FBQyxJQUFOLENBQUEsRUFMSTtJQUFBLENBQU47QUFBQSxJQU9BLFNBQUEsRUFBVyxTQUFDLE1BQUQsR0FBQTthQUNULElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFpQixnQ0FBQSxHQUFnQyxNQUFqRCxFQURTO0lBQUEsQ0FQWDtHQUhGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/C:/Users/MNP/.atom/packages/activate-power-mode/lib/play-audio.coffee
