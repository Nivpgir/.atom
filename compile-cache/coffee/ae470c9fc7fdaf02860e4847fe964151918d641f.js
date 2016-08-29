(function() {
  var Edit;

  Edit = require('../lib/environment/child-process').edit;

  describe('ChildProcess', function() {
    var edit;
    edit = null;
    beforeEach(function() {
      return edit = new Edit;
    });
    describe('on new command', function() {
      beforeEach(function() {
        return edit.set(null);
      });
      return it('resets all values', function() {
        return expect(edit.streams[0].selectedIndex).toBe(5);
      });
    });
    return describe('on edit command', function() {
      var command;
      command = null;
      beforeEach(function() {
        command = {
          environment: {
            name: 'child_process',
            config: {
              stdoe: 'no-stdout'
            }
          }
        };
        return edit.set(command);
      });
      it('sets all values', function() {
        return expect(edit.streams[0].selectedIndex).toBe(1);
      });
      return describe('on get with correct values', function() {
        var nc, ret;
        nc = null;
        ret = null;
        beforeEach(function() {
          nc = {};
          return ret = edit.get(nc);
        });
        it('writes the correct values', function() {
          return expect(nc).toEqual({
            environment: {
              name: 'child_process',
              config: {
                stdoe: 'no-stdout'
              }
            }
          });
        });
        return it('returns null', function() {
          return expect(ret).toBe(null);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2J1aWxkLXRvb2xzL3NwZWMvY29tbWFuZC1lZGl0LWNwLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLElBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGtDQUFSLENBQTJDLENBQUMsSUFBbkQsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUEsR0FBQTtBQUN2QixRQUFBLElBQUE7QUFBQSxJQUFBLElBQUEsR0FBTyxJQUFQLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxJQUFBLEdBQU8sR0FBQSxDQUFBLEtBREU7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBS0EsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUEsR0FBQTtBQUV6QixNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFDVCxJQUFJLENBQUMsR0FBTCxDQUFTLElBQVQsRUFEUztNQUFBLENBQVgsQ0FBQSxDQUFBO2FBR0EsRUFBQSxDQUFHLG1CQUFILEVBQXdCLFNBQUEsR0FBQTtlQUN0QixNQUFBLENBQU8sSUFBSSxDQUFDLE9BQVEsQ0FBQSxDQUFBLENBQUUsQ0FBQyxhQUF2QixDQUFxQyxDQUFDLElBQXRDLENBQTJDLENBQTNDLEVBRHNCO01BQUEsQ0FBeEIsRUFMeUI7SUFBQSxDQUEzQixDQUxBLENBQUE7V0FhQSxRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQSxHQUFBO0FBQzFCLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLElBQVYsQ0FBQTtBQUFBLE1BRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsT0FBQSxHQUNFO0FBQUEsVUFBQSxXQUFBLEVBQ0U7QUFBQSxZQUFBLElBQUEsRUFBTSxlQUFOO0FBQUEsWUFDQSxNQUFBLEVBQ0U7QUFBQSxjQUFBLEtBQUEsRUFBTyxXQUFQO2FBRkY7V0FERjtTQURGLENBQUE7ZUFLQSxJQUFJLENBQUMsR0FBTCxDQUFTLE9BQVQsRUFOUztNQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsTUFVQSxFQUFBLENBQUcsaUJBQUgsRUFBc0IsU0FBQSxHQUFBO2VBQ3BCLE1BQUEsQ0FBTyxJQUFJLENBQUMsT0FBUSxDQUFBLENBQUEsQ0FBRSxDQUFDLGFBQXZCLENBQXFDLENBQUMsSUFBdEMsQ0FBMkMsQ0FBM0MsRUFEb0I7TUFBQSxDQUF0QixDQVZBLENBQUE7YUFhQSxRQUFBLENBQVMsNEJBQVQsRUFBdUMsU0FBQSxHQUFBO0FBQ3JDLFlBQUEsT0FBQTtBQUFBLFFBQUEsRUFBQSxHQUFLLElBQUwsQ0FBQTtBQUFBLFFBQ0EsR0FBQSxHQUFNLElBRE4sQ0FBQTtBQUFBLFFBR0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsRUFBQSxHQUFLLEVBQUwsQ0FBQTtpQkFDQSxHQUFBLEdBQU0sSUFBSSxDQUFDLEdBQUwsQ0FBUyxFQUFULEVBRkc7UUFBQSxDQUFYLENBSEEsQ0FBQTtBQUFBLFFBT0EsRUFBQSxDQUFHLDJCQUFILEVBQWdDLFNBQUEsR0FBQTtpQkFDOUIsTUFBQSxDQUFPLEVBQVAsQ0FBVSxDQUFDLE9BQVgsQ0FDRTtBQUFBLFlBQUEsV0FBQSxFQUNFO0FBQUEsY0FBQSxJQUFBLEVBQU0sZUFBTjtBQUFBLGNBQ0EsTUFBQSxFQUNFO0FBQUEsZ0JBQUEsS0FBQSxFQUFPLFdBQVA7ZUFGRjthQURGO1dBREYsRUFEOEI7UUFBQSxDQUFoQyxDQVBBLENBQUE7ZUFjQSxFQUFBLENBQUcsY0FBSCxFQUFtQixTQUFBLEdBQUE7aUJBQ2pCLE1BQUEsQ0FBTyxHQUFQLENBQVcsQ0FBQyxJQUFaLENBQWlCLElBQWpCLEVBRGlCO1FBQUEsQ0FBbkIsRUFmcUM7TUFBQSxDQUF2QyxFQWQwQjtJQUFBLENBQTVCLEVBZHVCO0VBQUEsQ0FBekIsQ0FGQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/home/niv/.atom/packages/build-tools/spec/command-edit-cp-spec.coffee
