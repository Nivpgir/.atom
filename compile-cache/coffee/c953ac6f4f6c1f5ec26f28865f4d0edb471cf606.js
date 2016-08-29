(function() {
  var Modifier;

  Modifier = new (require('../lib/stream-modifiers/all')).modifier;

  describe('Stream Modifier - All', function() {
    return describe('on modify', function() {
      var r, t;
      t = null;
      r = void 0;
      beforeEach(function() {
        t = {
          type: ''
        };
        return r = Modifier.modify({
          temp: t
        });
      });
      it('highlights the entire line', function() {
        return expect(t.type).toBe('warning');
      });
      return it('returns null', function() {
        return expect(r).toBe(null);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL3NwZWMvc3RyZWFtLW1vZGlmaWVyLWFsbC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxRQUFBOztBQUFBLEVBQUEsUUFBQSxHQUFXLEdBQUEsQ0FBQSxDQUFLLE9BQUEsQ0FBUSw2QkFBUixDQUFELENBQXVDLENBQUMsUUFBdkQsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBLEdBQUE7V0FDaEMsUUFBQSxDQUFTLFdBQVQsRUFBc0IsU0FBQSxHQUFBO0FBQ3BCLFVBQUEsSUFBQTtBQUFBLE1BQUEsQ0FBQSxHQUFJLElBQUosQ0FBQTtBQUFBLE1BQ0EsQ0FBQSxHQUFJLE1BREosQ0FBQTtBQUFBLE1BR0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsQ0FBQSxHQUFJO0FBQUEsVUFBQSxJQUFBLEVBQU0sRUFBTjtTQUFKLENBQUE7ZUFDQSxDQUFBLEdBQUksUUFBUSxDQUFDLE1BQVQsQ0FBZ0I7QUFBQSxVQUFBLElBQUEsRUFBTSxDQUFOO1NBQWhCLEVBRks7TUFBQSxDQUFYLENBSEEsQ0FBQTtBQUFBLE1BT0EsRUFBQSxDQUFHLDRCQUFILEVBQWlDLFNBQUEsR0FBQTtlQUMvQixNQUFBLENBQU8sQ0FBQyxDQUFDLElBQVQsQ0FBYyxDQUFDLElBQWYsQ0FBb0IsU0FBcEIsRUFEK0I7TUFBQSxDQUFqQyxDQVBBLENBQUE7YUFVQSxFQUFBLENBQUcsY0FBSCxFQUFtQixTQUFBLEdBQUE7ZUFDakIsTUFBQSxDQUFPLENBQVAsQ0FBUyxDQUFDLElBQVYsQ0FBZSxJQUFmLEVBRGlCO01BQUEsQ0FBbkIsRUFYb0I7SUFBQSxDQUF0QixFQURnQztFQUFBLENBQWxDLENBRkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/niv/.atom/packages/build-tools/spec/stream-modifier-all-spec.coffee
