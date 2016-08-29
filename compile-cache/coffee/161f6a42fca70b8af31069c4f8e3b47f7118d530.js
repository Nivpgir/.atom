(function() {
  var Input, path;

  Input = require('../lib/provider/input');

  path = require('path');

  describe('Input', function() {
    return describe('::getFirstConfig', function() {
      describe('When config in current folder', function() {
        var file, folder, promise;
        file = null;
        folder = null;
        promise = null;
        beforeEach(function() {
          promise = Input.getFirstConfig(path.join(atom.project.getPaths()[0], 'root1', 'sub0'));
          promise.then(function(_arg) {
            var filePath, folderPath;
            folderPath = _arg.folderPath, filePath = _arg.filePath;
            folder = folderPath;
            return file = filePath;
          });
          return waitsForPromise(function() {
            return promise;
          });
        });
        return it('returns the correct file path', function() {
          expect(folder).toBe(path.join(atom.project.getPaths()[0], 'root1', 'sub0'));
          return expect(file).toBe(path.join(atom.project.getPaths()[0], 'root1', 'sub0', '.build-tools.cson'));
        });
      });
      return describe('When config not in current folder', function() {
        var file, folder, promise;
        file = null;
        folder = null;
        promise = null;
        beforeEach(function() {
          promise = Input.getFirstConfig(path.join(atom.project.getPaths()[0], 'root1', 'sub1'));
          promise.then(function(_arg) {
            var filePath, folderPath;
            folderPath = _arg.folderPath, filePath = _arg.filePath;
            folder = folderPath;
            return file = filePath;
          });
          return waitsForPromise(function() {
            return promise;
          });
        });
        return it('returns the correct file path', function() {
          expect(folder).toBe(atom.project.getPaths()[0]);
          return expect(file).toBe(path.join(folder, '.build-tools.cson'));
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL3NwZWMvaW5wdXQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsV0FBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsdUJBQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsQ0FBUyxPQUFULEVBQWtCLFNBQUEsR0FBQTtXQUNoQixRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLE1BQUEsUUFBQSxDQUFTLCtCQUFULEVBQTBDLFNBQUEsR0FBQTtBQUN4QyxZQUFBLHFCQUFBO0FBQUEsUUFBQSxJQUFBLEdBQU8sSUFBUCxDQUFBO0FBQUEsUUFDQSxNQUFBLEdBQVMsSUFEVCxDQUFBO0FBQUEsUUFFQSxPQUFBLEdBQVUsSUFGVixDQUFBO0FBQUEsUUFJQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxPQUFBLEdBQVUsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsT0FBdEMsRUFBK0MsTUFBL0MsQ0FBckIsQ0FBVixDQUFBO0FBQUEsVUFDQSxPQUFPLENBQUMsSUFBUixDQUFhLFNBQUMsSUFBRCxHQUFBO0FBQ1gsZ0JBQUEsb0JBQUE7QUFBQSxZQURhLGtCQUFBLFlBQVksZ0JBQUEsUUFDekIsQ0FBQTtBQUFBLFlBQUEsTUFBQSxHQUFTLFVBQVQsQ0FBQTttQkFDQSxJQUFBLEdBQU8sU0FGSTtVQUFBLENBQWIsQ0FEQSxDQUFBO2lCQUlBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO21CQUFHLFFBQUg7VUFBQSxDQUFoQixFQUxTO1FBQUEsQ0FBWCxDQUpBLENBQUE7ZUFXQSxFQUFBLENBQUcsK0JBQUgsRUFBb0MsU0FBQSxHQUFBO0FBQ2xDLFVBQUEsTUFBQSxDQUFPLE1BQVAsQ0FBYyxDQUFDLElBQWYsQ0FBb0IsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsT0FBdEMsRUFBK0MsTUFBL0MsQ0FBcEIsQ0FBQSxDQUFBO2lCQUNBLE1BQUEsQ0FBTyxJQUFQLENBQVksQ0FBQyxJQUFiLENBQWtCLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLE9BQXRDLEVBQStDLE1BQS9DLEVBQXVELG1CQUF2RCxDQUFsQixFQUZrQztRQUFBLENBQXBDLEVBWndDO01BQUEsQ0FBMUMsQ0FBQSxDQUFBO2FBZ0JBLFFBQUEsQ0FBUyxtQ0FBVCxFQUE4QyxTQUFBLEdBQUE7QUFDNUMsWUFBQSxxQkFBQTtBQUFBLFFBQUEsSUFBQSxHQUFPLElBQVAsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxHQUFTLElBRFQsQ0FBQTtBQUFBLFFBRUEsT0FBQSxHQUFVLElBRlYsQ0FBQTtBQUFBLFFBSUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsT0FBQSxHQUFVLEtBQUssQ0FBQyxjQUFOLENBQXFCLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLE9BQXRDLEVBQStDLE1BQS9DLENBQXJCLENBQVYsQ0FBQTtBQUFBLFVBQ0EsT0FBTyxDQUFDLElBQVIsQ0FBYSxTQUFDLElBQUQsR0FBQTtBQUNYLGdCQUFBLG9CQUFBO0FBQUEsWUFEYSxrQkFBQSxZQUFZLGdCQUFBLFFBQ3pCLENBQUE7QUFBQSxZQUFBLE1BQUEsR0FBUyxVQUFULENBQUE7bUJBQ0EsSUFBQSxHQUFPLFNBRkk7VUFBQSxDQUFiLENBREEsQ0FBQTtpQkFJQSxlQUFBLENBQWdCLFNBQUEsR0FBQTttQkFBRyxRQUFIO1VBQUEsQ0FBaEIsRUFMUztRQUFBLENBQVgsQ0FKQSxDQUFBO2VBV0EsRUFBQSxDQUFHLCtCQUFILEVBQW9DLFNBQUEsR0FBQTtBQUNsQyxVQUFBLE1BQUEsQ0FBTyxNQUFQLENBQWMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUE1QyxDQUFBLENBQUE7aUJBQ0EsTUFBQSxDQUFPLElBQVAsQ0FBWSxDQUFDLElBQWIsQ0FBa0IsSUFBSSxDQUFDLElBQUwsQ0FBVSxNQUFWLEVBQWtCLG1CQUFsQixDQUFsQixFQUZrQztRQUFBLENBQXBDLEVBWjRDO01BQUEsQ0FBOUMsRUFqQjJCO0lBQUEsQ0FBN0IsRUFEZ0I7RUFBQSxDQUFsQixDQUhBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/niv/.atom/packages/build-tools/spec/input-spec.coffee
