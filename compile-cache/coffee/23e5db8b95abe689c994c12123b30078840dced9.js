(function() {
  var CompositeDisposable, DiffViewEditor, Directory, File, FooterView, LoadingView, SplitDiff, SyncScroll, configSchema, path, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Directory = _ref.Directory, File = _ref.File;

  DiffViewEditor = require('./build-lines');

  LoadingView = require('./loading-view');

  FooterView = require('./footer-view');

  SyncScroll = require('./sync-scroll');

  configSchema = require("./config-schema");

  path = require('path');

  module.exports = SplitDiff = {
    config: configSchema,
    subscriptions: null,
    diffViewEditor1: null,
    diffViewEditor2: null,
    editorSubscriptions: null,
    linkedDiffChunks: null,
    diffChunkPointer: 0,
    isFirstChunkSelect: true,
    wasEditor1SoftWrapped: false,
    wasEditor2SoftWrapped: false,
    isEnabled: false,
    wasEditor1Created: false,
    wasEditor2Created: false,
    hasGitRepo: false,
    process: null,
    loadingView: null,
    copyHelpMsg: 'Place your cursor in a chunk first!',
    activate: function(state) {
      this.subscriptions = new CompositeDisposable();
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'split-diff:enable': (function(_this) {
          return function() {
            return _this.diffPanes();
          };
        })(this),
        'split-diff:next-diff': (function(_this) {
          return function() {
            if (_this.isEnabled) {
              return _this.nextDiff();
            } else {
              return _this.diffPanes();
            }
          };
        })(this),
        'split-diff:prev-diff': (function(_this) {
          return function() {
            if (_this.isEnabled) {
              return _this.prevDiff();
            } else {
              return _this.diffPanes();
            }
          };
        })(this),
        'split-diff:copy-to-right': (function(_this) {
          return function() {
            if (_this.isEnabled) {
              return _this.copyChunkToRight();
            }
          };
        })(this),
        'split-diff:copy-to-left': (function(_this) {
          return function() {
            if (_this.isEnabled) {
              return _this.copyChunkToLeft();
            }
          };
        })(this),
        'split-diff:disable': (function(_this) {
          return function() {
            return _this.disable();
          };
        })(this),
        'split-diff:ignore-whitespace': (function(_this) {
          return function() {
            return _this.toggleIgnoreWhitespace();
          };
        })(this),
        'split-diff:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.disable();
      return this.subscriptions.dispose();
    },
    toggle: function() {
      if (this.isEnabled) {
        return this.disable();
      } else {
        return this.diffPanes();
      }
    },
    disable: function() {
      this.isEnabled = false;
      if (this.editorSubscriptions != null) {
        this.editorSubscriptions.dispose();
        this.editorSubscriptions = null;
      }
      if (this.diffViewEditor1 != null) {
        if (this.wasEditor1SoftWrapped) {
          this.diffViewEditor1.enableSoftWrap();
        }
        if (this.wasEditor1Created) {
          this.diffViewEditor1.cleanUp();
        }
      }
      if (this.diffViewEditor2 != null) {
        if (this.wasEditor2SoftWrapped) {
          this.diffViewEditor2.enableSoftWrap();
        }
        if (this.wasEditor2Created) {
          this.diffViewEditor2.cleanUp();
        }
      }
      if (this.footerView != null) {
        this.footerView.destroy();
        this.footerView = null;
      }
      this._clearDiff();
      this.diffChunkPointer = 0;
      this.isFirstChunkSelect = true;
      this.wasEditor1SoftWrapped = false;
      this.wasEditor1Created = false;
      this.wasEditor2SoftWrapped = false;
      this.wasEditor2Created = false;
      return this.hasGitRepo = false;
    },
    toggleIgnoreWhitespace: function() {
      var isWhitespaceIgnored;
      isWhitespaceIgnored = this._getConfig('ignoreWhitespace');
      return this._setConfig('ignoreWhitespace', !isWhitespaceIgnored);
    },
    nextDiff: function() {
      if (this.diffViewEditor1 && this.diffViewEditor2) {
        if (!this.isFirstChunkSelect) {
          this.diffChunkPointer++;
          if (this.diffChunkPointer >= this.linkedDiffChunks.length) {
            this.diffChunkPointer = 0;
          }
        } else {
          this.isFirstChunkSelect = false;
        }
        return this._selectDiffs(this.linkedDiffChunks[this.diffChunkPointer], this.diffChunkPointer);
      }
    },
    prevDiff: function() {
      if (this.diffViewEditor1 && this.diffViewEditor2) {
        if (!this.isFirstChunkSelect) {
          this.diffChunkPointer--;
          if (this.diffChunkPointer < 0) {
            this.diffChunkPointer = this.linkedDiffChunks.length - 1;
          }
        } else {
          this.isFirstChunkSelect = false;
        }
        return this._selectDiffs(this.linkedDiffChunks[this.diffChunkPointer], this.diffChunkPointer);
      }
    },
    copyChunkToRight: function() {
      var diffChunk, lastBufferRow, lineRange, linesToMove, moveText, offset, _i, _len, _results;
      if (this.diffViewEditor1 && this.diffViewEditor2) {
        linesToMove = this.diffViewEditor1.getCursorDiffLines();
        if (linesToMove.length === 0) {
          atom.notifications.addWarning('Split Diff', {
            detail: this.copyHelpMsg,
            dismissable: false,
            icon: 'diff'
          });
        }
        offset = 0;
        _results = [];
        for (_i = 0, _len = linesToMove.length; _i < _len; _i++) {
          lineRange = linesToMove[_i];
          _results.push((function() {
            var _j, _len1, _ref1, _results1;
            _ref1 = this.linkedDiffChunks;
            _results1 = [];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              diffChunk = _ref1[_j];
              if (lineRange.start.row === diffChunk.oldLineStart) {
                moveText = this.diffViewEditor1.getEditor().getTextInBufferRange([[diffChunk.oldLineStart, 0], [diffChunk.oldLineEnd, 0]]);
                lastBufferRow = this.diffViewEditor2.getEditor().getLastBufferRow();
                if ((diffChunk.newLineStart + offset) > lastBufferRow) {
                  this.diffViewEditor2.getEditor().setCursorBufferPosition([lastBufferRow, 0], {
                    autoscroll: false
                  });
                  this.diffViewEditor2.getEditor().insertNewline();
                }
                this.diffViewEditor2.getEditor().setTextInBufferRange([[diffChunk.newLineStart + offset, 0], [diffChunk.newLineEnd + offset, 0]], moveText);
                _results1.push(offset += (diffChunk.oldLineEnd - diffChunk.oldLineStart) - (diffChunk.newLineEnd - diffChunk.newLineStart));
              } else {
                _results1.push(void 0);
              }
            }
            return _results1;
          }).call(this));
        }
        return _results;
      }
    },
    copyChunkToLeft: function() {
      var diffChunk, lastBufferRow, lineRange, linesToMove, moveText, offset, _i, _len, _results;
      if (this.diffViewEditor1 && this.diffViewEditor2) {
        linesToMove = this.diffViewEditor2.getCursorDiffLines();
        if (linesToMove.length === 0) {
          atom.notifications.addWarning('Split Diff', {
            detail: this.copyHelpMsg,
            dismissable: false,
            icon: 'diff'
          });
        }
        offset = 0;
        _results = [];
        for (_i = 0, _len = linesToMove.length; _i < _len; _i++) {
          lineRange = linesToMove[_i];
          _results.push((function() {
            var _j, _len1, _ref1, _results1;
            _ref1 = this.linkedDiffChunks;
            _results1 = [];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              diffChunk = _ref1[_j];
              if (lineRange.start.row === diffChunk.newLineStart) {
                moveText = this.diffViewEditor2.getEditor().getTextInBufferRange([[diffChunk.newLineStart, 0], [diffChunk.newLineEnd, 0]]);
                lastBufferRow = this.diffViewEditor1.getEditor().getLastBufferRow();
                if ((diffChunk.oldLineStart + offset) > lastBufferRow) {
                  this.diffViewEditor1.getEditor().setCursorBufferPosition([lastBufferRow, 0], {
                    autoscroll: false
                  });
                  this.diffViewEditor1.getEditor().insertNewline();
                }
                this.diffViewEditor1.getEditor().setTextInBufferRange([[diffChunk.oldLineStart + offset, 0], [diffChunk.oldLineEnd + offset, 0]], moveText);
                _results1.push(offset += (diffChunk.newLineEnd - diffChunk.newLineStart) - (diffChunk.oldLineEnd - diffChunk.oldLineStart));
              } else {
                _results1.push(void 0);
              }
            }
            return _results1;
          }).call(this));
        }
        return _results;
      }
    },
    diffPanes: function() {
      var editors, isWhitespaceIgnored;
      this.disable();
      this.editorSubscriptions = new CompositeDisposable();
      editors = this._getVisibleEditors();
      this.editorSubscriptions.add(editors.editor1.onDidStopChanging((function(_this) {
        return function() {
          return _this.updateDiff(editors);
        };
      })(this)));
      this.editorSubscriptions.add(editors.editor2.onDidStopChanging((function(_this) {
        return function() {
          return _this.updateDiff(editors);
        };
      })(this)));
      this.editorSubscriptions.add(editors.editor1.onDidDestroy((function(_this) {
        return function() {
          return _this.disable();
        };
      })(this)));
      this.editorSubscriptions.add(editors.editor2.onDidDestroy((function(_this) {
        return function() {
          return _this.disable();
        };
      })(this)));
      this.editorSubscriptions.add(atom.config.onDidChange('split-diff', (function(_this) {
        return function() {
          return _this.updateDiff(editors);
        };
      })(this)));
      isWhitespaceIgnored = this._getConfig('ignoreWhitespace');
      if (this.footerView == null) {
        this.footerView = new FooterView(isWhitespaceIgnored);
        this.footerView.createPanel();
      }
      this.footerView.show();
      if (!this.hasGitRepo) {
        this.updateDiff(editors);
      }
      this.editorSubscriptions.add(atom.menu.add([
        {
          'label': 'Packages',
          'submenu': [
            {
              'label': 'Split Diff',
              'submenu': [
                {
                  'label': 'Ignore Whitespace',
                  'command': 'split-diff:ignore-whitespace'
                }, {
                  'label': 'Move to Next Diff',
                  'command': 'split-diff:next-diff'
                }, {
                  'label': 'Move to Previous Diff',
                  'command': 'split-diff:prev-diff'
                }, {
                  'label': 'Copy to Right',
                  'command': 'split-diff:copy-to-right'
                }, {
                  'label': 'Copy to Left',
                  'command': 'split-diff:copy-to-left'
                }
              ]
            }
          ]
        }
      ]));
      return this.editorSubscriptions.add(atom.contextMenu.add({
        'atom-text-editor': [
          {
            'label': 'Split Diff',
            'submenu': [
              {
                'label': 'Ignore Whitespace',
                'command': 'split-diff:ignore-whitespace'
              }, {
                'label': 'Move to Next Diff',
                'command': 'split-diff:next-diff'
              }, {
                'label': 'Move to Previous Diff',
                'command': 'split-diff:prev-diff'
              }, {
                'label': 'Copy to Right',
                'command': 'split-diff:copy-to-right'
              }, {
                'label': 'Copy to Left',
                'command': 'split-diff:copy-to-left'
              }
            ]
          }
        ]
      }));
    },
    updateDiff: function(editors) {
      var BufferedNodeProcess, args, command, computedDiff, editorPaths, exit, isWhitespaceIgnored, stderr, stdout, theOutput;
      this.isEnabled = true;
      if (this.process != null) {
        this.process.kill();
        this.process = null;
      }
      isWhitespaceIgnored = this._getConfig('ignoreWhitespace');
      editorPaths = this._createTempFiles(editors);
      if (this.loadingView == null) {
        this.loadingView = new LoadingView();
        this.loadingView.createModal();
      }
      this.loadingView.show();
      BufferedNodeProcess = require('atom').BufferedNodeProcess;
      command = path.resolve(__dirname, "./compute-diff.js");
      args = [editorPaths.editor1Path, editorPaths.editor2Path, isWhitespaceIgnored];
      computedDiff = '';
      theOutput = '';
      stdout = (function(_this) {
        return function(output) {
          var _ref1;
          theOutput = output;
          computedDiff = JSON.parse(output);
          _this.process.kill();
          _this.process = null;
          if ((_ref1 = _this.loadingView) != null) {
            _ref1.hide();
          }
          return _this._resumeUpdateDiff(editors, computedDiff);
        };
      })(this);
      stderr = (function(_this) {
        return function(err) {
          return theOutput = err;
        };
      })(this);
      exit = (function(_this) {
        return function(code) {
          var _ref1;
          if ((_ref1 = _this.loadingView) != null) {
            _ref1.hide();
          }
          if (code !== 0) {
            console.log('BufferedNodeProcess code was ' + code);
            return console.log(theOutput);
          }
        };
      })(this);
      return this.process = new BufferedNodeProcess({
        command: command,
        args: args,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
    },
    _resumeUpdateDiff: function(editors, computedDiff) {
      var isWordDiffEnabled, lastDiffChunk, newChunkRange, oldChunkRange, scrollSyncType, _ref1;
      this.linkedDiffChunks = this._evaluateDiffOrder(computedDiff.chunks);
      if ((_ref1 = this.footerView) != null) {
        _ref1.setNumDifferences(this.linkedDiffChunks.length);
      }
      if (this.linkedDiffChunks.length > 0) {
        lastDiffChunk = this.linkedDiffChunks[this.linkedDiffChunks.length - 1];
        oldChunkRange = lastDiffChunk.oldLineEnd - lastDiffChunk.oldLineStart;
        newChunkRange = lastDiffChunk.newLineEnd - lastDiffChunk.newLineStart;
        if (oldChunkRange > newChunkRange) {
          computedDiff.newLineOffsets[lastDiffChunk.newLineStart + newChunkRange] = oldChunkRange - newChunkRange;
        } else if (newChunkRange > oldChunkRange) {
          computedDiff.oldLineOffsets[lastDiffChunk.oldLineStart + oldChunkRange] = newChunkRange - oldChunkRange;
        }
      }
      this._clearDiff();
      this._displayDiff(editors, computedDiff);
      isWordDiffEnabled = this._getConfig('diffWords');
      if (isWordDiffEnabled) {
        this._highlightWordDiff(this.linkedDiffChunks);
      }
      scrollSyncType = this._getConfig('scrollSyncType');
      if (scrollSyncType === 'Vertical + Horizontal') {
        this.syncScroll = new SyncScroll(editors.editor1, editors.editor2, true);
        return this.syncScroll.syncPositions();
      } else if (scrollSyncType === 'Vertical') {
        this.syncScroll = new SyncScroll(editors.editor1, editors.editor2, false);
        return this.syncScroll.syncPositions();
      }
    },
    _getVisibleEditors: function() {
      var BufferExtender, activeItem, buffer1LineEnding, buffer2LineEnding, editor1, editor2, editors, leftPane, lineEndingMsg, p, panes, rightPane, shouldNotify, softWrapMsg, _i, _len;
      editor1 = null;
      editor2 = null;
      panes = atom.workspace.getPanes();
      for (_i = 0, _len = panes.length; _i < _len; _i++) {
        p = panes[_i];
        activeItem = p.getActiveItem();
        if (atom.workspace.isTextEditor(activeItem)) {
          if (editor1 === null) {
            editor1 = activeItem;
          } else if (editor2 === null) {
            editor2 = activeItem;
            break;
          }
        }
      }
      if (editor1 === null) {
        editor1 = atom.workspace.buildTextEditor();
        this.wasEditor1Created = true;
        leftPane = atom.workspace.getActivePane();
        leftPane.addItem(editor1);
      }
      if (editor2 === null) {
        editor2 = atom.workspace.buildTextEditor();
        this.wasEditor2Created = true;
        editor2.setGrammar(editor1.getGrammar());
        rightPane = atom.workspace.getActivePane().splitRight();
        rightPane.addItem(editor2);
      }
      BufferExtender = require('./buffer-extender');
      buffer1LineEnding = (new BufferExtender(editor1.getBuffer())).getLineEnding();
      if (this.wasEditor2Created) {
        atom.views.getView(editor1).focus();
        if (buffer1LineEnding === '\n' || buffer1LineEnding === '\r\n') {
          this.editorSubscriptions.add(editor2.onWillInsertText(function() {
            return editor2.getBuffer().setPreferredLineEnding(buffer1LineEnding);
          }));
        }
      }
      this._setupGitRepo(editor1, editor2);
      editor1.unfoldAll();
      editor2.unfoldAll();
      shouldNotify = !this._getConfig('muteNotifications');
      softWrapMsg = 'Warning: Soft wrap enabled! (Line diffs may not align)';
      if (editor1.isSoftWrapped() && shouldNotify) {
        atom.notifications.addWarning('Split Diff', {
          detail: softWrapMsg,
          dismissable: false,
          icon: 'diff'
        });
      } else if (editor2.isSoftWrapped() && shouldNotify) {
        atom.notifications.addWarning('Split Diff', {
          detail: softWrapMsg,
          dismissable: false,
          icon: 'diff'
        });
      }
      buffer2LineEnding = (new BufferExtender(editor2.getBuffer())).getLineEnding();
      if (buffer2LineEnding !== '' && (buffer1LineEnding !== buffer2LineEnding) && shouldNotify) {
        lineEndingMsg = 'Warning: Line endings differ!';
        atom.notifications.addWarning('Split Diff', {
          detail: lineEndingMsg,
          dismissable: false,
          icon: 'diff'
        });
      }
      editors = {
        editor1: editor1,
        editor2: editor2
      };
      return editors;
    },
    _setupGitRepo: function(editor1, editor2) {
      var directory, editor1Path, gitHeadText, i, projectRepo, relativeEditor1Path, _i, _len, _ref1, _results;
      editor1Path = editor1.getPath();
      if ((editor1Path != null) && (editor2.getLineCount() === 1 && editor2.lineTextForBufferRow(0) === '')) {
        _ref1 = atom.project.getDirectories();
        _results = [];
        for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
          directory = _ref1[i];
          if (editor1Path === directory.getPath() || directory.contains(editor1Path)) {
            projectRepo = atom.project.getRepositories()[i];
            if ((projectRepo != null) && (projectRepo.repo != null)) {
              relativeEditor1Path = projectRepo.relativize(editor1Path);
              gitHeadText = projectRepo.repo.getHeadBlob(relativeEditor1Path);
              if (gitHeadText != null) {
                editor2.selectAll();
                editor2.insertText(gitHeadText);
                this.hasGitRepo = true;
                break;
              } else {
                _results.push(void 0);
              }
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    },
    _createTempFiles: function(editors) {
      var editor1Path, editor1TempFile, editor2Path, editor2TempFile, editorPaths, tempFolderPath;
      editor1Path = '';
      editor2Path = '';
      tempFolderPath = atom.getConfigDirPath() + '/split-diff';
      editor1Path = tempFolderPath + '/split-diff 1';
      editor1TempFile = new File(editor1Path);
      editor1TempFile.writeSync(editors.editor1.getText());
      editor2Path = tempFolderPath + '/split-diff 2';
      editor2TempFile = new File(editor2Path);
      editor2TempFile.writeSync(editors.editor2.getText());
      editorPaths = {
        editor1Path: editor1Path,
        editor2Path: editor2Path
      };
      return editorPaths;
    },
    _selectDiffs: function(diffChunk, selectionCount) {
      if (diffChunk != null) {
        this.diffViewEditor1.deselectAllLines();
        this.diffViewEditor2.deselectAllLines();
        this.diffViewEditor1.selectLines(diffChunk.oldLineStart, diffChunk.oldLineEnd);
        this.diffViewEditor1.getEditor().setCursorBufferPosition([diffChunk.oldLineStart, 0], {
          autoscroll: true
        });
        this.diffViewEditor2.selectLines(diffChunk.newLineStart, diffChunk.newLineEnd);
        this.diffViewEditor2.getEditor().setCursorBufferPosition([diffChunk.newLineStart, 0], {
          autoscroll: true
        });
        return this.footerView.showSelectionCount(selectionCount + 1);
      }
    },
    _clearDiff: function() {
      var _ref1;
      if ((_ref1 = this.loadingView) != null) {
        _ref1.hide();
      }
      if (this.diffViewEditor1 != null) {
        this.diffViewEditor1.destroyMarkers();
        this.diffViewEditor1 = null;
      }
      if (this.diffViewEditor2 != null) {
        this.diffViewEditor2.destroyMarkers();
        this.diffViewEditor2 = null;
      }
      if (this.syncScroll != null) {
        this.syncScroll.dispose();
        return this.syncScroll = null;
      }
    },
    _displayDiff: function(editors, computedDiff) {
      var leftColor, rightColor;
      this.diffViewEditor1 = new DiffViewEditor(editors.editor1);
      this.diffViewEditor2 = new DiffViewEditor(editors.editor2);
      leftColor = this._getConfig('leftEditorColor');
      rightColor = this._getConfig('rightEditorColor');
      if (leftColor === 'green') {
        this.diffViewEditor1.setLineHighlights(computedDiff.removedLines, 'added');
      } else {
        this.diffViewEditor1.setLineHighlights(computedDiff.removedLines, 'removed');
      }
      if (rightColor === 'green') {
        this.diffViewEditor2.setLineHighlights(computedDiff.addedLines, 'added');
      } else {
        this.diffViewEditor2.setLineHighlights(computedDiff.addedLines, 'removed');
      }
      this.diffViewEditor1.setLineOffsets(computedDiff.oldLineOffsets);
      return this.diffViewEditor2.setLineOffsets(computedDiff.newLineOffsets);
    },
    _evaluateDiffOrder: function(chunks) {
      var c, diffChunk, diffChunks, newLineNumber, oldLineNumber, prevChunk, _i, _len;
      oldLineNumber = 0;
      newLineNumber = 0;
      prevChunk = null;
      diffChunks = [];
      for (_i = 0, _len = chunks.length; _i < _len; _i++) {
        c = chunks[_i];
        if (c.added != null) {
          if ((prevChunk != null) && (prevChunk.removed != null)) {
            diffChunk = {
              newLineStart: newLineNumber,
              newLineEnd: newLineNumber + c.count,
              oldLineStart: oldLineNumber - prevChunk.count,
              oldLineEnd: oldLineNumber
            };
            diffChunks.push(diffChunk);
            prevChunk = null;
          } else {
            prevChunk = c;
          }
          newLineNumber += c.count;
        } else if (c.removed != null) {
          if ((prevChunk != null) && (prevChunk.added != null)) {
            diffChunk = {
              newLineStart: newLineNumber - prevChunk.count,
              newLineEnd: newLineNumber,
              oldLineStart: oldLineNumber,
              oldLineEnd: oldLineNumber + c.count
            };
            diffChunks.push(diffChunk);
            prevChunk = null;
          } else {
            prevChunk = c;
          }
          oldLineNumber += c.count;
        } else {
          if ((prevChunk != null) && (prevChunk.added != null)) {
            diffChunk = {
              newLineStart: newLineNumber - prevChunk.count,
              newLineEnd: newLineNumber,
              oldLineStart: oldLineNumber,
              oldLineEnd: oldLineNumber
            };
            diffChunks.push(diffChunk);
          } else if ((prevChunk != null) && (prevChunk.removed != null)) {
            diffChunk = {
              newLineStart: newLineNumber,
              newLineEnd: newLineNumber,
              oldLineStart: oldLineNumber - prevChunk.count,
              oldLineEnd: oldLineNumber
            };
            diffChunks.push(diffChunk);
          }
          prevChunk = null;
          oldLineNumber += c.count;
          newLineNumber += c.count;
        }
      }
      if ((prevChunk != null) && (prevChunk.added != null)) {
        diffChunk = {
          newLineStart: newLineNumber - prevChunk.count,
          newLineEnd: newLineNumber,
          oldLineStart: oldLineNumber,
          oldLineEnd: oldLineNumber
        };
        diffChunks.push(diffChunk);
      } else if ((prevChunk != null) && (prevChunk.removed != null)) {
        diffChunk = {
          newLineStart: newLineNumber,
          newLineEnd: newLineNumber,
          oldLineStart: oldLineNumber - prevChunk.count,
          oldLineEnd: oldLineNumber
        };
        diffChunks.push(diffChunk);
      }
      return diffChunks;
    },
    _highlightWordDiff: function(chunks) {
      var ComputeWordDiff, c, excessLines, i, isWhitespaceIgnored, j, leftColor, lineRange, rightColor, wordDiff, _i, _j, _len, _results;
      ComputeWordDiff = require('./compute-word-diff');
      leftColor = this._getConfig('leftEditorColor');
      rightColor = this._getConfig('rightEditorColor');
      isWhitespaceIgnored = this._getConfig('ignoreWhitespace');
      _results = [];
      for (_i = 0, _len = chunks.length; _i < _len; _i++) {
        c = chunks[_i];
        if ((c.newLineStart != null) && (c.oldLineStart != null)) {
          lineRange = 0;
          excessLines = 0;
          if ((c.newLineEnd - c.newLineStart) < (c.oldLineEnd - c.oldLineStart)) {
            lineRange = c.newLineEnd - c.newLineStart;
            excessLines = (c.oldLineEnd - c.oldLineStart) - lineRange;
          } else {
            lineRange = c.oldLineEnd - c.oldLineStart;
            excessLines = (c.newLineEnd - c.newLineStart) - lineRange;
          }
          for (i = _j = 0; _j < lineRange; i = _j += 1) {
            wordDiff = ComputeWordDiff.computeWordDiff(this.diffViewEditor1.getEditor().lineTextForBufferRow(c.oldLineStart + i), this.diffViewEditor2.getEditor().lineTextForBufferRow(c.newLineStart + i));
            if (leftColor === 'green') {
              this.diffViewEditor1.setWordHighlights(c.oldLineStart + i, wordDiff.removedWords, 'added', isWhitespaceIgnored);
            } else {
              this.diffViewEditor1.setWordHighlights(c.oldLineStart + i, wordDiff.removedWords, 'removed', isWhitespaceIgnored);
            }
            if (rightColor === 'green') {
              this.diffViewEditor2.setWordHighlights(c.newLineStart + i, wordDiff.addedWords, 'added', isWhitespaceIgnored);
            } else {
              this.diffViewEditor2.setWordHighlights(c.newLineStart + i, wordDiff.addedWords, 'removed', isWhitespaceIgnored);
            }
          }
          _results.push((function() {
            var _k, _results1;
            _results1 = [];
            for (j = _k = 0; _k < excessLines; j = _k += 1) {
              if ((c.newLineEnd - c.newLineStart) < (c.oldLineEnd - c.oldLineStart)) {
                if (leftColor === 'green') {
                  _results1.push(this.diffViewEditor1.setWordHighlights(c.oldLineStart + lineRange + j, [
                    {
                      changed: true,
                      value: this.diffViewEditor1.getEditor().lineTextForBufferRow(c.oldLineStart + lineRange + j)
                    }
                  ], 'added', isWhitespaceIgnored));
                } else {
                  _results1.push(this.diffViewEditor1.setWordHighlights(c.oldLineStart + lineRange + j, [
                    {
                      changed: true,
                      value: this.diffViewEditor1.getEditor().lineTextForBufferRow(c.oldLineStart + lineRange + j)
                    }
                  ], 'removed', isWhitespaceIgnored));
                }
              } else if ((c.newLineEnd - c.newLineStart) > (c.oldLineEnd - c.oldLineStart)) {
                if (rightColor === 'green') {
                  _results1.push(this.diffViewEditor2.setWordHighlights(c.newLineStart + lineRange + j, [
                    {
                      changed: true,
                      value: this.diffViewEditor2.getEditor().lineTextForBufferRow(c.newLineStart + lineRange + j)
                    }
                  ], 'added', isWhitespaceIgnored));
                } else {
                  _results1.push(this.diffViewEditor2.setWordHighlights(c.newLineStart + lineRange + j, [
                    {
                      changed: true,
                      value: this.diffViewEditor2.getEditor().lineTextForBufferRow(c.newLineStart + lineRange + j)
                    }
                  ], 'removed', isWhitespaceIgnored));
                }
              } else {
                _results1.push(void 0);
              }
            }
            return _results1;
          }).call(this));
        } else if (c.newLineStart != null) {
          lineRange = c.newLineEnd - c.newLineStart;
          _results.push((function() {
            var _k, _results1;
            _results1 = [];
            for (i = _k = 0; _k < lineRange; i = _k += 1) {
              if (rightColor === 'green') {
                _results1.push(this.diffViewEditor2.setWordHighlights(c.newLineStart + i, [
                  {
                    changed: true,
                    value: this.diffViewEditor2.getEditor().lineTextForBufferRow(c.newLineStart + i)
                  }
                ], 'added', isWhitespaceIgnored));
              } else {
                _results1.push(this.diffViewEditor2.setWordHighlights(c.newLineStart + i, [
                  {
                    changed: true,
                    value: this.diffViewEditor2.getEditor().lineTextForBufferRow(c.newLineStart + i)
                  }
                ], 'removed', isWhitespaceIgnored));
              }
            }
            return _results1;
          }).call(this));
        } else if (c.oldLineStart != null) {
          lineRange = c.oldLineEnd - c.oldLineStart;
          _results.push((function() {
            var _k, _results1;
            _results1 = [];
            for (i = _k = 0; _k < lineRange; i = _k += 1) {
              if (leftColor === 'green') {
                _results1.push(this.diffViewEditor1.setWordHighlights(c.oldLineStart + i, [
                  {
                    changed: true,
                    value: this.diffViewEditor1.getEditor().lineTextForBufferRow(c.oldLineStart + i)
                  }
                ], 'added', isWhitespaceIgnored));
              } else {
                _results1.push(this.diffViewEditor1.setWordHighlights(c.oldLineStart + i, [
                  {
                    changed: true,
                    value: this.diffViewEditor1.getEditor().lineTextForBufferRow(c.oldLineStart + i)
                  }
                ], 'removed', isWhitespaceIgnored));
              }
            }
            return _results1;
          }).call(this));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    _getConfig: function(config) {
      return atom.config.get("split-diff." + config);
    },
    _setConfig: function(config, value) {
      return atom.config.set("split-diff." + config, value);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL3NwbGl0LWRpZmYvbGliL3NwbGl0LWRpZmYuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhIQUFBOztBQUFBLEVBQUEsT0FBeUMsT0FBQSxDQUFRLE1BQVIsQ0FBekMsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixpQkFBQSxTQUF0QixFQUFpQyxZQUFBLElBQWpDLENBQUE7O0FBQUEsRUFDQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxlQUFSLENBRGpCLENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBRmQsQ0FBQTs7QUFBQSxFQUdBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUhiLENBQUE7O0FBQUEsRUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FKYixDQUFBOztBQUFBLEVBS0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQUxmLENBQUE7O0FBQUEsRUFNQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FOUCxDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQSxHQUNmO0FBQUEsSUFBQSxNQUFBLEVBQVEsWUFBUjtBQUFBLElBQ0EsYUFBQSxFQUFlLElBRGY7QUFBQSxJQUVBLGVBQUEsRUFBaUIsSUFGakI7QUFBQSxJQUdBLGVBQUEsRUFBaUIsSUFIakI7QUFBQSxJQUlBLG1CQUFBLEVBQXFCLElBSnJCO0FBQUEsSUFLQSxnQkFBQSxFQUFrQixJQUxsQjtBQUFBLElBTUEsZ0JBQUEsRUFBa0IsQ0FObEI7QUFBQSxJQU9BLGtCQUFBLEVBQW9CLElBUHBCO0FBQUEsSUFRQSxxQkFBQSxFQUF1QixLQVJ2QjtBQUFBLElBU0EscUJBQUEsRUFBdUIsS0FUdkI7QUFBQSxJQVVBLFNB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

//# sourceURL=/C:/Users/nivp/.atom/packages/split-diff/lib/split-diff.coffee
