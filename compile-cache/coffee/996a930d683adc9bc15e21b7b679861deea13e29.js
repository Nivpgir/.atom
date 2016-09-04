(function() {
  var $, ConsoleView, TextEditorView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  module.exports = ConsoleView = (function(_super) {
    __extends(ConsoleView, _super);

    function ConsoleView() {
      this.removeTab = __bind(this.removeTab, this);
      this.focusTab = __bind(this.focusTab, this);
      this.createTab = __bind(this.createTab, this);
      this.endResize = __bind(this.endResize, this);
      this.resize = __bind(this.resize, this);
      this.startResize = __bind(this.startResize, this);
      return ConsoleView.__super__.constructor.apply(this, arguments);
    }

    ConsoleView.content = function() {
      return this.div({
        "class": 'console'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'header'
          }, function() {
            _this.div({
              "class": 'name bold',
              outlet: 'name'
            });
            return _this.div({
              "class": 'icons'
            }, function() {
              return _this.div({
                "class": 'icon-x',
                outlet: 'close_view'
              });
            });
          });
          return _this.div({
            "class": 'console-container',
            outlet: 'console'
          }, function() {
            _this.div({
              "class": 'tabs'
            }, function() {
              _this.span({
                "class": 'icon icon-three-bars'
              });
              return _this.ul({
                "class": 'tab-list',
                outlet: 'tabs'
              });
            });
            _this.div({
              tabindex: '-1',
              "class": 'output-container native-key-bindings',
              outlet: 'output'
            });
            return _this.div({
              "class": 'input-container',
              outlet: 'input_container'
            }, function() {
              return _this.subview('input', new TextEditorView({
                mini: true,
                placeholderText: 'Write to standard input'
              }));
            });
          });
        };
      })(this));
    };

    ConsoleView.prototype.initialize = function(model) {
      this.model = model;
      this.close_view.on('click', (function(_this) {
        return function() {
          return _this.hide();
        };
      })(this));
      this.on('mousedown', '.header', this.startResize);
      this.model.onCreateTab(this.createTab);
      this.model.onFocusTab(this.focusTab);
      this.model.onRemoveTab(this.removeTab);
      return this.active = null;
    };

    ConsoleView.prototype.attached = function() {
      return this.disposable = atom.commands.add(this.input.element, {
        'core:confirm': (function(_this) {
          return function() {
            var t, _base;
            t = _this.input.getModel().getText();
            _this.input.getModel().setText('');
            return typeof (_base = _this.active).input === "function" ? _base.input("" + t + "\n") : void 0;
          };
        })(this)
      });
    };

    ConsoleView.prototype.detached = function() {
      return this.disposable.dispose();
    };

    ConsoleView.prototype.hideInput = function() {
      this.input_container.addClass('hidden');
      return atom.views.getView(atom.workspace).focus();
    };

    ConsoleView.prototype.startResize = function(e) {
      $(document).on('mousemove', this.resize);
      $(document).on('mouseup', this.endResize);
      return this.padding = $(document.body).height() - (e.clientY + this.find('.output-container').height());
    };

    ConsoleView.prototype.resize = function(_arg) {
      var pageY, which;
      pageY = _arg.pageY, which = _arg.which;
      if (which !== 1) {
        return this.endResize();
      }
      return this.find('.output-container').height($(document.body).height() - pageY - this.padding);
    };

    ConsoleView.prototype.endResize = function() {
      $(document).off('mousemove', this.resize);
      return $(document).off('mouseup', this.endResize);
    };

    ConsoleView.prototype.createTab = function(tab) {
      this.tabs.append(tab.header);
      return tab.header.on('click', '.clicker', function() {
        return tab.focus();
      });
    };

    ConsoleView.prototype.focusTab = function(tab) {
      this.show();
      this.tabs.find('.active').removeClass('active');
      this.output.find('.output').addClass('hidden');
      this.active = tab;
      this.name.empty();
      if (tab == null) {
        return this.hide();
      }
      tab.header.addClass('active');
      this.name.append(tab.getHeader());
      if (this.active.view.hasClass('hidden')) {
        this.active.view.removeClass('hidden');
      } else {
        this.output.append(this.active.view);
      }
      return this.input_container[this.active.input != null ? 'removeClass' : 'addClass']('hidden');
    };

    ConsoleView.prototype.removeTab = function(tab) {
      if (this.active === tab) {
        $(tab.title).remove();
        this.focusTab(this.getNextTab());
      }
      tab.header.remove();
      return tab.view.remove();
    };

    ConsoleView.prototype.getNextTab = function() {
      var header, index, tab, _i, _len, _ref1;
      if (this.tabs.children().length <= 1) {
        return;
      }
      _ref1 = this.tabs.children();
      for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
        tab = _ref1[index];
        if (tab === this.active.header[0]) {
          if (index === this.tabs.children().length - 1) {
            header = this.tabs.children()[index - 1];
            return this.model.getTab({
              project: header.attributes.getNamedItem('project').value,
              name: header.attributes.getNamedItem('name').value
            });
          } else {
            header = this.tabs.children()[index + 1];
            return this.model.getTab({
              project: header.attributes.getNamedItem('project').value,
              name: header.attributes.getNamedItem('name').value
            });
          }
        }
      }
    };

    return ConsoleView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9jb25zb2xlL2NvbnNvbGUtZWxlbWVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMENBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxPQUE0QixPQUFBLENBQVEsc0JBQVIsQ0FBNUIsRUFBQyxTQUFBLENBQUQsRUFBSSxzQkFBQSxjQUFKLEVBQW9CLFlBQUEsSUFBcEIsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDSixrQ0FBQSxDQUFBOzs7Ozs7Ozs7O0tBQUE7O0FBQUEsSUFBQSxXQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxTQUFQO09BQUwsRUFBdUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNyQixVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxRQUFQO1dBQUwsRUFBc0IsU0FBQSxHQUFBO0FBQ3BCLFlBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLFdBQVA7QUFBQSxjQUFvQixNQUFBLEVBQVEsTUFBNUI7YUFBTCxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLE9BQVA7YUFBTCxFQUFxQixTQUFBLEdBQUE7cUJBQ25CLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxnQkFBQSxPQUFBLEVBQU8sUUFBUDtBQUFBLGdCQUFpQixNQUFBLEVBQVEsWUFBekI7ZUFBTCxFQURtQjtZQUFBLENBQXJCLEVBRm9CO1VBQUEsQ0FBdEIsQ0FBQSxDQUFBO2lCQUlBLEtB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

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/console/console-element.coffee
