(function() {
  var OneLineInputView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module.exports = OneLineInputView = (function() {
    OneLineInputView.prototype.callback = null;

    OneLineInputView.prototype.element = null;

    OneLineInputView.prototype.editorElement = null;

    OneLineInputView.prototype.editor = null;

    function OneLineInputView(serializedState, placeholderText) {
      var self;
      if (placeholderText == null) {
        placeholderText = 'Macro name';
      }
      this.escapeListener = __bind(this.escapeListener, this);
      this.element = document.createElement('div');
      this.element.classList.add('atom-keyboard-macros');
      this.editorElement = document.createElement('atom-text-editor');
      this.editor = atom.workspace.buildTextEditor({
        mini: true,
        lineNumberGutterVisible: false,
        placeholderText: placeholderText
      });
      this.editorElement.setModel(this.editor);
      self = this;
      this.editorElement.onkeydown = function(e) {
        var value;
        if (e.keyIdentifier === 'Enter') {
          value = self.editor.getText();
          self.clearText();
          self.hide();
          return typeof self.callback === "function" ? self.callback(value) : void 0;
        }
      };
      this.element.appendChild(this.editorElement);
    }

    OneLineInputView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this.element
        });
      }
      this.panel.show();
      window.addEventListener('keydown', this.escapeListener, true);
      return this.focus();
    };

    OneLineInputView.prototype.hide = function() {
      var _base;
      return typeof (_base = this.panel).hide === "function" ? _base.hide() : void 0;
    };

    OneLineInputView.prototype.escapeListener = function(e) {
      var keystroke;
      keystroke = atom.keymaps.keystrokeForKeyboardEvent(e);
      if (keystroke === 'escape') {
        this.hide();
        return window.removeEventListener('keydown', this.escapeListener, true);
      }
    };

    OneLineInputView.prototype.focus = function() {
      return this.editorElement.focus();
    };

    OneLineInputView.prototype.clearText = function() {
      return this.editor.setText('');
    };

    OneLineInputView.prototype.serialize = function() {};

    OneLineInputView.prototype.destroy = function() {
      return this.element.remove();
    };

    OneLineInputView.prototype.getElement = function() {
      return this.element;
    };

    OneLineInputView.prototype.setCallback = function(callback) {
      return this.callback = callback;
    };

    return OneLineInputView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYXRvbS1rZXlib2FyZC1tYWNyb3MvbGliL29uZS1saW5lLWlucHV0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osK0JBQUEsUUFBQSxHQUFVLElBQVYsQ0FBQTs7QUFBQSwrQkFDQSxPQUFBLEdBQVMsSUFEVCxDQUFBOztBQUFBLCtCQUVBLGFBQUEsR0FBZSxJQUZmLENBQUE7O0FBQUEsK0JBR0EsTUFBQSxHQUFRLElBSFIsQ0FBQTs7QUFLYSxJQUFBLDBCQUFDLGVBQUQsRUFBa0IsZUFBbEIsR0FBQTtBQUVYLFVBQUEsSUFBQTs7UUFGNkIsa0JBQWtCO09BRS9DO0FBQUEsNkRBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLHNCQUF2QixDQURBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxhQUFELEdBQWlCLFFBQVEsQ0FBQyxhQUFULENBQXVCLGtCQUF2QixDQUhqQixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZixDQUErQjtBQUFBLFFBQ3ZDLElBQUEsRUFBTSxJQURpQztBQUFBLFFBRXZDLHVCQUFBLEVBQXlCLEtBRmM7QUFBQSxRQUd2QyxlQUFBLEVBQWlCLGVBSHNCO09BQS9CLENBSlYsQ0FBQTtBQUFBLE1BU0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxRQUFmLENBQXdCLElBQUMsQ0FBQSxNQUF6QixD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

//# sourceURL=/C:/Users/MNP/.atom/packages/atom-keyboard-macros/lib/one-line-input-view.coffee
