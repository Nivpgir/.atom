(function() {
  var TagView, cwd, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  TagView = require('../../lib/views/tag-view');

  cwd = repo.getWorkingDirectory();

  describe("TagView", function() {
    beforeEach(function() {
      this.tag = 'tag1';
      return this.view = new TagView(repo, this.tag);
    });
    it("displays 5 commands for the tag", function() {
      return expect(this.view.items.length).toBe(5);
    });
    it("gets the remotes to push to when the push command is selected", function() {
      spyOn(git, 'cmd').andCallFake(function() {
        return Promise.resolve('remotes');
      });
      this.view.confirmed(this.view.items[1]);
      return expect(git.cmd).toHaveBeenCalledWith(['remote'], {
        cwd: cwd
      });
    });
    it("calls git.cmd with 'checkout' to checkout the tag when checkout is selected", function() {
      spyOn(git, 'cmd').andCallFake(function() {
        return Promise.resolve('success');
      });
      this.view.confirmed(this.view.items[2]);
      return expect(git.cmd).toHaveBeenCalledWith(['checkout', this.tag], {
        cwd: cwd
      });
    });
    it("calls git.cmd with 'verify' when verify is selected", function() {
      spyOn(git, 'cmd').andCallFake(function() {
        return Promise.resolve('success');
      });
      this.view.confirmed(this.view.items[3]);
      return expect(git.cmd).toHaveBeenCalledWith(['tag', '--verify', this.tag], {
        cwd: cwd
      });
    });
    return it("calls git.cmd with 'delete' when delete is selected", function() {
      spyOn(git, 'cmd').andCallFake(function() {
        return Promise.resolve('success');
      });
      this.view.confirmed(this.view.items[4]);
      return expect(git.cmd).toHaveBeenCalledWith(['tag', '--delete', this.tag], {
        cwd: cwd
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvdmlld3MvdGFnLXZpZXctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUJBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsYUFBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxPQUFBLENBQVEsMEJBQVIsQ0FGVixDQUFBOztBQUFBLEVBSUEsR0FBQSxHQUFNLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBSk4sQ0FBQTs7QUFBQSxFQU1BLFFBQUEsQ0FBUyxTQUFULEVBQW9CLFNBQUEsR0FBQTtBQUNsQixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLElBQUMsQ0FBQSxHQUFELEdBQU8sTUFBUCxDQUFBO2FBQ0EsSUFBQyxDQUFBLElBQUQsR0FBWSxJQUFBLE9BQUEsQ0FBUSxJQUFSLEVBQWMsSUFBQyxDQUFBLEdBQWYsRUFGSDtJQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsSUFJQSxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQSxHQUFBO2FBQ3BDLE1BQUEsQ0FBTyxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFuQixDQUEwQixDQUFDLElBQTNCLENBQWdDLENBQWhDLEVBRG9DO0lBQUEsQ0FBdEMsQ0FKQSxDQUFBO0FBQUEsSUFPQSxFQUFBLENBQUcsK0RBQUgsRUFBb0UsU0FBQSxHQUFBO0FBQ2xFLE1BQUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsV0FBbEIsQ0FBOEIsU0FBQSxHQUFBO2VBQUcsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsU0FBaEIsRUFBSDtNQUFBLENBQTlCLENB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

//# sourceURL=/home/niv/.atom/packages/git-plus/spec/views/tag-view-spec.coffee
