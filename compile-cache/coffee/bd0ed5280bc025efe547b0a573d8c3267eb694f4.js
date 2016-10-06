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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2F0b20taW5jcmVtZW50L2xpYi9hdG9tLWluY3JlbWVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0NBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGFBQUEsR0FDZjtBQUFBLElBQUEsYUFBQSxFQUFlLElBQWY7QUFBQSxJQUVBLE1BQUEsRUFDRTtBQUFBLE1BQUEsWUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSxzQ0FGYjtPQURGO0FBQUEsTUFJQSxPQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsQ0FEVDtBQUFBLFFBRUEsT0FBQSxFQUFTLENBRlQ7QUFBQSxRQUdBLFdBQUEsRUFBYSwyREFIYjtPQUxGO0FBQUEsTUFTQSxRQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsQ0FEVDtBQUFBLFFBRUEsT0FBQSxFQUFTLENBRlQ7QUFBQSxRQUdBLFdBQUEsRUFBYSxtQ0FIYjtPQVZGO0FBQUEsTUFjQSxpQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSx1REFGYjtPQWZGO0FBQUEsTUFrQkEsZ0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsK0NBRmI7T0Fu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

//# sourceURL=/C:/Users/nivp/.atom/packages/atom-increment/lib/atom-increment.coffee
