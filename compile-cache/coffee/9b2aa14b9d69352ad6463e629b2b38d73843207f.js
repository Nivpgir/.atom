(function() {
  module.exports = {
    diffWords: {
      title: 'Show Word Diff',
      description: 'Diffs the words between each line when this box is checked.',
      type: 'boolean',
      "default": true,
      order: 1
    },
    ignoreWhitespace: {
      title: 'Ignore Whitespace',
      description: 'Will not diff whitespace when this box is checked.',
      type: 'boolean',
      "default": false,
      order: 2
    },
    muteNotifications: {
      title: 'Mute Notifications',
      description: 'Mutes all warning notifications when this box is checked.',
      type: 'boolean',
      "default": false,
      order: 3
    },
    scrollSyncType: {
      title: 'Sync Scrolling',
      description: 'Syncs the scrolling of the editors.',
      type: 'string',
      "default": 'Vertical + Horizontal',
      "enum": ['Vertical + Horizontal', 'Vertical', 'None'],
      order: 4
    },
    leftEditorColor: {
      title: 'Left Editor Color',
      description: 'Specifies the highlight color for the left editor.',
      type: 'string',
      "default": 'green',
      "enum": ['green', 'red'],
      order: 5
    },
    rightEditorColor: {
      title: 'Right Editor Color',
      description: 'Specifies the highlight color for the right editor.',
      type: 'string',
      "default": 'red',
      "enum": ['green', 'red'],
      order: 6
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9uaXZwLy5hdG9tL3BhY2thZ2VzL3NwbGl0LWRpZmYvbGliL2NvbmZpZy1zY2hlbWEuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFNBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLGdCQUFQO0FBQUEsTUFDQSxXQUFBLEVBQWEsNkRBRGI7QUFBQSxNQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsTUFHQSxTQUFBLEVBQVMsSUFIVDtBQUFBLE1BSUEsS0FBQSxFQUFPLENBSlA7S0FERjtBQUFBLElBTUEsZ0JBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLG1CQUFQO0FBQUEsTUFDQSxXQUFBLEVBQWEsb0RBRGI7QUFBQSxNQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsTUFHQSxTQUFBLEVBQVMsS0FIVDtBQUFBLE1BSUEsS0FBQSxFQUFPLENBSlA7S0FQRjtBQUFBLElBWUEsaUJBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLG9CQUFQO0FBQUEsTUFDQSxXQUFBLEVBQWEsMkRBRGI7QUFBQSxNQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsTUFHQSxTQUFBLEVBQVMsS0FIVDtBQUFBLE1BSUEsS0FBQSxFQUFPLENBSlA7S0FiRjtBQUFBLElBa0JBLGNBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLGdCQUFQO0FBQUEsTUFDQSxXQUFBLEVBQWEscUNBRGI7QUFBQSxNQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsTUFHQSxTQUFBLEVBQVMsdUJBSFQ7QUFBQSxNQUlBLE1BQUEsRUFBTSxDQUFDLHVCQUFELEVBQTBCLFVBQTFCLEVBQXNDLE1BQXRDLENBSk47QUFBQSxNQUtBLEtBQUEsRUFBTyxDQUxQO0tBbkJGO0FBQUEsSUF5QkEsZUFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sbUJBQVA7QUFBQSxNQUNBLFdBQUEsRUFBYSxvREFEYjtBQUFBLE1BRUEsSUFBQSxFQUFNLFFBRk47QUFBQSxNQUdBLFNBQUEsRUFBUyxPQUhUO0FBQUEsTUFJQSxNQUFBLEVBQU0sQ0FBQyxPQUFELEVBQVUsS0FBVixDQUpOO0FBQUEsTUFLQSxLQUFBLEVBQU8sQ0FMUDtLQTFCRjtBQUFBLElBZ0NBLGdCQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxvQkFBUDtBQUFBLE1BQ0EsV0FBQSxFQUFhLHFEQURiO0FBQUEsTUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLE1BR0EsU0FBQSxFQUFTLEtBSFQ7QUFBQSxNQUlBLE1BQUEsRUFBTSxDQUFDLE9BQUQsRUFBVSxLQUFWLENBSk47QUFBQSxNQUtBLEtBQUEsRUFBTyxDQUxQO0tBakNGO0dBREYsQ0FBQTtBQUFBIgp9

//# sourceURL=/C:/Users/nivp/.atom/packages/split-diff/lib/config-schema.coffee
