(function() {
  var Emitter, Tab, TabItem, TabView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  TabView = require('./tab-view');

  TabItem = require('./tab-item');

  Emitter = require('atom').Emitter;

  module.exports = Tab = (function() {
    function Tab(name) {
      this.name = name;
      this.open = __bind(this.open, this);
      this.emitter = new Emitter;
      this.header = new TabItem('custom', this.name, (function(_this) {
        return function() {
          return _this.close();
        };
      })(this));
      this.view = new TabView;
      this.header.setHeader("" + this.name);
      this.opener = null;
    }

    Tab.prototype.destroy = function() {
      return this.emitter.dispose();
    };

    Tab.prototype.clear = function() {
      return this.view.clear();
    };

    Tab.prototype.setIcon = function(icon) {
      return this.header.setIcon(icon);
    };

    Tab.prototype.setHeader = function(header) {
      this.header.setHeader(header);
      if (this.title == null) {
        this.title = document.createElement('span');
      }
      return this.title.innerText = header;
    };

    Tab.prototype.printLine = function(line) {
      return this.view.printLine(line);
    };

    Tab.prototype.finishConsole = function() {
      return this.view.finishConsole(this.open);
    };

    Tab.prototype.hasFocus = function() {
      return this === this.console.activeTab;
    };

    Tab.prototype.getHeader = function() {
      if (this.title != null) {
        return this.title;
      }
      this.title = document.createElement('span');
      this.title.innerText = "" + this.name;
      return this.title;
    };

    Tab.prototype.close = function() {
      return this.emitter.emit('close');
    };

    Tab.prototype.onClose = function(callback) {
      return this.emitter.on('close', callback);
    };

    Tab.prototype.setOpener = function(opener) {
      this.opener = opener;
    };

    Tab.prototype.open = function(element) {
      var linecol, lineno;
      if ((typeof this.opener === "function" ? this.opener(element) : void 0) != null) {
        return;
      }
      lineno = parseInt(element.attr('row'));
      linecol = parseInt(element.attr('col'));
      if (element.attr('name') !== '') {
        return atom.workspace.open(element.attr('name'), {
          initialLine: lineno - 1,
          initialColumn: linecol - 1
        });
      }
    };

    return Tab;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL2xpYi9jb25zb2xlL2N1c3RvbS10YWIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhCQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVIsQ0FBVixDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxZQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUdDLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQUhELENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBQ1MsSUFBQSxhQUFFLElBQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLE9BQUEsSUFDYixDQUFBO0FBQUEseUNBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsT0FBQSxDQUFRLFFBQVIsRUFBa0IsSUFBQyxDQUFBLElBQW5CLEVBQXlCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLEtBQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekIsQ0FEZCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsSUFBRCxHQUFRLEdBQUEsQ0FBQSxPQUZSLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFrQixFQUFBLEdBQUcsSUFBQyxDQUFBLElBQXRCLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUpWLENBRFc7SUFBQSxDQUFiOztBQUFBLGtCQU9BLE9B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

//# sourceURL=/C:/Users/nivp/.atom/packages/build-tools/lib/console/custom-tab.coffee
