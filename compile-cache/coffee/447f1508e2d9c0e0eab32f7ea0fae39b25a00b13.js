(function() {
  atom.commands.add('atom-text-editor', 'custom:split-right', function() {
    var items;
    items = atom.workspace.getPaneItems();
    console.log("items.length > 1" + (items.length > 1));
    if (items.length > 1) {
      return atom.commands.dispatch(atom.workspace.getActivePane(), 'pane:split-right-and-move-active-item');
    } else {
      return console.log(atom.commands.dispatch(atom.workspace.getActiveTextEditor(), 'editor:indent'));
    }
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL2luaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBRUE7QUFBQSxFQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0Msb0JBQXRDLEVBQTRELFNBQUEsR0FBQTtBQUMxRCxRQUFBLEtBQUE7QUFBQSxJQUFBLEtBQUEsR0FBUSxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQWYsQ0FBQSxDQUFSLENBQUE7QUFBQSxJQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksa0JBQUEsR0FBcUIsQ0FBQyxLQUFLLENBQUMsTUFBTixHQUFlLENBQWhCLENBQWpDLENBREEsQ0FBQTtBQUVBLElBQUEsSUFBRyxLQUFLLENBQUMsTUFBTixHQUFlLENBQWxCO2FBQ0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQXZCLEVBQXVELHVDQUF2RCxFQURGO0tBQUEsTUFBQTthQUdFLE9BQU8sQ0FBQyxHQUFSLENBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUF2QixFQUE2RCxlQUE3RCxDQUFaLEVBSEY7S0FIMEQ7RUFBQSxDQUE1RCxDQUFBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/niv/.atom/init.coffee
