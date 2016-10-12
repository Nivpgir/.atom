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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvc3BsaXQtZGlmZi9saWIvc3BsaXQtZGlmZi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOEhBQUE7O0FBQUEsRUFBQSxPQUF5QyxPQUFBLENBQVEsTUFBUixDQUF6QyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGlCQUFBLFNBQXRCLEVBQWlDLFlBQUEsSUFBakMsQ0FBQTs7QUFBQSxFQUNBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLGVBQVIsQ0FEakIsQ0FBQTs7QUFBQSxFQUVBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FGZCxDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBSGIsQ0FBQTs7QUFBQSxFQUlBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUpiLENBQUE7O0FBQUEsRUFLQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGlCQUFSLENBTGYsQ0FBQTs7QUFBQSxFQU1BLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQU5QLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFBLEdBQ2Y7QUFBQSxJQUFBLE1BQUEsRUFBUSxZQUFSO0FBQUEsSUFDQSxhQUFBLEVBQWUsSUFEZjtBQUFBLElBRUEsZUFBQSxFQUFpQixJQUZqQjtBQUFBLElBR0EsZUFBQSxFQUFpQixJQUhqQjtBQUFBLElBSUEsbUJBQUEsRUFBcUIsSUFKckI7QUFBQSxJQUtBLGdCQUFBLEVBQWtCLElBTGxCO0FBQUEsSUFNQSxnQkFBQSxFQUFrQixDQU5sQjtBQUFBLElBT0Esa0JBQUEsRUFBb0IsSUFQcEI7QUFBQSxJQVFBLHFCQUFBLEVBQXVCLEtBUnZCO0FBQUEsSUFTQSxxQkFBQSxFQUF1QixLQVR2QjtBQUFBLElBVUEsU0FB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

//# sourceURL=/C:/Users/MNP/.atom/packages/split-diff/lib/split-diff.coffee
