(function() {
  var MainPane, TextEditorView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), TextEditorView = _ref.TextEditorView, View = _ref.View;

  module.exports = MainPane = (function(_super) {
    __extends(MainPane, _super);

    function MainPane() {
      return MainPane.__super__.constructor.apply(this, arguments);
    }

    MainPane.content = function() {
      return this.div({
        "class": 'panel-body padded'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'block'
          }, function() {
            _this.label(function() {
              _this.div({
                "class": 'settings-name'
              }, 'Command Name');
              return _this.div(function() {
                _this.span({
                  "class": 'inline-block text-subtle'
                }, 'Name of command when using ');
                return _this.span({
                  "class": 'inline-block highlight'
                }, 'build-tools:commands');
              });
            });
            _this.subview('command_name', new TextEditorView({
              mini: true
            }));
            _this.div({
              id: 'name-error-none',
              "class": 'error hidden'
            }, 'This field cannot be empty');
            return _this.div({
              id: 'name-error-used',
              "class": 'error hidden'
            }, 'Name already used in this project');
          });
          _this.div({
            "class": 'block'
          }, function() {
            _this.label(function() {
              _this.div({
                "class": 'settings-header'
              }, function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Command');
                return _this.div({
                  "class": 'wildcard-info icon-info'
                }, function() {
                  return _this.div({
                    "class": 'content'
                  }, function() {
                    _this.div({
                      "class": 'text-highlight bold'
                    }, 'Wildcards');
                    return _this.div({
                      "class": 'info'
                    }, function() {
                      _this.div({
                        "class": 'col'
                      }, function() {
                        _this.div('Current File');
                        _this.div('Base Path');
                        _this.div('Folder (rel.)');
                        return _this.div('File (no ext.)');
                      });
                      return _this.div({
                        "class": 'col'
                      }, function() {
                        _this.div({
                          "class": 'text-highlight'
                        }, '%f');
                        _this.div({
                          "class": 'text-highlight'
                        }, '%b');
                        _this.div({
                          "class": 'text-highlight'
                        }, '%d');
                        return _this.div({
                          "class": 'text-highlight'
                        }, '%e');
                      });
                    });
                  });
                });
              });
              return _this.div(function() {
                return _this.span({
                  "class": 'inline-block text-subtle'
                }, 'Command to execute ');
              });
            });
            _this.subview('command_text', new TextEditorView({
              mini: true
            }));
            return _this.div({
              id: 'command-error-none',
              "class": 'error hidden'
            }, 'This field cannot be empty');
          });
          return _this.div({
            "class": 'block'
          }, function() {
            _this.label(function() {
              _this.div({
                "class": 'settings-header'
              }, function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Working Directory');
                return _this.div({
                  "class": 'wildcard-info icon-info'
                }, function() {
                  return _this.div({
                    "class": 'content'
                  }, function() {
                    _this.div({
                      "class": 'text-highlight bold'
                    }, 'Wildcards');
                    return _this.div({
                      "class": 'info'
                    }, function() {
                      _this.div({
                        "class": 'col'
                      }, function() {
                        _this.div('Current File');
                        _this.div('Base Path');
                        _this.div('Folder (rel.)');
                        return _this.div('File (no ext.)');
                      });
                      return _this.div({
                        "class": 'col'
                      }, function() {
                        _this.div({
                          "class": 'text-highlight'
                        }, '%f');
                        _this.div({
                          "class": 'text-highlight'
                        }, '%b');
                        _this.div({
                          "class": 'text-highlight'
                        }, '%d');
                        return _this.div({
                          "class": 'text-highlight'
                        }, '%e');
                      });
                    });
                  });
                });
              });
              return _this.div(function() {
                return _this.span({
                  "class": 'inline-block text-subtle'
                }, 'Directory to execute command in');
              });
            });
            return _this.subview('working_directory', new TextEditorView({
              mini: true,
              placeholderText: '.'
            }));
          });
        };
      })(this));
    };

    MainPane.prototype.set = function(command) {
      if (command != null) {
        this.command_name.getModel().setText(command.name);
        this.command_text.getModel().setText(command.command);
        return this.working_directory.getModel().setText(command.wd);
      } else {
        this.command_name.getModel().setText('');
        this.command_text.getModel().setText('');
        return this.working_directory.getModel().setText('.');
      }
    };

    MainPane.prototype.get = function(command) {
      var c, n, w;
      if ((n = this.command_name.getModel().getText()) === '') {
        return 'Empty Name';
      }
      if ((c = this.command_text.getModel().getText()) === '') {
        return 'Empty Command';
      }
      if ((w = this.working_directory.getModel()).getText() === '') {
        w.setText('.');
      }
      command.name = n;
      command.command = c;
      command.wd = w.getText();
      return null;
    };

    return MainPane;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi92aWV3L2NvbW1hbmQtZWRpdC1tYWluLXBhbmUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9DQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUF5QixPQUFBLENBQVEsc0JBQVIsQ0FBekIsRUFBQyxzQkFBQSxjQUFELEVBQWlCLFlBQUEsSUFBakIsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFFSiwrQkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxRQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxtQkFBUDtPQUFMLEVBQWlDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDL0IsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sT0FBUDtXQUFMLEVBQXFCLFNBQUEsR0FBQTtBQUNuQixZQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sU0FBQSxHQUFBO0FBQ0wsY0FBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLGVBQVA7ZUFBTCxFQUE2QixjQUE3QixDQUFBLENBQUE7cUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFBLEdBQUE7QUFDSCxnQkFBQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsa0JBQUEsT0FBQSxFQUFPLDBCQUFQO2lCQUFOLEVBQXlDLDZCQUF6QyxDQUFBLENBQUE7dUJBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGtCQUFBLE9BQUEsRUFBTyx3QkFBUDtpQkFBTixFQUF1QyxzQkFBdkMsRUFGRztjQUFBLENBQUwsRUFG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

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/view/command-edit-main-pane.coffee
