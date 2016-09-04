(function() {
  var AllModifier, AllSaver;

  module.exports = {
    name: 'Highlight All',
    edit: AllSaver = (function() {
      function AllSaver() {}

      AllSaver.prototype.get = function(command, stream) {
        command[stream].pipeline.push({
          name: 'all'
        });
        return null;
      };

      return AllSaver;

    })(),
    modifier: AllModifier = (function() {
      function AllModifier() {}

      AllModifier.prototype.modify = function(_arg) {
        var temp;
        temp = _arg.temp;
        if (!((temp.type != null) && temp.type !== '')) {
          temp.type = 'warning';
        }
        return null;
      };

      return AllModifier;

    })()
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9zdHJlYW0tbW9kaWZpZXJzL2FsbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUJBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxJQUFBLEVBQU0sZUFBTjtBQUFBLElBRUEsSUFBQSxFQUNROzRCQUNKOztBQUFBLHlCQUFBLEdBQUEsR0FBSyxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFDSCxRQUFBLE9BQVEsQ0FBQSxNQUFBLENBQU8sQ0FBQyxRQUFRLENBQUMsSUFBekIsQ0FBOEI7QUFBQSxVQUFBLElBQUEsRUFBTSxLQUFOO1NBQTlCLENBQUEsQ0FBQTtBQUNBLGVBQU8sSUFBUCxDQUZHO01BQUEsQ0FBTCxDQUFBOztzQkFBQTs7UUFKSjtBQUFBLElBUUEsUUFBQSxFQUNROytCQUNKOztBQUFBLDRCQUFBLE1BQUEsR0FBUSxTQUFDLElBQUQsR0FBQTtBQUNOLFlBQUEsSUFBQTtBQUFBLFFBRFEsT0FBRCxLQUFDLElBQ1IsQ0FBQTtBQUFBLFFBQUEsSUFBQSxDQUFBLENBQTZCLG1CQUFBLElBQWUsSUFBSSxDQUFDLElBQUwsS0FBZSxFQUEzRCxDQUFBO0FBQUEsVUFBQSxJQUFJLENBQUMsSUFBTCxHQUFZLFNBQVosQ0FBQTtTQUFBO0FBQ0EsZUFBTyxJQUFQLENBRk07TUFBQSxDQUFSLENBQUE7O3lCQUFBOztRQVZKO0dBRkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/stream-modifiers/all.coffee
