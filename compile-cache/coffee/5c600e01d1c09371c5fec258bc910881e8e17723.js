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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL3NwbGl0LWRpZmYvbGliL2Zvb3Rlci12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxVQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsb0JBQUMsbUJBQUQsR0FBQTtBQUVYLFVBQUEscUtBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixlQUF2QixDQURBLENBQUE7QUFBQSxNQVFBLGNBQUEsR0FBaUIsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FSakIsQ0FBQTtBQUFBLE1BU0EsY0FBYyxDQUFDLFNBQVMsQ0FBQyxHQUF6QixDQUE2QixLQUE3QixDQVRBLENBQUE7QUFBQSxNQVVBLGNBQWMsQ0FBQyxTQUFTLENBQUMsR0FBekIsQ0FBNkIsUUFBN0IsQ0FWQSxDQUFBO0FBQUEsTUFXQSxjQUFjLENBQUMsU0FBUyxDQUFDLEdBQXpCLENBQTZCLFdBQTdCLENBWEEsQ0FBQTtBQUFBLE1BWUEsY0FBYyxDQUFDLE9BQWYsR0FBeUIsU0FBQSxHQUFBO2VBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQXZCLEVBQTJELHNCQUEzRCxFQUR1QjtNQUFBLENBWnpCLENBQUE7QUFBQSxNQWNBLGNBQWMsQ0FBQyxLQUFmLEdBQXVCLHVCQWR2QixDQUFBO0FBQUEsTUFnQkEsY0FBQSxHQUFpQixRQUFRLENBQUMsYUFBVCxDQUF1QixRQUF2QixD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

//# sourceURL=/C:/Users/nivp/.atom/packages/split-diff/lib/footer-view.coffee
