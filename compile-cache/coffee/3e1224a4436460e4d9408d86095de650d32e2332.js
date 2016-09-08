(function() {
  var record, _fn, _i, _len, _ref;

  _ref = [['left', 'splitLeft'], ['right', 'splitRight'], ['up', 'splitUp'], ['down', 'splitDown']];
  _fn = function(_arg) {
    var direc, method;
    direc = _arg[0], method = _arg[1];
    return atom.commands.add('atom-text-editor', "custom:split-" + direc, function() {
      var curPane, items, newPane, _ref1;
      items = atom.workspace.getPaneItems();
      curPane = atom.workspace.getActivePane();
      newPane = curPane != null ? curPane[method]() : void 0;
      console.log(items);
      if ((items != null ? items.length : void 0) > 1) {
        curPane.moveItemToPane(curPane.getActiveItem(), newPane);
        return console.log("if");
      } else {
        console.log("else");
        return console.log((_ref1 = atom.views.getView(newPane)) != null ? _ref1.dispatchEvent(new CustomEvent('application:new-file')) : void 0);
      }
    });
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    record = _ref[_i];
    _fn(record);
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL2luaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBRUE7QUFBQSxNQUFBLDJCQUFBOztBQUFBO0FBQUEsUUFLVSxTQUFDLElBQUQsR0FBQTtBQUNSLFFBQUEsYUFBQTtBQUFBLElBRFUsaUJBQU8sZ0JBQ2pCLENBQUE7V0FBQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXVDLGVBQUEsR0FBZSxLQUF0RCxFQUErRCxTQUFBLEdBQUE7QUFDN0QsVUFBQSw4QkFBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBZixDQUFBLENBQVIsQ0FBQTtBQUFBLE1BRUEsT0FBQSxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBRlYsQ0FBQTtBQUFBLE1BSUEsT0FBQSxxQkFBVSxPQUFTLENBQUEsTUFBQSxDQUFULENBQUEsVUFKVixDQUFBO0FBQUEsTUFNQSxPQUFPLENBQUMsR0FBUixDQUFZLEtBQVosQ0FOQSxDQUFBO0FBT0EsTUFBQSxxQkFBRyxLQUFLLENBQUUsZ0JBQVAsR0FBZ0IsQ0FBbkI7QUFFRSxRQUFBLE9BQU8sQ0FBQyxjQUFSLENBQXVCLE9BQU8sQ0FBQyxhQUFSLENBQUEsQ0FBdkIsRUFBZ0QsT0FBaEQsQ0FBQSxDQUFBO2VBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFaLEVBSEY7T0FBQSxNQUFBO0FBTUUsUUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLE1BQVosQ0FBQSxDQUFBO2VBQ0EsT0FBTyxDQUFDLEdBQVIsc0RBQXVDLENBQUUsYUFBN0IsQ0FBK0MsSUFBQSxXQUFBLENBQVksc0JBQVosQ0FBL0MsVUFBWixFQVBGO09BUjZEO0lBQUEsQ0FBL0QsRUFEUTtFQUFBLENBTFY7QUFBQSxPQUFBLDJDQUFBO3NCQUFBO0FBS08sUUFBc0IsT0FBdEIsQ0FMUDtBQUFBLEdBQUE7QUFBQSIKfQ==

//# sourceURL=/home/niv/.atom/init.coffee
