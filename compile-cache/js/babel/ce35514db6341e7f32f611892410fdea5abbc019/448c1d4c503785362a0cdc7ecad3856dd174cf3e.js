'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

module.exports = (function () {
  function DiffViewEditor(editor) {
    _classCallCheck(this, DiffViewEditor);

    this._editor = editor;
    this._markers = [];
    this._currentSelection = null;
    this._oldPlaceholderText = editor.getPlaceholderText();
    editor.setPlaceholderText('Paste what you want to diff here!');
  }

  /**
   * Creates a decoration for an offset. Adds the marker to this._markers.
   *
   * @param lineNumber The line number to add the block decoration to.
   * @param numberOfLines The number of lines that the block decoration's height will be.
   * @param blockPosition Specifies whether to put the decoration before the line or after.
   */

  _createClass(DiffViewEditor, [{
    key: '_addOffsetDecoration',
    value: function _addOffsetDecoration(lineNumber, numberOfLines, blockPosition) {
      var element = document.createElement('div');
      element.className += 'split-diff-offset';
      // if no text, set height for blank lines
      element.style.minHeight = numberOfLines * this._editor.getLineHeightInPixels() + 'px';

      var marker = this._editor.markScreenPosition([lineNumber, 0], { invalidate: 'never', persistent: false });
      this._editor.decorateMarker(marker, { type: 'block', position: blockPosition, item: element });
      this._markers.push(marker);
    }

    /**
     * Adds offsets (blank lines) into the editor.
     *
     * @param lineOffsets An array of offsets (blank lines) to insert into this editor.
     */
  }, {
    key: 'setLineOffsets',
    value: function setLineOffsets(lineOffsets) {
      var offsetLineNumbers = Object.keys(lineOffsets).map(function (lineNumber) {
        return parseInt(lineNumber, 10);
      }).sort(function (x, y) {
        return x - y;
      });

      for (var offsetLineNumber of offsetLineNumbers) {
        if (offsetLineNumber == 0) {
          // add block decoration before if adding to line 0
          this._addOffsetDecoration(offsetLineNumber - 1, lineOffsets[offsetLineNumber], 'before');
        } else {
          // add block decoration after if adding to lines > 0
          this._addOffsetDecoration(offsetLineNumber - 1, lineOffsets[offsetLineNumber], 'after');
        }
      }
    }

    /**
     * Creates markers for line highlights. Adds them to this._markers. Should be
     * called before setLineOffsets since this initializes this._markers.
     *
     * @param changedLines An array of buffer line numbers that should be highlighted.
     * @param type The type of highlight to be applied to the line.
     */
  }, {
    key: 'setLineHighlights',
    value: function setLineHighlights(changedLines, highlightType) {
      if (changedLines === undefined) changedLines = [];

      var highlightClass = 'split-diff-' + highlightType;
      for (var i = 0; i < changedLines.length; i++) {
        this._markers.push(this._createLineMarker(changedLines[i][0], changedLines[i][1], highlightClass));
      }
    }

    /**
     * Creates a marker and decorates its line and line number.
     *
     * @param startLineNumber A buffer line number to start highlighting at.
     * @param endLineNumber A buffer line number to end highlighting at.
     * @param highlightClass The type of highlight to be applied to the line.
     *    Could be a value of: ['split-diff-insert', 'split-diff-delete',
     *    'split-diff-select'].
     * @return The created line marker.
     */
  }, {
    key: '_createLineMarker',
    value: function _createLineMarker(startLineNumber, endLineNumber, highlightClass) {
      var marker = this._editor.markBufferRange([[startLineNumber, 0], [endLineNumber, 0]], { invalidate: 'never', persistent: false, 'class': highlightClass });

      this._editor.decorateMarker(marker, { type: 'line-number', 'class': highlightClass });
      this._editor.decorateMarker(marker, { type: 'line', 'class': highlightClass });

      return marker;
    }

    /**
     * Highlights words in a given line.
     *
     * @param lineNumber The line number to highlight words on.
     * @param wordDiff An array of objects which look like...
     *    added: boolean (not used)
     *    count: number (not used)
     *    removed: boolean (not used)
     *    value: string
     *    changed: boolean
     * @param type The type of highlight to be applied to the words.
     */
  }, {
    key: 'setWordHighlights',
    value: function setWordHighlights(lineNumber, wordDiff, type, isWhitespaceIgnored) {
      if (wordDiff === undefined) wordDiff = [];

      var klass = 'split-diff-word-' + type;
      var count = 0;

      for (var i = 0; i < wordDiff.length; i++) {
        if (wordDiff[i].value) {
          // fix for #49
          // if there was a change
          // AND one of these is true:
          // if the string is not spaces, highlight
          // OR
          // if the string is spaces and whitespace not ignored, highlight
          if (wordDiff[i].changed && (/\S/.test(wordDiff[i].value) || !/\S/.test(wordDiff[i].value) && !isWhitespaceIgnored)) {
            var marker = this._editor.markBufferRange([[lineNumber, count], [lineNumber, count + wordDiff[i].value.length]], { invalidate: 'never', persistent: false, 'class': klass });

            this._editor.decorateMarker(marker, { type: 'highlight', 'class': klass });
            this._markers.push(marker);
          }
          count += wordDiff[i].value.length;
        }
      }
    }

    /**
     * Destroys all markers added to this editor by split-diff.
     */
  }, {
    key: 'destroyMarkers',
    value: function destroyMarkers() {
      for (var i = 0; i < this._markers.length; i++) {
        this._markers[i].destroy();
      }
      this._markers = [];

      this.deselectAllLines();
      this._editor.setPlaceholderText(this._oldPlaceholderText);
    }

    /**
     * Not added to this._markers because we want it to persist between updates.
     *
     * @param startLine The line number that the selection starts at.
     * @param endLine The line number that the selection ends at (non-inclusive).
     */
  }, {
    key: 'selectLines',
    value: function selectLines(startLine, endLine) {
      // don't want to highlight if they are the same (same numbers means chunk is
      // just pointing to a location to copy-to-right/copy-to-left)
      if (startLine < endLine) {
        this._currentSelection = this._createLineMarker(startLine, endLine, 'split-diff-selected');
      }
    }

    /**
     * Destroy the selection markers.
     */
  }, {
    key: 'deselectAllLines',
    value: function deselectAllLines() {
      if (this._currentSelection) {
        this._currentSelection.destroy();
        this._currentSelection = null;
      }
    }

    /**
     * Enable soft wrap for this editor.
     */
  }, {
    key: 'enableSoftWrap',
    value: function enableSoftWrap() {
      try {
        this._editor.setSoftWrapped(true);
      } catch (e) {
        //console.log('Soft wrap was enabled on a text editor that does not exist.');
      }
    }

    /**
     * Removes the text editor without prompting a save.
     */
  }, {
    key: 'cleanUp',
    value: function cleanUp() {
      // if the pane that this editor was in is now empty, we will destroy it
      var editorPane = atom.workspace.paneForItem(this._editor);
      if (typeof editorPane !== 'undefined' && editorPane != null && editorPane.getItems().length == 1) {
        editorPane.destroy();
      } else {
        this._editor.setText('');
        this._editor.destroy();
      }
    }

    /**
     * Finds cursor-touched line ranges that are marked as different in an editor
     * view.
     *
     * @return The line ranges of diffs that are touched by a cursor.
     */
  }, {
    key: 'getCursorDiffLines',
    value: function getCursorDiffLines() {
      var cursorPositions = this._editor.getCursorBufferPositions();
      var touchedLines = [];

      for (var i = 0; i < cursorPositions.length; i++) {
        for (var j = 0; j < this._markers.length; j++) {
          var markerRange = this._markers[j].getBufferRange();

          if (cursorPositions[i].row >= markerRange.start.row && cursorPositions[i].row < markerRange.end.row) {
            touchedLines.push(markerRange);
            break;
          }
        }
      }

      // put the chunks in order so the copy function doesn't mess up
      touchedLines.sort(function (lineA, lineB) {
        return lineA.start.row - lineB.start.row;
      });

      return touchedLines;
    }

    /**
     * Used to get the Text Editor object for this view. Helpful for calling basic
     * Atom Text Editor functions.
     *
     * @return The Text Editor object for this view.
     */
  }, {
    key: 'getEditor',
    value: function getEditor() {
      return this._editor;
    }
  }]);

  return DiffViewEditor;
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL01OUC8uYXRvbS9wYWNrYWdlcy9zcGxpdC1kaWZmL2xpYi9idWlsZC1saW5lcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7OztBQUVYLE1BQU0sQ0FBQyxPQUFPO0FBS0QsV0FMVSxjQUFjLENBS3ZCLE1BQU0sRUFBRTswQkFMQyxjQUFjOztBQU1qQyxRQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUN0QixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNuQixRQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0FBQzlCLFFBQUksQ0FBQyxtQkFBbUIsR0FBRyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztBQUN2RCxVQUFNLENBQUMsa0JBQWtCLENBQUMsbUNBQW1DLENBQUMsQ0FBQztHQUNoRTs7Ozs7Ozs7OztlQVhvQixjQUFjOztXQW9CZiw4QkFBQyxVQUFVLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBUTtBQUNuRSxVQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVDLGFBQU8sQ0FBQyxTQUFTLElBQUksbUJBQW1CLENBQUM7O0FBRXpDLGFBQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEFBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsR0FBSSxJQUFJLENBQUM7O0FBRXhGLFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0FBQ3hHLFVBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVB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O0FBRXRCLFdBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzNDLGFBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN6QyxjQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDOztBQUVwRCxjQUFJLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQzlDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7QUFDL0Msd0JBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDL0Isa0JBQU07V0FDVDtTQUNGO09BQ0Y7OztBQUdELGtCQUFZLENBQUMsSUFBSSxDQUFDLFVBQVMsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUN2QyxlQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO09BQzFDLENBQUMsQ0FBQzs7QUFFSCxhQUFPLFlBQVksQ0FBQztLQUNyQjs7Ozs7Ozs7OztXQVFRLHFCQUFlO0FBQ3RCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztLQUNyQjs7O1NBM05vQixjQUFjO0lBNE5wQyxDQUFDIiwiZmlsZSI6IkM6L1VzZXJzL01OUC8uYXRvbS9wYWNrYWdlcy9zcGxpdC1kaWZmL2xpYi9idWlsZC1saW5lcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIERpZmZWaWV3RWRpdG9yIHtcclxuICBfZWRpdG9yOiBPYmplY3Q7XHJcbiAgX21hcmtlcnM6IEFycmF5PGF0b20kTWFya2VyPjtcclxuICBfY3VycmVudFNlbGVjdGlvbjogQXJyYXk8YXRvbSRNYXJrZXI+O1xyXG5cclxuICBjb25zdHJ1Y3RvcihlZGl0b3IpIHtcclxuICAgIHRoaXMuX2VkaXRvciA9IGVkaXRvcjtcclxuICAgIHRoaXMuX21hcmtlcnMgPSBbXTtcclxuICAgIHRoaXMuX2N1cnJlbnRTZWxlY3Rpb24gPSBudWxsO1xyXG4gICAgdGhpcy5fb2xkUGxhY2Vob2xkZXJUZXh0ID0gZWRpdG9yLmdldFBsYWNlaG9sZGVyVGV4dCgpO1xyXG4gICAgZWRpdG9yLnNldFBsYWNlaG9sZGVyVGV4dCgnUGFzdGUgd2hhdCB5b3Ugd2FudCB0byBkaWZmIGhlcmUhJyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIGEgZGVjb3JhdGlvbiBmb3IgYW4gb2Zmc2V0LiBBZGRzIHRoZSBtYXJrZXIgdG8gdGhpcy5fbWFya2Vycy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBsaW5lTnVtYmVyIFRoZSBsaW5lIG51bWJlciB0byBhZGQgdGhlIGJsb2NrIGRlY29yYXRpb24gdG8uXHJcbiAgICogQHBhcmFtIG51bWJlck9mTGluZXMgVGhlIG51bWJlciBvZiBsaW5lcyB0aGF0IHRoZSBibG9jayBkZWNvcmF0aW9uJ3MgaGVpZ2h0IHdpbGwgYmUuXHJcbiAgICogQHBhcmFtIGJsb2NrUG9zaXRpb24gU3BlY2lmaWVzIHdoZXRoZXIgdG8gcHV0IHRoZSBkZWNvcmF0aW9uIGJlZm9yZSB0aGUgbGluZSBvciBhZnRlci5cclxuICAgKi9cclxuICBfYWRkT2Zmc2V0RGVjb3JhdGlvbihsaW5lTnVtYmVyLCBudW1iZXJPZkxpbmVzLCBibG9ja1Bvc2l0aW9uKTogdm9pZCB7XHJcbiAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgZWxlbWVudC5jbGFzc05hbWUgKz0gJ3NwbGl0LWRpZmYtb2Zmc2V0JztcclxuICAgIC8vIGlmIG5vIHRleHQsIHNldCBoZWlnaHQgZm9yIGJsYW5rIGxpbmVzXHJcbiAgICBlbGVtZW50LnN0eWxlLm1pbkhlaWdodCA9IChudW1iZXJPZkxpbmVzICogdGhpcy5fZWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpKSArICdweCc7XHJcblxyXG4gICAgdmFyIG1hcmtlciA9IHRoaXMuX2VkaXRvci5tYXJrU2NyZWVuUG9zaXRpb24oW2xpbmVOdW1iZXIsIDBdLCB7aW52YWxpZGF0ZTogJ25ldmVyJywgcGVyc2lzdGVudDogZmFsc2V9KTtcclxuICAgIHRoaXMuX2VkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHt0eXBlOiAnYmxvY2snLCBwb3NpdGlvbjogYmxvY2tQb3NpdGlvbiwgaXRlbTogZWxlbWVudH0pO1xyXG4gICAgdGhpcy5fbWFya2Vycy5wdXNoKG1hcmtlcik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBZGRzIG9mZnNldHMgKGJsYW5rIGxpbmVzKSBpbnRvIHRoZSBlZGl0b3IuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gbGluZU9mZnNldHMgQW4gYXJyYXkgb2Ygb2Zmc2V0cyAoYmxhbmsgbGluZXMpIHRvIGluc2VydCBpbnRvIHRoaXMgZWRpdG9yLlxyXG4gICAqL1xyXG4gIHNldExpbmVPZmZzZXRzKGxpbmVPZmZzZXRzOiBhbnkpOiB2b2lkIHtcclxuICAgIHZhciBvZmZzZXRMaW5lTnVtYmVycyA9IE9iamVjdC5rZXlzKGxpbmVPZmZzZXRzKS5tYXAobGluZU51bWJlciA9PiBwYXJzZUludChsaW5lTnVtYmVyLCAxMCkpLnNvcnQoKHgsIHkpID0+IHggLSB5KTtcclxuXHJcbiAgICBmb3IgKHZhciBvZmZzZXRMaW5lTnVtYmVyIG9mIG9mZnNldExpbmVOdW1iZXJzKSB7XHJcbiAgICAgIGlmIChvZmZzZXRMaW5lTnVtYmVyID09IDApIHtcclxuICAgICAgICAvLyBhZGQgYmxvY2sgZGVjb3JhdGlvbiBiZWZvcmUgaWYgYWRkaW5nIHRvIGxpbmUgMFxyXG4gICAgICAgIHRoaXMuX2FkZE9mZnNldERlY29yYXRpb24ob2Zmc2V0TGluZU51bWJlci0xLCBsaW5lT2Zmc2V0c1tvZmZzZXRMaW5lTnVtYmVyXSwgJ2JlZm9yZScpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIGFkZCBibG9jayBkZWNvcmF0aW9uIGFmdGVyIGlmIGFkZGluZyB0byBsaW5lcyA+IDBcclxuICAgICAgICB0aGlzLl9hZGRPZmZzZXREZWNvcmF0aW9uKG9mZnNldExpbmVOdW1iZXItMSwgbGluZU9mZnNldHNbb2Zmc2V0TGluZU51bWJlcl0sICdhZnRlcicpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIG1hcmtlcnMgZm9yIGxpbmUgaGlnaGxpZ2h0cy4gQWRkcyB0aGVtIHRvIHRoaXMuX21hcmtlcnMuIFNob3VsZCBiZVxyXG4gICAqIGNhbGxlZCBiZWZvcmUgc2V0TGluZU9mZnNldHMgc2luY2UgdGhpcyBpbml0aWFsaXplcyB0aGlzLl9tYXJrZXJzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGNoYW5nZWRMaW5lcyBBbiBhcnJheSBvZiBidWZmZXIgbGluZSBudW1iZXJzIHRoYXQgc2hvdWxkIGJlIGhpZ2hsaWdodGVkLlxyXG4gICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIGhpZ2hsaWdodCB0byBiZSBhcHBsaWVkIHRvIHRoZSBsaW5lLlxyXG4gICAqL1xyXG4gIHNldExpbmVIaWdobGlnaHRzKGNoYW5nZWRMaW5lczogQXJyYXk8bnVtYmVyPiA9IFtdLCBoaWdobGlnaHRUeXBlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHZhciBoaWdobGlnaHRDbGFzcyA9ICdzcGxpdC1kaWZmLScgKyBoaWdobGlnaHRUeXBlO1xyXG4gICAgZm9yICh2YXIgaT0wOyBpPGNoYW5nZWRMaW5lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB0aGlzLl9tYXJrZXJzLnB1c2godGhpcy5fY3JlYXRlTGluZU1hcmtlcihjaGFuZ2VkTGluZXNbaV1bMF0sIGNoYW5nZWRMaW5lc1tpXVsxXSwgaGlnaGxpZ2h0Q2xhc3MpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBtYXJrZXIgYW5kIGRlY29yYXRlcyBpdHMgbGluZSBhbmQgbGluZSBudW1iZXIuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc3RhcnRMaW5lTnVtYmVyIEEgYnVmZmVyIGxpbmUgbnVtYmVyIHRvIHN0YXJ0IGhpZ2hsaWdodGluZyBhdC5cclxuICAgKiBAcGFyYW0gZW5kTGluZU51bWJlciBBIGJ1ZmZlciBsaW5lIG51bWJlciB0byBlbmQgaGlnaGxpZ2h0aW5nIGF0LlxyXG4gICAqIEBwYXJhbSBoaWdobGlnaHRDbGFzcyBUaGUgdHlwZSBvZiBoaWdobGlnaHQgdG8gYmUgYXBwbGllZCB0byB0aGUgbGluZS5cclxuICAgKiAgICBDb3VsZCBiZSBhIHZhbHVlIG9mOiBbJ3NwbGl0LWRpZmYtaW5zZXJ0JywgJ3NwbGl0LWRpZmYtZGVsZXRlJyxcclxuICAgKiAgICAnc3BsaXQtZGlmZi1zZWxlY3QnXS5cclxuICAgKiBAcmV0dXJuIFRoZSBjcmVhdGVkIGxpbmUgbWFya2VyLlxyXG4gICAqL1xyXG4gIF9jcmVhdGVMaW5lTWFya2VyKHN0YXJ0TGluZU51bWJlcjogbnVtYmVyLCBlbmRMaW5lTnVtYmVyOiBudW1iZXIsIGhpZ2hsaWdodENsYXNzOiBzdHJpbmcpOiBhdG9tJE1hcmtlciB7XHJcbiAgICB2YXIgbWFya2VyID0gdGhpcy5fZWRpdG9yLm1hcmtCdWZmZXJSYW5nZShbW3N0YXJ0TGluZU51bWJlciwgMF0sIFtlbmRMaW5lTnVtYmVyLCAwXV0sIHtpbnZhbGlkYXRlOiAnbmV2ZXInLCBwZXJzaXN0ZW50OiBmYWxzZSwgY2xhc3M6IGhpZ2hsaWdodENsYXNzfSlcclxuXHJcbiAgICB0aGlzLl9lZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZTogJ2xpbmUtbnVtYmVyJywgY2xhc3M6IGhpZ2hsaWdodENsYXNzfSk7XHJcbiAgICB0aGlzLl9lZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZTogJ2xpbmUnLCBjbGFzczogaGlnaGxpZ2h0Q2xhc3N9KTtcclxuXHJcbiAgICByZXR1cm4gbWFya2VyO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSGlnaGxpZ2h0cyB3b3JkcyBpbiBhIGdpdmVuIGxpbmUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gbGluZU51bWJlciBUaGUgbGluZSBudW1iZXIgdG8gaGlnaGxpZ2h0IHdvcmRzIG9uLlxyXG4gICAqIEBwYXJhbSB3b3JkRGlmZiBBbiBhcnJheSBvZiBvYmplY3RzIHdoaWNoIGxvb2sgbGlrZS4uLlxyXG4gICAqICAgIGFkZGVkOiBib29sZWFuIChub3QgdXNlZClcclxuICAgKiAgICBjb3VudDogbnVtYmVyIChub3QgdXNlZClcclxuICAgKiAgICByZW1vdmVkOiBib29sZWFuIChub3QgdXNlZClcclxuICAgKiAgICB2YWx1ZTogc3RyaW5nXHJcbiAgICogICAgY2hhbmdlZDogYm9vbGVhblxyXG4gICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIGhpZ2hsaWdodCB0byBiZSBhcHBsaWVkIHRvIHRoZSB3b3Jkcy5cclxuICAgKi9cclxuICBzZXRXb3JkSGlnaGxpZ2h0cyhsaW5lTnVtYmVyOiBudW1iZXIsIHdvcmREaWZmOiBBcnJheTxhbnk+ID0gW10sIHR5cGU6IHN0cmluZywgaXNXaGl0ZXNwYWNlSWdub3JlZDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgdmFyIGtsYXNzID0gJ3NwbGl0LWRpZmYtd29yZC0nICsgdHlwZTtcclxuICAgIHZhciBjb3VudCA9IDA7XHJcblxyXG4gICAgZm9yICh2YXIgaT0wOyBpPHdvcmREaWZmLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmICh3b3JkRGlmZltpXS52YWx1ZSkgeyAvLyBmaXggZm9yICM0OVxyXG4gICAgICAgIC8vIGlmIHRoZXJlIHdhcyBhIGNoYW5nZVxyXG4gICAgICAgIC8vIEFORCBvbmUgb2YgdGhlc2UgaXMgdHJ1ZTpcclxuICAgICAgICAvLyBpZiB0aGUgc3RyaW5nIGlzIG5vdCBzcGFjZXMsIGhpZ2hsaWdodFxyXG4gICAgICAgIC8vIE9SXHJcbiAgICAgICAgLy8gaWYgdGhlIHN0cmluZyBpcyBzcGFjZXMgYW5kIHdoaXRlc3BhY2Ugbm90IGlnbm9yZWQsIGhpZ2hsaWdodFxyXG4gICAgICAgIGlmICh3b3JkRGlmZltpXS5jaGFuZ2VkXHJcbiAgICAgICAgICAmJiAoL1xcUy8udGVzdCh3b3JkRGlmZltpXS52YWx1ZSlcclxuICAgICAgICAgIHx8ICghL1xcUy8udGVzdCh3b3JkRGlmZltpXS52YWx1ZSkgJiYgIWlzV2hpdGVzcGFjZUlnbm9yZWQpKSkge1xyXG4gICAgICAgICAgdmFyIG1hcmtlciA9IHRoaXMuX2VkaXRvci5tYXJrQnVmZmVyUmFuZ2UoW1tsaW5lTnVtYmVyLCBjb3VudF0sIFtsaW5lTnVtYmVyLCAoY291bnQgKyB3b3JkRGlmZltpXS52YWx1ZS5sZW5ndGgpXV0sIHtpbnZhbGlkYXRlOiAnbmV2ZXInLCBwZXJzaXN0ZW50OiBmYWxzZSwgY2xhc3M6IGtsYXNzfSlcclxuXHJcbiAgICAgICAgICB0aGlzLl9lZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZTogJ2hpZ2hsaWdodCcsIGNsYXNzOiBrbGFzc30pO1xyXG4gICAgICAgICAgdGhpcy5fbWFya2Vycy5wdXNoKG1hcmtlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvdW50ICs9IHdvcmREaWZmW2ldLnZhbHVlLmxlbmd0aDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVzdHJveXMgYWxsIG1hcmtlcnMgYWRkZWQgdG8gdGhpcyBlZGl0b3IgYnkgc3BsaXQtZGlmZi5cclxuICAgKi9cclxuICBkZXN0cm95TWFya2VycygpOiB2b2lkIHtcclxuICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLl9tYXJrZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMuX21hcmtlcnNbaV0uZGVzdHJveSgpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fbWFya2VycyA9IFtdO1xyXG5cclxuICAgIHRoaXMuZGVzZWxlY3RBbGxMaW5lcygpO1xyXG4gICAgdGhpcy5fZWRpdG9yLnNldFBsYWNlaG9sZGVyVGV4dCh0aGlzLl9vbGRQbGFjZWhvbGRlclRleHQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTm90IGFkZGVkIHRvIHRoaXMuX21hcmtlcnMgYmVjYXVzZSB3ZSB3YW50IGl0IHRvIHBlcnNpc3QgYmV0d2VlbiB1cGRhdGVzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHN0YXJ0TGluZSBUaGUgbGluZSBudW1iZXIgdGhhdCB0aGUgc2VsZWN0aW9uIHN0YXJ0cyBhdC5cclxuICAgKiBAcGFyYW0gZW5kTGluZSBUaGUgbGluZSBudW1iZXIgdGhhdCB0aGUgc2VsZWN0aW9uIGVuZHMgYXQgKG5vbi1pbmNsdXNpdmUpLlxyXG4gICAqL1xyXG4gIHNlbGVjdExpbmVzKHN0YXJ0TGluZTogbnVtYmVyLCBlbmRMaW5lOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIC8vIGRvbid0IHdhbnQgdG8gaGlnaGxpZ2h0IGlmIHRoZXkgYXJlIHRoZSBzYW1lIChzYW1lIG51bWJlcnMgbWVhbnMgY2h1bmsgaXNcclxuICAgIC8vIGp1c3QgcG9pbnRpbmcgdG8gYSBsb2NhdGlvbiB0byBjb3B5LXRvLXJpZ2h0L2NvcHktdG8tbGVmdClcclxuICAgIGlmIChzdGFydExpbmUgPCBlbmRMaW5lKSB7XHJcbiAgICAgIHRoaXMuX2N1cnJlbnRTZWxlY3Rpb24gPSB0aGlzLl9jcmVhdGVMaW5lTWFya2VyKHN0YXJ0TGluZSwgZW5kTGluZSwgJ3NwbGl0LWRpZmYtc2VsZWN0ZWQnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERlc3Ryb3kgdGhlIHNlbGVjdGlvbiBtYXJrZXJzLlxyXG4gICAqL1xyXG4gIGRlc2VsZWN0QWxsTGluZXMoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5fY3VycmVudFNlbGVjdGlvbikge1xyXG4gICAgICB0aGlzLl9jdXJyZW50U2VsZWN0aW9uLmRlc3Ryb3koKTtcclxuICAgICAgdGhpcy5fY3VycmVudFNlbGVjdGlvbiA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFbmFibGUgc29mdCB3cmFwIGZvciB0aGlzIGVkaXRvci5cclxuICAgKi9cclxuICBlbmFibGVTb2Z0V3JhcCgpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMuX2VkaXRvci5zZXRTb2Z0V3JhcHBlZCh0cnVlKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZygnU29mdCB3cmFwIHdhcyBlbmFibGVkIG9uIGEgdGV4dCBlZGl0b3IgdGhhdCBkb2VzIG5vdCBleGlzdC4nKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZXMgdGhlIHRleHQgZWRpdG9yIHdpdGhvdXQgcHJvbXB0aW5nIGEgc2F2ZS5cclxuICAgKi9cclxuICBjbGVhblVwKCk6IHZvaWQge1xyXG4gICAgLy8gaWYgdGhlIHBhbmUgdGhhdCB0aGlzIGVkaXRvciB3YXMgaW4gaXMgbm93IGVtcHR5LCB3ZSB3aWxsIGRlc3Ryb3kgaXRcclxuICAgIHZhciBlZGl0b3JQYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0odGhpcy5fZWRpdG9yKTtcclxuICAgIGlmICh0eXBlb2YgZWRpdG9yUGFuZSAhPT0gJ3VuZGVmaW5lZCcgJiYgZWRpdG9yUGFuZSAhPSBudWxsICYmIGVkaXRvclBhbmUuZ2V0SXRlbXMoKS5sZW5ndGggPT0gMSkge1xyXG4gICAgICBlZGl0b3JQYW5lLmRlc3Ryb3koKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX2VkaXRvci5zZXRUZXh0KCcnKTtcclxuICAgICAgdGhpcy5fZWRpdG9yLmRlc3Ryb3koKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZpbmRzIGN1cnNvci10b3VjaGVkIGxpbmUgcmFuZ2VzIHRoYXQgYXJlIG1hcmtlZCBhcyBkaWZmZXJlbnQgaW4gYW4gZWRpdG9yXHJcbiAgICogdmlldy5cclxuICAgKlxyXG4gICAqIEByZXR1cm4gVGhlIGxpbmUgcmFuZ2VzIG9mIGRpZmZzIHRoYXQgYXJlIHRvdWNoZWQgYnkgYSBjdXJzb3IuXHJcbiAgICovXHJcbiAgZ2V0Q3Vyc29yRGlmZkxpbmVzKCk6IGJvb2xlYW4ge1xyXG4gICAgdmFyIGN1cnNvclBvc2l0aW9ucyA9IHRoaXMuX2VkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbnMoKTtcclxuICAgIHZhciB0b3VjaGVkTGluZXMgPSBbXTtcclxuXHJcbiAgICBmb3IgKHZhciBpPTA7IGk8Y3Vyc29yUG9zaXRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGZvciAodmFyIGo9MDsgajx0aGlzLl9tYXJrZXJzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgdmFyIG1hcmtlclJhbmdlID0gdGhpcy5fbWFya2Vyc1tqXS5nZXRCdWZmZXJSYW5nZSgpO1xyXG5cclxuICAgICAgICBpZiAoY3Vyc29yUG9zaXRpb25zW2ldLnJvdyA+PSBtYXJrZXJSYW5nZS5zdGFydC5yb3dcclxuICAgICAgICAgICYmIGN1cnNvclBvc2l0aW9uc1tpXS5yb3cgPCBtYXJrZXJSYW5nZS5lbmQucm93KSB7XHJcbiAgICAgICAgICAgIHRvdWNoZWRMaW5lcy5wdXNoKG1hcmtlclJhbmdlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHV0IHRoZSBjaHVua3MgaW4gb3JkZXIgc28gdGhlIGNvcHkgZnVuY3Rpb24gZG9lc24ndCBtZXNzIHVwXHJcbiAgICB0b3VjaGVkTGluZXMuc29ydChmdW5jdGlvbihsaW5lQSwgbGluZUIpIHtcclxuICAgICAgcmV0dXJuIGxpbmVBLnN0YXJ0LnJvdyAtIGxpbmVCLnN0YXJ0LnJvdztcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB0b3VjaGVkTGluZXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVc2VkIHRvIGdldCB0aGUgVGV4dCBFZGl0b3Igb2JqZWN0IGZvciB0aGlzIHZpZXcuIEhlbHBmdWwgZm9yIGNhbGxpbmcgYmFzaWNcclxuICAgKiBBdG9tIFRleHQgRWRpdG9yIGZ1bmN0aW9ucy5cclxuICAgKlxyXG4gICAqIEByZXR1cm4gVGhlIFRleHQgRWRpdG9yIG9iamVjdCBmb3IgdGhpcyB2aWV3LlxyXG4gICAqL1xyXG4gIGdldEVkaXRvcigpOiBUZXh0RWRpdG9yIHtcclxuICAgIHJldHVybiB0aGlzLl9lZGl0b3I7XHJcbiAgfVxyXG59O1xyXG4iXX0=
//# sourceURL=/C:/Users/MNP/.atom/packages/split-diff/lib/build-lines.js
