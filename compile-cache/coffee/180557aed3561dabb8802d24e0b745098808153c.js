(function() {
  var GitDiff, git;

  git = require('../git');

  GitDiff = require('./git-diff');

  module.exports = function(repo) {
    var args;
    args = ['diff', '--stat'];
    if (atom.config.get('git-plus.includeStagedDiff')) {
      args.push('HEAD');
    }
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return GitDiff(repo, {
        diffStat: data,
        file: '.'
      });
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWRpZmYtYWxsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxZQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEsWUFBUixDQURWLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQsR0FBQTtBQUNmLFFBQUEsSUFBQTtBQUFBLElBQUEsSUFBQSxHQUFPLENBQUMsTUFBRCxFQUFTLFFBQVQsQ0FBUCxDQUFBO0FBQ0EsSUFBQSxJQUFvQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLENBQXBCO0FBQUEsTUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLE1BQVYsQ0FBQSxDQUFBO0tBREE7V0FFQSxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztBQUFBLE1BQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7S0FBZCxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRCxHQUFBO2FBQVUsT0FBQSxDQUFRLElBQVIsRUFBYztBQUFBLFFBQUEsUUFBQSxFQUFVLElBQVY7QUFBQSxRQUFnQixJQUFBLEVBQU0sR0FBdEI7T0FBZCxFQUFWO0lBQUEsQ0FETixFQUhlO0VBQUEsQ0FIakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/C:/Users/nivp/.atom/packages/git-plus/lib/models/git-diff-all.coffee
