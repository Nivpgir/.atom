(function() {
  atom.commands.add('atom-text-editor', 'custom:split-right', function() {
    var items;
    items = atom.workspace.getPaneItems();
    console.log(items);
    if (items.length > 1) {
      return atom.commands.dispatch(atom.workspace.getActivePane(), 'split-right-and-move-active-item');
    } else {
      return atom.commands.dispatch(atom.workspace.getActivePane(), 'split-right');
    }
  });

  atom.commands.add('atom-text-editor', 'custom:split-left', function() {
    var items;
    items = atom.workspace.getPaneItems();
    console.log(items);
    if (items.length > 1) {
      return atom.commands.dispatch(atom.workspace.getActivePane(), 'split-left-and-move-active-item');
    } else {
      return atom.commands.dispatch(atom.workspace.getActivePane(), 'split-left');
    }
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL2luaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0Msb0JBQXRDLEVBQTRELFNBQUEsR0FBQTtBQUMxRCxRQUFBLEtBQUE7QUFBQSxJQUFBLEtBQUEsR0FBUSxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQWYsQ0FBQSxDQUFSLENBQUE7QUFBQSxJQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksS0FBWixDQURBLENBQUE7QUFFQSxJQUFBLElBQUcsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFsQjthQUNFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUF2QixFQUF1RCxrQ0FBdkQsRUFERjtLQUFBLE1BQUE7YUFHRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBdkIsRUFBdUQsYUFBdkQsRUFIRjtLQUgwRDtFQUFBLENBQTVELENBQUEsQ0FBQTs7QUFBQSxFQVFBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0MsbUJBQXRDLEVBQTJELFNBQUEsR0FBQTtBQUN6RCxRQUFBLEtBQUE7QUFBQSxJQUFBLEtBQUEsR0FBUSxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQWYsQ0FBQSxDQUFSLENBQUE7QUFBQSxJQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksS0FBWixDQURBLENBQUE7QUFFQSxJQUFBLElBQUcsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFsQjthQUNFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUF2QixFQUF1RCxpQ0FBdkQsRUFERjtLQUFBLE1BQUE7YUFHRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBdkIsRUFBdUQsWUFBdkQsRUFIRjtLQUh5RDtFQUFBLENBQTNELENBUkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/niv/.atom/init.coffee
