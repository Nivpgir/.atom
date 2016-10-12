(function() {
  var $, $$, BaseSelectListView, SelectListView, fuzzaldrinPlus, match, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), SelectListView = _ref.SelectListView, $ = _ref.$, $$ = _ref.$$;

  match = require('fuzzaldrin').match;

  fuzzaldrinPlus = require('fuzzaldrin-plus');

  module.exports = BaseSelectListView = (function(_super) {
    __extends(BaseSelectListView, _super);

    BaseSelectListView.prototype.model = null;

    BaseSelectListView.prototype.panel = null;

    BaseSelectListView.prototype.callback = null;

    BaseSelectListView.config = {
      useAlternateScoring: {
        type: 'boolean',
        "default": true,
        description: 'Use an alternative scoring approach which prefers run of consecutive characters, acronyms and start of words. (Experimental)'
      }
    };

    BaseSelectListView.activate = function() {};

    BaseSelectListView.deactivate = function() {
      var _ref1;
      return (_ref1 = this.scoreSubscription) != null ? _ref1.dispose() : void 0;
    };

    function BaseSelectListView(state, model) {
      this.model = model;
      BaseSelectListView.__super__.constructor.call(this, state);
    }

    BaseSelectListView.prototype.initialize = function(listOfItems) {
      this.listOfItems = listOfItems;
      BaseSelectListView.__super__.initialize.apply(this, arguments);
      this.alternateScoring = atom.config.get('atom-keyboard-macros.useAlternateScoring');
      this.scoreSubscription = atom.config.onDidChange('atom-keyboard-macros.useAlternateScoring', (function(_this) {
        return function(_arg) {
          var newValue;
          newValue = _arg.newValue;
          return _this.alternateScoring = newValue;
        };
      })(this));
      this.addClass('atom-keyboard-macros');
      return this.setItems(this.listOfItems);
    };

    BaseSelectListView.prototype.show = function() {
      var items;
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.storeFocusedElement();
      if (this.previouslyFocusedElement[0] && this.previouslyFocusedElement[0] !== document.body) {
        this.eventElement = this.previouslyFocusedElement[0];
      } else {
        this.eventElement = atom.views.getView(atom.workspace);
      }
      items = this.model.getListOfItems();
      this.setItems(items);
      return this.focusFilterEditor();
    };

    BaseSelectListView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    BaseSelectListView.prototype.addItem = function(item) {
      this.model.addItem(item);
      return this.setItems(this.model.getListOfItems());
    };

    BaseSelectListView.prototype.clearText = function() {
      return this.filterEditorView.setText('');
    };

    BaseSelectListView.prototype.setCallback = function(callback) {
      return this.callback = callback;
    };

    BaseSelectListView.prototype.focus = function() {
      return this.focusFilterEditor();
    };

    BaseSelectListView.prototype.getElement = function() {
      return this.element;
    };

    BaseSelectListView.prototype.cancel = function() {
      this.clearText();
      return this.hide();
    };

    BaseSelectListView.prototype.confirmed = function(obj) {
      var filterKey, name;
      filterKey = this.getFilterKey();
      name = obj[filterKey];
      this.clearText();
      this.hide();
      return typeof this.callback === "function" ? this.callback(name) : void 0;
    };

    BaseSelectListView.prototype.getFilterKey = function() {
      return this.model.getFilterKey();
    };

    BaseSelectListView.prototype.viewForItem = function(obj) {
      var filterKey, name;
      filterKey = this.getFilterKey();
      name = obj[filterKey];
      if (this.model.viewForItem) {
        return this.model.viewForItem(name);
      } else {
        return this.altViewForItem(name);
      }
    };

    BaseSelectListView.prototype.altViewForItem = function(name) {
      var filterQuery, matches;
      filterQuery = this.getFilterQuery();
      if (this.alternateScoring) {
        matches = fuzzaldrinPlus.match(name, filterQuery);
      } else {
        matches = match(name, filterQuery);
      }
      matches = match(name, filterQuery);
      return $$(function() {
        var highlighter;
        highlighter = (function(_this) {
          return function(command, matches, offsetIndex) {
            var lastIndex, matchIndex, matchedChars, unmatched, _i, _len;
            lastIndex = 0;
            matchedChars = [];
            for (_i = 0, _len = matches.length; _i < _len; _i++) {
              matchIndex = matches[_i];
              matchIndex -= offsetIndex;
              if (matchIndex < 0) {
                continue;
              }
              unmatched = command.substring(lastIndex, matchIndex);
              if (unmatched) {
                if (matchedChars.length) {
                  _this.span(matchedChars.join(''), {
                    "class": 'character-match'
                  });
                }
                matchedChars = [];
                _this.text(unmatched);
              }
              matchedChars.push(command[matchIndex]);
              lastIndex = matchIndex + 1;
            }
            if (matchedChars.length) {
              _this.span(matchedChars.join(''), {
                "class": 'character-match'
              });
            }
            return _this.text(command.substring(lastIndex));
          };
        })(this);
        return this.li({
          "class": 'event',
          'data-event-name': name
        }, (function(_this) {
          return function() {
            return _this.span({
              title: name
            }, function() {
              return highlighter(name, matches, 0);
            });
          };
        })(this));
      });
    };

    BaseSelectListView.prototype.populateList = function() {
      if (this.model.populateList) {
        return this.model.populateList();
      }
      if (this.alternateScoring) {
        return this.populateAlternateList();
      } else {
        return BaseSelectListView.__super__.populateList.apply(this, arguments);
      }
    };

    BaseSelectListView.prototype.populateAlternateList = function() {
      var filterQuery, filteredItems, i, item, itemView, _i, _ref1;
      if (this.items == null) {
        return;
      }
      filterQuery = this.getFilterQuery();
      if (filterQuery.length) {
        filteredItems = fuzzaldrinPlus.filter(this.items, filterQuery, {
          key: 'name'
        });
      } else {
        filteredItems = this.items;
      }
      this.list.empty();
      if (filteredItems.length) {
        this.setError(null);
        for (i = _i = 0, _ref1 = Math.min(filteredItems.length, this.maxItems); 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          item = filteredItems[i];
          itemView = $(this.viewForItem(item));
          itemView.data('select-list-item', item);
          this.list.append(itemView);
        }
        return this.selectItemView(this.list.find('li:first'));
      } else {
        return this.setError(this.getEmptyMessage(this.items.length, filteredItems.length));
      }
    };

    return BaseSelectListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYXRvbS1rZXlib2FyZC1tYWNyb3MvbGliL2Jhc2Utc2VsZWN0LWxpc3Qtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0VBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQTBCLE9BQUEsQ0FBUSxzQkFBUixDQUExQixFQUFDLHNCQUFBLGNBQUQsRUFBaUIsU0FBQSxDQUFqQixFQUFvQixVQUFBLEVBQXBCLENBQUE7O0FBQUEsRUFDQyxRQUFTLE9BQUEsQ0FBUSxZQUFSLEVBQVQsS0FERCxDQUFBOztBQUFBLEVBRUEsY0FBQSxHQUFpQixPQUFBLENBQVEsaUJBQVIsQ0FGakIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSix5Q0FBQSxDQUFBOztBQUFBLGlDQUFBLEtBQUEsR0FBTyxJQUFQLENBQUE7O0FBQUEsaUNBQ0EsS0FBQSxHQUFPLElBRFAsQ0FBQTs7QUFBQSxpQ0FFQSxRQUFBLEdBQVUsSUFGVixDQUFBOztBQUFBLElBSUEsa0JBQUMsQ0FBQSxNQUFELEdBQ0U7QUFBQSxNQUFBLG1CQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLDhIQUZiO09BREY7S0FMRixDQUFBOztBQUFBLElBVUEsa0JBQUMsQ0FBQSxRQUFELEdBQVcsU0FBQSxHQUFBLENBVlgsQ0FBQTs7QUFBQSxJQVlBLGtCQUFDLENBQUEsVUFBRCxHQUFhLFNBQUEsR0FBQTtBQUNYLFVBQUEsS0FBQTs2REFBa0IsQ0FBRSxPQUFwQixDQUFBLFdBRFc7SUFBQSxDQVpiLENBQUE7O0FBZWEsSUFBQSw0QkFBQyxLQUFELEVBQVMsS0FBVCxHQUFBO0FBQ1gs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

//# sourceURL=/C:/Users/MNP/.atom/packages/atom-keyboard-macros/lib/base-select-list-view.coffee
