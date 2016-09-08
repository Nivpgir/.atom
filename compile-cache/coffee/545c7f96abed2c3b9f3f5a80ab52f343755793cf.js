(function() {
  var record, _fn, _i, _len, _ref;

  _ref = [['left', 'splitLeft'], ['right', 'splitRight'], ['up', 'splitUp'], ['down', 'splitDown']];
  _fn = function(_arg) {
    var direc, method;
    direc = _arg[0], method = _arg[1];
    return atom.commands.add('atom-text-editor', "custom:split-" + direc, function() {
      var curPane, newPane, _ref1, _ref2, _ref3;
      curPane = atom.workspace.getActivePane();
      newPane = curPane != null ? curPane[method]() : void 0;
      console.log(curPane != null ? (_ref1 = curPane.getItems()) != null ? _ref1.length : void 0 : void 0);
      if ((curPane != null ? (_ref2 = curPane.getItems()) != null ? _ref2.length : void 0 : void 0) > 1) {
        curPane.moveItemToPane(curPane.getActiveItem(), newPane);
        return console.log("if");
      } else {
        console.log("else");
        return console.log((_ref3 = atom.views.getView(newPane)) != null ? _ref3.dispatchEvent(new CustomEvent('application:new-file')) : void 0);
      }
    });
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    record = _ref[_i];
    _fn(record);
  }

  atom.keymap.keyBindings = atom.keymap.keyBindings.filter(function(binding, i) {
    return ['ctrl-e'].indexOf(binding.keystrokes) === -1;
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL2luaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLDJCQUFBOztBQUFBO0FBQUEsUUFLVSxTQUFDLElBQUQsR0FBQTtBQUNSLFFBQUEsYUFBQTtBQUFBLElBRFUsaUJBQU8sZ0JBQ2pCLENBQUE7V0FBQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXVDLGVBQUEsR0FBZSxLQUF0RCxFQUErRCxTQUFBLEdBQUE7QUFHN0QsVUFBQSxxQ0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQVYsQ0FBQTtBQUFBLE1BR0EsT0FBQSxxQkFBVSxPQUFTLENBQUEsTUFBQSxDQUFULENBQUEsVUFIVixDQUFBO0FBQUEsTUFLQSxPQUFPLENBQUMsR0FBUiwrREFBK0IsQ0FBRSx3QkFBakMsQ0FMQSxDQUFBO0FBTUEsTUFBQSxtRUFBc0IsQ0FBRSx5QkFBckIsR0FBOEIsQ0FBakM7QUFFRSxRQUFBLE9BQU8sQ0FBQyxjQUFSLENBQXVCLE9BQU8sQ0FBQyxhQUFSLENBQUEsQ0FBdkIsRUFBZ0QsT0FBaEQsQ0FBQSxDQUFBO2VBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFaLEVBSEY7T0FBQSxNQUFBO0FBTUUsUUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLE1BQVosQ0FBQSxDQUFBO2VBQ0EsT0FBTyxDQUFDLEdBQVIsc0RBQXVDLENBQUUsYUFBN0IsQ0FBK0MsSUFBQSxXQUFBLENBQVksc0JBQVosQ0FBL0MsVUFBWixFQVBGO09BVDZEO0lBQUEsQ0FBL0QsRUFEUTtFQUFBLENBTFY7QUFBQSxPQUFBLDJDQUFBO3NCQUFBO0FBS08sUUFBc0IsT0FBdEIsQ0FMUDtBQUFBLEdBQUE7O0FBQUEsRUF5QkEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLEdBQTBCLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQXhCLENBQStCLFNBQUMsT0FBRCxFQUFVLENBQVYsR0FBQTtXQUN2RCxDQUFDLFFBQUQsQ0FBVSxDQUFDLE9BQVgsQ0FBbUIsT0FBTyxDQUFDLFVBQTNCLENBQUEsS0FBMEMsQ0FBQSxFQURhO0VBQUEsQ0FBL0IsQ0F6QjFCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/niv/.atom/init.coffee
