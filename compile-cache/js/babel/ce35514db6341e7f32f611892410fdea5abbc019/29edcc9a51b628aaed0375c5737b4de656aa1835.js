'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

module.exports = (function () {
  function BufferExtender(buffer) {
    _classCallCheck(this, BufferExtender);

    this._buffer = buffer;
  }

  /**
   * Gets the line ending for the buffer.
   *
   * @return The line ending as a string.
   */

  _createClass(BufferExtender, [{
    key: 'getLineEnding',
    value: function getLineEnding() {
      var lineEndings = new Set();
      for (var i = 0; i < this._buffer.getLineCount() - 1; i++) {
        lineEndings.add(this._buffer.lineEndingForRow(i));
      }

      if (lineEndings.size > 1) {
        return 'Mixed';
      } else if (lineEndings.has('\n')) {
        return '\n';
      } else if (lineEndings.has('\r\n')) {
        return '\r\n';
      } else if (lineEndings.has('\r')) {
        return '\r';
      } else {
        return '';
      }
    }
  }]);

  return BufferExtender;
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL25pdnAvLmF0b20vcGFja2FnZXMvc3BsaXQtZGlmZi9saWIvYnVmZmVyLWV4dGVuZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7O0FBRVgsTUFBTSxDQUFDLE9BQU87QUFHRCxXQUhVLGNBQWMsQ0FHdkIsTUFBTSxFQUFFOzBCQUhDLGNBQWM7O0FBSWpDLFFBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0dBQ3ZCOzs7Ozs7OztlQUxvQixjQUFjOztXQVl0Qix5QkFBVztBQUN0QixVQUFJLFdBQVcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQzVCLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN4RCxtQkFBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDbkQ7O0FBRUQsVUFBSSxXQUFXLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRTtBQUN4QixlQUFPLE9BQU8sQ0FBQztPQUNoQixNQUFNLElBQUksV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUNoQyxlQUFPLElBQUksQ0FBQztPQUNiLE1BQU0sSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQ2xDLGVBQU8sTUFBTSxDQUFDO09BQ2YsTUFBTSxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDaEMsZUFBTyxJQUFJLENBQUM7T0FDYixNQUFNO0FBQ0wsZUFBTyxFQUFFLENBQUM7T0FDWDtLQUNGOzs7U0E3Qm9CLGNBQWM7SUE4QnBDLENBQUMiLCJmaWxlIjoiQzovVXNlcnMvbml2cC8uYXRvbS9wYWNrYWdlcy9zcGxpdC1kaWZmL2xpYi9idWZmZXItZXh0ZW5kZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEJ1ZmZlckV4dGVuZGVyIHtcbiAgX2J1ZmZlcjogT2JqZWN0O1xuXG4gIGNvbnN0cnVjdG9yKGJ1ZmZlcikge1xuICAgIHRoaXMuX2J1ZmZlciA9IGJ1ZmZlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBsaW5lIGVuZGluZyBmb3IgdGhlIGJ1ZmZlci5cbiAgICpcbiAgICogQHJldHVybiBUaGUgbGluZSBlbmRpbmcgYXMgYSBzdHJpbmcuXG4gICAqL1xuICBnZXRMaW5lRW5kaW5nKCk6IHN0cmluZyB7XG4gICAgbGV0IGxpbmVFbmRpbmdzID0gbmV3IFNldCgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fYnVmZmVyLmdldExpbmVDb3VudCgpIC0gMTsgaSsrKSB7XG4gICAgICBsaW5lRW5kaW5ncy5hZGQodGhpcy5fYnVmZmVyLmxpbmVFbmRpbmdGb3JSb3coaSkpO1xuICAgIH1cblxuICAgIGlmIChsaW5lRW5kaW5ncy5zaXplID4gMSkge1xuICAgICAgcmV0dXJuICdNaXhlZCc7XG4gICAgfSBlbHNlIGlmIChsaW5lRW5kaW5ncy5oYXMoJ1xcbicpKSB7XG4gICAgICByZXR1cm4gJ1xcbic7XG4gICAgfSBlbHNlIGlmIChsaW5lRW5kaW5ncy5oYXMoJ1xcclxcbicpKSB7XG4gICAgICByZXR1cm4gJ1xcclxcbic7XG4gICAgfSBlbHNlIGlmIChsaW5lRW5kaW5ncy5oYXMoJ1xccicpKSB7XG4gICAgICByZXR1cm4gJ1xccic7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH1cbn07XG4iXX0=
//# sourceURL=/C:/Users/nivp/.atom/packages/split-diff/lib/buffer-extender.js
