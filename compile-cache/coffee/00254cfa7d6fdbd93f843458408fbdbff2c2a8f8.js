(function() {
  module.exports = {
    ignoreWhitespace: {
      title: 'Ignore Whitespace',
      description: 'Will not diff whitespace when this box is checked.',
      type: 'boolean',
      "default": false
    },
    diffWords: {
      title: 'Show Word Diff',
      description: 'Diffs the words between each line when this box is checked.',
      type: 'boolean',
      "default": true
    },
    syncHorizontalScroll: {
      title: 'Sync Horizontal Scroll',
      description: 'Syncs the horizontal scrolling of the editors.',
      type: 'boolean',
      "default": false
    },
    leftEditorColor: {
      title: 'Left Editor Color',
      description: 'Specifies the highlight color for the left editor.',
      type: 'string',
      "default": 'green',
      "enum": ['green', 'red']
    },
    rightEditorColor: {
      title: 'Right Editor Color',
      description: 'Specifies the highlight color for the right editor.',
      type: 'string',
      "default": 'red',
      "enum": ['green', 'red']
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL3NwbGl0LWRpZmYvbGliL2NvbmZpZy1zY2hlbWEuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLGdCQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxtQkFBUDtBQUFBLE1BQ0EsV0FBQSxFQUFhLG9EQURiO0FBQUEsTUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLE1BR0EsU0FBQSxFQUFTLEtBSFQ7S0FERjtBQUFBLElBS0EsU0FBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sZ0JBQVA7QUFBQSxNQUNBLFdBQUEsRUFBYSw2REFEYjtBQUFBLE1BRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxNQUdBLFNBQUEsRUFBUyxJQUhUO0tBTkY7QUFBQSxJQVVBLG9CQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyx3QkFBUDtBQUFBLE1BQ0EsV0FBQSxFQUFhLGdEQURiO0FBQUEsTUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLE1BR0EsU0FBQSxFQUFTLEtBSFQ7S0FYRjtBQUFBLElBZUEsZUFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sbUJBQVA7QUFBQSxNQUNBLFdBQUEsRUFBYSxvREFEYjtBQUFBLE1BRUEsSUFBQSxFQUFNLFFBRk47QUFBQSxNQUdBLFNBQUEsRUFBUyxPQUhUO0FBQUEsTUFJQSxNQUFBLEVBQU0sQ0FBQyxPQUFELEVBQVUsS0FBVixDQUpOO0tBaEJGO0FBQUEsSUFxQkEsZ0JBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLG9CQUFQO0FBQUEsTUFDQSxXQUFBLEVBQWEscURBRGI7QUFBQSxNQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsTUFHQSxTQUFBLEVBQVMsS0FIVDtBQUFBLE1BSUEsTUFBQSxFQUFNLENBQUMsT0FBRCxFQUFVLEtBQVYsQ0FKTjtLQXRCRjtHQURGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/C:/Users/nivp/.atom/packages/split-diff/lib/config-schema.coffee
