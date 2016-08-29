(function() {
  var Modifier;

  Modifier = require('../lib/stream-modifiers/remansi');

  describe('Stream Modifier - Remove ANSI', function() {
    var mod, ret;
    mod = null;
    ret = null;
    beforeEach(function() {
      return mod = new Modifier.modifier;
    });
    describe('On single line with escape code at the beginning and end', function() {
      beforeEach(function() {
        return ret = mod.modify_raw('\x1b[32mHello \x1b[35;41mbeautiful\x1b[33m world!\x1b[0m');
      });
      return it('returns the new line', function() {
        return expect(ret).toBe('Hello beautiful world!');
      });
    });
    describe('On multi line', function() {
      beforeEach(function() {
        return ret = mod.modify_raw('\x1b[32mHello\x1b[41m');
      });
      it('returns the new line', function() {
        return expect(ret).toBe('Hello');
      });
      return describe('On second line', function() {
        beforeEach(function() {
          return ret = mod.modify_raw('World\x1b[');
        });
        it('returns the new line', function() {
          return expect(ret).toBe('World');
        });
        return describe('On third line', function() {
          beforeEach(function() {
            return ret = mod.modify_raw('01;33m!\x1b[0m');
          });
          return it('returns the new line', function() {
            return expect(ret).toBe('!');
          });
        });
      });
    });
    return describe('On multi line with unsupported code', function() {
      beforeEach(function() {
        return ret = mod.modify_raw('\x1b[32mHello\x1b[24m\x1b[0K');
      });
      it('returns the new line', function() {
        return expect(ret).toBe('Hello');
      });
      return describe('On second line', function() {
        beforeEach(function() {
          return ret = mod.modify_raw('World\x1b[');
        });
        return it('returns the new line', function() {
          return expect(ret).toBe('World');
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL3NwZWMvc3RyZWFtLW1vZGlmaWVyLXJlbWFuc2ktc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsUUFBQTs7QUFBQSxFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsaUNBQVIsQ0FBWCxDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLCtCQUFULEVBQTBDLFNBQUEsR0FBQTtBQUN4QyxRQUFBLFFBQUE7QUFBQSxJQUFBLEdBQUEsR0FBTSxJQUFOLENBQUE7QUFBQSxJQUNBLEdBQUEsR0FBTSxJQUROLENBQUE7QUFBQSxJQUdBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxHQUFBLEdBQU0sR0FBQSxDQUFBLFFBQVksQ0FBQyxTQURWO0lBQUEsQ0FBWCxDQUhBLENBQUE7QUFBQSxJQU1BLFFBQUEsQ0FBUywwREFBVCxFQUFxRSxTQUFBLEdBQUE7QUFFbkUsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2VBQ1QsR0FBQSxHQUFNLEdBQUcsQ0FBQyxVQUFKLENBQWUsMERBQWYsRUFERztNQUFBLENBQVgsQ0FBQSxDQUFBO2FBR0EsRUFBQSxDQUFHLHNCQUFILEVBQTJCLFNBQUEsR0FBQTtlQUN6QixNQUFBLENBQU8sR0FBUCxDQUFXLENBQUMsSUFBWixDQUFpQix3QkFBakIsRUFEeUI7TUFBQSxDQUEzQixFQUxtRTtJQUFBLENBQXJFLENBTkEsQ0FBQTtBQUFBLElBY0EsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQSxHQUFBO0FBRXhCLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULEdBQUEsR0FBTSxHQUFHLENBQUMsVUFBSixDQUFlLHVCQUFmLEVBREc7TUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLE1BR0EsRUFBQSxDQUFHLHNCQUFILEVBQTJCLFNBQUEsR0FBQTtlQUN6QixNQUFBLENBQU8sR0FBUCxDQUFXLENBQUMsSUFBWixDQUFpQixPQUFqQixFQUR5QjtNQUFBLENBQTNCLENBSEEsQ0FBQTthQU1BLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBLEdBQUE7QUFFekIsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2lCQUNULEdBQUEsR0FBTSxHQUFHLENBQUMsVUFBSixDQUFlLFlBQWYsRUFERztRQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsUUFHQSxFQUFBLENBQUcsc0JBQUgsRUFBMkIsU0FBQSxHQUFBO2lCQUN6QixNQUFBLENBQU8sR0FBUCxDQUFXLENBQUMsSUFBWixDQUFpQixPQUFqQixFQUR5QjtRQUFBLENBQTNCLENBSEEsQ0FBQTtlQU1BLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUEsR0FBQTtBQUV4QixVQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7bUJBQ1QsR0FBQSxHQUFNLEdBQUcsQ0FBQyxVQUFKLENBQWUsZ0JBQWYsRUFERztVQUFBLENBQVgsQ0FBQSxDQUFBO2lCQUdBLEVBQUEsQ0FBRyxzQkFBSCxFQUEyQixTQUFBLEdBQUE7bUJBQ3pCLE1BQUEsQ0FBTyxHQUFQLENBQVcsQ0FBQyxJQUFaLENBQWlCLEdBQWpCLEVBRHlCO1VBQUEsQ0FBM0IsRUFMd0I7UUFBQSxDQUExQixFQVJ5QjtNQUFBLENBQTNCLEVBUndCO0lBQUEsQ0FBMUIsQ0FkQSxDQUFBO1dBc0NBLFFBQUEsQ0FBUyxxQ0FBVCxFQUFnRCxTQUFBLEdBQUE7QUFFOUMsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2VBQ1QsR0FBQSxHQUFNLEdBQUcsQ0FBQyxVQUFKLENBQWUsOEJBQWYsRUFERztNQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsTUFHQSxFQUFBLENBQUcsc0JBQUgsRUFBMkIsU0FBQSxHQUFBO2VBQ3pCLE1BQUEsQ0FBTyxHQUFQLENBQVcsQ0FBQyxJQUFaLENBQWlCLE9BQWpCLEVBRHlCO01BQUEsQ0FBM0IsQ0FIQSxDQUFBO2FBTUEsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUEsR0FBQTtBQUV6QixRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsR0FBQSxHQUFNLEdBQUcsQ0FBQyxVQUFKLENBQWUsWUFBZixFQURHO1FBQUEsQ0FBWCxDQUFBLENBQUE7ZUFHQSxFQUFBLENBQUcsc0JBQUgsRUFBMkIsU0FBQSxHQUFBO2lCQUN6QixNQUFBLENBQU8sR0FBUCxDQUFXLENBQUMsSUFBWixDQUFpQixPQUFqQixFQUR5QjtRQUFBLENBQTNCLEVBTHlCO01BQUEsQ0FBM0IsRUFSOEM7SUFBQSxDQUFoRCxFQXZDd0M7RUFBQSxDQUExQyxDQUZBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/niv/.atom/packages/build-tools/spec/stream-modifier-remansi-spec.coffee
