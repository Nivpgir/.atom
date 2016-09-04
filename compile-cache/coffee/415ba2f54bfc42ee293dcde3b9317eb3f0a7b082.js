(function() {
  var SaveAllSaver;

  module.exports = {
    name: 'Save All',
    description: 'Save all modified files before executing the command(s)',
    "private": false,
    edit: SaveAllSaver = (function() {
      function SaveAllSaver() {}

      SaveAllSaver.prototype.get = function(command) {
        command.modifier.save_all = {};
        return null;
      };

      return SaveAllSaver;

    })(),
    "in": function() {
      var editor, _i, _len, _ref;
      _ref = atom.workspace.getTextEditors();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        editor = _ref[_i];
        if (editor.isModified() && (editor.getPath() != null)) {
          editor.save();
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9tb2RpZmllci9zYXZlX2FsbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsWUFBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7QUFBQSxJQUFBLElBQUEsRUFBTSxVQUFOO0FBQUEsSUFDQSxXQUFBLEVBQWEseURBRGI7QUFBQSxJQUVBLFNBQUEsRUFBUyxLQUZUO0FBQUEsSUFJQSxJQUFBLEVBQ1E7Z0NBQ0o7O0FBQUEsNkJBQUEsR0FBQSxHQUFLLFNBQUMsT0FBRCxHQUFBO0FBQ0gsUUFBQSxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQWpCLEdBQTRCLEVBQTVCLENBQUE7QUFDQSxlQUFPLElBQVAsQ0FGRztNQUFBLENBQUwsQ0FBQTs7MEJBQUE7O1FBTko7QUFBQSxJQVVBLElBQUEsRUFBSSxTQUFBLEdBQUE7QUFDRixVQUFBLHNCQUFBO0FBQUE7QUFBQSxXQUFBLDJDQUFBOzBCQUFBO0FBQ0UsUUFBQSxJQUFpQixNQUFNLENBQUMsVUFBUCxDQUFBLENBQUEsSUFBd0IsMEJBQXpDO0FBQUEsVUFBQSxNQUFNLENBQUMsSUFBUCxDQUFBLENBQUEsQ0FBQTtTQURGO0FBQUEsT0FERTtJQUFBLENBVko7R0FGRixDQUFBO0FBQUEiCn0=

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/modifier/save_all.coffee
