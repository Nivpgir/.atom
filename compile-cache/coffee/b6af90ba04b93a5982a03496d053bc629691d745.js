(function() {
  var AtomKeyboardMacrosView;

  module.exports = AtomKeyboardMacrosView = (function() {
    function AtomKeyboardMacrosView(serializedState) {
      var message;
      this.element = document.createElement('div');
      this.element.classList.add('atom-keyboard-macros');
      message = document.createElement('div');
      message.textContent = "<<atom-keyboard-macros panel>>";
      message.classList.add('message');
      this.element.appendChild(message);
    }

    AtomKeyboardMacrosView.prototype.serialize = function() {};

    AtomKeyboardMacrosView.prototype.destroy = function() {
      return this.element.remove();
    };

    AtomKeyboardMacrosView.prototype.getElement = function() {
      return this.element;
    };

    AtomKeyboardMacrosView.prototype.setText = function(text) {
      this.element.children[0].textContent = text;
      this.element.children[0].style.display = 'none';
      return this.element.children[0].style.display = 'block';
    };

    return AtomKeyboardMacrosView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYXRvbS1rZXlib2FyZC1tYWNyb3MvbGliL2F0b20ta2V5Ym9hcmQtbWFjcm9zLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNCQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsZ0NBQUMsZUFBRCxHQUFBO0FBRVgsVUFBQSxPQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQVgsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsc0JBQXZCLENBREEsQ0FBQTtBQUFBLE1BSUEsT0FBQSxHQUFVLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBSlYsQ0FBQTtBQUFBLE1BS0EsT0FBTyxDQUFDLFdBQVIsR0FBc0IsZ0NBTHRCLENBQUE7QUFBQSxNQU1BLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbEIsQ0FBc0IsU0FBdEIsQ0FOQSxDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsQ0FBcUIsT0FBckIsQ0FQQSxDQUZXO0lBQUEsQ0FBYjs7QUFBQSxxQ0FZQSxTQUFBLEdBQVcsU0FBQSxHQUFBLENBWlgsQ0FBQTs7QUFBQSxxQ0FlQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ1AsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQUEsRUFETztJQUFBLENBZlQsQ0FBQTs7QUFBQSxxQ0FrQkEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxRQURTO0lBQUEsQ0FsQlosQ0FBQTs7QUFBQSxxQ0FxQkEsT0FBQSxHQUFTLFNBQUMsSUFBRCxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLFFBQVMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxXQUFyQixHQUFtQyxJQUFuQyxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsT0FBTyxDQUFDLFFBQVMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFLLENBQUMsT0FBM0IsR0FBcUMsTUFGckMsQ0FBQTthQUdBLElBQUMsQ0FBQSxPQUFPLENBQUMsUUFBUyxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQUssQ0FBQyxPQUEzQixHQUFxQyxRQUo5QjtJQUFBLENBckJULENBQUE7O2tDQUFBOztNQUZGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/C:/Users/MNP/.atom/packages/atom-keyboard-macros/lib/atom-keyboard-macros-view.coffee
