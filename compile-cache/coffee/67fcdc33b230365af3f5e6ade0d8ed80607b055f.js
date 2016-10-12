(function() {
  var KillRing;

  module.exports = KillRing = (function() {
    function KillRing() {
      this.currentIndex = -1;
      this.entries = [];
      this.limit = 500;
    }

    KillRing.prototype.fork = function() {
      var fork;
      fork = new KillRing;
      fork.setEntries(this.entries);
      fork.currentIndex = this.currentIndex;
      return fork;
    };

    KillRing.prototype.isEmpty = function() {
      return this.entries.length === 0;
    };

    KillRing.prototype.reset = function() {
      return this.entries = [];
    };

    KillRing.prototype.getEntries = function() {
      return this.entries.slice();
    };

    KillRing.prototype.setEntries = function(entries) {
      this.entries = entries.slice();
      this.currentIndex = this.entries.length - 1;
      return this;
    };

    KillRing.prototype.push = function(text) {
      this.entries.push(text);
      if (this.entries.length > this.limit) {
        this.entries.shift();
      }
      return this.currentIndex = this.entries.length - 1;
    };

    KillRing.prototype.append = function(text) {
      var index;
      if (this.entries.length === 0) {
        return this.push(text);
      } else {
        index = this.entries.length - 1;
        this.entries[index] += text;
        return this.currentIndex = this.entries.length - 1;
      }
    };

    KillRing.prototype.prepend = function(text) {
      var index;
      if (this.entries.length === 0) {
        return this.push(text);
      } else {
        index = this.entries.length - 1;
        this.entries[index] = "" + text + this.entries[index];
        return this.currentIndex = this.entries.length - 1;
      }
    };

    KillRing.prototype.getCurrentEntry = function() {
      if (this.entries.length === 0) {
        return null;
      } else {
        return this.entries[this.currentIndex];
      }
    };

    KillRing.prototype.rotate = function(n) {
      if (this.entries.length === 0) {
        return null;
      }
      this.currentIndex = (this.currentIndex + n) % this.entries.length;
      if (this.currentIndex < 0) {
        this.currentIndex += this.entries.length;
      }
      return this.entries[this.currentIndex];
    };

    KillRing.global = new KillRing;

    return KillRing;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYXRvbWljLWVtYWNzL2xpYi9raWxsLXJpbmcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxrQkFBQSxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsWUFBRCxHQUFnQixDQUFBLENBQWhCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsRUFEWCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsS0FBRCxHQUFTLEdBRlQsQ0FEVztJQUFBLENBQWI7O0FBQUEsdUJBS0EsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLEdBQUEsQ0FBQSxRQUFQLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxVQUFMLENBQWdCLElBQUMsQ0FBQSxPQUFqQixDQURBLENBQUE7QUFBQSxNQUVBLElBQUksQ0FBQyxZQUFMLEdBQW9CLElBQUMsQ0FBQSxZQUZyQixDQUFBO2FBR0EsS0FKSTtJQUFBLENBTE4sQ0FBQTs7QUFBQSx1QkFXQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ1AsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULEtBQW1CLEVBRFo7SUFBQSxDQVhULENBQUE7O0FBQUEsdUJBY0EsS0FBQSxHQUFPLFNBQUEsR0FBQTthQUNMLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FETjtJQUFBLENBZFAsQ0FBQTs7QUFBQSx1QkFpQkEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBVCxDQUFBLEVBRFU7SUFBQSxDQWpCWixDQUFBOztBQUFBLHVCQW9CQSxVQUFBLEdBQVksU0FBQyxPQUFELEdBQUE7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

//# sourceURL=/C:/Users/MNP/.atom/packages/atomic-emacs/lib/kill-ring.coffee
