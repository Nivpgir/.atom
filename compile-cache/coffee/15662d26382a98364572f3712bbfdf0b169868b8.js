(function() {
  atom.commands.add('atom-text-editor', 'custom:split-right', function() {
    var items;
    items = atom.workspace.getPaneItems();
    console.log("items.length > 1" + (items.length > 1));
    if (items.length > 1) {
      atom.commands.dispatch(atom.workspace.getActivePane(), 'split-right-and-move-active-item');
    } else {

    }
    return atom.commands.dispatch(atom.workspace.getActivePane(), 'split-right');
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL2luaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBRUE7QUFBQSxFQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0Msb0JBQXRDLEVBQTRELFNBQUEsR0FBQTtBQUMxRCxRQUFBLEtBQUE7QUFBQSxJQUFBLEtBQUEsR0FBUSxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQWYsQ0FBQSxDQUFSLENBQUE7QUFBQSxJQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksa0JBQUEsR0FBcUIsQ0FBQyxLQUFLLENBQUMsTUFBTixHQUFlLENBQWhCLENBQWpDLENBREEsQ0FBQTtBQUVBLElBQUEsSUFBRyxLQUFLLENBQUMsTUFBTixHQUFlLENBQWxCO0FBQ0UsTUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBdkIsRUFBdUQsa0NBQXZELENBQUEsQ0FERjtLQUFBLE1BQUE7QUFBQTtLQUZBO1dBS0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQXZCLEVBQXVELGFBQXZELEVBTjBEO0VBQUEsQ0FBNUQsQ0FBQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/home/niv/.atom/init.coffee
