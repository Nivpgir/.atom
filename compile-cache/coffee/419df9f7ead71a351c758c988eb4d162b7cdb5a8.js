(function() {
  atom.commands.add('atom-text-editor', 'custom:cut-line', function() {
    var editor;
    editor = atom.workspace.getActiveTextEditor();
    editor.selectLinesContainingCursors();
    return editor.cutSelectedText();
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL2luaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0MsaUJBQXRDLEVBQXlELFNBQUEsR0FBQTtBQUN2RCxRQUFBLE1BQUE7QUFBQSxJQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsSUFDQSxNQUFNLENBQUMsNEJBQVAsQ0FBQSxDQURBLENBQUE7V0FFQSxNQUFNLENBQUMsZUFBUCxDQUFBLEVBSHVEO0VBQUEsQ0FBekQsQ0FBQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/home/niv/.atom/init.coffee
