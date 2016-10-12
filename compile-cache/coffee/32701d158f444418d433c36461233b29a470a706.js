(function() {
  var AtomIncrement, CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = AtomIncrement = {
    subscriptions: null,
    config: {
      orderByClick: {
        type: 'boolean',
        "default": false,
        description: 'general : follows click order or not'
      },
      incSize: {
        type: 'integer',
        "default": 1,
        minimum: 1,
        description: 'incNumber : Increment amount between 2 consecutive values'
      },
      incValue: {
        type: 'integer',
        "default": 0,
        minimum: 0,
        description: 'incNumber : Increment start value'
      },
      stringsOfSameSize: {
        type: 'boolean',
        "default": true,
        description: 'incString : are string increment the same size or not'
      },
      stringsUpperCase: {
        type: 'boolean',
        "default": false,
        description: 'incString : are string increment in uppercase'
      },
      stringsLeftToRight: {
        type: 'boolean',
        "default": false,
        description: 'incString : are string increment read from left to right'
      },
      stringsMinimumSize: {
        type: 'integer',
        "default": 3,
        minimum: 1,
        description: 'incString : minimum size of string, only used when stringsOfSameSize=true'
      },
      integersOfSameSize: {
        type: 'boolean',
        "default": false,
        description: 'incNumber : are integer increment the same size or not'
      },
      integersMinimumSize: {
        type: 'integer',
        "default": 3,
        minimum: 1,
        description: 'incNumber : minimum size of integer, only used when integersOfSameSize=true'
      }
    },
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-increment:incNumber': (function(_this) {
          return function() {
            return _this.increment('number');
          };
        })(this)
      }));
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-increment:incString': (function(_this) {
          return function() {
            return _this.increment('string');
          };
        })(this)
      }));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    increment: function(type) {
      var checkpoint, editor, i, incSize, incValue, isFromLeftToRight, isIntSameSize, isSameSize, isUpperCase, j, k, lineList, minIntSize, minStringSize, nbLines, orderByClick, result, sel, selectionList, _i, _j, _k, _l, _ref, _ref1, _ref2, _ref3;
      if (type !== "number" && type !== "string") {
        return console.log("Error -- increment type unknown -- skipping");
      } else {
        if (editor = atom.workspace.getActiveTextEditor()) {
          isSameSize = atom.config.get('atom-increment.stringsOfSameSize');
          isUpperCase = atom.config.get('atom-increment.stringsUpperCase');
          isFromLeftToRight = atom.config.get('atom-increment.stringsLeftToRight');
          minStringSize = atom.config.get('atom-increment.stringsMinimumSize');
          orderByClick = atom.config.get('atom-increment.orderByClick');
          isIntSameSize = atom.config.get('atom-increment.integersOfSameSize');
          minIntSize = atom.config.get('atom-increment.integersMinimumSize');
          if (type === "number") {
            incValue = atom.config.get('atom-increment.incValue');
            incSize = atom.config.get('atom-increment.incSize');
          } else if (type === "string") {
            incValue = 0;
            incSize = 1;
          }
          selectionList = [];
          if (!orderByClick) {
            selectionList = editor.getSelectionsOrderedByBufferPosition();
          } else {
            selectionList = editor.getSelections();
          }
          checkpoint = editor.createCheckpoint();
          for (i = _i = 0, _ref = selectionList.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            if (type === 'number') {
              result = incValue.toString();
              if (isIntSameSize) {
                if (minIntSize > result.length) {
                  for (k = _j = 0, _ref1 = minIntSize - result.length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; k = 0 <= _ref1 ? ++_j : --_j) {
                    result = '0' + result;
                  }
                }
              }
            } else if (type === 'string') {
              result = this.convertIntegerToString(incValue.toString(), isUpperCase, isFromLeftToRight, minStringSize, isSameSize);
            }
            sel = selectionList[i];
            lineList = sel.getText().split(/\n/);
            nbLines = lineList.length;
            if (nbLines > 1) {
              for (j = _k = 1, _ref2 = nbLines - 1; 1 <= _ref2 ? _k <= _ref2 : _k >= _ref2; j = 1 <= _ref2 ? ++_k : --_k) {
                incValue = incValue + incSize;
                if (!(j === nbLines - 1 && lineList[j] === "")) {
                  if (type === 'number') {
                    result = result + '\n';
                    if (isIntSameSize) {
                      if (minIntSize > incValue.toString().length) {
                        for (k = _l = 0, _ref3 = minIntSize - incValue.toString().length - 1; 0 <= _ref3 ? _l <= _ref3 : _l >= _ref3; k = 0 <= _ref3 ? ++_l : --_l) {
                          result = result + '0';
                        }
                      }
                    }
                    result = result + incValue.toString();
                  } else if (type === 'string') {
                    result = result + '\n' + this.convertIntegerToString(incValue.toString(), isUpperCase, isFromLeftToRight, minStringSize, isSameSize);
                  }
                }
                if (j === nbLines - 1) {
                  result = result + '\n';
                }
              }
            } else {
              incValue = incValue + incSize;
            }
            sel.insertText(result);
          }
          return editor.groupChangesSinceCheckpoint(checkpoint);
        }
      }
    },
    convertIntegerToString: function(num, isUpper, readL2R, minSize, sameSize) {
      var base26, m, n, value, _i, _j, _ref, _ref1;
      base26 = (num >>> 0).toString(26);
      value = '';
      for (m = _i = 0, _ref = base26.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; m = 0 <= _ref ? ++_i : --_i) {
        value = this.getReturnValue(value, isUpper, readL2R, base26[m]);
      }
      if (sameSize) {
        if (minSize > value.length) {
          for (n = _j = 0, _ref1 = minSize - value.length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; n = 0 <= _ref1 ? ++_j : --_j) {
            value = this.getReturnValue(value, isUpper, !readL2R, '0');
          }
        }
      }
      return value;
    },
    getReturnValue: function(currentValue, isUpper, readL2R, ind) {
      var returnValue, tabCharLower, tabCharUpper;
      tabCharLower = {
        '0': 'a',
        '1': 'b',
        '2': 'c',
        '3': 'd',
        '4': 'e',
        '5': 'f',
        '6': 'g',
        '7': 'h',
        '8': 'i',
        '9': 'j',
        'a': 'k',
        'b': 'l',
        'c': 'm',
        'd': 'n',
        'e': 'o',
        'f': 'p',
        'g': 'q',
        'h': 'r',
        'i': 's',
        'j': 't',
        'k': 'u',
        'l': 'v',
        'm': 'w',
        'n': 'x',
        'o': 'y',
        'p': 'z'
      };
      tabCharUpper = {
        '0': 'A',
        '1': 'B',
        '2': 'C',
        '3': 'D',
        '4': 'E',
        '5': 'F',
        '6': 'G',
        '7': 'H',
        '8': 'I',
        '9': 'J',
        'a': 'K',
        'b': 'L',
        'c': 'M',
        'd': 'N',
        'e': 'O',
        'f': 'P',
        'g': 'Q',
        'h': 'R',
        'i': 'S',
        'j': 'T',
        'k': 'U',
        'l': 'V',
        'm': 'W',
        'n': 'X',
        'o': 'Y',
        'p': 'Z'
      };
      returnValue = '';
      if (isUpper) {
        if (!readL2R) {
          returnValue = currentValue + tabCharUpper[ind];
        } else {
          returnValue = tabCharUpper[ind] + currentValue;
        }
      } else {
        if (!readL2R) {
          returnValue = currentValue + tabCharLower[ind];
        } else {
          returnValue = tabCharLower[ind] + currentValue;
        }
      }
      return returnValue;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYXRvbS1pbmNyZW1lbnQvbGliL2F0b20taW5jcmVtZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQ0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsYUFBQSxHQUNmO0FBQUEsSUFBQSxhQUFBLEVBQWUsSUFBZjtBQUFBLElBRUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLHNDQUZiO09BREY7QUFBQSxNQUlBLE9BQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxDQURUO0FBQUEsUUFFQSxPQUFBLEVBQVMsQ0FGVDtBQUFBLFFBR0EsV0FBQSxFQUFhLDJEQUhiO09BTEY7QUFBQSxNQVNBLFFBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxDQURUO0FBQUEsUUFFQSxPQUFBLEVBQVMsQ0FGVDtBQUFBLFFBR0EsV0FBQSxFQUFhLG1DQUhiO09BVkY7QUFBQSxNQWNBLGlCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLHVEQUZiO09BZkY7QUFBQSxNQWtCQSxnQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSwrQ0FGYjtPQW5CRjtBQUFBLE1Bc0JBLGtCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLDBEQUZiO09BdkJGO0FBQUEsTUEwQkEsa0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxDQURUO0FBQUEsUUFFQSxPQUFBLEVBQVMsQ0FGVDtBQUFBLFFBR0EsV0FBQSxFQUFhLDJFQUhiO09BM0JGO0FBQUEsTUFnQ0Esa0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsd0RBRmI7T0FqQ0Y7QUFBQSxNQW9DQSxtQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLENBRFQ7QUFBQSxRQUVBLE9BQUEsRUFBUyxDQUZUO0FBQUEsUUFHQSxXQUFBLEVBQWEsNkVBSGI7T0FyQ0Y7S0FIRjtBQUFBLElBK0NBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFFUixNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDakI7QUFBQSxRQUFBLDBCQUFBLEVBQTRCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxTQUFELENBQVcsUUFBWCxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBNUI7T0FEaUIsQ0FBbkIsQ0FIQSxDQUFBO2FBS0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDakI7QUFBQSxRQUFBLDBCQUFBLEVBQTRCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxTQUFELENBQVcsUUFBWCxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBNUI7T0FEaUIsQ0FBbkIsRUFQUTtJQUFBLENBL0NWO0FBQUEsSUEwREEsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLEVBRFU7SUFBQSxDQTFEWjtBQUFBLElBOERBLFNBQUEsRUFBVyxTQUFDLElBQUQsR0FBQTtBQUNULFVBQUEsNE9BQUE7QUFBQSxNQUFBLElBQUksSUFBQSxLQUFRLFFBQVIsSUFBb0IsSUFBQSxLQUFRLFFBQWhDO2VBQ0UsT0FBTyxDQUFDLEdBQVIsQ0FBWSw2Q0FBWixFQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsSUFBRyxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVo7QUFDRSxVQUFBLFVBQUEsR0FBYSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0NBQWhCLENBQWIsQ0FBQTtBQUFBLFVBQ0EsV0FBQSxHQUFjLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpQ0FBaEIsQ0FEZCxDQUFBO0FBQUEsVUFFQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUNBQWhCLENBRnBCLENBQUE7QUFBQSxVQUdBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1DQUFoQixDQUhoQixDQUFBO0FBQUEsVUFJQSxZQUFBLEdBQWUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixDQUpmLENBQUE7QUFBQSxVQU1BLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1DQUFoQixDQU5oQixDQUFBO0FBQUEsVUFPQSxVQUFBLEdBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9DQUFoQixDQVBiLENBQUE7QUFTQSxVQUFBLElBQUksSUFBQSxLQUFRLFFBQVo7QUFDRSxZQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUJBQWhCLENBQVgsQ0FBQTtBQUFBLFlBQ0EsT0FBQSxHQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsQ0FEVixDQURGO1dBQUEsTUFHSyxJQUFJLElBQUEsS0FBUSxRQUFaO0FBQ0gsWUFBQSxRQUFBLEdBQVcsQ0FBWCxDQUFBO0FBQUEsWUFDQSxPQUFBLEdBQVUsQ0FEVixDQURHO1dBWkw7QUFBQSxVQWdCQSxhQUFBLEdBQWdCLEVBaEJoQixDQUFBO0FBaUJBLFVBQUEsSUFBSSxDQUFBLFlBQUo7QUFDRSxZQUFBLGFBQUEsR0FBZ0IsTUFBTSxDQUFDLG9DQUFQLENBQUEsQ0FBaEIsQ0FERjtXQUFBLE1BQUE7QUFHRSxZQUFBLGFBQUEsR0FBZ0IsTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFoQixDQUhGO1dBakJBO0FBQUEsVUFzQkEsVUFBQSxHQUFhLE1BQU0sQ0FBQyxnQkFBUCxDQUFBLENBdEJiLENBQUE7QUF3QkEsZUFBUyw2R0FBVCxHQUFBO0FBQ0UsWUFBQSxJQUFJLElBQUEsS0FBUSxRQUFaO0FBQ0UsY0FBQSxNQUFBLEdBQVMsUUFBUSxDQUFDLFFBQVQsQ0FBQSxDQUFULENBQUE7QUFDQSxjQUFBLElBQUksYUFBSjtBQUNFLGdCQUFBLElBQUksVUFBQSxHQUFhLE1BQU0sQ0FBQyxNQUF4QjtBQUNFLHVCQUFTLHdIQUFULEdBQUE7QUFDRSxvQkFBQSxNQUFBLEdBQVMsR0FBQSxHQUFNLE1BQWYsQ0FERjtBQUFBLG1CQURGO2lCQURGO2VBRkY7YUFBQSxNQU1LLElBQUksSUFBQSxLQUFRLFFBQVo7QUFDSCxjQUFBLE1BQUEsR0FBUyxJQUFDLENBQUEsc0JBQUQsQ0FBd0IsUUFBUSxDQUFDLFFBQVQsQ0FBQSxDQUF4QixFQUE2QyxXQUE3QyxFQUNSLGlCQURRLEVBQ1csYUFEWCxFQUMwQixVQUQxQixDQUFULENBREc7YUFOTDtBQUFBLFlBVUEsR0FBQSxHQUFNLGFBQWMsQ0FBQSxDQUFBLENBVnBCLENBQUE7QUFBQSxZQVdBLFFBQUEsR0FBVyxHQUFHLENBQUMsT0FBSixDQUFBLENBQWEsQ0FBQyxLQUFkLENBQW9CLElBQXBCLENBWFgsQ0FBQTtBQUFBLFlBWUEsT0FBQSxHQUFVLFFBQVEsQ0FBQyxNQVpuQixDQUFBO0FBYUEsWUFBQSxJQUFJLE9BQUEsR0FBVSxDQUFkO0FBQ0UsbUJBQVMscUdBQVQsR0FBQTtBQUNFLGdCQUFBLFFBQUEsR0FBVyxRQUFBLEdBQVcsT0FBdEIsQ0FBQTtBQUNBLGdCQUFBLElBQUcsQ0FBQSxDQUFFLENBQUEsS0FBSyxPQUFBLEdBQVEsQ0FBYixJQUFrQixRQUFTLENBQUEsQ0FBQSxDQUFULEtBQWUsRUFBbEMsQ0FBSjtBQUNFLGtCQUFBLElBQUksSUFBQSxLQUFRLFFBQVo7QUFDRSxvQkFBQSxNQUFBLEdBQVMsTUFBQSxHQUFTLElBQWxCLENBQUE7QUFDQSxvQkFBQSxJQUFJLGFBQUo7QUFDRSxzQkFBQSxJQUFJLFVBQUEsR0FBYSxRQUFRLENBQUMsUUFBVCxDQUFBLENBQW1CLENBQUMsTUFBckM7QUFDRSw2QkFBUyxxSUFBVCxHQUFBO0FBQ0UsMEJBQUEsTUFBQSxHQUFTLE1BQUEsR0FBUyxHQUFsQixDQURGO0FBQUEseUJBREY7dUJBREY7cUJBREE7QUFBQSxvQkFLQSxNQUFBLEdBQVMsTUFBQSxHQUFTLFFBQVEsQ0FBQyxRQUFULENBQUEsQ0FMbEIsQ0FERjttQkFBQSxNQU9LLElBQUksSUFBQSxLQUFRLFFBQVo7QUFDSCxvQkFBQSxNQUFBLEdBQVMsTUFBQSxHQUFTLElBQVQsR0FBZ0IsSUFBQyxDQUFBLHNCQUFELENBQXdCLFFBQVEsQ0FDeEQsUUFEZ0QsQ0FBQSxDQUF4QixFQUNaLFdBRFksRUFDQyxpQkFERCxFQUNvQixhQURwQixFQUV4QixVQUZ3QixDQUF6QixDQURHO21CQVJQO2lCQURBO0FBY0EsZ0JBQUEsSUFBSSxDQUFBLEtBQUssT0FBQSxHQUFRLENBQWpCO0FBQ0Usa0JBQUEsTUFBQSxHQUFTLE1BQUEsR0FBUyxJQUFsQixDQURGO2lCQWZGO0FBQUEsZUFERjthQUFBLE1BQUE7QUFtQkUsY0FBQSxRQUFBLEdBQVcsUUFBQSxHQUFXLE9BQXRCLENBbkJGO2FBYkE7QUFBQSxZQWtDQSxHQUFHLENBQUMsVUFBSixDQUFlLE1BQWYsQ0FsQ0EsQ0FERjtBQUFBLFdBeEJBO2lCQTZEQSxNQUFNLENBQUMsMkJBQVAsQ0FBbUMsVUFBbkMsRUE5REY7U0FIRjtPQURTO0lBQUEsQ0E5RFg7QUFBQSxJQW1JQSxzQkFBQSxFQUF3QixTQUFDLEdBQUQsRUFBTSxPQUFOLEVBQWUsT0FBZixFQUF3QixPQUF4QixFQUFpQyxRQUFqQyxHQUFBO0FBQ3RCLFVBQUEsd0NBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxDQUFDLEdBQUEsS0FBUSxDQUFULENBQVcsQ0FBQyxRQUFaLENBQXFCLEVBQXJCLENBQVQsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFRLEVBRFIsQ0FBQTtBQUVBLFdBQVMsc0dBQVQsR0FBQTtBQUNFLFFBQUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxjQUFELENBQWdCLEtBQWhCLEVBQXVCLE9BQXZCLEVBQWdDLE9BQWhDLEVBQXlDLE1BQU8sQ0FBQSxDQUFBLENBQWhELENBQVIsQ0FERjtBQUFBLE9BRkE7QUFLQSxNQUFBLElBQUksUUFBSjtBQUNFLFFBQUEsSUFBSSxPQUFBLEdBQVUsS0FBSyxDQUFDLE1BQXBCO0FBQ0UsZUFBUyxvSEFBVCxHQUFBO0FBQ0UsWUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsS0FBaEIsRUFBdUIsT0FBdkIsRUFBZ0MsQ0FBQSxPQUFoQyxFQUEwQyxHQUExQyxDQUFSLENBREY7QUFBQSxXQURGO1NBREY7T0FMQTtBQVVBLGFBQU8sS0FBUCxDQVhzQjtJQUFBLENBbkl4QjtBQUFBLElBaUpBLGNBQUEsRUFBZ0IsU0FBQyxZQUFELEVBQWUsT0FBZixFQUF3QixPQUF4QixFQUFpQyxHQUFqQyxHQUFBO0FBQ2QsVUFBQSx1Q0FBQTtBQUFBLE1BQUEsWUFBQSxHQUFlO0FBQUEsUUFDYixHQUFBLEVBQUksR0FEUztBQUFBLFFBQ0osR0FBQSxFQUFJLEdBREE7QUFBQSxRQUNLLEdBQUEsRUFBSSxHQURUO0FBQUEsUUFDYyxHQUFBLEVBQUksR0FEbEI7QUFBQSxRQUN1QixHQUFBLEVBQUksR0FEM0I7QUFBQSxRQUNnQyxHQUFBLEVBQUksR0FEcEM7QUFBQSxRQUN5QyxHQUFBLEVBQUksR0FEN0M7QUFBQSxRQUNrRCxHQUFBLEVBQUksR0FEdEQ7QUFBQSxRQUViLEdBQUEsRUFBSSxHQUZTO0FBQUEsUUFFSixHQUFBLEVBQUksR0FGQTtBQUFBLFFBRUssR0FBQSxFQUFJLEdBRlQ7QUFBQSxRQUVjLEdBQUEsRUFBSSxHQUZsQjtBQUFBLFFBRXVCLEdBQUEsRUFBSSxHQUYzQjtBQUFBLFFBRWdDLEdBQUEsRUFBSSxHQUZwQztBQUFBLFFBRXlDLEdBQUEsRUFBSSxHQUY3QztBQUFBLFFBRWtELEdBQUEsRUFBSSxHQUZ0RDtBQUFBLFFBR2IsR0FBQSxFQUFJLEdBSFM7QUFBQSxRQUdKLEdBQUEsRUFBSSxHQUhBO0FBQUEsUUFHSyxHQUFBLEVBQUksR0FIVDtBQUFBLFFBR2MsR0FBQSxFQUFJLEdBSGxCO0FBQUEsUUFHdUIsR0FBQSxFQUFJLEdBSDNCO0FBQUEsUUFHZ0MsR0FBQSxFQUFJLEdBSHBDO0FBQUEsUUFHeUMsR0FBQSxFQUFJLEdBSDdDO0FBQUEsUUFHa0QsR0FBQSxFQUFJLEdBSHREO0FBQUEsUUFJYixHQUFBLEVBQUksR0FKUztBQUFBLFFBSUosR0FBQSxFQUFJLEdBSkE7T0FBZixDQUFBO0FBQUEsTUFNQSxZQUFBLEdBQWU7QUFBQSxRQUNiLEdBQUEsRUFBSSxHQURTO0FBQUEsUUFDSixHQUFBLEVBQUksR0FEQTtBQUFBLFFBQ0ssR0FBQSxFQUFJLEdBRFQ7QUFBQSxRQUNjLEdBQUEsRUFBSSxHQURsQjtBQUFBLFFBQ3VCLEdBQUEsRUFBSSxHQUQzQjtBQUFBLFFBQ2dDLEdBQUEsRUFBSSxHQURwQztBQUFBLFFBQ3lDLEdBQUEsRUFBSSxHQUQ3QztBQUFBLFFBQ2tELEdBQUEsRUFBSSxHQUR0RDtBQUFBLFFBRWIsR0FBQSxFQUFJLEdBRlM7QUFBQSxRQUVKLEdBQUEsRUFBSSxHQUZBO0FBQUEsUUFFSyxHQUFBLEVBQUksR0FGVDtBQUFBLFFBRWMsR0FBQSxFQUFJLEdBRmxCO0FBQUEsUUFFdUIsR0FBQSxFQUFJLEdBRjNCO0FBQUEsUUFFZ0MsR0FBQSxFQUFJLEdBRnBDO0FBQUEsUUFFeUMsR0FBQSxFQUFJLEdBRjdDO0FBQUEsUUFFa0QsR0FBQSxFQUFJLEdBRnREO0FBQUEsUUFHYixHQUFBLEVBQUksR0FIUztBQUFBLFFBR0osR0FBQSxFQUFJLEdBSEE7QUFBQSxRQUdLLEdBQUEsRUFBSSxHQUhUO0FBQUEsUUFHYyxHQUFBLEVBQUksR0FIbEI7QUFBQSxRQUd1QixHQUFBLEVBQUksR0FIM0I7QUFBQSxRQUdnQyxHQUFBLEVBQUksR0FIcEM7QUFBQSxRQUd5QyxHQUFBLEVBQUksR0FIN0M7QUFBQSxRQUdrRCxHQUFBLEVBQUksR0FIdEQ7QUFBQSxRQUliLEdBQUEsRUFBSSxHQUpTO0FBQUEsUUFJSixHQUFBLEVBQUksR0FKQTtPQU5mLENBQUE7QUFBQSxNQVlBLFdBQUEsR0FBYyxFQVpkLENBQUE7QUFjQSxNQUFBLElBQUksT0FBSjtBQUNFLFFBQUEsSUFBSSxDQUFBLE9BQUo7QUFDRSxVQUFBLFdBQUEsR0FBYyxZQUFBLEdBQWUsWUFBYSxDQUFBLEdBQUEsQ0FBMUMsQ0FERjtTQUFBLE1BQUE7QUFHRSxVQUFBLFdBQUEsR0FBYyxZQUFhLENBQUEsR0FBQSxDQUFiLEdBQW9CLFlBQWxDLENBSEY7U0FERjtPQUFBLE1BQUE7QUFNRSxRQUFBLElBQUksQ0FBQSxPQUFKO0FBQ0UsVUFBQSxXQUFBLEdBQWMsWUFBQSxHQUFlLFlBQWEsQ0FBQSxHQUFBLENBQTFDLENBREY7U0FBQSxNQUFBO0FBR0UsVUFBQSxXQUFBLEdBQWMsWUFBYSxDQUFBLEdBQUEsQ0FBYixHQUFvQixZQUFsQyxDQUhGO1NBTkY7T0FkQTtBQXlCQSxhQUFPLFdBQVAsQ0ExQmM7SUFBQSxDQWpKaEI7R0FIRixDQUFBO0FBQUEiCn0=

//# sourceURL=/C:/Users/MNP/.atom/packages/atom-increment/lib/atom-increment.coffee
