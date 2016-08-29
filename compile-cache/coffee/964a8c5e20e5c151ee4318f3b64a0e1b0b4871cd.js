(function() {
  var AskView, TextEditorView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), View = _ref.View, TextEditorView = _ref.TextEditorView;

  module.exports = AskView = (function(_super) {
    __extends(AskView, _super);

    function AskView() {
      this.cancel = __bind(this.cancel, this);
      this.accept = __bind(this.accept, this);
      return AskView.__super__.constructor.apply(this, arguments);
    }

    AskView.content = function() {
      return this.div({
        "class": 'ask-view'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'block'
          }, function() {
            _this.label(function() {
              return _this.div({
                "class": 'settings-name'
              }, 'Command');
            });
            _this.subview('command', new TextEditorView({
              mini: true
            }));
            return _this.div({
              id: 'command-none',
              "class": 'error hidden'
            }, 'Command cannot be empty');
          });
          return _this.div({
            "class": 'buttons'
          }, function() {
            _this.div({
              "class": 'btn btn-error icon icon-x inline-block-tight'
            }, 'Cancel');
            return _this.div({
              "class": 'btn btn-primary icon icon-check inline-block-tight'
            }, 'Accept');
          });
        };
      })(this));
    };

    AskView.prototype.initialize = function(command, callback) {
      this.callback = callback;
      this.Command = this.command.getModel();
      this.cancelling = false;
      this.on('click', '.buttons .icon-x', this.cancel);
      this.on('click', '.buttons .icon-check', this.accept);
      atom.commands.add(this.element, {
        'core:confirm': this.accept,
        'core:cancel': this.cancel
      });
      this.on('mousedown', function() {
        return false;
      });
      this.command.on('blur', (function(_this) {
        return function() {
          if (!_this.cancelling) {
            return _this.cancel();
          }
        };
      })(this));
      this.Command.setText(command);
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.command.focus();
    };

    AskView.prototype.accept = function(event) {
      var c;
      this.cancelling = true;
      this.find('.error').addClass('hidden');
      if ((c = this.Command.getText()) !== '') {
        this.callback(c);
        this.hide();
      } else {
        this.find('.error').removeClass('hidden');
      }
      return event.stopPropagation();
    };

    AskView.prototype.cancel = function(event) {
      this.cancelling = true;
      this.hide();
      return event != null ? event.stopPropagation() : void 0;
    };

    AskView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    return AskView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi92aWV3L2Fzay12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQ0FBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLE9BQXlCLE9BQUEsQ0FBUSxzQkFBUixDQUF6QixFQUFDLFlBQUEsSUFBRCxFQUFPLHNCQUFBLGNBQVAsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDSiw4QkFBQSxDQUFBOzs7Ozs7S0FBQTs7QUFBQSxJQUFBLE9BQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLFVBQVA7T0FBTCxFQUF3QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3RCLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLE9BQVA7V0FBTCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsWUFBQSxLQUFDLENBQUEsS0FBRCxDQUFPLFNBQUEsR0FBQTtxQkFDTCxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLGVBQVA7ZUFBTCxFQUE2QixTQUE3QixFQURLO1lBQUEsQ0FBUCxDQUFBLENBQUE7QUFBQSxZQUVBLEtBQUMsQ0FBQSxPQUFELENBQVMsU0FBVCxFQUF3QixJQUFBLGNBQUEsQ0FBZTtBQUFBLGNBQUEsSUFBQSxFQUFNLElBQU47YUFBZixDQUF4QixDQUZBLENBQUE7bUJBR0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsRUFBQSxFQUFJLGNBQUo7QUFBQSxjQUFvQixPQUFBLEVBQU8sY0FBM0I7YUFBTCxFQUFnRCx5QkFBaEQsRUFKbUI7VUFBQSxDQUFyQixD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

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/view/ask-view.coffee
