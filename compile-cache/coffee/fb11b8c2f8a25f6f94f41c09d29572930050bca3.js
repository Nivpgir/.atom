(function() {
  var RepeatCountView;

  module.exports = RepeatCountView = (function() {
    RepeatCountView.prototype.callback = null;

    function RepeatCountView(serializedState) {
      var button, message, self;
      this.element = document.createElement('div');
      this.element.classList.add('atom-keyboard-macros');
      message = document.createElement('div');
      message.textContent = "Repeat count:";
      message.classList.add('message');
      this.element.appendChild(message);
      self = this;
      this.input = document.createElement('input');
      this.input.type = 'number';
      this.input.defaultValue = 1;
      message.appendChild(this.input);
      button = document.createElement('button');
      button.type = 'submit';
      button.textContent = 'Execute Macro';
      button.onclick = function(e) {
        if (self.callback) {
          return self.callback(self.input.value);
        }
      };
      message.appendChild(button);
    }

    RepeatCountView.prototype.serialize = function() {};

    RepeatCountView.prototype.destroy = function() {
      return this.element.remove();
    };

    RepeatCountView.prototype.getElement = function() {
      return this.element;
    };

    RepeatCountView.prototype.setCallback = function(callback) {
      return this.callback = callback;
    };

    RepeatCountView.prototype.focus = function() {
      this.input.focus();
      return this.input.select();
    };

    return RepeatCountView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYXRvbS1rZXlib2FyZC1tYWNyb3MvbGliL3JlcGVhdC1jb3VudC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxlQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDhCQUFBLFFBQUEsR0FBVSxJQUFWLENBQUE7O0FBRWEsSUFBQSx5QkFBQyxlQUFELEdBQUE7QUFFWCxVQUFBLHFCQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQVgsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsc0JBQXZCLENBREEsQ0FBQTtBQUFBLE1BSUEsT0FBQSxHQUFVLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBSlYsQ0FBQTtBQUFBLE1BS0EsT0FBTyxDQUFDLFdBQVIsR0FBc0IsZUFMdEIsQ0FBQTtBQUFBLE1BTUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFsQixDQUFzQixTQUF0QixDQU5BLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixPQUFyQixDQVBBLENBQUE7QUFBQSxNQVNBLElBQUEsR0FBTyxJQVRQLENBQUE7QUFBQSxNQVdBLElBQUMsQ0FBQSxLQUFELEdBQVMsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsT0FBdkIsQ0FYVCxDQUFBO0FBQUEsTUFZQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsR0FBYyxRQVpkLENBQUE7QUFBQSxNQWFBLElBQUMsQ0FBQSxLQUFLLENBQUMsWUFBUCxHQUFzQixDQWJ0QixDQUFBO0FBQUEsTUFpQkEsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsSUFBQyxDQUFBLEtBQXJCLENBakJBLENBQUE7QUFBQSxNQW1CQSxNQUFBLEdBQVMsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FuQlQsQ0FBQTtBQUFBLE1Bb0JBLE1BQU0sQ0FBQyxJQUFQLEdBQWMsUUFwQmQsQ0FBQTtBQUFBLE1BcUJBLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLGVBckJyQixDQUFBO0FBQUEsTUFzQkEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxDQUFELEdBQUE7QUFDZixRQUFBLElBQUcsSUFBSSxDQUFDLFFBQVI7aUJBQ0UsSUFBSSxDQUFDLFFBQUwsQ0FBYyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQXpCLEVBREY7U0FEZTtNQUFBLENBdEJqQixDQUFBO0FBQUEsTUF5QkEsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsTUFBcEIsQ0F6QkEsQ0FGVztJQUFBLENBRmI7O0FBQUEsOEJBZ0NBLFNBQUEsR0FBVyxTQUFBLEdBQUEsQ0FoQ1gsQ0FBQTs7QUFBQSw4QkFtQ0EsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFBLEVBRE87SUFBQSxDQW5DVCxDQUFBOztBQUFBLDhCQXNDQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLFFBRFM7SUFBQSxDQXRDWixDQUFBOztBQUFBLDhCQXlDQSxXQUFBLEdBQWEsU0FBQyxRQUFELEdBQUE7YUFDWCxJQUFDLENBQUEsUUFBRCxHQUFZLFNBREQ7SUFBQSxDQXpDYixDQUFBOztBQUFBLDhCQTRDQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsTUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQVAsQ0FBQSxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBQSxFQUZLO0lBQUEsQ0E1Q1AsQ0FBQTs7MkJBQUE7O01BRkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/C:/Users/MNP/.atom/packages/atom-keyboard-macros/lib/repeat-count-view.coffee
