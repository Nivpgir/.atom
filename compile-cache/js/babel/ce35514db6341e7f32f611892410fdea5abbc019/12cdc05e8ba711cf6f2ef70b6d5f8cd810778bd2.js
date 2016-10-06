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
  var textEditor = null;
  var textEditorView = null;
  var hyperclick = null;
  var hyperclickForTextEditor = null;

  beforeEach(function () {
    return waitsForPromise(_asyncToGenerator(function* () {
      textEditor = yield atom.workspace.open('hyperclick.txt');
      textEditorView = atom.views.getView(textEditor);

      // We need the view attached to the DOM for the mouse events to work.
      jasmine.attachToDOM(textEditorView);

      hyperclick = new _libHyperclick2['default']();
      hyperclickForTextEditor = Array.from(hyperclick._hyperclickForTextEditors)[0];
    }));
  });

  afterEach(function () {
    hyperclick.dispose();
  });

  /**
   * Returns the pixel position in the DOM of the text editor's screen position.
   * This is used for dispatching mouse events in the text editor.
   *
   * Adapted from https://github.com/atom/atom/blob/5272584d2910e5b3f2b0f309aab4775eb0f779a6/spec/text-editor-component-spec.coffee#L2845
   */
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

  function dispatch(eventClass, type, position, properties) {
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

  describe('when the editor has soft-wrapped lines', function () {
    beforeEach(function () {
      textEditor.setSoftWrapped(true);
      atom.config.set('editor.softWrapAtPreferredLineLength', true);
      atom.config.set('editor.preferredLineLength', 6); // This wraps each word onto its own line.
    });

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL25pdi8uYXRvbS9wYWNrYWdlcy9oeXBlcmNsaWNrL3NwZWMvSHlwZXJjbGljay1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O29CQWdCMkIsTUFBTTs7NkJBQ1YsbUJBQW1COzs7O3NCQUNwQixRQUFROzs7O0FBbEI5QixXQUFXLENBQUM7O0FBb0JaLFFBQVEsQ0FBQyxZQUFZLEVBQUUsWUFBTTtBQUMzQixNQUFJLFVBQTJCLEdBQUksSUFBSSxBQUFNLENBQUM7QUFDOUMsTUFBSSxjQUFzQyxHQUFJLElBQUksQUFBTSxDQUFDO0FBQ3pELE1BQUksVUFBc0IsR0FBSSxJQUFJLEFBQU0sQ0FBQztBQUN6QyxNQUFJLHVCQUFnRCxHQUFJLElBQUksQUFBTSxDQUFDOztBQUVuRSxZQUFVLENBQUM7V0FBTSxlQUFlLG1CQUFDLGFBQVk7QUFDM0MsZ0JBQVUsR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDekQsb0JBQWMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzs7O0FBR2hELGFBQU8sQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRXBDLGdCQUFVLEdBQUcsZ0NBQWdCLENBQUM7QUFDOUIsNkJBQXVCLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvRSxFQUFDO0dBQUEsQ0FBQyxDQUFDOztBQUVKLFdBQVMsQ0FBQyxZQUFNO0FBQ2QsY0FBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQ3RCLENBQUMsQ0FBQzs7Ozs7Ozs7QUFRSCxXQUFTLGtDQUFrQyxDQUN6QyxjQUEwQixFQUNVO0FBQ3BDLFFBQU0sY0FBYyxHQUFHLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxjQUFjLENBQUMsQ0FBQzswQkFDakUsY0FBYztRQUEzQixT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OztBQUVyQyxZQUFNLFFBQVEsR0FBRyxnQkFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakMsWUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDO0FBQzdCLFlBQU0sbUJBQW1CLEdBQUcsWUFBTSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakUsZ0JBQVEsQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0FBQzdELGNBQU0sdUJBQXVCLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztBQUNyRCxjQUFNLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLENBQUMsb0JBQW9CLENBQ3RELFVBQVUsRUFDVixZQUFZLEVBQ1osbUJBQW1CLENBQUMsQ0FBQztBQUN6QixjQUFNLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUN6RCxFQUFDLENBQUM7S0FDSixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2h5cGVyY2xpY2svc3BlYy9IeXBlcmNsaWNrLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbi8qIEBmbG93ICovXG5cbi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4vKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cblxuaW1wb3J0IHR5cGUge0h5cGVyY2xpY2tQcm92aWRlcn0gZnJvbSAnLi4vbGliL3R5cGVzJztcbmltcG9ydCB0eXBlIEh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yIGZyb20gJy4uL2xpYi9IeXBlcmNsaWNrRm9yVGV4dEVkaXRvcic7XG5cbmltcG9ydCB7UG9pbnQsIFJhbmdlfSBmcm9tICdhdG9tJztcbmltcG9ydCBIeXBlcmNsaWNrIGZyb20gJy4uL2xpYi9IeXBlcmNsaWNrJztcbmltcG9ydCBpbnZhcmlhbnQgZnJvbSAnYXNzZXJ0JztcblxuZGVzY3JpYmUoJ0h5cGVyY2xpY2snLCAoKSA9PiB7XG4gIGxldCB0ZXh0RWRpdG9yOiBhdG9tJFRleHRFZGl0b3IgPSAobnVsbDogYW55KTtcbiAgbGV0IHRleHRFZGl0b3JWaWV3OiBhdG9tJFRleHRFZGl0b3JFbGVtZW50ID0gKG51bGw6IGFueSk7XG4gIGxldCBoeXBlcmNsaWNrOiBIeXBlcmNsaWNrID0gKG51bGw6IGFueSk7XG4gIGxldCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvcjogSHlwZXJjbGlja0ZvclRleHRFZGl0b3IgPSAobnVsbDogYW55KTtcblxuICBiZWZvcmVFYWNoKCgpID0+IHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgdGV4dEVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oJ2h5cGVyY2xpY2sudHh0Jyk7XG4gICAgdGV4dEVkaXRvclZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcodGV4dEVkaXRvcik7XG5cbiAgICAvLyBXZSBuZWVkIHRoZSB2aWV3IGF0dGFjaGVkIHRvIHRoZSBET00gZm9yIHRoZSBtb3VzZSBldmVudHMgdG8gd29yay5cbiAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHRleHRFZGl0b3JWaWV3KTtcblxuICAgIGh5cGVyY2xpY2sgPSBuZXcgSHlwZXJjbGljaygpO1xuICAgIGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yID0gQXJyYXkuZnJvbShoeXBlcmNsaWNrLl9oeXBlcmNsaWNrRm9yVGV4dEVkaXRvcnMpWzBdO1xuICB9KSk7XG5cbiAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICBoeXBlcmNsaWNrLmRpc3Bvc2UoKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHBpeGVsIHBvc2l0aW9uIGluIHRoZSBET00gb2YgdGhlIHRleHQgZWRpdG9yJ3Mgc2NyZWVuIHBvc2l0aW9uLlxuICAgKiBUaGlzIGlzIHVzZWQgZm9yIGRpc3BhdGNoaW5nIG1vdXNlIGV2ZW50cyBpbiB0aGUgdGV4dCBlZGl0b3IuXG4gICAqXG4gICAqIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vYXRvbS9hdG9tL2Jsb2IvNTI3MjU4NGQyOTEwZTViM2YyYjBmMzA5YWFiNDc3NWViMGY3NzlhNi9zcGVjL3RleHQtZWRpdG9yLWNvbXBvbmVudC1zcGVjLmNvZmZlZSNMMjg0NVxuICAgKi9cbiAgZnVuY3Rpb24gY2xpZW50Q29vcmRpbmF0ZXNGb3JTY3JlZW5Qb3NpdGlvbihcbiAgICBzY3JlZW5Qb3NpdGlvbjogYXRvbSRQb2ludCxcbiAgKToge2NsaWVudFg6IG51bWJlcjsgY2xpZW50WTogbnVtYmVyfSB7XG4gICAgY29uc3QgcG9zaXRpb25PZmZzZXQgPSB0ZXh0RWRpdG9yVmlldy5waXhlbFBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24oc2NyZWVuUG9zaXRpb24pO1xuICAgIGNvbnN0IHtjb21wb25lbnR9ID0gdGV4dEVkaXRvclZpZXc7XG4gICAgaW52YXJpYW50KGNvbXBvbmVudCk7XG4gICAgY29uc3Qgc2Nyb2xsVmlld0NsaWVudFJlY3QgPSBjb21wb25lbnQuZG9tTm9kZVxuICAgICAgICAucXVlcnlTZWxlY3RvcignLnNjcm9sbC12aWV3JylcbiAgICAgICAgLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGNsaWVudFggPSBzY3JvbGxWaWV3Q2xpZW50UmVjdC5sZWZ0XG4gICAgICAgICAgICAgICAgICArIHBvc2l0aW9uT2Zmc2V0LmxlZnRcbiAgICAgICAgICAgICAgICAgIC0gdGV4dEVkaXRvclZpZXcuZ2V0U2Nyb2xsTGVmdCgpO1xuICAgIGNvbnN0IGNsaWVudFkgPSBzY3JvbGxWaWV3Q2xpZW50UmVjdC50b3BcbiAgICAgICAgICAgICAgICAgICsgcG9zaXRpb25PZmZzZXQudG9wXG4gICAgICAgICAgICAgICAgICAtIHRleHRFZGl0b3JWaWV3LmdldFNjcm9sbFRvcCgpO1xuICAgIHJldHVybiB7Y2xpZW50WCwgY2xpZW50WX07XG4gIH1cblxuICBmdW5jdGlvbiBkaXNwYXRjaChcbiAgICAgIGV2ZW50Q2xhc3M6IHR5cGVvZiBLZXlib2FyZEV2ZW50IHwgdHlwZW9mIE1vdXNlRXZlbnQsXG4gICAgICB0eXBlOiBzdHJpbmcsXG4gICAgICBwb3NpdGlvbjogYXRvbSRQb2ludCxcbiAgICAgIHByb3BlcnRpZXM/OiB7Y2xpZW50WD86IG51bWJlcjsgY2xpZW50WT86IG51bWJlcjsgbWV0YUtleT86IGJvb2xlYW59LFxuICAgICk6IHZvaWQge1xuICAgIGNvbnN0IHtjbGllbnRYLCBjbGllbnRZfSA9IGNsaWVudENvb3JkaW5hdGVzRm9yU2NyZWVuUG9zaXRpb24ocG9zaXRpb24pO1xuICAgIGlmIChwcm9wZXJ0aWVzICE9IG51bGwpIHtcbiAgICAgIHByb3BlcnRpZXMuY2xpZW50WCA9IGNsaWVudFg7XG4gICAgICBwcm9wZXJ0aWVzLmNsaWVudFkgPSBjbGllbnRZO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9wZXJ0aWVzID0ge2NsaWVudFgsIGNsaWVudFl9O1xuICAgIH1cbiAgICBjb25zdCBldmVudCA9IG5ldyBldmVudENsYXNzKHR5cGUsIHByb3BlcnRpZXMpO1xuICAgIGxldCBkb21Ob2RlID0gbnVsbDtcbiAgICBpZiAoZXZlbnRDbGFzcyA9PT0gTW91c2VFdmVudCkge1xuICAgICAgY29uc3Qge2NvbXBvbmVudH0gPSB0ZXh0RWRpdG9yVmlldztcbiAgICAgIGludmFyaWFudChjb21wb25lbnQpO1xuICAgICAgZG9tTm9kZSA9IGNvbXBvbmVudC5saW5lc0NvbXBvbmVudC5nZXREb21Ob2RlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvbU5vZGUgPSB0ZXh0RWRpdG9yVmlldztcbiAgICB9XG4gICAgZG9tTm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgfVxuXG4gIGRlc2NyaWJlKCdzaW1wbGUgY2FzZScsICgpID0+IHtcbiAgICBsZXQgcHJvdmlkZXI6IEh5cGVyY2xpY2tQcm92aWRlciA9IChudWxsOiBhbnkpO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDEpO1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBwcm92aWRlciA9IHtcbiAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2s6ICgpID0+IHt9fTtcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICBzcHlPbihwcm92aWRlciwgJ2dldFN1Z2dlc3Rpb25Gb3JXb3JkJykuYW5kQ2FsbFRocm91Z2goKTtcbiAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyKTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIGNhbGwgdGhlIHByb3ZpZGVyJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgaHlwZXJjbGljay5nZXRTdWdnZXN0aW9uKHRleHRFZGl0b3IsIHBvc2l0aW9uKTtcbiAgICAgICAgZXhwZWN0KHByb3ZpZGVyLmdldFN1Z2dlc3Rpb25Gb3JXb3JkKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIGEgcmVtb3ZlZCBwcm92aWRlcicsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgIGh5cGVyY2xpY2sucmVtb3ZlUHJvdmlkZXIocHJvdmlkZXIpO1xuICAgICAgICBhd2FpdCBoeXBlcmNsaWNrLmdldFN1Z2dlc3Rpb24odGV4dEVkaXRvciwgcG9zaXRpb24pO1xuICAgICAgICBleHBlY3QocHJvdmlkZXIuZ2V0U3VnZ2VzdGlvbkZvcldvcmQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJzxtZXRhLW1vdXNlbW92ZT4gKyA8bWV0YS1tb3VzZWRvd24+JywgKCkgPT4ge1xuICAgIGl0KCdjb25zdW1lcyBzaW5nbGUtd29yZCBwcm92aWRlcnMgd2l0aG91dCB3b3JkUmVnRXhwJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSB7XG4gICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrfTtcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBzcHlPbihwcm92aWRlciwgJ2dldFN1Z2dlc3Rpb25Gb3JXb3JkJykuYW5kQ2FsbFRocm91Z2goKTtcbiAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIpO1xuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDEpO1xuICAgICAgICBjb25zdCBleHBlY3RlZFRleHQgPSAnd29yZDEnO1xuICAgICAgICBjb25zdCBleHBlY3RlZFJhbmdlID0gUmFuZ2UuZnJvbU9iamVjdChbWzAsIDBdLCBbMCwgNV1dKTtcblxuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgIGV4cGVjdChwcm92aWRlci5nZXRTdWdnZXN0aW9uRm9yV29yZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgICB0ZXh0RWRpdG9yLFxuICAgICAgICAgICAgZXhwZWN0ZWRUZXh0LFxuICAgICAgICAgICAgZXhwZWN0ZWRSYW5nZSk7XG5cbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlZG93bicsIHBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICBleHBlY3QoY2FsbGJhY2suY2FsbENvdW50KS50b0JlKDEpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29uc3VtZXMgc2luZ2xlLXdvcmQgcHJvdmlkZXJzIHdpdGggd29yZFJlZ0V4cCcsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrJyk7XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyID0ge1xuICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFja307XG4gICAgICAgICAgfSxcbiAgICAgICAgICB3b3JkUmVnRXhwOiAvd29yZC9nLFxuICAgICAgICB9O1xuICAgICAgICBzcHlPbihwcm92aWRlciwgJ2dldFN1Z2dlc3Rpb25Gb3JXb3JkJykuYW5kQ2FsbFRocm91Z2goKTtcbiAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIpO1xuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDgpO1xuICAgICAgICBjb25zdCBleHBlY3RlZFRleHQgPSAnd29yZCc7XG4gICAgICAgIGNvbnN0IGV4cGVjdGVkUmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0KFtbMCwgNl0sIFswLCAxMF1dKTtcblxuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgIGV4cGVjdChwcm92aWRlci5nZXRTdWdnZXN0aW9uRm9yV29yZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgICB0ZXh0RWRpdG9yLFxuICAgICAgICAgICAgZXhwZWN0ZWRUZXh0LFxuICAgICAgICAgICAgZXhwZWN0ZWRSYW5nZSk7XG5cbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlZG93bicsIHBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICBleHBlY3QoY2FsbGJhY2suY2FsbENvdW50KS50b0JlKDEpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29uc3VtZXMgbXVsdGktcmFuZ2UgcHJvdmlkZXJzJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSB7XG4gICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbihzb3VyY2VUZXh0RWRpdG9yOiBUZXh0RWRpdG9yLCBzb3VyY2VQb3NpdGlvbjogUG9pbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IHJhbmdlID0gW1xuICAgICAgICAgICAgICBuZXcgUmFuZ2Uoc291cmNlUG9zaXRpb24sIHNvdXJjZVBvc2l0aW9uLnRyYW5zbGF0ZShbMCwgMV0pKSxcbiAgICAgICAgICAgICAgbmV3IFJhbmdlKHNvdXJjZVBvc2l0aW9uLnRyYW5zbGF0ZShbMCwgMl0pLCBzb3VyY2VQb3NpdGlvbi50cmFuc2xhdGUoWzAsIDNdKSksXG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2t9O1xuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIHNweU9uKHByb3ZpZGVyLCAnZ2V0U3VnZ2VzdGlvbicpLmFuZENhbGxUaHJvdWdoKCk7XG4gICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyKTtcblxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IG5ldyBQb2ludCgwLCA4KTtcblxuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgIGV4cGVjdChwcm92aWRlci5nZXRTdWdnZXN0aW9uKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh0ZXh0RWRpdG9yLCBwb3NpdGlvbik7XG5cbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlZG93bicsIHBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICBleHBlY3QoY2FsbGJhY2suY2FsbENvdW50KS50b0JlKDEpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29uc3VtZXMgbXVsdGlwbGUgcHJvdmlkZXJzIGZyb20gZGlmZmVyZW50IHNvdXJjZXMnLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFjazEgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIxID0ge1xuICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgIC8vIERvIG5vdCByZXR1cm4gYSBzdWdnZXN0aW9uLCBzbyB3ZSBjYW4gZmFsbCB0aHJvdWdoIHRvIHByb3ZpZGVyMi5cbiAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge30sXG4gICAgICAgIH07XG4gICAgICAgIHNweU9uKHByb3ZpZGVyMSwgJ2dldFN1Z2dlc3Rpb25Gb3JXb3JkJykuYW5kQ2FsbFRocm91Z2goKTtcblxuICAgICAgICBjb25zdCBjYWxsYmFjazIgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIyID0ge1xuICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFjazogY2FsbGJhY2syfTtcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBzcHlPbihwcm92aWRlcjIsICdnZXRTdWdnZXN0aW9uRm9yV29yZCcpLmFuZENhbGxUaHJvdWdoKCk7XG5cbiAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIxKTtcbiAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIyKTtcblxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IG5ldyBQb2ludCgwLCAxKTtcbiAgICAgICAgY29uc3QgZXhwZWN0ZWRUZXh0ID0gJ3dvcmQxJztcbiAgICAgICAgY29uc3QgZXhwZWN0ZWRSYW5nZSA9IFJhbmdlLmZyb21PYmplY3QoW1swLCAwXSwgWzAsIDVdXSk7XG5cbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIHBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICBhd2FpdCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvci5nZXRTdWdnZXN0aW9uQXRNb3VzZSgpO1xuICAgICAgICBleHBlY3QocHJvdmlkZXIyLmdldFN1Z2dlc3Rpb25Gb3JXb3JkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICAgIHRleHRFZGl0b3IsXG4gICAgICAgICAgICBleHBlY3RlZFRleHQsXG4gICAgICAgICAgICBleHBlY3RlZFJhbmdlKTtcblxuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vkb3duJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGV4cGVjdChjYWxsYmFjazEuY2FsbENvdW50KS50b0JlKDApO1xuICAgICAgICBleHBlY3QoY2FsbGJhY2syLmNhbGxDb3VudCkudG9CZSgxKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NvbnN1bWVzIG11bHRpcGxlIHByb3ZpZGVycyBmcm9tIHRoZSBzYW1lIHNvdXJjZScsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrMSA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xuICAgICAgICBjb25zdCBwcm92aWRlcjEgPSB7XG4gICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgLy8gRG8gbm90IHJldHVybiBhIHN1Z2dlc3Rpb24sIHNvIHdlIGNhbiBmYWxsIHRocm91Z2ggdG8gcHJvdmlkZXIyLlxuICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7fSxcbiAgICAgICAgfTtcbiAgICAgICAgc3B5T24ocHJvdmlkZXIxLCAnZ2V0U3VnZ2VzdGlvbkZvcldvcmQnKS5hbmRDYWxsVGhyb3VnaCgpO1xuXG4gICAgICAgIGNvbnN0IGNhbGxiYWNrMiA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xuICAgICAgICBjb25zdCBwcm92aWRlcjIgPSB7XG4gICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrOiBjYWxsYmFjazJ9O1xuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIHNweU9uKHByb3ZpZGVyMiwgJ2dldFN1Z2dlc3Rpb25Gb3JXb3JkJykuYW5kQ2FsbFRocm91Z2goKTtcblxuICAgICAgICBoeXBlcmNsaWNrLmNvbnN1bWVQcm92aWRlcihbcHJvdmlkZXIxLCBwcm92aWRlcjJdKTtcblxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IG5ldyBQb2ludCgwLCAxKTtcbiAgICAgICAgY29uc3QgZXhwZWN0ZWRUZXh0ID0gJ3dvcmQxJztcbiAgICAgICAgY29uc3QgZXhwZWN0ZWRSYW5nZSA9IFJhbmdlLmZyb21PYmplY3QoW1swLCAwXSwgWzAsIDVdXSk7XG5cbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIHBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICBhd2FpdCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvci5nZXRTdWdnZXN0aW9uQXRNb3VzZSgpO1xuICAgICAgICBleHBlY3QocHJvdmlkZXIyLmdldFN1Z2dlc3Rpb25Gb3JXb3JkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICAgIHRleHRFZGl0b3IsXG4gICAgICAgICAgICBleHBlY3RlZFRleHQsXG4gICAgICAgICAgICBleHBlY3RlZFJhbmdlKTtcblxuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vkb3duJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGV4cGVjdChjYWxsYmFjazEuY2FsbENvdW50KS50b0JlKDApO1xuICAgICAgICBleHBlY3QoY2FsbGJhY2syLmNhbGxDb3VudCkudG9CZSgxKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnYXZvaWRzIGV4Y2Vzc2l2ZSBjYWxscycsICgpID0+IHtcbiAgICBpdCgnaWdub3JlcyA8bW91c2Vtb3ZlPiBpbiB0aGUgc2FtZSB3b3JkIGFzIHRoZSBsYXN0IHBvc2l0aW9uJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSB7XG4gICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgIC8vIE5ldmVyIHJlc29sdmUgdGhpcywgc28gd2Uga25vdyB0aGF0IG5vIHN1Z2dlc3Rpb24gaXMgc2V0LlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCgpID0+IHt9KTtcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBzcHlPbihwcm92aWRlciwgJ2dldFN1Z2dlc3Rpb25Gb3JXb3JkJykuYW5kQ2FsbFRocm91Z2goKTtcbiAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIpO1xuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDEpO1xuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZW1vdmUnLCBwb3NpdGlvbi50cmFuc2xhdGUoWzAsIDFdKSwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIHBvc2l0aW9uLnRyYW5zbGF0ZShbMCwgMl0pLCB7bWV0YUtleTogdHJ1ZX0pO1xuXG4gICAgICAgIGV4cGVjdChwcm92aWRlci5nZXRTdWdnZXN0aW9uRm9yV29yZC5jYWxsQ291bnQpLnRvQmUoMSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdpZ25vcmVzIDxtb3VzZW1vdmU+IGluIHRoZSBzYW1lIHNpbmdsZS1yYW5nZSBhcyB0aGUgbGFzdCBzdWdnZXN0aW9uJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSB7XG4gICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrfTtcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBzcHlPbihwcm92aWRlciwgJ2dldFN1Z2dlc3Rpb25Gb3JXb3JkJykuYW5kQ2FsbFRocm91Z2goKTtcbiAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIpO1xuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDEpO1xuICAgICAgICBjb25zdCBleHBlY3RlZFRleHQgPSAnd29yZDEnO1xuICAgICAgICBjb25zdCBleHBlY3RlZFJhbmdlID0gUmFuZ2UuZnJvbU9iamVjdChbWzAsIDBdLCBbMCwgNV1dKTtcblxuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgIGV4cGVjdChwcm92aWRlci5nZXRTdWdnZXN0aW9uRm9yV29yZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgICB0ZXh0RWRpdG9yLFxuICAgICAgICAgICAgZXhwZWN0ZWRUZXh0LFxuICAgICAgICAgICAgZXhwZWN0ZWRSYW5nZSk7XG5cbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIHBvc2l0aW9uLnRyYW5zbGF0ZShbMCwgMV0pLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICBhd2FpdCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvci5nZXRTdWdnZXN0aW9uQXRNb3VzZSgpO1xuXG4gICAgICAgIGV4cGVjdChwcm92aWRlci5nZXRTdWdnZXN0aW9uRm9yV29yZC5jYWxsQ291bnQpLnRvQmUoMSk7XG5cbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlZG93bicsIHBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICBleHBlY3QoY2FsbGJhY2suY2FsbENvdW50KS50b0JlKDEpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaGFuZGxlcyA8bW91c2Vtb3ZlPiBpbiBhIGRpZmZlcmVudCBzaW5nbGUtcmFuZ2UgYXMgdGhlIGxhc3Qgc3VnZ2VzdGlvbicsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrJyk7XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyID0ge1xuICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFja307XG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgc3B5T24ocHJvdmlkZXIsICdnZXRTdWdnZXN0aW9uRm9yV29yZCcpLmFuZENhbGxUaHJvdWdoKCk7XG4gICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyKTtcblxuICAgICAgICBjb25zdCBwb3NpdGlvbjEgPSBuZXcgUG9pbnQoMCwgMSk7XG4gICAgICAgIGNvbnN0IGV4cGVjdGVkVGV4dDEgPSAnd29yZDEnO1xuICAgICAgICBjb25zdCBleHBlY3RlZFJhbmdlMSA9IFJhbmdlLmZyb21PYmplY3QoW1swLCAwXSwgWzAsIDVdXSk7XG5cbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIHBvc2l0aW9uMSwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgYXdhaXQgaHlwZXJjbGlja0ZvclRleHRFZGl0b3IuZ2V0U3VnZ2VzdGlvbkF0TW91c2UoKTtcbiAgICAgICAgZXhwZWN0KHByb3ZpZGVyLmdldFN1Z2dlc3Rpb25Gb3JXb3JkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICAgIHRleHRFZGl0b3IsXG4gICAgICAgICAgICBleHBlY3RlZFRleHQxLFxuICAgICAgICAgICAgZXhwZWN0ZWRSYW5nZTEpO1xuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uMiA9IG5ldyBQb2ludCgwLCA4KTtcbiAgICAgICAgY29uc3QgZXhwZWN0ZWRUZXh0MiA9ICd3b3JkMic7XG4gICAgICAgIGNvbnN0IGV4cGVjdGVkUmFuZ2UyID0gUmFuZ2UuZnJvbU9iamVjdChbWzAsIDZdLCBbMCwgMTFdXSk7XG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZW1vdmUnLCBwb3NpdGlvbjIsIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgIGV4cGVjdChwcm92aWRlci5nZXRTdWdnZXN0aW9uRm9yV29yZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgICB0ZXh0RWRpdG9yLFxuICAgICAgICAgICAgZXhwZWN0ZWRUZXh0MixcbiAgICAgICAgICAgIGV4cGVjdGVkUmFuZ2UyKTtcblxuICAgICAgICBleHBlY3QocHJvdmlkZXIuZ2V0U3VnZ2VzdGlvbkZvcldvcmQuY2FsbENvdW50KS50b0JlKDIpO1xuXG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZWRvd24nLCBwb3NpdGlvbjIsIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGV4cGVjdChjYWxsYmFjay5jYWxsQ291bnQpLnRvQmUoMSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdpZ25vcmVzIDxtb3VzZW1vdmU+IGluIHRoZSBzYW1lIG11bHRpLXJhbmdlIGFzIHRoZSBsYXN0IHN1Z2dlc3Rpb24nLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCByYW5nZSA9IFtcbiAgICAgICAgICBuZXcgUmFuZ2UobmV3IFBvaW50KDAsIDEpLCBuZXcgUG9pbnQoMCwgMikpLFxuICAgICAgICAgIG5ldyBSYW5nZShuZXcgUG9pbnQoMCwgNCksIG5ldyBQb2ludCgwLCA1KSksXG4gICAgICAgIF07XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrJyk7XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyID0ge1xuICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb24oc291cmNlVGV4dEVkaXRvciwgc291cmNlUG9zaXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrfTtcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBzcHlPbihwcm92aWRlciwgJ2dldFN1Z2dlc3Rpb24nKS5hbmRDYWxsVGhyb3VnaCgpO1xuICAgICAgICBoeXBlcmNsaWNrLmNvbnN1bWVQcm92aWRlcihwcm92aWRlcik7XG5cbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBuZXcgUG9pbnQoMCwgMSk7XG5cbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIHBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICBhd2FpdCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvci5nZXRTdWdnZXN0aW9uQXRNb3VzZSgpO1xuICAgICAgICBleHBlY3QocHJvdmlkZXIuZ2V0U3VnZ2VzdGlvbikudG9IYXZlQmVlbkNhbGxlZFdpdGgodGV4dEVkaXRvciwgcG9zaXRpb24pO1xuXG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZW1vdmUnLCBuZXcgUG9pbnQoMCwgNCksIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG5cbiAgICAgICAgZXhwZWN0KHByb3ZpZGVyLmdldFN1Z2dlc3Rpb24uY2FsbENvdW50KS50b0JlKDEpO1xuXG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZWRvd24nLCBwb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgZXhwZWN0KGNhbGxiYWNrLmNhbGxDb3VudCkudG9CZSgxKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2lnbm9yZXMgPG1vdXNlZG93bj4gd2hlbiBvdXQgb2YgcmVzdWx0IHJhbmdlJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSB7XG4gICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrfTtcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBzcHlPbihwcm92aWRlciwgJ2dldFN1Z2dlc3Rpb25Gb3JXb3JkJykuYW5kQ2FsbFRocm91Z2goKTtcbiAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIpO1xuXG4gICAgICAgIGNvbnN0IGluUmFuZ2VQb3NpdGlvbiA9IG5ldyBQb2ludCgwLCAxKTtcbiAgICAgICAgY29uc3Qgb3V0T2ZSYW5nZVBvc2l0aW9uID0gbmV3IFBvaW50KDEsIDApO1xuICAgICAgICBjb25zdCBleHBlY3RlZFRleHQgPSAnd29yZDEnO1xuICAgICAgICBjb25zdCBleHBlY3RlZFJhbmdlID0gUmFuZ2UuZnJvbU9iamVjdChbWzAsIDBdLCBbMCwgNV1dKTtcblxuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgaW5SYW5nZVBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICBhd2FpdCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvci5nZXRTdWdnZXN0aW9uQXRNb3VzZSgpO1xuICAgICAgICBleHBlY3QocHJvdmlkZXIuZ2V0U3VnZ2VzdGlvbkZvcldvcmQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgICAgdGV4dEVkaXRvcixcbiAgICAgICAgICAgIGV4cGVjdGVkVGV4dCxcbiAgICAgICAgICAgIGV4cGVjdGVkUmFuZ2UpO1xuXG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZW1vdmUnLCBvdXRPZlJhbmdlUG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZWRvd24nLCBvdXRPZlJhbmdlUG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGV4cGVjdChjYWxsYmFjay5jYWxsQ291bnQpLnRvQmUoMCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2FkZHMgdGhlIGBoeXBlcmNsaWNrYCBDU1MgY2xhc3MnLCAoKSA9PiB7XG4gICAgY29uc3QgcHJvdmlkZXIgPSB7XG4gICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrKCkge319O1xuICAgICAgfSxcbiAgICB9O1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBoeXBlcmNsaWNrLmNvbnN1bWVQcm92aWRlcihwcm92aWRlcik7XG4gICAgfSk7XG5cbiAgICBpdCgnYWRkcyBvbiA8bWV0YS1tb3VzZW1vdmU+LCByZW1vdmVzIG9uIDxtZXRhLW1vdXNlZG93bj4nLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IG5ldyBQb2ludCgwLCAxKTtcblxuICAgICAgICBleHBlY3QodGV4dEVkaXRvclZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKCdoeXBlcmNsaWNrJykpLnRvQmUoZmFsc2UpO1xuXG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZW1vdmUnLCBwb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgYXdhaXQgaHlwZXJjbGlja0ZvclRleHRFZGl0b3IuZ2V0U3VnZ2VzdGlvbkF0TW91c2UoKTtcbiAgICAgICAgZXhwZWN0KHRleHRFZGl0b3JWaWV3LmNsYXNzTGlzdC5jb250YWlucygnaHlwZXJjbGljaycpKS50b0JlKHRydWUpO1xuXG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZWRvd24nLCBwb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgZXhwZWN0KHRleHRFZGl0b3JWaWV3LmNsYXNzTGlzdC5jb250YWlucygnaHlwZXJjbGljaycpKS50b0JlKGZhbHNlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2FkZHMgb24gPG1ldGEta2V5ZG93bj4sIHJlbW92ZXMgb24gPG1ldGEta2V5dXA+JywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBuZXcgUG9pbnQoMCwgMSk7XG5cbiAgICAgICAgLy8gV2UgbmVlZCB0byBtb3ZlIHRoZSBtb3VzZSBvbmNlLCBzbyBIeXBlcmNsaWNrIGtub3dzIHdoZXJlIGl0IGlzLlxuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgcG9zaXRpb24pO1xuICAgICAgICBleHBlY3QodGV4dEVkaXRvclZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKCdoeXBlcmNsaWNrJykpLnRvQmUoZmFsc2UpO1xuXG4gICAgICAgIGRpc3BhdGNoKEtleWJvYXJkRXZlbnQsICdrZXlkb3duJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgIGV4cGVjdCh0ZXh0RWRpdG9yVmlldy5jbGFzc0xpc3QuY29udGFpbnMoJ2h5cGVyY2xpY2snKSkudG9CZSh0cnVlKTtcblxuICAgICAgICBkaXNwYXRjaChLZXlib2FyZEV2ZW50LCAna2V5dXAnLCBwb3NpdGlvbik7XG4gICAgICAgIGV4cGVjdCh0ZXh0RWRpdG9yVmlldy5jbGFzc0xpc3QuY29udGFpbnMoJ2h5cGVyY2xpY2snKSkudG9CZShmYWxzZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2h5cGVyY2xpY2s6Y29uZmlybS1jdXJzb3InLCAoKSA9PiB7XG4gICAgaXQoJ2NvbmZpcm1zIHRoZSBzdWdnZXN0aW9uIGF0IHRoZSBjdXJzb3IgZXZlbiBpZiB0aGUgbW91c2UgbW92ZWQnLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFjayA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xuICAgICAgICBjb25zdCBwcm92aWRlciA9IHtcbiAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2t9O1xuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIHNweU9uKHByb3ZpZGVyLCAnZ2V0U3VnZ2VzdGlvbkZvcldvcmQnKS5hbmRDYWxsVGhyb3VnaCgpO1xuICAgICAgICBoeXBlcmNsaWNrLmNvbnN1bWVQcm92aWRlcihwcm92aWRlcik7XG5cbiAgICAgICAgY29uc3QgbW91c2VQb3NpdGlvbiA9IG5ldyBQb2ludCgwLCAxKTtcbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIG1vdXNlUG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG5cbiAgICAgICAgdGV4dEVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihuZXcgUG9pbnQoMCwgOCkpO1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHRleHRFZGl0b3JWaWV3LCAnaHlwZXJjbGljazpjb25maXJtLWN1cnNvcicpO1xuICAgICAgICBleHBlY3QocHJvdmlkZXIuZ2V0U3VnZ2VzdGlvbkZvcldvcmQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgICAgdGV4dEVkaXRvcixcbiAgICAgICAgICAgICd3b3JkMicsXG4gICAgICAgICAgICBSYW5nZS5mcm9tT2JqZWN0KFtbMCwgNl0sIFswLCAxMV1dKSk7XG4gICAgICAgIHdhaXRzRm9yKCgpID0+IGNhbGxiYWNrLmNhbGxDb3VudCA9PT0gMSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3ByaW9yaXR5JywgKCkgPT4ge1xuICAgIGl0KCdjb25maXJtcyBoaWdoZXIgcHJpb3JpdHkgcHJvdmlkZXIgd2hlbiBpdCBpcyBjb25zdW1lZCBmaXJzdCcsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrMSA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xuICAgICAgICBjb25zdCBwcm92aWRlcjEgPSB7XG4gICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrOiBjYWxsYmFjazF9O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcHJpb3JpdHk6IDUsXG4gICAgICAgIH07XG4gICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyMSk7XG5cbiAgICAgICAgY29uc3QgY2FsbGJhY2syID0gamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrJyk7XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyMiA9IHtcbiAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2s6IGNhbGxiYWNrMX07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBwcmlvcml0eTogMyxcbiAgICAgICAgfTtcbiAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIyKTtcblxuICAgICAgICBjb25zdCBtb3VzZVBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDEpO1xuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgbW91c2VQb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgYXdhaXQgaHlwZXJjbGlja0ZvclRleHRFZGl0b3IuZ2V0U3VnZ2VzdGlvbkF0TW91c2UoKTtcbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlZG93bicsIG1vdXNlUG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG5cbiAgICAgICAgZXhwZWN0KGNhbGxiYWNrMS5jYWxsQ291bnQpLnRvQmUoMSk7XG4gICAgICAgIGV4cGVjdChjYWxsYmFjazIuY2FsbENvdW50KS50b0JlKDApO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29uZmlybXMgaGlnaGVyIHByaW9yaXR5IHByb3ZpZGVyIHdoZW4gaXQgaXMgY29uc3VtZWQgbGFzdCcsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrMSA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xuICAgICAgICBjb25zdCBwcm92aWRlcjEgPSB7XG4gICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrOiBjYWxsYmFjazF9O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcHJpb3JpdHk6IDMsXG4gICAgICAgIH07XG4gICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyMSk7XG5cbiAgICAgICAgY29uc3QgY2FsbGJhY2syID0gamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrJyk7XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyMiA9IHtcbiAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2s6IGNhbGxiYWNrMn07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBwcmlvcml0eTogNSxcbiAgICAgICAgfTtcbiAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIyKTtcblxuICAgICAgICBjb25zdCBtb3VzZVBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDEpO1xuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgbW91c2VQb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgYXdhaXQgaHlwZXJjbGlja0ZvclRleHRFZGl0b3IuZ2V0U3VnZ2VzdGlvbkF0TW91c2UoKTtcbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlZG93bicsIG1vdXNlUG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG5cbiAgICAgICAgZXhwZWN0KGNhbGxiYWNrMS5jYWxsQ291bnQpLnRvQmUoMCk7XG4gICAgICAgIGV4cGVjdChjYWxsYmFjazIuY2FsbENvdW50KS50b0JlKDEpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29uZmlybXMgPjAgcHJpb3JpdHkgYmVmb3JlIGRlZmF1bHQgcHJpb3JpdHknLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFjazEgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIxID0ge1xuICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFjazogY2FsbGJhY2sxfTtcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBoeXBlcmNsaWNrLmNvbnN1bWVQcm92aWRlcihwcm92aWRlcjEpO1xuXG4gICAgICAgIGNvbnN0IGNhbGxiYWNrMiA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xuICAgICAgICBjb25zdCBwcm92aWRlcjIgPSB7XG4gICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrOiBjYWxsYmFjazJ9O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcHJpb3JpdHk6IDEsXG4gICAgICAgIH07XG4gICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyMik7XG5cbiAgICAgICAgY29uc3QgbW91c2VQb3NpdGlvbiA9IG5ldyBQb2ludCgwLCAxKTtcbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIG1vdXNlUG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZWRvd24nLCBtb3VzZVBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuXG4gICAgICAgIGV4cGVjdChjYWxsYmFjazEuY2FsbENvdW50KS50b0JlKDApO1xuICAgICAgICBleHBlY3QoY2FsbGJhY2syLmNhbGxDb3VudCkudG9CZSgxKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NvbmZpcm1zIDwwIHByaW9yaXR5IGFmdGVyIGRlZmF1bHQgcHJpb3JpdHknLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFjazEgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIxID0ge1xuICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFjazogY2FsbGJhY2sxfTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHByaW9yaXR5OiAtMSxcbiAgICAgICAgfTtcbiAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIxKTtcblxuICAgICAgICBjb25zdCBjYWxsYmFjazIgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIyID0ge1xuICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFjazogY2FsbGJhY2syfTtcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBoeXBlcmNsaWNrLmNvbnN1bWVQcm92aWRlcihwcm92aWRlcjIpO1xuXG4gICAgICAgIGNvbnN0IG1vdXNlUG9zaXRpb24gPSBuZXcgUG9pbnQoMCwgMSk7XG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZW1vdmUnLCBtb3VzZVBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICBhd2FpdCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvci5nZXRTdWdnZXN0aW9uQXRNb3VzZSgpO1xuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vkb3duJywgbW91c2VQb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcblxuICAgICAgICBleHBlY3QoY2FsbGJhY2sxLmNhbGxDb3VudCkudG9CZSgwKTtcbiAgICAgICAgZXhwZWN0KGNhbGxiYWNrMi5jYWxsQ291bnQpLnRvQmUoMSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdjb25maXJtcyBzYW1lLXByaW9yaXR5IGluIHRoZSBvcmRlciB0aGV5IGFyZSBjb25zdW1lZCcsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrMSA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xuICAgICAgICBjb25zdCBwcm92aWRlcjEgPSB7XG4gICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrOiBjYWxsYmFjazF9O1xuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyMSk7XG5cbiAgICAgICAgY29uc3QgY2FsbGJhY2syID0gamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrJyk7XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyMiA9IHtcbiAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2s6IGNhbGxiYWNrMn07XG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIyKTtcblxuICAgICAgICBjb25zdCBtb3VzZVBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDEpO1xuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgbW91c2VQb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgYXdhaXQgaHlwZXJjbGlja0ZvclRleHRFZGl0b3IuZ2V0U3VnZ2VzdGlvbkF0TW91c2UoKTtcbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlZG93bicsIG1vdXNlUG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG5cbiAgICAgICAgZXhwZWN0KGNhbGxiYWNrMS5jYWxsQ291bnQpLnRvQmUoMSk7XG4gICAgICAgIGV4cGVjdChjYWxsYmFjazIuY2FsbENvdW50KS50b0JlKDApO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29uZmlybXMgaGlnaGVzdCBwcmlvcml0eSBwcm92aWRlciB3aGVuIG11bHRpcGxlIGFyZSBjb25zdW1lZCBhdCBhIHRpbWUnLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFjazEgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIxID0ge1xuICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFjazogY2FsbGJhY2sxfTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHByaW9yaXR5OiAxLFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjYWxsYmFjazIgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIyID0ge1xuICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFjazogY2FsbGJhY2syfTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHByaW9yaXR5OiAyLFxuICAgICAgICB9O1xuXG4gICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKFtwcm92aWRlcjEsIHByb3ZpZGVyMl0pO1xuXG4gICAgICAgIGNvbnN0IG1vdXNlUG9zaXRpb24gPSBuZXcgUG9pbnQoMCwgMSk7XG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZW1vdmUnLCBtb3VzZVBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICBhd2FpdCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvci5nZXRTdWdnZXN0aW9uQXRNb3VzZSgpO1xuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vkb3duJywgbW91c2VQb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcblxuICAgICAgICBleHBlY3QoY2FsbGJhY2sxLmNhbGxDb3VudCkudG9CZSgwKTtcbiAgICAgICAgZXhwZWN0KGNhbGxiYWNrMi5jYWxsQ291bnQpLnRvQmUoMSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ211bHRpcGxlIHN1Z2dlc3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdjb25maXJtcyB0aGUgZmlyc3Qgc3VnZ2VzdGlvbicsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRpdGxlOiAnY2FsbGJhY2sxJyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2sxJyksXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0aXRsZTogJ2NhbGxiYWNrMicsXG4gICAgICAgICAgICBjYWxsYmFjazogamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrMScpLFxuICAgICAgICAgIH0sXG4gICAgICAgIF07XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyID0ge1xuICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFja307XG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIpO1xuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDEpO1xuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZWRvd24nLCBwb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcblxuICAgICAgICBjb25zdCBzdWdnZXN0aW9uTGlzdEVsID0gdGV4dEVkaXRvclZpZXcucXVlcnlTZWxlY3RvcignaHlwZXJjbGljay1zdWdnZXN0aW9uLWxpc3QnKTtcbiAgICAgICAgZXhwZWN0KHN1Z2dlc3Rpb25MaXN0RWwpLnRvRXhpc3QoKTtcblxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHRleHRFZGl0b3JWaWV3LCAnZWRpdG9yOm5ld2xpbmUnKTtcblxuICAgICAgICBleHBlY3QoY2FsbGJhY2tbMF0uY2FsbGJhY2suY2FsbENvdW50KS50b0JlKDEpO1xuICAgICAgICBleHBlY3QoY2FsbGJhY2tbMV0uY2FsbGJhY2suY2FsbENvdW50KS50b0JlKDApO1xuICAgICAgICBleHBlY3QodGV4dEVkaXRvclZpZXcucXVlcnlTZWxlY3RvcignaHlwZXJjbGljay1zdWdnZXN0aW9uLWxpc3QnKSkubm90LnRvRXhpc3QoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NvbmZpcm1zIHRoZSBzZWNvbmQgc3VnZ2VzdGlvbicsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRpdGxlOiAnY2FsbGJhY2sxJyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2sxJyksXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0aXRsZTogJ2NhbGxiYWNrMicsXG4gICAgICAgICAgICBjYWxsYmFjazogamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrMScpLFxuICAgICAgICAgIH0sXG4gICAgICAgIF07XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyID0ge1xuICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFja307XG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIpO1xuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDEpO1xuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZWRvd24nLCBwb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcblxuICAgICAgICBjb25zdCBzdWdnZXN0aW9uTGlzdEVsID0gdGV4dEVkaXRvclZpZXcucXVlcnlTZWxlY3RvcignaHlwZXJjbGljay1zdWdnZXN0aW9uLWxpc3QnKTtcbiAgICAgICAgZXhwZWN0KHN1Z2dlc3Rpb25MaXN0RWwpLnRvRXhpc3QoKTtcblxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHRleHRFZGl0b3JWaWV3LCAnY29yZTptb3ZlLWRvd24nKTtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh0ZXh0RWRpdG9yVmlldywgJ2VkaXRvcjpuZXdsaW5lJyk7XG5cbiAgICAgICAgZXhwZWN0KGNhbGxiYWNrWzBdLmNhbGxiYWNrLmNhbGxDb3VudCkudG9CZSgwKTtcbiAgICAgICAgZXhwZWN0KGNhbGxiYWNrWzFdLmNhbGxiYWNrLmNhbGxDb3VudCkudG9CZSgxKTtcbiAgICAgICAgZXhwZWN0KHRleHRFZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJ2h5cGVyY2xpY2stc3VnZ2VzdGlvbi1saXN0JykpLm5vdC50b0V4aXN0KCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdpcyBjYW5jZWxhYmxlJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGl0bGU6ICdjYWxsYmFjazEnLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjazEnKSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRpdGxlOiAnY2FsbGJhY2syJyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2sxJyksXG4gICAgICAgICAgfSxcbiAgICAgICAgXTtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSB7XG4gICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrfTtcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBoeXBlcmNsaWNrLmNvbnN1bWVQcm92aWRlcihwcm92aWRlcik7XG5cbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBuZXcgUG9pbnQoMCwgMSk7XG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZW1vdmUnLCBwb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgYXdhaXQgaHlwZXJjbGlja0ZvclRleHRFZGl0b3IuZ2V0U3VnZ2VzdGlvbkF0TW91c2UoKTtcbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlZG93bicsIHBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuXG4gICAgICAgIGNvbnN0IHN1Z2dlc3Rpb25MaXN0RWwgPSB0ZXh0RWRpdG9yVmlldy5xdWVyeVNlbGVjdG9yKCdoeXBlcmNsaWNrLXN1Z2dlc3Rpb24tbGlzdCcpO1xuICAgICAgICBleHBlY3Qoc3VnZ2VzdGlvbkxpc3RFbCkudG9FeGlzdCgpO1xuXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2godGV4dEVkaXRvclZpZXcsICdjb3JlOmNhbmNlbCcpO1xuXG4gICAgICAgIGV4cGVjdChjYWxsYmFja1swXS5jYWxsYmFjay5jYWxsQ291bnQpLnRvQmUoMCk7XG4gICAgICAgIGV4cGVjdChjYWxsYmFja1sxXS5jYWxsYmFjay5jYWxsQ291bnQpLnRvQmUoMCk7XG4gICAgICAgIGV4cGVjdCh0ZXh0RWRpdG9yVmlldy5xdWVyeVNlbGVjdG9yKCdoeXBlcmNsaWNrLXN1Z2dlc3Rpb24tbGlzdCcpKS5ub3QudG9FeGlzdCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aGVuIHRoZSBlZGl0b3IgaGFzIHNvZnQtd3JhcHBlZCBsaW5lcycsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHRleHRFZGl0b3Iuc2V0U29mdFdyYXBwZWQodHJ1ZSk7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2VkaXRvci5zb2Z0V3JhcEF0UHJlZmVycmVkTGluZUxlbmd0aCcsIHRydWUpO1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdlZGl0b3IucHJlZmVycmVkTGluZUxlbmd0aCcsIDYpOyAvLyBUaGlzIHdyYXBzIGVhY2ggd29yZCBvbnRvIGl0cyBvd24gbGluZS5cbiAgICB9KTtcblxuICAgIGl0KCdIeXBlcmNsaWNrIGNvcnJlY3RseSBkZXRlY3RzIHRoZSB3b3JkIGJlaW5nIG1vdXNlZCBvdmVyLicsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG5cbiAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSB7XG4gICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrfTtcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBzcHlPbihwcm92aWRlciwgJ2dldFN1Z2dlc3Rpb25Gb3JXb3JkJykuYW5kQ2FsbFRocm91Z2goKTtcbiAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIpO1xuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFBvaW50KDgsIDApO1xuICAgICAgICBjb25zdCBleHBlY3RlZFRleHQgPSAnd29yZDknO1xuICAgICAgICBjb25zdCBleHBlY3RlZEJ1ZmZlclJhbmdlID0gUmFuZ2UuZnJvbU9iamVjdChbWzIsIDEyXSwgWzIsIDE3XV0pO1xuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgIGV4cGVjdChwcm92aWRlci5nZXRTdWdnZXN0aW9uRm9yV29yZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgICB0ZXh0RWRpdG9yLFxuICAgICAgICAgICAgZXhwZWN0ZWRUZXh0LFxuICAgICAgICAgICAgZXhwZWN0ZWRCdWZmZXJSYW5nZSk7XG4gICAgICAgIGV4cGVjdChwcm92aWRlci5nZXRTdWdnZXN0aW9uRm9yV29yZC5jYWxsQ291bnQpLnRvQmUoMSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
//# sourceURL=/home/niv/.atom/packages/hyperclick/spec/Hyperclick-spec.js
