(function() {
  atom.commands.add('atom-text-editor', 'custom:split-right', function() {
    var items;
    items = atom.workspace.getPaneItems();
    console.log("items.length > 1" + (items.length > 1));
    if (items.length > 1) {
      return atom.commands.dispatch(atom.workspace.getActiveTextEditor(), 'split-right-and-move-active-item');
    } else {
      return console.log(atom.commands.dispatch(atom.workspace.getActiveTextEditor(), 'split-right'));
    }
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL2luaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBRUE7QUFBQSxFQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0Msb0JBQXRDLEVBQTRELFNBQUEsR0FBQTtBQUMxRCxRQUFBLEtBQUE7QUFBQSxJQUFBLEtBQUEsR0FBUSxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQWYsQ0FBQSxDQUFSLENBQUE7QUFBQSxJQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksa0JBQUEsR0FBcUIsQ0FBQyxLQUFLLENBQUMsTUFBTixHQUFlLENBQWhCLENBQWpDLENBREEsQ0FBQTtBQUVBLElBQUEsSUFBRyxLQUFLLENBQUMsTUFBTixHQUFlLENBQWxCO2FBQ0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUF2QixFQUE2RCxrQ0FBN0QsRUFERjtLQUFBLE1BQUE7YUFHRSxPQUFPLENBQUMsR0FBUixDQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBdkIsRUFBNkQsYUFBN0QsQ0FBWixFQUhGO0tBSDBEO0VBQUEsQ0FBNUQsQ0FBQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/home/niv/.atom/init.coffee
