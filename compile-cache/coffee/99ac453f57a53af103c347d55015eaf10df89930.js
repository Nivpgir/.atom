(function() {
  var FooterView;

  module.exports = FooterView = (function() {
    function FooterView(isWhitespaceIgnored) {
      var copyToLeftButton, copyToRightButton, ignoreWhitespaceLabel, ignoreWhitespaceValue, left, mid, nextDiffButton, numDifferences, prevDiffButton, right, selectionDivider;
      this.element = document.createElement('div');
      this.element.classList.add('split-diff-ui');
      prevDiffButton = document.createElement('button');
      prevDiffButton.classList.add('btn');
      prevDiffButton.classList.add('btn-md');
      prevDiffButton.classList.add('prev-diff');
      prevDiffButton.onclick = function() {
        return atom.commands.dispatch(atom.views.getView(atom.workspace), 'split-diff:prev-diff');
      };
      prevDiffButton.title = 'Move to Previous Diff';
      nextDiffButton = document.createElement('button');
      nextDiffButton.classList.add('btn');
      nextDiffButton.classList.add('btn-md');
      nextDiffButton.classList.add('next-diff');
      nextDiffButton.onclick = function() {
        return atom.commands.dispatch(atom.views.getView(atom.workspace), 'split-diff:next-diff');
      };
      nextDiffButton.title = 'Move to Next Diff';
      this.selectionCountValue = document.createElement('span');
      this.selectionCountValue.classList.add('selection-count-value');
      this.element.appendChild(this.selectionCountValue);
      selectionDivider = document.createElement('span');
      selectionDivider.textContent = '/';
      selectionDivider.classList.add('selection-divider');
      this.element.appendChild(selectionDivider);
      this.selectionCount = document.createElement('div');
      this.selectionCount.classList.add('selection-count');
      this.selectionCount.classList.add('hidden');
      this.selectionCount.appendChild(this.selectionCountValue);
      this.selectionCount.appendChild(selectionDivider);
      this.numDifferencesValue = document.createElement('span');
      this.numDifferencesValue.classList.add('num-diff-value');
      this.numDifferencesValue.textContent = '...';
      this.numDifferencesText = document.createElement('span');
      this.numDifferencesText.textContent = 'differences';
      this.numDifferencesText.classList.add('num-diff-text');
      numDifferences = document.createElement('div');
      numDifferences.classList.add('num-diff');
      numDifferences.appendChild(this.numDifferencesValue);
      numDifferences.appendChild(this.numDifferencesText);
      left = document.createElement('div');
      left.classList.add('left');
      left.appendChild(prevDiffButton);
      left.appendChild(nextDiffButton);
      left.appendChild(this.selectionCount);
      left.appendChild(numDifferences);
      this.element.appendChild(left);
      copyToLeftButton = document.createElement('button');
      copyToLeftButton.classList.add('btn');
      copyToLeftButton.classList.add('btn-md');
      copyToLeftButton.classList.add('copy-to-left');
      copyToLeftButton.onclick = function() {
        return atom.commands.dispatch(atom.views.getView(atom.workspace), 'split-diff:copy-to-left');
      };
      copyToLeftButton.title = 'Copy to Left';
      copyToRightButton = document.createElement('button');
      copyToRightButton.classList.add('btn');
      copyToRightButton.classList.add('btn-md');
      copyToRightButton.classList.add('copy-to-right');
      copyToRightButton.onclick = function() {
        return atom.commands.dispatch(atom.views.getView(atom.workspace), 'split-diff:copy-to-right');
      };
      copyToRightButton.title = 'Copy to Right';
      mid = document.createElement('div');
      mid.classList.add('mid');
      mid.appendChild(copyToLeftButton);
      mid.appendChild(copyToRightButton);
      this.element.appendChild(mid);
      ignoreWhitespaceValue = document.createElement('input');
      ignoreWhitespaceValue.type = 'checkbox';
      ignoreWhitespaceValue.id = 'ignore-whitespace-checkbox';
      ignoreWhitespaceValue.checked = isWhitespaceIgnored;
      ignoreWhitespaceValue.addEventListener('change', function() {
        return atom.commands.dispatch(atom.views.getView(atom.workspace), 'split-diff:ignore-whitespace');
      });
      ignoreWhitespaceLabel = document.createElement('label');
      ignoreWhitespaceLabel.classList.add('ignore-whitespace-label');
      ignoreWhitespaceLabel.htmlFor = 'ignore-whitespace-checkbox';
      ignoreWhitespaceLabel.textContent = 'Ignore Whitespace';
      right = document.createElement('div');
      right.classList.add('right');
      right.appendChild(ignoreWhitespaceValue);
      right.appendChild(ignoreWhitespaceLabel);
      this.element.appendChild(right);
    }

    FooterView.prototype.destroy = function() {
      this.element.remove();
      return this.footerPanel.destroy();
    };

    FooterView.prototype.getElement = function() {
      return this.element;
    };

    FooterView.prototype.createPanel = function() {
      return this.footerPanel = atom.workspace.addBottomPanel({
        item: this.element
      });
    };

    FooterView.prototype.show = function() {
      return this.footerPanel.show();
    };

    FooterView.prototype.hide = function() {
      return this.footerPanel.hide();
    };

    FooterView.prototype.setNumDifferences = function(num) {
      if (num === 1) {
        this.numDifferencesText.textContent = 'difference';
      } else {
        this.numDifferencesText.textContent = 'differences';
      }
      return this.numDifferencesValue.textContent = num;
    };

    FooterView.prototype.showSelectionCount = function(count) {
      this.selectionCountValue.textContent = count;
      return this.selectionCount.classList.remove('hidden');
    };

    return FooterView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvc3BsaXQtZGlmZi9saWIvZm9vdGVyLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFVBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxvQkFBQyxtQkFBRCxHQUFBO0FBRVgsVUFBQSxxS0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLGVBQXZCLENBREEsQ0FBQTtBQUFBLE1BUUEsY0FBQSxHQUFpQixRQUFRLENBQUMsYUFBVCxDQUF1QixRQUF2QixDQVJqQixDQUFBO0FBQUEsTUFTQSxjQUFjLENBQUMsU0FBUyxDQUFDLEdBQXpCLENBQTZCLEtBQTdCLENBVEEsQ0FBQTtBQUFBLE1BVUEsY0FBYyxDQUFDLFNBQVMsQ0FBQyxHQUF6QixDQUE2QixRQUE3QixDQVZBLENBQUE7QUFBQSxNQVdBLGNBQWMsQ0FBQyxTQUFTLENBQUMsR0FBekIsQ0FBNkIsV0FBN0IsQ0FYQSxDQUFBO0FBQUEsTUFZQSxjQUFjLENBQUMsT0FBZixHQUF5QixTQUFBLEdBQUE7ZUFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBdkIsRUFBMkQsc0JBQTNELEVBRHVCO01BQUEsQ0FaekIsQ0FBQTtBQUFBLE1BY0EsY0FBYyxDQUFDLEtBQWYsR0FBdUIsdUJBZHZCLENBQUE7QUFBQSxNQWdCQSxjQUFBLEdBQWlCLFFBQVEsQ0FBQyxhQUFULENBQXVCLFFBQXZCLENB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

//# sourceURL=/C:/Users/MNP/.atom/packages/split-diff/lib/footer-view.coffee
