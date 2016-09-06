(function() {
  var clangSourceScopeDictionary;

  clangSourceScopeDictionary = {
    'source.cpp': 'c++',
    'source.c': 'c',
    'source.objc': 'objective-c',
    'source.objcpp': 'objective-c++',
    'source.c++': 'c++',
    'source.objc++': 'objective-c++'
  };

  module.exports = {
    getFirstCursorSourceScopeLang: function(editor) {
      var scopes;
      scopes = this.getFirstCursorScopes(editor);
      return this.getSourceScopeLang(scopes);
    },
    getFirstCursorScopes: function(editor) {
      var firstPosition, scopeDescriptor, scopes;
      if (editor.getCursors) {
        firstPosition = editor.getCursors()[0].getBufferPosition();
        scopeDescriptor = editor.scopeDescriptorForBufferPosition(firstPosition);
        return scopes = scopeDescriptor.getScopesArray();
      } else {
        return scopes = [];
      }
    },
    getSourceScopeLang: function(scopes, scopeDictionary) {
      var lang, scope, _i, _len;
      if (scopeDictionary == null) {
        scopeDictionary = clangSourceScopeDictionary;
      }
      lang = null;
      for (_i = 0, _len = scopes.length; _i < _len; _i++) {
        scope = scopes[_i];
        if (scope in scopeDictionary) {
          return scopeDictionary[scope];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbml2Ly5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1jbGFuZy9saWIvdXRpbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMEJBQUE7O0FBQUEsRUFBQSwwQkFBQSxHQUE2QjtBQUFBLElBQzNCLFlBQUEsRUFBa0IsS0FEUztBQUFBLElBRTNCLFVBQUEsRUFBa0IsR0FGUztBQUFBLElBRzNCLGFBQUEsRUFBa0IsYUFIUztBQUFBLElBSTNCLGVBQUEsRUFBa0IsZUFKUztBQUFBLElBTzNCLFlBQUEsRUFBa0IsS0FQUztBQUFBLElBUTNCLGVBQUEsRUFBa0IsZUFSUztHQUE3QixDQUFBOztBQUFBLEVBV0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsNkJBQUEsRUFBK0IsU0FBQyxNQUFELEdBQUE7QUFDN0IsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLG9CQUFELENBQXNCLE1BQXRCLENBQVQsQ0FBQTtBQUNBLGFBQU8sSUFBQyxDQUFBLGtCQUFELENBQW9CLE1BQXBCLENBQVAsQ0FGNkI7SUFBQSxDQUEvQjtBQUFBLElBSUEsb0JBQUEsRUFBc0IsU0FBQyxNQUFELEdBQUE7QUFDcEIsVUFBQSxzQ0FBQTtBQUFBLE1BQUEsSUFBRyxNQUFNLENBQUMsVUFBVjtBQUNFLFFBQUEsYUFBQSxHQUFnQixNQUFNLENBQUMsVUFBUCxDQUFBLENBQW9CLENBQUEsQ0FBQSxDQUFFLENBQUMsaUJBQXZCLENBQUEsQ0FBaEIsQ0FBQTtBQUFBLFFBQ0EsZUFBQSxHQUFrQixNQUFNLENBQUMsZ0NBQVAsQ0FBd0MsYUFBeEMsQ0FEbEIsQ0FBQTtlQUVBLE1BQUEsR0FBUyxlQUFlLENBQUMsY0FBaEIsQ0FBQSxFQUhYO09BQUEsTUFBQTtlQUtFLE1BQUEsR0FBUyxHQUxYO09BRG9CO0lBQUEsQ0FKdEI7QUFBQSxJQVlBLGtCQUFBLEVBQW9CLFNBQUMsTUFBRCxFQUFTLGVBQVQsR0FBQTtBQUNsQixVQUFBLHFCQUFBOztRQUQyQixrQkFBZ0I7T0FDM0M7QUFBQSxNQUFBLElBQUEsR0FBTyxJQUFQLENBQUE7QUFDQSxXQUFBLDZDQUFBOzJCQUFBO0FBQ0UsUUFBQSxJQUFHLEtBQUEsSUFBUyxlQUFaO0FBQ0UsaUJBQU8sZUFBZ0IsQ0FBQSxLQUFBLENBQXZCLENBREY7U0FERjtBQUFBLE9BRmtCO0lBQUEsQ0FacEI7R0FaRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/niv/.atom/packages/autocomplete-clang/lib/util.coffee
