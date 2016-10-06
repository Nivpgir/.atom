function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-env browser */

var _atom = require('atom');

var _libHyperclick = require('../lib/Hyperclick');

var _libHyperclick2 = _interopRequireDefault(_libHyperclick);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

'use babel';

describe('Hyperclick', function () {
  var setup = _asyncToGenerator(function* () {
    // We need to load the package so the config is registered.
    atom.packages.loadPackage('hyperclick');

    textEditor = yield atom.workspace.open('hyperclick.txt');
    textEditorView = atom.views.getView(textEditor);

    // We need the view attached to the DOM for the mouse events to work.
    jasmine.attachToDOM(textEditorView);

    hyperclick = new _libHyperclick2['default']();
    hyperclickForTextEditor = Array.from(hyperclick._hyperclickForTextEditors)[0];
  }

  /**
   * Returns the pixel position in the DOM of the text editor's screen position.
   * This is used for dispatching mouse events in the text editor.
   *
   * Adapted from https://github.com/atom/atom/blob/5272584d2910e5b3f2b0f309aab4775eb0f779a6/spec/text-editor-component-spec.coffee#L2845
   */
  );

  var textEditor = null;
  var textEditorView = null;
  var hyperclick = null;
  var hyperclickForTextEditor = null;

  function clientCoordinatesForScreenPosition(screenPosition) {
    var positionOffset = textEditorView.pixelPositionForScreenPosition(screenPosition);
    var _textEditorView = textEditorView;
    var component = _textEditorView.component;

    (0, _assert2['default'])(component);
    var scrollViewClientRect = component.domNode.querySelector('.scroll-view').getBoundingClientRect();
    var clientX = scrollViewClientRect.left + positionOffset.left - textEditorView.getScrollLeft();
    var clientY = scrollViewClientRect.top + positionOffset.top - textEditorView.getScrollTop();
    return { clientX: clientX, clientY: clientY };
  }

  function dispatch(eventClass, type, position, properties_) {
    var properties = properties_;

    var _clientCoordinatesForScreenPosition = clientCoordinatesForScreenPosition(position);

    var clientX = _clientCoordinatesForScreenPosition.clientX;
    var clientY = _clientCoordinatesForScreenPosition.clientY;

    if (properties != null) {
      properties.clientX = clientX;
      properties.clientY = clientY;
    } else {
      properties = { clientX: clientX, clientY: clientY };
    }
    var event = new eventClass(type, properties);
    var domNode = null;
    if (eventClass === MouseEvent) {
      var _textEditorView2 = textEditorView;
      var component = _textEditorView2.component;

      (0, _assert2['default'])(component);
      domNode = component.linesComponent.getDomNode();
    } else {
      domNode = textEditorView;
    }
    domNode.dispatchEvent(event);
  }

  describe('without line wrapping', function () {
    beforeEach(function () {
      waitsForPromise(_asyncToGenerator(function* () {
        yield setup();
      }));
    });

    afterEach(function () {
      hyperclick.dispose();
    });

    describe('simple case', function () {
      var provider = null;
      var position = new _atom.Point(0, 1);

      beforeEach(function () {
        provider = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            return { range: range, callback: function callback() {} };
          })
        };
        spyOn(provider, 'getSuggestionForWord').andCallThrough();
        hyperclick.consumeProvider(provider);
      });
      it('should call the provider', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          yield hyperclick.getSuggestion(textEditor, position);
          expect(provider.getSuggestionForWord).toHaveBeenCalled();
        }));
      });
      it('should not call a removed provider', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          hyperclick.removeProvider(provider);
          yield hyperclick.getSuggestion(textEditor, position);
          expect(provider.getSuggestionForWord).not.toHaveBeenCalled();
        }));
      });
    });

    describe('<meta-mousemove> + <meta-mousedown>', function () {
      it('consumes single-word providers without wordRegExp', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          var callback = jasmine.createSpy('callback');
          var provider = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              return { range: range, callback: callback };
            })
          };
          spyOn(provider, 'getSuggestionForWord').andCallThrough();
          hyperclick.consumeProvider(provider);

          var position = new _atom.Point(0, 1);
          var expectedText = 'word1';
          var expectedRange = _atom.Range.fromObject([[0, 0], [0, 5]]);

          dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();
          expect(provider.getSuggestionForWord).toHaveBeenCalledWith(textEditor, expectedText, expectedRange);

          dispatch(MouseEvent, 'mousedown', position, { metaKey: true });
          expect(callback.callCount).toBe(1);
        }));
      });

      it('consumes single-word providers with wordRegExp', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          var callback = jasmine.createSpy('callback');
          var provider = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              return { range: range, callback: callback };
            }),
            wordRegExp: /word/g
          };
          spyOn(provider, 'getSuggestionForWord').andCallThrough();
          hyperclick.consumeProvider(provider);

          var position = new _atom.Point(0, 8);
          var expectedText = 'word';
          var expectedRange = _atom.Range.fromObject([[0, 6], [0, 10]]);

          dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();
          expect(provider.getSuggestionForWord).toHaveBeenCalledWith(textEditor, expectedText, expectedRange);

          dispatch(MouseEvent, 'mousedown', position, { metaKey: true });
          expect(callback.callCount).toBe(1);
        }));
      });

      it('consumes multi-range providers', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          var callback = jasmine.createSpy('callback');
          var provider = {
            providerName: 'test',
            getSuggestion: _asyncToGenerator(function* (sourceTextEditor, sourcePosition) {
              var range = [new _atom.Range(sourcePosition, sourcePosition.translate([0, 1])), new _atom.Range(sourcePosition.translate([0, 2]), sourcePosition.translate([0, 3]))];
              return { range: range, callback: callback };
            })
          };
          spyOn(provider, 'getSuggestion').andCallThrough();
          hyperclick.consumeProvider(provider);

          var position = new _atom.Point(0, 8);

          dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();
          expect(provider.getSuggestion).toHaveBeenCalledWith(textEditor, position);

          dispatch(MouseEvent, 'mousedown', position, { metaKey: true });
          expect(callback.callCount).toBe(1);
        }));
      });

      it('consumes multiple providers from different sources', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          var callback1 = jasmine.createSpy('callback');
          var provider1 = {
            providerName: 'test',
            // Do not return a suggestion, so we can fall through to provider2.
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {})
          };
          spyOn(provider1, 'getSuggestionForWord').andCallThrough();

          var callback2 = jasmine.createSpy('callback');
          var provider2 = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              return { range: range, callback: callback2 };
            })
          };
          spyOn(provider2, 'getSuggestionForWord').andCallThrough();

          hyperclick.consumeProvider(provider1);
          hyperclick.consumeProvider(provider2);

          var position = new _atom.Point(0, 1);
          var expectedText = 'word1';
          var expectedRange = _atom.Range.fromObject([[0, 0], [0, 5]]);

          dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();
          expect(provider2.getSuggestionForWord).toHaveBeenCalledWith(textEditor, expectedText, expectedRange);

          dispatch(MouseEvent, 'mousedown', position, { metaKey: true });
          expect(callback1.callCount).toBe(0);
          expect(callback2.callCount).toBe(1);
        }));
      });

      it('consumes multiple providers from the same source', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          var callback1 = jasmine.createSpy('callback');
          var provider1 = {
            providerName: 'test',
            // Do not return a suggestion, so we can fall through to provider2.
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {})
          };
          spyOn(provider1, 'getSuggestionForWord').andCallThrough();

          var callback2 = jasmine.createSpy('callback');
          var provider2 = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              return { range: range, callback: callback2 };
            })
          };
          spyOn(provider2, 'getSuggestionForWord').andCallThrough();

          hyperclick.consumeProvider([provider1, provider2]);

          var position = new _atom.Point(0, 1);
          var expectedText = 'word1';
          var expectedRange = _atom.Range.fromObject([[0, 0], [0, 5]]);

          dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();
          expect(provider2.getSuggestionForWord).toHaveBeenCalledWith(textEditor, expectedText, expectedRange);

          dispatch(MouseEvent, 'mousedown', position, { metaKey: true });
          expect(callback1.callCount).toBe(0);
          expect(callback2.callCount).toBe(1);
        }));
      });
    });

    describe('avoids excessive calls', function () {
      it('ignores <mousemove> in the same word as the last position', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          var provider = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              // Never resolve this, so we know that no suggestion is set.
              return new Promise(function () {});
            })
          };
          spyOn(provider, 'getSuggestionForWord').andCallThrough();
          hyperclick.consumeProvider(provider);

          var position = new _atom.Point(0, 1);
          dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
          dispatch(MouseEvent, 'mousemove', position.translate([0, 1]), { metaKey: true });
          dispatch(MouseEvent, 'mousemove', position.translate([0, 2]), { metaKey: true });

          expect(provider.getSuggestionForWord.callCount).toBe(1);
        }));
      });

      it('ignores <mousemove> in the same single-range as the last suggestion', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          var callback = jasmine.createSpy('callback');
          var provider = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              return { range: range, callback: callback };
            })
          };
          spyOn(provider, 'getSuggestionForWord').andCallThrough();
          hyperclick.consumeProvider(provider);

          var position = new _atom.Point(0, 1);
          var expectedText = 'word1';
          var expectedRange = _atom.Range.fromObject([[0, 0], [0, 5]]);

          dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();
          expect(provider.getSuggestionForWord).toHaveBeenCalledWith(textEditor, expectedText, expectedRange);

          dispatch(MouseEvent, 'mousemove', position.translate([0, 1]), { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();

          expect(provider.getSuggestionForWord.callCount).toBe(1);

          dispatch(MouseEvent, 'mousedown', position, { metaKey: true });
          expect(callback.callCount).toBe(1);
        }));
      });

      it('handles <mousemove> in a different single-range as the last suggestion', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          var callback = jasmine.createSpy('callback');
          var provider = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              return { range: range, callback: callback };
            })
          };
          spyOn(provider, 'getSuggestionForWord').andCallThrough();
          hyperclick.consumeProvider(provider);

          var position1 = new _atom.Point(0, 1);
          var expectedText1 = 'word1';
          var expectedRange1 = _atom.Range.fromObject([[0, 0], [0, 5]]);

          dispatch(MouseEvent, 'mousemove', position1, { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();
          expect(provider.getSuggestionForWord).toHaveBeenCalledWith(textEditor, expectedText1, expectedRange1);

          var position2 = new _atom.Point(0, 8);
          var expectedText2 = 'word2';
          var expectedRange2 = _atom.Range.fromObject([[0, 6], [0, 11]]);
          dispatch(MouseEvent, 'mousemove', position2, { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();
          expect(provider.getSuggestionForWord).toHaveBeenCalledWith(textEditor, expectedText2, expectedRange2);

          expect(provider.getSuggestionForWord.callCount).toBe(2);

          dispatch(MouseEvent, 'mousedown', position2, { metaKey: true });
          expect(callback.callCount).toBe(1);
        }));
      });

      it('ignores <mousemove> in the same multi-range as the last suggestion', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          var range = [new _atom.Range(new _atom.Point(0, 1), new _atom.Point(0, 2)), new _atom.Range(new _atom.Point(0, 4), new _atom.Point(0, 5))];
          var callback = jasmine.createSpy('callback');
          var provider = {
            providerName: 'test',
            getSuggestion: _asyncToGenerator(function* (sourceTextEditor, sourcePosition) {
              return { range: range, callback: callback };
            })
          };
          spyOn(provider, 'getSuggestion').andCallThrough();
          hyperclick.consumeProvider(provider);

          var position = new _atom.Point(0, 1);

          dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();
          expect(provider.getSuggestion).toHaveBeenCalledWith(textEditor, position);

          dispatch(MouseEvent, 'mousemove', new _atom.Point(0, 4), { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();

          expect(provider.getSuggestion.callCount).toBe(1);

          dispatch(MouseEvent, 'mousedown', position, { metaKey: true });
          expect(callback.callCount).toBe(1);
        }));
      });

      it('ignores <mousedown> when out of result range', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          var callback = jasmine.createSpy('callback');
          var provider = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              return { range: range, callback: callback };
            })
          };
          spyOn(provider, 'getSuggestionForWord').andCallThrough();
          hyperclick.consumeProvider(provider);

          var inRangePosition = new _atom.Point(0, 1);
          var outOfRangePosition = new _atom.Point(1, 0);
          var expectedText = 'word1';
          var expectedRange = _atom.Range.fromObject([[0, 0], [0, 5]]);

          dispatch(MouseEvent, 'mousemove', inRangePosition, { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();
          expect(provider.getSuggestionForWord).toHaveBeenCalledWith(textEditor, expectedText, expectedRange);

          dispatch(MouseEvent, 'mousemove', outOfRangePosition, { metaKey: true });
          dispatch(MouseEvent, 'mousedown', outOfRangePosition, { metaKey: true });
          expect(callback.callCount).toBe(0);
        }));
      });
    });

    describe('adds the `hyperclick` CSS class', function () {
      var provider = {
        providerName: 'test',
        getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
          return { range: range, callback: function callback() {} };
        })
      };

      beforeEach(function () {
        hyperclick.consumeProvider(provider);
      });

      it('adds on <meta-mousemove>, removes on <meta-mousedown>', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          var position = new _atom.Point(0, 1);

          expect(textEditorView.classList.contains('hyperclick')).toBe(false);

          dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();
          expect(textEditorView.classList.contains('hyperclick')).toBe(true);

          dispatch(MouseEvent, 'mousedown', position, { metaKey: true });
          expect(textEditorView.classList.contains('hyperclick')).toBe(false);
        }));
      });

      it('adds on <meta-keydown>, removes on <meta-keyup>', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          var position = new _atom.Point(0, 1);

          // We need to move the mouse once, so Hyperclick knows where it is.
          dispatch(MouseEvent, 'mousemove', position);
          expect(textEditorView.classList.contains('hyperclick')).toBe(false);

          dispatch(KeyboardEvent, 'keydown', position, { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();
          expect(textEditorView.classList.contains('hyperclick')).toBe(true);

          dispatch(KeyboardEvent, 'keyup', position);
          expect(textEditorView.classList.contains('hyperclick')).toBe(false);
        }));
      });
    });

    describe('hyperclick:confirm-cursor', function () {
      it('confirms the suggestion at the cursor even if the mouse moved', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          var callback = jasmine.createSpy('callback');
          var provider = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              return { range: range, callback: callback };
            })
          };
          spyOn(provider, 'getSuggestionForWord').andCallThrough();
          hyperclick.consumeProvider(provider);

          var mousePosition = new _atom.Point(0, 1);
          dispatch(MouseEvent, 'mousemove', mousePosition, { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();

          textEditor.setCursorBufferPosition(new _atom.Point(0, 8));
          atom.commands.dispatch(textEditorView, 'hyperclick:confirm-cursor');
          expect(provider.getSuggestionForWord).toHaveBeenCalledWith(textEditor, 'word2', _atom.Range.fromObject([[0, 6], [0, 11]]));
          waitsFor(function () {
            return callback.callCount === 1;
          });
        }));
      });
    });

    describe('priority', function () {
      it('confirms higher priority provider when it is consumed first', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          var callback1 = jasmine.createSpy('callback');
          var provider1 = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              return { range: range, callback: callback1 };
            }),
            priority: 5
          };
          hyperclick.consumeProvider(provider1);

          var callback2 = jasmine.createSpy('callback');
          var provider2 = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              return { range: range, callback: callback1 };
            }),
            priority: 3
          };
          hyperclick.consumeProvider(provider2);

          var mousePosition = new _atom.Point(0, 1);
          dispatch(MouseEvent, 'mousemove', mousePosition, { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();
          dispatch(MouseEvent, 'mousedown', mousePosition, { metaKey: true });

          expect(callback1.callCount).toBe(1);
          expect(callback2.callCount).toBe(0);
        }));
      });

      it('confirms higher priority provider when it is consumed last', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          var callback1 = jasmine.createSpy('callback');
          var provider1 = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              return { range: range, callback: callback1 };
            }),
            priority: 3
          };
          hyperclick.consumeProvider(provider1);

          var callback2 = jasmine.createSpy('callback');
          var provider2 = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              return { range: range, callback: callback2 };
            }),
            priority: 5
          };
          hyperclick.consumeProvider(provider2);

          var mousePosition = new _atom.Point(0, 1);
          dispatch(MouseEvent, 'mousemove', mousePosition, { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();
          dispatch(MouseEvent, 'mousedown', mousePosition, { metaKey: true });

          expect(callback1.callCount).toBe(0);
          expect(callback2.callCount).toBe(1);
        }));
      });

      it('confirms >0 priority before default priority', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          var callback1 = jasmine.createSpy('callback');
          var provider1 = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              return { range: range, callback: callback1 };
            })
          };
          hyperclick.consumeProvider(provider1);

          var callback2 = jasmine.createSpy('callback');
          var provider2 = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              return { range: range, callback: callback2 };
            }),
            priority: 1
          };
          hyperclick.consumeProvider(provider2);

          var mousePosition = new _atom.Point(0, 1);
          dispatch(MouseEvent, 'mousemove', mousePosition, { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();
          dispatch(MouseEvent, 'mousedown', mousePosition, { metaKey: true });

          expect(callback1.callCount).toBe(0);
          expect(callback2.callCount).toBe(1);
        }));
      });

      it('confirms <0 priority after default priority', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          var callback1 = jasmine.createSpy('callback');
          var provider1 = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              return { range: range, callback: callback1 };
            }),
            priority: -1
          };
          hyperclick.consumeProvider(provider1);

          var callback2 = jasmine.createSpy('callback');
          var provider2 = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              return { range: range, callback: callback2 };
            })
          };
          hyperclick.consumeProvider(provider2);

          var mousePosition = new _atom.Point(0, 1);
          dispatch(MouseEvent, 'mousemove', mousePosition, { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();
          dispatch(MouseEvent, 'mousedown', mousePosition, { metaKey: true });

          expect(callback1.callCount).toBe(0);
          expect(callback2.callCount).toBe(1);
        }));
      });

      it('confirms same-priority in the order they are consumed', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          var callback1 = jasmine.createSpy('callback');
          var provider1 = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              return { range: range, callback: callback1 };
            })
          };
          hyperclick.consumeProvider(provider1);

          var callback2 = jasmine.createSpy('callback');
          var provider2 = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              return { range: range, callback: callback2 };
            })
          };
          hyperclick.consumeProvider(provider2);

          var mousePosition = new _atom.Point(0, 1);
          dispatch(MouseEvent, 'mousemove', mousePosition, { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();
          dispatch(MouseEvent, 'mousedown', mousePosition, { metaKey: true });

          expect(callback1.callCount).toBe(1);
          expect(callback2.callCount).toBe(0);
        }));
      });

      it('confirms highest priority provider when multiple are consumed at a time', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          var callback1 = jasmine.createSpy('callback');
          var provider1 = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              return { range: range, callback: callback1 };
            }),
            priority: 1
          };
          var callback2 = jasmine.createSpy('callback');
          var provider2 = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              return { range: range, callback: callback2 };
            }),
            priority: 2
          };

          hyperclick.consumeProvider([provider1, provider2]);

          var mousePosition = new _atom.Point(0, 1);
          dispatch(MouseEvent, 'mousemove', mousePosition, { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();
          dispatch(MouseEvent, 'mousedown', mousePosition, { metaKey: true });

          expect(callback1.callCount).toBe(0);
          expect(callback2.callCount).toBe(1);
        }));
      });
    });

    describe('multiple suggestions', function () {
      it('confirms the first suggestion', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          var callback = [{
            title: 'callback1',
            callback: jasmine.createSpy('callback1')
          }, {
            title: 'callback2',
            callback: jasmine.createSpy('callback1')
          }];
          var provider = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              return { range: range, callback: callback };
            })
          };
          hyperclick.consumeProvider(provider);

          var position = new _atom.Point(0, 1);
          dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();
          dispatch(MouseEvent, 'mousedown', position, { metaKey: true });

          var suggestionListEl = textEditorView.querySelector('hyperclick-suggestion-list');
          expect(suggestionListEl).toExist();

          atom.commands.dispatch(textEditorView, 'editor:newline');

          expect(callback[0].callback.callCount).toBe(1);
          expect(callback[1].callback.callCount).toBe(0);
          expect(textEditorView.querySelector('hyperclick-suggestion-list')).not.toExist();
        }));
      });

      it('confirms the second suggestion', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          var callback = [{
            title: 'callback1',
            callback: jasmine.createSpy('callback1')
          }, {
            title: 'callback2',
            callback: jasmine.createSpy('callback1')
          }];
          var provider = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              return { range: range, callback: callback };
            })
          };
          hyperclick.consumeProvider(provider);

          var position = new _atom.Point(0, 1);
          dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();
          dispatch(MouseEvent, 'mousedown', position, { metaKey: true });

          var suggestionListEl = textEditorView.querySelector('hyperclick-suggestion-list');
          expect(suggestionListEl).toExist();

          atom.commands.dispatch(textEditorView, 'core:move-down');
          atom.commands.dispatch(textEditorView, 'editor:newline');

          expect(callback[0].callback.callCount).toBe(0);
          expect(callback[1].callback.callCount).toBe(1);
          expect(textEditorView.querySelector('hyperclick-suggestion-list')).not.toExist();
        }));
      });

      it('is cancelable', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          var callback = [{
            title: 'callback1',
            callback: jasmine.createSpy('callback1')
          }, {
            title: 'callback2',
            callback: jasmine.createSpy('callback1')
          }];
          var provider = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              return { range: range, callback: callback };
            })
          };
          hyperclick.consumeProvider(provider);

          var position = new _atom.Point(0, 1);
          dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();
          dispatch(MouseEvent, 'mousedown', position, { metaKey: true });

          var suggestionListEl = textEditorView.querySelector('hyperclick-suggestion-list');
          expect(suggestionListEl).toExist();

          atom.commands.dispatch(textEditorView, 'core:cancel');

          expect(callback[0].callback.callCount).toBe(0);
          expect(callback[1].callback.callCount).toBe(0);
          expect(textEditorView.querySelector('hyperclick-suggestion-list')).not.toExist();
        }));
      });
    });
  });

  describe('with line wrapping', function () {
    beforeEach(function () {
      waitsForPromise(_asyncToGenerator(function* () {
        atom.config.set('editor.softWrap', true);
        atom.config.set('editor.softWrapAtPreferredLineLength', true);
        atom.config.set('editor.preferredLineLength', 6); // This wraps each word onto its own line.
        yield setup();
      }));
    });

    afterEach(function () {
      hyperclick.dispose();
    });

    describe('when the editor has soft-wrapped lines', function () {
      it('Hyperclick correctly detects the word being moused over.', function () {
        waitsForPromise(_asyncToGenerator(function* () {
          var callback = jasmine.createSpy('callback');
          var provider = {
            providerName: 'test',
            getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
              return { range: range, callback: callback };
            })
          };
          spyOn(provider, 'getSuggestionForWord').andCallThrough();
          hyperclick.consumeProvider(provider);

          var position = new _atom.Point(8, 0);
          var expectedText = 'word9';
          var expectedBufferRange = _atom.Range.fromObject([[2, 12], [2, 17]]);
          dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
          yield hyperclickForTextEditor.getSuggestionAtMouse();
          expect(provider.getSuggestionForWord).toHaveBeenCalledWith(textEditor, expectedText, expectedBufferRange);
          expect(provider.getSuggestionForWord.callCount).toBe(1);
        }));
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL25pdi8uYXRvbS9wYWNrYWdlcy9oeXBlcmNsaWNrL3NwZWMvSHlwZXJjbGljay1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O29CQWdCMkIsTUFBTTs7NkJBQ1YsbUJBQW1COzs7O3NCQUNwQixRQUFROzs7O0FBbEI5QixXQUFXLENBQUM7O0FBb0JaLFFBQVEsQ0FBQyxZQUFZLEVBQUUsWUFBTTtNQU1aLEtBQUsscUJBQXBCLGFBQXVCOztBQUVyQixRQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFeEMsY0FBVSxHQUFHLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN6RCxrQkFBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDOzs7QUFHaEQsV0FBTyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFcEMsY0FBVSxHQUFHLGdDQUFnQixDQUFDO0FBQzlCLDJCQUF1QixHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDL0U7Ozs7Ozs7Ozs7QUFqQkQsTUFBSSxVQUEyQixHQUFJLElBQUksQUFBTSxDQUFDO0FBQzlDLE1BQUksY0FBc0MsR0FBSSxJQUFJLEFBQU0sQ0FBQztBQUN6RCxNQUFJLFVBQXNCLEdBQUksSUFBSSxBQUFNLENBQUM7QUFDekMsTUFBSSx1QkFBZ0QsR0FBSSxJQUFJLEFBQU0sQ0FBQzs7QUFzQm5FLFdBQVMsa0NBQWtDLENBQ3pDLGNBQTBCLEVBQ1U7QUFDcEMsUUFBTSxjQUFjLEdBQUcsY0FBYyxDQUFDLDhCQUE4QixDQUFDLGNBQWMsQ0FBQyxDQUFDOzBCQUNqRSxjQUFjO1FBQTNCLFNBQVMsbUJBQVQsU0FBUzs7QUFDaEIsNkJBQVUsU0FBUyxDQUFDLENBQUM7QUFD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QUFNLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN6RCxFQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2h5cGVyY2xpY2svc3BlYy9IeXBlcmNsaWNrLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbi8qIEBmbG93ICovXG5cbi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4vKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cblxuaW1wb3J0IHR5cGUge0h5cGVyY2xpY2tQcm92aWRlcn0gZnJvbSAnLi4vbGliL3R5cGVzJztcbmltcG9ydCB0eXBlIEh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yIGZyb20gJy4uL2xpYi9IeXBlcmNsaWNrRm9yVGV4dEVkaXRvcic7XG5cbmltcG9ydCB7UG9pbnQsIFJhbmdlfSBmcm9tICdhdG9tJztcbmltcG9ydCBIeXBlcmNsaWNrIGZyb20gJy4uL2xpYi9IeXBlcmNsaWNrJztcbmltcG9ydCBpbnZhcmlhbnQgZnJvbSAnYXNzZXJ0JztcblxuZGVzY3JpYmUoJ0h5cGVyY2xpY2snLCAoKSA9PiB7XG4gIGxldCB0ZXh0RWRpdG9yOiBhdG9tJFRleHRFZGl0b3IgPSAobnVsbDogYW55KTtcbiAgbGV0IHRleHRFZGl0b3JWaWV3OiBhdG9tJFRleHRFZGl0b3JFbGVtZW50ID0gKG51bGw6IGFueSk7XG4gIGxldCBoeXBlcmNsaWNrOiBIeXBlcmNsaWNrID0gKG51bGw6IGFueSk7XG4gIGxldCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvcjogSHlwZXJjbGlja0ZvclRleHRFZGl0b3IgPSAobnVsbDogYW55KTtcblxuICBhc3luYyBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICAvLyBXZSBuZWVkIHRvIGxvYWQgdGhlIHBhY2thZ2Ugc28gdGhlIGNvbmZpZyBpcyByZWdpc3RlcmVkLlxuICAgIGF0b20ucGFja2FnZXMubG9hZFBhY2thZ2UoJ2h5cGVyY2xpY2snKTtcblxuICAgIHRleHRFZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKCdoeXBlcmNsaWNrLnR4dCcpO1xuICAgIHRleHRFZGl0b3JWaWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3KHRleHRFZGl0b3IpO1xuXG4gICAgLy8gV2UgbmVlZCB0aGUgdmlldyBhdHRhY2hlZCB0byB0aGUgRE9NIGZvciB0aGUgbW91c2UgZXZlbnRzIHRvIHdvcmsuXG4gICAgamFzbWluZS5hdHRhY2hUb0RPTSh0ZXh0RWRpdG9yVmlldyk7XG5cbiAgICBoeXBlcmNsaWNrID0gbmV3IEh5cGVyY2xpY2soKTtcbiAgICBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvciA9IEFycmF5LmZyb20oaHlwZXJjbGljay5faHlwZXJjbGlja0ZvclRleHRFZGl0b3JzKVswXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBwaXhlbCBwb3NpdGlvbiBpbiB0aGUgRE9NIG9mIHRoZSB0ZXh0IGVkaXRvcidzIHNjcmVlbiBwb3NpdGlvbi5cbiAgICogVGhpcyBpcyB1c2VkIGZvciBkaXNwYXRjaGluZyBtb3VzZSBldmVudHMgaW4gdGhlIHRleHQgZWRpdG9yLlxuICAgKlxuICAgKiBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2F0b20vYXRvbS9ibG9iLzUyNzI1ODRkMjkxMGU1YjNmMmIwZjMwOWFhYjQ3NzVlYjBmNzc5YTYvc3BlYy90ZXh0LWVkaXRvci1jb21wb25lbnQtc3BlYy5jb2ZmZWUjTDI4NDVcbiAgICovXG4gIGZ1bmN0aW9uIGNsaWVudENvb3JkaW5hdGVzRm9yU2NyZWVuUG9zaXRpb24oXG4gICAgc2NyZWVuUG9zaXRpb246IGF0b20kUG9pbnQsXG4gICk6IHtjbGllbnRYOiBudW1iZXIsIGNsaWVudFk6IG51bWJlcn0ge1xuICAgIGNvbnN0IHBvc2l0aW9uT2Zmc2V0ID0gdGV4dEVkaXRvclZpZXcucGl4ZWxQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uKHNjcmVlblBvc2l0aW9uKTtcbiAgICBjb25zdCB7Y29tcG9uZW50fSA9IHRleHRFZGl0b3JWaWV3O1xuICAgIGludmFyaWFudChjb21wb25lbnQpO1xuICAgIGNvbnN0IHNjcm9sbFZpZXdDbGllbnRSZWN0ID0gY29tcG9uZW50LmRvbU5vZGVcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoJy5zY3JvbGwtdmlldycpXG4gICAgICAgIC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBjbGllbnRYID0gc2Nyb2xsVmlld0NsaWVudFJlY3QubGVmdFxuICAgICAgICAgICAgICAgICAgKyBwb3NpdGlvbk9mZnNldC5sZWZ0XG4gICAgICAgICAgICAgICAgICAtIHRleHRFZGl0b3JWaWV3LmdldFNjcm9sbExlZnQoKTtcbiAgICBjb25zdCBjbGllbnRZID0gc2Nyb2xsVmlld0NsaWVudFJlY3QudG9wXG4gICAgICAgICAgICAgICAgICArIHBvc2l0aW9uT2Zmc2V0LnRvcFxuICAgICAgICAgICAgICAgICAgLSB0ZXh0RWRpdG9yVmlldy5nZXRTY3JvbGxUb3AoKTtcbiAgICByZXR1cm4ge2NsaWVudFgsIGNsaWVudFl9O1xuICB9XG5cbiAgZnVuY3Rpb24gZGlzcGF0Y2goXG4gICAgZXZlbnRDbGFzczogdHlwZW9mIEtleWJvYXJkRXZlbnQgfCB0eXBlb2YgTW91c2VFdmVudCxcbiAgICB0eXBlOiBzdHJpbmcsXG4gICAgcG9zaXRpb246IGF0b20kUG9pbnQsXG4gICAgcHJvcGVydGllc18/OiB7Y2xpZW50WD86IG51bWJlciwgY2xpZW50WT86IG51bWJlciwgbWV0YUtleT86IGJvb2xlYW59LFxuICApOiB2b2lkIHtcbiAgICBsZXQgcHJvcGVydGllcyA9IHByb3BlcnRpZXNfO1xuICAgIGNvbnN0IHtjbGllbnRYLCBjbGllbnRZfSA9IGNsaWVudENvb3JkaW5hdGVzRm9yU2NyZWVuUG9zaXRpb24ocG9zaXRpb24pO1xuICAgIGlmIChwcm9wZXJ0aWVzICE9IG51bGwpIHtcbiAgICAgIHByb3BlcnRpZXMuY2xpZW50WCA9IGNsaWVudFg7XG4gICAgICBwcm9wZXJ0aWVzLmNsaWVudFkgPSBjbGllbnRZO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9wZXJ0aWVzID0ge2NsaWVudFgsIGNsaWVudFl9O1xuICAgIH1cbiAgICBjb25zdCBldmVudCA9IG5ldyBldmVudENsYXNzKHR5cGUsIHByb3BlcnRpZXMpO1xuICAgIGxldCBkb21Ob2RlID0gbnVsbDtcbiAgICBpZiAoZXZlbnRDbGFzcyA9PT0gTW91c2VFdmVudCkge1xuICAgICAgY29uc3Qge2NvbXBvbmVudH0gPSB0ZXh0RWRpdG9yVmlldztcbiAgICAgIGludmFyaWFudChjb21wb25lbnQpO1xuICAgICAgZG9tTm9kZSA9IGNvbXBvbmVudC5saW5lc0NvbXBvbmVudC5nZXREb21Ob2RlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvbU5vZGUgPSB0ZXh0RWRpdG9yVmlldztcbiAgICB9XG4gICAgZG9tTm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgfVxuXG4gIGRlc2NyaWJlKCd3aXRob3V0IGxpbmUgd3JhcHBpbmcnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCBzZXR1cCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBhZnRlckVhY2goKCkgPT4ge1xuICAgICAgaHlwZXJjbGljay5kaXNwb3NlKCk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnc2ltcGxlIGNhc2UnLCAoKSA9PiB7XG4gICAgICBsZXQgcHJvdmlkZXI6IEh5cGVyY2xpY2tQcm92aWRlciA9IChudWxsOiBhbnkpO1xuICAgICAgY29uc3QgcG9zaXRpb24gPSBuZXcgUG9pbnQoMCwgMSk7XG5cbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBwcm92aWRlciA9IHtcbiAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2s6ICgpID0+IHt9fTtcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBzcHlPbihwcm92aWRlciwgJ2dldFN1Z2dlc3Rpb25Gb3JXb3JkJykuYW5kQ2FsbFRocm91Z2goKTtcbiAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIpO1xuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIGNhbGwgdGhlIHByb3ZpZGVyJywgKCkgPT4ge1xuICAgICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGF3YWl0IGh5cGVyY2xpY2suZ2V0U3VnZ2VzdGlvbih0ZXh0RWRpdG9yLCBwb3NpdGlvbik7XG4gICAgICAgICAgZXhwZWN0KHByb3ZpZGVyLmdldFN1Z2dlc3Rpb25Gb3JXb3JkKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIGEgcmVtb3ZlZCBwcm92aWRlcicsICgpID0+IHtcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBoeXBlcmNsaWNrLnJlbW92ZVByb3ZpZGVyKHByb3ZpZGVyKTtcbiAgICAgICAgICBhd2FpdCBoeXBlcmNsaWNrLmdldFN1Z2dlc3Rpb24odGV4dEVkaXRvciwgcG9zaXRpb24pO1xuICAgICAgICAgIGV4cGVjdChwcm92aWRlci5nZXRTdWdnZXN0aW9uRm9yV29yZCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCc8bWV0YS1tb3VzZW1vdmU+ICsgPG1ldGEtbW91c2Vkb3duPicsICgpID0+IHtcbiAgICAgIGl0KCdjb25zdW1lcyBzaW5nbGUtd29yZCBwcm92aWRlcnMgd2l0aG91dCB3b3JkUmVnRXhwJywgKCkgPT4ge1xuICAgICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrJyk7XG4gICAgICAgICAgY29uc3QgcHJvdmlkZXIgPSB7XG4gICAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfTtcbiAgICAgICAgICBzcHlPbihwcm92aWRlciwgJ2dldFN1Z2dlc3Rpb25Gb3JXb3JkJykuYW5kQ2FsbFRocm91Z2goKTtcbiAgICAgICAgICBoeXBlcmNsaWNrLmNvbnN1bWVQcm92aWRlcihwcm92aWRlcik7XG5cbiAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IG5ldyBQb2ludCgwLCAxKTtcbiAgICAgICAgICBjb25zdCBleHBlY3RlZFRleHQgPSAnd29yZDEnO1xuICAgICAgICAgIGNvbnN0IGV4cGVjdGVkUmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0KFtbMCwgMF0sIFswLCA1XV0pO1xuXG4gICAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIHBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgICAgZXhwZWN0KHByb3ZpZGVyLmdldFN1Z2dlc3Rpb25Gb3JXb3JkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICAgICAgdGV4dEVkaXRvcixcbiAgICAgICAgICAgICAgZXhwZWN0ZWRUZXh0LFxuICAgICAgICAgICAgICBleHBlY3RlZFJhbmdlKTtcblxuICAgICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZWRvd24nLCBwb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgICBleHBlY3QoY2FsbGJhY2suY2FsbENvdW50KS50b0JlKDEpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnY29uc3VtZXMgc2luZ2xlLXdvcmQgcHJvdmlkZXJzIHdpdGggd29yZFJlZ0V4cCcsICgpID0+IHtcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xuICAgICAgICAgIGNvbnN0IHByb3ZpZGVyID0ge1xuICAgICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge1xuICAgICAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFja307XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd29yZFJlZ0V4cDogL3dvcmQvZyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHNweU9uKHByb3ZpZGVyLCAnZ2V0U3VnZ2VzdGlvbkZvcldvcmQnKS5hbmRDYWxsVGhyb3VnaCgpO1xuICAgICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyKTtcblxuICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDgpO1xuICAgICAgICAgIGNvbnN0IGV4cGVjdGVkVGV4dCA9ICd3b3JkJztcbiAgICAgICAgICBjb25zdCBleHBlY3RlZFJhbmdlID0gUmFuZ2UuZnJvbU9iamVjdChbWzAsIDZdLCBbMCwgMTBdXSk7XG5cbiAgICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgICAgYXdhaXQgaHlwZXJjbGlja0ZvclRleHRFZGl0b3IuZ2V0U3VnZ2VzdGlvbkF0TW91c2UoKTtcbiAgICAgICAgICBleHBlY3QocHJvdmlkZXIuZ2V0U3VnZ2VzdGlvbkZvcldvcmQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgICAgICB0ZXh0RWRpdG9yLFxuICAgICAgICAgICAgICBleHBlY3RlZFRleHQsXG4gICAgICAgICAgICAgIGV4cGVjdGVkUmFuZ2UpO1xuXG4gICAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlZG93bicsIHBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICAgIGV4cGVjdChjYWxsYmFjay5jYWxsQ291bnQpLnRvQmUoMSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdjb25zdW1lcyBtdWx0aS1yYW5nZSBwcm92aWRlcnMnLCAoKSA9PiB7XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgICBjb25zdCBwcm92aWRlciA9IHtcbiAgICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbihzb3VyY2VUZXh0RWRpdG9yOiBUZXh0RWRpdG9yLCBzb3VyY2VQb3NpdGlvbjogUG9pbnQpIHtcbiAgICAgICAgICAgICAgY29uc3QgcmFuZ2UgPSBbXG4gICAgICAgICAgICAgICAgbmV3IFJhbmdlKHNvdXJjZVBvc2l0aW9uLCBzb3VyY2VQb3NpdGlvbi50cmFuc2xhdGUoWzAsIDFdKSksXG4gICAgICAgICAgICAgICAgbmV3IFJhbmdlKHNvdXJjZVBvc2l0aW9uLnRyYW5zbGF0ZShbMCwgMl0pLCBzb3VyY2VQb3NpdGlvbi50cmFuc2xhdGUoWzAsIDNdKSksXG4gICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfTtcbiAgICAgICAgICBzcHlPbihwcm92aWRlciwgJ2dldFN1Z2dlc3Rpb24nKS5hbmRDYWxsVGhyb3VnaCgpO1xuICAgICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyKTtcblxuICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDgpO1xuXG4gICAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIHBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgICAgZXhwZWN0KHByb3ZpZGVyLmdldFN1Z2dlc3Rpb24pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHRleHRFZGl0b3IsIHBvc2l0aW9uKTtcblxuICAgICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZWRvd24nLCBwb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgICBleHBlY3QoY2FsbGJhY2suY2FsbENvdW50KS50b0JlKDEpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnY29uc3VtZXMgbXVsdGlwbGUgcHJvdmlkZXJzIGZyb20gZGlmZmVyZW50IHNvdXJjZXMnLCAoKSA9PiB7XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgY2FsbGJhY2sxID0gamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrJyk7XG4gICAgICAgICAgY29uc3QgcHJvdmlkZXIxID0ge1xuICAgICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgICAvLyBEbyBub3QgcmV0dXJuIGEgc3VnZ2VzdGlvbiwgc28gd2UgY2FuIGZhbGwgdGhyb3VnaCB0byBwcm92aWRlcjIuXG4gICAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge30sXG4gICAgICAgICAgfTtcbiAgICAgICAgICBzcHlPbihwcm92aWRlcjEsICdnZXRTdWdnZXN0aW9uRm9yV29yZCcpLmFuZENhbGxUaHJvdWdoKCk7XG5cbiAgICAgICAgICBjb25zdCBjYWxsYmFjazIgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgICBjb25zdCBwcm92aWRlcjIgPSB7XG4gICAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrOiBjYWxsYmFjazJ9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHNweU9uKHByb3ZpZGVyMiwgJ2dldFN1Z2dlc3Rpb25Gb3JXb3JkJykuYW5kQ2FsbFRocm91Z2goKTtcblxuICAgICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyMSk7XG4gICAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIyKTtcblxuICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDEpO1xuICAgICAgICAgIGNvbnN0IGV4cGVjdGVkVGV4dCA9ICd3b3JkMSc7XG4gICAgICAgICAgY29uc3QgZXhwZWN0ZWRSYW5nZSA9IFJhbmdlLmZyb21PYmplY3QoW1swLCAwXSwgWzAsIDVdXSk7XG5cbiAgICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgICAgYXdhaXQgaHlwZXJjbGlja0ZvclRleHRFZGl0b3IuZ2V0U3VnZ2VzdGlvbkF0TW91c2UoKTtcbiAgICAgICAgICBleHBlY3QocHJvdmlkZXIyLmdldFN1Z2dlc3Rpb25Gb3JXb3JkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICAgICAgdGV4dEVkaXRvcixcbiAgICAgICAgICAgICAgZXhwZWN0ZWRUZXh0LFxuICAgICAgICAgICAgICBleHBlY3RlZFJhbmdlKTtcblxuICAgICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZWRvd24nLCBwb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgICBleHBlY3QoY2FsbGJhY2sxLmNhbGxDb3VudCkudG9CZSgwKTtcbiAgICAgICAgICBleHBlY3QoY2FsbGJhY2syLmNhbGxDb3VudCkudG9CZSgxKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ2NvbnN1bWVzIG11bHRpcGxlIHByb3ZpZGVycyBmcm9tIHRoZSBzYW1lIHNvdXJjZScsICgpID0+IHtcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCBjYWxsYmFjazEgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgICBjb25zdCBwcm92aWRlcjEgPSB7XG4gICAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICAgIC8vIERvIG5vdCByZXR1cm4gYSBzdWdnZXN0aW9uLCBzbyB3ZSBjYW4gZmFsbCB0aHJvdWdoIHRvIHByb3ZpZGVyMi5cbiAgICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7fSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHNweU9uKHByb3ZpZGVyMSwgJ2dldFN1Z2dlc3Rpb25Gb3JXb3JkJykuYW5kQ2FsbFRocm91Z2goKTtcblxuICAgICAgICAgIGNvbnN0IGNhbGxiYWNrMiA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xuICAgICAgICAgIGNvbnN0IHByb3ZpZGVyMiA9IHtcbiAgICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2s6IGNhbGxiYWNrMn07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG4gICAgICAgICAgc3B5T24ocHJvdmlkZXIyLCAnZ2V0U3VnZ2VzdGlvbkZvcldvcmQnKS5hbmRDYWxsVGhyb3VnaCgpO1xuXG4gICAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIoW3Byb3ZpZGVyMSwgcHJvdmlkZXIyXSk7XG5cbiAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IG5ldyBQb2ludCgwLCAxKTtcbiAgICAgICAgICBjb25zdCBleHBlY3RlZFRleHQgPSAnd29yZDEnO1xuICAgICAgICAgIGNvbnN0IGV4cGVjdGVkUmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0KFtbMCwgMF0sIFswLCA1XV0pO1xuXG4gICAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIHBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgICAgZXhwZWN0KHByb3ZpZGVyMi5nZXRTdWdnZXN0aW9uRm9yV29yZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgICAgIHRleHRFZGl0b3IsXG4gICAgICAgICAgICAgIGV4cGVjdGVkVGV4dCxcbiAgICAgICAgICAgICAgZXhwZWN0ZWRSYW5nZSk7XG5cbiAgICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vkb3duJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgICAgZXhwZWN0KGNhbGxiYWNrMS5jYWxsQ291bnQpLnRvQmUoMCk7XG4gICAgICAgICAgZXhwZWN0KGNhbGxiYWNrMi5jYWxsQ291bnQpLnRvQmUoMSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnYXZvaWRzIGV4Y2Vzc2l2ZSBjYWxscycsICgpID0+IHtcbiAgICAgIGl0KCdpZ25vcmVzIDxtb3VzZW1vdmU+IGluIHRoZSBzYW1lIHdvcmQgYXMgdGhlIGxhc3QgcG9zaXRpb24nLCAoKSA9PiB7XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgcHJvdmlkZXIgPSB7XG4gICAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICAgIC8vIE5ldmVyIHJlc29sdmUgdGhpcywgc28gd2Uga25vdyB0aGF0IG5vIHN1Z2dlc3Rpb24gaXMgc2V0LlxuICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKCkgPT4ge30pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHNweU9uKHByb3ZpZGVyLCAnZ2V0U3VnZ2VzdGlvbkZvcldvcmQnKS5hbmRDYWxsVGhyb3VnaCgpO1xuICAgICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyKTtcblxuICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDEpO1xuICAgICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZW1vdmUnLCBwb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgcG9zaXRpb24udHJhbnNsYXRlKFswLCAxXSksIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIHBvc2l0aW9uLnRyYW5zbGF0ZShbMCwgMl0pLCB7bWV0YUtleTogdHJ1ZX0pO1xuXG4gICAgICAgICAgZXhwZWN0KHByb3ZpZGVyLmdldFN1Z2dlc3Rpb25Gb3JXb3JkLmNhbGxDb3VudCkudG9CZSgxKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ2lnbm9yZXMgPG1vdXNlbW92ZT4gaW4gdGhlIHNhbWUgc2luZ2xlLXJhbmdlIGFzIHRoZSBsYXN0IHN1Z2dlc3Rpb24nLCAoKSA9PiB7XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgICBjb25zdCBwcm92aWRlciA9IHtcbiAgICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2t9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHNweU9uKHByb3ZpZGVyLCAnZ2V0U3VnZ2VzdGlvbkZvcldvcmQnKS5hbmRDYWxsVGhyb3VnaCgpO1xuICAgICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyKTtcblxuICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDEpO1xuICAgICAgICAgIGNvbnN0IGV4cGVjdGVkVGV4dCA9ICd3b3JkMSc7XG4gICAgICAgICAgY29uc3QgZXhwZWN0ZWRSYW5nZSA9IFJhbmdlLmZyb21PYmplY3QoW1swLCAwXSwgWzAsIDVdXSk7XG5cbiAgICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgICAgYXdhaXQgaHlwZXJjbGlja0ZvclRleHRFZGl0b3IuZ2V0U3VnZ2VzdGlvbkF0TW91c2UoKTtcbiAgICAgICAgICBleHBlY3QocHJvdmlkZXIuZ2V0U3VnZ2VzdGlvbkZvcldvcmQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgICAgICB0ZXh0RWRpdG9yLFxuICAgICAgICAgICAgICBleHBlY3RlZFRleHQsXG4gICAgICAgICAgICAgIGV4cGVjdGVkUmFuZ2UpO1xuXG4gICAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIHBvc2l0aW9uLnRyYW5zbGF0ZShbMCwgMV0pLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG5cbiAgICAgICAgICBleHBlY3QocHJvdmlkZXIuZ2V0U3VnZ2VzdGlvbkZvcldvcmQuY2FsbENvdW50KS50b0JlKDEpO1xuXG4gICAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlZG93bicsIHBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICAgIGV4cGVjdChjYWxsYmFjay5jYWxsQ291bnQpLnRvQmUoMSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdoYW5kbGVzIDxtb3VzZW1vdmU+IGluIGEgZGlmZmVyZW50IHNpbmdsZS1yYW5nZSBhcyB0aGUgbGFzdCBzdWdnZXN0aW9uJywgKCkgPT4ge1xuICAgICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrJyk7XG4gICAgICAgICAgY29uc3QgcHJvdmlkZXIgPSB7XG4gICAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfTtcbiAgICAgICAgICBzcHlPbihwcm92aWRlciwgJ2dldFN1Z2dlc3Rpb25Gb3JXb3JkJykuYW5kQ2FsbFRocm91Z2goKTtcbiAgICAgICAgICBoeXBlcmNsaWNrLmNvbnN1bWVQcm92aWRlcihwcm92aWRlcik7XG5cbiAgICAgICAgICBjb25zdCBwb3NpdGlvbjEgPSBuZXcgUG9pbnQoMCwgMSk7XG4gICAgICAgICAgY29uc3QgZXhwZWN0ZWRUZXh0MSA9ICd3b3JkMSc7XG4gICAgICAgICAgY29uc3QgZXhwZWN0ZWRSYW5nZTEgPSBSYW5nZS5mcm9tT2JqZWN0KFtbMCwgMF0sIFswLCA1XV0pO1xuXG4gICAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIHBvc2l0aW9uMSwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgICBhd2FpdCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvci5nZXRTdWdnZXN0aW9uQXRNb3VzZSgpO1xuICAgICAgICAgIGV4cGVjdChwcm92aWRlci5nZXRTdWdnZXN0aW9uRm9yV29yZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgICAgIHRleHRFZGl0b3IsXG4gICAgICAgICAgICAgIGV4cGVjdGVkVGV4dDEsXG4gICAgICAgICAgICAgIGV4cGVjdGVkUmFuZ2UxKTtcblxuICAgICAgICAgIGNvbnN0IHBvc2l0aW9uMiA9IG5ldyBQb2ludCgwLCA4KTtcbiAgICAgICAgICBjb25zdCBleHBlY3RlZFRleHQyID0gJ3dvcmQyJztcbiAgICAgICAgICBjb25zdCBleHBlY3RlZFJhbmdlMiA9IFJhbmdlLmZyb21PYmplY3QoW1swLCA2XSwgWzAsIDExXV0pO1xuICAgICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZW1vdmUnLCBwb3NpdGlvbjIsIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgICAgYXdhaXQgaHlwZXJjbGlja0ZvclRleHRFZGl0b3IuZ2V0U3VnZ2VzdGlvbkF0TW91c2UoKTtcbiAgICAgICAgICBleHBlY3QocHJvdmlkZXIuZ2V0U3VnZ2VzdGlvbkZvcldvcmQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgICAgICB0ZXh0RWRpdG9yLFxuICAgICAgICAgICAgICBleHBlY3RlZFRleHQyLFxuICAgICAgICAgICAgICBleHBlY3RlZFJhbmdlMik7XG5cbiAgICAgICAgICBleHBlY3QocHJvdmlkZXIuZ2V0U3VnZ2VzdGlvbkZvcldvcmQuY2FsbENvdW50KS50b0JlKDIpO1xuXG4gICAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlZG93bicsIHBvc2l0aW9uMiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgICBleHBlY3QoY2FsbGJhY2suY2FsbENvdW50KS50b0JlKDEpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnaWdub3JlcyA8bW91c2Vtb3ZlPiBpbiB0aGUgc2FtZSBtdWx0aS1yYW5nZSBhcyB0aGUgbGFzdCBzdWdnZXN0aW9uJywgKCkgPT4ge1xuICAgICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHJhbmdlID0gW1xuICAgICAgICAgICAgbmV3IFJhbmdlKG5ldyBQb2ludCgwLCAxKSwgbmV3IFBvaW50KDAsIDIpKSxcbiAgICAgICAgICAgIG5ldyBSYW5nZShuZXcgUG9pbnQoMCwgNCksIG5ldyBQb2ludCgwLCA1KSksXG4gICAgICAgICAgXTtcbiAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xuICAgICAgICAgIGNvbnN0IHByb3ZpZGVyID0ge1xuICAgICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uKHNvdXJjZVRleHRFZGl0b3IsIHNvdXJjZVBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfTtcbiAgICAgICAgICBzcHlPbihwcm92aWRlciwgJ2dldFN1Z2dlc3Rpb24nKS5hbmRDYWxsVGhyb3VnaCgpO1xuICAgICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyKTtcblxuICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDEpO1xuXG4gICAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIHBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgICAgZXhwZWN0KHByb3ZpZGVyLmdldFN1Z2dlc3Rpb24pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHRleHRFZGl0b3IsIHBvc2l0aW9uKTtcblxuICAgICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZW1vdmUnLCBuZXcgUG9pbnQoMCwgNCksIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgICAgYXdhaXQgaHlwZXJjbGlja0ZvclRleHRFZGl0b3IuZ2V0U3VnZ2VzdGlvbkF0TW91c2UoKTtcblxuICAgICAgICAgIGV4cGVjdChwcm92aWRlci5nZXRTdWdnZXN0aW9uLmNhbGxDb3VudCkudG9CZSgxKTtcblxuICAgICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZWRvd24nLCBwb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgICBleHBlY3QoY2FsbGJhY2suY2FsbENvdW50KS50b0JlKDEpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnaWdub3JlcyA8bW91c2Vkb3duPiB3aGVuIG91dCBvZiByZXN1bHQgcmFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgICBjb25zdCBwcm92aWRlciA9IHtcbiAgICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2t9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHNweU9uKHByb3ZpZGVyLCAnZ2V0U3VnZ2VzdGlvbkZvcldvcmQnKS5hbmRDYWxsVGhyb3VnaCgpO1xuICAgICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyKTtcblxuICAgICAgICAgIGNvbnN0IGluUmFuZ2VQb3NpdGlvbiA9IG5ldyBQb2ludCgwLCAxKTtcbiAgICAgICAgICBjb25zdCBvdXRPZlJhbmdlUG9zaXRpb24gPSBuZXcgUG9pbnQoMSwgMCk7XG4gICAgICAgICAgY29uc3QgZXhwZWN0ZWRUZXh0ID0gJ3dvcmQxJztcbiAgICAgICAgICBjb25zdCBleHBlY3RlZFJhbmdlID0gUmFuZ2UuZnJvbU9iamVjdChbWzAsIDBdLCBbMCwgNV1dKTtcblxuICAgICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZW1vdmUnLCBpblJhbmdlUG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgICAgYXdhaXQgaHlwZXJjbGlja0ZvclRleHRFZGl0b3IuZ2V0U3VnZ2VzdGlvbkF0TW91c2UoKTtcbiAgICAgICAgICBleHBlY3QocHJvdmlkZXIuZ2V0U3VnZ2VzdGlvbkZvcldvcmQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgICAgICB0ZXh0RWRpdG9yLFxuICAgICAgICAgICAgICBleHBlY3RlZFRleHQsXG4gICAgICAgICAgICAgIGV4cGVjdGVkUmFuZ2UpO1xuXG4gICAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIG91dE9mUmFuZ2VQb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vkb3duJywgb3V0T2ZSYW5nZVBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICAgIGV4cGVjdChjYWxsYmFjay5jYWxsQ291bnQpLnRvQmUoMCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnYWRkcyB0aGUgYGh5cGVyY2xpY2tgIENTUyBjbGFzcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3ZpZGVyID0ge1xuICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFjaygpIHt9fTtcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBoeXBlcmNsaWNrLmNvbnN1bWVQcm92aWRlcihwcm92aWRlcik7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ2FkZHMgb24gPG1ldGEtbW91c2Vtb3ZlPiwgcmVtb3ZlcyBvbiA8bWV0YS1tb3VzZWRvd24+JywgKCkgPT4ge1xuICAgICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDEpO1xuXG4gICAgICAgICAgZXhwZWN0KHRleHRFZGl0b3JWaWV3LmNsYXNzTGlzdC5jb250YWlucygnaHlwZXJjbGljaycpKS50b0JlKGZhbHNlKTtcblxuICAgICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZW1vdmUnLCBwb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgICBhd2FpdCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvci5nZXRTdWdnZXN0aW9uQXRNb3VzZSgpO1xuICAgICAgICAgIGV4cGVjdCh0ZXh0RWRpdG9yVmlldy5jbGFzc0xpc3QuY29udGFpbnMoJ2h5cGVyY2xpY2snKSkudG9CZSh0cnVlKTtcblxuICAgICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZWRvd24nLCBwb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgICBleHBlY3QodGV4dEVkaXRvclZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKCdoeXBlcmNsaWNrJykpLnRvQmUoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnYWRkcyBvbiA8bWV0YS1rZXlkb3duPiwgcmVtb3ZlcyBvbiA8bWV0YS1rZXl1cD4nLCAoKSA9PiB7XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBuZXcgUG9pbnQoMCwgMSk7XG5cbiAgICAgICAgICAvLyBXZSBuZWVkIHRvIG1vdmUgdGhlIG1vdXNlIG9uY2UsIHNvIEh5cGVyY2xpY2sga25vd3Mgd2hlcmUgaXQgaXMuXG4gICAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIHBvc2l0aW9uKTtcbiAgICAgICAgICBleHBlY3QodGV4dEVkaXRvclZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKCdoeXBlcmNsaWNrJykpLnRvQmUoZmFsc2UpO1xuXG4gICAgICAgICAgZGlzcGF0Y2goS2V5Ym9hcmRFdmVudCwgJ2tleWRvd24nLCBwb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgICBhd2FpdCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvci5nZXRTdWdnZXN0aW9uQXRNb3VzZSgpO1xuICAgICAgICAgIGV4cGVjdCh0ZXh0RWRpdG9yVmlldy5jbGFzc0xpc3QuY29udGFpbnMoJ2h5cGVyY2xpY2snKSkudG9CZSh0cnVlKTtcblxuICAgICAgICAgIGRpc3BhdGNoKEtleWJvYXJkRXZlbnQsICdrZXl1cCcsIHBvc2l0aW9uKTtcbiAgICAgICAgICBleHBlY3QodGV4dEVkaXRvclZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKCdoeXBlcmNsaWNrJykpLnRvQmUoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2h5cGVyY2xpY2s6Y29uZmlybS1jdXJzb3InLCAoKSA9PiB7XG4gICAgICBpdCgnY29uZmlybXMgdGhlIHN1Z2dlc3Rpb24gYXQgdGhlIGN1cnNvciBldmVuIGlmIHRoZSBtb3VzZSBtb3ZlZCcsICgpID0+IHtcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xuICAgICAgICAgIGNvbnN0IHByb3ZpZGVyID0ge1xuICAgICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge1xuICAgICAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFja307XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG4gICAgICAgICAgc3B5T24ocHJvdmlkZXIsICdnZXRTdWdnZXN0aW9uRm9yV29yZCcpLmFuZENhbGxUaHJvdWdoKCk7XG4gICAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIpO1xuXG4gICAgICAgICAgY29uc3QgbW91c2VQb3NpdGlvbiA9IG5ldyBQb2ludCgwLCAxKTtcbiAgICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgbW91c2VQb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgICBhd2FpdCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvci5nZXRTdWdnZXN0aW9uQXRNb3VzZSgpO1xuXG4gICAgICAgICAgdGV4dEVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihuZXcgUG9pbnQoMCwgOCkpO1xuICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2godGV4dEVkaXRvclZpZXcsICdoeXBlcmNsaWNrOmNvbmZpcm0tY3Vyc29yJyk7XG4gICAgICAgICAgZXhwZWN0KHByb3ZpZGVyLmdldFN1Z2dlc3Rpb25Gb3JXb3JkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICAgICAgdGV4dEVkaXRvcixcbiAgICAgICAgICAgICAgJ3dvcmQyJyxcbiAgICAgICAgICAgICAgUmFuZ2UuZnJvbU9iamVjdChbWzAsIDZdLCBbMCwgMTFdXSkpO1xuICAgICAgICAgIHdhaXRzRm9yKCgpID0+IGNhbGxiYWNrLmNhbGxDb3VudCA9PT0gMSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgncHJpb3JpdHknLCAoKSA9PiB7XG4gICAgICBpdCgnY29uZmlybXMgaGlnaGVyIHByaW9yaXR5IHByb3ZpZGVyIHdoZW4gaXQgaXMgY29uc3VtZWQgZmlyc3QnLCAoKSA9PiB7XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgY2FsbGJhY2sxID0gamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrJyk7XG4gICAgICAgICAgY29uc3QgcHJvdmlkZXIxID0ge1xuICAgICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge1xuICAgICAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFjazogY2FsbGJhY2sxfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwcmlvcml0eTogNSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyMSk7XG5cbiAgICAgICAgICBjb25zdCBjYWxsYmFjazIgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgICBjb25zdCBwcm92aWRlcjIgPSB7XG4gICAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrOiBjYWxsYmFjazF9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByaW9yaXR5OiAzLFxuICAgICAgICAgIH07XG4gICAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIyKTtcblxuICAgICAgICAgIGNvbnN0IG1vdXNlUG9zaXRpb24gPSBuZXcgUG9pbnQoMCwgMSk7XG4gICAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIG1vdXNlUG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgICAgYXdhaXQgaHlwZXJjbGlja0ZvclRleHRFZGl0b3IuZ2V0U3VnZ2VzdGlvbkF0TW91c2UoKTtcbiAgICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vkb3duJywgbW91c2VQb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcblxuICAgICAgICAgIGV4cGVjdChjYWxsYmFjazEuY2FsbENvdW50KS50b0JlKDEpO1xuICAgICAgICAgIGV4cGVjdChjYWxsYmFjazIuY2FsbENvdW50KS50b0JlKDApO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnY29uZmlybXMgaGlnaGVyIHByaW9yaXR5IHByb3ZpZGVyIHdoZW4gaXQgaXMgY29uc3VtZWQgbGFzdCcsICgpID0+IHtcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCBjYWxsYmFjazEgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgICBjb25zdCBwcm92aWRlcjEgPSB7XG4gICAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrOiBjYWxsYmFjazF9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByaW9yaXR5OiAzLFxuICAgICAgICAgIH07XG4gICAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIxKTtcblxuICAgICAgICAgIGNvbnN0IGNhbGxiYWNrMiA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xuICAgICAgICAgIGNvbnN0IHByb3ZpZGVyMiA9IHtcbiAgICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2s6IGNhbGxiYWNrMn07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHJpb3JpdHk6IDUsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBoeXBlcmNsaWNrLmNvbnN1bWVQcm92aWRlcihwcm92aWRlcjIpO1xuXG4gICAgICAgICAgY29uc3QgbW91c2VQb3NpdGlvbiA9IG5ldyBQb2ludCgwLCAxKTtcbiAgICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgbW91c2VQb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgICBhd2FpdCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvci5nZXRTdWdnZXN0aW9uQXRNb3VzZSgpO1xuICAgICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZWRvd24nLCBtb3VzZVBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuXG4gICAgICAgICAgZXhwZWN0KGNhbGxiYWNrMS5jYWxsQ291bnQpLnRvQmUoMCk7XG4gICAgICAgICAgZXhwZWN0KGNhbGxiYWNrMi5jYWxsQ291bnQpLnRvQmUoMSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdjb25maXJtcyA+MCBwcmlvcml0eSBiZWZvcmUgZGVmYXVsdCBwcmlvcml0eScsICgpID0+IHtcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCBjYWxsYmFjazEgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgICBjb25zdCBwcm92aWRlcjEgPSB7XG4gICAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrOiBjYWxsYmFjazF9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyMSk7XG5cbiAgICAgICAgICBjb25zdCBjYWxsYmFjazIgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgICBjb25zdCBwcm92aWRlcjIgPSB7XG4gICAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrOiBjYWxsYmFjazJ9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByaW9yaXR5OiAxLFxuICAgICAgICAgIH07XG4gICAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIyKTtcblxuICAgICAgICAgIGNvbnN0IG1vdXNlUG9zaXRpb24gPSBuZXcgUG9pbnQoMCwgMSk7XG4gICAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIG1vdXNlUG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgICAgYXdhaXQgaHlwZXJjbGlja0ZvclRleHRFZGl0b3IuZ2V0U3VnZ2VzdGlvbkF0TW91c2UoKTtcbiAgICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vkb3duJywgbW91c2VQb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcblxuICAgICAgICAgIGV4cGVjdChjYWxsYmFjazEuY2FsbENvdW50KS50b0JlKDApO1xuICAgICAgICAgIGV4cGVjdChjYWxsYmFjazIuY2FsbENvdW50KS50b0JlKDEpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnY29uZmlybXMgPDAgcHJpb3JpdHkgYWZ0ZXIgZGVmYXVsdCBwcmlvcml0eScsICgpID0+IHtcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCBjYWxsYmFjazEgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgICBjb25zdCBwcm92aWRlcjEgPSB7XG4gICAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrOiBjYWxsYmFjazF9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByaW9yaXR5OiAtMSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyMSk7XG5cbiAgICAgICAgICBjb25zdCBjYWxsYmFjazIgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgICBjb25zdCBwcm92aWRlcjIgPSB7XG4gICAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrOiBjYWxsYmFjazJ9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyMik7XG5cbiAgICAgICAgICBjb25zdCBtb3VzZVBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDEpO1xuICAgICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZW1vdmUnLCBtb3VzZVBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlZG93bicsIG1vdXNlUG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG5cbiAgICAgICAgICBleHBlY3QoY2FsbGJhY2sxLmNhbGxDb3VudCkudG9CZSgwKTtcbiAgICAgICAgICBleHBlY3QoY2FsbGJhY2syLmNhbGxDb3VudCkudG9CZSgxKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ2NvbmZpcm1zIHNhbWUtcHJpb3JpdHkgaW4gdGhlIG9yZGVyIHRoZXkgYXJlIGNvbnN1bWVkJywgKCkgPT4ge1xuICAgICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNhbGxiYWNrMSA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xuICAgICAgICAgIGNvbnN0IHByb3ZpZGVyMSA9IHtcbiAgICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2s6IGNhbGxiYWNrMX07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG4gICAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIxKTtcblxuICAgICAgICAgIGNvbnN0IGNhbGxiYWNrMiA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xuICAgICAgICAgIGNvbnN0IHByb3ZpZGVyMiA9IHtcbiAgICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2s6IGNhbGxiYWNrMn07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG4gICAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIyKTtcblxuICAgICAgICAgIGNvbnN0IG1vdXNlUG9zaXRpb24gPSBuZXcgUG9pbnQoMCwgMSk7XG4gICAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIG1vdXNlUG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgICAgYXdhaXQgaHlwZXJjbGlja0ZvclRleHRFZGl0b3IuZ2V0U3VnZ2VzdGlvbkF0TW91c2UoKTtcbiAgICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vkb3duJywgbW91c2VQb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcblxuICAgICAgICAgIGV4cGVjdChjYWxsYmFjazEuY2FsbENvdW50KS50b0JlKDEpO1xuICAgICAgICAgIGV4cGVjdChjYWxsYmFjazIuY2FsbENvdW50KS50b0JlKDApO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnY29uZmlybXMgaGlnaGVzdCBwcmlvcml0eSBwcm92aWRlciB3aGVuIG11bHRpcGxlIGFyZSBjb25zdW1lZCBhdCBhIHRpbWUnLCAoKSA9PiB7XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgY2FsbGJhY2sxID0gamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrJyk7XG4gICAgICAgICAgY29uc3QgcHJvdmlkZXIxID0ge1xuICAgICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge1xuICAgICAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFjazogY2FsbGJhY2sxfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwcmlvcml0eTogMSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGNvbnN0IGNhbGxiYWNrMiA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xuICAgICAgICAgIGNvbnN0IHByb3ZpZGVyMiA9IHtcbiAgICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2s6IGNhbGxiYWNrMn07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHJpb3JpdHk6IDIsXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKFtwcm92aWRlcjEsIHByb3ZpZGVyMl0pO1xuXG4gICAgICAgICAgY29uc3QgbW91c2VQb3NpdGlvbiA9IG5ldyBQb2ludCgwLCAxKTtcbiAgICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgbW91c2VQb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgICBhd2FpdCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvci5nZXRTdWdnZXN0aW9uQXRNb3VzZSgpO1xuICAgICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZWRvd24nLCBtb3VzZVBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuXG4gICAgICAgICAgZXhwZWN0KGNhbGxiYWNrMS5jYWxsQ291bnQpLnRvQmUoMCk7XG4gICAgICAgICAgZXhwZWN0KGNhbGxiYWNrMi5jYWxsQ291bnQpLnRvQmUoMSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnbXVsdGlwbGUgc3VnZ2VzdGlvbnMnLCAoKSA9PiB7XG4gICAgICBpdCgnY29uZmlybXMgdGhlIGZpcnN0IHN1Z2dlc3Rpb24nLCAoKSA9PiB7XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRpdGxlOiAnY2FsbGJhY2sxJyxcbiAgICAgICAgICAgICAgY2FsbGJhY2s6IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjazEnKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRpdGxlOiAnY2FsbGJhY2syJyxcbiAgICAgICAgICAgICAgY2FsbGJhY2s6IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjazEnKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXTtcbiAgICAgICAgICBjb25zdCBwcm92aWRlciA9IHtcbiAgICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2t9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyKTtcblxuICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDEpO1xuICAgICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZW1vdmUnLCBwb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgICBhd2FpdCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvci5nZXRTdWdnZXN0aW9uQXRNb3VzZSgpO1xuICAgICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZWRvd24nLCBwb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcblxuICAgICAgICAgIGNvbnN0IHN1Z2dlc3Rpb25MaXN0RWwgPSB0ZXh0RWRpdG9yVmlldy5xdWVyeVNlbGVjdG9yKCdoeXBlcmNsaWNrLXN1Z2dlc3Rpb24tbGlzdCcpO1xuICAgICAgICAgIGV4cGVjdChzdWdnZXN0aW9uTGlzdEVsKS50b0V4aXN0KCk7XG5cbiAgICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHRleHRFZGl0b3JWaWV3LCAnZWRpdG9yOm5ld2xpbmUnKTtcblxuICAgICAgICAgIGV4cGVjdChjYWxsYmFja1swXS5jYWxsYmFjay5jYWxsQ291bnQpLnRvQmUoMSk7XG4gICAgICAgICAgZXhwZWN0KGNhbGxiYWNrWzFdLmNhbGxiYWNrLmNhbGxDb3VudCkudG9CZSgwKTtcbiAgICAgICAgICBleHBlY3QodGV4dEVkaXRvclZpZXcucXVlcnlTZWxlY3RvcignaHlwZXJjbGljay1zdWdnZXN0aW9uLWxpc3QnKSkubm90LnRvRXhpc3QoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ2NvbmZpcm1zIHRoZSBzZWNvbmQgc3VnZ2VzdGlvbicsICgpID0+IHtcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGl0bGU6ICdjYWxsYmFjazEnLFxuICAgICAgICAgICAgICBjYWxsYmFjazogamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrMScpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGl0bGU6ICdjYWxsYmFjazInLFxuICAgICAgICAgICAgICBjYWxsYmFjazogamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrMScpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdO1xuICAgICAgICAgIGNvbnN0IHByb3ZpZGVyID0ge1xuICAgICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge1xuICAgICAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFja307XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG4gICAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIpO1xuXG4gICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBuZXcgUG9pbnQoMCwgMSk7XG4gICAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIHBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlZG93bicsIHBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuXG4gICAgICAgICAgY29uc3Qgc3VnZ2VzdGlvbkxpc3RFbCA9IHRleHRFZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJ2h5cGVyY2xpY2stc3VnZ2VzdGlvbi1saXN0Jyk7XG4gICAgICAgICAgZXhwZWN0KHN1Z2dlc3Rpb25MaXN0RWwpLnRvRXhpc3QoKTtcblxuICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2godGV4dEVkaXRvclZpZXcsICdjb3JlOm1vdmUtZG93bicpO1xuICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2godGV4dEVkaXRvclZpZXcsICdlZGl0b3I6bmV3bGluZScpO1xuXG4gICAgICAgICAgZXhwZWN0KGNhbGxiYWNrWzBdLmNhbGxiYWNrLmNhbGxDb3VudCkudG9CZSgwKTtcbiAgICAgICAgICBleHBlY3QoY2FsbGJhY2tbMV0uY2FsbGJhY2suY2FsbENvdW50KS50b0JlKDEpO1xuICAgICAgICAgIGV4cGVjdCh0ZXh0RWRpdG9yVmlldy5xdWVyeVNlbGVjdG9yKCdoeXBlcmNsaWNrLXN1Z2dlc3Rpb24tbGlzdCcpKS5ub3QudG9FeGlzdCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnaXMgY2FuY2VsYWJsZScsICgpID0+IHtcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGl0bGU6ICdjYWxsYmFjazEnLFxuICAgICAgICAgICAgICBjYWxsYmFjazogamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrMScpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGl0bGU6ICdjYWxsYmFjazInLFxuICAgICAgICAgICAgICBjYWxsYmFjazogamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrMScpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdO1xuICAgICAgICAgIGNvbnN0IHByb3ZpZGVyID0ge1xuICAgICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge1xuICAgICAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFja307XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG4gICAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIpO1xuXG4gICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBuZXcgUG9pbnQoMCwgMSk7XG4gICAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIHBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlZG93bicsIHBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuXG4gICAgICAgICAgY29uc3Qgc3VnZ2VzdGlvbkxpc3RFbCA9IHRleHRFZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJ2h5cGVyY2xpY2stc3VnZ2VzdGlvbi1saXN0Jyk7XG4gICAgICAgICAgZXhwZWN0KHN1Z2dlc3Rpb25MaXN0RWwpLnRvRXhpc3QoKTtcblxuICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2godGV4dEVkaXRvclZpZXcsICdjb3JlOmNhbmNlbCcpO1xuXG4gICAgICAgICAgZXhwZWN0KGNhbGxiYWNrWzBdLmNhbGxiYWNrLmNhbGxDb3VudCkudG9CZSgwKTtcbiAgICAgICAgICBleHBlY3QoY2FsbGJhY2tbMV0uY2FsbGJhY2suY2FsbENvdW50KS50b0JlKDApO1xuICAgICAgICAgIGV4cGVjdCh0ZXh0RWRpdG9yVmlldy5xdWVyeVNlbGVjdG9yKCdoeXBlcmNsaWNrLXN1Z2dlc3Rpb24tbGlzdCcpKS5ub3QudG9FeGlzdCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCBsaW5lIHdyYXBwaW5nJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdlZGl0b3Iuc29mdFdyYXAnLCB0cnVlKTtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdlZGl0b3Iuc29mdFdyYXBBdFByZWZlcnJlZExpbmVMZW5ndGgnLCB0cnVlKTtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdlZGl0b3IucHJlZmVycmVkTGluZUxlbmd0aCcsIDYpOyAvLyBUaGlzIHdyYXBzIGVhY2ggd29yZCBvbnRvIGl0cyBvd24gbGluZS5cbiAgICAgICAgYXdhaXQgc2V0dXAoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICAgIGh5cGVyY2xpY2suZGlzcG9zZSgpO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3doZW4gdGhlIGVkaXRvciBoYXMgc29mdC13cmFwcGVkIGxpbmVzJywgKCkgPT4ge1xuICAgICAgaXQoJ0h5cGVyY2xpY2sgY29ycmVjdGx5IGRldGVjdHMgdGhlIHdvcmQgYmVpbmcgbW91c2VkIG92ZXIuJywgKCkgPT4ge1xuICAgICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrJyk7XG4gICAgICAgICAgY29uc3QgcHJvdmlkZXIgPSB7XG4gICAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfTtcbiAgICAgICAgICBzcHlPbihwcm92aWRlciwgJ2dldFN1Z2dlc3Rpb25Gb3JXb3JkJykuYW5kQ2FsbFRocm91Z2goKTtcbiAgICAgICAgICBoeXBlcmNsaWNrLmNvbnN1bWVQcm92aWRlcihwcm92aWRlcik7XG5cbiAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IG5ldyBQb2ludCg4LCAwKTtcbiAgICAgICAgICBjb25zdCBleHBlY3RlZFRleHQgPSAnd29yZDknO1xuICAgICAgICAgIGNvbnN0IGV4cGVjdGVkQnVmZmVyUmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0KFtbMiwgMTJdLCBbMiwgMTddXSk7XG4gICAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIHBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgICAgZXhwZWN0KHByb3ZpZGVyLmdldFN1Z2dlc3Rpb25Gb3JXb3JkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICAgICAgdGV4dEVkaXRvcixcbiAgICAgICAgICAgICAgZXhwZWN0ZWRUZXh0LFxuICAgICAgICAgICAgICBleHBlY3RlZEJ1ZmZlclJhbmdlKTtcbiAgICAgICAgICBleHBlY3QocHJvdmlkZXIuZ2V0U3VnZ2VzdGlvbkZvcldvcmQuY2FsbENvdW50KS50b0JlKDEpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19
//# sourceURL=/home/niv/.atom/packages/hyperclick/spec/Hyperclick-spec.js
