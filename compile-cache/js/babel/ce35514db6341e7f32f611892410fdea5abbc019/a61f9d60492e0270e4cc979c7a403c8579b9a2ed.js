'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _require = require('atom');

var CompositeDisposable = _require.CompositeDisposable;

var SyncScroll = (function () {
  function SyncScroll(editor1, editor2, syncHorizontalScroll) {
    var _this = this;

    _classCallCheck(this, SyncScroll);

    this._syncHorizontalScroll = syncHorizontalScroll;
    this._subscriptions = new CompositeDisposable();
    this._syncInfo = [{
      editor: editor1,
      editorView: atom.views.getView(editor1),
      scrolling: false
    }, {
      editor: editor2,
      editorView: atom.views.getView(editor2),
      scrolling: false
    }];

    this._syncInfo.forEach(function (editorInfo, i) {
      // Note that 'onDidChangeScrollTop' isn't technically in the public API.
      _this._subscriptions.add(editorInfo.editorView.onDidChangeScrollTop(function () {
        return _this._scrollPositionChanged(i);
      }));
      // Note that 'onDidChangeScrollLeft' isn't technically in the public API.
      if (_this._syncHorizontalScroll) {
        _this._subscriptions.add(editorInfo.editorView.onDidChangeScrollLeft(function () {
          return _this._scrollPositionChanged(i);
        }));
      }
      // bind this so that the editors line up on start of package
      _this._subscriptions.add(editorInfo.editor.emitter.on('did-change-scroll-top', function () {
        return _this._scrollPositionChanged(i);
      }));
    });
  }

  _createClass(SyncScroll, [{
    key: '_scrollPositionChanged',
    value: function _scrollPositionChanged(changeScrollIndex) {
      var thisInfo = this._syncInfo[changeScrollIndex];
      var otherInfo = this._syncInfo[1 - changeScrollIndex];

      if (thisInfo.scrolling) {
        return;
      }
      otherInfo.scrolling = true;
      try {
        otherInfo.editorView.setScrollTop(thisInfo.editorView.getScrollTop());
        if (this._syncHorizontalScroll) {
          otherInfo.editorView.setScrollLeft(thisInfo.editorView.getScrollLeft());
        }
      } catch (e) {
        //console.log(e);
      }
      otherInfo.scrolling = false;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      if (this._subscriptions) {
        this._subscriptions.dispose();
        this._subscriptions = null;
      }
    }
  }, {
    key: 'syncPositions',
    value: function syncPositions() {
      var activeTextEditor = atom.workspace.getActiveTextEditor();
      this._syncInfo.forEach(function (editorInfo, i) {
        if (editorInfo.editor == activeTextEditor) {
          editorInfo.editor.emitter.emit('did-change-scroll-top', editorInfo.editorView.getScrollTop());
        }
      });
    }
  }]);

  return SyncScroll;
})();

module.exports = SyncScroll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL01OUC8uYXRvbS9wYWNrYWdlcy9zcGxpdC1kaWZmL2xpYi9zeW5jLXNjcm9sbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7OztlQUVnQixPQUFPLENBQUMsTUFBTSxDQUFDOztJQUF0QyxtQkFBbUIsWUFBbkIsbUJBQW1COztJQUVsQixVQUFVO0FBRUgsV0FGUCxVQUFVLENBRUYsT0FBbUIsRUFBRSxPQUFtQixFQUFFLG9CQUE2QixFQUFFOzs7MEJBRmpGLFVBQVU7O0FBR1osUUFBSSxDQUFDLHFCQUFxQixHQUFHLG9CQUFvQixDQUFDO0FBQ2xELFFBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO0FBQ2hELFFBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQztBQUNoQixZQUFNLEVBQUUsT0FBTztBQUNmLGdCQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO0FBQ3ZDLGVBQVMsRUFBRSxLQUFLO0tBQ2pCLEVBQUU7QUFDRCxZQUFNLEVBQUUsT0FBTztBQUNmLGdCQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO0FBQ3ZDLGVBQVMsRUFBRSxLQUFLO0tBQ2pCLENBQUMsQ0FBQzs7QUFFSCxRQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUs7O0FBRXhDLFlBQUssY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDO2VBQU0sTUFBSyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7T0FBQSxDQUFDLENBQUMsQ0FBQzs7QUFFMUcsVUFBRyxNQUFLLHFCQUFxQixFQUFFO0FBQzdCLGNBQUssY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDO2lCQUFNLE1BQUssc0JBQXNCLENBQUMsQ0FBQyxDQUFDO1NBQUEsQ0FBQyxDQUFDLENBQUM7T0FDNUc7O0FBRUQsWUFBSyxjQUFjLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyx1QkFBdUIsRUFBRTtlQUFNLE1BQUssc0JBQXNCLENBQUMsQ0FBQyxDQUFDO09BQUEsQ0FBQyxDQUFDLENBQUM7S0FDdEgsQ0FBQyxDQUFDO0dBQ0o7O2VBekJHLFVBQVU7O1dBMkJRLGdDQUFDLGlCQUF5QixFQUFRO0FBQ3RELFVBQUksUUFBUSxHQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUNsRCxVQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDOztBQUV0RCxVQUFJLFFBQVEsQ0FBQyxTQUFTLEVBQUU7QUFDdEIsZUFBTztPQUNSO0FBQ0QsZUFBUyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDM0IsVUFBSTtBQUNGLGlCQUFTLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7QUFDdEUsWUFBRyxJQUFJLENBQUMscUJBQXFCLEVBQUU7QUFDN0IsbUJBQVMsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztTQUN6RTtPQUNGLENBQUMsT0FBTyxDQUFDLEVBQUU7O09BRVg7QUFDRCxlQUFTLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztLQUM3Qjs7O1dBRU0sbUJBQVM7QUFDZCxVQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7QUFDdkIsWUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM5QixZQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztPQUM1QjtLQUNGOzs7V0FFWSx5QkFBUztBQUNwQixVQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztBQUM1RCxVQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUs7QUFDeEMsWUFBRyxVQUFVLENBQUMsTUFBTSxJQUFJLGdCQUFnQixFQUFFO0FBQ3hDLG9CQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsVUFBVSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO1NBQy9GO09BQ0YsQ0FBQyxDQUFDO0tBQ0o7OztTQTVERyxVQUFVOzs7QUErRGhCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDIiwiZmlsZSI6IkM6L1VzZXJzL01OUC8uYXRvbS9wYWNrYWdlcy9zcGxpdC1kaWZmL2xpYi9zeW5jLXNjcm9sbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xyXG5cclxudmFyIHtDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUoJ2F0b20nKTtcclxuXHJcbmNsYXNzIFN5bmNTY3JvbGwge1xyXG5cclxuICBjb25zdHJ1Y3RvcihlZGl0b3IxOiBUZXh0RWRpdG9yLCBlZGl0b3IyOiBUZXh0RWRpdG9yLCBzeW5jSG9yaXpvbnRhbFNjcm9sbDogYm9vbGVhbikge1xyXG4gICAgdGhpcy5fc3luY0hvcml6b250YWxTY3JvbGwgPSBzeW5jSG9yaXpvbnRhbFNjcm9sbDtcclxuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xyXG4gICAgdGhpcy5fc3luY0luZm8gPSBbe1xyXG4gICAgICBlZGl0b3I6IGVkaXRvcjEsXHJcbiAgICAgIGVkaXRvclZpZXc6IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IxKSxcclxuICAgICAgc2Nyb2xsaW5nOiBmYWxzZSxcclxuICAgIH0sIHtcclxuICAgICAgZWRpdG9yOiBlZGl0b3IyLFxyXG4gICAgICBlZGl0b3JWaWV3OiBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yMiksXHJcbiAgICAgIHNjcm9sbGluZzogZmFsc2UsXHJcbiAgICB9XTtcclxuXHJcbiAgICB0aGlzLl9zeW5jSW5mby5mb3JFYWNoKChlZGl0b3JJbmZvLCBpKSA9PiB7XHJcbiAgICAgIC8vIE5vdGUgdGhhdCAnb25EaWRDaGFuZ2VTY3JvbGxUb3AnIGlzbid0IHRlY2huaWNhbGx5IGluIHRoZSBwdWJsaWMgQVBJLlxyXG4gICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLmFkZChlZGl0b3JJbmZvLmVkaXRvclZpZXcub25EaWRDaGFuZ2VTY3JvbGxUb3AoKCkgPT4gdGhpcy5fc2Nyb2xsUG9zaXRpb25DaGFuZ2VkKGkpKSk7XHJcbiAgICAgIC8vIE5vdGUgdGhhdCAnb25EaWRDaGFuZ2VTY3JvbGxMZWZ0JyBpc24ndCB0ZWNobmljYWxseSBpbiB0aGUgcHVibGljIEFQSS5cclxuICAgICAgaWYodGhpcy5fc3luY0hvcml6b250YWxTY3JvbGwpIHtcclxuICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLmFkZChlZGl0b3JJbmZvLmVkaXRvclZpZXcub25EaWRDaGFuZ2VTY3JvbGxMZWZ0KCgpID0+IHRoaXMuX3Njcm9sbFBvc2l0aW9uQ2hhbmdlZChpKSkpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIGJpbmQgdGhpcyBzbyB0aGF0IHRoZSBlZGl0b3JzIGxpbmUgdXAgb24gc3RhcnQgb2YgcGFja2FnZVxyXG4gICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLmFkZChlZGl0b3JJbmZvLmVkaXRvci5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLXNjcm9sbC10b3AnLCAoKSA9PiB0aGlzLl9zY3JvbGxQb3NpdGlvbkNoYW5nZWQoaSkpKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgX3Njcm9sbFBvc2l0aW9uQ2hhbmdlZChjaGFuZ2VTY3JvbGxJbmRleDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICB2YXIgdGhpc0luZm8gID0gdGhpcy5fc3luY0luZm9bY2hhbmdlU2Nyb2xsSW5kZXhdO1xyXG4gICAgdmFyIG90aGVySW5mbyA9IHRoaXMuX3N5bmNJbmZvWzEgLSBjaGFuZ2VTY3JvbGxJbmRleF07XHJcblxyXG4gICAgaWYgKHRoaXNJbmZvLnNjcm9sbGluZykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBvdGhlckluZm8uc2Nyb2xsaW5nID0gdHJ1ZTtcclxuICAgIHRyeSB7XHJcbiAgICAgIG90aGVySW5mby5lZGl0b3JWaWV3LnNldFNjcm9sbFRvcCh0aGlzSW5mby5lZGl0b3JWaWV3LmdldFNjcm9sbFRvcCgpKTtcclxuICAgICAgaWYodGhpcy5fc3luY0hvcml6b250YWxTY3JvbGwpIHtcclxuICAgICAgICBvdGhlckluZm8uZWRpdG9yVmlldy5zZXRTY3JvbGxMZWZ0KHRoaXNJbmZvLmVkaXRvclZpZXcuZ2V0U2Nyb2xsTGVmdCgpKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAvL2NvbnNvbGUubG9nKGUpO1xyXG4gICAgfVxyXG4gICAgb3RoZXJJbmZvLnNjcm9sbGluZyA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZGlzcG9zZSgpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLl9zdWJzY3JpcHRpb25zKSB7XHJcbiAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xyXG4gICAgICB0aGlzLl9zdWJzY3JpcHRpb25zID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN5bmNQb3NpdGlvbnMoKTogdm9pZCB7XHJcbiAgICB2YXIgYWN0aXZlVGV4dEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcclxuICAgIHRoaXMuX3N5bmNJbmZvLmZvckVhY2goKGVkaXRvckluZm8sIGkpID0+IHtcclxuICAgICAgaWYoZWRpdG9ySW5mby5lZGl0b3IgPT0gYWN0aXZlVGV4dEVkaXRvcikge1xyXG4gICAgICAgIGVkaXRvckluZm8uZWRpdG9yLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1zY3JvbGwtdG9wJywgZWRpdG9ySW5mby5lZGl0b3JWaWV3LmdldFNjcm9sbFRvcCgpKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN5bmNTY3JvbGw7XHJcbiJdfQ==
//# sourceURL=/C:/Users/MNP/.atom/packages/split-diff/lib/sync-scroll.js
