(function() {
  var ColorRegex, ColorRegexEnd;

  ColorRegex = /\x1b\[([0-9;]*)m/g;

  ColorRegexEnd = /\x1b\[?[0-9;]*$/;

  module.exports = {
    classToStyle: function(className) {
      var style, styles, _i, _len, _ref;
      styles = [];
      _ref = className.split(' ');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        style = _ref[_i];
        styles.push(parseInt(style.substr(1)));
      }
      return styles;
    },
    ansiToStyle: function(ansi) {
      var i, style, styles, _i, _len, _ref;
      styles = [-1, -1, -1];
      if (ansi === '') {
        return [0, 0, 0];
      }
      _ref = ansi.split(';');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        style = _ref[_i];
        if ((i = parseInt(style)) >= 30 && i <= 37) {
          styles[0] = i;
        } else if (i >= 40 && i <= 47) {
          styles[1] = i;
        } else if (i === 39) {
          styles[0] = 0;
        } else if (i === 49) {
          styles[1] = 0;
        } else if (i === 1 || i === 3 || i === 4) {
          styles[2] = i;
        } else if (i >= 21 && i <= 24) {
          styles[2] = i;
        } else if (i === 0) {
          styles = [0, 0, 0];
        }
      }
      return styles;
    },
    styleToClass: function(styles) {
      var classNames, style, _i, _len;
      classNames = [];
      for (_i = 0, _len = styles.length; _i < _len; _i++) {
        style = styles[_i];
        classNames.push("a" + style);
      }
      return classNames.join(' ');
    },
    copyAttributes: function(elements, id) {
      var e, e1, e2, v;
      e1 = elements[id];
      e2 = elements[id - 1];
      if ((e1 != null) && (e2 != null)) {
        if ((e = e2.children).length !== 0) {
          e1.className = e[e.length - 1].className;
          if ((v = e[e.length - 1].getAttribute('nextStyle')) != null) {
            e1.setAttribute('nextStyle', v);
          }
          if ((v = e[e.length - 1].getAttribute('endsWithAnsi'))) {
            return e1.setAttribute('endsWithAnsi', v);
          }
        } else {
          e1.className = e2.className;
          if ((v = e2.getAttribute('nextStyle'))) {
            e1.setAttribute('nextStyle', v);
          }
          if ((v = e2.getAttribute('endsWithAnsi'))) {
            return e1.setAttribute('endsWithAnsi', v);
          }
        }
      }
    },
    getEndsWithAnsi: function(elements, id) {
      var e, endsWithAnsi, _ref, _ref1;
      if (elements[id - 1] != null) {
        if ((e = elements[id - 1].children).length !== 0) {
          endsWithAnsi = (_ref = e[e.length - 1].getAttribute('endsWithAnsi')) != null ? _ref : '';
        } else {
          endsWithAnsi = (_ref1 = elements[id - 1].getAttribute('endsWithAnsi')) != null ? _ref1 : '';
        }
        return endsWithAnsi;
      } else {
        return '';
      }
    },
    getNextStyle: function(elements, id) {
      var e, lastStyle, _ref, _ref1;
      if (elements[id - 1] != null) {
        if ((e = elements[id - 1].children).length !== 0) {
          lastStyle = (_ref = e[e.length - 1].getAttribute('nextStyle')) != null ? _ref : e[e.length - 1].className;
        } else {
          lastStyle = (_ref1 = elements[id - 1].getAttribute('nextStyle')) != null ? _ref1 : elements[id - 1].className;
        }
        return this.classToStyle(lastStyle);
      } else {
        return [0, 0, 0];
      }
    },
    setNextStyle: function(elements, id, className) {
      var e;
      if ((e = elements[id].children).length !== 0) {
        return e[e.length - 1].setAttribute('nextStyle', className);
      } else {
        return elements[id].setAttribute('nextStyle', className);
      }
    },
    constructElements: function(input, delims, elements, id) {
      var className, d, e, element, index, innerText, left, m, right, style, textIndex, _i, _index, _len, _ref, _results;
      element = elements[id];
      _results = [];
      for (index = _i = 0, _len = delims.length; _i < _len; index = ++_i) {
        _ref = delims[index], style = _ref[0], _index = _ref[1], textIndex = _ref[2];
        innerText = input.substr(textIndex, (d = delims[index + 1]) != null ? d[1] - textIndex : void 0);
        className = this.styleToClass(style);
        if (innerText === '') {
          this.setNextStyle(elements, id, className);
          continue;
        }
        e = document.createElement('span');
        element.appendChild(e);
        e.className = className;
        if (index === delims.length - 1 && innerText !== '') {
          if ((m = ColorRegexEnd.exec(innerText)) != null) {
            left = innerText.substr(0, m.index);
            right = innerText.substr(m.index);
            e.setAttribute('endsWithAnsi', right);
            innerText = left;
          }
        }
        _results.push(e.innerText = innerText);
      }
      return _results;
    },
    getDelim: function(input, elements, id) {
      var delims, i, index, lastStyle, m, s, style, _i, _j, _len, _len1;
      lastStyle = this.getNextStyle(elements, id);
      delims = [[lastStyle, 0, 0]];
      while ((m = ColorRegex.exec(input)) != null) {
        delims.push([this.ansiToStyle(m[1]), m.index, m.index + 3 + m[1].length]);
      }
      for (index = _i = 0, _len = delims.length; _i < _len; index = ++_i) {
        style = delims[index][0];
        for (i = _j = 0, _len1 = style.length; _j < _len1; i = ++_j) {
          s = style[i];
          if (s === -1) {
            style[i] = delims[index - 1][0][i];
          }
        }
      }
      return delims;
    },
    parseAnsi: function(input, elements, id) {
      input = this.getEndsWithAnsi(elements, id) + input;
      return this.constructElements(input, this.getDelim(input, elements, id), elements, id);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9vdXRwdXQvYW5zaS1wYXJzZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlCQUFBOztBQUFBLEVBQUEsVUFBQSxHQUFhLG1CQUFiLENBQUE7O0FBQUEsRUFDQSxhQUFBLEdBQWdCLGlCQURoQixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsWUFBQSxFQUFjLFNBQUMsU0FBRCxHQUFBO0FBQ1osVUFBQSw2QkFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLEVBQVQsQ0FBQTtBQUNBO0FBQUEsV0FBQSwyQ0FBQTt5QkFBQTtBQUNFLFFBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxRQUFBLENBQVMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxDQUFiLENBQVQsQ0FBWixDQUFBLENBREY7QUFBQSxPQURBO0FBR0EsYUFBTyxNQUFQLENBSlk7SUFBQSxDQUFkO0FBQUEsSUFNQSxXQUFBLEVBQWEsU0FBQyxJQUFELEdBQUE7QUFDWCxVQUFBLGdDQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsQ0FBQyxDQUFBLENBQUQsRUFBSyxDQUFBLENBQUwsRUFBUyxDQUFBLENBQVQsQ0FBVCxDQUFBO0FBQ0EsTUFBQSxJQUFvQixJQUFBLEtBQVEsRUFBNUI7QUFBQSxlQUFPLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBQVAsQ0FBQTtPQURBO0FBRUE7QUFBQSxXQUFBLDJDQUFBO3lCQUFBO0FBQ0UsUUFBQSxJQUFHLENBQUMsQ0FBQSxHQUFJLFFBQUEsQ0FBUyxLQUFULENBQUwsQ0FBQSxJQUF5QixFQUF6QixJQUFnQyxDQUFBLElBQUssRUFBeEM7QUFDRSxVQUFBLE1BQU8sQ0FBQSxDQUFBLENBQVAsR0FBWSxDQUFaLENBREY7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

//# sourceURL=/home/niv/.atom/packages/build-tools/lib/output/ansi-parser.coffee
