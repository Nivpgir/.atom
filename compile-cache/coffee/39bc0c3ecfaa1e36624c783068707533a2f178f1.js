(function() {
  var Emitter, InputStream,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Emitter = require('atom').Emitter;

  module.exports = InputStream = (function() {
    function InputStream() {
      this.write = __bind(this.write, this);
      this.input = null;
      this.writers = new Emitter;
    }

    InputStream.prototype.setInput = function(input) {
      this.input = input;
      return this.writers.emit('attach', this.input);
    };

    InputStream.prototype.destroy = function() {
      var _ref;
      if ((_ref = this.input) != null) {
        if (typeof _ref.end === "function") {
          _ref.end();
        }
      }
      this.writers.dispose();
      this.input = null;
      return this.writers = null;
    };

    InputStream.prototype.onWrite = function(callback) {
      return this.writers.on('write', callback);
    };

    InputStream.prototype.onAttach = function(callback) {
      return this.writers.on('attach', callback);
    };

    InputStream.prototype.isPTY = function() {
      return this.input.socket != null;
    };

    InputStream.prototype.write = function(text) {
      var _ref;
      return ((_ref = this.input.socket) != null ? _ref : this.input).write(text, 'utf8', (function(_this) {
        return function() {
          return _this.writers.emit('write', text);
        };
      })(this));
    };

    return InputStream;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9waXBlbGluZS9pbnB1dC1zdHJlYW0uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9CQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQyxVQUFXLE9BQUEsQ0FBUSxNQUFSLEVBQVgsT0FBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNTLElBQUEscUJBQUEsR0FBQTtBQUNYLDJDQUFBLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBVCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQURYLENBRFc7SUFBQSxDQUFiOztBQUFBLDBCQUlBLFFBQUEsR0FBVSxTQUFFLEtBQUYsR0FBQTtBQUNSLE1BRFMsSUFBQyxDQUFBLFFBQUEsS0FDVixDQUFBO2FBQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsUUFBZCxFQUF3QixJQUFDLENBQUEsS0FBekIsRUFEUTtJQUFBLENBSlYsQ0FBQTs7QUFBQSwwQkFPQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsVUFBQSxJQUFBOzs7Y0FBTSxDQUFFOztPQUFSO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLE9BQVQsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFGVCxDQUFBO2FBR0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxLQUpKO0lBQUEsQ0FQVCxDQUFBOztBQUFBLDBCQWFBLE9BQUEsR0FBUyxTQUFDLFFBQUQsR0FBQTthQUNQLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLE9BQVosRUFBcUIsUUFBckIsRUFETztJQUFBLENBYlQsQ0FBQTs7QUFBQSwwQkFnQkEsUUFBQSxHQUFVLFNBQUMsUUFBRCxHQUFBO2FBQ1IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksUUFBWixFQUFzQixRQUF0QixFQURRO0lBQUEsQ0FoQlYsQ0FBQTs7QUFBQSwwQkFtQkEsS0FBQSxHQUFPLFNBQUEsR0FBQTthQUNMLDBCQURLO0lBQUEsQ0FuQlAsQ0FBQTs7QUFBQSwwQkFzQkEsS0FBQSxHQUFPLFNBQUMsSUFBRCxHQUFBO0FBQ0wsVUFBQSxJQUFBO2FBQUEsNkNBQWlCLElBQUMsQ0FBQSxLQUFsQixDQUF3QixDQUFDLEtBQXpCLENBQStCLElBQS9CLEVBQXFDLE1BQXJDLEVBQTZDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsT0FBZCxFQUF1QixJQUF2QixFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0MsRUFESztJQUFBLENBdEJQLENBQUE7O3VCQUFBOztNQUpKLENBQUE7QUFBQSIKfQ==

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/pipeline/input-stream.coffee
