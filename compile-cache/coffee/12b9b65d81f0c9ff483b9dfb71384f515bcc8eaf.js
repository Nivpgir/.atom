(function() {
  var MultiCursor, WorkspaceView;

  MultiCursor = require('../lib/multi-cursor');

  WorkspaceView = require('atom').WorkspaceView;

  describe("MultiCursor", function() {
    var activationPromise, view, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], view = _ref[1], activationPromise = _ref[2];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      view = atom.workspace.openSync('spec/files/test.txt');
      view.setCursorBufferPosition([0, 0]);
      return activationPromise = atom.packages.activatePackage('multi-cursor');
    });
    return describe("when the multi-cursor:expandDown event is triggered", function() {
      return it("When there's 1 cursor and down command is activated", function() {
        jasmine.attachToDOM(workspaceElement);
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          expect(view.getCursors().length).toBe(1);
          atom.commands.dispatch(workspaceElement, 'multi-cursor:expandDown');
          return expect(view.getCursors().length).toBe(2);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL211bHRpLWN1cnNvci9zcGVjL211bHRpLWN1cnNvci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwQkFBQTs7QUFBQSxFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEscUJBQVIsQ0FBZCxDQUFBOztBQUFBLEVBQ0MsZ0JBQWlCLE9BQUEsQ0FBUSxNQUFSLEVBQWpCLGFBREQsQ0FBQTs7QUFBQSxFQVFBLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUEsR0FBQTtBQUN0QixRQUFBLCtDQUFBO0FBQUEsSUFBQSxPQUE4QyxFQUE5QyxFQUFDLDBCQUFELEVBQW1CLGNBQW5CLEVBQXlCLDJCQUF6QixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7QUFBQSxNQUNBLElBQUEsR0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQWYsQ0FBd0IscUJBQXhCLENBRFAsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLHVCQUFMLENBQTZCLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBN0IsQ0FGQSxDQUFBO2FBR0EsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGNBQTlCLEVBSlg7SUFBQSxDQUFYLENBRkEsQ0FBQTtXQVFBLFFBQUEsQ0FBUyxxREFBVCxFQUFnRSxTQUFBLEdBQUE7YUFDOUQsRUFBQSxDQUFHLHFEQUFILEVBQTBELFNBQUEsR0FBQTtBQUN4RCxRQUFBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQixDQUFBLENBQUE7QUFBQSxRQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLGtCQURjO1FBQUEsQ0FBaEIsQ0FGQSxDQUFBO2VBS0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFVBQUEsTUFBQSxDQUFPLElBQUksQ0FBQyxVQUFMLENBQUEsQ0FBaUIsQ0FBQyxNQUF6QixDQUFnQyxDQUFDLElBQWpDLENBQXNDLENBQXRDLENBQUEsQ0FBQTtBQUFBLFVBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyx5QkFBekMsQ0FEQSxDQUFBO2lCQUVBLE1BQUEsQ0FBTyxJQUFJLENBQUMsVUFBTCxDQUFBLENBQWlCLENBQUMsTUFBekIsQ0FBZ0MsQ0FBQyxJQUFqQyxDQUFzQyxDQUF0QyxFQUhHO1FBQUEsQ0FBTCxFQU53RDtNQUFBLENBQTFELEVBRDhEO0lBQUEsQ0FBaEUsRUFUc0I7RUFBQSxDQUF4QixDQVJBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/niv/.atom/packages/multi-cursor/spec/multi-cursor-spec.coffee
