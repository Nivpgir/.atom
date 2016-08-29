(function() {
  var MainInfoPane;

  module.exports = MainInfoPane = (function() {
    function MainInfoPane(command) {
      var k, keys, value, values, _i, _len, _ref;
      this.element = document.createElement('div');
      this.element.classList.add('module');
      keys = document.createElement('div');
      keys.innerHTML = '<div class="text-padded">Command:</div>\n<div class="text-padded">Working Directory:</div>';
      values = document.createElement('div');
      _ref = ['command', 'wd'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        k = _ref[_i];
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command[k]);
        values.appendChild(value);
      }
      this.element.appendChild(keys);
      this.element.appendChild(values);
    }

    return MainInfoPane;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi92aWV3L2NvbW1hbmQtaW5mby1tYWluLXBhbmUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFlBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBRVMsSUFBQSxzQkFBQyxPQUFELEdBQUE7QUFDWCxVQUFBLHNDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQVgsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsUUFBdkIsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFBLEdBQU8sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FGUCxDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsU0FBTCxHQUFpQiw0RkFIakIsQ0FBQTtBQUFBLE1BT0EsTUFBQSxHQUFTLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBUFQsQ0FBQTtBQVFBO0FBQUEsV0FBQSwyQ0FBQTtxQkFBQTtBQUNFLFFBQUEsS0FBQSxHQUFRLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQVIsQ0FBQTtBQUFBLFFBQ0EsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFoQixDQUFvQixhQUFwQixDQURBLENBQUE7QUFBQSxRQUVBLEtBQUssQ0FBQyxTQUFOLEdBQWtCLE1BQUEsQ0FBTyxPQUFRLENBQUEsQ0FBQSxDQUFmLENBRmxCLENBQUE7QUFBQSxRQUdBLE1BQU0sQ0FBQyxXQUFQLENBQW1CLEtBQW5CLENBSEEsQ0FERjtBQUFBLE9BUkE7QUFBQSxNQWFBLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixJQUFyQixDQWJBLENBQUE7QUFBQSxNQWNBLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixNQUFyQixDQWRBLENBRFc7SUFBQSxDQUFiOzt3QkFBQTs7TUFISixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/view/command-info-main-pane.coffee
